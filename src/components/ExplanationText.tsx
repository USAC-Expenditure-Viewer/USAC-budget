import React from "react";
import { Typography } from "@material-ui/core";
import { Category } from "../models/DataLoader";

export interface ExpProps {
  category: Category | 'date' | 'amount' | 'keyword' | 'table' | 'footer';
}

export default function ExplanationText(props: ExpProps) {

  switch (props.category) {
    case 'date':
      return (
        <Typography color="textSecondary">
          Date transaction entered. (purchases occur beforehand)
        </Typography>
      )
    case 'fund':
      return (
        <Typography color="textSecondary">
          Source of money (includes student fees and other income)
        </Typography>
      )
    case 'division':
      return (
        <Typography color="textSecondary">
          Allocates money to departments.
        </Typography>
      )
    case 'department':
      return (
        <Typography color="textSecondary">
          Spends money (includes student groups)
        </Typography>
      )
    case 'gl':
      return (
        <Typography color="textSecondary">
          Rules for how each $ can be spent.
        </Typography>
      )
    case 'event':
      return (
        <Typography color="textSecondary">
          Occasion/reason for transaction. ( generic label is “Commission/Dept related”)
        </Typography>
      )
    case 'keyword':
      return (
        <Typography color="textSecondary">
          How the departments said they spent money.
          Accountant abreviates. Wordcloud deabreviates.
          Font size of word represents total $ for all descriptions that include word.
        </Typography>
      )
    case 'amount':
      return (
        <Typography color="textSecondary">
          Size of each transaction. (may include several purchases)
        </Typography>
      )
    case 'table':
      return (
        <Typography color="textSecondary">
          Above is the raw transaction table of the Undergraduate Student Association.
          Click on a column to visualize it.
          <br />
                    Low on time? Most important is the descriptions column. Everything else is administrative.
        </Typography>
      )
    case 'footer':
      return (
        <Typography color="textSecondary">
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
