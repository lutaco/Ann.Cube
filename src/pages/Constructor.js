import React, {useState} from "react";
import {Link} from "react-router-dom";
import * as R from 'ramda';
import {ConstructorCalculator} from "../components/Constructor/Solver";
import {ConstructorWrapper} from "../components/Constructor/Constructor";


export function Constructor() {
    const [tab, setTab] = useState(0);
    console.log('render tab');
    return (
        <div className="app-constructor">
            <Link to="/" className="logoName">Ann<span className="logoNameSpan">Cube</span></Link>
            <div className='constructor-tabs'>
                <button
                    className={tab === 0 ? 'active' : ''}
                    onClick={() => setTab(0)}
                >
                    Создатель
                </button>
                <button
                    className={tab === 1 ? 'active' : ''}
                    onClick={() => setTab(1)}
                >
                    Решатель
                </button>
            </div>
            {tab === 0 && (
                <ConstructorWrapper />
            )}
            {tab === 1 && (
                <ConstructorCalculator/>
            )}
        </div>
    )
}

window.R = R;
