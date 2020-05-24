import {Backdrop, BackdropProps} from "@material-ui/core";
import React from "react";

export default function InstructionBackProp(props: BackdropProps) {
    return (
        <Backdrop style={{zIndex: 10, color: '#fff'}}{...props}>
            <div style={{height: "80%", width: "80%", backgroundColor: '#fff'}}>
            </div>
        </Backdrop>
    )
}
