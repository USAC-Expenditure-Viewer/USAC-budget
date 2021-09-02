import * as React from 'react';
import {
  Container,
  Row, Col
} from 'reactstrap';
import '../App.css';
import WordCloud from "./WordCloud";
import RecordTable from "./RecordTable";
import KeywordCrumb from "./KeywordCrumb";
import DataLoader, { Category, isOfTypeCategory } from "../models/DataLoader";
import CategoryPie from "./CategoryPie";
import { Button, } from "@material-ui/core";
import AmountSlider from "./AmountSlider";
import QueryBuilder from "../models/QueryBuilder";
import DateSlider from "./DateSlider";
import ExplanationText from "./ExplanationText";
import Footer from "./Footer";

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

/**
 * The main page that organizes the keyword crumb, the data table,
 * the graphic tabs, and the footer.
 */
export default class DatasetView extends React.Component<DatasetProps, DatasetState> {
  private value: TabTypes = 'keyword'

  constructor(props: DatasetProps) {
    super(props);
    this.value = 'keyword'
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
                style={{
                  backgroundColor: "lightgray",
                  fontWeight: 'bold',
                  marginLeft: '45%',
                  marginRight: '45%',
                  width: '10%',
                }}
                onClick={() => this.setState({ graphic: !this.state.graphic })}
              >
                {this.state.graphic ? <>View Table</> : <>View Graphic</>}
              </Button>
            </Col>
          </Row>
        </Container>
        <br />
        <Container>
          <Row>
            <Col>
              <Footer />
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}
