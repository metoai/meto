#!/usr/bin/env python3
"""
Generate official Meto brand favicon and icon assets.
Brand color: #FF4D00
Icon badge: Vibrant circular badge with crisp white Meto mark centered.
Apple icon: Vibrant squircle badge (180x180, rx=36) with crisp white Meto mark centered.
Multi-resolution favicon.ico: 16x16, 32x32, 48x48, 256x256 with transparent background.
"""

import os
import base64
import xml.etree.ElementTree as ET
from io import BytesIO
from PIL import Image, ImageDraw

PRIMARY_COLOR = (255, 77, 0)       # #FF4D00
PRIMARY_HEX = "#FF4D00"
WHITE_COLOR = (255, 255, 255)

def main():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_brand = os.path.join(base_dir, "public", "brand")
    src_app = os.path.join(base_dir, "src", "app")
    public_dir = os.path.join(base_dir, "public")

    # 1. Extract the raw logo mark from public/brand/favicon.svg or logo-icon.svg
    fav_svg_path = os.path.join(public_brand, "favicon.svg")
    tree = ET.parse(fav_svg_path)
    root = tree.getroot()
    img_elem = next(elem for elem in root.iter() if elem.tag.endswith("image"))
    href = img_elem.attrib.get("href") or img_elem.attrib.get("{http://www.w3.org/1999/xlink}href", "")
    data = href.split(";base64,")[1]
    raw_png = base64.b64decode(data)

    mark_img = Image.open(BytesIO(raw_png))
    bbox = mark_img.getbbox()
    cropped_mark = mark_img.crop(bbox)
    print(f"Extracted mark bbox: {bbox}, cropped size: {cropped_mark.size}")

    # 2. Build high-res white mark PNG (512px wide) with transparent background
    target_w = 512
    aspect = cropped_mark.height / cropped_mark.width
    target_h = int(round(target_w * aspect))
    mark_resized = cropped_mark.resize((target_w, target_h), Image.Resampling.LANCZOS)

    white_mark_512 = Image.new("RGBA", (target_w, target_h), (*WHITE_COLOR, 255))
    white_mark_512.putalpha(mark_resized)

    buf_512 = BytesIO()
    white_mark_512.save(buf_512, format="PNG", optimize=True)
    b64_white_mark = base64.b64encode(buf_512.getvalue()).decode("ascii")
    data_uri_white_mark = f"data:image/png;base64,{b64_white_mark}"

    # 3. Generate SVG for Favicon (32x32)
    # Mark occupies 60% of circle width = 19.2px wide, height = 19.2 * aspect = 17.53px
    fav_mark_w = 19.2
    fav_mark_h = round(fav_mark_w * (cropped_mark.height / cropped_mark.width), 2)
    fav_x = round((32 - fav_mark_w) / 2, 2)
    fav_y = round((32 - fav_mark_h) / 2, 2)

    favicon_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" width="32" height="32">
  <circle cx="16" cy="16" r="16" fill="{PRIMARY_HEX}"/>
  <image x="{fav_x}" y="{fav_y}" width="{fav_mark_w}" height="{fav_mark_h}" preserveAspectRatio="xMidYMid meet" href="{data_uri_white_mark}" xlink:href="{data_uri_white_mark}"/>
</svg>
"""

    # 4. Generate SVG for Apple Touch Icon (180x180)
    # Squircle with rx=36, mark occupies 60% of width = 108px wide
    apple_mark_w = 108.0
    apple_mark_h = round(apple_mark_w * (cropped_mark.height / cropped_mark.width), 2)
    apple_x = round((180 - apple_mark_w) / 2, 2)
    apple_y = round((180 - apple_mark_h) / 2, 2)

    apple_svg = f"""<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 180 180" width="180" height="180">
  <rect width="180" height="180" rx="36" fill="{PRIMARY_HEX}"/>
  <image x="{apple_x}" y="{apple_y}" width="{apple_mark_w}" height="{apple_mark_h}" preserveAspectRatio="xMidYMid meet" href="{data_uri_white_mark}" xlink:href="{data_uri_white_mark}"/>
