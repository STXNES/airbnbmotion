import os
import re
import sys
from io import BytesIO
from pathlib import Path

try:
    import requests
    from PIL import Image
except ImportError as e:
    print(f"[ERROR] Faltan librerías para gif_generator: {e}")
    sys.exit(1)

try:
    import urllib3
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
except Exception:
    pass

ROOT = Path(__file__).resolve().parents[2]
GIF_OUTPUT_DIR = ROOT / "04-VIDEOS" / "gifs"

def clean_company_slug(name_or_url):
    if not name_or_url:
        return "prospect"
    s = str(name_or_url).lower().strip()
    s = re.sub(r'https?://', '', s)
    s = re.sub(r'www\.', '', s)
    s = s.split('/')[0].split('.')[0]
    s = re.sub(r'[^a-z0-9]+', '_', s).strip('_')
    return s or "prospect"

def download_image(url, timeout=10):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
    }
    response = requests.get(url, headers=headers, timeout=timeout, verify=False)
    response.raise_for_status()
    img_bytes = BytesIO(response.content)
    img = Image.open(img_bytes)
    if img.mode != 'RGB':
        img = img.convert('RGB')
    return img

def create_ken_burns_gif(image_input, company_name, duration_sec=3.0, fps=10, target_size=(600, 400), output_path=None):
    company_slug = clean_company_slug(company_name)
    
    if output_path is None:
        GIF_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        output_path = GIF_OUTPUT_DIR / f"{company_slug}.gif"
    else:
        output_path = Path(output_path)
        output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        if isinstance(image_input, Image.Image):
            img = image_input
            if img.mode != 'RGB':
                img = img.convert('RGB')
        elif isinstance(image_input, str) and (image_input.startswith('http://') or image_input.startswith('https://')):
            print(f"[GIF] Descargando imagen desde: {image_input}")
            img = download_image(image_input)
        else:
            img = Image.open(image_input)
            if img.mode != 'RGB':
                img = img.convert('RGB')

        orig_w, orig_h = img.size
        target_w, target_h = target_size
        target_aspect = target_w / target_h

        if (orig_w / orig_h) > target_aspect:
            max_crop_h = orig_h
            max_crop_w = int(orig_h * target_aspect)
        else:
            max_crop_w = orig_w
            max_crop_h = int(orig_w / target_aspect)

        center_x = orig_w / 2.0
        center_y = orig_h / 2.0

        total_frames = int(duration_sec * fps)
        frame_duration = int(1000 / fps)

        frames = []
        for i in range(total_frames):
            progress = i / max(1, total_frames - 1)
            t = progress * progress * (3.0 - 2.0 * progress)

            zoom_factor = 1.0 - (0.18 * t)
            current_cw = max_crop_w * zoom_factor
            current_ch = max_crop_h * zoom_factor

            current_cy = center_y - (center_y * 0.06 * t)

            left = max(0, int(center_x - current_cw / 2.0))
            top = max(0, int(current_cy - current_ch / 2.0))
            right = min(orig_w, int(left + current_cw))
            bottom = min(orig_h, int(top + current_ch))

            cropped = img.crop((left, top, right, bottom))
            resample_filter = getattr(Image, 'Resampling', Image).LANCZOS
            resized = cropped.resize(target_size, resample_filter)
            frames.append(resized)

        try:
            import imageio
            import numpy as np
            frames_np = [np.array(f) for f in frames]
            imageio.mimsave(output_path, frames_np, fps=fps, loop=0)
        except Exception:
            frames[0].save(
                output_path,
                save_all=True,
                append_images=frames[1:],
                duration=frame_duration,
                loop=0,
                optimize=True
            )

        print(f"[GIF SUCCESS] GIF animado generado exitosamente: {output_path}")
        return str(output_path)

    except Exception as e:
        print(f"[GIF WARNING] No se pudo generar el GIF para '{company_name}': {e}")
        return None

def generate_gif_from_url(image_url, company_name, output_path=None):
    if not image_url or not str(image_url).startswith(('http://', 'https://')):
        print(f"[GIF WARNING] URL de imagen vacía o inválida para {company_name}.")
        return None
    return create_ken_burns_gif(image_url, company_name, output_path=output_path)

if __name__ == "__main__":
    if len(sys.argv) > 2:
        url_arg = sys.argv[1]
        name_arg = sys.argv[2]
        res = generate_gif_from_url(url_arg, name_arg)
        print("Resultado:", res)
    else:
        print("Uso: python gif_generator.py <Image_URL> <Empresa_Name>")
