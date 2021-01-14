import React from 'react';
import './App.css';
import DatasetView from "./components/DatasetView"
import DataLoader from "./models/DataLoader";
import Datasets from "./models/Datasets";
import { Container, CssBaseline } from "@material-ui/core";
import YearSelect from './components/YearSelect';

interface AppState {
  loader: DataLoader
  yearSelected: boolean
}

class App extends React.Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      loader: Datasets.getInstance().getDataLoader(),
      yearSelected: false
    }
  }

  componentDidMount(): void {
    Datasets.getInstance().addChangeCallback(() => {
      this.setState({
        loader: Datasets.getInstance().getDataLoader()
      })
    })
  }

  selectYear = () => {
    this.setState({yearSelected: true})
  }

  render() {
    return (
      <>
        {this.state.yearSelected === true ? 
          <DatasetView loader={this.state.loader} />
        : <YearSelect close={this.selectYear} />}
      </>
    );
  }
}

export default App;
