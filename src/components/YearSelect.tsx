import React from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import Datasets from "../models/Datasets";

interface YearSelectProps {
  close: () => void
}

/**
 * The sidebar that allows users to choose the year they wish to view.
 * Opens when page first loads, or when user clicks on the year filter.
 */
export default class YearSelect extends React.Component<YearSelectProps> {
  
  render() {
    const dataset_list: string[] = Datasets.getInstance().getDatasets() || []

    return (
      <>
        <h1 style={{textAlign: 'center'}}>Choose a year</h1>
        <List>
          {dataset_list.map(text => (
            <ListItem
              alignItems="center"
              button
              key={text}
              onClick={() => {
                Datasets.getInstance().setCurrentDataset(text);
                this.props.close();
              }}
            >
              <ListItemText
                primary={"Budget " + Datasets.getDatasetTitle(text)}
                style={{ textAlign: "center" }}
              />
            </ListItem>
          ))}
        </List>
      </>
    )
  }
}
