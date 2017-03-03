/** web workers */

self.addEventListener('message', function (e) {

    var data = e.data;
    self.postMessage('You said: ' + JSON.stringify(e.data));
    
}, false);