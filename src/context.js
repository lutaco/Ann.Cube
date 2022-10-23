import React from "react";


export const ModalContext = React.createContext(null);
export const ModalProvider = ModalContext.Provider

export const makeModal = () => {
    const modal = document.createElement('div')
    modal.style.position = 'relative';
    modal.style.zIndex = '1000';
    return modal;
}
