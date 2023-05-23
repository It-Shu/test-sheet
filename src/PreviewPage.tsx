import React, {FC} from 'react';
import {Col, Container, Row, Table} from "react-bootstrap";
import {SheetDataType} from "./GoogleSheetData";
import {useFindImageLink} from "./hooks/useFindImageLink";
import {useDocNumberFinder} from "./hooks/useDocNumberFinder";

type PreviewPageTypes = {
    secondSheetData: SheetDataType[]
    firstSheetData: SheetDataType[]
}

const PreviewPage: FC<PreviewPageTypes> = React.memo((props) => {

    const {imageLink} = useFindImageLink(props.firstSheetData)
    const {documentNumber} = useDocNumberFinder(props.firstSheetData)

    const renderElementsFromData = (data: SheetDataType[]) => {
        let projectNumber = '';
        const elements = data.map((item, index) => {
            if (item && typeof item[0] === 'string') {
                if (item[0].startsWith('http')) {
                    return null;
                } else if (item[0] === documentNumber) {
                    projectNumber = item[0];
                } else {
                    const content = item[0] || '';
                    return <div key={index}>{content}</div>;
                }
            }
            return null;
        });

        if (projectNumber) {
            elements.unshift(<div key="projectNumber">Номер Документа: {projectNumber}</div>);
        }

        return (
            <Container>
                <Row>
                    <Col>{elements}</Col>
                </Row>
            </Container>
        );
    };

    return (
        <div>
            <div>{renderElementsFromData(props.firstSheetData)}</div>
            <img src={imageLink} alt="image"/>
            <div>
                <div>
                    <h2>Первая таблица</h2>
                    <Table striped>
                        <tbody>
                        {props.secondSheetData[0].map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {row && Object.values(row).map((cell: string | null, cellIndex: number) => (
                                    <td key={cellIndex}>{cell}</td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                </div>

                {props.secondSheetData[1] && (
                    <div>
                        <h2>Вторая таблица</h2>
                        <Table striped>
                            <tbody>
                            {props.secondSheetData[1].map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row && Object.values(row).map((cell: string | null, cellIndex: number) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                )}
            </div>
        </div>
    );
});

export default PreviewPage;
