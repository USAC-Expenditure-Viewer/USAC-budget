import React, {Component} from "react";
import {Category, DataLoaderProps, WordEntry} from "../models/DataLoader";
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {KMFormat} from "../util";

interface CategoryPieProps extends DataLoaderProps {
    category: Category
    hidden?: boolean
}

/**
 * Component for a single layer pie Chart.
 */
export default class CategoryPie extends Component<CategoryPieProps> {

    private otherSelected : Boolean = false

    componentDidMount(): void {
        this.props.dataloader.addChangeCallback(() => this.forceUpdate())
    }

    render(): React.ReactNode {
        const data = this.otherSelected ? this.loadOtherSlices() : this.loadMainSlices()
        this.otherSelected = false
        const lastFilter = this.props.dataloader.getLastFilter()
        const selected = lastFilter == null ? undefined :
            (lastFilter.category === this.props.category ? lastFilter.name : undefined)

        return (
            <div style={{height: '80vh'}} hidden={this.props.hidden || false}>
                {(this.props.hidden || false) ? null : (
                    <ResponsiveContainer height="100%" width="100%">
                        <PieChart>
                            <Pie data={data} dataKey="value" nameKey="text"
                                 labelLine={false}
                                 onClick={(e) => this.clickSlice(e)}>
                                {
                                    data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={this.getColor(selected === entry.text)}/>
                                    ))
                                }
                            </Pie>
                            <Tooltip formatter={(value) => "$" + KMFormat(value as number)}
                                     contentStyle={{padding: '0 5px', margin: 0, borderRadius: 5}}/>
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        )
    }

    private clickSlice(e : any) {
        if (e.text === "Other") {
            this.otherSelected = true
            this.forceUpdate()
        }
        else
            this.props.dataloader.addCategoryFilter(this.props.category, e.text)
    }

    private loadMainSlices() : readonly WordEntry[] {
        var data = this.props.dataloader.getCategories(this.props.category)

        let totalValue = 0
        data.forEach((entry) => {
            totalValue += entry.value
        })

        const maxPrice = totalValue * 0.02
        var otherPrice = 0
        for(var i = data.length -1; i >= 0 ; i--) {
            if(data[i].value < maxPrice) {
                data.splice(i, 1)
                otherPrice += data[i].value
            }
        }

        var otherSlice : WordEntry = {text: "Other", value: otherPrice}
        data.push(otherSlice)

        return data
    }

    private loadOtherSlices() : readonly WordEntry[] {
        var data = this.props.dataloader.getCategories(this.props.category)

        let totalValue = 0
        data.forEach((entry) => {
            totalValue += entry.value
        })

        const maxPrice = totalValue * 0.02
        for(var i = data.length -1; i >= 0 ; i--)
            if(data[i].value >= maxPrice)
                data.splice(i, 1)
        
        return data
    }

    getColor(selected: boolean): string {
        if (selected)
            return "#f44336"
        switch (this.props.category) {
            case "fund":
                return "#8bc34a"
            case "division":
                return "#ab47bc"
            case "department":
                return "#26c6da"
            case "gl":
                return "#26a69a"
            case "event":
                return "#ef6c00"
        }
    }
}
