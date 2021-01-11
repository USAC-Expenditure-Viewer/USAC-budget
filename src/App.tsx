import React from 'react';
import './App.css';
import DatasetView from "./components/DatasetView"
import DataLoader from "./models/DataLoader";
import Datasets from "./models/Datasets";
import { Container, CssBaseline } from "@material-ui/core";

interface AppState {
  loader: DataLoader,
  yearSelected: Boolean
}

class App extends React.Component<{}, AppState> {

  constructor(props: {}) {
    super(props);
    this.state = {
      loader: Datasets.getInstance().getDataLoader(),
      yearSelected: false
    }
  }

  componentWillMount() {
    if (window.location.pathname === 'USAC-budget')
      window.location.pathname = 'USAC-budget?'
  }

  componentDidMount(): void {
    Datasets.getInstance().addChangeCallback(() => {
      this.setState({
        loader: Datasets.getInstance().getDataLoader()
      })
    })
    alert("Please adjust your screen's zoom so it fits the entire budget viewer.")
  }

  toggleModal() {
    // this.state.modalOpen === true ? this.setState({ modalOpen: false}) : this.setState({modalOpen: true})
    return
  }

  render() {
    return (
      <>
        <CssBaseline />
        {/* <VideoModal open={true} close={() => this.toggleModal()} /> */}
        {/* <Container maxWidth="lg"> */}
          <DatasetView loader={this.state.loader} />
        {/* </Container> */}
      </>
    );
  }
}

export default App;
