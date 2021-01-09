import { Backdrop, BackdropProps, Paper, Typography } from "@material-ui/core";
import React from "react";
import MenuIcon from "@material-ui/icons/Menu"
import 'fontsource-roboto';

export default function InstructionBackProp(props: BackdropProps) {
  return (
    <Backdrop style={{ zIndex: 10, color: '#fff' }}{...props}>
      <Paper style={{ backgroundColor: "white", width: "80%", height: "80%" }}>
        <Typography variant="h3">Budget Viewer</Typography>
        <hr />
        <p>This is a viewer/analyzer for Expense of Undergraduate Student Association. </p>
        <Typography variant="h4">Usage</Typography>
        <ul>
          <li style={{ alignItems: "center" }}>Click on <MenuIcon style={{ color: "#fff", backgroundColor: "#3f51b5", padding: 6, borderRadius: 3, margin: 3 }} />
                on top right to select the data year.</li>
        </ul>
      </Paper>
    </Backdrop>
  )
}
