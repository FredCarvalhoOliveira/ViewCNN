/**
 * Controller for the CNN viewer.
 * Handles filter canvas interaction as well as main
 * image display.
 */
class ViewerController {
    constructor(config) {

        // Filter size in pixels
        this.filterSize = Utils.optional(config, "filterSize", 3);

        // Preferred size is 64 pixels for displaying purposes
        this.scaleFactor = Utils.optional(config, "scaleFactor", Math.floor(64 / this.filterSize));

        // Actual display size after scaling
        this.filterDisplaySize = this.filterSize * this.scaleFactor;

        // Canvas controller for the filters
        this.filterCanvasController = null;

        // How many filters per row // TODO keep here, move, make config?
        this.imagesPerRow = 3;

        // Currently selected filter
        this.selectedFilter = null;

        // Filters
        this.filters = null;

        // Main setup routine
        this.setup();
    }


    /**
     *
     */
    setup() {
        let self = this; // # so deep bro

        // TODO get filters from endpoint ajax
        // TODO get filters mapped by layer
        // TODO Magic to load imgs
        // TODO sqrt for width in case it s not given


        // Filter list
        this.filters = [
            Utils.randomImg(this.filterSize,this.filterSize),
            Utils.randomImg(this.filterSize,this.filterSize),
            Utils.randomImg(this.filterSize,this.filterSize),
            Utils.randomImg(this.filterSize,this.filterSize),
        ];


        // Filter canvas definition
        this.filterCanvasController = new CanvasController({
            canvas: $(".mainCanvas"),
            img_size: this.filterDisplaySize,
            img_per_row: this.imagesPerRow
        });

        // Populate canvas images
        for (let x = 0; x < this.filters.length; x++) {
            this.filterCanvasController.addImage(this.filters[x]);
        }

        // Redraw canvas
        this.filterCanvasController.update();

        // Map canvas onClick
        this.filterCanvasController.onClick(function (x,y) {
            self.selectedFilter = Utils.twod2oned(x, y, self.imagesPerRow);
            console.log("Filter " + self.selectedFilter + " was pressed at (", x,", ", y,")");

            // TODO Do something with this knowledge :D
        });


    }
}