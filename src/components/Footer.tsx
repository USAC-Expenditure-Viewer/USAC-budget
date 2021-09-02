import React from "react";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import EmailIcon from '@material-ui/icons/Email';
import FeedbackIcon from '@material-ui/icons/Feedback';
import {Button} from "@material-ui/core";

export default function Footer() {

  const copyURL = () => {
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
  };


  return (
    <footer>
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
        <a href="mailto:usacbudgetviewer@gmail.com" style={{ padding: 20, color: 'black' }} aria-label="email accountant">
          <EmailIcon /> Contact Us
        </a>
        <a href="mailto:vtran@asucla.ucla.edu" style={{ padding: 20, color: 'black' }} aria-label="email accountant">
          <EmailIcon /> Professional Accountant
        </a>
        <a href="mailto:usacouncil@asucla.ucla.edu" style={{ padding: 20, color: 'black' }} aria-label="email usac">
          <EmailIcon /> USAC Council
        </a>
        <Button style={{ color: 'black', textDecoration: 'underline' }} onClick={() => copyURL()} aria-label="share">
          Copy link
        </Button>
        <a href='https://www.youtube.com/watch?v=cG8gkj6EEs0' rel="noopener noreferrer" target="_blank" aria-label="tutorial video">
          <Button aria-label="share">
            <ContactSupportIcon /> Video
          </Button>
        </a>
      </div>
    </footer>
  )
}
