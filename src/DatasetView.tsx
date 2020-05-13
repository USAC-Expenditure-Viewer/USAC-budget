import React from 'react';
import './App.css';
import WordCloud from "./WordCloud";
import RecordTable from "./RecordTable";
import KeywordCrumb from "./KeywordCrumb";
import Paper from "@material-ui/core/Paper";
import DataLoader from "./DataLoader";
import CategoryPie from "./CategoryPie";
import {Tab, Tabs} from "@material-ui/core";

interface DatasetProp{
    query: string
}

interface DatasetState {
    value: number
}

export default class DatasetView extends React.Component<DatasetProp, DatasetState> {
    private readonly loader: DataLoader;
    constructor(props: DatasetProp) {
        super(props);

        this.state = {
            value: 0
        }

        this.loader = new DataLoader(this.props.query)
    }

    render() {
        console.log("view render")
        return (
            <Paper variant="outlined" style={{margin: '0 10%'}}>
                <KeywordCrumb style={{margin: 10}} dataloader={this.loader}/>
                <Tabs value={this.state.value}
                      onChange={(e, value) => {this.setState({value: value})}}
                      indicatorColor="primary" textColor="primary" centered>
                    <Tab label="Keywords"/>
                    <Tab label="Fund"/>
                    <Tab label="Division"/>
                    <Tab label="Department"/>
                    <Tab label="GL"/>
                    <Tab label="Event"/>
                </Tabs>
                <WordCloud hidden={this.state.value !== 0} dataloader={this.loader}/>
                <CategoryPie hidden={this.state.value !== 1} category={"fund"} dataloader={this.loader}/>
                <CategoryPie hidden={this.state.value !== 2} category={"division"} dataloader={this.loader}/>
                <CategoryPie hidden={this.state.value !== 3} category={"department"} dataloader={this.loader}/>
                <CategoryPie hidden={this.state.value !== 4} category={"gl"} dataloader={this.loader}/>
                <CategoryPie hidden={this.state.value !== 5} category={"event"} dataloader={this.loader}/>
                <RecordTable dataloader={this.loader}/>
            </Paper>
        );
    }
}
