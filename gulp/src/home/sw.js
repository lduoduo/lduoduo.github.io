/** service workers */

//Cache polyfil to support cacheAPI in all browsers
// importScripts('./cache-polyfill.js');

var cacheName = 'cache-dodo';

//Files to save in cache
var files = [
    '/',
    '/public/css/apps.css',
    '/public/css/home.css',
    '/public/js/apps.js',
    '/public/js/home.js',
    '/public/img/bg.png',
    '/public/img/icon.png',
    '/public/img/music.png'
];

//安装
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                return cache.addAll(files)
                    .then(() => {
                        console.info('All files are cached');
                        return self.skipWaiting(); //To forces the waiting service worker to become the active service worker
                    })
                    .catch((error) => {
                        console.error('Failed to cache', error);
                    });
            })
    );
});

//激活
self.addEventListener('activate', function (event) {
    console.log('sw is active');
    // You're good to go!

    //Navigation preload is help us make parallel request while service worker is booting up.
    //Enable - chrome://flags/#enable-service-worker-navigation-preload
    //Support - Chrome 57 beta (behing the flag)
    //More info - https://developers.google.com/web/updates/2017/02/navigation-preload#the-problem

    // Check if navigationPreload is supported or not
    if (self.registration.navigationPreload) {
        self.registration.navigationPreload.enable();
    }
    else if (!self.registration.navigationPreload) {
        console.info('Your browser does not support navigation preload.');
    }

    //Remove old and unwanted caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== cacheName) {     //cacheName = 'cache-duoduo'
                        return caches.delete(cache); //Deleting the cache
                    }
                })
            );
        })
    );

    return self.clients.claim(); // To activate service worker faster

});

// self.addEventListener('fetch', function (event) {
//     console.log(event.request);
//     event.respondWith(new Response("Hello world!"));
// });

self.addEventListener('fetch', function (event) {
    console.log(event.request);
    var request = event.request;

    //Tell the browser to wait for newtwork request and respond with below
    event.respondWith(
        //If request is already in cache, return it
        caches.match(request).then((response) => {
            if (response) {
                return response;
            }

            // Checking for navigation preload response
            if (event.preloadResponse) {
                console.info('Using navigation preload');
                return response;
            }

            //if request is not cached or navigation preload response, add it to cache
            return fetch(request).then((response) => {
                var responseToCache = response.clone();
                caches.open(cacheName).then((cache) => {
                    cache.put(request, responseToCache).catch((err) => {
                        console.warn(request.url + ': ' + err.message);
                    });
                });

                return response;
            });
        })
    );
    // event.respondWith(
    //     fetch('//cimage1.tianjimedia.com/uploadImages/thirdImages/2017/062/WP4309M5A449.jpg', {
    //         mode: 'no-cors'
    //     })
    // );
    // if (/\.jpg$/.test(event.request.url)) {
    //     event.respondWith(
    //         fetch('//cimage1.tianjimedia.com/uploadImages/thirdImages/2017/062/WP4309M5A449.jpg', {
    //             mode: 'no-cors'
    //         })
    //     );
    // }
});

/*
  PUSH EVENT: triggered everytime, when a push notification is received.
*/

//Adding `push` event listener
self.addEventListener('push', (event) => {
    console.info('Event: Push');

    var title = 'Push notification demo';
    var body = {
        'body': 'click to return to application',
        'tag': 'demo',
        'icon': './img/bg.jpg',
        'badge': './img/bg.jpg',
        data: {
            url: 'https://lduoduo.github.io/'
        },
        //Custom actions buttons
        'actions': [
            { 'action': 'yes', 'title': 'I ♥ this app!' },
            { 'action': 'no', 'title': 'I don\'t like this app' }
        ]
    };

    event.waitUntil(self.registration.showNotification(title, body));

});

/*
  NOTIFICATION EVENT: triggered when user click the notification.
*/

//Adding `notification` click event listener
self.addEventListener('notificationclick', (event) => {
    var url = 'https://lduoduo.github.io/';

    //Listen to custom action buttons in push notification
    if (event.action === 'yes') {
        console.log('I ♥ this app!');
    }
    else if (event.action === 'no') {
        console.warn('I don\'t like this app');
    }

    event.notification.close(); //Close the notification

    //To open the app after clicking notification
    event.waitUntil(
        clients.matchAll({
            type: 'window'
        })
            .then((clients) => {
                for (var i = 0; i < clients.length; i++) {
                    var client = clients[i];
                    //If site is opened, focus to the site
                    if (client.url === url && 'focus' in client) {
                        return client.focus();
                    }
                }

                //If site is cannot be opened, open in new window
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
            .catch((error) => {
                console.error(error);
            })
    );

    self.postMessage('You said: ' + JSON.stringify(event.title));

});
