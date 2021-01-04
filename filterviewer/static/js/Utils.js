class Utils {
    static isDefined(x) {
        return x !== undefined && x !== null;
    }

    static optional(map, key, defaultValue) {
        return map && Utils.isDefined(map[key]) ? map[key] : defaultValue;
    }

    static updateImgArrayWithColor(array, color) {
        for (let x = 0; x < array.length; x += 4) {
            Utils.copyPixel(color, array, 0, x);
        }
    }

    static copyImageArr(srcImageArr, targetImgArr) {
        for (let x = 0; x < srcImageArr.length; x += 4) {
            Utils.copyPixel(srcImageArr, targetImgArr, x, x);
        }
    }

    static copyPixel(sourceImgArr, targetImgArr, srcIdx, targetIdx) {
        targetImgArr[targetIdx] = sourceImgArr[srcIdx];           // some R value [0, 255]
        targetImgArr[targetIdx + 1] = sourceImgArr[srcIdx + 1];           // some G value
        targetImgArr[targetIdx + 2] = sourceImgArr[srcIdx + 2];           // some B value
        targetImgArr[targetIdx + 3] = sourceImgArr[srcIdx + 3];           // set alpha channel
    }

    static updateImgArrayWithRandom(array) {
        for (let x = 0; x < array.length; x += 4) {
            array[x] = Utils.randomIntFromInterval(0, 255);           // some R value [0, 255]
            array[x + 1] = Utils.randomIntFromInterval(0, 255);           // some G value
            array[x + 2] = Utils.randomIntFromInterval(0, 255);           // some B value
            array[x + 3] = 255;                                          // set alpha channel
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

    static twod2oned(x, y, width) {
        return y * width + x
    }

    static normalizeArray(array) {
        let result = [];
        for (let i = 0; i < array.length; i++) {
            result[i] = (array[i] + 1) / 2;// [-1, 1] + 1 = [0, 2] / 2 = [0, 1]
        }
        return result;
    }

    static interpolateColors(left, right, percentage) {
        let newColor = [];
        for (let i = 0; i < 3; i++) {
            newColor[i] = Math.round(left[i] + (right[i] - left[i]) * percentage);
        }
        newColor[3] = 255;
        return newColor;
    }

    static interpolateHSL(color1, color2, factor) {
        if (arguments.length < 3) {
            factor = 0.5;
        }
        let hsl1 = Utils.rgb2hsl(color1);
        let hsl2 = Utils.rgb2hsl(color2);
        for (let i = 0; i < 3; i++) {
            hsl1[i] += factor * (hsl2[i] - hsl1[i]);
        }
        let res = Utils.hsl2rgb(hsl1);
        res[3] = 255;
        return res;

    }

    static rgb2hsl(color) {
        var r = color[0] / 255;
        var g = color[1] / 255;
        var b = color[2] / 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return [h, s, l];
    }

    static hsl2rgb(color) {
        let l = color[2];

        if (color[1] === 0) {
            l = Math.round(l * 255);
            return [l, l, l];
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var s = color[1];
            var q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
            var p = 2 * l - q;
            var r = hue2rgb(p, q, color[0] + 1 / 3);
            var g = hue2rgb(p, q, color[0]);
            var b = hue2rgb(p, q, color[0] - 1 / 3);
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
    }

}