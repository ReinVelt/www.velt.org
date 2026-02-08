#!/usr/bin/env python3
"""
Generate projects/index.html by scanning projects/**/index.html.
If a folder contains index.html, it becomes the entry point and its subtree is not traversed.
"""

from __future__ import annotations

import html
from pathlib import Path
from urllib.parse import quote
import hashlib

from bs4 import BeautifulSoup

PROJECTS_DIR = Path("projects")
OUTPUT_FILE = PROJECTS_DIR / "index.html"


def clean_text(text: str) -> str:
    return " ".join(text.split())


def extract_title(soup: BeautifulSoup) -> str:
    title_tag = soup.find("h1")
    if title_tag and title_tag.get_text(strip=True):
        return clean_text(title_tag.get_text(strip=True))

    intro_title = soup.select_one(".intro-title, .site-title")
    if intro_title and intro_title.get_text(strip=True):
        return clean_text(intro_title.get_text(strip=True))

    doc_title = soup.find("title")
    if doc_title and doc_title.get_text(strip=True):
        return clean_text(doc_title.get_text(strip=True))

    return "Untitled Project"


def extract_teaser(soup: BeautifulSoup) -> str:
    meta_description = soup.select_one("meta[name='description'], meta[property='og:description']")
    if meta_description and meta_description.get("content"):
        return clean_text(meta_description["content"])

    candidates = []
    skip_markers = {
        "cookie",
        "privacy",
        "button",
        "klik",
        "press",
        "score",
        "level",
        "player",
        "javascript",
        "copyright",
    }

    for paragraph in soup.find_all("p"):
        if paragraph.get("class") in (["date"], ["image-caption"]):
            continue
        if paragraph.find_parent("figcaption"):
            continue
        text = clean_text(paragraph.get_text(" ", strip=True))
        if len(text) < 70:
            continue
        lowered = text.lower()
        if any(marker in lowered for marker in skip_markers):
            continue
        candidates.append(text)

    if not candidates:
        return ""

    def score(text: str) -> int:
        length = len(text)
        ideal_penalty = abs(140 - length)
        sentence_bonus = text.count(".") + text.count("!") + text.count("?")
        return 500 - ideal_penalty + (sentence_bonus * 4)

    return max(candidates, key=score)


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


def placeholder_data_uri(title: str, group: str) -> str:
        seed = f"{group}-{title}".encode("utf-8")
        digest = hashlib.md5(seed).hexdigest()
        hue = int(digest[:2], 16) % 360
        hue2 = (hue + 40) % 360
        label = f"{group} / {title}"[:42]

        svg = f"""<svg xmlns='http://www.w3.org/2000/svg' width='600' height='375'>
<defs>
    <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='hsl({hue},70%,20%)'/>
        <stop offset='100%' stop-color='hsl({hue2},80%,30%)'/>
    </linearGradient>
    <pattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'>
        <path d='M40 0H0V40' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1'/>
    </pattern>
</defs>
<rect width='600' height='375' fill='url(#g)'/>
<rect width='600' height='375' fill='url(#grid)'/>
<circle cx='470' cy='90' r='80' fill='rgba(255,255,255,0.08)'/>
<circle cx='130' cy='280' r='120' fill='rgba(255,255,255,0.06)'/>
<text x='40' y='80' font-family='IBM Plex Mono, monospace' font-size='28' fill='rgba(255,255,255,0.85)'>PROJECT</text>
<text x='40' y='140' font-family='Space Grotesk, sans-serif' font-size='40' fill='rgba(255,255,255,0.95)'>{html.escape(group)}</text>
<text x='40' y='210' font-family='Space Grotesk, sans-serif' font-size='22' fill='rgba(255,255,255,0.8)'>{html.escape(label)}</text>
</svg>"""

        return f"data:image/svg+xml;utf8,{quote(svg)}"


def resolve_image_path(index_path: Path, src: str) -> str:
    if src.startswith("http://") or src.startswith("https://"):
        return src
    if src.startswith("data:image/"):
        return src
    if src.startswith("/"):
        return src

    combined = (index_path.parent / src)
    try:
        return combined.relative_to(PROJECTS_DIR).as_posix()
    except ValueError:
        return src


def infer_badge(path: Path, title: str) -> str:
    name = path.parent.name.replace("-", " ").replace("_", " ")
    if name:
        return name.upper()
    return title.split(":", 1)[0].upper()


def format_group_title(group: str) -> str:
    return " ".join(part.capitalize() for part in group.replace("_", " ").replace("-", " ").split())


