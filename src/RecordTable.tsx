/**
 * Created by TylerLiu on 2018/12/23.
 */
import React, {Component} from 'react';
import {commaFormat} from "./util";
import MaterialTable, {Column, Icons, Options} from "material-table";
import {DataloaderProps} from "./Dataloader";
import {SaveAlt, ArrowDownward} from "@material-ui/icons"

//TODO virtualize

export default class RecordTable extends Component<DataloaderProps>{

    private columns: Column<any>[] = [
        {title: 'Date', field: 'date', type: "date"},
        {title: 'Department', field: 'department'},
        {title: 'Description', field: 'description'},
        {title: 'Amount', field: 'amount', type: "currency"}
    ]

    private options: Options = {
        showTitle: true,
        sorting: true,
        exportButton: true,
        padding: "dense",
        paging: false,
        search: false,
        draggable: false,
        maxBodyHeight: window.innerHeight * 0.8,
        headerStyle: { position: 'sticky', top: 0 },
    }

    private icons: Icons = {
        // @ts-ignore
        Export: SaveAlt,
        // @ts-ignore
        SortArrow: ArrowDownward
    }

     componentDidMount() {
         this.props.dataloader.addChangeCallback(() => this.forceUpdate())
     }

    render() {
        return(
                <MaterialTable options={this.options} columns={this.columns} icons={this.icons}
                               data={this.props.dataloader.getRecords()}
                               title={"Transactions: total $"+commaFormat(this.props.dataloader.getTotal())}/>
        )
    }

}