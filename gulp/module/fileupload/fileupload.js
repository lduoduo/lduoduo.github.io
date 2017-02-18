/*
 * zxxFile.js 基于HTML5 文件上传的核心脚本 http://www.zhangxinxu.com/wordpress/?p=1923
 * by zhangxinxu 2011-09-12
 */

function ZXXFILE(option) {
    option = option || {};
    this.id = option.id; //控件id
    this.fileInput = option.fileInput; //html file控件
    this.name = option.name; //图片的标识符，用于上传的时候区别，一组图片只绑定一个标识符
    this.previewBox = option.filePreview; //预览区域
    this.dragDrop = null; //拖拽敏感区域
    this.limitNo = option.limitNo; //上传文件个数控制
    this.upButton = option.upButton; //提交按钮
    this.url = option.url; //ajax地址
    this.fileFilter = []; //过滤后的文件数组
    this.fileFilterObj = {}; //过滤后的文件对象集合，用户去重过滤
    this.ieList = []; //IE图片文件列表，兼容IE8的
    this.isMultiple = option.isMultiple || false;
    this.onPreview = option.onPreview;
    this.isChanged = true; //上传文件是否有变动，如果没有变动，不用再重新上传了
    this.isIE = navigator.userAgent.indexOf('MSIE 8') >= 0 || navigator.userAgent.indexOf('MSIE 9') >= 0;
    // this.filter = function (files) { //选择文件组的过滤方法
    //     return files;
    // };
    // this.onSelect = function () {}; //文件选择后
    // this.onDelete = function () {}; //文件删除后
    // this.onDragOver = function () {}; //文件拖拽到敏感区域时
    // this.onDragLeave = function () {}; //文件离开到敏感区域时
    // this.beforeUpload = function () {}; //文件上传之前的验证
    // this.onProgress = function () {}; //文件上传进度
    // this.onSuccess = function () {}; //文件上传成功时
    // this.onFailure = function () {}; //文件上传失败时;
    // this.onComplete = function () {}; //文件全部上传完毕时
}

