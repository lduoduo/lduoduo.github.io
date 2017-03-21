import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import styles from './index.scss';

const SplitEl = ({title}) => {
    // if (title == "false") {
    //     return "";
    // }
    return (
        <hr />
    )
};

class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            focused: 0
        };
    }

    componentDidMount() {
        // smoke(document.querySelector('#canvas0'));
        console.log('loaded');
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

        return (
            <div styleName="menu">
                <a styleName="AIO" href="/"></a>
                {list.map((obj, index) =>
                    <a key={index} styleName="item" href={"#page" + index} >{obj.name}</a>
                )}
                <div styleName="nav-right">
                    <a styleName="r-item favorite" href="#" title="收藏夹">
                        <div styleName="rond"></div>
                    </a>
                    <a styleName="r-item clear" href="#" title="常用系统">
                        <div styleName="rond"></div>
                    </a>
                    <a styleName="r-item toolbox" href="#">
                        <div styleName="rond"></div>
                    </a>
                    <a styleName="r-item out" href="#">多多 退出</a>
                </div>
            </div>
        )
    }
}

export default CSSModules(Menu, styles, {
    allowMultiple: true,
    errorWhenNotFound: false
});