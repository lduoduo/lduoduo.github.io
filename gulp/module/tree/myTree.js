/** Ztree.js 真是真是够了，太重，用不起来，要啥啥没有，还不如自己写！
 * create by zh25745 on 2016-1221
 * 参数解释：
 * option{
 *  ctx: 原来的环境，callback需要传递回去，防止this指针丢失
 *  wrapper: 需要生成tree的容器
 *  brother: wrapper的兄弟容器，wrapper的位置需要依赖brother的高度，时刻保持在brother的下面
 *  data: 现有数据，如果有数据，直接进行渲染填充
 *  url: 如果没有数据，就传入url，动态获取数据进行渲染填充
 *  onCheck: checkbox事件的回调
 *  onReady: tree初始化之后的回调
 * }
 * tips: 目前只支持到二级目录!!!
*/

function Mytree(option) {
    this.ctx = option.ctx;
    this.wrapper = option.wrapper;
    this.brother = option.brother;
    this.data = option.data;
    this.url = option.url;
    this.para = option.para;
    //是否需要显示checkbox
    this.isCheckbox = option.isCheckbox || false;
    //check事件的回调
    this.onCheck = option.onCheck;
    //tree初始化之后的回调
    this.onReady = option.onReady;
    this.wrapper.classList.add('ztree');
    this.init();
}

Mytree.prototype = {
    init: function () {
        this.fetchTreeList();
        this.initEvent();
    },
    initEvent: function () {
        var _ = this;
        $(this.wrapper).on('click', 'a', function () {
            _.toggleCheckbox($(this));
        });
        $(this.wrapper).on('click', '.triangle', function () {
            $(this).toggleClass('down');
            $(this).parent().toggleClass('active');
        });
    },
    //checkbox点击事件
    toggleCheckbox: function (el) {
        el.toggleClass('active');
        if (el.hasClass('item')) {
            el.nextAll('.sub-item').toggleClass('active', el.hasClass('active'));
        } else {
            var l1 = el.parent().children('.sub-item').length;
            var l2 = el.parent().children('.sub-item.active').length;
            el.prevAll('.item').toggleClass('active', l1 == l2);
        }
        this.onCheck && this.onCheck(this.ctx);
    },
    /** 获取远程数据 */
    fetchTreeList: function () {
        var _ = this;
        //如果本地有，直接获取本地数据
        if (this.data) {
            _.viewTreeList(this.data, null, _);
            return;
        }
        if (!this.url) {
            return;
        }
        ajax.json(this.url, this.para, _.viewTreeList, null, _);
    },
    /** 渲染树 */
    viewTreeList: function (data, para, env) {
        //保持原始指针，后面调用
        var _ = env;
        $(_.wrapper).html('');
        var list = data.data ? (data.data.list ? data.data.list : data) : data;
        var innerHtml = "", html = "", a = "<li class='item'><ul></ul></li>";
        for (var i in list) {
            var tmp1 = list[i];
            innerHtml = "<a class='item " + (_.isCheckbox ? "tree-checkbox" : "") + "' data-title='" + i + "'>" + i + "</a>";
            if (typeof tmp1 != "object") {
                innerHtml += "<a class='sub-item " + (_.isCheckbox ? "tree-checkbox" : "") + "' data-title='" + tmp1 + "'>" + tmp1 + "</a>";
            } else {
                for (var j = 0; j < tmp1.length; j++) {
                    var tmp2 = tmp1[j];
                    innerHtml += "<a class='sub-item " + (_.isCheckbox ? "tree-checkbox" : "") + "' data-title='" + tmp2 + "'>" + tmp2 + "</a>";
                }
            }
            html += "<div class='blocks' data-title='" + i + "'><span class='triangle'></span>" + innerHtml + "</div>";
        }
        $(_.wrapper).html(html);
        //渲染完成，进行回调
        _.onReady && _.onReady(_.ctx);
    },
    //刷新位置
    refresh: function () {
        var h = $(this.brother).height() + 5;
        $(this.wrapper).css('top', h + 'px');
    },
    //刷新数据，重新生成tree
    refreshData: function (data) {
        if (data) {
            this.data = data;
        }
        this.fetchTreeList();
    }
}

module.exports = Mytree;