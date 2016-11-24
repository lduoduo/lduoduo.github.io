var port;

// self.addEventListener('push', function (event) {
//     var obj = event.data.json();

//     if (obj.action === 'subscribe' || obj.action === 'unsubscribe') {
//         fireNotification(obj, event);
//         port.postMessage(obj);
//     } else if (obj.action === 'init' || obj.action === 'chatMsg') {
//         port.postMessage(obj);
//     }
// });

// self.onmessage = function (e) {
//     console.log(e);
//     port = e.ports[0];
// }

// function fireNotification(obj, event) {
//     var title = 'Subscription change';
//     var body = obj.name + ' has ' + obj.action + 'd.';
//     var icon = 'push-icon.png';
//     var tag = 'push';

//     event.waitUntil(self.registration.showNotification(title, {
//         body: body,
//         icon: icon,
//         tag: tag
//     }));
// }





// var CACHE_NAME = 'lduoduo-cache-v1';

// // The files we want to cache
// var urlsToCache = [
//     '/',
//     '/styles/main.css',
//     '/script/main.js'
// ];
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

// // Set the callback for the install step
self.addEventListener('install', function (event) {
    // Perform install steps
    console.log(event);
    Notification.requestPermission();
    push.open();
    // event.waitUntil(
    //     caches.open(CACHE_NAME)
    //         .then(function (cache) {
    //             console.log('Opened cache');
    //             return cache.addAll(urlsToCache);
    //         })
    // );
});




// var flag = false;
// var timer = null;

