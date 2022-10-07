import React from "react";
import {
    Link
} from "react-router-dom";
import cube from '../cube.svg'

export function Main() {
    return (
        <div className='logo-c'>
            <img src={cube} alt="cube" className="logo"/>
            <div className='actions'>
                <Link to="/visio" className="actions_item">Пощупать</Link>
            </div>
        </div>
    )
}
