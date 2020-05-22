/**
 * Created by TylerLiu on 2018/12/23.
 */
import React, {Component} from 'react';
import {
    Grid,
    VirtualTable,
    TableHeaderRow,
    TableSummaryRow,
    ExportPanel,
    TableColumnVisibility, ColumnChooser, Toolbar, TableColumnResizing, TableGroupRow
} from "@devexpress/dx-react-grid-material-ui";
import {DataLoaderProps} from "../models/DataLoader";
import {
    Column, GroupingState,
    IntegratedSorting,
    IntegratedSummary,
    Sorting,
    SortingState,
    SummaryState
} from "@devexpress/dx-react-grid";
import {Paper, Typography} from "@material-ui/core";
import {DataTypeProvider} from "@devexpress/dx-react-grid";
import {GridExporter} from "@devexpress/dx-react-grid-export";
import saveAs from "file-saver";
import Datasets from "../models/Datasets";

//TODO virtualize

const CurrencyFormatter = ({value}: {value: number}) => (
    <b style={{ color: 'darkblue' }}>
        {value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
    </b>
);

const DateFormatter = ({ value }: {value: Date}) => (
    <span>{value.toDateString()}</span>
);

interface RecordTableState {
    sortingState: Sorting[]
    hiddenColumns: string[]
}

export default class RecordTable extends Component<DataLoaderProps, RecordTableState> {

    private summaryItems = [
        { columnName: 'date', type: 'count' },
        { columnName: 'amount', type: 'sum' },
    ]

    private columns: Column[] = [
        {title: 'Row Number', name: 'id'},
        {title: 'Date', name: 'date'},
        {title: 'Amount', name: 'amount'},
        {title: 'Description', name: 'description'},
        {title: 'Department', name: 'department'},
        {title: 'Fund', name: 'fund'},
        {title: 'Division', name: 'division'},
        {title: 'Event', name: 'event'},
        {title: 'GL', name: 'gl'},
    ]

    private exporter: React.RefObject<{exportGrid: ()=> void}>
    constructor(props: DataLoaderProps) {
        super(props);
        this.exporter = React.createRef()

        this.state = {
            sortingState: [{ columnName: 'id', direction: 'asc' }],
            hiddenColumns: ['id', 'fund', 'division','event']
        }
    }

    componentDidMount() {
        this.props.dataloader.addChangeCallback(() => {
            this.setState({
                sortingState: [{ columnName: 'id', direction: 'asc' }],
                hiddenColumns: ['id', 'fund', 'division','event'],

            })
            this.forceUpdate()
        })
    }

    render() {
        const rows = this.props.dataloader.getRecords().map((e, i) => {e.id = i; return e})
        return (
            <Paper>
                <Grid rows={rows} columns={this.columns}>
                    <SortingState
                        sorting={this.state.sortingState}
                        onSortingChange={this.setSorting.bind(this)}
                    />
                    <IntegratedSorting/>
                    <SummaryState
                        totalItems={this.summaryItems}
                    />
                    <IntegratedSummary />
                    <DataTypeProvider for={['amount']} formatterComponent={CurrencyFormatter} />
                    <DataTypeProvider for={['date']} formatterComponent={DateFormatter} />
                    <VirtualTable />
                    <TableHeaderRow showSortingControls/>
                    <TableSummaryRow />
                    <TableColumnVisibility
                        hiddenColumnNames={this.state.hiddenColumns}
                        onHiddenColumnNamesChange={(hiddenColumns) => this.setState({hiddenColumns: hiddenColumns})}
                    />
                    <Toolbar />
                    <ColumnChooser />
                </Grid>
            </Paper>
        )
    }

    private setSorting(newSorting: Sorting[]) {
        const oldSorting = this.state.sortingState;
        if (newSorting.length == 1 && oldSorting.length == 1 &&
            newSorting[0].columnName == oldSorting[0].columnName &&
            newSorting[0].direction == "asc" && oldSorting[0].direction == "desc") {
            this.setState({sortingState: [{ columnName: 'id', direction: 'asc' }]})
        }
        else this.setState({sortingState: newSorting})
    }

}
