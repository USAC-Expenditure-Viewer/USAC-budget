import React from 'react';
import './App.css';
import TopBar from "./TopBar";
import DatasetView from "./DatasetView"

function App() {
    return (
        <div>
            <TopBar/>
            <DatasetView dataset={"2018"}/>
        </div>
    );
}

export default App;
