import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as R from 'ramda';
import {ModalContent} from "../ModalContext/Modal";
import {Solution} from "./Solution";
import {useElementWidth} from "../../useElementSize";
import './solver.css';
import {addSolutions, loadData, runBuild, setBuild, solutionsSetState} from "../../store";
import {faRotate, faClose} from "@fortawesome/free-solid-svg-icons";
import {Container} from "../Container/Container";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {FloatAction} from "../FloatAction/FloatAction";

const st = [
    [[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 1, 1]],
    [[2, 0, 0], [1, 1, 0], [2, 1, 0], [2, 1, 1], [2, 2, 1]],
    [[0, 0, 1], [1, 0, 1], [2, 0, 1], [1, 0, 2]],
    [[0, 2, 0], [1, 2, 0], [2, 2, 0], [1, 1, 1], [1, 2, 1]],
    [[0, 2, 1], [0, 0, 2], [0, 1, 2], [1, 1, 2], [0, 2, 2]],
    [[2, 0, 2], [2, 1, 2], [1, 2, 2], [2, 2, 2]]
]


const buildFigure = cols => figure => {
    let res = [];
    figure.forEach((slice, slicePos) => {
        let row = 0;
        let col = 0;
        slice.forEach(cell => {
            if (cell)
                res.push([col, row, slicePos])
            if (++col === cols) {
                ++row;
                col = 0;
            }
        })
    })
    return res;
}


export const buildFigureSelector = state => {
    const cols = state.counter.cols;
    const figures = state.counter.figures;
    return figures.map(buildFigure(cols));
}


const ProgressBar = props => {
    const [ref, width] = useElementWidth();
    const counts = ~~(width / 10);
    const progress = ~~(props.progress * counts / 100);

    if (props.progress === 100) return <div className="constructor__solution-progress-time">
        Решено за {props.time}
    </div>;

    return <div ref={ref} className="constructor__solution-progress-bar">
        {R.range(0, progress).map(x => <div key={x} className="constructor__solution-progress-bar-cube"/>)}
        {R.range(progress, counts).map(x => <div key={x} className="constructor__solution-progress-bar-filler">⋅</div>)}
    </div>
}


export const Solutions = props => {
    const solutions = useSelector(state => state.counter.solutions);

    const save_ = (solution, pos) => {
        const tempLink = document.createElement("a");
        const taBlob = new Blob([JSON.stringify(solution)], {type: 'text/plain'});
        tempLink.setAttribute('href', URL.createObjectURL(taBlob));
        tempLink.setAttribute('download', `cubeData ${pos + 1}.acs`);
        tempLink.click();
        URL.revokeObjectURL(tempLink.href);
    }

    const onClick = props.onClick || save_


    return  <div style={{display: "flex", marginTop: -40, flexWrap: 'wrap'}}>
        {solutions.map((st, pos) =>  (
            <div style={{position: "relative", cursor: 'pointer', marginTop: 60}} key={pos} onClick={() => onClick(solutions[pos], pos)}>
                <Solution/>
                {solutions.length > 1 && (
                    <div  className="constructor__solution-file-name">
                        {pos + 1}
                    </div>
                )}
            </div>
        ))}
    </div>
}


const Builder = () => {

    const emptySolutions = useSelector(state => !state.counter.solutions.length);
    const [progress, setProgress] = useState(emptySolutions ? 0 : 100);
    const dispatch = useDispatch();
    const state = useSelector(state => state.counter.solutionsState);
    const figures = useSelector(state => state.counter.solverFigures);


    useEffect(() => {
        if (!emptySolutions) return;
        const ws = new WebSocket("wss://" + window.location.host + "/wws");
        ws.onopen = () => {
            ws.send(JSON.stringify(figures));
        }
        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            if (data.result) {
                dispatch(addSolutions(data.result));
            }
            if (data.time)
                dispatch(solutionsSetState({
                    time: data.time
                }))

            if (data.variants)
                dispatch(solutionsSetState({
                    variants: data.variants
                }))

            if (data.progress) {
                ws.send(null);
                setProgress(data.progress)
            }
        };
    }, [figures, emptySolutions, dispatch]);


    return <div className="constructor__solution-builder">
        <ProgressBar progress={progress} time={state.time?.toFixed(2)}/>
        <div className="constructor__solution-files">
            <Solutions />
        </div>

    </div>
}


export const ConstructorCalculator = () => {

    const emptySolutions = useSelector(state => !state.counter.solutions.length);
    const dispatch = useDispatch();
    const build = useSelector(state => state.counter.build);
    console.log(build);

    const buildFigures = () => {
        dispatch(runBuild());
    }

    const handleFileSelected = e => {
        const file = e.target.files[0];
        file.text().then(r => dispatch(runBuild(JSON.parse(r))))
    }

    const dropHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        const ev = e;
        if (ev.dataTransfer.items) {
            [...ev.dataTransfer.items].forEach(item => {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    file.text().then(r => dispatch(runBuild(JSON.parse(r))))
                }
            });
        }
    }

    return <React.Fragment>
        {!build && (
            <Container>
                <ModalContent
                    className="constructor__solution-modal"
                    onDrop={dropHandler}
                    content={
                        <div className="constructor__solution-upload-content">
                            <button
                                onClick={buildFigures}
                                className="constructor__solution-creator-button"
                            >
                                Из создателя
                            </button>
                            <span className="constructor__solution-browse-and"> Или </span>
                            <div className="constructor__solution-browse">
                                <input type="file" id="file-upload" className="constructor__solution-browse-input" onChange={handleFileSelected}/>
                                <label htmlFor="file-upload">
                                    <span className="constructor__solution-span">
                                        загрузить файл
                                    </span>
                                </label>
                            </div>
                        </div>
                    }
                >
                    <div className="constructor__solution-container-top">
                        <p>Загрузить</p>
                        {!emptySolutions && (
                            <FontAwesomeIcon
                                onClick={() => dispatch(setBuild(true))}
                                icon={faClose}
                                className="constructor__solution-close-modal"
                            />
                        )}
                    </div>
                </ModalContent>
            </Container>
        )}
        {build && (
            <Builder />
        )}
        {build && (
            <FloatAction>
                <FontAwesomeIcon
                    onClick={() => dispatch(setBuild(false))}
                    icon={faRotate}
                    className="constructor__solution-upload-new"
                />
            </FloatAction>
        )}
    </React.Fragment>
}
