

class CanvasController {
    constructor(props) {
        let self = this;

        // Inner images
        this.images = [];

        // Canvas obj
        this.canvas = props["canvas"];

        // Padding between inner images
        this.imagePadding = Utils.optional(props, "padding",  10);

        // Images per canvas row
        this.imagesPerRow = Utils.optional(props, "img_per_row",  5);

        // Image display size ( for scaling purposes )
        this.imageDisplaySize = Utils.optional(props, "img_size",  64);

        // Callback for when canvas is clicked
        this.onClickCallback = null;

        // Mapping mouse click event
        this.canvas.on("mousedown", function (e) {
            Utils.canvasPositionCallback(self.canvas, e, function(x, y) {
                self.onClickCallback.apply(null, self.convertCoords2Image(x,y));
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
            y = /*i < this.imagesPerRow ? 0 :*/ Math.floor(i / this.imagesPerRow) * (this.imageDisplaySize + this.imagePadding) + this.imagePadding;

            this.updateWImage(this.images[i], x, y);
        }
    }

    updateWImage(image, x, y) {
        let canvasObj = this.canvas[0];
        let ctx = canvasObj.getContext("2d");
        let imageData = ctx.createImageData(this.imageDisplaySize, this.imageDisplaySize);
        let data = imageData.data;

        let scaleFactorX = image.getWidth() / this.imageDisplaySize;
        scaleFactorX = scaleFactorX < 1 ? 1 / scaleFactorX : scaleFactorX;
        scaleFactorX = Math.round(scaleFactorX);

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

        let sectorX = this.getCoordSector(mouseX);
        let sectorY = this.getCoordSector(mouseY);

        if (mouseX <= sectorX * (this.imagePadding + this.imageDisplaySize) + this.imagePadding) return [-1, -1];
        if (mouseY <= sectorY * (this.imagePadding + this.imageDisplaySize) + this.imagePadding) return [-1, -1];

        return [sectorX, sectorY];
    }

    getCoordSector(pos) {
        return Math.floor(pos / (this.imageDisplaySize + this.imagePadding));
    }


    setImages(imgs) {
        this.images = imgs;
    }
}