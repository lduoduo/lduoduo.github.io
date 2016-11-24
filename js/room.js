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

    //初始化各种交互事件
    initEvent: function () {
        $('body')
            //签到选择男女
            .on('click', '.J-open', function (e) {
                push.open();
            })
            //发送聊天消息
            .on('click', '.J-close', function (e) {
                push.close();
            })
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
