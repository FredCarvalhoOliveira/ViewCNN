class Utils {
    static isDefined(x) {
        return x !== undefined && x !== null;
    }

    static optional(map, key, defaultValue) {
        return Utils.isDefined(map[key]) ? map[key] : defaultValue;
    }

    static solidImgArray(width, height, color) {
        let res = new Uint8ClampedArray(width * height * 4);
        this.updateImgArrayWithColor(res, color);
        return res;
    }

    static updateImgArrayWithColor(array, color) {
        for (let x = 0; x < array.length; x+=4) {
            array[x  ] = color[0];           // some R value [0, 255]
            array[x+1] = color[1];           // some G value
            array[x+2] = color[2];           // some B value
            array[x+3] = color[3];           // set alpha channel
        }
    }

    static updateImgArrayWithRandom(array) {
        for (let x = 0; x < array.length; x+=4) {
            array[x  ] = Utils.randomIntFromInterval(0,255);           // some R value [0, 255]
            array[x+1] = Utils.randomIntFromInterval(0,255);           // some G value
            array[x+2] = Utils.randomIntFromInterval(0,255);           // some B value
            array[x+3] = 255;                                          // set alpha channel
        }
    }

    static solidImg(width, height, color) {
        let image = new MyImage(width, height);
        image.updatePixels(function (pixels) {
           Utils.updateImgArrayWithRandom(pixels);
        });
        return image;
    }

    static zoomImg(img, factorX, factorY) {

        let res = new Uint8ClampedArray(img.getWidth() * factorX * img.getHeight() * factorY * 4);

        let newPos = 0;
        let oldPos = 0;
        let pixels = img.getPixels();

        let max = -1;

        let ex = 1;
        let ey = 1;
        for (let x = 0; x < img.getWidth(); x++) {
            ex--;
            for (let i = 0; i < factorX; i++) {
                ey = 1;
                for (let y = 0; y < img.getHeight(); y++) {
                    ey--;
                    for (let j = 0; j < factorY; j++) {
                        newPos = ((y + ey) * (img.getWidth() * factorX) + (x + ex)) * 4;
                        oldPos = (y * img.getWidth() + x) * 4;
                        max = Math.max(max, oldPos);

                        res[newPos  ] = pixels[oldPos  ];           // some R value [0, 255]
                        res[newPos+1] = pixels[oldPos+1];           // some G value
                        res[newPos+2] = pixels[oldPos+2];           // some B value
                        res[newPos+3] = pixels[oldPos+3];           // set alpha channel

                        ey += 1;
                    }
                }

                ex += 1;
            }
        }

        img.setPixels(res);
        img.setHeight(img.getHeight() * factorY);
        img.setWidth(img.setWidth() * factorX);

        return img;
    }

    static randomIntFromInterval(min, max) { // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    }
}