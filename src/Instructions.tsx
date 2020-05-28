import {Backdrop, BackdropProps} from "@material-ui/core";
import React from "react";

export default function InstructionBackProp(props: BackdropProps) {
    return (
        <Backdrop style={{zIndex: 10, color: '#fff'}}{...props}>
            <img style={{height: "80%"}} src={`${window.location.pathname}/Instruction.png`} alt={"Instructions"}/>
        </Backdrop>
    )
}
