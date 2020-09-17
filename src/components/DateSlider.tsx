import React, {Component} from "react";
import {DataLoaderProps, WordEntry} from "../models/DataLoader";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Label,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import {KMFormat} from "../util";
import {Mark, Slider} from "@material-ui/core";

interface SliderProps extends DataLoaderProps {
    hidden?: boolean
}

interface SliderState {
    value: [number, number]
    domain: [string, string]
    data: WordEntry[]
}

const month_name = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default class DateSlider extends Component<SliderProps, SliderState> {

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

    updateState() {
        const {data, domain} = this.props.dataloader.getMonthBins()
        const names = data.map(e => e.text)
        this.setState({
            data: data,
            value: [names.indexOf(domain[0]) + 0.5, names.indexOf(domain[1]) + 0.5],
        })
    }

    render(): React.ReactNode {
        const data = this.state.data
        return (
            <div style={{
                paddingLeft: '5%', paddingRight: `calc(5% + ${DateSlider.getYAxisWidth()}px)`,
                height: '80vh', margin: "auto"
            }} hidden={this.props.hidden || false}>
                {(this.props.hidden || false) ? null : (
                    <ResponsiveContainer height="90%" width="100%">
                        <AreaChart data={data} barCategoryGap={0} margin={{bottom: 0, left: 0, right: 0}}>
                            <defs>
                                <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={this.getColor()} stopOpacity={0.9}/>
                                    <stop offset="95%" stopColor={this.getColor()} stopOpacity={0.3}/>
                                </linearGradient>
                                <linearGradient id="fillGrad2" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset={this.getLeftPoint() - 0.01} stopColor={this.getColor()}
                                          stopOpacity={0.2}/>
                                    <stop offset={this.getLeftPoint() + 0.01} stopColor={this.getColor()}
                                          stopOpacity={0.6}/>
                                    <stop offset={this.getRightPoint() - 0.01} stopColor={this.getColor()}
                                          stopOpacity={0.6}/>
                                    <stop offset={this.getRightPoint() + 0.01} stopColor={this.getColor()}
                                          stopOpacity={0.2}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="text" hide orientation="top" scale="band"/>
                            <YAxis tickFormatter={(v) => '$' + KMFormat(v)} width={DateSlider.getYAxisWidth()}>
                                <Label angle={270} position="insideLeft" style={{textAnchor: 'middle'}}>
                                    Monthly Expense($)
                                </Label>
                            </YAxis>
                            <Tooltip formatter={(value) => "$" + KMFormat(value as number)}
                                     contentStyle={{display: 'none'}}/>
                            <ReferenceLine y={0} label="" stroke="black"/>
                            <Area type="monotone" dataKey="value" stroke={this.getColor()} fillOpacity={1}
                                  fill="url(#fillGrad2)"/>
                        </AreaChart>
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
                            aria-labelledby="Date-slider"
                    />
                </div>
            </div>
        )
    }

    static getViewportWidth() {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
    }

    static getYAxisWidth() {
        return this.getViewportWidth() < 480 ? 0 : 72
    }

    onRangeChange(event: any, newValues: number | number[]) {
        this.setState({value: newValues as [number, number]})
    }

    onRangeChangeCommitted(event: any, newValues: number | number[]) {
        const nVal = (newValues as [number, number]).map(e => Math.round(e - 0.5))
        const data = this.state.data
        this.props.dataloader.addMonthFilter(data[nVal[0]].text, data[nVal[1]].text)
    }

    getColor(): string {
        return "Gray"
    }

    getOpacity(index: number): number {
        index += 0.5
        return this.state.value[0] <= index && index <= this.state.value[1] ? 1 : 0.3
    }

    getLeftPoint(): number {
        return (this.state.value[0] - 1) / (this.state.data.length - 1)
    }

    getRightPoint(): number {
        return (this.state.value[1]) / (this.state.data.length - 1)
    }

    getMarks(data: WordEntry[]): Mark[] {
        let marks = data.map((e, i) => ({value: i + 0.5, label: e.text}))
        let years: Set<String> = new Set<String>();
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
