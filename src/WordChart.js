/**
 * Created by TylerLiu on 2020/05/05.
 */
import React, { Component } from 'react';
import {scaleLinear, scaleBand} from 'd3-scale';
import {max} from 'd3-array';
import {zoom} from 'd3-zoom';
import { select, event } from "d3-selection";
import {axisBottom, axisLeft} from 'd3-axis';
import {KMFormat} from "./util";

export default class WordChart extends Component {

    divElement
    svgElement
    margin
    xScale
    yScale
    height
    width

    constructor(props) {
        super(props)

        this.state = {
            data: []
        }

        this.margin = {top: 20, right: 0, bottom: 30, left: 40}
    }

    componentDidMount() {
        this.props.dataloader.addWordsCallback(this.setWords.bind(this));
        this.height = this.divElement.clientHeight
        this.width = this.divElement.clientWidth
        this.setState({ height: this.height, width: this.width });
        this.renderChart()
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.height = this.divElement.clientHeight
        this.width = this.divElement.clientWidth
        this.renderChart()
    }

    render() {
        return (
            <div style={this.props.style} ref={ (divElement) => { this.divElement = divElement } }>
                <svg ref={node => this.svgElement = node}
                     width={this.state.width} height={this.state.height}
                     viewBox={[0, 0, this.width, this.height]}>
                </svg>
            </div>
        )
    }

    setWords(words) {
        this.setState({
            data: words.reverse().filter(e => e.value > 0)
        })
    }

    renderChart(){
        this.xScale = scaleBand()
            .domain(this.state.data.map(d => d.text))
            .range([this.margin.left, this.width - this.margin.right])
            .padding(0.1)

        this.yScale = scaleLinear()
            .domain([0, max(this.state.data, d => d.value)]).nice()
            .range([this.height - this.margin.bottom, this.margin.top])

        select(this.svgElement).selectAll("*").remove()
        select(this.svgElement)
            .call(this.setChartZoom.bind(this))

        select(this.svgElement).append('g')
            .attr("class", "bars")
            .attr("fill", "steelblue")
            .selectAll("rect")
            .data(this.state.data)
            .join("rect")
            .attr("x", d => this.xScale(d.text))
            .attr("y", d => this.yScale(d.value))
            .attr("height", d => this.yScale(0) - this.yScale(d.value))
            .attr("width", this.xScale.bandwidth());

        select(this.svgElement).append("g")
            .attr("class", "x-axis")
            .call(this.setXAxis.bind(this));

        select(this.svgElement).append("g")
            .attr("class", "y-axis")
            .call(this.setYAxis.bind(this));
    }

    setChartZoom(svg) {
        const margin = this.margin
        const xScale = this.xScale
        const setXAxis = this.setXAxis.bind(this)
        const extent = [[margin.left, margin.top], [this.width - margin.right, this.height - margin.top]];
        const width = this.width

        svg.call(zoom()
            .scaleExtent([1, 8])
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", zoomed));

        function zoomed() {
            xScale.range([margin.left, width - margin.right].map(d => event.transform.applyX(d)));
            svg.selectAll(".bars rect").attr("x", d => xScale(d.name)).attr("width", xScale.bandwidth());
            svg.selectAll(".x-axis").call(setXAxis);
        }
    }

    setXAxis(g){
        g.attr("transform", `translate(0,${this.height - this.margin.bottom})`)
            .call(axisBottom(this.xScale).tickSizeOuter(0))
    }

    setYAxis(g){
        g.attr("transform", `translate(${this.margin.left},0)`)
            .call(axisLeft(this.yScale))
            .call(g => g.select(".domain").remove())
    }
}