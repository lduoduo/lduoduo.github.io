(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    if (/\.jpg$/.test(event.request.url)) {
        event.respondWith(
            fetch('//cimage1.tianjimedia.com/uploadImages/thirdImages/2017/062/WP4309M5A449.jpg', {
                mode: 'no-cors'
            })
        );
    }
});
},{}]},{},[1]);

//# sourceMappingURL=sw.js.map
