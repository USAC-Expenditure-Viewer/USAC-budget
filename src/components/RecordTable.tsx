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
    TableColumnVisibility, ColumnChooser, Toolbar, TableColumnResizing, TableGroupRow, GroupingPanel, SearchPanel
} from "@devexpress/dx-react-grid-material-ui";
import {DataLoaderProps} from "../models/DataLoader";
import {
    Column, GroupingState, IntegratedFiltering, IntegratedGrouping,
    IntegratedSorting,
    IntegratedSummary, SearchState,
    Sorting,
    SortingState,
    SummaryState
} from "@devexpress/dx-react-grid";
import {Paper, Typography} from "@material-ui/core";
import {DataTypeProvider} from "@devexpress/dx-react-grid";
import {GridExporter} from "@devexpress/dx-react-grid-export";
import {saveAs} from "file-saver";
import Datasets from "../models/Datasets";
import {Workbook} from "exceljs";

const CurrencyFormatter = ({value}: {value: number}) => (
    <span style={{ color: 'darkblue' }}>
        {value === undefined ? "" : value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
    </span>
);

const DateFormatter = ({ value }: {value: Date}) => (
    <span>{value === undefined ? "" : value.toDateString()}</span>
);

interface RecordTableState {
    sortingState: Sorting[]
    hiddenColumns: string[]
}

interface RecordTableProps extends DataLoaderProps{
    groupBy?: string | undefined;
}

export default class RecordTable extends Component<RecordTableProps, RecordTableState> {

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

    private exporter: React.RefObject<{exportGrid: (options?: object) => void}>
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
            this.forceUpdate()
        })
    }

    render() {
        const rows = this.props.dataloader.getRecords().map((e, i) => {e.id = i; return e})
        return (
            <Paper>
                <Grid rows={rows} columns={this.columns}>
                    <DataTypeProvider for={['amount']} formatterComponent={CurrencyFormatter} />
                    <DataTypeProvider for={['date']} formatterComponent={DateFormatter} />
                    <SortingState
                        sorting={this.state.sortingState}
                        onSortingChange={this.setSorting.bind(this)}
                    />
                    <SearchState/>
                    <SummaryState totalItems={this.summaryItems} />
                    <IntegratedSorting />
                    <IntegratedFiltering />
                    <IntegratedSummary />
                    <VirtualTable />
                    <TableHeaderRow showSortingControls/>
                    <TableSummaryRow />
                    <TableColumnVisibility
                        hiddenColumnNames={this.state.hiddenColumns}
                        onHiddenColumnNamesChange={(hiddenColumns) => this.setState({hiddenColumns: hiddenColumns})}
                    />
                    <Toolbar />
                    <SearchPanel />
                    <ColumnChooser />
                    <ExportPanel startExport={(options) => this.exporter.current?.exportGrid(options)} />
                </Grid>
                <GridExporter
                    ref={this.exporter}
                    columns={this.columns}
                    rows={rows}
                    onSave={(workbook) => this.onSave(workbook)}
                />
            </Paper>
        )
    }

    private setSorting(newSorting: Sorting[]) {
        const oldSorting = this.state.sortingState;
        if (newSorting.length === 1 && oldSorting.length === 1 &&
            newSorting[0].columnName === oldSorting[0].columnName &&
            newSorting[0].direction === "asc" && oldSorting[0].direction === "desc") {
            this.setState({sortingState: [{ columnName: 'id', direction: 'asc' }]})
        }
        else this.setState({sortingState: newSorting})
    }

    private onSave(workbook: Workbook){
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }),
                `Transactions-${Datasets.getInstance().getCurrentDatasetName()}.xlsx` );
        });
    }

}
