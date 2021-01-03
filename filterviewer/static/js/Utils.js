class Utils {
    static isDefined(x) {
        return x !== undefined && x !== null;
    }

    static optional(map, key, defaultValue) {
        return map && Utils.isDefined(map[key]) ? map[key] : defaultValue;
    }

    static updateImgArrayWithColor(array, color) {
        for (let x = 0; x < array.length; x+=4) {
            Utils.copyPixel(color, array, 0, x);
        }
    }

    static copyImageArr(srcImageArr, targetImgArr) {
        for (let x = 0; x < srcImageArr.length; x+=4) {
            Utils.copyPixel(srcImageArr, targetImgArr, x, x);
        }
    }

    static copyPixel(sourceImgArr, targetImgArr, srcIdx, targetIdx) {
        targetImgArr[targetIdx  ] = sourceImgArr[srcIdx  ];           // some R value [0, 255]
        targetImgArr[targetIdx+1] = sourceImgArr[srcIdx+1];           // some G value
        targetImgArr[targetIdx+2] = sourceImgArr[srcIdx+2];           // some B value
        targetImgArr[targetIdx+3] = sourceImgArr[srcIdx+3];           // set alpha channel
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
           Utils.updateImgArrayWithColor(pixels, color);
        });
        return image;
    }

    static randomImg(width, height) {
        let image = new MyImage(width, height);
        image.updatePixels(function (pixels) {
           Utils.updateImgArrayWithRandom(pixels);
        });
        return image;
    }

    static zoomImg(img, factorX, factorY) {

        factorX = Math.max(1, factorX);
        factorY = Math.max(1, factorY);

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

                        Utils.copyPixel(pixels, res, oldPos, newPos);

                        ey += 1;
                    }
                }

                ex += 1;
            }
        }

        let newImg = new MyImage(img.getWidth() * factorX, img.getHeight() * factorY);
        newImg.setPixels(res);
        return newImg;
    }

    static randomIntFromInterval(min, max) { // min and max included
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static canvasPositionCallback(canvas, event, callback) {
        const rect = canvas[0].getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        callback(x, y);
    }

    static twod2oned(x,y, width) {
        return y * width + x
    }
}