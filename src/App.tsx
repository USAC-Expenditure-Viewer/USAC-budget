import React from 'react';
import './App.css';
import DatasetView from "./components/DatasetView"
import DataLoader from "./models/DataLoader";
import Datasets from "./models/Datasets";
import { Container, CssBaseline } from "@material-ui/core";

interface AppState {
  loader: DataLoader
}

class App extends React.Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      loader: Datasets.getInstance().getDataLoader()
    }
  }

  componentDidMount(): void {
    Datasets.getInstance().addChangeCallback(() => {
      this.setState({
        loader: Datasets.getInstance().getDataLoader()
      })
    })
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