</svg>
"""

    # Write SVGs
    with open(os.path.join(public_brand, "favicon.svg"), "w") as f:
        f.write(favicon_svg)
    with open(os.path.join(src_app, "icon.svg"), "w") as f:
        f.write(favicon_svg)

    with open(os.path.join(public_brand, "apple-icon.svg"), "w") as f:
        f.write(apple_svg)
    with open(os.path.join(src_app, "apple-icon.svg"), "w") as f:
        f.write(apple_svg)

    print("Wrote favicon.svg and apple-icon.svg to public/brand/ and src/app/")

    # 5. Generate high-res raster master (1024x1024) for circular favicon.ico
    super_dim = 2048
    canvas_super = Image.new("RGBA", (super_dim, super_dim), (0, 0, 0, 0))
    draw_super = ImageDraw.Draw(canvas_super)
    draw_super.ellipse([0, 0, super_dim - 1, super_dim - 1], fill=(*PRIMARY_COLOR, 255))
    circle_1024 = canvas_super.resize((1024, 1024), Image.Resampling.LANCZOS)

    # 60% width mark
    mark_w_1024 = int(round(1024 * 0.60))
    mark_h_1024 = int(round(mark_w_1024 * aspect))
    mark_resized_1024 = cropped_mark.resize((mark_w_1024, mark_h_1024), Image.Resampling.LANCZOS)

    white_1024 = Image.new("RGBA", (mark_w_1024, mark_h_1024), (*WHITE_COLOR, 255))
    white_1024.putalpha(mark_resized_1024)

    mark_x_1024 = (1024 - mark_w_1024) // 2
    mark_y_1024 = (1024 - mark_h_1024) // 2

    master_favicon = circle_1024.copy()
    master_favicon.paste(white_1024, (mark_x_1024, mark_y_1024), white_1024)

    # Multi-resolution ICO: 256, 48, 32, 16
    master_256 = master_favicon.resize((256, 256), Image.Resampling.LANCZOS)

    ico_path_app = os.path.join(src_app, "favicon.ico")
    ico_path_public = os.path.join(public_dir, "favicon.ico")
    ico_path_brand = os.path.join(public_brand, "favicon.ico")

    for path in [ico_path_app, ico_path_public, ico_path_brand]:
        master_256.save(path, format="ICO", sizes=[(16, 16), (32, 32), (48, 48), (256, 256)])
        print(f"Saved multi-res ICO to {path}")

    # 6. Generate apple-touch-icon.png (180x180) squircle raster image
    apple_super_dim = 720
    apple_super = Image.new("RGBA", (apple_super_dim, apple_super_dim), (0, 0, 0, 0))
    apple_draw = ImageDraw.Draw(apple_super)
    apple_draw.rounded_rectangle([0, 0, apple_super_dim - 1, apple_super_dim - 1], radius=144, fill=(*PRIMARY_COLOR, 255))
    apple_180 = apple_super.resize((180, 180), Image.Resampling.LANCZOS)

    apple_mark_w_180 = int(round(180 * 0.60))
    apple_mark_h_180 = int(round(apple_mark_w_180 * aspect))
    apple_mark_resized = cropped_mark.resize((apple_mark_w_180, apple_mark_h_180), Image.Resampling.LANCZOS)

    white_apple = Image.new("RGBA", (apple_mark_w_180, apple_mark_h_180), (*WHITE_COLOR, 255))
    white_apple.putalpha(apple_mark_resized)

    apple_pos_x = (180 - apple_mark_w_180) // 2
    apple_pos_y = (180 - apple_mark_h_180) // 2

    apple_180.paste(white_apple, (apple_pos_x, apple_pos_y), white_apple)

    apple_png_public = os.path.join(public_dir, "apple-touch-icon.png")
    apple_png_brand = os.path.join(public_brand, "apple-touch-icon.png")

    for path in [apple_png_public, apple_png_brand]:
        apple_180.save(path, format="PNG", optimize=True)
        print(f"Saved apple touch icon PNG to {path}")

    print("All favicon and brand assets generated successfully.")

if __name__ == "__main__":
    main()
