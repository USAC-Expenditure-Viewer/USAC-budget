import React from 'react';
import './App.css';
import DatasetView from "./components/DatasetView"
import DataLoader from "./models/DataLoader";
import Datasets from "./models/Datasets";
import { CssBaseline } from "@material-ui/core";

interface AppState {
  loader: DataLoader
}

/**
 * This is the main class for the entire app
 */
class App extends React.Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      loader: Datasets.getInstance().getDataLoader()
    }
  }

  componentDidMount(): void {
    //  updates the loader state after any changes
    Datasets.getInstance().addChangeCallback(() => {
      this.setState({
        loader: Datasets.getInstance().getDataLoader()
      })
    });

    //  updates the loader when user clicks browser back button
    window.addEventListener('popstate', (event) => {
      this.state.loader.removeFilters()
      this.state.loader.refreshParseQuery(window.location.search)
      this.state.loader.updateCallbacks()
    }, false);
  }

  render() {
    return (
      <>
        <CssBaseline />
        <DatasetView loader={this.state.loader} />
      </>
    );
  }
}

export default App;
