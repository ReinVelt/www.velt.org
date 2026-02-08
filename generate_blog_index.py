#!/usr/bin/env python3
"""
Generate blog/index.html by scanning blog/*.html posts.
"""

from __future__ import annotations

import html
import re
from datetime import datetime
from pathlib import Path

from bs4 import BeautifulSoup

BLOG_DIR = Path("blog")
OUTPUT_FILE = BLOG_DIR / "index.html"
EXCLUDE_FILES = {"index.html"}

MONTHS_NL = [
    "jan", "feb", "mrt", "apr", "mei", "jun",
    "jul", "aug", "sep", "okt", "nov", "dec",
]


def parse_date_from_filename(filename: str) -> str | None:
    match = re.match(r"(\d{4}-\d{2}-\d{2})", filename)
    return match.group(1) if match else None


def format_date_nl(date_str: str | None) -> str:
    if not date_str:
        return ""
    try:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return ""
    return f"{dt.day:02d} {MONTHS_NL[dt.month - 1]} {dt.year}"


def clean_text(text: str) -> str:
    return " ".join(text.split())


def extract_title(soup: BeautifulSoup) -> str:
    title_tag = soup.find("h1")
    if title_tag and title_tag.get_text(strip=True):
        return clean_text(title_tag.get_text(strip=True))

    intro_title = soup.select_one(".intro-title")
    if intro_title and intro_title.get_text(strip=True):
        return clean_text(intro_title.get_text(strip=True))

    doc_title = soup.find("title")
    if doc_title and doc_title.get_text(strip=True):
        return clean_text(doc_title.get_text(strip=True))

    return "Untitled"


def extract_teaser(soup: BeautifulSoup) -> str:
    for paragraph in soup.find_all("p"):
        if paragraph.get("class") in (["date"], ["image-caption"]):
            continue
        if paragraph.find_parent("figcaption"):
            continue
        text = clean_text(paragraph.get_text(" ", strip=True))
        if len(text) < 80:
            continue
        return text
    return ""


def trim_teaser(text: str, limit: int = 200) -> str:
    if len(text) <= limit:
        return text
    truncated = text[:limit].rsplit(" ", 1)[0]
    return f"{truncated}..."


def extract_image(soup: BeautifulSoup) -> str:
    first_img = soup.find("img")
    if first_img and first_img.get("src"):
        return first_img["src"]
    return ""


def infer_badge(title: str) -> str:
    lower = title.lower()
    if "vic" in lower:
        return "VIC-20"
    if "linux" in lower or "bauxiet" in lower or "bits" in lower:
        return "Linux"
    if "robot" in lower or "villa" in lower or "mechanische" in lower:
        return "Hackerspace"
    if "begin" in lower:
        return "Manifest"
    return "Log"


def extract_post_data(path: Path) -> dict:
    soup = BeautifulSoup(path.read_text(encoding="utf-8"), "html.parser")
    title = extract_title(soup)
    teaser = trim_teaser(extract_teaser(soup))
    image = extract_image(soup)
    date_str = parse_date_from_filename(path.name)
    return {
        "href": path.name,
        "title": title,
        "date": format_date_nl(date_str),
        "badge": infer_badge(title),
        "teaser": teaser,
        "image": image,
        "sort_date": date_str or "1900-01-01",
    }


def build_cards(posts: list[dict]) -> str:
    cards = []
    for post in posts:
        title = html.escape(post["title"])
        teaser = html.escape(post["teaser"])
        date = html.escape(post["date"])
        badge = html.escape(post["badge"])
        href = html.escape(post["href"])

        if post["image"]:
            image = html.escape(post["image"])
            thumb_html = (
                f"<div class=\"thumb\">\n"
                f"    <img src=\"{image}\" alt=\"{title}\">\n"
                f"</div>"
            )
        else:
            thumb_html = "<div class=\"thumb placeholder\" aria-hidden=\"true\">Signal lost</div>"

        cards.append(
            f"""        <a class=\"card\" href=\"{href}\">
{thumb_html}
            <div class=\"meta\">
                <span>{date}</span>
                <span class=\"badge\">{badge}</span>
            </div>
            <div class=\"title\">{title}</div>
            <p class=\"teaser\">{teaser}</p>
        </a>"""
        )
    return "\n\n".join(cards)


