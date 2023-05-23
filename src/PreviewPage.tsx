import React, {FC} from 'react';
import {Col, Container, Image, Row, Table} from "react-bootstrap";
import {MyData} from "./GoogleSheetData";

type PreviewPageTypes = {
    secondSheetData: MyData[]
    firstSheetData: MyData[]
}

const PreviewPage: FC<PreviewPageTypes> = (props) => {

    const renderElementsFromData = (data: MyData[]) => {
        let projectNumber = '';
        const elements = data.map((item, index) => {
            if (item && typeof item[0] === 'string') {
                if (item[0].startsWith('http')) {
                    const imageUrl = item[0];
                    return <Image key={index} src={imageUrl} alt="Image" fluid/>;
                } else if (item[0] === '1411') {
                    projectNumber = item[0];
                } else {
                    const content = item[0] || ''; // Обработка null значений
                    return <div key={index}>{content}</div>;
                }
            }
            return null;
        });

        if (projectNumber) {
            elements.unshift(<div key="projectNumber">Project №: {projectNumber}</div>);
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

            <div>
                {renderElementsFromData(props.firstSheetData)}
            </div>
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
};

export default PreviewPage;
