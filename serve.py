#!/usr/bin/env python3
"""
Simple HTTP server with proper UTF-8 encoding for markdown files
"""
import http.server
import socketserver
import mimetypes

class UTF8HTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Set UTF-8 encoding for markdown and text files
        if self.path.endswith('.md'):
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
        elif self.path.endswith('.txt'):
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
        http.server.SimpleHTTPRequestHandler.end_headers(self)

PORT = 8080

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), UTF8HTTPRequestHandler) as httpd:
    print(f"✓ Server running at http://localhost:{PORT}/")
    print("  Press Ctrl+C to stop")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n✓ Server stopped")
