/** form validation
 * created by zh25745 on 2016-1223
 *  el: form表单元素
 *  flag: 必填项的标志, 可以是class、name
 * 注意！！：需要必填的元素需要绑定一个data-key值，值为字段名
 * 特殊验证请在dom上注明: data-type, 目前支持以下类型验证
 * 1. href
 * 2. phone
 */

var reg = {
    href: IsURL,
    phone: phone
}

function Valid(el, flag) {
    this.form = el;
    this.flag = flag;
    this.keys = {};
    this.data = {};
    this.error = {};
}
Valid.prototype = {
    valid: function () {
        this.error = {};
        this.getValues();
        this.validate();
        return {
            statuscode: !Object.keys(this.error).length,
            errObj: this.error,
            data: this.data,
            keys: this.keys
        }
    },
    getKeys: function () {

    },
    getValues: function () {
        this.data = $(this.form).serializeObject();
    },
    validate: function () {
        var _ = this, key,type;
        var tmp = $(this.form).find('.' + this.flag);
        tmp = tmp.length > 0 ? tmp : $(this.form).find('[name=' + this.flag + ']');
        tmp.each(function (i, item) {

            key = $(item).data('key');
            type = $(item).data('type');
            //为了兼容IE，去掉这种写法
            // key = item.dataset['key'];
            // type = item.dataset['type'];
            _.keys[key] = key;
            //如果是空对象或者空数组，都算没有
            if (key && (_.data[key] == "" || _.data[key] == "{}" || _.data[key] == "[]")) {
                _.error[key] = key;
            }
            if(type && reg[type] &&!reg[type](_.data[key])){
                _.error[key] = key;
            }
        });
    },
    //单项检查
    validSingle: function(type, value){
        return reg[type](value);
    }
}

module.exports = Valid;


function IsURL(str_url) {
    // var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
    //     + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@
    //     + "(([0-9]{1,3}.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184
    //     + "|" // 允许IP和DOMAIN（域名）
    //     + "([0-9a-z_!~*'()-]+.)*" // 域名- www.
    //     + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]." // 二级域名
    //     + "[a-z]{2,6})" // first level domain- .com or .museum
    //     + "(:[0-9]{1,4})?" // 端口- :80
    //     + "((/?)|" // a slash isn't required if there is no file name
    //     + "(/[u4e00-u9fa5][0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
    // var re = new RegExp(strRegex);
    // var re = /\w*\:\/\/\w+\.\w*\.\w+/;

    var re = new RegExp("^(http[s]?:\\/\\/){1}(([0-9]{1,3}.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].[a-z]{1,6})([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");

    return re.test(str_url);
}
function phone(str){
    var reg = /^1[34578]\d{9}$/;
    return reg.test(str);
}