import React, {Component} from "react";
import {Category, DataLoaderProps, WordEntry} from "../models/DataLoader";
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {KMFormat} from "../util";
import { Word } from "react-wordcloud";

interface CategoryPieProps extends DataLoaderProps {
    category: Category
    hidden?: boolean
}

interface CategoryPieState {
    pieDepth: number
    category: Category
    data: WordEntry[]
}

/**
 * Component for a single layer pie Chart.
 */
export default class CategoryPie extends Component<CategoryPieProps, CategoryPieState> {

    //private pieDepth: number = 0
    private timesRendered: number = 0 

    constructor(props: CategoryPieProps) {
        super(props)
        this.state = {
            pieDepth: 0,
            category: this.props.category,
            data: this.props.dataloader.getCategories(this.props.category)
        }
    }

    componentDidMount(): void {
        this.props.dataloader.addChangeCallback(() => this.forceUpdate())
    }

    render(): React.ReactNode {
        this.timesRendered++
        //console.log("Times rendered: ", this.timesRendered)
        //const data = (this.props.category == this.state.category) ? this.loadSlices() : this.newCategory()
        const lastFilter = this.props.dataloader.getLastFilter()
        const selected = lastFilter == null ? undefined :
            (lastFilter.category === this.props.category ? lastFilter.name : undefined)

        return (
            <div style={{height: '80vh'}} hidden={this.props.hidden || false}>
                {(this.props.hidden || false) ? null : (
                    <ResponsiveContainer height="100%" width="100%">
                        <PieChart>
                            <Pie data={this.state.data} dataKey="value" nameKey="text"
                                 labelLine={false}
                                 onClick={(e) => this.clickSlice(e)}>
                                {
                                    this.state.data.map((entry, index) => (
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
            this.setState({pieDepth: this.state.pieDepth+1})
            // this.loadSlices()
            // this.forceUpdate()
        }
        else
            this.props.dataloader.addCategoryFilter(this.props.category, e.text)
    }

    private newCategory() : readonly WordEntry[] {
        console.log("New category, props: ", this.props.category)
        console.log("State: ", this.state.category)
        this.setState({
            pieDepth: 0,
            category: this.props.category
        })
        return this.props.dataloader.getCategories(this.props.category)
    }

    private loadSlices() {
        console.log("Old category, props: ", this.props.category)
        console.log("State: ", this.state.category)

        var data = this.props.dataloader.getCategories(this.state.category)
        
        console.log('Depth: ', this.state.pieDepth)

        for (var i = 0; i < this.state.pieDepth; i++) {
            console.log("Iteration: ", 1, " < ", this.state.pieDepth)
            console.log("Data: ", data)
            let highestValue = 0
            console.log("a")
            data.forEach((entry => {
                console.log("b")
                highestValue += entry.value
            }))
            console.log("c")
            const maxValue = highestValue * 0.02
            for(var i = data.length - 1; i >= 0 ; i--) {
                if(data[i].value >= maxValue) {
                    data.splice(i, 1)
                }
            }
            console.log("final data: ", data)
        }
        console.log("Removed Data: ", data)

        let totalValue = 0
        data.forEach((entry => {
            totalValue += entry.value
        }))
        const maxPrice = totalValue * 0.02
        var otherPrice = 0
        for(var i = data.length - 1; i >= 0 ; i--) {
            if(data[i].value < maxPrice) {
                otherPrice += data[i].value
                data.splice(i, 1)
            }
        }

        if (otherPrice) {
            var otherSlice : WordEntry = {text: "Other", value: otherPrice}
            data.push(otherSlice)
        }

        this.setState({data: data})
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
