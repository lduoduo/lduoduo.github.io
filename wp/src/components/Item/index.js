import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
/** 业务js里面不能引用less文件，会报错： Error: No PostCSS Config found */
import styles from './index.scss';
import { fullpage } from '../../common/js/fullpage.js';

const SplitEl = ({title}) => {
    // if (title == "false") {
    //     return "";
    // }
    return (
        <hr />
    )
};

class Item extends Component {

    constructor(props) {
        super(props);
        this.state = {
            focused: 0
        };
    }
    //渲染完成后调用一次，这个时候DOM结构已经渲染了。
    //这个时候就可以初始化其他框架的设置了，如果利用jQuery绑定事件等等。
    componentDidMount() {
        // smoke(document.querySelector('#canvas0'));
        console.log('loaded Item module');

        console.log(fullpage);
        debugger;
        // fullpage.initialize('#fullpage', {
        //     anchors: ['page0', 'page1', 'page2'],
        //     css3: true,
        //     onLeave: function () { //滚动时调用
        //         console.log('scroll leave');
        //     },
        //     afterLoad: function () { //滚动后调用
        //         console.log(this);
        //         var el = this;
        //         var pa = this.parentElement;
        //         var bg = "url(" + el.dataset.imgurl + ")";
        //         console.log(bg);
        //         pa.style.backgroundImage = bg;
        //         // $(".J-main").css("background-image", bg);
        //         // $(this).find('.title').addClass('from-left');
        //         // $(this).find('.desc').addClass('from-right');
        //         // console.log('scroll leave loaded');
        //     }
        // });
    }
    render() {
        const {
            list
        } = this.props;
        const {
            focused
        } = this.state;
        console.log(list);

        let count = list.length;

        debugger;

        return (
            <ul styleName="root" id='fullpage'>
                {list.map((obj, index) =>
                    <li
                        key={index} id={'module' + index}
                        styleName='module' data-imgurl={obj.imgUrl} className="section"
                        >
                        <div styleName="main-box">
                            <div styleName="title">{obj.name}</div>
                            <div styleName="desc">{obj.desc}</div>
                        </div>
                        <div styleName="list-box">
                            {obj.items.map((item, i) =>
                                <a key={i} styleName={i == ~~(count / 2 + 1) ? 'item left split' : (i <= ~~(count / 2 + 1) ? 'item left' : 'item right')}>
                                    <div styleName='animate'></div>
                                    <div styleName='front'>
                                        <p>{item.name}</p>
                                    </div>
                                    <input hidden readOnly value={item.desc} className="J-detail" />
                                </a>
                            )}
                        </div>
                    </li>
                )}
            </ul>
        )
    }
}

export default CSSModules(Item, styles, {
    allowMultiple: true,
    errorWhenNotFound: false
});