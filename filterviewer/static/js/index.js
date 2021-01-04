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

            // TODO Do something with this knowledge :D
        });

        this.parseJSON2Image({"layer0": [{"id": "0", "data": [0.3971698582172394, 0.31861457228660583, 0.4983910620212555, 0.5896332859992981, 0.6384363770484924, 0.5931808352470398, 0.7302043437957764, 0.5806782841682434, 0.6142889857292175, 0.30400747060775757, 0.622819721698761, 0.3517301678657532, 0.6987859010696411, 0.5934632420539856, 0.3631083071231842, 0.5178955793380737, 0.5462794303894043, 0.38420987129211426, 0.5576760768890381, 0.6659056544303894, 0.3555488586425781, 0.630320131778717, 0.6337684988975525, 0.5170328617095947, 0.583040714263916, 0.3287041485309601, 0.47470322251319885, 0.5156002044677734, 0.5079129934310913, 0.6718637943267822, 0.6384830474853516, 0.5289868712425232, 0.5876734256744385, 0.5441126823425293, 0.6802204847335815, 0.6196412444114685, 0.5755706429481506, 0.37921276688575745, 0.49859359860420227, 0.5466054081916809, 0.5072687268257141, 0.40565401315689087, 0.7147571444511414, 0.47879621386528015, 0.622133195400238, 0.5945435762405396, 0.6397559642791748, 0.35855281352996826, 0.4708237946033478, 0.5714093446731567, 0.3560048043727875, 0.5423521399497986, 0.44186535477638245, 0.5947197079658508, 0.5644584894180298, 0.4736836850643158, 0.6296706795692444, 0.6678115129470825, 0.5478363037109375, 0.42296016216278076, 0.4765143096446991, 0.335640013217926, 0.704658031463623, 0.41087520122528076, 0.4137457609176636, 0.3289124667644501, 0.3429138958454132, 0.7357197403907776, 0.4304039478302002, 0.7131574749946594, 0.49059632420539856, 0.38238421082496643, 0.6007072329521179, 0.3786555528640747, 0.3123140037059784, 0.5944675207138062, 0.7262563109397888, 0.4698146879673004, 0.7144509553909302, 0.5896039605140686, 0.5850153565406799, 0.5784447193145752, 0.6167576313018799, 0.5517404079437256, 0.4108237326145172, 0.54254549741745, 0.34988096356391907, 0.5056281089782715, 0.4781809449195862, 0.4736144542694092, 0.6768004298210144, 0.5992997288703918, 0.38194501399993896, 0.5568858981132507, 0.3806361258029938, 0.48995324969291687, 0.5857995748519897, 0.613166093826294, 0.3957376480102539, 0.4352826476097107, 0.5276731252670288, 0.6212724447250366, 0.33102840185165405, 0.6012455821037292, 0.46971774101257324, 0.5157337784767151, 0.4952434301376343, 0.4946630597114563, 0.5641171932220459, 0.46374934911727905, 0.5726925730705261, 0.5543131828308105, 0.611698567867279, 0.4995627999305725, 0.6217154264450073, 0.40178337693214417, 0.39199450612068176, 0.4470769166946411, 0.31613147258758545, 0.42100298404693604, 0.4112064838409424, 0.38290566205978394, 0.7011473178863525, 0.5765752792358398, 0.35192063450813293, 0.6631566882133484, 0.5936474204063416, 0.46489661931991577, 0.5508437752723694, 0.38605138659477234, 0.5982040762901306, 0.43083491921424866, 0.44094038009643555, 0.585645854473114, 0.7145199179649353, 0.47421351075172424, 0.6263596415519714, 0.5611113905906677, 0.5914175510406494, 0.7167945504188538, 0.3294348120689392, 0.6656777858734131, 0.6625723838806152, 0.7312586903572083, 0.41924944519996643, 0.3271401822566986, 0.6023931503295898, 0.6174214482307434, 0.5697723031044006, 0.571215808391571, 0.5712616443634033, 0.3066002130508423, 0.5221922993659973, 0.41174158453941345, 0.5541925430297852, 0.639119565486908, 0.4487244784832001, 0.6232466101646423, 0.7137181162834167, 0.6339864134788513, 0.41898396611213684, 0.6244104504585266, 0.6335694789886475, 0.7189926505088806, 0.37815240025520325, 0.34142395853996277, 0.6242459416389465, 0.3468618392944336, 0.5508040189743042, 0.3613131642341614, 0.32897046208381653, 0.5353509187698364, 0.6291413307189941, 0.7393943071365356, 0.5507999658584595, 0.3920879364013672, 0.4256840646266937, 0.39456722140312195, 0.6673353910446167, 0.5489298105239868, 0.4616127014160156, 0.7015762329101562, 0.6795065999031067, 0.33372732996940613, 0.4783082902431488, 0.5482413172721863, 0.7331697940826416, 0.7489585280418396, 0.419988214969635, 0.6937198042869568, 0.7350851893424988, 0.36580559611320496, 0.5205140709877014, 0.4486533999443054, 0.6294873952865601, 0.3396047055721283], "width": 14}]})


    }



    update() {
        this.filterCanvasController.setImages(this.filters);
    }

    parseJSON2Image(json) {
        this.filters = [];
        for (let layerKey in json) {
            if (!json.hasOwnProperty(layerKey)) continue;
            let layer = json[layerKey];
            for (let i = 0; i < layer.length; i++) {
                let id = layer[i]["id"];
                let data = layer[i]["data"];
                let width = layer[i]["width"];

                // data = Utils.normalizeArray(data);

                let myImage = new MyImage(width, width, layerKey, id);
                let max = -1;
                let min = 1000;
                myImage.updatePixels(function(pixels) {
                    for (let i = 0; i < data.length; i++) {
                        let newPix = Utils.interpolateColors([69, 13, 84, 255], [253, 231, 37, 255], data[i]);
                        // let newPix = Utils.interpolateColors([255, 255, 255, 255], [0, 0, 0, 255], data[i]);
                        max = Math.max(max, data[i]);
                        min = Math.min(min, data[i]);
                        Utils.copyPixel(newPix, pixels, 0, i * 4);
                        console.log(newPix);
                    }
                    console.log(pixels);

                    console.log("MAX ", max);
                    console.log("MIN ", min);
                });

                this.filters.push(myImage);
            }
        }

        this.filterCanvasController.setImages(this.filters);

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