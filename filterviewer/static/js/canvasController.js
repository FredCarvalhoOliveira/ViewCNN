

class CanvasController {
    constructor(props) {
        this.images = [];
        this.canvas = props["canvas"];
        // console.log(this.canvas);

        this.imagePadding = Utils.optional(props, "padding",  5);
        this.imagesPerRow = Utils.optional(props, "img_per_row",  5);
        this.imageDisplaySize = Utils.optional(props, "img_size",  32);

    }

    update() {
        let canvasObj = this.canvas[0];
        let ctx = canvasObj.getContext("2d");
        ctx.fillRect(0,0, this.canvas[0].width, this.canvas[0].height);
        ctx.imageSmoothingEnabled = false;

        let x = 0;
        let y = 0;

        for (let i = 0; i < this.images.length; i++) {
            x = i % this.imagesPerRow + this.imagePadding;
            y = /*i < this.imagesPerRow ? 0 :*/ i / this.imagesPerRow + this.imagePadding;
            // console.log(x,y);

            let imageData = ctx.createImageData(this.imageDisplaySize, this.imageDisplaySize);
            let data = imageData.data;
            let imagePixels = this.images[i].getPixels();
            // console.log(data.length);
            // console.log(data);
            for (let pix = 0; pix < data.length; pix += 4) {
                data[pix] = this.images[i][pix]           // R
                data[pix + 1] = imagePixels[pix + 1]   // G
                data[pix + 2] = imagePixels[pix + 2]   // B
                data[pix + 3] = imagePixels[pix + 3]   // A
            }

            // console.log(data);

            ctx.putImageData(imageData, x, y);
        }
    }

    addImage(image, idx) {
        this.images.splice(idx, 0, image);
    }



}