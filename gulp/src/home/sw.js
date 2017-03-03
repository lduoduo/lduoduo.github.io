/** service workers */

//安装
self.addEventListener('install', function (event) {
    event.waitUntil(
        fetchStuffAndInitDatabases()
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
    if (/\.jpg$/.test(event.request.url)) {
        event.respondWith(
            fetch('//www.google.co.uk/logos/example.gif', {
                mode: 'no-cors'
            })
        );
    }
});