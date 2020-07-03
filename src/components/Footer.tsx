import {Link, Paper, Typography} from "@material-ui/core";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import EmailIcon from '@material-ui/icons/Email';
import React from "react";

export default function Footer() {
    return (
        <footer>
            <br/>
            <Link color="textSecondary" href="https://forms.google.com" style={{padding: 20}}>
                <ContactSupportIcon/> Comments
            </Link>
            <Link color="textSecondary" href="mailto:vtran@asucla.ucla.edu" style={{padding: 20}}>
                <EmailIcon/> Professional Accountant
            </Link>
            <Link color="textSecondary" href="mailto:usacouncil@asucla.ucla.edu" style={{padding: 20}}>
                <EmailIcon/> USAC Council
            </Link>
            <br/><br/>
            <Typography color="textSecondary">
                We had to de-abbreviate them, but sometimes did that incorrectly,
                so please comment at the bottom of the page if you see that.
                <br/>
                These abbreviations had to be autocorrected so they can be categorized in the visual.
                If autocorrect groups transactions incorrectly, please comment at the bottom of the page.
            </Typography>
        </footer>
    )
}
