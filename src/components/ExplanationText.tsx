import React from "react";
import {Typography} from "@material-ui/core";
import {Category} from "../models/DataLoader";

export interface ExpProps {
    category: Category | 'date' | 'amount' | 'keyword' | 'table' | 'footer';
}

export default function ExplanationText(props: ExpProps) {

    switch (props.category) {
        case 'date':
            return (
                <Typography color="textSecondary">
                    Date that the transaction was entered into the system,
                    which is dependent on when people complete their paperwork.
                    <br/>
                    Use the slider below to filter the dates of the transactions.
                </Typography>
            )
        case 'fund':
            return (
                <Typography color="textSecondary">
                    The source of the money. Not all are from student fees.
                </Typography>
            )
        case 'division':
            return (
                <Typography color="textSecondary">
                    Who allocated the money to a department.
                </Typography>
            )
        case 'department':
            return (
                <Typography color="textSecondary">
                    Who spends the money. Includes student groups.
                </Typography>
            )
        case 'gl':
            return (
                <Typography color="textSecondary">
                    General Ledger are rules on how a particular pile of money can be spent. Operating expenses is the generic label.
                </Typography>
            )
        case 'event':
            return (
                <Typography color="textSecondary">
                    The occasion/reason for the transaction. Commission/Dept related is the generic label.
                </Typography>
            )
        case 'keyword':
            return (
                <Typography color="textSecondary">
                    The spender writes how they spent $, and the accountant abbreviates it (due to character limit).
                    Wordcloud de-abbreviates, and font size represents the total $ of all descriptions containing the word. (tell us if de-abreviation has bugs)
                </Typography>
            )
        case 'amount':
            return (
                <Typography color="textSecondary">
                    Histogram of the individual transaction amounts.
                    <br/>
                    Use the slider below to filter the amount of the transactions.
                </Typography>
            )
        case 'table':
            return (
                <Typography color="textSecondary">
                    Below is the raw transaction table of the Undergraduate Student Association.
                    Click on a column to visualize it.
                    <br/>
                    Low on time? Most important is the descriptions column. Everything else is administrative.
                </Typography>
            )
        case 'footer':
            return (
                <Typography color="textSecondary">
                    We had to de-abbreviate them, but sometimes did that incorrectly,
                    so please comment at the bottom of the page if you see that.
                    <br/>
                    These abbreviations had to be autocorrected so they can be categorized in the visual.
                    If autocorrect groups transactions incorrectly, please comment at the bottom of the page.
                </Typography>
            )
        default:
            return <div/>
    }

}
