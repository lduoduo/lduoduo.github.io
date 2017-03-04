(function () {
    var MusicVisualizer = require('../../module/music/play.js');

    var home = {
        init: function () {
            this.initMusic();
            worker.init();
            setTimeout(this.fetchData, 10000);
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
        },
        fetchData: function(){
            ajax.jsonp('//www.ly.com/udc/api/getsurvey',{
                platform: 'pc',
                page: '国内游默认首页'
            },function(data){
                console.log(data);
            });
        }
    }

    var worker = {
        init: function () {
            this.initWS();
            this.initWW();
        },
        initWS: function () {
            if ('serviceWorker' in navigator) {
                // navigator.serviceWorker.register('/public/js/sw.js', { scope: './', insecure: true })
                navigator.serviceWorker.register('public/js/sw.js', { insecure: true })
                    .then(function (registration) {
                        // Registration was successful
                        console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    }).catch(function (err) {
                        // registration failed :(
                        console.log('ServiceWorker registration failed: ', err);
                    });
            }
        },
        initWW: function () {
            var _ = this;
            _.ww = new Worker('public/js/ww.js');
            _.ww.addEventListener('message', function (e) {
                console.log('get message from web workers');
                console.log(e.data);
                //子线程调用完毕关闭
                _.ww.terminate();
            });

            // _.ww.onerror(function (e) {
            //     console.log('err : \n');
            //     console.log(e);
            //     //子线程调用完毕关闭
            //     _.ww.terminate();
            // });

            //或者这种写法
            _.ww.addEventListener('error', function (event) {
                console.log(event);
                //子线程调用完毕关闭
                _.ww.terminate();
            });

            setTimeout(function () {
                console.log('post message to web workers');
                _.ww.postMessage({ method: 'echo', args: ['Work'] });
            }, 5000);
        }
    }

    home.init();

})();