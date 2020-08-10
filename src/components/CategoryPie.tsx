import React, {Component} from "react";
import {Category, DataLoaderProps, WordEntry} from "../models/DataLoader";
import {Cell, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import {KMFormat} from "../util";
import RecordTable from "./RecordTable";

interface CategoryPieProps extends DataLoaderProps {
    category: Category
    hidden?: boolean
    // recordTable: RecordTable
}

interface CategoryPieState {
    otherPie: Boolean
    selectedSlices: WordEntry[]
}

/**
 * Component for a single layer pie Chart.
 */
export default class CategoryPie extends Component<CategoryPieProps, CategoryPieState> {

    constructor(props: CategoryPieProps) {
        super(props)

        this.state={
            otherPie: false,
            selectedSlices: []
        }
    }

    componentDidMount(): void {
        this.props.dataloader.addChangeCallback(() => this.forceUpdate())
    }

    private clickSlice(e : any) : void {
        if (e.text === "Other") {
            e.fill = "Gray"
            this.setState({otherPie: true})
            // this.render()
        } else if (this.state.selectedSlices.includes(e)){
            console.log('removed')
            const data : WordEntry[] = this.props.dataloader.getCategories(this.props.category)
            e.fill = this.getColor(e, data.indexOf(e))
            var removeSlice : WordEntry[] = this.state.selectedSlices
            removeSlice.splice(this.state.selectedSlices.indexOf(e), 1)
            this.setState({
                selectedSlices: removeSlice
            })
        } else {
            e.fill = "Red"
            var addSlice : WordEntry[] = this.state.selectedSlices
            addSlice.push(e)
            this.setState({
                selectedSlices: addSlice
            })
            console.log('Selected slices:', this.state.selectedSlices)
            this.props.dataloader.addCategoryFilter(this.props.category, e.text)
        }
        // this.props.recordTable.peekTable(this.props.recordTable)
        this.render()

    }

    render(): React.ReactNode {
        const data : WordEntry[] = this.props.dataloader.getCategories(this.props.category)
        var mainData : WordEntry[] = []
        var otherData : WordEntry[] = []

        var totalValue : number = 0
        data.forEach((entry, index) => {
            mainData.push(entry)
            totalValue += entry.value
        })

        const valueFrac = totalValue *= 0.02
        var otherValue = 0
        data.forEach((entry, index) => {
            if (entry.value < valueFrac) {
                mainData.splice(mainData.indexOf(entry), 1)
                otherData.push(entry)
                otherValue += entry.value
            }
        })
        var otherWordEntry : WordEntry = {text: "Other", value: otherValue}
        mainData.push(otherWordEntry)

        var displayData : WordEntry[] = this.state.otherPie ? otherData : mainData

        const lastFilter = this.props.dataloader.getLastFilter()
        const selected = lastFilter == null ? undefined :
            (lastFilter.category === this.props.category ? lastFilter.name : undefined)

        return (
            <div style={{height: '80vh'}} hidden={this.props.hidden || false}>
                {(this.props.hidden || false) ? null : (
                    <ResponsiveContainer height="100%" width="100%">
                        <PieChart>
                            <Pie data={displayData} dataKey="value" nameKey="text"
                                 labelLine={true} label={true}
                                 onClick={(e) => {this.clickSlice(e)}}
                                //  onMouseLeave={() => {this.props.recordTable.collapseTable(this.props.recordTable)}}
                                >
                                {
                                    data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={this.getColor(entry, index)}/>
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

    private getColor(entry : any, index : number): string {
        if (entry.text === "Other")
            return "Gray"
        else if (this.props.dataloader.getLastFilter()?.name === entry.text)
            return "Red"
        else switch(index % 6) {
            case 0: return "DeepSkyBlue"
            case 1: return "LightBlue"
            case 2: return "DarkTurquoise"
            case 3: return "Cyan"
            case 4: return "CornflowerBlue"
            case 5: return "LightSkyBlue"
            default: return "DeepSkyBlue"
        }
    }
}
