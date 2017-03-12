(function () {
    var MusicVisualizer = require('../../module/music/play.js');

    var home = {
        init: function () {
            this.initMusic();
            worker.init();
            setTimeout(this.fetchData, 10000);
        },
        initMusic: function () {
            let _ = this;
            window.mv = new MusicVisualizer();
            mv.play("public/media/bbg.m4a", false);

            $('body').on('click', '.J-Music', function () {
                var $el = $(this);
                $el.toggleClass('on');
                if ($el.hasClass('on')) { // 播放
                    mv.resume();
                    // $('#music')[0].play();
                } else { // 暂停
                    mv.pause();
                    _.fetchImg();
                    // $('#music')[0].pause();
                }
            });
        },
        fetchData: function () {
            // ajax.jsonp('//www.ly.com/udc/api/getsurvey', {
            //     platform: 'pc',
            //     page: '国内游默认首页'
            // }, function (data) {
            //     console.log(data);
            // });

            fetch('//www.ly.com/udc/api/getsurvey?platform=pc&page=国内游默认首页', {
                mode: "cors"
            })
                .then(status)
                .then(json)
                .then(function (data) {
                    alert(JSON.stringify(data));
                    console.log("请求成功，JSON解析后的响应数据为:", data);
                })
                .catch(function (err) {
                    alert(JSON.stringify(err));
                    console.log("Fetch错误:" + err);
                });
        },
        fetchImg: function () {
            let img = new Image();
            img.src = "../img/bg.jpg";
            img.onload = function (e) {
                alert(JSON.stringify(e));
                console.log(e);
            }
        }
    }

    var worker = {
        init: function () {
            this.initWS();
            this.initWW();
        },
        initWS: function () {
            if ('serviceWorker' in navigator) {
                //接收sw消息
                navigator.serviceWorker.addEventListener('message', function (event) {
                    console.log(event.data);
                });

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

    function status(response) {
        if (response.status >= 200 && response.status < 300) {
            return Promise.resolve(response);
        }
        else {
            return Promise.reject(new Error(response.statusText));
        }
    }
    function json(response) {
        return response.json();
    }

})();