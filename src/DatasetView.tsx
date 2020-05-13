import React from 'react';
import './App.css';
import WordCloud from "./WordCloud";
import RecordTable from "./RecordTable";
import KeywordCrumb from "./KeywordCrumb";
import Paper from "@material-ui/core/Paper";
import Dataloader from "./Dataloader";

interface DatasetProp{
    dataset: string
}

export default class DatasetView extends React.Component<DatasetProp> {
    render() {
        let loader = new Dataloader(this.props.dataset)
        return (
            <Paper variant="outlined" className="App" style={{margin: '0 10%'}}>
                <KeywordCrumb style={{margin: 10}} dataloader={loader}/>
                <WordCloud style={{height: '80vh'}} dataloader={loader}/>
                <RecordTable dataloader={loader}/>
            </Paper>
        );
    }
}
