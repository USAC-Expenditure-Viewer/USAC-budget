import * as React from 'react';
import {
  Container,
  Row, Col
} from 'reactstrap';
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
import {Link} from "@material-ui/core";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import EmailIcon from '@material-ui/icons/Email';
import FeedbackIcon from '@material-ui/icons/Feedback';
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
    this.setState({ graphic: false });
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
    return (
      <>
        <br /><br />
        <div style={{ marginLeft: 30, marginRight: 30 }}>
          <KeywordCrumb dataloader={loader} />
        </div>
        <br /><br />
        <Container style={{ width: '80%', marginLeft: '10%', marginRight: '10%' }}>
          <Row>
            <Col>
              <RecordTable
                dataloader={loader}
                onChange={this.onTabChange.bind(this)}
                style={{ backgroundColor: "lightblue" }}
                minimized={this.state.graphic}
                openTable={this.openTable}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <ExplanationText hidden={!this.state.graphic} category={this.state.value} />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <br />
              <WordCloud hidden={this.state.value !== 'keyword' || !this.state.graphic} dataloader={loader} />
              <CategoryPie hidden={!isOfTypeCategory(this.state.value) || !this.state.graphic}
                category={isOfTypeCategory(this.state.value) ? this.state.value : "fund"} dataloader={loader} />
              <AmountSlider hidden={this.state.value !== "amount" || !this.state.graphic} dataloader={loader} />
              <DateSlider hidden={this.state.value !== 'date' || !this.state.graphic} dataloader={loader} />
            </Col>
          </Row>
          <br />
          <Row>
            <Col>
              <Button
                style={{ backgroundColor: "lightgray", fontWeight: 'bold', marginLeft: '45%', marginRight: '45%', width: '10%' }}
                onClick={() => this.setState({ graphic: !this.state.graphic })}>
                {this.state.graphic ? <>View Table</> : <>View Graphic</>}
              </Button>
            </Col>
          </Row>
        </Container>
        <br />
        <Container>
          <Row>
            <Col>
              <div style={{ color: 'black', float: 'left' }}>
                <a
                  href="https://forms.gle/68zdvLpYxs8av16H8"
                  rel="noopener noreferrer"
                  target="_blank"
                  style={{ padding: 20, color: 'black' }}
                  aria-label="feedback"
                >
                  <FeedbackIcon/> Feedback
                </a>
                <a href="mailto:vtran@asucla.ucla.edu" style={{ padding: 20, color: 'black' }} aria-label="email accountant">
                  <EmailIcon /> Professional Accountant
                </a>
                <a href="mailto:usacouncil@asucla.ucla.edu" style={{ padding: 20, color: 'black' }} aria-label="email usac">
                  <EmailIcon /> USAC Council
                </a>
                <Button style={{ color: 'black', textDecoration: 'underline' }} onClick={this.copyURL} aria-label="share">
                  Copy link
                </Button>
                <a href='https://www.youtube.com/watch?v=1Bm70HP0zmM' rel="noopener noreferrer" target="_blank" aria-label="tutorial video">
                  <Button aria-label="share">
                    <ContactSupportIcon />Video
                  </Button>
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
