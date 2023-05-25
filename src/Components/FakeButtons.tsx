import React from "react";
import {Button} from "react-bootstrap";

type FakeButtonsProps = {
    preViewButtonTitle: string
    loadButtonTitle: string
}

const FakeButtons: React.FC<FakeButtonsProps> = (props) => {

    return (
        <div className="d-flex align-self-end m-5 flex-lg-row flex-md-row flex-sm-row flex-column">
            <Button variant="light" className="me-sm-3 me-md-3 me-lg-3 mb-2">
                {props.preViewButtonTitle}
            </Button>
            <Button variant="light" className="mb-2">
                {props.loadButtonTitle}
            </Button>
        </div>
    );
};

export default FakeButtons;
