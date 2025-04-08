#!/usr/bin/env python3

import sys
import os
import glob
import base64
import mimetypes
from pathlib import Path
from tqdm import tqdm
from markdown_it import MarkdownIt
from markdown_it.extensions.mermaid import mermaid_plugin
from pygments.formatters import HtmlFormatter
from markdown_it.renderer import RendererHTML
from bs4 import BeautifulSoup
import cssutils

SOURCE_DIR = "docs"
OUTPUT_DIR = "html"
CSS_FILE = "styles.css"

# Global md parser with Mermaid and Pygments syntax highlighting
md = (
    MarkdownIt("commonmark", {"highlight": lambda code, lang: highlight_code(code, lang)})
    .use(mermaid_plugin)
)

def highlight_code(code, lang):
    from pygments import highlight
    from pygments.lexers import get_lexer_by_name, TextLexer
    lexer = get_lexer_by_name(lang) if lang else TextLexer()
    formatter = HtmlFormatter()
    return highlight(code, lexer, formatter)

def load_css():
    css_path = Path(__file__).parent / CSS_FILE
    if css_path.exists():
        return css_path.read_text()
    else:
        print(f"⚠️ Warning: {css_path} not found", file=sys.stderr)
        return ""

def convert_images_to_base64(html, markdown_path):
    soup = BeautifulSoup(html, "html.parser")
    for img in soup.find_all("img"):
        src = img.get("src", "")
        if src.startswith("http") or src.startswith("data:"):
            continue

        img_path = (Path(markdown_path).parent / src).resolve()
        if img_path.exists():
            with open(img_path, "rb") as f:
                data = f.read()
                mime = mimetypes.guess_type(img_path)[0] or "application/octet-stream"
                b64 = base64.b64encode(data).decode("utf-8")
                img["src"] = f"data:{mime};base64,{b64}"
        else:
            print(f"⚠️ Image not found: {img_path}", file=sys.stderr)
    return str(soup)

def inline_css(html, css):
    soup = BeautifulSoup(html, "html.parser")
    style_tag = soup.new_tag("style")
    style_tag.string = css
    soup.head.insert(0, style_tag) if soup.head else soup.insert(0, style_tag)
    return str(soup)

def convert_markdown_file(md_file, css_content):
    md_text = Path(md_file).read_text()
    html = md.render(md_text)
    html = convert_images_to_base64(html, md_file)
    html = inline_css(html, css_content)
    return html

def process_file(md_file, css_content):
    rel_path = Path(md_file).relative_to(SOURCE_DIR)
    out_path = Path(OUTPUT_DIR) / rel_path.with_suffix(".html")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    html = convert_markdown_file(md_file, css_content)
    out_path.write_text(html)
    return md_file, str(out_path)

def main():
    args = sys.argv[1:]
    css_content = load_css()

    if len(args) == 1:
        md_path = Path(args[0])
        if not md_path.exists():
            print(f"❌ File not found: {md_path}", file=sys.stderr)
            sys.exit(1)

        html = convert_markdown_file(md_path, css_content)
        print(html)
        return

    Path(OUTPUT_DIR).mkdir(exist_ok=True)
    md_files = glob.glob(f"{SOURCE_DIR}/**/*.md", recursive=True)

    with tqdm(total=len(md_files), desc="Converting Markdown files") as pbar:
        for md_file in md_files:
            process_file(md_file, css_content)
            pbar.update(1)

    print("\n✅ All Markdown files converted successfully!")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Fatal Error: {e}", file=sys.stderr)
