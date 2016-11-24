/**
 * 周例会主要业务js -- created by duoduo
 * 依赖插件：
 *   - sweetalert.js
 *   - MusicVisualizer.js // MusicVisualizer_all.js(该文件是原始版本，包含各种注释)
 *   - socket.io.js
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

// ---------创建连接-----------
var socket = io(); //初始化启动socket

var s = {
    //初始化总入口
    init: function () {
        this.initEvent();
        this.initStatus();
        this.initTimer();
        if (my.sex) {
            this.initSocket();
        }
        if (my.isAdmin) {
            this.initAdminEvent();
        }
        FastClick.attach(document.body);
        sw.init();
    },
    //初始化socket的各种监听事件
    initSocket: function () {
        // 加入房间
        socket.on('connect', function () {
            console.log('hear beat...');
        });
        // 监听消息
        socket.on('msg', function (user, msg) {
            s.showMsg(user, msg);
        });

        // 监听系统消息
        socket.on('sys', function (sysMsg, data) {
            if (!my.sex) {
                return;
            }
            if (sysMsg == "in") {
                my.addedlist.push(data);
                console.log(data);
            }
            console.log(my);
        });

        // 监听自己的消息
        socket.on('self', function (sysMsg, data) {
            console.log('my');
            local.setItem('myinfo', JSON.stringify(data));
            my.info = data;
            Mt.alert({
                title: '签到成功~,1s后关闭',
                timer: 1000
            });
        });

        // 监听操作
        socket.on('option', function (type, msg) {
            s.getOption(type, msg);
        });

        // 获取所有用户数据
        socket.on('getAll', function (data) {
            my.addedlist = data;
            console.log(data);
        });
    },
    //初始化签到人的状态, 如果没有签到，则会显示弹窗让选择男女进行签到
    initStatus: function () {
        if (my.isCommon || my.isAdmin) {
            my.isReady = true;
            my.sex = 'common';
            s.join();
            my.isAdmin && $('.J-admin').removeClass('none') && $('.J-open-QR').addClass('none');
            return;
        }
        var tmp = JSON.parse(local.getItem('myinfo') || null);
        if (!tmp) {
            if (my.sex == null) {
                Mt.alert({
                    title: '请选择性别~',
                    confirmBtnMsg: false,
                    isLoading: true,
                    msg: '<div class="radio-group J-sex-select"><input type="radio" class="radio" name="gender" value=male /> : 男<br /><input type="radio" class="radio" name="gender" value=female /> : 女<br /></div>',
                    html: true
                });
            }
        } else {
            my.isReady = true;
            my.sex = tmp.sex;
            $.extend(my.info, tmp);
            s.join();
        }
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
                s.sendMsg(msg);
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