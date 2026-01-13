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

def scan_directory(path, base_path, indent=0):
    """Recursively scan directory and generate HTML list"""
    html = []
    
    try:
        items = sorted(os.listdir(path))
        
        # Separate folders and files
        folders = [item for item in items if os.path.isdir(os.path.join(path, item))]
        files = [item for item in items if os.path.isfile(os.path.join(path, item))]
        
        # Process folders first
        for folder in folders:
            folder_path = os.path.join(path, folder)
            rel_path = os.path.relpath(folder_path, base_path)
            
            html.append('\n<LI><B>' + folder + '</B>')
            html.append('\n<UL>')
            
            # Recursively process subfolder
            html.extend(scan_directory(folder_path, base_path, indent + 1))
            
            html.append('\n</UL>')
            html.append('\n</LI>')
        
        # Process files
        for file in files:
            file_path = os.path.join(path, file)
            rel_path = os.path.relpath(file_path, base_path)
            size = os.path.getsize(file_path)
            
            html.append(f'\n<LI><A HREF="{rel_path}">{file}</A> <SMALL>({format_size(size)})</SMALL></LI>')
    
    except PermissionError:
        html.append('\n<LI><I>Permission denied</I></LI>')
    
    return html

def generate_sitemap():
    """Generate complete sitemap.html"""
    base_path = Path(__file__).parent
    
    # Folders to scan
    folders_to_scan = ['blog', 'cv', 'projects']
    
    # Generate the file structure HTML
    structure_html = []
    
    for folder in folders_to_scan:
        folder_path = base_path / folder
        if folder_path.exists():
            structure_html.append('\n<LI><B>' + folder + '</B>')
            structure_html.append('\n<UL>')
            structure_html.extend(scan_directory(folder_path, base_path, 0))
            structure_html.append('\n</UL>')
            structure_html.append('\n</LI>')
    
    # Get generation timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    # Complete HTML template
    html_template = f"""<HTML>
<HEAD>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Rein's Cyberspaceplace - Site Map</TITLE>
</HEAD>
<BODY>
<H1>Rein's Cyberspaceplace - Site Map</H1>
<HR>
<UL>{''.join(structure_html)}
</UL>
<HR>
<P><SMALL>Last sitemap update: {timestamp}</SMALL></P>
<P><A HREF="index.html">Back to Intro</A></P>
</BODY>
</HTML>
"""
    
    # Write to sitemap.html
    output_path = Path(__file__).parent / 'sitemap.html'
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_template)
    
    print(f"✓ Generated sitemap.html ({format_size(output_path.stat().st_size)})")
    print(f"  Timestamp: {timestamp}")

if __name__ == '__main__':
    generate_sitemap()
