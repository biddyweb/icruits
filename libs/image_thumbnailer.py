from sorl.thumbnail import get_thumbnail


IMAGE_COEFFICIENTS = {
    'XXXL': 1,
    'XXL': 0.75,
    'XL': 0.5,
    'L': 0.25,
    'S': 0.125
}


def get_responsive_image(image, image_size):
    image_size.upper()
    if image_size not in IMAGE_COEFFICIENTS:
        return image
    width = int(image.width * IMAGE_COEFFICIENTS[image_size])
    height = int(image.height * IMAGE_COEFFICIENTS[image_size])
    return get_thumbnail(image, '{}x{}'.format(str(width), str(height)), crop='center', quality=99)


def get_responsive_image_url(image, image_size):
    return get_responsive_image(image, image_size).url
