/** 轮播通用小工具:
 * 1. 简单的轮播，仅供用户反馈图片查看使用
 */
function mySlider(para) {
    var timer = null;
    var curIndex = 0;
    var imgLen = $(".slider-item").length;
    var imgSize = para.imgSize || 580;
    $(".slider-wrap").width(imgSize)
    $(".slider").width(imgLen * imgSize)

    function changeTime(index) {
        if (index < imgLen - 1) {
            index++;
        } else {
            index = 0;
        }
    }
    function changeTo(index) {
        //动画渐入效果
        var goLeft = index * imgSize;
        $(".slider").stop(false, true).animate({
            left: "-" + goLeft + "px"
        }, 200, function() {
            curIndex = index;
        });
    }
    $('.slider-pre').click(function() {
            var index;
            clearInterval(timer);
            if (curIndex == 0) {
                index = imgLen - 1
                changeTo(index);
                changeTime(index)
            } else {
                index = curIndex - 1
                changeTo(index);
                changeTime(index)
            }
            $(".currentIndex").text(index + 1)
        })
        //点击下一张图的事件
    $('.slider-next').click(function() {
        var index;
        clearInterval(timer);
        if (curIndex == imgLen - 1) {
            index = 0
            changeTo(index);
            changeTime(index)
        } else {
            index = curIndex + 1
            changeTo(index);
            changeTime(index)
        }
        $(".currentIndex").text(index + 1)

    })
    $(".slider-item").hover(
        function() {
            clearInterval(timer);
        },
        function() {
            changeTime(curIndex);
        }
    )
    $(".slider-operate > span").hover(
        function() {
            clearInterval(timer);
        },
        function() {
            changeTime(curIndex);
        }
    )
    $(".slider-rotate").click(function() {
        var now = $($(".slider-item")[curIndex]).attr("data-rotate");
        var next = Number(now) + 90;
        var imgWidth;
        if ((next/90)%2 == 0) {
            imgWidth = imgSize + "px";
        } else {
            imgWidth = "380px"
        }
        $($(".slider-item")[curIndex]).find("img").css({'transform':'translate(-50%,-50%) rotate(' + next + 'deg)','max-width':imgWidth});
        $($(".slider-item")[curIndex]).attr("data-rotate", next);
    })
}

module.exports = mySlider;