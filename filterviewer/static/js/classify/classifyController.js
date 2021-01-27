

class ClassifyController {
    constructor(props) {
        let self = this;
        // $('.myCanvas').css('background-color', 'rgba(50, 50, 50, 1)');

        $("#classifyBttn").click(function(){
            var imgUrl = $("#imageUrl").val();

            if (imgUrl !== "") {
                $("#imgPreview").attr("src", imgUrl);
                $("#classification").text('');
                $("#loadWheel").show();
                self.classify(imgUrl)
            }
        });
    }

    classify(imageUrl){
        let self = this;
        $.post(
            "/classify/getClass",
            {imgUrl: imageUrl},
            function (data) {
                $("#classification").text("I think this is a " + data['class']);
                $("#loadWheel").hide();

                self.buildFeatureMaps(data['featureMaps']);
            }
        );
    }

    buildFeatureMaps(featureMaps){
        let self = this;

        let featureMapsDiv = $('.featureMaps');
        featureMapsDiv.html(''); //reset old maps

        for(let layerId in featureMaps){
            if (featureMaps.hasOwnProperty(layerId)) {
                let layerDiv = $("<div id='" + layerId + "' class='layerMaps'></div>");
                featureMapsDiv.append(layerDiv);
                self.buildLayer(layerDiv, featureMaps[layerId]);
            }
        }
    }

    buildLayer(layerDiv, layerData){
        let self = this;

        for(let mapId in layerData){
            if (layerData.hasOwnProperty(mapId)) {
                let layerId = layerDiv.attr('id');
                let mapCanvasId = layerId + "m" + mapId;
                let mapCanvas = $("<canvas id='" + mapCanvasId + "' class='mapCanvas' width='100' height='100'></canvas>");
                layerDiv.append(mapCanvas);
                self.buildFeatureMap(mapCanvasId, layerData[mapId]);
            }
        }
    }

    buildFeatureMap(mapCanvasId, mapData){


        let canvas    = document.getElementById(mapCanvasId);
        let ctx       = canvas.getContext('2d');
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let data      = imageData.data;

        let pixels = mapData['data'];
        console.log(pixels);
        let pixelIdx = 0;


        // console.log(featureMaps);
        // // console.log(data);
        for (var i = 0; i < data.length; i += 4) {
            // var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i]     = pixels[pixelIdx]; // red
            data[i + 1] = pixels[pixelIdx]; // green
            data[i + 2] = pixels[pixelIdx]; // blue
            data[i + 3] = 255; // blue
            pixelIdx += 1;
        }
        ctx.putImageData(imageData, 0, 0);
    }
}