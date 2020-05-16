import React, {Component} from "react";
import {AmountBin, DataLoaderProps} from "../models/DataLoader";
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
    data: AmountBin[]
}

export default class AmountSlider extends Component<SliderProps, SliderState>{

    constructor(props: SliderProps) {
        super(props);
        this.state = {
            value: [0, 100],
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
        const {data, domain} = this.props.dataloader.getAmountBins(20)
        this.setState({
            data: data,
            value: domain,
        })
    }

    render(): React.ReactNode {
        const data = this.state.data
        const domain: [number, number] = data.length === 0 ? [0, 1] : [data[0].low, data[data.length - 1].high]
        return (
            <div style={{height: '80vh', width: "80%", margin: "auto"}} hidden={this.props.hidden || false}>
                {(this.props.hidden || false) ? null : (
                <ResponsiveContainer height="90%" width="100%">
                    <BarChart data={data} barCategoryGap={0}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" domain={domain} tick={false} axisLine={false} />
                        <YAxis domain={[0, 'datamax']} tickFormatter={(v) => '$'+KMFormat(v)}/>
                        <ReferenceLine y={0} label="" stroke="black" />
                        <Bar dataKey={"value"} fill={this.getColor()}>
                            {data.map((value, index) => (
                                <Cell key={`cell-${index}`} fill={this.getColor()}
                                      opacity={this.getOpacity(value.low, value.high)}/>
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
                )}
                <Slider value={this.state.value}
                        min={domain[0]} max={domain[1]}
                        onChange={this.onRangeChange.bind(this)}
                        onChangeCommitted={this.onRangeChangeCommitted.bind(this)}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(v) => '$'+KMFormat(v)}
                        marks={this.getMarks(domain)}
                />
            </div>
        )
    }

    onRangeChange(event: any, newValues: number | number[]){
        this.setState({value: newValues as [number, number]})
    }

    onRangeChangeCommitted(event: any, newValues: number | number[]){
        const nVal = newValues as [number, number]
        this.props.dataloader.addAmountFilter(nVal[0], nVal[1])
    }

    getColor(): string {
        return "#29b6f6"
    }

    getOpacity(low: number, high: number): number {
        const proportion = Math.max(0, Math.min(this.state.value[1], high) - Math.max(this.state.value[0], low)) / (high - low)
        return 0.3 + 0.7 * proportion
    }

    getMarkPoint(x: number): Mark {
        return {value: x, label: '$' + KMFormat(x)}
    }

    getMarks(domain: [number, number]): Mark[]{
        let marks: Mark[] = domain.map(e => this.getMarkPoint(e))
        if (domain[0] < 0 && domain[1] > 0) marks.push(this.getMarkPoint(0))

        const step_size = (domain[1] - domain[0]) / 10
        for (let i = 1; i < 10; i ++) {
            const val = Number.parseFloat((domain[0] + i * step_size).toPrecision(2))
            if (Math.abs(val) < 0.5 * step_size) continue
            marks.push(this.getMarkPoint(val))
        }

        return marks
    }
}