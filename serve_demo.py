#!/usr/bin/env python3
"""Local demo server for the Coleman VR investor prototype."""

from __future__ import annotations

import argparse
import contextlib
import os
import socket
import sys
import threading
import webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
DEFAULT_PORT = 4173


class DemoRequestHandler(SimpleHTTPRequestHandler):
    """Serve static files with no-cache headers so refresh shows local edits."""

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt: str, *args: object) -> None:
        message = fmt % args
        print(f"[request] {message}")


def find_open_port(preferred: int) -> int:
    with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        if sock.connect_ex(("127.0.0.1", preferred)) != 0:
            return preferred

    with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


def guess_local_ip() -> str:
    with contextlib.closing(socket.socket(socket.AF_INET, socket.SOCK_DGRAM)) as sock:
        try:
            sock.connect(("8.8.8.8", 80))
            ip = sock.getsockname()[0]
            if ip and not ip.startswith("127."):
                return ip
        except OSError:
            pass

    hostname = socket.gethostname()
    with contextlib.suppress(OSError):
        for info in socket.getaddrinfo(hostname, None, family=socket.AF_INET):
            ip = info[4][0]
            if ip and not ip.startswith("127."):
                return ip

    return "127.0.0.1"


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run the Coleman VR investor prototype locally.")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="Port to bind.")
    parser.add_argument(
        "--host",
        default="0.0.0.0",
        help="Host/interface to bind. Use 127.0.0.1 for computer-only access.",
    )
    parser.add_argument(
        "--no-open",
        action="store_true",
        help="Do not open the browser automatically.",
    )
    return parser


def print_banner(local_url: str, phone_url: str, root: Path) -> None:
    print()
    print("Coleman VR investor demo is live.")
    print(f"Folder: {root}")
    print(f"Browser URL: {local_url}")
    print(f"Phone URL:   {phone_url}")
    print()
    print("How to use it:")
    print("- Open the Browser URL on this Mac.")
    print("- Open the Phone URL on any iPhone on the same Wi-Fi.")
    print("- After editing files, refresh the page. No rebuild is needed.")
    print("- Press Control+C here when you want to stop the demo server.")
    print()


def main() -> int:
    os.chdir(ROOT)
    args = build_parser().parse_args()
    port = find_open_port(args.port)
    if port != args.port:
        print(f"Port {args.port} was busy, using {port} instead.")

    handler = partial(DemoRequestHandler, directory=str(ROOT))
    server = ThreadingHTTPServer((args.host, port), handler)
    local_ip = guess_local_ip()
    local_url = f"http://localhost:{port}"
    phone_url = f"http://{local_ip}:{port}"

    if not args.no_open:
        threading.Timer(0.4, lambda: webbrowser.open(local_url)).start()

    print_banner(local_url, phone_url, ROOT)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Coleman VR demo server.")
    finally:
        server.server_close()

    return 0


if __name__ == "__main__":
    sys.exit(main())
