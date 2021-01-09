import React from 'react';
import '../App.css';
import WordCloud from "./WordCloud";
import RecordTable from "./RecordTable";
import KeywordCrumb from "./KeywordCrumb";
import Paper from "@material-ui/core/Paper";
import DataLoader, { Category, isOfTypeCategory } from "../models/DataLoader";
import CategoryPie from "./CategoryPie";
import { Button, Link } from "@material-ui/core";
import AmountSlider from "./AmountSlider";
import QueryBuilder from "../models/QueryBuilder";
import DateSlider from "./DateSlider";
import ExplanationText from "./ExplanationText";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import EmailIcon from '@material-ui/icons/Email';
import VideoModal from './VideoModal';

export type TabTypes = Category | 'table' | 'keyword' | "amount" | "date";

interface DatasetState {
  value: TabTypes
  modalOpen: boolean
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
      modalOpen: false
    }

    QueryBuilder.getInstance().addGenerator(this.generateQuery.bind(this), 1)
  }

  componentDidMount(): void {
    this.props.loader.addChangeCallback(() => this.forceUpdate())
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

  closeModal() {
    this.setState({ modalOpen: false })
  }

  toggleModal() {
    this.state.modalOpen === true ? this.setState({ modalOpen: false}) : this.setState({modalOpen: true})
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
    const loader = this.props.loader
    return (
      <>
        <div style={{alignContent: 'center', zIndex: 9, position: 'absolute', margin: 'auto', width: '50%'}}>
          {/* <VideoModal open={this.state.modalOpen} close={() => this.closeModal()} /> */}
        </div>
        {/* <div style={{zIndex: 3}}> */}
          <KeywordCrumb dataloader={loader} />
          <RecordTable dataloader={loader} onChange={this.onTabChange.bind(this)} style={{
            zIndex: 2,
            backgroundColor: "lightblue",
          }} />
          <Paper elevation={2} style={{
            position: "absolute",
            zIndex: -1,
            bottom: 0,
            width: 1230
          }}>
            <ExplanationText category={this.state.value} />
            <WordCloud hidden={this.state.value !== 'keyword'} dataloader={loader} />
            <CategoryPie hidden={!isOfTypeCategory(this.state.value)}
              category={isOfTypeCategory(this.state.value) ? this.state.value : "fund"} dataloader={loader} />
            <AmountSlider hidden={this.state.value !== "amount"} dataloader={loader} />
            <DateSlider hidden={this.state.value !== 'date'} dataloader={loader} />
            {/* <Link color="textSecondary" href="https://forms.google.com" style={{ padding: 20 }}>
              <ContactSupportIcon /> Comments
            </Link> */}
            <Link color="textSecondary" href="mailto:vtran@asucla.ucla.edu" style={{ padding: 20 }}>
              <EmailIcon /> Professional Accountant
            </Link>
            <Link color="textSecondary" href="mailto:usacouncil@asucla.ucla.edu" style={{ padding: 20 }}>
              <EmailIcon /> USAC Council
            </Link>
            <Button color="inherit" onClick={this.copyURL} aria-label="share">
              Copy link
            </Button>
            <Button color="inherit" onClick={() => this.toggleModal()} aria-label="share">
              <ContactSupportIcon />Help
            </Button>
          </Paper>
        {/* </div> */}
      </>
    );
  }
}
