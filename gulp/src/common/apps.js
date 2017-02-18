/** 大度假问卷通用的js */

window.ejs = require('ejs');
window.ajax = require('../../common/js/ajax.js');

/** 表单序列化 */
$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};

/** 去空表单序列化 */
$.fn.serializeObjectNull = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           if(this.value){
               o[this.name].push(this.value);
           }
       } else {
           this.value ? o[this.name] = this.value : "";
       }
   });
   return o;
};

(function () {
    var app = {
        
        init: function () {
            FastClick.attach(document.body);
            this.initTimer();
            this.initEvent();
        },
        //开启定时器, 这个定时器是为了bigpipe才设置的
        initTimer: function () {
            var _ = this;

            
        },
        //初始化监听事件
        initEvent: function () {

        }
    }

    app.init();

})();