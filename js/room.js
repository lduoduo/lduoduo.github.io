/**
test
 */

var my = {
    sex: null, //性别，每个人签到必选
    info: {}, //签到后自己的信息
    list: [], //所有男女的签到列表
    femalelist: [], //签到的男列表
    malelist: [], //签到的女列表
    addedlist: [], //刚签到进来的列表
    isReady: false, //socket是否链接好
    timer: null, //显示签到人的定时器
}

var local = localStorage || window.localStorage; //本地存储，签到成功后再次刷新页面无需再次签到
var Mt = {
    alert: function (option) {
        //type, title, msg, btnMsg, cb, isLoading
        swal({
            title: option.title,
            text: option.msg,
            type: option.type,
            showConfirmButton: !!option.confirmBtnMsg,
            showCancelButton: !!option.cancelBtnMsg,
            cancelButtonText: option.cancelBtnMsg || "在犹豫一下",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: option.btnMsg || "好哒",
            showLoaderOnConfirm: option.isLoading,
            timer: option.timer,
            closeOnConfirm: false,
            html: option.html
        }, option.cb);
    },
    close: function () {
        swal.close();
    }
}; //弹窗插件配置


var s = {
    //初始化总入口
    init: function () {
        this.initEvent();
        FastClick.attach(document.body);
        sw.init();
    },
    
    //发送消息
    sendMsg: function (msg) {
        socket.send(my.info, msg);
    },
    //离开房间
    leave: function () {
        socket.emit('leave');
    },
    //join 房间
    join: function () {
        socket.emit('join', my.info);
    },
    //初始化各种交互事件
    initEvent: function () {
        // 发送消息
        $('.J-msg-in').keydown(function (e) {
            if (e.which === 13) {
                e.preventDefault();
                var msg = $(this).val();
                if (msg == "") {
                    return;
                }
                $(this).val('');
//                 s.sendMsg(msg);
            }
        });

        $('body')
            //签到选择男女
            .on('click', '.J-sex-select .radio', function (e) {
                my.sex = $(e.target).val();
                my.isReady = true;
                my.info.sex = my.sex;
                s.initSocket();
                setTimeout(s.join, 0);
            })
            //发送聊天消息
            .on('click', '.J-send-msg', function (e) {
                var msg = $('.J-msg-in').val();
                if (msg == "") {
                    return;
                }
                $('.J-msg-in').val('');
                s.sendMsg(msg);
            })
    },
    //定时显示签到的人
    initTimer: function () {
        my.timer = setInterval(function () {
            if (my.addedlist.length > 0) {
                var tmp = my.addedlist.shift();
                my.list.push(tmp);
                my[tmp.sex + 'list'].push(tmp);
                Mt.alert({
                    title: '',
                    confirmBtnMsg: false,
                    msg: '<div class="alert-img"><img src="/img/' + tmp.img + '"><p>' + tmp.id + '号进来了</p></div>',
                    timer: 500,
                    html: true
                });
            }
        }, 2000);
    },
    //显示聊天信息
    showMsg: function (user, msg) {
        var className = "left";
        if (user.id == my.info.id) {
            className = "right";
        }
        console.log('msg from :' + JSON.stringify(user));
        var message = "<li class='" + className + " item'><img src='/img/" + user.img + "'></img><span class='msg'>" + msg + "</span></li>";

        $('.J-msg').append(message);
        // 滚动条保持最下方
        $('.J-msg').scrollTop($('.J-msg')[0].scrollHeight);

        //弹幕提示-------------------------------
        var colors = ['#ee2424', '#10b54b', '#de14d6', '#1476de'];
        var v = Math.floor(Math.random() * 5) + 5;
        var top = Math.floor(Math.random() * 50);
        var color = colors[Math.floor(Math.random() * 4)];
        var mydom = document.createElement('marquee');
        $(mydom).attr('scrollamount', v).css({
            'position': 'fixed',
            'top': top + '%',
            'z-index': 111,
            'color': color
        });
        $(mydom).html(message);
        // var html = "<marquee behavior=slide scrollamount=" + v + " style='position:fixed;top:"+top+"%;z-index:111;color:"+color+"'>"+message+"</marquee>";
        $('.J-msg-align').append($(mydom));
        setTimeout(function () {
            console.log($(mydom));
            $(mydom).remove();
        }, 100000);
    }
}

sw = {
    init() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('js/sw.js', { insecure: true }).then(function (registration) {
                // Registration was successful
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            }).catch(function (err) {
                // registration failed :(
                console.log('ServiceWorker registration failed: ', err);
            });
        }
    }
}

//启动!
s.init();

function test() {
    Notification.requestPermission();
    setTimeout(function () {
        new Notification("hello", {
            silent: false,
            body: "测试而已",
            sound: "http://10.101.48.32:3002/media/fire.mp3"
        })
    }, 10000)
}
