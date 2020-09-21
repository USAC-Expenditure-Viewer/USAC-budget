/**
 * Created by TylerLiu on 2018/12/23.
 * 
 * Breadcrumb made by Made by Glynn Smith on May 30, 2017
 */
import React, { Component } from 'react';
import { Breadcrumbs, Tooltip, Typography, Container, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import ListIcon from "@material-ui/icons/List";

import { KMFormat } from "../util";
import DataLoader, { DataLoaderProps } from "../models/DataLoader";
import Datasets from '../models/Datasets';
import styles from './mystyle.module.css';

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
                return "#FF6F6F" // Red
            case "division":
                return "#FFBB7F" // Orange
            case "department":
                return "#A4F997" // Green
            case "gl":
                return "#A2B8FF" // Blue
            case "event":
                return "#F0B6FF" // Purple
            default:
                return "#D0D0D0" // Gray
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
            {/* <ul className={styles.breadcrumb}>
                <li><a href="#">Home</a></li>
                    <li style={{backgroundColor: "Blue"}}><a href="#">Vehicles</a></li>
                    <li><a href="#">Vans</a></li>
                    <li><a href="#">Camper Vans</a></li>
                    <li><a href="#">1989 VW Westfalia Vanagon</a></li>
                </ul> */}

                <Breadcrumbs separator=">" style={this.props.style}>
                    <Typography align="center">
                        <Tooltip title="Choose new year">
                            <Link key={-1} color="textPrimary"
                                onClick={() => this.setYear()}>
                                USAC Budget Filters: <br />
                                Click to remove filters
                            </Link>
                        </Tooltip>
                    </Typography>

                    {/* Year */}
                    <div style={{ backgroundColor: "#D0D0D0" }}>
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
                        </div>
                    ))}

                    {/* Last Breadcrumb */}
                    {list.length > 0 ? (<div style={{ backgroundColor: this.getColor(list[list.length - 1].category) }}>
                        <Typography color="textPrimary" align="center" key={list.length - 1}>
                            {list[list.length - 1].category}: {list[list.length - 1].name}<br />${KMFormat(list[list.length - 1].amount)}
                        </Typography>
                    </div>) : null}
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
