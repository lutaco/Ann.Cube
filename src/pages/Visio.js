import {Cube} from "../cube";
import React, {useState} from "react";
import {SmartFragment} from "../fragment";
import {useDispatch, useSelector} from "react-redux";
import {loadData} from '../store';
import {Link} from "react-router-dom";
import {CanvasContext} from "../App";


const Main = () => {
    const [over, setOver] = useState(false);
    const dispatch = useDispatch();

    const dropHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        setOver(false);
        const ev = e;
        if (ev.dataTransfer.items) {
            [...ev.dataTransfer.items].forEach(item => {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    file.text().then(r => dispatch(loadData(JSON.parse(r))))
                }
            });
        }
    }

    return <div className="Modal">
        <p>Загрузить решение</p>
        <div className='dooots'>
            <div
                className={"dropps" + (over ? " dropps_over" : "")}
                onDrop={dropHandler}
                onDragOver={event => event.preventDefault()}
                onDragEnter={() => setOver(true)}
                onDragLeave={() => setOver(false)}
            />
        </div>
    </div>
}


export function Visio() {

    const cubeData = useSelector(state => state.counter.cubeData);
    const items = useSelector(state => state.counter.visibleItems);
    const allItems = useSelector(state => state.counter.cubeData?.map(item => item.item))

    const getItem = item => <SmartFragment key={item} item={item} />

    const {
        renderer, addScene, removeScene
    } = React.useContext(CanvasContext);
    debugger;

    if (!cubeData)
        return <Main />

    return (
        <div className="app">
            <Link to="/" className="logoName">Ann<span className="logoNameSpan">Cube</span></Link>
            <div className="demoWrapper">
                <div className="scroll-left" />
                <Cube
                    items={items}
                    cubeData={cubeData}
                    renderer={renderer}
                    addScene={addScene}
                    removeScene={removeScene}
                />
                <div className="scroll-right" />
            </div>
            <div className="fragment-box">
                <div className="fragment-container">
                    {allItems.map(getItem)}
                </div>
            </div>
        </div>
    );
}
