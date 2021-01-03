

class CanvasController {
    constructor(props) {
        this.images = [];
        this.canvas = props["canvas"];

        this.imagePadding = Utils.optional(props, "padding",  10);
        this.imagesPerRow = Utils.optional(props, "img_per_row",  5);
        this.imageDisplaySize = Utils.optional(props, "img_size",  32);

        this.onClickCallback = null;
        let self = this;


        this.canvas.on("mousedown", function (e) {
            Utils.canvasPositionCallback(self.canvas, e, function(x, y) {

            });
        })

        // TODO set size of canvas based on parameters
        // TODO OR
        // TODO change parameters based on size of canvas

    }

    update() {
        let canvasObj = this.canvas[0];
        let ctx = canvasObj.getContext("2d");
        ctx.fillRect(0,0, this.canvas[0].width, this.canvas[0].height);
        ctx.imageSmoothingEnabled = false;

        let x = 0;
        let y = 0;

        for (let i = 0; i < this.images.length; i++) {

            x = (i % this.imagesPerRow) * (this.imageDisplaySize + this.imagePadding) + this.imagePadding;
            y = /*i < this.imagesPerRow ? 0 :*/ (i / this.imagesPerRow) * (this.imageDisplaySize + this.imagePadding) + this.imagePadding;

            this.updateWImage(this.images[i], x, y);
        }
    }

    updateWImage(image, x, y) {
        let canvasObj = this.canvas[0];
        let ctx = canvasObj.getContext("2d");
        let imageData = ctx.createImageData(this.imageDisplaySize, this.imageDisplaySize);
        let data = imageData.data;
        let scaleFactorX = Math.ceil(image.getWidth() / this.imageDisplaySize);

        image = Utils.zoomImg(image, scaleFactorX, scaleFactorX);

        let imagePixels = image.getPixels();

        Utils.copyImageArr(imagePixels, data);

        ctx.putImageData(imageData, x, y);
    }

    addImage(image, idx) {
        this.images.splice(idx, 0, image);
    }

    /**
     * Callback called when canvas is clicked
     * @param callback Receives x,y of position clicked on canvas
     */
    onClick(callback) {
        this.onClickCallback = callback;
    }

    convertCoords2Image(mouseX, mouseY) {

        for (let i = 0; i < this.images.length; i++) {
            let x = i % this.imagesPerRow;
            let y = i / this.imagesPerRow;


        }
        // [padding, padding + size] = 0
        // [padding + size

        return this.images[0];
    }

}