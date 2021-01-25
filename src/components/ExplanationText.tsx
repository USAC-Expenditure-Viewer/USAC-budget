import React from "react";
import { Typography } from "@material-ui/core";
import { Category } from "../models/DataLoader";

export interface ExpProps {
  hidden?: boolean
  category: Category | 'date' | 'amount' | 'keyword' | 'table' | 'footer';
}

export default function ExplanationText(props: ExpProps) {

  if (props.hidden) {
    return null
  } else {
    switch (props.category) {
    case 'date':
      return (
        <Typography color="textSecondary" style={{fontSize: 16}}>
          Date transaction entered (purchases occur beforehand).
        </Typography>
      )
    case 'fund':
      return (
        <Typography color="textSecondary" style={{fontSize: 16}}>
          The source of money (includes student fees and other income).
        </Typography>
      )
    case 'division':
      return (
        <Typography color="textSecondary" style={{fontSize: 16}}>
          How the money is allocated to the departments.
        </Typography>
      )
    case 'department':
      return (
        <Typography color="textSecondary" style={{fontSize: 16}}>
          How each department spends money (includes student groups).
        </Typography>
      )
    case 'gl':
      return (
        <Typography color="textSecondary" style={{fontSize: 16}}>
          General ledger. These are the rules for how the money can be spent.
        </Typography>
      )
    case 'event':
      return (
        <Typography color="textSecondary" style={{fontSize: 16}}>
          Occasion/reason for transaction (generic label is “Commission/Dept related”).
        </Typography>
      )
    case 'keyword':
      return (
        <Typography color="textSecondary" style={{fontSize: 16}}>
          How the departments said they spent money.
          Font size of word represents total dollar amount for all descriptions that include word.
        </Typography>
      )
    case 'amount':
      return (
        <Typography color="textSecondary" style={{fontSize: 16}}>
          Size of each transaction (may include several purchases).
        </Typography>
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
