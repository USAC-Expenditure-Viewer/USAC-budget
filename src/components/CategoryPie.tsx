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
        const data = this.props.dataloader.getCategories(this.props.category)

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
                                 label={(e) => this.renderCustomizedLabel(e, this.props.dataloader.getTotal())} labelLine={false}>
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

    private renderCustomizedLabel(entry: any, totalValue : number) {
        if (entry.value < totalValue * 0.01)
            return null
        return entry.name
    }

    private clickSlice(e : any) {
        this.props.dataloader.addCategoryFilter(this.props.category, e.text)
        this.props.dataloader.setPeekTable(true)
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
