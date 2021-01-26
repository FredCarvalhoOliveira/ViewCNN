

class ClassifyController {
    constructor(props) {
        let self = this;

        console.log("ClassifyController");

        $("#classifyBttn").click(function(){
            var imgUrl = $("#imageUrl").val();

            $("#imgPreview").attr("src", imgUrl);
            $("#classification").text('');
            $("#loadWheel").show();

            self.classify(imgUrl)
        });
    }

    classify(imageUrl){
        $.post(
            "/classify/getClass",
            {imgUrl: imageUrl},
            function (data) {
                console.log(data);
                console.log(data['class']);
                // classification = data['class'];
                $("#classification").text("I think this is a " + data['class']);
                $("#loadWheel").hide();
            }
        );
    }
}