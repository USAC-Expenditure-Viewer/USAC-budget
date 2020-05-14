import React, {ReactPropTypes} from 'react';
import './App.css';
import WordCloud from "./WordCloud";
import RecordTable from "./RecordTable";
import KeywordCrumb from "./KeywordCrumb";
import Paper from "@material-ui/core/Paper";
import DataLoader from "./DataLoader";
import CategoryPie from "./CategoryPie";
import {Tab, Tabs} from "@material-ui/core";
import AmountSlider from "./AmountSlider";
import QueryBuilder from "./QueryBuilder";

interface DatasetState {
    value: number
}

interface DatasetProps {

}

export default class DatasetView extends React.Component<DatasetProps, DatasetState> {
    private value: number = 0
    private readonly loader: DataLoader;
    constructor(props: DatasetProps) {
        super(props);

        this.value = this.parseQuery(QueryBuilder.getInstance().getQuery())

        this.state = {
            value: this.value
        }

        QueryBuilder.getInstance().addGenerator(this.generateQuery.bind(this), 1)
        this.loader = new DataLoader()
    }

    componentDidMount(): void {
    }

    parseQuery(query: string): number {
        if (query[0] === '?') query = query.slice(1)
        const res = query.split('&').filter((e) => e.startsWith('tab='))
        if (res.length === 0) return 0
        return Number.parseInt(res[0].substr(4))
    }

    generateQuery(): string {
        return 'tab=' + this.value
    }

    render() {
        return (
            <Paper variant="outlined" style={{margin: '0 10%'}}>
                <KeywordCrumb style={{margin: 10}} dataloader={this.loader}/>
                <Tabs value={this.state.value}
                      onChange={(e, value) => {
                          this.value = value
                          this.setState({value: value})
                          QueryBuilder.getInstance().update()
                      }}
                      indicatorColor="primary" textColor="primary" centered>
                    <Tab label="Keywords"/>
                    <Tab label="Fund"/>
                    <Tab label="Division"/>
                    <Tab label="Department"/>
                    <Tab label="GL"/>
                    <Tab label="Event"/>
                    <Tab label="Amount"/>
                </Tabs>
                <WordCloud hidden={this.state.value !== 0} dataloader={this.loader}/>
                <CategoryPie hidden={this.state.value !== 1} category={"fund"} dataloader={this.loader}/>
                <CategoryPie hidden={this.state.value !== 2} category={"division"} dataloader={this.loader}/>
                <CategoryPie hidden={this.state.value !== 3} category={"department"} dataloader={this.loader}/>
                <CategoryPie hidden={this.state.value !== 4} category={"gl"} dataloader={this.loader}/>
                <CategoryPie hidden={this.state.value !== 5} category={"event"} dataloader={this.loader}/>
                <AmountSlider hidden={this.state.value !== 6} dataloader={this.loader} />
                <RecordTable dataloader={this.loader}/>
            </Paper>
        );
    }
}
