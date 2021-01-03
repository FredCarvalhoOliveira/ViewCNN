console.log("Test");


class ViewerController {
    constructor() {
        this.mainCanvasController = new CanvasController({
            canvas: $(".mainCanvas"),
            img_size: 50
        });

        this.mainCanvasController.addImage(Utils.zoomImg(Utils.solidImg(5,5, [0, 255  , 0, 255]), 10, 10));

        this.mainCanvasController.update();
    }

    /**
     * Sets the current image
     * @param image array of pixels
     */
    setImage(image) {
        this.image = image;


    }

    update() {
        this.mainCanvas
    }

}