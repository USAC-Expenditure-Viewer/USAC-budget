import React from 'react';
import '../App.css';
import WordCloud from "./WordCloud";
import RecordTable from "./RecordTable";
import KeywordCrumb from "./KeywordCrumb";
import Paper from "@material-ui/core/Paper";
import DataLoader, {Category, isOfTypeCategory} from "../models/DataLoader";
import CategoryPie from "./CategoryPie";
import {Tab, Tabs, withStyles} from "@material-ui/core";
import AmountSlider from "./AmountSlider";
import QueryBuilder from "../models/QueryBuilder";
import DateSlider from "./DateSlider";
import ExplanationText from "./ExplanationText";

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

interface StyledTabProps{
    label?: React.ReactNode;
    value?: any;
}

const NarrowTab = withStyles((theme) => ({
    root: {
        minWidth: 72,
        fontWeight: theme.typography.fontWeightRegular,
    },
    selected: {},
}))((props:StyledTabProps) => <Tab {...props} />);


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
        } else return 'table'
    }

    generateQuery(): string {
        return 'tab=' + this.value
    }

    render() {
        const loader = this.props.loader
        return (
            <div>
                <KeywordCrumb style={{margin: 10}} dataloader={loader}/>
                <Tabs value={this.state.value}
                      onChange={(e, value) => {
                          this.value = value
                          this.setState({value: value})
                          QueryBuilder.getInstance().update()
                      }}
                      variant="fullWidth"
                      indicatorColor="primary" textColor="primary">
                    <Tab label="Table" value="table"/>
                    <NarrowTab label="Keywords" value="keyword"/>
                    <NarrowTab label="Fund" value="fund"/>
                    <NarrowTab label="Division" value="division"/>
                    <NarrowTab label="Department" value="department"/>
                    <NarrowTab label="GL" value="gl"/>
                    <NarrowTab label="Event" value="event"/>
                    <NarrowTab label="Amount" value="amount"/>
                    <NarrowTab label="Date" value="date"/>
                </Tabs>
                <Paper elevation={2} style={{padding: 10}}>
                    <ExplanationText category={this.state.value}/>
                    <WordCloud hidden={this.state.value !== 'keyword'} dataloader={loader}/>
                    <CategoryPie hidden={this.state.value !== "fund"} category={"fund"} dataloader={loader}/>
                    <CategoryPie hidden={this.state.value !== "division"} category={"division"} dataloader={loader}/>
                    <CategoryPie hidden={this.state.value !== "department"} category={"department"}
                                 dataloader={loader}/>
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
