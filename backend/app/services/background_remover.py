from pathlib import Path
from rembg import remove
from PIL import Image


def remove_background(input_path: str, output_path: str):

    input_file = Path(input_path)
    output_file = Path(output_path)

    with open(input_file, "rb") as f:
        input_data = f.read()

    output_data = remove(input_data)

    with open(output_file, "wb") as f:
        f.write(output_data)

    return str(output_file)