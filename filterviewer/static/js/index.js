console.log("Test");


class ViewerController {
    constructor(config) {

        this.filterSize = Utils.optional(config, "filterSize", 3);
        this.scaleFactor = Utils.optional(config, "scaleFactor", Math.floor(64 / this.filterSize));
        this.filterDisplaySize = this.filterSize * this.scaleFactor;
        this.filterCanvasController = null;
        this.imagesPerRow = 3;

        this.selectedFilter = null;

        this.filters = null;

        this.setup();
    }


    setup() {
        let self = this; // # so deep bro

        this.filters = [
            Utils.randomImg(this.filterSize,this.filterSize),
            Utils.randomImg(this.filterSize,this.filterSize),
            Utils.randomImg(this.filterSize,this.filterSize),
            Utils.randomImg(this.filterSize,this.filterSize),
        ];

        this.filterCanvasController = new CanvasController({
            canvas: $(".mainCanvas"),
            img_size: this.filterDisplaySize,
            img_per_row: this.imagesPerRow
        });



        // Magic to load imgs

        for (let x = 0; x < this.filters.length; x++) {
            this.filterCanvasController.addImage(this.filters[x]);
        }

        this.filterCanvasController.update();

        this.filterCanvasController.onClick(function (x,y) {
            self.selectedFilter = Utils.twod2oned(x, y, self.imagesPerRow);
            console.log("Filter " + filterIdx + " was pressed at (", x,", ", y,")");

            // TODO Do something with this knowledge

        });
    }

    /**
     * Sets the current image
     * @param image array of pixels
     */
    onClick(callback) {
        this.image = image;
    }


}