def collect_index_entries() -> list[dict]:
    entries = []

    def walk(folder: Path) -> None:
        if folder == PROJECTS_DIR:
            for child in sorted(folder.iterdir()):
                if child.is_dir():
                    walk(child)
            return

        index_path = folder / "index.html"
        if index_path.exists():
            soup = BeautifulSoup(index_path.read_text(encoding="utf-8"), "html.parser")
            title = extract_title(soup)
            teaser = trim_teaser(extract_teaser(soup))
            image = extract_image(soup)
            group = index_path.parent.relative_to(PROJECTS_DIR).parts[0]
            resolved_image = resolve_image_path(index_path, image) if image else ""
            if not resolved_image:
                resolved_image = placeholder_data_uri(title, group)

            entries.append(
                {
                    "href": index_path.relative_to(PROJECTS_DIR).as_posix(),
                    "title": title,
                    "teaser": teaser,
                    "image": resolved_image,
                    "badge": infer_badge(index_path, title),
                    "path": index_path.parent.relative_to(PROJECTS_DIR).as_posix(),
                    "group": group,
                }
            )
            return

        for child in sorted(folder.iterdir()):
            if child.is_dir():
                walk(child)

    walk(PROJECTS_DIR)
    return entries


def build_cards(entries: list[dict]) -> str:
    cards = []
    for entry in entries:
        title = html.escape(entry["title"])
        teaser = html.escape(entry["teaser"] or "Project entry point zonder beschrijving. Klik door voor de rest.")
        href = html.escape(entry["href"])
        badge = html.escape(entry["badge"])
        path = html.escape(entry["path"])

        image = html.escape(entry["image"])
        thumb_html = (
            f"<div class=\"thumb\">\n"
            f"    <img src=\"{image}\" alt=\"{title}\">\n"
            f"</div>"
        )

        cards.append(
            f"""        <a class=\"card\" href=\"{href}\">
{thumb_html}
            <div class=\"meta\">
                <span class=\"path\">{path}</span>
                <span class=\"badge\">{badge}</span>
            </div>
            <div class=\"title\">{title}</div>
            <p class=\"teaser\">{teaser}</p>
        </a>"""
        )
    return "\n\n".join(cards)


def build_grouped_sections(entries: list[dict]) -> str:
    sections = []
    groups = {}
    for entry in entries:
        groups.setdefault(entry["group"], []).append(entry)

    for group in sorted(groups.keys()):
        group_entries = groups[group]
        group_title = html.escape(format_group_title(group))
        cards_html = build_cards(group_entries)
        sections.append(
            f"""    <section class=\"group\">
        <div class=\"group-title\">{group_title}</div>
        <div class=\"grid\">
{cards_html}
        </div>
    </section>"""
        )
    return "\n\n".join(sections)


