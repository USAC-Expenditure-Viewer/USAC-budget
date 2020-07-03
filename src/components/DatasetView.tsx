import React from 'react';
import '../App.css';
import WordCloud from "./WordCloud";
import RecordTable from "./RecordTable";
import KeywordCrumb from "./KeywordCrumb";
import Paper from "@material-ui/core/Paper";
import DataLoader, {Category, isOfTypeCategory} from "../models/DataLoader";
import CategoryPie from "./CategoryPie";
import {Tab, Tabs, Typography} from "@material-ui/core";
import AmountSlider from "./AmountSlider";
import QueryBuilder from "../models/QueryBuilder";
import DateSlider from "./DateSlider";

type TabTypes = Category | 'table' | 'keyword' | "amount" | "date";

interface DatasetState {
    value: TabTypes;
}

interface DatasetProps {
    loader: DataLoader
}

function isOfTypeTabs (input: string): input is TabTypes {
    return isOfTypeCategory(input) || ['table' , 'keyword' , "amount" , "date"].includes(input);
}

export default class DatasetView extends React.Component<DatasetProps, DatasetState> {
    private value: TabTypes = 'table'

    constructor(props: DatasetProps) {
        super(props);

        this.value = this.parseQuery(QueryBuilder.getInstance().getQuery())

        this.state = {
            value: this.value,
        }

        QueryBuilder.getInstance().addGenerator(this.generateQuery.bind(this), 1)
    }

    componentDidMount(): void {
        this.props.loader.addChangeCallback(() => this.forceUpdate())
    }

    parseQuery(query: string): TabTypes {
        if (query[0] === '?') query = query.slice(1)
        const res = query.split('&').filter((e) => e.startsWith('tab='))
        if (res.length === 0) return 'table'
        let s = res[0].substr(4)
        if (isOfTypeTabs(s)) {
            return s
        }
        else return 'table'
    }

    generateQuery(): string {
        return 'tab=' + this.value
    }

    render() {
        const loader = this.props.loader
        return (
            <div>
                <Typography color="textSecondary">
                    <br/>
                    Below is the raw transaction table of the Undergraduate Student Association.
                    Click on a column to visualize it.
                    <br/>
                    Low on time? Most important is the descriptions column. Everything else is administrative.
                    <br/><br/>
                </Typography>
                <KeywordCrumb style={{margin: 10}} dataloader={loader}/>
                <Tabs value={this.state.value}
                      onChange={(e, value) => {
                          this.value = value
                          this.setState({value: value})
                          QueryBuilder.getInstance().update()
                      }}
                      variant="scrollable"
                      indicatorColor="primary" textColor="primary">
                    <Tab label="Table" value="table"/>
                    <Tab label="Keywords" value="keyword"/>
                    <Tab label="Fund" value="fund"/>
                    <Tab label="Division" value="division"/>
                    <Tab label="Department" value="department"/>
                    <Tab label="GL" value="gl"/>
                    <Tab label="Event" value="event"/>
                    <Tab label="Amount" value="amount"/>
                    <Tab label="Date" value="date"/>
                </Tabs>
                <Typography color="textSecondary">
                    <br/>
                    Below is the raw transaction table of the Undergraduate Student Association.
                    Click on a column to visualize it.
                    <br/>
                    Low on time? Most important is the descriptions column. Everything else is administrative.
                    <br/><br/>
                </Typography>
                <Paper elevation={2} style={{padding: 10}}>
                <WordCloud hidden={this.state.value !== 'keyword'} dataloader={loader}/>
                <CategoryPie hidden={this.state.value !== "fund"} category={"fund"} dataloader={loader}/>
                <CategoryPie hidden={this.state.value !== "division"} category={"division"} dataloader={loader}/>
                <CategoryPie hidden={this.state.value !== "department"} category={"department"} dataloader={loader}/>
                <CategoryPie hidden={this.state.value !== "gl"} category={"gl"} dataloader={loader}/>
                <CategoryPie hidden={this.state.value !== "event"} category={"event"} dataloader={loader}/>
                <AmountSlider hidden={this.state.value !== "amount"} dataloader={loader}/>
                <DateSlider hidden={this.state.value !== 'date'} dataloader={loader}/>
                <RecordTable hidden={this.state.value !== 'table'} dataloader={loader}/>
            </Paper>
            </div>
        );
    }
}
