import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loadData, setView, toggleFired} from '../../store';
import music from '../../media/music.mp3';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClose, faFire, faRotate} from "@fortawesome/free-solid-svg-icons";
import {ModalContent} from "../ModalContext/Modal";
import {Container} from "../Container/Container";
import {csn} from "../../utils";
import './view.css';
import {Solutions} from "../Constructor/Solver";
import {FloatAction} from "../FloatAction/FloatAction";


export const Main = () => {

    const dispatch = useDispatch();
    const cubeData = useSelector(state => state.counter.cubeData);

    const dropHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items) {
            [...e.dataTransfer.items].forEach(item => {
                if (item.kind === 'file') {
                    const file = item.getAsFile();
                    file.text().then(r => dispatch(loadData(JSON.parse(r))))
                }
            });
        }
    }

    const handleFileSelected = e => {
        const file = e.target.files[0];
        file.text().then(r => dispatch(loadData(JSON.parse(r))))
    }

    const [tab, setTab] = useState(0);

    const onClickHandler = solution => {
        dispatch(loadData(solution))
    }

    return  <Container>
        <ModalContent
            className="view__modal"
            content={
                tab === 0 ? (
                    <div className="constructor__solution-upload-content">
                        <p>Перенеси файл</p>
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
                ) : (
                    <Solutions onClick={onClickHandler}/>
                )
            }
            onDrop={dropHandler}
        >
            <div className="constructor__solution-container-top">
                Загрузить решение
                {cubeData && (
                    <FontAwesomeIcon
                        onClick={() => dispatch(setView(true))}
                        icon={faClose}
                        className="constructor__solution-close-modal"
                    />
                )}
            </div>
            <div>
                <button
                    onClick={() => setTab(0)}
                    className={csn(
                        "view__upload-tab",
                        tab === 0 && "view__upload-tab_active"
                    )}
                >
                    Загрузить
                </button>
                <button
                    className={csn(
                        "view__upload-tab",
                        tab === 1 && "view__upload-tab_active"
                    )}
                    onClick={() => setTab((1))}
                >
                    Из решателя
                </button>
            </div>
        </ModalContent>
    </Container>
}


export const Fire = () => {

    const msc = React.useRef();
    const dispatch = useDispatch();
    const fired = useSelector(state => state.counter.fired);


    const onClick = () => {
        const mus = msc.current;
        // noinspection JSUnresolvedFunction
        fired ? mus.pause() : mus.play();
        dispatch(toggleFired())
    }

    return <React.Fragment>
        <audio
            id="player"
            ref={msc}
            src={music}
        />
        <FontAwesomeIcon icon={faFire} className={"fire"} onClick={onClick}/>
        <FloatAction>
            <FontAwesomeIcon
                onClick={() => dispatch(setView(false))}
                icon={faRotate}
                className="constructor__solution-upload-new"
            />
        </FloatAction>
    </React.Fragment>
}


