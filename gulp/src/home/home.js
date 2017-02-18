(function () {
    var home = {
        init: function(){
            this.initMusic();
        },
        initMusic: function () {
            $('body').on('click', '.J-Music', function () {
                var $el = $(this);
                $el.toggleClass('on');
                if ($el.hasClass('on')) { // 播放
                    $('#music')[0].play();
                } else { // 暂停
                    $('#music')[0].pause();
                }
            });
        }
    }

    home.init();

});