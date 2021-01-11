import React, { Component } from "react";
import { Category, DataLoaderProps, WordEntry } from "../models/DataLoader";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { KMFormat } from "../util";
import { Word } from "react-wordcloud";
import { Filter } from "@devexpress/dx-react-grid";

interface CategoryPieProps extends DataLoaderProps {
  category: Category
  hidden?: boolean
}

interface CategoryPieState {
  pieDepth: number
  category: Category
  selectedSlices: Map<string, string>
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
      selectedSlices: new Map(),
    }
  }

  componentDidMount(): void {
    this.props.dataloader.addChangeCallback(() => this.forceUpdate())
  }

  render(): React.ReactNode {
    var filters = this.props.dataloader.getFilters()
    this.state.selectedSlices.forEach((value, key) => {
      for (var i = 0; i < filters.length; i++) {
        if (filters[i].category == key) {
          return
        }
      }
      this.state.selectedSlices.delete(key)
    })

    const data = this.props.dataloader.getCategories(this.props.category)
    const lastFilter = this.props.dataloader.getLastFilter()
    const selected = lastFilter == null ? undefined :
      (lastFilter.category === this.props.category ? lastFilter.name : undefined)

    return (
      <div style={{ height: '60vh' }} hidden={this.props.hidden || false}>
        {(this.props.hidden || false) ? null : (
          <ResponsiveContainer height="100%" width="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="text"
                onClick={(e) => this.clickSlice(e)}
                label={(e) => this.renderCustomizedLabel(e, this.props.dataloader.getTotal())} labelLine={false}>
                {
                  data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={this.getColor(entry)} />
                  ))
                }
              </Pie>
              <Tooltip formatter={(value) => "$" + KMFormat(value as number)}
                contentStyle={{ padding: '0 5px', margin: 0, borderRadius: 5 }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    )
  }

  private renderCustomizedLabel(entry: any, totalValue: number) {
    if (entry.value < totalValue * 0.01)
      return null
    return (
      <text x={entry.x} y={entry.y} fill="Black" textAnchor={entry.x > entry.cx ? 'start' : 'end'} dominantBaseline="central">
        {entry.name}
      </text>
    )
  }

  private clickSlice(e: any) {
    this.state.selectedSlices.set(this.props.category, e.text)
    this.props.dataloader.addCategoryFilter(this.props.category, e.text)
    this.props.dataloader.setPeekTable(true)
  }

  getColor(entry: any): string {
    if (this.state.selectedSlices.has(this.props.category)) {
      if (this.state.selectedSlices.get(this.props.category) == entry.text) {
        switch (this.props.category) {
          case "fund":
            return "#620000" // Red
          case "division":
            return "#8E4200" // Orange
          case "department":
            return "#0C5700" // Green
          case "event":
            return "#001457" // Blue
          case "gl":
            return "#48005A" // Purple
          default:
            return "#2F2F2F" // Gray
        }
      } else {
        switch (this.props.category) {
          case "fund":
            return "#FFC3C3"
          case "division":
            return "#FFD9C3"
          case "department":
            return "#C3FFCD"
          case "gl":
            return "#EBC3FF"
          case "event":
            return "#C3D3FF"
        }
      }
    } else {
      switch (this.props.category) {
        case "fund":
          return "Red"
        case "division":
          return "Orange"
        case "department":
          return "Green"
        case "event":
          return "Blue"
        case "gl":
          return "Purple"
        default:
          return "Gray"
      }
    }
  }
}