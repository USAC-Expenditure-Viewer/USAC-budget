/**
 * Created by TylerLiu on 2018/12/23.
 * 
 * Breadcrumb made by Made by Glynn Smith on May 30, 2017
 */
import React, { Component } from 'react';
import { Breadcrumbs, Tooltip, Typography, Drawer, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import ListIcon from "@material-ui/icons/List";

import { KMFormat } from "../util";
import { DataLoaderProps } from "../models/DataLoader";
import Datasets from '../models/Datasets';

interface KeywordCrumbState {
  drawer: boolean
}

export default class KeywordCrumb extends Component<DataLoaderProps, KeywordCrumbState> {

  constructor(props: DataLoaderProps) {
    super(props)
    this.state = {
      drawer: false
    }
  }

  private setYear() {
    this.props.dataloader.sliceFilter(0)
    this.setState({ drawer: true })
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
        return "#F0B6FF" // Blue
      case "event":
        return "#A2B8FF" // Purple
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
        <Breadcrumbs separator=">" style={this.props.style}>
          <Typography align="center">
            <div style={{fontWeight: 'bold', color: 'black'}}>
              USAC Budget Filters
            </div>
          </Typography>
          <Typography align="center">
            <Tooltip title="Remove This Filter">
              <div
                style={{ backgroundColor: "#D0D0D0", cursor: 'pointer', color: 'black' }}
                onClick={() => this.setYear()}
              >
                year: {Datasets.getInstance().getCurrentDatasetName()}
                <br />
                ${KMFormat(loader.getDatasetTotal())}
              </div>
            </Tooltip>
          </Typography>
          {list.slice(0, -1).map((filter, index) => (
            <Typography align="center">
              <Tooltip title="Remove This Filter">
                <div
                  style={{ backgroundColor: this.getColor(filter.category), cursor: 'pointer', color: 'black' }} 
                  onClick={() => loader.sliceFilter(index)}
                >
                  {filter.category}: {filter.name}
                  <br />
                  ${KMFormat(filter.amount)}
                </div>
              </Tooltip>
            </Typography>
          ))}
          {list.length > 0 ? (
            <Typography color="textPrimary" align="center" key={list.length - 1}>
              <Tooltip title="Remove This Filter">
                <div
                  onClick={() => loader.sliceFilter(list.length - 1)}
                  style={{ backgroundColor: this.getColor(list[list.length - 1].category), cursor: 'pointer' }}
                >
                  {list[list.length - 1].category}: {list[list.length - 1].name}<br />${KMFormat(list[list.length - 1].amount)}
                </div>
              </Tooltip>
            </Typography>
          ) : null}
        </Breadcrumbs>
        <Drawer
          anchor={'left'}
          open={this.state.drawer}
          onClose={() => this.setState({ drawer: false })}
        >
          <div onClick={() => this.setState({ drawer: false })}>
            <List>
              {dataset_list.map(text => (
                <ListItem button key={text} onClick={() => {
                  this.setState({ drawer: true })
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
