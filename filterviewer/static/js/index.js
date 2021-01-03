console.log("Test");


class ViewerController {
    constructor() {
        this.mainCanvasController = new CanvasController({
            canvas: $(".mainCanvas"),
            img_size: 64,
            img_per_row: 1
        });

        this.mainCanvasController.addImage(Utils.zoomImg(Utils.solidImg(16,16, [0, 255  , 0, 255]), 4, 4));
        this.mainCanvasController.addImage(Utils.zoomImg(Utils.solidImg(16,16, [0, 255  , 0, 255]), 4, 4));

        this.mainCanvasController.update();

        this.mainCanvasController.onClick(function (x,y) {
            console.log("MIAU: ", x, y);
        })
    }

    /**
     * Sets the current image
     * @param image array of pixels
     */
    onClick(callback) {
        this.image = image;
    }

    update() {
        this.mainCanvas
    }

}