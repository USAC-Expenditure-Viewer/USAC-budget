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

export type TabTypes = Category | 'table' | 'keyword' | "amount" | "date";

interface DatasetState {
  value: TabTypes
  width: string
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
      width: '43%'
    }

    QueryBuilder.getInstance().addGenerator(this.generateQuery.bind(this), 1)
  }

  componentDidMount(): void {
    this.props.loader.addChangeCallback(() => this.forceUpdate());
    setTimeout(() => {
      alert("Please adjust your screen's zoom so it fits the entire budget viewer.");
    }, 3000);
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

  fullScreen() {
    this.setState({width: '90%'});
  }

  halfScreen() {
    this.setState({width: '43%'});
  }

  private copyURL() {
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
        <div style={{float: 'left', width : this.state.width, marginLeft: 40, height: 600, marginRight: 40}}>
          <RecordTable dataloader={loader} onChange={this.onTabChange.bind(this)} style={{
            // zIndex: 2,
            backgroundColor: "lightblue",
          }} fullScreen={() => this.fullScreen()} halfScreen={() => this.halfScreen()} />
        </div>
        {this.state.width === '43%' ? 
        <div style={{float: 'right', width : '43%', marginRight: 40}}>
          <h1>{graphicTitle}</h1>
          <ExplanationText category={this.state.value} />
          <WordCloud hidden={this.state.value !== 'keyword'} dataloader={loader} />
          <CategoryPie hidden={!isOfTypeCategory(this.state.value)}
            category={isOfTypeCategory(this.state.value) ? this.state.value : "fund"} dataloader={loader} />
          <AmountSlider hidden={this.state.value !== "amount"} dataloader={loader} />
          <DateSlider hidden={this.state.value !== 'date'} dataloader={loader} />
        </div>
        : null}
        <div style={{marginTop: 750, color: 'black'}}>
          <a href="mailto:vtran@asucla.ucla.edu" style={{ padding: 20, color: 'black' }}>
            <EmailIcon /> Professional Accountant
          </a>
          <a href="mailto:usacouncil@asucla.ucla.edu" style={{ padding: 20, color: 'black' }}>
            <EmailIcon /> USAC Council
          </a>
          <Button style={{color: 'black', textDecoration: 'underline'}} onClick={this.copyURL} aria-label="share">
            Copy link
          </Button>
          <Link to="/help-page/" style={{color: 'black'}}>
            <Button aria-label="share">
              <ContactSupportIcon />Help
            </Button>
          </Link>
        </div>
      </>
    );
  }
}
