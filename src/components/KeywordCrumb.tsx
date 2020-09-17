/**
 * Created by TylerLiu on 2018/12/23.
 */
import React, { Component } from 'react';
import { Breadcrumbs, Tooltip, Typography, Container, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import ListIcon from "@material-ui/icons/List";

import { KMFormat } from "../util";
import DataLoader, { DataLoaderProps } from "../models/DataLoader";
import Datasets from '../models/Datasets';

interface KeywordCrumbState {
    drawer: boolean
}

export default class KeywordCrumb extends Component<DataLoaderProps, KeywordCrumbState> {

    constructor(props : DataLoaderProps) {
        super(props)
        this.state = {
            drawer: false
        }
    }

    private setYear() {
        this.props.dataloader.sliceFilter(0)
        this.setState({drawer: true})
    }

    private getColor(category: string): string {
        switch (category) {
            case "fund":
                return "Red"
            case "division":
                return "Orange"
            case "department":
                return "Green"
            case "gl":
                return "Blue"
            case "event":
                return "Purple"
            default:
                return "Gray"
        }
    }


    componentDidMount() {
        this.props.dataloader.addChangeCallback(() => this.forceUpdate())
    }

    render() {
        const loader = this.props.dataloader
        let list = loader.getFilters()
        const dataset_list: string[] = Datasets.getInstance().getDatasets() || []

        return (
            <>
                <Breadcrumbs separator=">" style={this.props.style}>
                    <Typography>USAC Budget Filters: </Typography>

                    {/* Year */}
                    <div style={{ backgroundColor: "Gray" }}>
                        <Typography align="center">
                            <Tooltip title="Remove All Filters">
                                <Link key={-1} color="textPrimary"
                                    onClick={() => loader.sliceFilter(0)}>
                                year: {Datasets.getInstance().getCurrentDatasetName()}
                                    <br />
                                ${KMFormat(loader.getDatasetTotal())}
                                </Link>
                            </Tooltip>
                        </Typography>
                        <Typography align="center">
                            <Tooltip title="Choose new year">
                                <Link key={-1} color="textSecondary" align="center"
                                    onClick={() => this.setYear()}>
                                    <div style={{fontWeight: "bold"}}>
                                    x
                                    </div>
                                </Link>
                            </Tooltip>
                        </Typography>
                    </div>

                    {/* Breadcrumbs */}
                    {list.slice(0, -1).map((filter, index) => (
                        <div style={{ backgroundColor: this.getColor(filter.category) }}>
                            <Typography align="center">
                                <Tooltip title="View This Filter">
                                    <Link key={index} color="textSecondary" align="center"
                                        onClick={() => loader.sliceFilter(index + 1)}>
                                        {filter.category}: {filter.name}
                                        <br />
                                        ${KMFormat(filter.amount)}
                                    </Link>
                                </Tooltip>
                            </Typography>
                            <Typography align="center">
                                <Tooltip title="Remove This Filter">
                                    <Link key={index} color="textSecondary" align="center"
                                        onClick={() => loader.sliceFilter(index)}>
                                        <div style={{fontWeight: "bold"}}>
                                            x
                                        </div>
                                    </Link>
                                </Tooltip>
                            </Typography>
                        </div>
                    ))}

                    {/* Last Breadcrumb */}
                    {list.length > 0 ? (<div style={{ backgroundColor: this.getColor(list[list.length - 1].category) }}>
                        <Typography color="textPrimary" align="center" key={list.length - 1}>
                            {list[list.length - 1].category}: {list[list.length - 1].name}<br />${KMFormat(list[list.length - 1].amount)}
                        </Typography>
                        <Typography align="center">
                            <Tooltip title="Remove This Filter">
                                <Link key={list.length - 1} color="textSecondary" align="center"
                                    onClick={() => loader.sliceFilter(list.length - 1)}>
                                    <div style={{fontWeight: "bold", backgroundColor: this.getColor(list[list.length - 1].category) }}>
                                        x
                                    </div>
                                </Link>
                            </Tooltip>
                        </Typography>
                    </div>) : null}
                    
                    {/* Other */}
                    {loader.getOtherDepth() > 0 ? <div style={{ backgroundColor: this.getColor(loader.getOtherCategory()) }}>
                        <Tooltip title="Pie Depth">
                            <Typography align="center">
                                {loader.getOtherCategory().toString()} depth: {loader.getOtherDepth().toString()}
                            </Typography>
                        </Tooltip>
                        <Typography align="center">
                            <Tooltip title="Back to depth 0">
                                <Link key={-1} color="textSecondary" align="center"
                                    onClick={() => loader.setOtherDepth(0)}>
                                    <div style={{fontWeight: "bold"}}>
                                        x
                                    </div>
                            </Link>
                            </Tooltip>
                        </Typography>
                    </div> : null}
                </Breadcrumbs>
                <Drawer anchor={'left'} open={this.state.drawer} onClose={() => this.setState({drawer: false})}>
                    <div onClick={() => this.setState({drawer: false})}>
                    <List>
                        {dataset_list.map(text => (
                            <ListItem button key={text} onClick={() => {
                                this.setState({drawer: true})
                                Datasets.getInstance().setCurrentDataset(text)
                            }}>
                                <ListItemIcon><ListIcon /></ListItemIcon>
                                <ListItemText primary={"Budget " + Datasets.getDatasetTitle(text)} />
                            </ListItem>
                        ))}
                    </List>
                    </div>
                </Drawer>
            </>
        )
    }
}
