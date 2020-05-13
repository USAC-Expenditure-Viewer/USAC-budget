/**
 * Created by TylerLiu on 2020/05/05.
 */
import React, { Component } from 'react';
import {scaleLinear, scaleBand} from 'd3-scale';
import {max} from 'd3-array';
import {zoom} from 'd3-zoom';
import { select, event } from "d3-selection";
import {axisTop, axisLeft} from 'd3-axis';
import {format} from 'd3-format';
import {makeStyles} from "@material-ui/core/styles";
import {KMFormat} from "../src/util";

const styles = {
    tooltip: {
        position: "absolute",
        textAlign: "center",
        padding: 5,
        font: "12px sans-serif",
        background: "lightsteelblue",
        border: 0,
        borderRadius: 8,
        pointerEvents: "none",
    }
}


export default class WordChart extends Component {

    classes
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

        this.margin = {top: 20, right: 0, bottom: 30, left: 80}
    }

    componentDidMount() {
        this.props.dataloader.addWordsCallback(this.setWords.bind(this));
        this.height = this.divElement.clientHeight
        this.width = this.divElement.clientWidth
        this.setState({ height: this.height, width: this.width });
    }

    render() {
        this.renderChart()
        return (
            <div style={this.props.style} ref={ (divElement) => { this.divElement = divElement } }>
                <div style={styles.tooltip} ref={(tooltip)=>{this.tooltip = tooltip}}/>
                    <svg ref={node => this.svgElement = node}
                         width={this.state.width} height={this.state.height}
                         viewBox={[0, 0, this.width, this.height]}>
                    </svg>
            </div>
        );
    }

    setWords(words) {
        this.setState({
            data: words.filter(e => e.value > 0)
        })
    }

    renderChart(){
        this.xScale = scaleLinear()
            .domain([0, max(this.state.data, d => d.value)]).nice()
            .range([this.margin.left, this.width - this.margin.right])

        this.yScale = scaleBand()
            .domain(this.state.data.map(d => d.text))
            .range([this.height - this.margin.bottom, this.margin.top])
            .padding(0.1)

        select(this.svgElement).selectAll("*").remove()
        select(this.svgElement).call(this.setChartZoom.bind(this))

        select(this.tooltip).style("opacity", 0)

        select(this.svgElement).append('g')
            .attr("class", "bars")
            .attr("fill", "steelblue")
            .selectAll("rect")
            .data(this.state.data)
            .join("rect")
            .attr("x", this.xScale(0))
            .attr("y", d => this.yScale(d.text))
            .attr("height", this.yScale.bandwidth())
            .attr("width", d => this.xScale(d.value) - this.xScale(0))
            .call(this.setTooltip.bind(this))

        select(this.svgElement).append("g")
            .attr("class", "x-axis")
            .call(this.setXAxis.bind(this));

        select(this.svgElement).append("g")
            .attr("class", "y-axis")
            .call(this.setYAxis.bind(this));
    }

    setTooltip(rects) {
        rects.on("mouseover", d => {
            select(this.tooltip).transition()
                .duration(200)
                .style("opacity", .9);
            select(this.tooltip).html(d.text + '<br>' + KMFormat(d.value))
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        }).on("mouseout", d=>{
            select(this.tooltip).transition()
                .duration(500)
                .style("opacity", 0);
        }).on('click', ((d) => {
                this.props.keywordlist.addWord(d.text);
        }))
    }

    setChartZoom(svg) {
        const margin = this.margin
        const yScale = this.yScale
        const setYAxis = this.setYAxis.bind(this)
        const extent = [[margin.left, margin.top], [this.width - margin.right, this.height - margin.top]];
        const height = this.height

        svg.call(zoom()
            .scaleExtent([1, this.state.data.length / 10])
            .translateExtent(extent)
            .extent(extent)
            .on("zoom", zoomed));

        function zoomed() {
            yScale.range([height - margin.bottom, margin.top].map(d => event.transform.applyY(d)));
            svg.selectAll(".bars rect").attr("y", d => yScale(d.text)).attr("height", yScale.bandwidth());
            svg.selectAll(".y-axis").call(setYAxis);
        }
    }

    setXAxis(g){
        g.attr("transform", `translate(0,${this.margin.top})`)
            .call(axisTop(this.xScale).tickFormat(format("~s")).tickSizeOuter(0))
    }

    setYAxis(g){
        g.attr("transform", `translate(${this.margin.left},0)`)
            .call(axisLeft(this.yScale)
                .tickValues(this.yScale.domain().filter((d, i) => (i % Math.max(Math.round(18 / this.yScale.bandwidth()), 1) === 0))))
            .call(g => g.select(".domain").remove())
    }
}