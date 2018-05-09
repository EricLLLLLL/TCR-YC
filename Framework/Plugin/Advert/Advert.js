(function () {
    window.Advert = function () {
        var Files = new dynamicLoadFiles();
        var Path = "./Framework/Plugin/Advert/Advert.xml" //"Advert.xml";
        var PlginDiv = "AdvertDiv";

        var index = 0;
        var adTimer;
        var flag = 0;

        this.InsertAdv = function (DivItem) {
            Files.InsertPlgin(Path, DivItem, PlginDiv);
            var len = $(".slider > li").length;

            adTimer = setInterval(function () {
                if (flag == 0) {
                    index++;
                } else if (flag == 1) {
                    index--;
                }
                if (index == len - 1) {
                    flag = 1;
                }
                if (index == 0) {
                    flag = 0;
                }
                showImg(index);
            }, 5000);
        };
        this.removeAdv = function () {
            window.clearInterval(adTimer);
        };

        // 通过控制显示不同的图片
        var showImg = function (index) {
            var adHeight = $(".advDiv").width();
            $(".slider img:lt(" + index + ")").hide();
            $(".slider img:gt(" + index + ")").hide();
            $(".slider img:eq(" + index + ")").show();
        }
    }
})();