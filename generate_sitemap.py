#!/usr/bin/env python3
"""
Generate a static sitemap.html from the data/ folder structure
"""
import os
from pathlib import Path
from datetime import datetime

def format_size(bytes):
    """Format file size in human-readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024.0:
            return f"{bytes:.1f} {unit}"
        bytes /= 1024.0
    return f"{bytes:.1f} TB"

def get_file_icon(filename):
    """Get emoji icon based on file extension"""
    ext = Path(filename).suffix.lower()
    if ext in ['.html', '.htm']:
        return '🌐'
    elif ext in ['.md', '.markdown']:
        return '📃'
    else:
        return '📄'

def generate_sitemap():
    """Generate complete sitemap.html"""
    base_path = Path(__file__).parent
    
    # Folders to scan with their descriptions
    sections = {
        'blog': {
            'title': 'BLOG',
            'subtitle': 'PERSONAL LOG ENTRIES',
            'description': 'Memories, experiments, and digital archaeology',
            'icon': 'log'
        },
        'projects': {
            'title': 'PROJECTS',
            'subtitle': 'R&D DIVISION',
            'description': 'Code experiments, hardware hacks, and creative chaos',
            'icon': 'code'
        },
        'cv': {
            'title': 'CV',
            'subtitle': 'OPERATOR PROFILE',
            'description': 'Skills, experience, and mission history',
            'icon': 'profile'
        }
    }
    
    # Get generation timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Build teaser cards HTML
    teaser_html = []
    for folder, info in sections.items():
        index_path = base_path / folder / 'index.html'
        href = f"{folder}/index.html" if index_path.exists() else f"{folder}/"
        
        teaser_html.append(f'''
        <a class="section-teaser" href="{href}">
            <div class="teaser-graphic">
                <canvas class="teaser-canvas" data-icon="{info['icon']}"></canvas>
            </div>
            <div class="teaser-info">
                <h2 class="teaser-title">{info['title']}</h2>
                <div class="teaser-subtitle">{info['subtitle']}</div>
                <p class="teaser-desc">{info['description']}</p>
            </div>
        </a>
''')
    
    # Complete HTML template - CRT HACKER CYBERPUNK style with heavy animations
    html_template = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>REIN's CYBERSPACEPLACE</title>
<style>
    @import url('https://fonts.googleapis.com/css2?family=VT323&family=Share+Tech+Mono&family=Fira+Code:wght@400;700&display=swap');
    
    * {{
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }}
    
    :root {{
        --crt-black: #0a0a0a;
        --crt-dark: #0d1117;
        --phosphor-green: #00ff41;
        --phosphor-dim: #00aa2a;
        --phosphor-glow: #33ff66;
        --electric-blue: #00d4ff;
        --hot-pink: #ff0080;
        --cyber-purple: #9d00ff;
        --warning-amber: #ffaa00;
        --text-bright: #e0ffe0;
        --text-dim: #4a7c4a;
    }}
    
    html {{
        background: var(--crt-black);
        scrollbar-width: thin;
        scrollbar-color: var(--phosphor-green) var(--crt-dark);
    }}
    
    body {{
        font-family: 'VT323', 'Share Tech Mono', monospace;
        min-height: 100vh;
        color: var(--phosphor-green);
        overflow-x: hidden;
        line-height: 1.4;
        position: relative;
    }}
    
    /* === CRT MONITOR FRAME === */
    .crt-frame {{
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9999;
        border-radius: 20px;
        box-shadow: 
            inset 0 0 100px rgba(0, 0, 0, 0.9),
            inset 0 0 50px rgba(0, 0, 0, 0.7);
    }}
    
    /* === HEAVY SCANLINES === */
    .scanlines {{
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9997;
        background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.3) 2px,
            rgba(0, 0, 0, 0.3) 4px
        );
        animation: scanlineFlicker 0.05s infinite;
    }}
    
    @keyframes scanlineFlicker {{
        0%, 100% {{ opacity: 0.8; }}
        50% {{ opacity: 0.85; }}
    }}
    
    /* === MOVING SCANLINE BAR === */
    .scan-bar {{
        position: fixed;
        left: 0;
        width: 100%;
        height: 8px;
        background: linear-gradient(180deg, 
            transparent,
            rgba(0, 255, 65, 0.15),
            rgba(0, 255, 65, 0.3),
            rgba(0, 255, 65, 0.15),
            transparent
        );
        z-index: 9996;
        animation: scanBarMove 4s linear infinite;
    }}
    
    @keyframes scanBarMove {{
        0% {{ top: -20px; }}
        100% {{ top: 100vh; }}
    }}
    
    /* === CRT SCREEN FLICKER === */
    .crt-flicker {{
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9995;
        background: transparent;
        animation: flicker 0.15s infinite;
    }}
    
    @keyframes flicker {{
        0% {{ opacity: 0.97; }}
        5% {{ opacity: 0.95; }}
        10% {{ opacity: 0.98; }}
        15% {{ opacity: 0.93; }}
        20% {{ opacity: 0.97; }}
        100% {{ opacity: 0.97; }}
    }}
    
    /* === PHOSPHOR GLOW EFFECT === */
    .phosphor-glow {{
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 1;
        background: radial-gradient(ellipse at center, 
            rgba(0, 255, 65, 0.03) 0%,
            transparent 70%
        );
    }}
    
    /* === GLITCH LAYER === */
    .glitch-layer {{
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 9994;
        animation: glitchShift 8s infinite;
    }}
    
    @keyframes glitchShift {{
        0%, 90%, 100% {{ 
            clip-path: none;
            transform: none;
        }}
        91% {{
            clip-path: inset(30% 0 40% 0);
            transform: translateX(-5px);
        }}
        92% {{
            clip-path: inset(70% 0 10% 0);
            transform: translateX(5px);
        }}
        93% {{
            clip-path: inset(10% 0 60% 0);
            transform: translateX(-3px);
        }}
        94% {{
            clip-path: none;
            transform: none;
        }}
    }}
    
    /* === MAIN CONTAINER === */
    .terminal-container {{
        position: relative;
        z-index: 10;
        min-height: 100vh;
        padding: 30px;
        max-width: 1200px;
        margin: 0 auto;
    }}
    
    /* === HEADER / BOOT SEQUENCE === */
    .terminal-header {{
        padding: 20px;
        margin-bottom: 30px;
        border: 1px solid var(--phosphor-dim);
        background: rgba(0, 20, 0, 0.6);
        position: relative;
        overflow: hidden;
    }}
    
    .terminal-header::before {{
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.1), transparent);
        animation: headerSweep 3s linear infinite;
    }}
    
    @keyframes headerSweep {{
        0% {{ left: -50%; }}
        100% {{ left: 150%; }}
    }}
    
    .boot-text {{
        font-size: 0.9rem;
        color: var(--text-dim);
        margin-bottom: 5px;
        animation: typeIn 0.5s steps(40);
    }}
    
    @keyframes typeIn {{
        from {{ width: 0; opacity: 0; }}
        to {{ width: 100%; opacity: 1; }}
    }}
    
    .main-title {{
        font-family: 'VT323', monospace;
        font-size: clamp(2.5rem, 8vw, 5rem);
        color: var(--phosphor-green);
        text-shadow: 
            0 0 10px var(--phosphor-glow),
            0 0 20px var(--phosphor-glow),
            0 0 40px var(--phosphor-glow),
            0 0 80px var(--phosphor-green);
        letter-spacing: 0.1em;
        animation: titleGlow 2s ease-in-out infinite, glitchText 10s infinite;
    }}
    
    @keyframes titleGlow {{
        0%, 100% {{ text-shadow: 0 0 10px var(--phosphor-glow), 0 0 20px var(--phosphor-glow), 0 0 40px var(--phosphor-glow); }}
        50% {{ text-shadow: 0 0 20px var(--phosphor-glow), 0 0 40px var(--phosphor-glow), 0 0 60px var(--phosphor-glow), 0 0 100px var(--phosphor-green); }}
    }}
    
    @keyframes glitchText {{
        0%, 95%, 100% {{ transform: none; filter: none; }}
        96% {{ transform: skewX(-2deg) translateX(2px); filter: hue-rotate(90deg); }}
        97% {{ transform: skewX(2deg) translateX(-2px); filter: hue-rotate(-90deg); }}
        98% {{ transform: none; filter: hue-rotate(180deg); }}
    }}
    
    .subtitle {{
        font-size: 1.2rem;
        color: var(--electric-blue);
        letter-spacing: 0.3em;
        margin-top: 10px;
        text-shadow: 0 0 10px var(--electric-blue);
        animation: subtitleBlink 3s infinite;
    }}
    
    @keyframes subtitleBlink {{
        0%, 49%, 51%, 100% {{ opacity: 1; }}
        50% {{ opacity: 0.7; }}
    }}
    
    .status-line {{
        display: flex;
        gap: 30px;
        margin-top: 20px;
        flex-wrap: wrap;
        font-size: 1rem;
    }}
    
    .status-item {{
        display: flex;
        align-items: center;
        gap: 8px;
    }}
    
    .blink-dot {{
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: var(--phosphor-green);
        box-shadow: 0 0 10px var(--phosphor-glow);
        animation: dotBlink 1s infinite;
    }}
    
    .blink-dot.blue {{ background: var(--electric-blue); box-shadow: 0 0 10px var(--electric-blue); }}
    .blink-dot.pink {{ background: var(--hot-pink); box-shadow: 0 0 10px var(--hot-pink); }}
    
    @keyframes dotBlink {{
        0%, 40%, 100% {{ opacity: 1; transform: scale(1); }}
        20% {{ opacity: 0.5; transform: scale(0.8); }}
    }}
    
    /* === FILE BROWSER TERMINAL === */
    .file-terminal {{
        background: rgba(0, 10, 0, 0.8);
        border: 2px solid var(--phosphor-dim);
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 
            0 0 20px rgba(0, 255, 65, 0.1),
            inset 0 0 50px rgba(0, 0, 0, 0.5);
    }}
    
    .terminal-bar {{
        background: linear-gradient(180deg, #1a3a1a, #0a200a);
        padding: 10px 15px;
        display: flex;
        align-items: center;
        gap: 15px;
        border-bottom: 1px solid var(--phosphor-dim);
    }}
    
    .terminal-dots {{
        display: flex;
        gap: 6px;
    }}
    
    .terminal-dot {{
        width: 12px;
        height: 12px;
        border-radius: 50%;
        animation: termDotPulse 2s infinite;
    }}
    
    .terminal-dot:nth-child(1) {{ background: #ff5f56; animation-delay: 0s; }}
    .terminal-dot:nth-child(2) {{ background: #ffbd2e; animation-delay: 0.3s; }}
    .terminal-dot:nth-child(3) {{ background: #27ca40; animation-delay: 0.6s; }}
    
    @keyframes termDotPulse {{
        0%, 100% {{ opacity: 1; }}
        50% {{ opacity: 0.5; }}
    }}
    
    .terminal-title {{
        font-size: 1rem;
        color: var(--phosphor-green);
        text-shadow: 0 0 5px var(--phosphor-glow);
        flex: 1;
    }}
    
    .terminal-path {{
        font-size: 0.9rem;
        color: var(--text-dim);
    }}
    
    .file-content {{
        padding: 20px;
    }}
    
    /* === FILE LIST STYLING === */
    .file-list {{
        list-style: none;
    }}
    
    .file-list ul {{
        list-style: none;
        margin-left: 25px;
        padding-left: 20px;
        border-left: 2px dashed var(--text-dim);
    }}
    
    .file-list li {{
        margin: 6px 0;
    }}
    
    /* === SECTION TEASERS === */
    .teasers-grid {{
        display: flex;
        flex-direction: column;
        gap: 15px;
    }}
    
    .section-teaser {{
        display: grid;
        grid-template-columns: 180px 1fr;
        gap: 20px;
        align-items: center;
        padding: 20px;
        background: rgba(0, 255, 65, 0.03);
        border: 2px solid var(--phosphor-dim);
        border-left: 4px solid var(--cyber-purple);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        text-decoration: none;
        color: inherit;
    }}
    
    .section-teaser::before {{
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 50%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.1), transparent);
        transition: left 0.5s ease;
    }}
    
    .section-teaser:hover {{
        background: rgba(0, 255, 65, 0.1);
        border-color: var(--phosphor-green);
        box-shadow: 
            0 0 30px rgba(0, 255, 65, 0.2),
            inset 0 0 30px rgba(0, 255, 65, 0.05);
        transform: scale(1.01);
    }}
    
    .section-teaser:hover::before {{
        left: 150%;
    }}
    
    
    .teaser-graphic {{
        width: 180px;
        height: 120px;
        border: 1px solid var(--phosphor-dim);
        background: rgba(0, 0, 0, 0.5);
        position: relative;
        overflow: hidden;
    }}
    
    .teaser-canvas {{
        width: 100%;
        height: 100%;
        display: block;
    }}
    
    .teaser-info {{
        display: flex;
        flex-direction: column;
        gap: 8px;
    }}
    
    .teaser-title {{
        font-family: 'VT323', monospace;
        font-size: 2rem;
        color: var(--phosphor-green);
        text-shadow: 0 0 10px var(--phosphor-glow);
        margin: 0;
        letter-spacing: 0.1em;
    }}
    
    .teaser-subtitle {{
        font-size: 0.9rem;
        color: var(--cyber-purple);
        text-shadow: 0 0 5px var(--cyber-purple);
        letter-spacing: 0.2em;
    }}
    
    .teaser-desc {{
        font-size: 1rem;
        color: var(--text-bright);
        margin: 5px 0;
        line-height: 1.5;
    }}
    
    
    /* === FOOTER === */
    .terminal-footer {{
        margin-top: 30px;
        padding: 20px;
        border: 1px solid var(--phosphor-dim);
        background: rgba(0, 20, 0, 0.6);
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
    }}
    
    .footer-text {{
        font-size: 1rem;
        color: var(--text-dim);
    }}
    
    .footer-text a {{
        color: var(--phosphor-green);
        text-decoration: none;
        text-shadow: 0 0 5px var(--phosphor-glow);
    }}
    
    .nav-buttons {{
        display: flex;
        gap: 15px;
    }}
    
    .cyber-btn {{
        font-family: 'VT323', monospace;
        font-size: 1.2rem;
        padding: 12px 25px;
        background: transparent;
        border: 2px solid var(--phosphor-green);
        color: var(--phosphor-green);
        text-decoration: none;
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        text-shadow: 0 0 5px var(--phosphor-glow);
    }}
    
    .cyber-btn::before {{
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.3), transparent);
        animation: btnSweep 2s linear infinite;
    }}
    
    @keyframes btnSweep {{
        0% {{ left: -100%; }}
        100% {{ left: 100%; }}
    }}
    
    .cyber-btn:hover {{
        background: var(--phosphor-green);
        color: var(--crt-black);
        box-shadow: 
            0 0 20px var(--phosphor-glow),
            0 0 40px var(--phosphor-glow);
        text-shadow: none;
    }}
    
    .cyber-btn.pink {{
        border-color: var(--hot-pink);
        color: var(--hot-pink);
        text-shadow: 0 0 5px var(--hot-pink);
    }}
    
    .cyber-btn.pink::before {{
        background: linear-gradient(90deg, transparent, rgba(255, 0, 128, 0.3), transparent);
    }}
    
    .cyber-btn.pink:hover {{
        background: var(--hot-pink);
        color: var(--crt-black);
        box-shadow: 0 0 20px var(--hot-pink), 0 0 40px var(--hot-pink);
    }}
    
    /* === ASCII DECORATION === */
    .ascii-decoration {{
        margin-top: 30px;
        font-family: 'Fira Code', monospace;
        font-size: 0.7rem;
        color: var(--text-dim);
        text-align: center;
        white-space: pre;
        line-height: 1.3;
        animation: asciiFade 4s ease-in-out infinite;
    }}
    
    @keyframes asciiFade {{
        0%, 100% {{ opacity: 0.5; }}
        50% {{ opacity: 0.8; }}
    }}
    
    /* === CORNER DECORATIONS === */
    .corner-decor {{
        position: fixed;
        width: 100px;
        height: 100px;
        pointer-events: none;
        z-index: 100;
    }}
    
    .corner-decor.top-left {{
        top: 20px;
        left: 20px;
        border-top: 2px solid var(--phosphor-dim);
        border-left: 2px solid var(--phosphor-dim);
    }}
    
    .corner-decor.top-right {{
        top: 20px;
        right: 20px;
        border-top: 2px solid var(--phosphor-dim);
        border-right: 2px solid var(--phosphor-dim);
    }}
    
    .corner-decor.bottom-left {{
        bottom: 20px;
        left: 20px;
        border-bottom: 2px solid var(--phosphor-dim);
        border-left: 2px solid var(--phosphor-dim);
    }}
    
    .corner-decor.bottom-right {{
        bottom: 20px;
        right: 20px;
        border-bottom: 2px solid var(--phosphor-dim);
        border-right: 2px solid var(--phosphor-dim);
    }}
    
    /* === ELITE IFRAME BACKGROUND === */
    .elite-bg {{
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        border: none;
        pointer-events: none;
    }}
    
    /* === ANIMATED HEX STREAM IN CORNERS === */
    .hex-stream {{
        position: fixed;
        font-family: 'Fira Code', monospace;
        font-size: 10px;
        color: var(--phosphor-dim);
        opacity: 0.3;
        z-index: 5;
        animation: hexScroll 10s linear infinite;
    }}
    
    .hex-stream.left {{
        left: 10px;
        top: 150px;
        writing-mode: vertical-rl;
    }}
    
    .hex-stream.right {{
        right: 10px;
        top: 150px;
        writing-mode: vertical-rl;
    }}
    
    @keyframes hexScroll {{
        0% {{ transform: translateY(-50%); }}
        100% {{ transform: translateY(50%); }}
    }}
    
    /* === RESPONSIVE === */
    @media (max-width: 768px) {{
        .terminal-container {{
            padding: 15px;
        }}
        
        .main-title {{
            font-size: 2rem;
        }}
        
        .section-teaser {{
            grid-template-columns: 1fr;
            grid-template-rows: auto auto auto;
            text-align: center;
        }}
        
        .teaser-graphic {{
            width: 100%;
            max-width: 200px;
            margin: 0 auto;
        }}
        
        .teaser-info {{
            align-items: center;
        }}
        
        .terminal-footer {{
            flex-direction: column;
            text-align: center;
        }}
        
        .nav-buttons {{
            width: 100%;
            flex-direction: column;
        }}
        
        .cyber-btn {{
            width: 100%;
            text-align: center;
        }}
        
        .corner-decor, .hex-stream {{
            display: none;
        }}
    }}
</style>
</head>
<body>
<!-- ELITE.HTML AS IFRAME BACKGROUND -->
<iframe src="elite.html" class="elite-bg" title="Elite Background"></iframe>

<!-- CRT Effects Layer -->
<div class="crt-frame"></div>
<div class="scanlines"></div>
<div class="scan-bar"></div>
<div class="crt-flicker"></div>
<div class="phosphor-glow"></div>
<div class="glitch-layer"></div>

<!-- Corner Decorations -->
<div class="corner-decor top-left"></div>
<div class="corner-decor top-right"></div>
<div class="corner-decor bottom-left"></div>
<div class="corner-decor bottom-right"></div>

<!-- Hex Streams -->
<div class="hex-stream left">0xDEADBEEF 0xCAFEBABE 0x1337C0DE 0xFACEB00C 0xB16B00B5 0xBADC0DED 0xFEEDFACE 0xC0FFEE00</div>
<div class="hex-stream right">0xFF00FF00 0x00FF00FF 0xABCDEF01 0x12345678 0x87654321 0xDECAFBAD 0xBEEFCAFE 0xC0DED00D</div>

<!-- Main Terminal Container -->
<div class="terminal-container">
    
    <!-- Header -->
    <header class="terminal-header">
        <h1 class="main-title">REIN's CYBERSPACEPLACE</h1>
    </header>
    
    <!-- File Browser Terminal -->
    <main class="file-terminal">
        <div class="terminal-bar">
            <div class="terminal-dots">
                <span class="terminal-dot"></span>
                <span class="terminal-dot"></span>
                <span class="terminal-dot"></span>
            </div>
            <span class="terminal-title">▸ ARCHIVE NAVIGATOR</span>
            <span class="terminal-path">~/cyberspaceplace/</span>
        </div>
        
        <div class="file-content">
            <div class="teasers-grid">{''.join(teaser_html)}
            </div>
        </div>
    </main>
    
    <!-- Footer -->
    <footer class="terminal-footer">
        <div class="footer-text">
            © 2026 REIN VELT // <a href="LICENSE">OPEN SOURCE</a> // <a href="https://github.com/reinvelt/www.velt.org">GITHUB</a> // CODE • EXPERIMENTS • CHAOS
        </div>
        <div class="nav-buttons">
            <a href="index.html" class="cyber-btn">◀ EXIT</a>
            <a href="elite.html" class="cyber-btn pink">ELITE ▸</a>
        </div>
    </footer>
    
    <div class="ascii-decoration">
    ╔═══════════════════════════════════════════════════════════════════════╗
    ║   ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄   ║
    ║   █ "WE ARE THE MUSIC MAKERS AND WE ARE THE DREAMERS OF DREAMS" █   ║
    ║   ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀   ║
    ╚═══════════════════════════════════════════════════════════════════════╝
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {{
    // === TEASER CANVAS GRAPHICS ===
    const canvases = document.querySelectorAll('.teaser-canvas');
    
    canvases.forEach(canvas => {{
        const ctx = canvas.getContext('2d');
        const icon = canvas.dataset.icon;
        canvas.width = 180;
        canvas.height = 120;
        
        const GREEN = '#00ff41';
        const DIM = '#004400';
        
        function drawLog() {{
            // Animated terminal log
            let frame = 0;
            
            function animate() {{
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, 180, 120);
                
                ctx.font = '10px monospace';
                ctx.fillStyle = GREEN;
                ctx.shadowBlur = 3;
                ctx.shadowColor = GREEN;
                
                const lines = [
                    '> MEMORY LOG v2.1',
                    '> STATUS: ARCHIVING',
                    '  ████████░░ 82%',
                    '> ENTRIES: ' + Math.floor(frame/10 % 999),
                    '> LAST: 2026-02-06',
                    '> SYNC: ACTIVE'
                ];
                
                lines.forEach((line, i) => {{
                    const flicker = Math.random() > 0.02 ? 1 : 0.3;
                    ctx.globalAlpha = flicker;
                    ctx.fillText(line, 10, 18 + i * 16);
                }});
                
                // Cursor blink
                if (Math.floor(frame / 30) % 2 === 0) {{
                    ctx.fillRect(10, 108, 8, 2);
                }}
                
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
                frame++;
                requestAnimationFrame(animate);
            }}
            animate();
        }}
        
        function drawCode() {{
            // Animated code/circuit pattern
            let frame = 0;
            const nodes = [];
            for (let i = 0; i < 8; i++) {{
                nodes.push({{
                    x: 30 + Math.random() * 120,
                    y: 20 + Math.random() * 80,
                    connections: []
                }});
            }}
            // Create connections
            nodes.forEach((node, i) => {{
                const target = (i + 1) % nodes.length;
                node.connections.push(target);
                if (Math.random() > 0.5) {{
                    node.connections.push((i + 2) % nodes.length);
                }}
            }});
            
            function animate() {{
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, 180, 120);
                
                ctx.strokeStyle = DIM;
                ctx.lineWidth = 1;
                
                // Draw connections
                nodes.forEach((node, i) => {{
                    node.connections.forEach(target => {{
                        ctx.beginPath();
                        ctx.moveTo(node.x, node.y);
                        ctx.lineTo(nodes[target].x, nodes[target].y);
                        ctx.stroke();
                    }});
                }});
                
                // Draw nodes
                nodes.forEach((node, i) => {{
                    const pulse = Math.sin(frame * 0.1 + i) * 0.5 + 0.5;
                    ctx.fillStyle = GREEN;
                    ctx.globalAlpha = 0.3 + pulse * 0.7;
                    ctx.shadowBlur = 5 + pulse * 10;
                    ctx.shadowColor = GREEN;
                    
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, 4 + pulse * 2, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Animate node position slightly
                    node.x += Math.sin(frame * 0.02 + i) * 0.3;
                    node.y += Math.cos(frame * 0.02 + i) * 0.3;
                }});
                
                ctx.globalAlpha = 1;
                ctx.shadowBlur = 0;
                
                // Data packet animation
                const packetPos = (frame * 2) % 180;
                ctx.fillStyle = GREEN;
                ctx.shadowBlur = 10;
                ctx.shadowColor = GREEN;
                ctx.fillRect(packetPos, 60, 4, 4);
                
                frame++;
                requestAnimationFrame(animate);
            }}
            animate();
        }}
        
        function drawProfile() {{
            // Animated profile/ID card
            let frame = 0;
            
            function animate() {{
                ctx.fillStyle = '#000';
                ctx.fillRect(0, 0, 180, 120);
                
                // Border
                ctx.strokeStyle = GREEN;
                ctx.lineWidth = 2;
                ctx.shadowBlur = 5;
                ctx.shadowColor = GREEN;
                ctx.strokeRect(10, 10, 160, 100);
                
                // ID photo placeholder (wireframe face)
                ctx.strokeStyle = DIM;
                ctx.lineWidth = 1;
                // Head
                ctx.beginPath();
                ctx.arc(50, 45, 20, 0, Math.PI * 2);
                ctx.stroke();
                // Body
                ctx.beginPath();
                ctx.moveTo(30, 65);
                ctx.lineTo(50, 85);
                ctx.lineTo(70, 65);
                ctx.stroke();
                
                // Scan line
                ctx.strokeStyle = GREEN;
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.5;
                const scanY = 10 + (frame % 100);
                if (scanY < 110) {{
                    ctx.beginPath();
                    ctx.moveTo(20, scanY);
                    ctx.lineTo(70, scanY);
                    ctx.stroke();
                }}
                ctx.globalAlpha = 1;
                
                // Text
                ctx.font = '10px monospace';
                ctx.fillStyle = GREEN;
                ctx.shadowBlur = 3;
                ctx.shadowColor = GREEN;
                
                ctx.fillText('OPERATOR ID', 85, 25);
                ctx.fillStyle = DIM;
                ctx.fillText('CLEARANCE: ███', 85, 45);
                ctx.fillText('STATUS: ACTIVE', 85, 60);
                ctx.fillText('SKILLS: ██████', 85, 75);
                ctx.fillText('EXP: ' + (2026 - 1994) + ' YRS', 85, 90);
                
                ctx.shadowBlur = 0;
                frame++;
                requestAnimationFrame(animate);
            }}
            animate();
        }}
        
        // Start appropriate animation
        if (icon === 'log') drawLog();
        else if (icon === 'code') drawCode();
        else if (icon === 'profile') drawProfile();
    }});
    
    // Random glitch effect on title
    const title = document.querySelector('.main-title');
    if (title) {{
        setInterval(() => {{
            if (Math.random() > 0.95) {{
                title.style.transform = `skewX(${{Math.random() * 4 - 2}}deg)`;
                setTimeout(() => {{
                    title.style.transform = 'none';
                }}, 100);
            }}
        }}, 200);
    }}
}});
</script>
</body>
</html>
"""
    
    # Write to sitemap.html
    output_path = Path(__file__).parent / 'sitemap.html'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_template)
    
    print(f"✓ Generated sitemap.html ({format_size(output_path.stat().st_size)})")
    print(f"  Timestamp: {timestamp}")

if __name__ == '__main__':
    generate_sitemap()
