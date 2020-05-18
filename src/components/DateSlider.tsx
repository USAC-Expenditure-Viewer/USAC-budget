import React, {Component} from "react";
import {WordEntry, DataLoaderProps} from "../models/DataLoader";
import {
    Bar,
    BarChart,
    CartesianGrid, Cell, ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis
} from 'recharts';
import {KMFormat} from "../util";
import {Mark, Slider} from "@material-ui/core";

interface SliderProps extends DataLoaderProps{
    hidden?: boolean
}

interface SliderState {
    value: [number, number]
    domain: [string, string]
    data: WordEntry[]
}

const month_name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default class DateSlider extends Component<SliderProps, SliderState>{

    constructor(props: SliderProps) {
        super(props);
        this.state = {
            value: [0, 1],
            domain: ['0000-01', '9999-12'],
            data: []
        }
    }


    componentDidMount(): void {
        this.props.dataloader.addChangeCallback(() =>
            this.updateState()
        )
        this.updateState()
    }

    updateState(){
        const {data, domain} = this.props.dataloader.getMonthBins()
        console.log(data)
        const names = data.map(e => e.text)
        this.setState({
            data: data,
            value: [names.indexOf(domain[0]) + 0.5, names.indexOf(domain[1]) + 0.5],
        })
    }

    render(): React.ReactNode {
        const data = this.state.data
        return (
            <div style={{height: '80vh', width: "80%", margin: "auto"}} hidden={this.props.hidden || false}>
                {(this.props.hidden || false) ? null : (
                <ResponsiveContainer height="90%" width="100%">
                    <BarChart data={data} barCategoryGap={0} margin={{bottom: 0, left: 0, right: 0}}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="text" hide orientation="top"/>
                        <YAxis tickFormatter={(v) => '$'+KMFormat(v)} width={DateSlider.getYAxisWidth()}/>
                        <ReferenceLine y={0} label="" stroke="black" />
                        <Bar dataKey={"value"} fill={this.getColor()}>
                            {data.map((value, index) => (
                                <Cell key={`cell-${index}`} fill={this.getColor()}
                                      opacity={this.getOpacity(index)}/>
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                )}
                <div style={{paddingLeft: DateSlider.getYAxisWidth()}}>
                <Slider value={this.state.value}
                        min={0} max={this.state.data.length}
                        onChange={this.onRangeChange.bind(this)}
                        onChangeCommitted={this.onRangeChangeCommitted.bind(this)}
                        valueLabelDisplay="off"
                        marks={this.getMarks(this.state.data)}
                        step={null}
                />
                </div>
            </div>
        )
    }

    static getViewportWidth(){
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    }

    static getYAxisWidth(){
        return this.getViewportWidth() < 360 ? 0 : 60
    }

    onRangeChange(event: any, newValues: number | number[]){
        this.setState({value: newValues as [number, number]})
    }

    onRangeChangeCommitted(event: any, newValues: number | number[]){
        const nVal = (newValues as [number, number]).map(e => Math.round(e - 0.5))
        const data = this.state.data
        this.props.dataloader.addMonthFilter(data[nVal[0]].text, data[nVal[1]].text)
    }

    getColor(): string {
        return "#ffee58"
    }

    getOpacity(index: number): number {
        index += 0.5
        return this.state.value[0] <= index && index <= this.state.value[1] ? 1 : 0.3
    }

    getMarks(data: WordEntry[]): Mark[]{
        let marks = data.map((e, i) => ({value: i + 0.5, label: e.text}))
        let years : Set<String> = new Set<String>();
        marks.forEach((e, i) => {
            const d = e.label.split('-')
            if (years.has(d[0])) marks[i].label = month_name[Number.parseInt(d[1]) - 1]
            else {
                years.add(d[0])
                marks[i].label = month_name[Number.parseInt(d[1]) - 1] + ` ${d[0]}`;
            }
        })
        return marks
    }
}
