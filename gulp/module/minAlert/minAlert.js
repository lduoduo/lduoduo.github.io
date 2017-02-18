/** minAlert
 * created by zh25745 on 20170110
 * 为了兼容IE8写的弹窗，默认支持传入自定义html结构内容
 * 调用方法:
 * 1. 在目标文件引入该文件 var minAlert = require('./minAlert.js');
 * 2. 打开弹窗时调用
 *      minAlert.alert(option)
 * 3. 关闭弹窗时调用
 *      minAlert.close(option)
 * 参数说明：
 *  option = {
 *      type: 'success', //消息类型 success / error / info / warnning
        title: '', //消息标题，可以不传
        msg: '', //消息主体
        cancelBtnMsg: '', //取消按钮的按钮内容
        confirmBtnMsg:'', //确定按钮的按钮内容
        showConfirm: false, //是否显示确定按钮
        showCancel: false, //是否显示取消按钮
        cb: function(){} //点击按钮的回调
 *  }
 */

var MinAlert = {
    //默认配置
    defaults:{
        type: 'success',
        title: '',
        msg: '',
        cancelBtnMsg: '',
        confirmBtnMsg:'',
        showConfirm: false,
        showCancel: false,
        showClose: false,
        // html: false, //是否支持HTML结构代码
        cb: null
    },
    info: null, //完整配置
    count: 0, //开启次数，第一次开启时，需要绑定事件，后面都不需要绑定了
    //模板
    tpl:{
        mask: '<div class="min-alert-mask active" tabindex=-1></div>',
        main: '<div class="min-alert active" data-confirm=<%- showConfirm %> data-cancel=<%- showCancel %>>'+
                '<a class="btn-close <%- showClose %>" tabindex="1"></a>'+
                '<div class="min-title <%- type %>">'+
                    '<i></i><span><%- title %></span>'+
                '</div>'+
                '<div class="min-desc <%- type %>"><%- msg %></div>'+
                '<div class="min-option">'+
                    '<a class="btn-confirm <%- showConfirm %> <%- type %> "><%- confirmBtnMsg %></a>'+
                    '<a class="btn-cancel <%- showCancel %>"><%- cancelBtnMsg %></a>'+
                '</div>'+
              '</div>'
    },
    initEvent: function(){
        var _=this;
        $('body').on('click','.min-alert .btn-confirm',function(){
            _.close();
            _.info.cb && _.info.cb(true);
        });
        $('body').on('click','.min-alert .btn-cancel',function(){
            _.close();
            _.info.cb && _.info.cb(false);
        });
        $('body').on('click','.min-alert .btn-close',function(){
            _.close();
            _.info.cb && _.info.cb("close");
        });
    },
    alert: function(option){
        $('body').addClass('stop-scrolling');
        var tmp = this.info = $.extend(this.defaults, option);
        tmp.showConfirm = !!tmp.confirmBtnMsg;
        tmp.showCancel = !!tmp.cancelBtnMsg;
        if($('.min-alert-mask').length > 0){
            $('.min-alert-mask').remove();
            $('.min-alert').remove();
            this.count ++;
        }
        var html = this.tpl.mask;
        html += app.render(this.tpl.main, tmp);
        $('body').append(html);
        if(this.count == 0){
            this.initEvent();
        }
        //位置调整
        var w = $('.min-alert').width(),h=$('.min-alert').height();
        $('.min-alert').css({
            'margin-left': '-' + ((w + 60) / 2) + 'px',
            'margin-top': '-' + ((h + 100) / 2) + 'px'
        });
    },
    close: function(){
        $('.min-alert-mask').remove();
        $('.min-alert').remove();
        $('body').removeClass('stop-scrolling');
    }
}

module.exports = {
    alert: function(option){
        MinAlert.alert.call(MinAlert, option);
    },
    close: function(){
        MinAlert.close.call(MinAlert);
    }
};