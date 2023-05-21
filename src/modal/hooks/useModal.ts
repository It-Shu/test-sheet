import { useState } from 'react';

export function useModal(isActive: boolean) {

    const [modalActive, setModalActive] = useState(isActive);

    const handleClose = () => {
        setModalActive(false);
    };

    const handleActive = () => {
        setModalActive(true)
    }

    return { modalActive, handleClose, handleActive };
}
