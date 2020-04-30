import React from 'react';
import './App.css';
import WordCloud from "./Wordcloud";
import RecordTable from "./RecordTable";
import KeywordCrumb from "./KeywordCrumb";
import Paper from "@material-ui/core/Paper";
import KeywordList from "./KeywordList";
import Dataloader from "./Dataloader";
import TopBar from "./TopBar";

function App() {
    let list = new KeywordList()
    let loader = new Dataloader("/expense_summary.json", list)
    return (
        <div>
            <TopBar/>
            <Paper variant="outlined" className="App" style={{margin: '0 10%'}}>
                <KeywordCrumb style={{margin: 10}} keywordList={list}/>
                <WordCloud style={{width: '100%', height: '80vh'}} keywordList={list} dataLoader={loader}/>
                <RecordTable style={{height: '80vh'}} dataLoader={loader}/>
            </Paper>
        </div>
    );
}

export default App;
