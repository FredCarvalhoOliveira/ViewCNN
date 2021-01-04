class MyImage {
    constructor(width, height, layer, id) {
        this.width = width;
        this.height = height;
        this.layer = layer;
        this.id = id;

        this.pixels = new Uint8ClampedArray(width * height * 4);
    }


    setPixels(pixels) {
        this.pixels = pixels;
    }

    getPixels() {
        return this.pixels;
    }

    updatePixels(callback) {
        callback && callback(this.pixels);
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    setWidth(newWidth) {
        this.width = newWidth;
    }

    setHeight(newHeight) {
        this.height = newHeight;
    }

}