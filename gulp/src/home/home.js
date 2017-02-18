(function () {
    var MusicVisualizer = require('../../module/music/play.js');
    
    var home = {
        init: function(){
            this.initMusic();
        },
        initMusic: function () {
            window.mv = new MusicVisualizer();
            mv.play("public/media/bg.m4a", false);

            $('body').on('click', '.J-Music', function () {
                var $el = $(this);
                $el.toggleClass('on');
                if ($el.hasClass('on')) { // 播放
                    mv.resume();
                    // $('#music')[0].play();
                } else { // 暂停
                    mv.pause();
                    // $('#music')[0].pause();
                }
            });
        }
    }

    home.init();

})();