ZXXFILE.prototype = {
    /* 开发参数和内置方法分界线 */

    //文件拖放
    funDragHover: function (e) {
        e.stopPropagation();
        e.preventDefault();
        this[e.type === "dragover" ? "onDragOver" : "onDragLeave"].call(e.target);
        return this;
    },
    //获取选择文件，file控件或拖放
    funGetFiles: function (e) {
        // 取消鼠标经过样式
        this.funDragHover(e);

        if (this.isIE) {
            this.funGetFiles_IE(e.target);
            return;
        }
        // 获取文件列表对象
        var files = e.target.files || e.originalEvent.dataTransfer.files;

        if (files.length == 0) { return; }

        this.isChanged = true;
        //继续添加文件
        var tmp = this.filter(files, this.fileFilterObj);
        this.fileFilter = this.isMultiple ? this.fileFilter.concat(tmp.list) : tmp.list;
        this.fileFilterObj = tmp.obj;
        this.funDealFiles();
        return this;
    },
    //IE8下面获取文件
    funGetFiles_IE: function (e) {

        // var imgpath = getRealPath(this.id);
        var file_upl = document.getElementById('upload');
        file_upl.select();
        var imgpath = document.selection.createRange().text;
        alert(imgpath);

        var filename = imgpath.match(/\S+\.(png|jpg|jpeg)/gi);
        if (!filename || this.fileFilterObj[filename]) {
            return;
        }
        this.fileFilterObj[filename] = filename;
        this.ieList.append({
            name: filename,
            path: imgpath
        });

        //执行选择回调
        this.onSelectIE(this.fileFilter);
    },
    //选中文件的处理与回调
    funDealFiles: function () {
        for (var i = 0, file; file = this.fileFilter[i]; i++) {
            //增加唯一索引值
            file.index = i;
        }

        this.limitNo && $('.box-upload').toggleClass('hidden', this.fileFilter.length >= this.limitNo);
        //执行选择回调
        this.onSelect(this.fileFilter);

        return this;
    },
    //删除对应的文件
    funDeleteFile: function (name) {
        for (var i = 0; i < this.fileFilter.length; i++) {
            if (this.fileFilter[i].name == name) {
                index = i;
                this.fileFilter.splice(i, 1);
                break;
            }
        }
        delete this.fileFilterObj[name];
        this.onDelete && this.onDelete(name);
    },
    //文件上传
    funUploadFile: function () {
        var _ = this;
        if (location.host.indexOf("sitepointstatic") >= 0) {
            //非站点服务器上运行
            return;
        }
        if (this.beforeUpload && !this.beforeUpload(this.fileFilterObj)) {
            return;
        }
        this.ajaxFile(this.fileFilter);
    },
    init: function () {
        if (this.isIE) {
            this.initIE8();
        } else {
            this.initIE8();
        }
    },
    //生成区域控件
    initUI: function () {
        var html = "<div class='box-preview J-preview'></div><div class='box-upload J-upload' title='点击或者拖拽文件到该区域'>" +
            "<div class='box-drag J-drag' draggable=true></div></div>";
        $(this.fileInput).parent().append(html);
        this.dragDrop = $('.J-drag')[0];
    },
    //IE8不支持，不这么写
    initNew: function () {
        var _ = this;

        if (this.dragDrop) {
            this.dragDrop.addEventListener("dragover", function (e) {
                _.funDragHover(e);
            }, false);
            this.dragDrop.addEventListener("dragleave", function (e) {
                _.funDragHover(e);
            }, false);
            this.dragDrop.addEventListener("drop", function (e) {
                _.funGetFiles(e);
            }, false);
        }

        //文件预览选择
        if (this.previewBox) {
            this.previewBox.addEventListener("click", function (e) {
                _.onPreview && _.onPreview(e);
            }, false);
        }

        //文件选择控件选择
        if (this.fileInput) {
            this.fileInput.addEventListener("change", function (e) {
                _.funGetFiles(e);
            }, false);
        }

        //上传按钮提交
        if (this.upButton) {
            this.upButton.addEventListener("click", function (e) {
                _.funUploadFile(e);
            }, false);
        }
    },
    //IE8
    initIE8: function () {
        var _ = this;

        if (this.dragDrop) {
            $(this.dragDrop).on('dragover', function (e) {
                _.funDragHover(e);
            });
            $(this.dragDrop).on('dragleave', function (e) {
                _.funDragHover(e);
            });
            $(this.dragDrop).on('drop', function (e) {
                _.funGetFiles(e);
            });
        }

        //文件预览选择
        if (this.previewBox) {
            $(this.previewBox).on('click', function (e) {
                _.onPreview && _.onPreview(e);
            });
        }

        //文件选择控件选择
        if (this.fileInput) {
            $(this.fileInput).on('change', function (e) {
                _.funGetFiles(e);
            });
        }

        //上传按钮提交
        if (this.upButton) {
            $(this.upButton).on('click', function (e) {
                _.funUploadFile(e);
            });
        }
    },
    ajaxFile: function (files) {
        var _this = this;
        var res = [], count = 0;//count是请求完成返回的数目
        if (!_this.isChanged) {
            _this.onSuccess();
            return;
        }

        if (files.length == 0) {
            _this.onSuccess();
            return;
        }

        var fd = null;
        // if (_this.name) {
        //     fd.append('name', _this.name);
        // }

        for (var i = 0; i < files.length; i++) {
            fd = new FormData();
            fd.append('file' + i, files[i]);

            ajaxUpload(_this.url, fd, function (url) {
                res.push(url);
                if (++count == files.length) {
                    _this.isChanged = false;
                    _this.onSuccess(res);
                }
            });

        }
    }
};

function ajaxUpload(url, fd, cb) {
    $.ajax({
        url: url,
        type: 'POST',
        data: fd,
        processData: false, //此处指定对上传数据不做默认的读取字符串的操作
        contentType: false, //此处指定对上传数据不做默认的读取字符串的操作
        success: function (data) {
            console.log(data);

            if (data.Status != "Success") {
                // _this.onFailure(data);
                return;
            }

            data = data.Data || "";
            data = data ? data.data.Url : "";

            cb(data);
        },
        error: function (e) {
            console.log(e);
        }
    });
}

//在IE8下获取图片路径
function getRealPath(fileId) {
    var file_upl = document.getElementById(fileId);
    file_upl.select();
    return document.selection.createRange().text;
}

function clacImgZoomParam(maxWidth, maxHeight, width, height) {
    var param = { top: 0, left: 0, width: width, height: height };
    if (width > maxWidth && height > maxHeight) {
        rateWidth = width / maxWidth; rateHeight = height / maxHeight;
        if (rateWidth > rateHeight) {
            param.width = maxWidth;
            param.height = Math.round(height / rateWidth);
        } else {
            param.width = Math.round(width / rateHeight);
            param.height = maxHeight;
        }
    }
    param.left = Math.round((maxWidth - param.width) / 2);
    param.top = Math.round((maxHeight - param.height) / 2);
    return param;
}

if (typeof module !== "undefined") module.exports = ZXXFILE;