import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
import shutil

import pytest
from playwright.sync_api import Page, sync_playwright


DEFAULT_BASE_URL = os.environ.get("BASE_URL", "http://127.0.0.1:5173/")


def _wait_for_http_ok(url: str, timeout_seconds: float = 30.0) -> None:
    start = time.time()
    last_error: Exception | None = None
    while time.time() - start < timeout_seconds:
        try:
            with urllib.request.urlopen(url) as response:
                if 200 <= response.status < 500:
                    return
        except (urllib.error.URLError, ConnectionError) as error:
            last_error = error
        time.sleep(0.2)

    raise RuntimeError(f"Timed out waiting for dev server at {url}: {last_error}")


@pytest.fixture(scope="session")
def base_url() -> str:
    """Returns the dev server URL.

    If BASE_URL is set, assumes the server is already running.
    Otherwise, starts `npm run dev` on 127.0.0.1:5173 for the test session.
    """
    if os.environ.get("BASE_URL"):
        _wait_for_http_ok(DEFAULT_BASE_URL)
        return DEFAULT_BASE_URL

    npm_exe = shutil.which("npm") or shutil.which("npm.cmd")
    if not npm_exe:
        raise RuntimeError(
            "Could not find 'npm' on PATH while running pytest. "
            "Fix by installing Node.js (which includes npm) or run tests with BASE_URL set to an already-running Vite server."
        )

    command = [
        npm_exe,
        "run",
        "dev",
        "--",
        "--host",
        "127.0.0.1",
        "--port",
        "5173",
    ]

    process = subprocess.Popen(
        command,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        cwd=os.path.abspath(os.path.join(os.path.dirname(__file__), "..")),
        creationflags=(subprocess.CREATE_NEW_PROCESS_GROUP if sys.platform.startswith("win") else 0),
    )
    try:
        _wait_for_http_ok(DEFAULT_BASE_URL)
        yield DEFAULT_BASE_URL
    finally:
        process.terminate()
        try:
            process.wait(timeout=10)
        except subprocess.TimeoutExpired:
            process.kill()


@pytest.fixture
def page(base_url: str) -> Page:
    headed = os.environ.get("HEADED", "").strip().lower() in {"1", "true", "yes"}
    headless = not headed
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless)
        page = browser.new_page()
        page.goto(base_url)
        yield page
        browser.close()


def _click(page: Page, button_text: str) -> None:
    page.get_by_role("button", name=button_text, exact=True).click()


def _display_text(page: Page) -> str:
    return page.locator(".display").inner_text().strip()


def test_initial_ui_renders(page: Page) -> None:
    assert page.get_by_role("heading", name="History").is_visible()
    assert page.get_by_text("No calculations yet.").is_visible()
    assert _display_text(page) == "0"

    # Ensure key buttons exist
    for label in ["A", "B", "C", "D", "E", "F", "+", "−", "×", "÷", "=", "?", "AC", "CE"]:
        assert page.get_by_role("button", name=label, exact=True).is_visible()


def test_addition_updates_display_and_history(page: Page) -> None:
    _click(page, "AC")
    _click(page, "1")
    _click(page, "A")
    _click(page, "+")
    _click(page, "2")
    _click(page, "F")
    _click(page, "=")

    assert _display_text(page) == "49"
    assert page.locator(".history-content li").first.inner_text().strip() == "1A + 2F = 49"


def test_ce_deletes_last_digit(page: Page) -> None:
    _click(page, "AC")
    _click(page, "A")
    _click(page, "B")
    assert _display_text(page) == "AB"

    _click(page, "CE")
    assert _display_text(page) == "A"

    _click(page, "CE")
    assert _display_text(page) == "0"


def test_history_keeps_only_last_five_entries(page: Page) -> None:
    # Create 6 calculations; history should keep only the last 5.
    _click(page, "AC")
    for i in range(6):
        _click(page, "AC")
        _click(page, "1")
        _click(page, "+")
        _click(page, "1")
        _click(page, "=")

    items = page.locator(".history-content li")
    assert items.count() == 5
    # Latest result should be at the top.
    assert items.first.inner_text().strip().endswith("= 2")


def test_3d_styles_applied(page: Page) -> None:
    # Basic assertions that 3D styling is present (non-none box-shadow).
    history_shadow = page.locator(".history-panel").evaluate("el => getComputedStyle(el).boxShadow")
    help_shadow = page.locator(".help-button").evaluate("el => getComputedStyle(el).boxShadow")
    equals_shadow = page.locator(".btn-equals").evaluate("el => getComputedStyle(el).boxShadow")

    assert history_shadow and history_shadow != "none"
    assert help_shadow and help_shadow != "none"
    assert equals_shadow and equals_shadow != "none"