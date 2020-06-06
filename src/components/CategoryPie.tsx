import React, {Component} from "react";
import {Category, DataLoaderProps} from "../models/DataLoader";
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {KMFormat} from "../util";

interface CategoryPieProps extends DataLoaderProps {
    category: Category
    hidden?: boolean
}

export default class CategoryPie extends Component<CategoryPieProps> {

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
                                 label={({percent, name}) => ((percent || 0) > 0.005 ? name : "")}
                                 labelLine={false}
                                 onClick={(e) => this.props.dataloader.addCategoryFilter(this.props.category, e.text)}>
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
                return "#ffee58"
        }
    }
}
