import React from 'react';
import './App.css';
import TopBar from "./components/TopBar";
import DatasetView from "./components/DatasetView"
import DataLoader from "./models/DataLoader";
import Datasets from "./models/Datasets";
import {Container, CssBaseline, Link, Paper, Typography, List, ListItem, ListItemText} from "@material-ui/core";
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import Footer from "./components/Footer";
import RecordTable from './components/RecordTable';
import YearSelect from './components/YearSelect';

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

    componentDidMount(): void {
        Datasets.getInstance().addChangeCallback(() => {
            this.setState({
                loader: Datasets.getInstance().getDataLoader()
            })
        })
    }

    render() {
        // if (!this.state.yearSelected) {
        //     const dataset_list: string[] = Datasets.getInstance().getDatasets() || []
        //     return(
        //         <>
        //         <List>
        //             {dataset_list.map(text => (
        //                 <ListItem alignItems="center" button key={text} onClick={() => {
        //                     console.log("Year selected: ", text)
        //                     Datasets.getInstance().setCurrentDataset(text)
        //                     this.setState({yearSelected: true})
        //                     //this.forceUpdate()
        //                 }}>
        //                 {/* <ListItemIcon><ListIcon/></ListItemIcon> */}
        //                 <ListItemText primary={"Budget " + Datasets.getDatasetTitle(text)}
        //                     style={{textAlign: "center"}}/>
        //                 </ListItem>
        //             ))}
        //         </List>
        //         </>
        //     );
        // } else {
            return (
                <>
                    <CssBaseline />
                    <Container maxWidth="lg">
                        <DatasetView loader={this.state.loader} />
                        {/* <Footer /> */}
                    </Container>
                </>
            );
        // }
    }
}

export default App;
