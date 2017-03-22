import React, {
    Component
} from 'react';

import {
    Item,
    Menu
    // Phb,
    // Slide,
} from '../components';

const data = {
    itemlist: require('../test/itemlist.js')
}

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: data,
            items: ['webpack', 'react', 'babel', 'npm', 'react-router']
        };
    }

    render() {
        const {
            data,
            items
        } = this.state;

        return (
            <div className="">
                <Menu list={data.itemlist.list} />
                <Item list={data.itemlist.list} />
            </div>
        )
    }
}