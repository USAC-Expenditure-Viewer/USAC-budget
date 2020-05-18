/**
 * Created by TylerLiu on 2018/12/23.
 */
import React, {Component} from 'react';
import {commaFormat} from "../util";
import MaterialTable, {Column, Icons, Options} from "material-table";
import {DataLoaderProps} from "../models/DataLoader";
import {ArrowDownward, ChevronLeft, ChevronRight, FirstPage, LastPage, SaveAlt} from "@material-ui/icons"

//TODO virtualize

export default class RecordTable extends Component<DataLoaderProps> {

    private columns: Column<any>[] = [
        {title: 'Date', field: 'date', type: "date"},
        {title: 'Amount', field: 'amount', type: "currency"},
        {title: 'Description', field: 'description'},
        {title: 'Department', field: 'department'},
        {title: 'Fund', field: 'fund'},
        {title: 'Division', field: 'division'},
        {title: 'Event', field: 'event'},
        {title: 'GL', field: 'gl'},
    ]

    private options: Options = {
        showTitle: true,
        sorting: true,
        exportButton: true,
        padding: "dense",
        paging: true,
        search: false,
        draggable: false,
        headerStyle: {position: 'sticky', top: 0},
        exportAllData: true,
    }

    private icons: Icons = {
        // @ts-ignore
        Export: SaveAlt,
        // @ts-ignore
        SortArrow: ArrowDownward,
        // @ts-ignore
        FirstPage: FirstPage,
        // @ts-ignore
        LastPage: LastPage,
        // @ts-ignore
        NextPage: ChevronRight,
        // @ts-ignore
        PreviousPage: ChevronLeft,
    }

    componentDidMount() {
        this.props.dataloader.addChangeCallback(() => {
            this.forceUpdate()
        })
    }

    render() {
        return (
            <MaterialTable options={this.options} columns={this.columns} icons={this.icons}
                           data={this.props.dataloader.getRecords()}
                           title={"Displayed total $" + commaFormat(this.props.dataloader.getTotal())}/>
        )
    }

}
