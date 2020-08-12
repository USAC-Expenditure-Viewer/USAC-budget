/**
 * Created by TylerLiu on 2018/12/23.
 */
import React, {Component} from 'react';
import {Breadcrumbs, Tooltip, Typography, Container} from "@material-ui/core";
import Link from "@material-ui/core/Link";
import {KMFormat} from "../util";
import {DataLoaderProps} from "../models/DataLoader";

export default class KeywordCrumb extends Component<DataLoaderProps> {

    private getColor(index : number): string {
        switch(index % 6) {
            case 0: return "DeepSkyBlue"
            case 1: return "LightBlue"
            case 2: return "DarkTurquoise"
            case 3: return "Cyan"
            case 4: return "CornflowerBlue"
            case 5: return "LightSkyBlue"
            default: return "DeepSkyBlue"
        }
    }

    private setYear() {
        this.props.dataloader.sliceFilter(0)
        window.location.reload(false)
    }

    componentDidMount() {
        this.props.dataloader.addChangeCallback(() => this.forceUpdate())
    }

    render() {
        let list = this.props.dataloader.getFilters()
        return (
            <Breadcrumbs separator=">" style={this.props.style}>
                <Typography>Fliters Applied:</Typography>
                <Tooltip title="Remove All Filters">
                    <Link key={-1} color="textPrimary"
                      onClick={() => this.setYear()}>
                        <Typography align="center">
                            <div style={{backgroundColor: "DodgerBlue"}}>
                                year: {this.props.dataloader.getDataset()}-{(Number(this.props.dataloader.getDataset())+1).toString()}
                                <br/>
                                ${KMFormat(this.props.dataloader.getDatasetTotal())}
                            </div>
                        </Typography>
                    </Link>
                </Tooltip>
                {list.slice(0, -1).map((filter, index) => (
                    <Tooltip title="View This Filter">
                        <Link key={index} color="textSecondary" align="center"
                          onClick={() => this.props.dataloader.sliceFilter(index + 1)}>
                            <Typography align="center">
                                <div style={{backgroundColor: this.getColor(index)}}>
                                    {filter.category}: {filter.name}
                                    <br/>
                                    ${KMFormat(filter.amount)}
                                </div>
                            </Typography>
                        </Link>
                    </Tooltip>
                ))}
                {list.length > 0 ? (<div style={{backgroundColor: this.getColor(list.length)}}>
                    <Typography color="textPrimary" align="center" key={list.length}>     
                        {list[list.length - 1].category}: {list[list.length - 1].name}<br/>${KMFormat(list[list.length - 1].amount)}
                    </Typography></div>) : null}
            </Breadcrumbs>
        )
    }
}
