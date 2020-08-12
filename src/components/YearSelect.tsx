import React from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import ListIcon from "@material-ui/icons/List";
import Datasets from "../models/Datasets";
import ReactDOM from "react-dom";
import App from "../App";

export default class YearSelect extends React.Component<{}> {
    render() {
        const dataset_list: string[] = Datasets.getInstance().getDatasets() || []

        return(
            // <h1>Choose a year</h1>
            <List>
                {dataset_list.map(text => (
                    <ListItem alignItems="center" button key={text} onClick={() => {
                        Datasets.getInstance().setCurrentDataset(text)
                        // ReactDOM.render(
                        //     <React.StrictMode>
                        //         <App/>
                        //     </React.StrictMode>,
                        //     document.getElementById('root')
                        // )
                    }}>
                        {/* <ListItemIcon><ListIcon/></ListItemIcon> */}
                        <ListItemText primary={"Budget " + Datasets.getDatasetTitle(text)}
                                    style={{textAlign: "center"}}/>
                    </ListItem>
                ))}
            </List>
        )
    }
}
