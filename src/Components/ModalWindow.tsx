import React  from "react";
import { Button, Modal } from "react-bootstrap";

type ModalWindowProps = {
    content: React.ReactNode
    show: boolean
    handleClose: () => void
    handleShow: () => void
}

const ModalWindow: React.FC<ModalWindowProps> = (props) => {

    return (
        <>
            <Button variant="light" onClick={props.handleShow} className="me-sm-3 me-md-3 me-lg-3 mb-2">
                Предварительный просмотр
            </Button>

            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Данные Нового Документа</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.content}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Закрыть
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalWindow;
