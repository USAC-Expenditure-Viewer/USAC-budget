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
    TableColumnVisibility, ColumnChooser, Toolbar, TableGroupRow, GroupingPanel, SearchPanel, TableColumnResizing
} from "@devexpress/dx-react-grid-material-ui";
import {Category, DataLoaderProps} from "../models/DataLoader";
import {
    Column, GroupingState, GroupSummaryItem, IntegratedFiltering, IntegratedGrouping,
    IntegratedSorting,
    IntegratedSummary, SearchState,
    Sorting,
    SortingState, SummaryItem,
    SummaryState, TableColumnWidthInfo, TableGroupRow as TableGroupRowBase
} from "@devexpress/dx-react-grid";
import {Paper} from "@material-ui/core";
import {DataTypeProvider} from "@devexpress/dx-react-grid";
import {GridExporter} from "@devexpress/dx-react-grid-export";
import {saveAs} from "file-saver";
import Datasets from "../models/Datasets";
import {Workbook} from "exceljs";

const month_name = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']

const CurrencyFormatter = ({value}: {value: number}) => (
    <span style={{ color: 'darkblue' }}>
        {value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
    </span>
);

const DateFormatter = ({ value }: {value: Date}) => (
    <span>{value.toDateString()}</span>
);

const DateGroupFormatter = ({ column, row }: TableGroupRowBase.ContentProps) => {
    if (column.name === 'date') {
        row.key.toString()
        const [year, month] = row.key.toString().split('-');
        return <span>{month_name[Number.parseInt(month) - 1]} {year}</span>
    } else return (
        <span>{row.value}</span>
    )
};

const dateToYearMonth = (value: Date) =>
    value.getFullYear().toString().padStart(4, '0') + '-' + (value.getMonth() + 1).toString().padStart(2, '0')

interface RecordTableState {
    sortingState: Sorting[]
}

interface RecordTableProps extends DataLoaderProps{
    groupBy?: Category | "date" | undefined;
}

export default class RecordTable extends Component<RecordTableProps, RecordTableState> {

    private readonly summaryItems: SummaryItem[] = [
        { columnName: 'date', type: 'count' },
        { columnName: 'amount', type: 'sum'},
    ]

    private readonly columns: Column[] = [
        {title: 'Row', name: 'id'},
        {title: 'Posted Date', name: 'date'},
        {title: 'Department', name: 'department'},
        {title: 'Fund', name: 'fund'},
        {title: 'Division', name: 'division'},
        {title: 'Event', name: 'event'},
        {title: 'GL', name: 'gl'},
        {title: 'Description', name: 'description'},
        {title: 'Amount', name: 'amount'},
    ]

    private readonly tableColumnExtension: VirtualTable.ColumnExtension[] = [
        {columnName: 'id',          wordWrapEnabled:true},
        {columnName: 'date',        wordWrapEnabled:true},
        {columnName: 'department',  wordWrapEnabled:true},
        {columnName: 'fund',        wordWrapEnabled:true},
        {columnName: 'division',    wordWrapEnabled:true},
        {columnName: 'event',       wordWrapEnabled:true},
        {columnName: 'gl',          wordWrapEnabled:true},
        {columnName: 'description', wordWrapEnabled:true},
        {columnName: 'amount',      wordWrapEnabled:true, align: 'center'},
    ]

    private readonly groupSummaryItems: GroupSummaryItem[] = [
        { columnName: 'amount', type: 'sum', showInGroupFooter: false, alignByColumn: true},
        { columnName: 'amount', type: 'sum', showInGroupFooter: true},
        { columnName: 'date', type: 'count', showInGroupFooter: true},
    ]

    private groupingColumnExtensions: IntegratedGrouping.ColumnExtension[] = [
        {columnName: 'date', criteria: (value) => {
            if (value instanceof Date) {
                const key = dateToYearMonth(value)
                return {key: key}
            } else return {key: ""};
        }}
    ]

    private columnWidth: TableColumnWidthInfo[] = [
        {columnName: 'id',          width: 70},
        {columnName: 'date',        width: 120},
        {columnName: 'fund',        width: 150},
        {columnName: 'division',    width: 150},
        {columnName: 'department',  width: 150},
        {columnName: 'event',       width: 150},
        {columnName: 'gl',          width: 150},
        {columnName: 'description', width: 350},
        {columnName: 'amount',      width: 150},
    ]

    private readonly exporter: React.RefObject<{exportGrid: (options?: object) => void}>

    private groupWeight: Map<string, number>

    private integratedSortingColumnExtensions: IntegratedSorting.ColumnExtension[] = []

    constructor(props: DataLoaderProps) {
        super(props);
        this.exporter = React.createRef()

        this.state = {
            sortingState: [{ columnName: 'id', direction: 'asc' }],
        }

        this.groupWeight = new Map<string, number>()
        if (this.props.groupBy !== undefined && this.props.groupBy !== 'date') {
            this.buildGroupWeightTable()
        }
    }

    componentDidMount() {
        this.props.dataloader.addChangeCallback(() => {
            this.buildGroupWeightTable();
            this.forceUpdate()
        })
    }

    private buildGroupWeightTable() {
        if (this.props.groupBy !== undefined && this.props.groupBy !== 'date') {
            this.groupWeight.clear()
            this.groupWeight.set(`\nGroupBy${this.props.groupBy}`, 1)
            this.props.dataloader.getCategories(this.props.groupBy).forEach(entry => {
                this.groupWeight.set(entry.text, entry.value)
            })

            this.integratedSortingColumnExtensions = [
                { columnName: this.props.groupBy,
                    compare: (a, b) => (this.groupWeight?.get(a)||0) - (this.groupWeight?.get(b)||0)
                },
            ]
        }
    }

    render() {
        const rows = this.props.dataloader.getRecords().map((e, i) => {e.id = i; return e})

        if (this.props.groupBy !== undefined && this.props.groupBy !== 'date' &&
            !this.groupWeight.has(`\nGroupBy${this.props.groupBy}`)) {
            this.buildGroupWeightTable()
            console.log("built table")
        }

        return (
            <Paper>
                <Grid rows={rows} columns={this.columns}>
                    <SortingState
                        sorting={this.state.sortingState}
                        onSortingChange={this.setSorting.bind(this)}
                    />
                    <GroupingState
                        grouping={this.props.groupBy !== undefined ? [{columnName: this.props.groupBy}]:[]}
                    />
                    <SearchState/>
                    <SummaryState totalItems={this.summaryItems} groupItems={this.groupSummaryItems}/>

                    <IntegratedGrouping columnExtensions={this.groupingColumnExtensions}/>
                    <IntegratedFiltering />
                    <IntegratedSorting columnExtensions={this.integratedSortingColumnExtensions}/>
                    <IntegratedSummary />

                    <DataTypeProvider for={['amount']} formatterComponent={CurrencyFormatter} />
                    <DataTypeProvider for={['date']} formatterComponent={DateFormatter} />

                    <VirtualTable columnExtensions={this.tableColumnExtension}/>
                    <TableColumnResizing
                        defaultColumnWidths={this.columnWidth}
                    />
                    <TableColumnVisibility
                        defaultHiddenColumnNames={['id']}
                    />
                    <TableHeaderRow showSortingControls/>
                    {this.props.groupBy === 'date' ?
                        <TableGroupRow
                            contentComponent={DateGroupFormatter}
                            columnExtensions={[{columnName: 'date', showWhenGrouped: true}]}
                        /> :
                        <TableGroupRow />}
                    <TableSummaryRow />

                    <Toolbar />
                    <GroupingPanel showSortingControls emptyMessageComponent={() => <span/>}/>
                    <SearchPanel />
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
        let sorts: Sorting[] = [];
        const oldSorting = this.state.sortingState;
        newSorting.forEach(value => {
            let add = true
            for (const oldValue of oldSorting) {
                if (value.columnName === oldValue.columnName && value.direction === "asc" && oldValue.direction === "desc") {
                    add = false
                    break
                }
            }
            if (add) sorts.push(value)
        })
        this.setState({sortingState: sorts})
    }

    private onSave(workbook: Workbook){
        workbook.xlsx.writeBuffer().then((buffer) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }),
                `Transactions-${Datasets.getInstance().getCurrentDatasetName()}.xlsx` );
        });
    }

}
