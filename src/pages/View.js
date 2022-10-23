import {Cube} from "../cube";
import React from "react";
import {SmartFragment} from "../fragment";
import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {CanvasContext} from "../App";
import {Fire, Main} from "../components/View/View";


export function View() {

    const cubeData = useSelector(state => state.counter.cubeData);
    const items = useSelector(state => state.counter.visibleItems);
    const allItems = useSelector(state => state.counter.cubeData?.map(item => item.item))
    const fired = useSelector(state => state.counter.fired);
    const view = useSelector(state => state.counter.view);

    const getItem = item => <SmartFragment key={item} item={item} />

    const {
        renderer, addScene, removeScene
    } = React.useContext(CanvasContext);


    return (
        <div className="app">
            <Link to="/" className="logoName">Ann<span className="logoNameSpan">Cube</span></Link>
            {!view ? (
               <Main />
            ) : (
                <React.Fragment>
                    <div className="demoWrapper">
                        <div className="scroll-left" />
                        <Cube
                            items={items}
                            cubeData={cubeData}
                            renderer={renderer}
                            addScene={addScene}
                            removeScene={removeScene}
                            fired={fired}
                        />
                        <div className="scroll-right" />
                    </div>
                    <div className="fragment-box">
                        <div className="fragment-container">
                            {allItems.map(getItem)}
                            <Fire />
                        </div>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
}
