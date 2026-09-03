from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from subprocess import DEVNULL, run
from tempfile import TemporaryDirectory

from PIL import Image, ImageFilter, ImageOps


ROOT = Path.cwd()
SOURCE = ROOT / "tmp/pdfs/ple1a_pages"
OUTPUT = ROOT / "tmp/pdfs/ple1a_tsv_enhanced_sparse"
OUTPUT.mkdir(parents=True, exist_ok=True)


def process(image_path: Path) -> str:
    target = OUTPUT / f"{image_path.stem}.tsv"
    with TemporaryDirectory(prefix="ple1a-ocr-") as temporary:
        enhanced_path = Path(temporary) / f"{image_path.stem}.png"
        image = Image.open(image_path).convert("L")
        image = ImageOps.autocontrast(image, cutoff=1)
        image = image.resize((image.width * 2, image.height * 2), Image.Resampling.LANCZOS)
        image = image.filter(ImageFilter.SHARPEN)
        image.save(enhanced_path)
        run(
            ["tesseract", str(enhanced_path), str(target.with_suffix("")), "-l", "eng", "--psm", "11", "tsv"],
            check=True,
            stdout=DEVNULL,
            stderr=DEVNULL,
        )
    return image_path.name


files = sorted(SOURCE.glob("page-*.jpg"))
with ThreadPoolExecutor(max_workers=4) as executor:
    completed = list(executor.map(process, files))

print(f"Generated enhanced sparse OCR for {len(completed)} pages.")
