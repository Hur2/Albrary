import time
import io
import numpy as np
from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True

from rembg.bg import remove as remove_bg


def show_rembg(path):
    orig_img = Image.open(path)

    # show bg removed image
    f = np.fromfile(path)

    started = time.time()
    result = remove_bg(f)
    elapsed = time.time() - started
    print(f'it takes {elapsed} seconds for removing bg.')

    img = Image.open(io.BytesIO(result)).convert("RGBA")
    img.save('./result.jpeg', "JPEG")


# Usage
show_rembg('./car.jpeg')
