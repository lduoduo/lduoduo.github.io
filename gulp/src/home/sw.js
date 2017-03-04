/** service workers */

//安装
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open('myapp-static-v1').then(function (cache) {
            return cache.addAll([
                '/',
                '/public/css/apps.css',
                '/public/css/home.css',
                '/public/js/apps.js',
                '/public/js/home.js',
                '/public/img/bg.png',
                '/public/img/icon.png',
                '/public/img/music.png'
            ]);
        })
    );
});

//激活
self.addEventListener('activate', function (event) {
    console.log('sw is active');
    // You're good to go!
});

// self.addEventListener('fetch', function (event) {
//     console.log(event.request);
//     event.respondWith(new Response("Hello world!"));
// });

self.addEventListener('fetch', function (event) {
    console.log(event.request);
    event.respondWith(
        fetch('//cimage1.tianjimedia.com/uploadImages/thirdImages/2017/062/WP4309M5A449.jpg', {
            mode: 'no-cors'
        })
    );
    // if (/\.jpg$/.test(event.request.url)) {
    //     event.respondWith(
    //         fetch('//cimage1.tianjimedia.com/uploadImages/thirdImages/2017/062/WP4309M5A449.jpg', {
    //             mode: 'no-cors'
    //         })
    //     );
    // }
});