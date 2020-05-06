/**
 * Created by TylerLiu on 2020/05/05.
 */
import React, { Component } from 'react';
import {KMFormat} from "./util";
import {Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis} from "recharts";

export default class WordChart extends Component {

    constructor(props) {
        super(props)

        this.state = {
            data: []
        }
    }

    componentDidMount() {
        this.props.dataloader.addWordsCallback(this.setWords.bind(this));
        this.setState({ height: this.divElement.clientHeight, width: this.divElement.clientWidth });
    }

    render() {
        return (
            <div style={this.props.style} ref={ (divElement) => { this.divElement = divElement } }>
                <BarChart layout="vertical" height={this.state.height} width={this.state.width} data={this.state.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" orientation="top" />
                    <YAxis type="category" orientation="left" dataKey="text" reversed/>
                    <Tooltip formatter={KMFormat}/>
                    <Bar dataKey="value" fill={"#3949ab"} />
                </BarChart>
            </div>
        )
    }

    setWords(words) {
        this.setState({
            data: words.filter(w => w.value > 0)
        })
    }
}