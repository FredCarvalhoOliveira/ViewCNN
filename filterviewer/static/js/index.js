/**
 * Controller for the CNN viewer.
 * Handles filter canvas interaction as well as main
 * image display.
 */
class ViewerController {
    constructor(config) {

        // Filter size in pixels
        this.filterSize = Utils.optional(config, "filterSize", 14);

        // Preferred size is 64 pixels for displaying purposes
        this.scaleFactor = Utils.optional(config, "scaleFactor", Math.floor(100 / this.filterSize));

        // Actual display size after scaling
        this.filterDisplaySize = this.filterSize * this.scaleFactor;

        // Canvas controller for the filters
        this.filterCanvasController = null;

        // How many filters per row // TODO keep here, move, make config?
        this.imagesPerRow = 11;

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
            Utils.randomImg(this.filterSize, this.filterSize),
            Utils.randomImg(this.filterSize, this.filterSize),
            Utils.randomImg(this.filterSize, this.filterSize),
            Utils.randomImg(this.filterSize, this.filterSize),
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
        this.filterCanvasController.onClick(function (x, y) {
            self.selectedFilter = Utils.twod2oned(x, y, self.imagesPerRow);
            console.log("Filter " + self.selectedFilter + " was pressed at (", x, ", ", y, ")");

            self.filterCanvasController.update();
            // TODO Do something with this knowledge :D
        });

        // this.parseJSON2Image();


    }


    update() {
        this.filterCanvasController.setImages(this.filters);
    }

    parseJSON2Image(json) {
        this.filters = [];
        for (let layerKey in json) {
            if (!json.hasOwnProperty(layerKey)) continue;
            let layer = json[layerKey];
            this.filters[layerKey] = [];

            console.log("Layer ", layerKey, " has ", layer.length, " filters");
            for (let i = 0; i < layer.length; i++) {
                let id = layer[i]["id"];
                let data = layer[i]["data"];
                let width = layer[i]["width"];

                // data = Utils.normalizeArray(data);

                let myImage = new MyImage(width, width, layerKey, id);
                let max = -1;
                let min = 1000;
                myImage.updatePixels(function (pixels) {
                    for (let i = 0; i < data.length; i++) {
                        // let newPix = Utils.interpolateHSL([69, 13, 84, 255], [253, 231, 37, 255], data[i]);

                        // let newPix = Utils.interpolateColors([0,0,3, 255], [252,253,164, 255], data[i]);
                        // let newPix = Utils.interpolateHSL([0,3,0, 255], [252,253,164, 255], data[i]);

                        let newPix = Utils.interpolateHSL([69, 13, 84, 255], [253, 231, 37, 255], data[i]); // gud gud
                        // let newPix = Utils.interpolateColors([0, 0, 150, 255], [255, 255, 0, 255], data[i]);
                        // let newPix = Utils.interpolateColors([0, 0, 0, 255], [255, 255, 255, 255], data[i]);
                        max = Math.max(max, data[i]);
                        min = Math.min(min, data[i]);
                        Utils.copyPixel(newPix, pixels, 0, i * 4);
                        // console.log(newPix);
                    }
                    // console.log(pixels);
                    //
                    // console.log("MAX ", max);
                    // console.log("MIN ", min);
                });

                this.filters[layerKey].push(myImage);
            }
        }

        this.filterCanvasController.setImages(this.filters["layer1"]);

        this.filterCanvasController.update();
    }


    loadFilters() {
        let self = this;
        $.get(
            "/test?layer=0",
            function (data) {
                self.filters = JSON.parse(data);
                self.update();
            }
        );
    }
}