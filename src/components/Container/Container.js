import React from 'react';
import './container.css';


export const Container = props => {
    return <div className="container">
        {props.children}
    </div>
}