def build_html(posts: list[dict]) -> str:
    cards_html = build_cards(posts)

    return f"""<!DOCTYPE html>
<html lang=\"nl\">
<head>
<meta charset=\"UTF-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
<title>Blog Index - Rein Velt</title>
<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">
<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>
<link href=\"https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap\" rel=\"stylesheet\">
<style>
    :root {{
        --ink: #0b0f16;
        --night: #0e1b1f;
        --fog: #f3f2ec;
        --glow: #22d3ee;
        --ember: #ffb000;
        --acid: #a3e635;
        --steel: #94a3b8;
        --card: rgba(15, 23, 42, 0.78);
        --card-border: rgba(148, 163, 184, 0.35);
        --shadow: 0 24px 60px rgba(2, 6, 23, 0.55);
        --grid-gap: clamp(1rem, 3vw, 1.75rem);
    }}

    * {{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }}

    body {{
        font-family: "Space Grotesk", "IBM Plex Mono", "Courier New", monospace;
        color: var(--fog);
        background:
            radial-gradient(1200px 800px at 15% 10%, rgba(34, 211, 238, 0.25), transparent 60%),
            radial-gradient(1200px 800px at 90% 0%, rgba(255, 176, 0, 0.22), transparent 60%),
            linear-gradient(120deg, #0a0f14 0%, #0c1820 45%, #111827 100%);
        min-height: 100vh;
        padding: clamp(1.2rem, 3vw, 2.5rem);
        overflow-x: hidden;
    }}

    body::before {{
        content: "";
        position: fixed;
        inset: 0;
        background-image:
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
        background-size: 28px 28px;
        mix-blend-mode: screen;
        opacity: 0.35;
        pointer-events: none;
        z-index: 0;
    }}

    body::after {{
        content: "";
        position: fixed;
        inset: -20% -20% auto -20%;
        height: 60%;
        background: radial-gradient(circle at 50% 50%, rgba(163, 230, 53, 0.25), transparent 70%);
        opacity: 0.2;
        pointer-events: none;
        z-index: 0;
    }}

    .shell {{
        position: relative;
        z-index: 1;
        max-width: 1100px;
        margin: 0 auto;
    }}

    .hero {{
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: clamp(1.5rem, 4vw, 2.8rem);
        background: linear-gradient(140deg, rgba(10, 20, 28, 0.9), rgba(15, 23, 42, 0.7));
        box-shadow: var(--shadow);
        border-radius: 18px;
        display: grid;
        gap: 1rem;
        margin-bottom: clamp(2rem, 4vw, 3rem);
        animation: rise 0.8s ease-out both;
    }}

    .hero .kicker {{
        font-family: "IBM Plex Mono", "Courier New", monospace;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 0.75rem;
        color: var(--acid);
    }}

    .hero h1 {{
        font-size: clamp(2rem, 5vw, 3.4rem);
        line-height: 1.05;
        color: var(--fog);
    }}

    .hero p {{
        color: var(--steel);
        font-size: clamp(1rem, 2vw, 1.15rem);
        max-width: 65ch;
    }}

    .grid {{
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: var(--grid-gap);
    }}

    .card {{
        position: relative;
        display: grid;
        gap: 1rem;
        padding: 1.1rem;
        border-radius: 16px;
        background: var(--card);
        border: 1px solid var(--card-border);
        box-shadow: 0 14px 40px rgba(2, 8, 23, 0.4);
        text-decoration: none;
        color: inherit;
        overflow: hidden;
        transform: translateY(10px);
        opacity: 0;
        animation: float-in 0.7s ease forwards;
    }}

    .card:nth-child(2) {{ animation-delay: 0.08s; }}
    .card:nth-child(3) {{ animation-delay: 0.16s; }}
    .card:nth-child(4) {{ animation-delay: 0.24s; }}

    .thumb {{
        position: relative;
        width: 100%;
        aspect-ratio: 16 / 10;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid rgba(148, 163, 184, 0.35);
        background: #0f172a;
    }}

    .thumb img {{
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        filter: saturate(1.05);
        transition: transform 0.4s ease;
    }}

    .thumb.placeholder {{
        background:
            linear-gradient(135deg, rgba(34, 211, 238, 0.3), transparent 60%),
            linear-gradient(180deg, rgba(255, 176, 0, 0.22), transparent 55%),
            repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.08) 0 1px, transparent 1px 10px);
        display: grid;
        place-items: center;
        color: rgba(243, 242, 236, 0.7);
        font-family: "IBM Plex Mono", "Courier New", monospace;
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
    }}

    .card:hover .thumb img {{
        transform: scale(1.03);
    }}

    .meta {{
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: "IBM Plex Mono", "Courier New", monospace;
        font-size: 0.75rem;
        color: var(--acid);
        text-transform: uppercase;
        letter-spacing: 0.18em;
    }}

    .title {{
        font-size: 1.1rem;
        font-weight: 700;
        line-height: 1.25;
    }}

    .teaser {{
        color: var(--steel);
        font-size: 0.95rem;
        line-height: 1.5;
    }}

    .badge {{
        font-family: "IBM Plex Mono", "Courier New", monospace;
        font-size: 0.7rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--ember);
        border: 1px solid rgba(255, 176, 0, 0.4);
        padding: 0.25rem 0.5rem;
        border-radius: 999px;
        background: rgba(255, 176, 0, 0.12);
    }}

    .footer {{
        margin-top: clamp(2rem, 4vw, 3rem);
        color: rgba(148, 163, 184, 0.8);
        font-size: 0.9rem;
        font-family: "IBM Plex Mono", "Courier New", monospace;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.5rem;
    }}

    .footer a {{
        color: var(--glow);
        text-decoration: none;
    }}

    @keyframes rise {{
        from {{ transform: translateY(12px); opacity: 0; }}
        to {{ transform: translateY(0); opacity: 1; }}
    }}

    @keyframes float-in {{
        to {{ transform: translateY(0); opacity: 1; }}
    }}

    @media (max-width: 720px) {{
        .hero {{
            padding: 1.5rem;
        }}

        .footer {{
            flex-direction: column;
        }}
    }}
</style>
</head>
<body>
<div class=\"shell\">
    <header class=\"hero\">
        <span class=\"kicker\">Velthack logbook</span>
        <h1>Blog Index // verhalen met soldeer op de vingers</h1>
        <p>Een catalogus van herinneringen, storingen en stille upgrades. Proza dat vonkt, logs die ruiken naar regen en ozon. Creative writer energy met hacker pols.</p>
    </header>

    <main class=\"grid\">
{cards_html}
    </main>

    <footer class=\"footer\">
        <span>Index powered by hand-rolled HTML. No trackers. No noise.</span>
        <a href=\"../sitemap.html\">Terug naar sitemap</a>
    </footer>
</div>
</body>
</html>
"""


def generate_index() -> None:
    posts = []
    for path in BLOG_DIR.glob("*.html"):
        if path.name in EXCLUDE_FILES:
            continue
        posts.append(extract_post_data(path))

    posts.sort(key=lambda item: item["sort_date"], reverse=True)

    html_output = build_html(posts)
    OUTPUT_FILE.write_text(html_output, encoding="utf-8")


if __name__ == "__main__":
    generate_index()
    print(f"Wrote {OUTPUT_FILE}")
