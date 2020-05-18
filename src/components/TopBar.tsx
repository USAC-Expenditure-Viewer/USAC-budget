import {
    AppBar,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ListIcon from "@material-ui/icons/List"
import React from "react";
import Datasets from "../models/Datasets";

interface BarState {
    drawer: boolean
}

export default class TopBar extends React.Component<{}, BarState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            drawer: false
        }
    }

    componentDidMount(): void {
        Datasets.getInstance().addChangeCallback(() => this.forceUpdate())
    }

    render() {
        const toggleDrawer = (state: boolean) => () => this.setState({drawer: state})
        const dataset_list: string[] = Datasets.getInstance().getDatasets() || []
        return (
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography variant="h6" style={{flexGrow: 1}}>
                        {"USAC budget spending " + Datasets.getInstance().getCurrentDatasetName()}
                    </Typography>
                </Toolbar>
                <Drawer anchor={'left'} open={this.state.drawer} onClose={toggleDrawer(false)}>
                    <div onClick={toggleDrawer(false)}>
                        <List>
                            {dataset_list.map(text => (
                                <ListItem button key={text} onClick={() => {
                                    toggleDrawer(false)
                                    Datasets.getInstance().setCurrentDataset(text)
                                }}>
                                    <ListItemIcon><ListIcon/></ListItemIcon>
                                    <ListItemText primary={"Budget " + Datasets.getDatasetTitle(text)}/>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Drawer>
            </AppBar>
        )
    }
}
