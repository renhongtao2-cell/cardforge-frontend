from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import httpx
from typing import Optional
import os
import glob

from services.url_scraper import URLMetadata, fetch_url_metadata
from app.config import (
    CARD_WIDTH, CARD_HEIGHT, DEFAULT_BG_COLOR,
    DEFAULT_TEXT_COLOR, DEFAULT_ACCENT_COLOR
)


def _load_font(size: int):
    '''Try to load a TrueType font, fall back to default.'''
    # Try common font paths for Linux/Vercel serverless
    font_paths = [
        '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
        '/usr/share/fonts/TTF/DejaVuSans.ttf',
        'C:/Windows/Fonts/arial.ttf',
        'arial.ttf',
    ]
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except Exception:
                continue
    # Last resort: default bitmap font
    return ImageFont.load_default()


class CardGenerator:
    @staticmethod
    async def generate_card(
        metadata: URLMetadata,
        bg_color: str = None,
        text_color: str = None,
        accent_color: str = None,
        custom_title: str = None,
        custom_description: str = None,
    ) -> bytes:
        bg_color = bg_color or DEFAULT_BG_COLOR
        text_color = text_color or DEFAULT_TEXT_COLOR
        accent_color = accent_color or DEFAULT_ACCENT_COLOR

        img = Image.new('RGB', (CARD_WIDTH, CARD_HEIGHT), bg_color)
        draw = ImageDraw.Draw(img)

        # Load fonts with proper fallback
        title_font = _load_font(48)
        desc_font = _load_font(32)
        domain_font = _load_font(24)
        cta_font = _load_font(28)

        # Draw accent bar at top
        draw.rectangle([0, 0, CARD_WIDTH, 8], fill=accent_color)

        # Draw domain badge
        domain_bbox = draw.textbbox((60, 40), metadata.domain, font=domain_font)
        domain_w = domain_bbox[2] - domain_bbox[0]
        draw.rounded_rectangle(
            [(60 - 10, 30), (60 + domain_w + 10, 65)],
            radius=15,
            fill=accent_color + '40',
        )
        draw.text((60, 38), metadata.domain, fill=text_color, font=domain_font)

        # Draw title with word wrap
        title = custom_title or metadata.title
        wrapped_title = CardGenerator._wrap_text(title, draw, title_font, CARD_WIDTH - 120)
        y = 100
        for line in wrapped_title:
            draw.text((60, y), line, fill=text_color, font=title_font)
            y += 60

        # Draw description with word wrap
        desc = custom_description or metadata.description
        if not desc:
            desc = 'Click to learn more'
        wrapped_desc = CardGenerator._wrap_text(desc, draw, desc_font, CARD_WIDTH - 120)
        y += 30
        for line in wrapped_desc[:4]:
            draw.text((60, y), line, fill=text_color + 'CC', font=desc_font)
            y += 45

        # Draw bottom bar
        draw.rectangle([0, CARD_HEIGHT - 60, CARD_WIDTH, CARD_HEIGHT], fill=accent_color)

        # Load and draw favicon
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                fav_resp = await client.get(metadata.favicon)
                if fav_resp.status_code == 200:
                    fav_img = Image.open(BytesIO(fav_resp.content)).resize((32, 32))
                    mask = fav_img.split()[0] if len(fav_img.split()) > 1 else None
                    img.paste(fav_img, (50, CARD_HEIGHT - 50), mask)
        except Exception:
            pass

        # Draw CTA text
        try:
            cta_bbox = draw.textbbox((0, 0), 'Click to visit ->', font=cta_font)
            cta_w = cta_bbox[2] - cta_bbox[0]
            draw.text(
                ((CARD_WIDTH - cta_w) // 2, CARD_HEIGHT - 45),
                'Click to visit ->',
                fill='#ffffff',
                font=cta_font,
            )
        except Exception:
            pass

        # Save to bytes
        buffer = BytesIO()
        img.save(buffer, format='PNG', optimize=True)
        buffer.seek(0)

        return buffer.getvalue()

    @staticmethod
    def _wrap_text(text: str, draw, font, max_width: int) -> list:
        words = text.split()
        lines = []
        current_line = ''

        for word in words:
            test_line = f'{current_line} {word}'.strip()
            bbox = draw.textbbox((0, 0), test_line, font=font)
            if bbox[2] - bbox[0] <= max_width:
                current_line = test_line
            else:
                lines.append(current_line)
                current_line = word

        if current_line:
            lines.append(current_line)

        return lines[:5]  # Max 5 lines
