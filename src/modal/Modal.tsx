import React, {FC, MouseEvent, ReactNode} from 'react';
import * as C from './Modal.style';

interface ModalProps {
    children?: ReactNode;
    active: boolean;
    onClose?: () => void;
}

const Modal: FC<ModalProps> = props => {
    const {
        active,
        children,
        onClose,
    } = props;

    const handleClose = () => (onClose ? onClose() : null);
    const stopPropagation = (event: MouseEvent<HTMLDivElement>) => event.stopPropagation();

    return (
        <C.ModalBackground isModalActive={active} onClick={handleClose}>
            <C.ModalWindow
                isModalActive={active}
                onClick={stopPropagation}>
                {children}
            </C.ModalWindow>
        </C.ModalBackground>
    );
};

export default Modal;
