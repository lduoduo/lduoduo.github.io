Notification.requestPermission();
var flag = false;
var timer = null;
var push = {
    open() {
        timer = setInterval(function () {
            new Notification("hello", {
                silent: false,
                body: "测试而已",
                sound: "http://10.101.48.32:3002/media/fire.mp3"
            })
        }, 3000);
    },
    close() {
        clearInterval(timer);
    }
}
