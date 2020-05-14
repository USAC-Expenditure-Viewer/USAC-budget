import React from 'react';
import './App.css';
import TopBar from "./components/TopBar";
import DatasetView from "./components/DatasetView"

function App() {
    return (
        <div>
            <TopBar/>
            <DatasetView/>
        </div>
    );
}

export default App;
