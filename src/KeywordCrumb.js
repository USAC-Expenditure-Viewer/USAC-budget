/**
 * Created by TylerLiu on 2018/12/23.
 */
import React, {Component} from 'react';
import {Breadcrumbs, Typography} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import {KMFormat} from "./util";

export default class KeywordCrumb extends Component{

    constructor(props) {
        super(props)

        this.state = {
            numList : 0,
            amounts : []
        }
    }

    componentDidMount() {
        this.props.dataloader.addAmountCallback((amount)=>this.changeList(amount))
    }

    render() {
        let list = this.props.keywordlist.getList()
        return(
            <Breadcrumbs separator=">" style={this.props.style}>
                <Link key={-1} color="textPrimary" onClick={()=>this.props.keywordlist.reset()}>Transactions(${this.state.amounts[0]})</Link>
                {list.slice(0, -1).map((word, index)=>(
                    <Link key={index} color="textSecondary" onClick={()=>this.props.keywordlist.sliceWord(word)}>{word}(${this.state.amounts[index + 1]})</Link>
                ))}
                {list.length > 0 ? (<Typography color="textPrimary" key={list.length}>{list[list.length-1]}(${this.state.amounts[list.length]})</Typography>) : null}
            </Breadcrumbs>
        )
    }

    changeList(amount){
        const new_length = this.props.keywordlist.getList().length
        let amount_list = this.state.amounts
        while (amount_list.length < new_length + 1) amount_list = amount_list.concat("")
        if (amount_list.length > new_length + 1) amount_list = amount_list.slice(0, new_length + 1)
        amount_list[new_length] = KMFormat(amount)
        this.setState({
            numList: new_length,
            amounts: amount_list
        })
    }
}
