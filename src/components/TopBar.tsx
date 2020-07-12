import {
    AppBar, Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar, Tooltip,
    Typography
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ListIcon from "@material-ui/icons/List";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import React from "react";
import Datasets from "../models/Datasets";
import InstructionBackProp from "./Instructions";

interface BarState {
    drawer: boolean
    backdropOn: boolean
}

export default class TopBar extends React.Component<{}, BarState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            drawer: false,
            backdropOn: false
        }
    }

    componentDidMount(): void {
        Datasets.getInstance().addChangeCallback(() => this.forceUpdate())
    }

    render() {
        const toggleDrawer = (state: boolean) => () => this.setState({drawer: state})
        const toggleBackdrop = (state: boolean) => () => this.setState({backdropOn: state})
        const dataset_list: string[] = Datasets.getInstance().getDatasets() || []
        return (
            <AppBar position="sticky">
                <Toolbar>
                    <Tooltip title="Select Dataset">
                        <IconButton edge="start" color="inherit" aria-label="dataset menu" onClick={toggleDrawer(true)}>
                            <MenuIcon/>
                        </IconButton>
                    </Tooltip>
                    <Typography variant="h6" style={{flexGrow: 1}}>
                        {"UCLA USA Expense " + Datasets.getInstance().getCurrentDatasetName()}
                    </Typography>
                    <Button color="inherit" onClick={toggleBackdrop(true)} aria-label="help">
                        <HelpOutlineIcon />
                    </Button>
                    <InstructionBackProp open={this.state.backdropOn} onClick={toggleBackdrop(false)}/>
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
