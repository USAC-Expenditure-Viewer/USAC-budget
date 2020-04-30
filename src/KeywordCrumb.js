/**
 * Created by TylerLiu on 2018/12/23.
 */
import React, {Component} from 'react';
import {Breadcrumbs, Typography} from "@material-ui/core";
import Link from "@material-ui/core/Link";

export default class KeywordCrumb extends Component{

    constructor(props) {
        super(props)

        this.props.keywordList.addChangeCallback(() =>this.reRender())

        this.state = {
            tick: 0
        }
    }

    componentDidMount() {

    }

    render() {
        let list = this.props.keywordList.getList()
        return(
            <Breadcrumbs separator="-" style={this.props.style}>
                <Link color="textPrimary" onClick={()=>this.props.keywordList.reset()}>Transactions</Link>
                {list.slice(0, -1).map(word=>(
                    <Link color="textSecondary" onClick={()=>this.props.keywordList.sliceWord(word)}>{word}</Link>
                ))}
                {list.length > 0 ? (<Typography color="textPrimary">{list[list.length-1]}</Typography>) : null}
            </Breadcrumbs>
        )
    }

    reRender(){
        this.setState({tick: this.state.tick + 1})
    }
}