def build_html(entries: list[dict]) -> str:
    sections_html = build_grouped_sections(entries)

    return f"""<!DOCTYPE html>
<html lang=\"nl\">
<head>
<meta charset=\"UTF-8\">
<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
<title>Projects Index // AI Lab</title>
<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">
<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&family=IBM+Plex+Mono:wght@400;600&family=Share+Tech+Mono&display=swap" rel="stylesheet">
<style>
    :root {{
        --ink: #070a0f;
        --night: #0b111a;
        --fog: #e7f7f2;
        --glow: #00f6ff;
        --ember: #ffb100;
        --acid: #39ff14;
        --steel: #8aa2b5;
        --card: rgba(8, 16, 26, 0.82);
        --card-border: rgba(57, 255, 20, 0.25);
        --shadow: 0 26px 70px rgba(0, 6, 12, 0.6);
        --grid-gap: clamp(1rem, 3vw, 1.75rem);
    }}

    * {{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }}

    body {{
        font-family: "Space Grotesk", "IBM Plex Mono", "Share Tech Mono", "Courier New", monospace;
        color: var(--fog);
        background:
            radial-gradient(900px 700px at 12% 12%, rgba(0, 246, 255, 0.25), transparent 62%),
            radial-gradient(900px 700px at 90% 5%, rgba(255, 177, 0, 0.18), transparent 60%),
            linear-gradient(130deg, #04070c 0%, #0a111c 45%, #0c1a22 100%);
        min-height: 100vh;
        padding: clamp(1.2rem, 3vw, 2.5rem);
        overflow-x: hidden;
    }}

    body::before {{
        content: "";
        position: fixed;
        inset: 0;
        background-image: linear-gradient(
            rgba(255, 255, 255, 0.05) 1px,
            transparent 1px
        );
        background-size: 100% 3px;
        mix-blend-mode: screen;
        opacity: 0.2;
        pointer-events: none;
        z-index: 0;
    }}

    body::after {{
        content: "";
        position: fixed;
        inset: 0;
        background:
            linear-gradient(90deg, rgba(0, 246, 255, 0.05), transparent 40%),
            radial-gradient(circle at 70% 20%, rgba(57, 255, 20, 0.18), transparent 55%);
        opacity: 0.35;
        pointer-events: none;
        z-index: 0;
    }}

    .noise {{
        position: fixed;
        inset: 0;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='0.08'/></svg>");
        mix-blend-mode: soft-light;
        opacity: 0.15;
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
        background: linear-gradient(145deg, rgba(5, 12, 20, 0.95), rgba(10, 20, 32, 0.8));
        box-shadow: var(--shadow);
        border-radius: 18px;
        display: grid;
        gap: 1rem;
        margin-bottom: clamp(2rem, 4vw, 3rem);
        animation: rise 0.8s ease-out both;
    }}

    .hero .kicker {{
        font-family: "Share Tech Mono", "IBM Plex Mono", "Courier New", monospace;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 0.75rem;
        color: var(--acid);
        text-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
    }}

    .hero h1 {{
        font-size: clamp(2rem, 5vw, 3.4rem);
        line-height: 1.05;
        color: var(--fog);
        text-shadow: 0 0 18px rgba(0, 246, 255, 0.35);
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

    .group {{
        display: grid;
        gap: 1.25rem;
        margin-bottom: clamp(2rem, 4vw, 3rem);
    }}

    .group-title {{
        font-size: clamp(1.2rem, 2.5vw, 1.6rem);
        letter-spacing: 0.14em;
        text-transform: uppercase;
        color: var(--acid);
        font-family: "IBM Plex Mono", "Courier New", monospace;
        padding-bottom: 0.4rem;
        border-bottom: 1px solid rgba(148, 163, 184, 0.35);
    }}

    .card {{
        position: relative;
        display: grid;
        gap: 1rem;
        padding: 1.1rem;
        border-radius: 16px;
        background: var(--card);
        border: 1px solid var(--card-border);
        box-shadow: 0 18px 45px rgba(0, 12, 20, 0.45);
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
        border: 1px solid rgba(57, 255, 20, 0.25);
        background: #070f18;
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
        font-family: "Share Tech Mono", "IBM Plex Mono", "Courier New", monospace;
        font-size: 0.75rem;
        color: var(--acid);
        text-transform: uppercase;
        letter-spacing: 0.18em;
        gap: 0.75rem;
    }}

    .meta .path {{
        color: var(--steel);
        font-size: 0.7rem;
        text-transform: none;
        letter-spacing: 0.08em;
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
        font-family: "Share Tech Mono", "IBM Plex Mono", "Courier New", monospace;
        font-size: 0.7rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--ember);
        border: 1px solid rgba(255, 177, 0, 0.5);
        padding: 0.25rem 0.5rem;
        border-radius: 999px;
        background: rgba(255, 177, 0, 0.12);
        white-space: nowrap;
    }}

    .footer {{
        margin-top: clamp(2rem, 4vw, 3rem);
        color: rgba(148, 163, 184, 0.8);
        font-size: 0.9rem;
        font-family: "Share Tech Mono", "IBM Plex Mono", "Courier New", monospace;
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

        .meta {{
            flex-direction: column;
            align-items: flex-start;
        }}
    }}
</style>
</head>
<body>
<div class=\"noise\"></div>
<div class=\"shell\">
    <header class=\"hero\">
        <span class=\"kicker\">Operator console</span>
        <h1>Projects Index // hacker-AI field log</h1>
        <p>Signalen, simulaties en zelfgebouwde systemen. Elke map is een node, elk indexbestand een toegangspoort naar het lab.</p>
    </header>

    <main>
{sections_html}
    </main>

    <footer class=\"footer\">
        <span>Index generated from project entry points. No trackers. No noise.</span>
        <a href=\"../sitemap.html\">Terug naar sitemap</a>
    </footer>
</div>
</body>
</html>
"""


def generate_index() -> None:
    entries = collect_index_entries()
    entries.sort(key=lambda item: (item["group"].lower(), item["path"].lower()))
    OUTPUT_FILE.write_text(build_html(entries), encoding="utf-8")


if __name__ == "__main__":
    generate_index()
    print(f"Wrote {OUTPUT_FILE}")
