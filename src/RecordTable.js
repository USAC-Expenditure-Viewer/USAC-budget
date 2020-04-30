/**
 * Created by TylerLiu on 2018/12/23.
 */
import React, {Component} from 'react';
import {TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableFooter} from "@material-ui/core";

export default class WordCloud extends Component{

    constructor(props) {
        super(props)

        this.props.dataLoader.addRecordCallback(this.setRecords.bind(this))

        this.state = {
            records : []
        }
    }

     componentDidMount() {

     }

    setRecords(records) {
        this.setState({
            records: records,
        })
     }

    render() {
        return(
            <Paper style={this.props.style}>
                <TableContainer style={{height: "100%"}}>
                    <Table stickyHeader size="small" aria-label="Transaction Records">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Department</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.records.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.date}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>{row.description}</TableCell>
                                    <TableCell>{row.amount}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter style={{position: "sticky", bottom: 0, backgroundColor: "#ffffff"}}>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell align="right">Total: </TableCell>
                                <TableCell>
                                    {Math.round(this.state.records.reduce((prev, curr) => prev + curr.amount, 0) * 100) / 100}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Paper>
        )
    }
}