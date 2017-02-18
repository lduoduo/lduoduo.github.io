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
            this.initTimer();
            this.initEvent();
        },
        //开启定时器, 这个定时器是为了bigpipe才设置的
        initTimer: function () {
            var _ = this;

            
        },
        //初始化监听事件
        initEvent: function () {

        },
        initNav: function () {
            var html = ejs.render(this.tpl.nav, { pageName: pageName });
            $('#menuNav').replaceWith(html);
        },
        //获取登录员工的信息
        getUser: function () {
            var str = $('#SV_USER').val();
            var data = JSON.parse(decodeURIComponent(str) || '{}');
            return {
                key: data.workId,
                value: data.username
            };
        }
    }

    window.app = {
        getUser:app.getUser
    }

    app.init();

})();