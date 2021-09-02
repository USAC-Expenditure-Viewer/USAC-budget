import React from "react";
import InfoIcon from '@material-ui/icons/Info';
import { Typography } from "@material-ui/core";
import { Category } from "../models/DataLoader";

export interface ExpProps {
  hidden?: boolean
  category: Category | 'date' | 'amount' | 'keyword' | 'table' | 'footer';
}

export interface ExpState {
  longDescription: boolean
}

export default class ExplanationText extends React.Component<ExpProps, ExpState> {

  constructor(props: ExpProps) {
    super(props);
    this.state = {
      longDescription: false
    }
  }

  render = () => {
    if (this.props.hidden) {
      return null
    } else {
      switch (this.props.category) {
      case 'date':
        return (
          <>
            <h1 style={{marginBottom: 0}}>Date</h1>
            <span>
              <Typography color="textSecondary" style={{fontSize: 16, float: 'left'}}>
                When money leaves the Association.
              </Typography>
              <InfoIcon
                style={{float: 'left'}}
                onMouseEnter={() => this.setState({longDescription: true})}
                onMouseLeave={() => this.setState({longDescription: false})}
              />
            </span>
            {this.state.longDescription ?
              <Typography color="textSecondary" style={{fontSize: 16}}>
                Not when it was budgeted or spent. For example, a spender (a.k.a *Department*)
                may choose to be reimbursed afterward, or receive a cash-advance beforehand.
              </Typography>
            : null}
          </>
        )
      case 'fund':
        return (
          <>
            <h1 style={{marginBottom: 0}}>Fund</h1>
            <Typography color="textSecondary" style={{fontSize: 16, float: 'left'}}>
              Where money comes from.
            </Typography>
            <InfoIcon
              style={{float: 'left'}}
              onMouseEnter={() => this.setState({longDescription: true})}
              onMouseLeave={() => this.setState({longDescription: false})}
            />
            {this.state.longDescription ?
              <Typography color="textSecondary" style={{fontSize: 16}}>
                Most but not all funds are from student fees.
              </Typography>
            : null}
          </>
        )
      case 'division':
        return (
          <>
            <h1 style={{marginBottom: 0}}>Division</h1>
            <Typography color="textSecondary" style={{fontSize: 16, float: 'left'}}>
              Entity overseeing the funds; the division is an umbrella to the department
              and a single division can include multiple departments.
            </Typography>
            <InfoIcon
              style={{float: 'left'}}
              onMouseEnter={() => this.setState({longDescription: true})}
              onMouseLeave={() => this.setState({longDescription: false})}
            />
            {this.state.longDescription ?
              <Typography color="textSecondary" style={{fontSize: 16}}>
                You may need to click on the division and the department to understand which
                entity is tied to the funds. The division may not always give enough information
                on it’s own. The membership fees are delegated to other entities (not
                directly administered by USAC, but USAC has reporting oversight).
              </Typography>
            : null}
          </>
        )
      case 'department':
        return (
          <>
            <h1 style={{marginBottom: 0}}>Department</h1>
            <Typography color="textSecondary" style={{fontSize: 16}}>
              Who spends the money.
            </Typography>
          </>
        )
      case 'gl':
        return (
          <>
            <h1 style={{marginBottom: 0}}>General Ledger</h1>
            <Typography color="textSecondary" style={{fontSize: 16}}>
              Category that accounting assigns to the expenditure (i.e. programming, honorarium, etc.)
            </Typography>
          </>
        )
      case 'event':
        return (
          <>
            <h1 style={{marginBottom: 0}}>Event</h1>
            <Typography color="textSecondary" style={{fontSize: 16}}>
              What the occasion was.
            </Typography>
          </>
        )
      case 'keyword':
        return (
          <>
            <h1 style={{marginBottom: 0}}>Description</h1>
            <Typography color="textSecondary" style={{fontSize: 16, float: 'left'}}>
              Where money gets spent, according to the spender (a.k.a. *Department*). Larger font means more money.
            </Typography>
            <InfoIcon
              style={{float: 'left'}}
              onMouseEnter={() => this.setState({longDescription: true})}
              onMouseLeave={() => this.setState({longDescription: false})}
            />
            {this.state.longDescription ?
              <Typography color="textSecondary" style={{fontSize: 16}}>
                If you wanted to narrow the results to “Bruin Bash”, click the word “Bruin” and then “Bash”.
                You will see only the transactions with both words in the *Description*. The choice of these
                words is at the spenders discretion, subject to approval/abbreviation by the accountant.
                For example, the spender might write “ … student wellness commission …”, and the accountant
                may abbreviate it as “ … swc …” The graphic performs intelligent de-abbreviation for your convenience.
              </Typography>
            : null}
          </>
        )
      case 'amount':
        return (
          <>
            <h1 style={{marginBottom: 0}}>Amount</h1>
            <Typography color="textSecondary" style={{fontSize: 16, float: 'left'}}>
              How much money is in each transaction.
            </Typography>
            <InfoIcon
              style={{float: 'left'}}
              onMouseEnter={() => this.setState({longDescription: true})}
              onMouseLeave={() => this.setState({longDescription: false})}
            />
            {this.state.longDescription ?
              <Typography color="textSecondary" style={{fontSize: 16}}>
                Multiple purchases may be grouped under one transaction.
                Negative values are refunds to the Association.
              </Typography>
            : null}
          </>
        )
      case 'table':
        return (
          <Typography color="textSecondary" style={{fontSize: 16}}>
            Above is the raw transaction table of the Undergraduate Student Association.
            Click on a column to visualize it.
            <br />
            Low on time? Most important is the descriptions column. Everything else is administrative.
          </Typography>
        )
      case 'footer':
        return (
          <Typography color="textSecondary" style={{fontSize: 16}}>
            We had to de-abbreviate them, but sometimes did that incorrectly,
            so please comment at the bottom of the page if you see that.
            <br />
            These abbreviations had to be autocorrected so they can be categorized in the visual.
            If autocorrect groups transactions incorrectly, please comment at the bottom of the page.
          </Typography>
        )
      default:
        return <div />
      }
    }
  }
}
