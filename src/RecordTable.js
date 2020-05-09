/**
 * Created by TylerLiu on 2018/12/23.
 */
import React, {Component} from 'react';
import {TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter} from "@material-ui/core";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import {commaFormat} from "./util";

//TODO virtualize

export default class WordCloud extends Component{

    constructor(props) {
        super(props)

        this.state = {
            records : [],
            order : 'asc',
            orderBy : null,
        }
    }

     componentDidMount() {
         this.props.dataloader.addRecordCallback(this.setRecords.bind(this))
     }

    setRecords(records) {
        this.setState({
            records: records,
            order: "asc",
            orderBy: null
        })
     }

    handleRequestSort(event, property) {
        let isAsc = this.state.orderBy === property && this.state.order === "asc";
        let isDesc = this.state.orderBy === property && this.state.order === "desc";
        this.setState({
            order: isAsc ? "desc" : "asc",
            orderBy: isDesc ? null : property,
        })
    }

    render() {
        return(
            <Paper style={this.props.style}>
                <TableContainer style={{height: "100%"}}>
                    <Table stickyHeader size="small" aria-label="Transaction Records">
                        <RecordTableHead order={this.state.order} orderBy={this.state.orderBy}
                                         onRequestSort={this.handleRequestSort.bind(this)}/>
                        <TableBody>
                            {this.stableSort(this.state.records).map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{new Date(row.date * 1000).toDateString()}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>{commaFormat(row.amount)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter style={{position: "sticky", bottom: 0, backgroundColor: "#fafafa", borderTop: 1, borderTopColor: "#e0e0e0"}}>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right">Total: </TableCell>
                                <TableCell>
                                    {commaFormat(this.state.records.reduce((prev, curr) => prev + curr.amount, 0))}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Paper>
        )
    }

    getComparator() {
        let comparator = (a, b, orderBy) => (a[orderBy] < b[orderBy]) ? -1 : (a[orderBy] > b[orderBy] ? 1 : 0);
        if (this.state.orderBy === null) return null;
        return this.state.order === 'asc'
            ? (a, b) => comparator(a, b, this.state.orderBy)
            : (a, b) => -comparator(a, b, this.state.orderBy)
    }

    stableSort(array) {
        const comparator = this.getComparator()
        if (comparator === null) return array
        const stabilizedThis = array.map((el, index) => [el, index])
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0])
            if (order !== 0) return order
            return a[1] - b[1]
        });
        return stabilizedThis.map((el) => el[0])
    }
}

const headCells = [
    { id: 'date', label: 'Date' },
    { id: 'department', label: 'Department' },
    { id: 'description', label: 'Description' },
    { id: 'amount', label: 'Amount' },
];

class RecordTableHead extends Component {

    createSortHandler(property) {
        return (event) => this.props.onRequestSort(event, property);
    }

    render() {
        return (
            <TableHead>
                <TableRow>
                    {headCells.map((headCell) => (
                        <TableCell
                            key={headCell.id}
                            sortDirection={this.props.orderBy === headCell.id ? this.props.order : false}
                        >
                            <TableSortLabel
                                active={this.props.orderBy === headCell.id}
                                direction={this.props.orderBy === headCell.id ? this.props.order : 'asc'}
                                onClick={this.createSortHandler(headCell.id)}
                            >
                                {headCell.label}
                            </TableSortLabel>
                        </TableCell>
                    ))}
                </TableRow>
            </TableHead>
        );
    }
}