import React, {Component} from "react";
import {AmountBin, DataLoaderProps} from "../models/DataLoader";
import {Bar, BarChart, CartesianGrid, Cell, Label, ReferenceLine, ResponsiveContainer, XAxis, YAxis} from 'recharts';
import {KMFormat} from "../util";
import {Mark, Slider} from "@material-ui/core";

interface SliderProps extends DataLoaderProps {
    hidden?: boolean
}

interface SliderState {
    value: [number, number]
    data: AmountBin[]
}

export default class AmountSlider extends Component<SliderProps, SliderState> {

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

    updateState() {
        const {data, domain} = this.props.dataloader.getAmountBins(40)
        this.setState({
            data: data,
            value: domain,
        })
    }

    render(): React.ReactNode {
        const data = this.state.data
        const domain: [number, number] = data.length === 0 ? [0, 1] : [data[0].low, data[data.length - 1].high]
        return (
            <div style={{
                paddingLeft: '5%', paddingRight: `calc(5% + ${AmountSlider.getYAxisWidth()}px)`,
                height: '80vh', margin: "auto"
            }} hidden={this.props.hidden || false}>
                {(this.props.hidden || false) ? null : (
                    <ResponsiveContainer height="90%" width="100%">
                        <BarChart data={data} barCategoryGap={0} margin={{bottom: 0, left: 0, right: 0}}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name" domain={domain} hide orientation="top"/>
                            <YAxis domain={[0, 'dataMax']} tickFormatter={(v) => '$' + KMFormat(v)}
                                   width={AmountSlider.getYAxisWidth()}>
                                <Label angle={270} position="insideLeft" style={{textAnchor: 'middle'}}>
                                    Expense Sum in Transaction Amount Bin($)
                                </Label>
                            </YAxis>
                            <ReferenceLine y={0} label="" stroke="black"/>
                            <Bar dataKey={"value"} fill={this.getColor()}>
                                {data.map((value, index) => (
                                    <Cell key={`cell-${index}`} fill={this.getColor()}
                                          opacity={this.getOpacity(value.low, value.high)}/>
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
                <div style={{paddingLeft: AmountSlider.getYAxisWidth()}}>
                    <Slider value={this.state.value}
                            min={domain[0]} max={domain[1]}
                            onChange={this.onRangeChange.bind(this)}
                            onChangeCommitted={this.onRangeChangeCommitted.bind(this)}
                            valueLabelDisplay="auto"
                            valueLabelFormat={(v) => '$' + KMFormat(v)}
                            marks={this.getMarks(domain)}
                            aria-labelledby="Amount-slider"
                    />
                </div>
            </div>
        )
    }

    static getViewportWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    }

    static getYAxisWidth() {
        return AmountSlider.getViewportWidth() < 480 ? 0 : 72
    }

    onRangeChange(event: any, newValues: number | number[]) {
        this.setState({value: newValues as [number, number]})
    }

    onRangeChangeCommitted(event: any, newValues: number | number[]) {
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

    getMarks(domain: [number, number]): Mark[] {
        const total_width = AmountSlider.getViewportWidth() * 0.8 - AmountSlider.getYAxisWidth()
        const min_diff = 60 / total_width * (domain[1] - domain[0])
        let marks: Mark[] = domain.map(e => this.getMarkPoint(e))
        if (domain[0] < 0 && domain[1] > 0) {
            marks = marks.filter(e => Math.abs(e.value) >= min_diff)
            marks.push(this.getMarkPoint(0))
        }

        const step_size = Math.max((domain[1] - domain[0]) / 10, min_diff)
        for (let i = 1; domain[0] + i * step_size <= domain[1] - min_diff; i++) {
            const val = Number.parseFloat((domain[0] + i * step_size).toPrecision(2))
            if (Math.abs(val) < 0.9 * step_size) continue
            marks.push(this.getMarkPoint(val))
        }

        return marks
    }
}
