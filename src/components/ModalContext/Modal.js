import React, {useState} from "react";
import './modal.css';


export const ModalContent = props => {
    const [over, setOver] = useState(false);
    const {children, onDrop, className, content, ...others} = props;

    const className_ = "modal-content" + (className ? ' ' + className: '');
    const dropClassName = "modal-content__drop-area" + (over ? " modal-content__drop-area_over" : "");

    return <div className={className_} {...others}>
        <div className="modal-content__top">{children}</div>
        <div
            className={dropClassName}
            onDrop={onDrop}
            onDragOver={event => event.preventDefault()}
            onDragEnter={() => setOver(true)}
            onDragLeave={() => setOver(false)}
        >
            {content}
        </div>
    </div>
}