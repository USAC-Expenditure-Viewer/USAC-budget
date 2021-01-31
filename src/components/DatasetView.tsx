import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import WordCloud from "./WordCloud";
import RecordTable from "./RecordTable";
import KeywordCrumb from "./KeywordCrumb";
import Paper from "@material-ui/core/Paper";
import DataLoader, { Category, isOfTypeCategory } from "../models/DataLoader";
import CategoryPie from "./CategoryPie";
import { Button, } from "@material-ui/core";
import AmountSlider from "./AmountSlider";
import QueryBuilder from "../models/QueryBuilder";
import DateSlider from "./DateSlider";
import ExplanationText from "./ExplanationText";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import EmailIcon from '@material-ui/icons/Email';
import { createBrowserHistory } from 'history';

export type TabTypes = Category | 'table' | 'keyword' | "amount" | "date";

interface DatasetState {
  value: TabTypes
  graphic: boolean
}

interface DatasetProps {
  loader: DataLoader
}

export function isOfTypeTabs(input: string): input is TabTypes {
  return isOfTypeCategory(input) || ['table', 'keyword', "amount", "date"].includes(input);
}

export default class DatasetView extends React.Component<DatasetProps, DatasetState> {
  private value: TabTypes = 'keyword'

  constructor(props: DatasetProps) {
    super(props);

    this.value = 'keyword'
    // this.parseQuery(QueryBuilder.getInstance().getQuery())

    this.state = {
      value: this.value,
      graphic: true
    }

    QueryBuilder.getInstance().addGenerator(this.generateQuery.bind(this), 1)
  }

  componentDidMount(): void {
    this.props.loader.addChangeCallback(() => this.forceUpdate());
  }

  parseQuery(query: string): TabTypes {
    if (query[0] === '?') query = query.slice(1)
    const res = query.split('&').filter((e) => e.startsWith('tab='))
    if (res.length === 0) return 'table'
    let s = res[0].substr(4)
    if (isOfTypeTabs(s)) {
      return s
    } else return 'table'
  }

  generateQuery(): string {
    return 'tab=' + this.value
  }

  onTabChange(value: string) {
    this.value = isOfTypeTabs(value) ? value : 'table'
    this.setState({ value: this.value })
    QueryBuilder.getInstance().update()
  }

  openTable = () => {
    this.setState({graphic: false});
  }

  copyURL() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = window.location.href;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    alert('Link Copied to Clipboard! (filters saved)');
  }

  render() {
    const loader = this.props.loader;
    var graphicTitle = this.state.value === 'keyword' ? 'description' : this.state.value;
    graphicTitle = graphicTitle.charAt(0).toUpperCase() + graphicTitle.slice(1)
    return (
      <>
        <br /><br />
        <div style={{marginLeft: 30, marginRight: 30}}>
          <KeywordCrumb dataloader={loader} />
        </div>
        <br /><br /><br />
        <div style={{position: 'absolute', left: '15%', width: '70%'}}>
          <RecordTable
            dataloader={loader}
            onChange={this.onTabChange.bind(this)}
            style={{backgroundColor: "lightblue"}}
            minimized={this.state.graphic}
            openTable={this.openTable}
          />
        </div>
        <div style={{position: 'absolute', left: '25%', width: '50%', marginTop: 170}}>
          <h1 hidden={!this.state.graphic} style={{marginBottom: 0}}>{graphicTitle}</h1>
          <ExplanationText hidden={!this.state.graphic} category={this.state.value} />
          <WordCloud hidden={this.state.value !== 'keyword' || !this.state.graphic} dataloader={loader} />
          <CategoryPie hidden={!isOfTypeCategory(this.state.value) || !this.state.graphic}
            category={isOfTypeCategory(this.state.value) ? this.state.value : "fund"} dataloader={loader} />
          <AmountSlider hidden={this.state.value !== "amount" || !this.state.graphic} dataloader={loader} />
          <DateSlider hidden={this.state.value !== 'date' || !this.state.graphic} dataloader={loader} />
        </div>
        <Button
          style={{backgroundColor: "lightgray", marginTop: 870, position: 'absolute', fontWeight: 'bold', width: '8%', left: '46%'}}
          onClick={() => this.setState({graphic: !this.state.graphic})}>
          {this.state.graphic ? <>View Table</> : <>View Graphic</>}
        </Button>
        <div style={{color: 'black', marginTop: 900}}>
          <a href="mailto:vtran@asucla.ucla.edu" style={{ padding: 20, color: 'black' }}>
            <EmailIcon /> Professional Accountant
          </a>
          <a href="mailto:usacouncil@asucla.ucla.edu" style={{ padding: 20, color: 'black' }}>
            <EmailIcon /> USAC Council
          </a>
          <Button style={{color: 'black', textDecoration: 'underline'}} onClick={this.copyURL} aria-label="share">
            Copy link
          </Button>
          <a href='https://www.youtube.com/watch?v=1Bm70HP0zmM' target="_blank">
            <Button aria-label="share">
              <ContactSupportIcon />Video
            </Button>
          </a>
        </div>
      </>
    );
  }
}
