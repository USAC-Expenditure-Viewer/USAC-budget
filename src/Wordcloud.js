/**
 * Created by TylerLiu on 2018/12/23.
 */
import 'd3-transition';
import { select } from 'd3-selection';
import React, { Component } from 'react';
import ReactWordcloud from "react-wordcloud";
import {KMFormat} from "./util";

export default class WordCloud extends Component{

    constructor(props) {
        super(props)

        this.callbacks = {
            getWordTooltip: word =>`${word.text} has $${KMFormat(word.value)} in the category.`,
            onWordClick: this.getCallback('onWordClick').bind(this),
            onWordMouseOut: this.getCallback('onWordMouseOut').bind(this),
            onWordMouseOver: this.getCallback('onWordMouseOver').bind(this),
        };

        this.options = {
            fontFamily: 'impact',
            fontSizes: [5, 60],
            fontStyle: 'normal',
            fontWeight: 'normal',
            scale: 'log',
            //spiral: 'archimedean',
            deterministic: true,

            rotations: 4,
            rotationAngles: [-45, 90],

            transitionDuration: 200,
        }

        this.state = {
            words : [{text: 'Loading...', value: 100}]
        }
    }

     componentDidMount() {
         this.props.dataLoader.addWordsCallback(this.setWords.bind(this))
     }

    render() {
        return(
            <ReactWordcloud style={this.props.style} callbacks={this.callbacks} words={this.state.words} options={this.options}/>
        )
    }

    getCallback(callback) {
        return function(word, event) {
            const isActive = callback !== 'onWordMouseOut';
            const element = event.target;
            const text = select(element);
            text
                .on('click', (() => {
                    if (isActive) {
                        this.props.keywordList.addWord(word.text);
                    }
                }))
                .transition()
                .attr('background', 'white')
                .attr('text-decoration', isActive ? 'underline' : 'none');
        };
    }

    setWords(words) {
        this.setState({
            words: words
        })
    }
}