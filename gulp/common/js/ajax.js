var option = {
    cache: false,
    jsonpCallback: "handler",
}

function Ajax(type) {
    // console.log(arguments);

    var tmp = {
        type: arguments[0],
        dataType: arguments[0] == 'jsonp' ? 'jsonp' : 'json'
    };
    return function (url, para, cb, err, env) {
        $.extend(option, tmp, {
            // processData: false, //此处指定对上传数据不做默认的读取字符串的操作
            // contentType: false, //此处指定对上传数据不做默认的读取字符串的操作
            success: function (res) {
                cb && cb(res, para, env);
            },
            error: function (e) {
                alert(JSON.stringify(e));
                err && err(e, env);
            }
        });
        option.url = url;
        option.data = para ? para : '';
        $.ajax(option);
    }
}

var ajax = {
    json: new Ajax('get'),
    jsonp: new Ajax('get', 'jsonp'),
    post: new Ajax('post'),
    postp: new Ajax('post', 'jsonp')
};
module.exports = ajax;
