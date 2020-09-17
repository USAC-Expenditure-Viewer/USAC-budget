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
            this.props.dataloader.setOtherDepth(0)
            this.setState({
                pieDepth: 0,
                category: this.props.category
            })
        } else if (this.state.pieDepth != this.props.dataloader.getOtherDepth())
            this.setState({pieDepth: this.props.dataloader.getOtherDepth()})

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
            const pieDepth = this.state.pieDepth + 1
            this.setState({pieDepth: pieDepth})
            this.props.dataloader.setOtherDepth(pieDepth)
            this.props.dataloader.setOtherCategory(this.state.category)
            this.forceUpdate()
        } else {
            this.props.dataloader.addCategoryFilter(this.props.category, e.text)
            this.props.dataloader.setPeekTable(true)
        }
    }

    private loadSlices(): readonly WordEntry[] {
        var data = this.props.dataloader.getCategories(this.state.category)

        // Removes most expensive items
        for (var i = 0; i < this.state.pieDepth; i++) {
            let highestValue = 0
            data.forEach((entry => {
                highestValue += entry.value
            }))
            const maxValue = highestValue * 0.01
            for(var a = data.length - 1; a >= 0 ; a--) {
                if(data[a].value >= maxValue) {
                    data.splice(a, 1)
                }
            }
        }
   
        // Removes most cheapest items
        let totalValue = 0
        var highestEntry = 0
        data.forEach((entry => {
            totalValue += entry.value
            if (entry.value > highestEntry)
                highestEntry = entry.value
        }))
        const maxPrice = totalValue * 0.01
        var otherPrice = 0
        if (highestEntry * 0.75 > maxPrice) {
            for(var b = data.length - 1; b >= 0; b--) {
                if(data[b].value < maxPrice) {
                    otherPrice += data[b].value
                    data.splice(b, 1)
                }
            }
        } else if (this.state.pieDepth > 0) {
            // Stuck on other
            this.props.dataloader.setOtherDepth(this.state.pieDepth - 1)
            this.setState({pieDepth: this.state.pieDepth - 1})
        }

        // Inserts "other" slice
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
