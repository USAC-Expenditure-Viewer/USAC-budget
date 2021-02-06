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
    var graphicTitle = this.props.category === 'keyword' ? 'description' : this.props.category;
    graphicTitle = graphicTitle.charAt(0).toUpperCase() + graphicTitle.slice(1)
    if (this.props.hidden) {
      return null
    } else {
      switch (this.props.category) {
      case 'date':
        return (
          <>
            <h1 style={{marginBottom: 0}}>{graphicTitle}</h1>
            <InfoIcon
              style={{float: 'left'}}
              onMouseEnter={() => this.setState({longDescription: true})}
              onMouseLeave={() => this.setState({longDescription: false})}
            />
            {this.state.longDescription ? 
              <Typography color="textSecondary" style={{fontSize: 16}}>
                Date transaction entered (purchases occur beforehand).
                This is when money leaves the Association, not when it was
                budgeted or spent. For example, a spender (a.k.a *Department*)
                may choose to be reimbursed after their expenditure, or receive
                a cash-advance before their expenditure.
              </Typography>
            : 
              <Typography color="textSecondary" style={{fontSize: 16}}>
                Date transaction entered (purchases occur beforehand).
              </Typography>
            }
          </>
        )
      case 'fund':
        return (
          <>
            <h1 style={{marginBottom: 0}}>{graphicTitle}</h1>
            <InfoIcon
              style={{float: 'left'}}
              onMouseEnter={() => this.setState({longDescription: true})}
              onMouseLeave={() => this.setState({longDescription: false})}
            />
            {this.state.longDescription ? 
              <Typography color="textSecondary" style={{fontSize: 16}}>
                The source of money (includes student fees and other income).
                Most but not all funds are from student fees.
              </Typography>
            : 
              <Typography color="textSecondary" style={{fontSize: 16}}>
                The source of money (includes student fees and other income).
              </Typography>
            }
          </>
        )
      case 'division':
        return (
          <>
            <h1 style={{marginBottom: 0}}>{graphicTitle}</h1>
            {/* <InfoIcon
              style={{float: 'left'}}
              onMouseEnter={() => this.setState({longDescription: true})}
              onMouseLeave={() => this.setState({longDescription: false})}
            />
            {this.state.longDescription ? 
              <Typography color="textSecondary" style={{fontSize: 16}}>
              </Typography>
            :  */}
              <Typography color="textSecondary" style={{fontSize: 16}}>
                How the money is allocated to the departments.
              </Typography>
            {/* } */}
          </>
        )
      case 'department':
        return (
          <>
            <h1 style={{marginBottom: 0}}>{graphicTitle}</h1>
            {/* <InfoIcon
              style={{float: 'left'}}
              onMouseEnter={() => this.setState({longDescription: true})}
              onMouseLeave={() => this.setState({longDescription: false})}
            />
            {this.state.longDescription ? 
              <Typography color="textSecondary" style={{fontSize: 16}}>
              </Typography>
            :  */}
              <Typography color="textSecondary" style={{fontSize: 16}}>
                How each department spends money (includes student groups).
              </Typography>
            {/* } */}
          </>
        )
      case 'gl':
        return (
          <>
            <h1 style={{marginBottom: 0}}>{graphicTitle}</h1>
            {/* <InfoIcon
              style={{float: 'left'}}
              onMouseEnter={() => this.setState({longDescription: true})}
              onMouseLeave={() => this.setState({longDescription: false})}
            />
            {this.state.longDescription ? 
              <Typography color="textSecondary" style={{fontSize: 16}}>
              </Typography> */}
            : 
              <Typography color="textSecondary" style={{fontSize: 16}}>
                General ledger. These are the rules for how the money can be spent.
              </Typography>
            {/* } */}
          </>
        )
      case 'event':
        return (
          <>
            <h1 style={{marginBottom: 0}}>{graphicTitle}</h1>
            {/* <InfoIcon
              style={{float: 'left'}}
              onMouseEnter={() => this.setState({longDescription: true})}
              onMouseLeave={() => this.setState({longDescription: false})}
            />
            {this.state.longDescription ? 
              <Typography color="textSecondary" style={{fontSize: 16}}>
              </Typography>
            :  */}
              <Typography color="textSecondary" style={{fontSize: 16}}>
                Occasion/reason for transaction (generic label is “Commission/Dept related”).
              </Typography>
            {/* } */}
          </>
        )
      case 'keyword':
        return (
          <>
            <h1 style={{marginBottom: 0}}>{graphicTitle}</h1>
            <InfoIcon
              style={{float: 'left'}}
              onMouseEnter={() => this.setState({longDescription: true})}
              onMouseLeave={() => this.setState({longDescription: false})}
            />
            {this.state.longDescription ? 
              <Typography color="textSecondary" style={{fontSize: 16}}>
                How the departments said they spent money.
                Font size of word represents total dollar amount for all descriptions that include word.
                If you wanted to narrow the results to “Bruin Bash”, click the word “Bruin” and then “Bash”.
                You will see only the transactions with both words in the *Description*.
                The choice of these words is at the spenders discretion, subject to approval/abbreviation
                by the accountant. For example, the spender might write “ … student wellness commission …”,
                and the accountant may abbreviate it as “ … swc …” The graphic performs intelligent de-abbreviation
                for your convenience.
              </Typography>
            : 
              <Typography color="textSecondary" style={{fontSize: 16}}>
                How the departments said they spent money.
                Font size of word represents total dollar amount for all descriptions that include word.
              </Typography>
            }
          </>
        )
      case 'amount':
        return (
          <>
            <h1 style={{marginBottom: 0}}>{graphicTitle}</h1>
            <InfoIcon
              style={{float: 'left'}}
              onMouseEnter={() => this.setState({longDescription: true})}
              onMouseLeave={() => this.setState({longDescription: false})}
            />
            {this.state.longDescription ? 
              <Typography color="textSecondary" style={{fontSize: 16}}>
                Size of each transaction (may include several purchases).
                Multiple purchases may be grouped under one transaction.
                Negative values are refunds to the Association.
              </Typography>
            : 
              <Typography color="textSecondary" style={{fontSize: 16}}>
                Size of each transaction (may include several purchases).
              </Typography>
            }
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
