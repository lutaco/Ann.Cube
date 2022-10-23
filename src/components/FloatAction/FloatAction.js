import React from "react";
import './floatAction.css'

export const FloatAction = props => {
    return <div onClick={props.onClick} className="constructor__solution-float-action">
        {props.children}
    </div>
}