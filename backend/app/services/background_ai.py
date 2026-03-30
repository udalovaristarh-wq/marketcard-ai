import numpy as np

def gradient_background(width, height):

    img = np.zeros((height,width,3),dtype=np.uint8)

    for y in range(height):

        color = int(255*(y/height))

        img[y,:,0] = color
        img[y,:,1] = color
        img[y,:,2] = 255

    return img