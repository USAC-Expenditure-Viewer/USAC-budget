import React from 'react';
import './App.css';
import WordCloud from "./WordCloud";
import RecordTable from "./RecordTable";
import KeywordCrumb from "./KeywordCrumb";
import Paper from "@material-ui/core/Paper";
import KeywordList from "./KeywordList";
import Dataloader from "./Dataloader";
import TopBar from "./TopBar";
import WordChart from "./WordChart";

function App() {
    let list = new KeywordList()
    let loader = new Dataloader(window.location.pathname + "/expense_summary.json", list)
    return (
        <div>
            <TopBar/>
            <Paper variant="outlined" className="App" style={{margin: '0 10%'}}>
                <KeywordCrumb style={{margin: 10}} keywordlist={list} dataloader={loader}/>
                <WordCloud style={{height: '80vh'}} keywordlist={list} dataloader={loader}/>
                <WordChart style={{height: '80vh', width: '100%'}} dataloader={loader} />
                <RecordTable style={{height: '80vh'}} dataloader={loader}/>
            </Paper>
        </div>
    );
}

export default App;
