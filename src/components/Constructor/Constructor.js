import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus, faSave} from '@fortawesome/free-solid-svg-icons'
import {addFigure, addSlice, setFigure, setSize, setSlice, tapCell} from "../../store";
import * as R from 'ramda';
import './constructor.css';
import {Container} from "../Container/Container";
import {csn} from "../../utils";
import {FloatAction} from "../FloatAction/FloatAction";
import {buildFigureSelector} from "./Solver";


const sliceCompose = state => {
    return R.transpose(state.counter.figures[state.counter.currentFigure].slice(0, state.counter.currentSlice + 1))
        .map(cells => cells.map(c => R.not(c)).every(Boolean) ? [true] : cells)
        .map(R.reverse)
        .map(R.takeWhile(R.not))
        .map(R.length)
}


const FiguresPanel = props => {

    const figuresCount = useSelector(state => state.counter.figures.length)
    const currentFigureNumber = useSelector(state => state.counter.currentFigure);
    const dispatch = useDispatch();

    return <div
        className={csn(
            'constructor-figures',
            props.out && 'constructor__constructor-figures_out'
        )}
    >
        {R.range(0, figuresCount).map((ing, figureNumber) => (
            <button
                key={figureNumber}
                onClick={() => dispatch(setFigure(figureNumber))}
                className={"constructor-L" + (figureNumber === currentFigureNumber ? " constructor-L_active" : "")}
            >
                {figureNumber + 1}
            </button>
        ))}
        <FontAwesomeIcon
            icon={faPlus}
            onClick={() => dispatch(addFigure())}
            className="constructor-L-plus"
        />
    </div>
}


const LevelsPanel = () => {

    const dispatch = useDispatch();
    const sliceCount = useSelector(state => state.counter.figures[state.counter.currentFigure].length)
    const currentSliceNumber = useSelector(state => state.counter.currentSlice)

    return <div className='constructor__levels-panel'>
            {R.range(0, sliceCount).map((ing, figureNumber) => (
                <button
                    key={figureNumber}
                    onClick={() => dispatch(setSlice(figureNumber))}
                    className={"constructor-L" + (figureNumber === currentSliceNumber ? " constructor-L_active" : "")}
                >
                    {figureNumber + 1}
                </button>
            ))}
            <FontAwesomeIcon
                icon={faPlus}
                onClick={() => dispatch(addSlice())}
                className="constructor-L-plus"
            />
    </div>
}


const Constructor = () => {
    const dispatch = useDispatch();
    const data = useSelector(state => state.counter.figures[state.counter.currentFigure][state.counter.currentSlice]);
    const composedSlices = useSelector(sliceCompose)
    const rows = useSelector(state => state.counter.rows);
    const buildFigures = useSelector(buildFigureSelector);

    const saveProblem = () => {
        const tempLink = document.createElement("a");
        const taBlob = new Blob([JSON.stringify(buildFigures)], {type: 'text/plain'});
        tempLink.setAttribute('href', URL.createObjectURL(taBlob));
        tempLink.setAttribute('download', `cubeProblem.ac`);
        tempLink.click();
        URL.revokeObjectURL(tempLink.href)
    };

    return <React.Fragment>
        <Container>
            <div className="constructor-wrapper">
                <div className="constructor-container">
                    <LevelsPanel />
                    <div className="constructor-grid" style={{ gridTemplateColumns: `repeat(${rows}, 1fr)` }}>
                        {data.map((active, pos) => (
                            <div key={pos} className="constructor-item" >
                                <div key={pos} className={'constructor-item-cell' + (active ? ' cell_active' : '')} onClick={() => dispatch(tapCell(pos))}>
                                    {!!composedSlices[pos] && <div className='cell-slice' />}
                                </div>
                            </div>
                        ))}
                    </div>

                    <FiguresPanel />
                </div>
            </div>
        </Container>
        <FiguresPanel out />
        <FloatAction>
            <FontAwesomeIcon
                onClick={() => saveProblem()}
                icon={faSave}
                className="constructor__solution-upload-new"
            />
        </FloatAction>
    </React.Fragment>
}



const CubeButton = props => {
    const {children, ...others} = props;
    return <div {...others}
            className="constructor__cube-button-wrapper"
        >
        <div className="constructor__cube-button">
            {children}
        </div>
        <svg width="80px" height="120px" viewBox="0 0 21 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <g id="Page-1" stroke="none" fill="none" >
                <g id="Group-6">
                    <polygon id="Path-7" fill="#FFD58F85" points="0 6 2.6 7.4 10.3942286 2.9 18.1884573 7.4 20.7846097 6 10.3942286 0"></polygon>
                    <polygon id="Path-8" fill="#FFD58F85" points="0 6 2.6 7.4 2.6 16.4 10.3942286 20.9 10.3942286 24 0 18"></polygon>
                    <polygon id="Path-9" fill="#FFD58F85" points="18.1884573 7.4 20.7846097 6 20.7846097 18 10.3942286 24 10.3942286 20.9 18.1884573 16.4"></polygon>
                </g>
            </g>
        </svg>
    </div>
}


export const ConstructorWrapper = () => {

    const cols = useSelector(state => state.counter.cols);
    const dispatch = useDispatch();

    const onClick = size => () => {
        dispatch(setSize(size))
    };

    const cubeButton = size => (
        <CubeButton key={size} onClick={onClick(size)}>
            {size}
        </CubeButton>
    )

    if (cols) return <Constructor />

    return <div>
        <p className="constructor__constructor-wrapper">Размер куба</p>
        <div className="constructor__constructor-wrapper-cube-container">
            {R.range(3, 6).map(cubeButton)}
        </div>
    </div>
}
