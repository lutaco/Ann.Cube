import React from "react";
import ReactDOM from "react-dom";
import {ModalContext} from "../../context";
import {nanoid} from "nanoid";


const makeModalElementStyle = AuthorPosition => ({
    top: AuthorPosition.top,
    left: AuthorPosition.left,
    position: 'absolute'
})


export class Modal extends React.Component {

    static contextType = ModalContext;

    constructor(props) {
        super(props);
        this.el = document.createElement('div');
        this.el.id = nanoid();
        this.handleClose = props.handleClose;
    }

    componentDidMount() {
        const context = this.context;
        context.modal.appendChild(this.el);
        context.root.addEventListener('click', this.props.handleClose);
    }

    componentWillUnmount() {
        const context = this.context;
        context.modal.removeChild(this.el);
        context.root.removeEventListener('click', this.props.handleClose)
    }

    modalPosition() {
        const modalRect = this.context.modal.getBoundingClientRect();
        // debugger;
        const auRect = (this.props.author || document.body).getBoundingClientRect();
        return {
            top: auRect.top - modalRect.top,
            left: auRect.left - modalRect.left,
        }
    }

    modalElement() {
        const modalStyle = makeModalElementStyle(this.modalPosition());
        return <div style={modalStyle}>
            {this.props.children}
        </div>
    }

    render() {
        return ReactDOM.createPortal(
            this.modalElement(),
            this.el
        );
    }
}
