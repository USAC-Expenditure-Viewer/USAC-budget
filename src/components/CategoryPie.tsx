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
}


/**
 * Component for a single layer pie Chart.
 */
export default class CategoryPie extends Component<CategoryPieProps, CategoryPieState> {

    constructor(props: CategoryPieProps) {
        super(props)
        this.state = {
            pieDepth: 0,
            category: this.props.category,
        }
    }

    componentDidMount(): void {
        this.props.dataloader.addChangeCallback(() => this.forceUpdate())
    }

    render(): React.ReactNode {
        if (this.state.category != this.props.category) {
            this.setState({
                pieDepth: 0,
                category: this.props.category
            })
        }
        const data = this.loadSlices()
        const lastFilter = this.props.dataloader.getLastFilter()
        const selected = lastFilter == null ? undefined :
            (lastFilter.category === this.props.category ? lastFilter.name : undefined)

        return (
            <div style={{height: '80vh'}} hidden={this.props.hidden || false}>
                {(this.props.hidden || false) ? null : (
                    <ResponsiveContainer height="100%" width="100%">
                        <PieChart>
                            <Pie data={data} dataKey="value" nameKey="text"
                                 onClick={(e) => this.clickSlice(e)}
                                 label={this.renderCustomizedLabel} labelLine={true}>
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

    private renderCustomizedLabel(entry: any) {
        return entry.name
    }

    private clickSlice(e : any) {
        if (e.text === "Other") {
            this.setState({pieDepth: this.state.pieDepth+1})
            this.forceUpdate()
        }
        else
            this.props.dataloader.addCategoryFilter(this.props.category, e.text)
    }

    private loadSlices(): readonly WordEntry[] {
        var data = this.props.dataloader.getCategories(this.state.category)

        for (var i = 0; i < this.state.pieDepth; i++) {
            let highestValue = 0
            data.forEach((entry => {
                highestValue += entry.value
            }))
            const maxValue = highestValue * 0.015
            for(var a = data.length - 1; a >= 0 ; a--) {
                if(data[a].value >= maxValue) {
                    data.splice(a, 1)
                }
            }
        }
   
        let totalValue = 0
        var highestEntry = 0
        data.forEach((entry => {
            totalValue += entry.value
            if (entry.value > highestEntry)
                highestEntry = entry.value
        }))
        const maxPrice = totalValue * 0.015
        var otherPrice = 0

        if (highestEntry > maxPrice) {
            for(var b = data.length - 1; b >= 0; b--) {
                if(data[b].value < maxPrice) {
                    otherPrice += data[b].value
                    data.splice(b, 1)
                }
            }
        }

        if (otherPrice) {
            var otherSlice : WordEntry = {text: "Other", value: otherPrice}
            data.push(otherSlice)
        }

        return data
    }

    getColor(selected: boolean): string {
        if (selected)
            return "Gray"
        switch (this.props.category) {
            case "fund":
                return "Red"
            case "division":
                return "Orange"
            case "department":
                return "Green"
            case "gl":
                return "Blue"
            case "event":
                return "Purple"
        }
    }
}
