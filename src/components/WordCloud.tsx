/**
 * Created by TylerLiu on 2020/04/23.
 */
import 'd3-transition';
import {select} from 'd3-selection';
import React, {Component} from 'react';
import ReactWordcloud, {Callbacks, OptionsProp, Word} from "react-wordcloud";
import {KMFormat} from "../util";
import {DataLoaderProps} from "../models/DataLoader";

interface WordCloudProps extends DataLoaderProps {
    hidden?: boolean
}

export default class WordCloud extends Component<WordCloudProps> {
    private callbacks: Callbacks = {
        getWordTooltip: (word: Word) => `${word.text} has $${KMFormat(word.value)} in the category.`,
        onWordClick: this.getCallback('onWordClick').bind(this),
        onWordMouseOut: this.getCallback('onWordMouseOut').bind(this),
        onWordMouseOver: this.getCallback('onWordMouseOver').bind(this),
    };

    private options: OptionsProp = {
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

    constructor(props: DataLoaderProps) {
        super(props)

        this.state = {
            words: [{text: 'Loading...', value: 100}]
        }
    }

    componentDidMount() {
        this.props.dataloader.addChangeCallback(this.setWords.bind(this))
    }

    render() {
        return (
            <div style={{height: '80vh'}} hidden={this.props.hidden}>
                {(this.props.hidden || false) ? null : (
                    <ReactWordcloud callbacks={this.callbacks} words={this.props.dataloader.getWordList().slice(0, 80)}
                                    options={this.options}/>
                )}
            </div>
        )
    }

    getCallback(callback: string) {
        return (word: Word, event: MouseEvent | undefined) => {
            const isActive = callback !== 'onWordMouseOut';
            // @ts-ignore
            const text = select(event.target);
            text
                .on('click', (() => {
                    if (isActive) {
                        this.props.dataloader.addKeywordFilter(word.text);
                    }
                }))
                .transition()
                .attr('background', 'white')
                .attr('text-decoration', isActive ? 'underline' : 'none');
        };
    }

    setWords() {
        this.forceUpdate()
    }
}
