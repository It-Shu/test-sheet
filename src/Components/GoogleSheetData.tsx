import React, {FC, useEffect, useState} from "react";
import {ConvertResultType} from "./Form";
import NewDocument from "./NewDocument";
import ModalWindow from "./ModalWindow";
import PreviewPage from "./PreviewPage";
import FakeButtons from "./FakeButtons";

type GoogleSheetDataTypes = {
    sheetLink: string
    arrayOfDocTemplate: ConvertResultType[]
    sheetUrlId: string | null
}

export type SheetDataType = Array<string | null>;

const GoogleSheetData: FC<GoogleSheetDataTypes> = React.memo((props) => {

    const [firstSheetData, setFirstSheetData] = useState<SheetDataType[]>([])
    const [secondSheetData, setSecondSheetData] = useState<SheetDataType[]>([])

    const apiKey = "AIzaSyCFY3hmuLkD-Tzc-9MLCam0f3RzZ0r9l0E";
    const [showModalWindow, setShowModalWindow] = useState(false);

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [errorImageUrl, setErrorImageUrl] = useState<string | null>(null)
    const [errorSheet, setErrorSheet] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(props.sheetLink);
                const htmlString = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, "text/html");
                let imgElements = doc.getElementsByTagName("img")[0].getAttribute("src");
                setImageUrl(imgElements);
            } catch (error) {
                setErrorImageUrl("Ошибка поиска сылки на картинку")
            }
        };
        fetchData();
    }, [props.sheetLink]);

    useEffect(() => {
        const fetchGoogleSheetData = async () => {
            try {
                const firstDataArr: SheetDataType[] = [];
                const secondDataArr: SheetDataType[] = [];

                for (const item of props.arrayOfDocTemplate) {
                    const {list, column, line} = item;
                    if (list && column && line) {
                        let sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${props.sheetUrlId}/values/${list}!${column}${line}?key=${apiKey}`;
                        const response = await fetch(sheetURL);
                        const data = await response.json();
                        firstDataArr.push(data.values);
                    }
                }

                for (const item of props.arrayOfDocTemplate) {
                    const {list, column, line, endColumn, endLine} = item;

                    if (endColumn && endLine) {
                        let sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${props.sheetUrlId}/values/${list}!${column}${line}:${endColumn}${endLine}?key=${apiKey}`;
                        const response = await fetch(sheetURL);
                        const data = await response.json();
                        secondDataArr.push(data.values);
                    }
                }

                const flattenedData: SheetDataType[] = firstDataArr.reduce((acc: SheetDataType[], item: SheetDataType) => {
                    return acc.concat(item);
                }, []);

                setFirstSheetData(flattenedData.slice(0, -2));
                setSecondSheetData(secondDataArr);
            } catch (error) {
                setErrorSheet("Ошибка Поиска данных в Таблице")
            }
        };
        fetchGoogleSheetData()

    }, [props.sheetUrlId, props.arrayOfDocTemplate]);

    let nullIndex = firstSheetData.findIndex(item => item === undefined);

    if (imageUrl && nullIndex >= 0) {
        firstSheetData[nullIndex] = [imageUrl]
    }

    if (firstSheetData.length === 0 || secondSheetData.length === 0) {
        return <FakeButtons preViewButtonTitle={"Предварительный просмотр"} loadButtonTitle={"Обработка..."}/>
    }

    const handleClose = () => setShowModalWindow(false);
    const handleShow = () => setShowModalWindow(true);

    return (
        <div className="d-flex align-self-end m-5 flex-lg-row flex-md-row flex-sm-row flex-column">
            <ModalWindow show={showModalWindow}
                         handleShow={handleShow}
                         handleClose={handleClose}
                         content={<PreviewPage firstSheetData={firstSheetData} secondSheetData={secondSheetData}/>}
            />
            <NewDocument firstSheetData={firstSheetData} secondSheetData={secondSheetData}/>
            <div>
                {errorImageUrl && <div>{errorImageUrl}</div>}
                {errorSheet && <div>{errorSheet}</div>}
            </div>
        </div>
    );
});

export default GoogleSheetData;
