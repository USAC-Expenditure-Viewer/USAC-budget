import React from 'react';
import '../App.css';
import WordCloud from "./WordCloud";
import RecordTable from "./RecordTable";
import KeywordCrumb from "./KeywordCrumb";
import Paper from "@material-ui/core/Paper";
import DataLoader, {Category, isOfTypeCategory} from "../models/DataLoader";
import CategoryPie from "./CategoryPie";
import {Container, Tab, Tabs, withStyles, Typography} from "@material-ui/core";
import AmountSlider from "./AmountSlider";
import QueryBuilder from "../models/QueryBuilder";
import DateSlider from "./DateSlider";
import ExplanationText from "./ExplanationText";

export type TabTypes = Category | 'table' | 'keyword' | "amount" | "date";

interface DatasetState {
    value: TabTypes;
}

interface DatasetProps {
    loader: DataLoader
}

export function isOfTypeTabs (input: string): input is TabTypes {
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
    private value: TabTypes = 'keyword'

    constructor(props: DatasetProps) {
        super(props);

        this.value = 'keyword'
        // this.parseQuery(QueryBuilder.getInstance().getQuery())

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

    onTabChange(value: string) {
        this.value = isOfTypeTabs(value) ? value : 'table'
        this.setState({value: this.value})
        QueryBuilder.getInstance().update()
    }

    render() {
        const loader = this.props.loader
        const tableElement = <RecordTable dataloader={loader} onChange={this.onTabChange.bind(this)} style={{
            zIndex: 2,
            backgroundColor: "lightblue",
        }}/>
        return (
            <>
                <KeywordCrumb dataloader={loader}/>
                {tableElement}
                <Paper elevation={2} style={{
                    position: "absolute",
                    zIndex: -1,
                    bottom: 0,
                    width: 1230
                }}>
                    <ExplanationText category={this.state.value}/>
                    <WordCloud hidden={this.state.value !== 'keyword'} dataloader={loader}/>
                    <CategoryPie hidden={!isOfTypeCategory(this.state.value)}
                                category={isOfTypeCategory(this.state.value) ? this.state.value : "fund"} dataloader={loader}/>
                    <AmountSlider hidden={this.state.value !== "amount"} dataloader={loader}/>
                    <DateSlider hidden={this.state.value !== 'date'} dataloader={loader}/>
                </Paper>
            </>
        );
    }
}
