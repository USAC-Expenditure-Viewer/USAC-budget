import React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import Datasets from "../models/Datasets";

export default class YearSelect extends React.Component<{}> {
  render() {
    const dataset_list: string[] = Datasets.getInstance().getDatasets() || []

    return (
      // <h1>Choose a year</h1>
      <List>
        {dataset_list.map(text => (
          <ListItem alignItems="center" button key={text} onClick={() => {
            Datasets.getInstance().setCurrentDataset(text)
          }}>
            <ListItemText primary={"Budget " + Datasets.getDatasetTitle(text)}
              style={{ textAlign: "center" }} />
          </ListItem>
        ))}
      </List>
    )
  }
}
