import {Link, Paper} from "@material-ui/core";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import EmailIcon from '@material-ui/icons/Email';
import React from "react";

export default function Footer() {
    return (
        <footer>
            <Paper variant="outlined" style={{margin: "0 10%", padding: 20}}>
                <Link color="textSecondary" href="https://forms.google.com" style={{padding: 20}}>
                    <ContactSupportIcon/> Comments
                </Link>
                <Link color="textSecondary" href="mailto:vtran@asucla.ucla.edu" style={{padding: 20}}>
                    <EmailIcon/> Professional Accountant
                </Link>
                <Link color="textSecondary" href="mailto:usacouncil@asucla.ucla.edu" style={{padding: 20}}>
                    <EmailIcon/> USAC Council
                </Link>
            </Paper>
        </footer>
    )
}
