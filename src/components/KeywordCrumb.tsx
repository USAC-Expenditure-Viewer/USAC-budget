/**
 * Created by TylerLiu on 2018/12/23.
 */
import React, {Component} from 'react';
import {Breadcrumbs, Tooltip, Typography} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import {KMFormat} from "../util";
import {DataLoaderProps} from "../models/DataLoader";

export default class KeywordCrumb extends Component<DataLoaderProps> {

    componentDidMount() {
        this.props.dataloader.addChangeCallback(() => this.forceUpdate())
    }

    render() {
        let list = this.props.dataloader.getFilters()
        return (
            <Breadcrumbs separator=">" style={this.props.style}>
                <Tooltip title="Remove All Filters">
                    <Link key={-1} color="textPrimary"
                        onClick={() => this.props.dataloader.sliceFilter(0)}>Transactions [${KMFormat(this.props.dataloader.getDatasetTotal())}]</Link>
                </Tooltip>
                {list.slice(0, -1).map((filter, index) => (
                    <Tooltip title="View This Filter">
                        <Link key={index} color="textSecondary"
                              onClick={() => this.props.dataloader.sliceFilter(index + 1)}>{filter.category}: {filter.name} [${KMFormat(filter.amount)}]</Link>
                    </Tooltip>
                ))}
                {list.length > 0 ? (<Typography color="textPrimary"
                                                key={list.length}>{list[list.length - 1].category}: {list[list.length - 1].name} [${KMFormat(list[list.length - 1].amount)}]</Typography>) : null}
            </Breadcrumbs>
        )
    }
}
