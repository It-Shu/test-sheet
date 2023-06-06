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

    const apiKey = process.env.REACT_APP_API_KEY; // Добавил хранение apiKey в переменную окружения
    // const apiKey = "AIzaSyCFY3hmuLkD-Tzc-9MLCam0f3RzZ0r9l0E";
    const [showModalWindow, setShowModalWindow] = useState(false);

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [errorImageUrl, setErrorImageUrl] = useState<string | null>(null)
    const [errorSheet, setErrorSheet] = useState<string | null>(null)

    // https://docs.google.com/document/d/1TKZFwNdDg-X-DPJiYXjtLC46JkgRjdAI/edit#
    // https://docs.google.com/spreadsheets/d/1WXp4jZQYbV7a8TG_Merpc6dQ-YuZbYxZC_In6ny5Qkg/edit#gid=0

    useEffect(() => {
        const fetchData = async () => { // нэйминг
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
                // можно убрать дублирование кода используя функцию
                const fetchGoogleSheetDataItem = async (item: ConvertResultType) => {
                    const {list, column, line, endColumn, endLine} = item;
                    const urlSuffix = endColumn && endLine ? `:${endColumn}${endLine}` : '';
                    const sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${props.sheetUrlId}/values/${list}!${column}${line}${urlSuffix}?key=${apiKey}`;

                    const response = await fetch(sheetURL);
                    const data = await response.json();

                    return data.values;
                };

                for (const item of props.arrayOfDocTemplate) {
                    const {endColumn, endLine} = item;

                    if (endColumn && endLine) {
                        secondDataArr.push(await fetchGoogleSheetDataItem(item));
                    } else {
                        firstDataArr.push(await fetchGoogleSheetDataItem(item));
                    }
                }

                // for (const item of props.arrayOfDocTemplate) {
                //     const {list, column, line, endColumn, endLine} = item;
                //     if (list && column && line && !endColumn && !endLine) { // здесь была ошибка
                //         let sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${props.sheetUrlId}/values/${list}!${column}${line}?key=${apiKey}`;
                //         const response = await fetch(sheetURL);
                //         const data = await response.json();
                //         firstDataArr.push(data.values);
                //     }
                // }
                //
                // for (const item of props.arrayOfDocTemplate) {
                //     const {list, column, line, endColumn, endLine} = item;
                //
                //     if (endColumn && endLine) {
                //         let sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${props.sheetUrlId}/values/${list}!${column}${line}:${endColumn}${endLine}?key=${apiKey}`;
                //         const response = await fetch(sheetURL);
                //         const data = await response.json();
                //         secondDataArr.push(data.values);
                //     }
                // }

                const flattenedData: SheetDataType[] = firstDataArr.reduce((acc: SheetDataType[], item: SheetDataType) => {
                    return acc.concat(item);
                }, []); // сглаживаем массив, так как приходит массив с массивами

                setFirstSheetData(flattenedData); // убрал slice(0, -2) так как первый цикл запроса был исправлен
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
        <>

            <div className="d-flex align-self-end m-5 flex-lg-row flex-md-row flex-sm-row flex-column">
                <ModalWindow show={showModalWindow}
                             handleShow={handleShow}
                             handleClose={handleClose}
                             content={<PreviewPage firstSheetData={firstSheetData} secondSheetData={secondSheetData}/>}
                />
                <NewDocument firstSheetData={firstSheetData} secondSheetData={secondSheetData}/>

            </div>
            <div>
                {errorImageUrl && <div>{errorImageUrl}</div>}
                {errorSheet && <div>{errorSheet}</div>}
            </div>
        </>
    );
});

export default GoogleSheetData;
