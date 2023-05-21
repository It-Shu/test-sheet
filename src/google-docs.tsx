import React, {FC, useEffect, useState} from 'react';
import PreviewPage from "./PreviewPage";
import Modal from "./modal/Modal";
import {useModal} from "./modal/hooks/useModal";
import {ConvertResultType} from "./Form";
import {Image, Col, Container, Row, Table} from "react-bootstrap";

type GoogleSheetDataTypes = {
    arrayOfDocTemplate: ConvertResultType[]
    sheetUrlId: string | null
}

export type MyData = Array<string | null>;

const GoogleSheetData: FC<GoogleSheetDataTypes> = (props) => {

    const [firstSheetData, setFirstSheetData] = useState<MyData[]>([])
    const [secondSheetData, setSecondSheetData] = useState<MyData[]>([])

    const apiKey = 'AIzaSyCFY3hmuLkD-Tzc-9MLCam0f3RzZ0r9l0E'; // Replace with your actual API key


    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://docs.google.com/spreadsheets/d/1WXp4jZQYbV7a8TG_Merpc6dQ-YuZbYxZC_In6ny5Qkg/edit#gid=256578302');
                const htmlString = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');
                let imgElements = doc.getElementsByTagName('img')[0].getAttribute('src');
                setImageUrl(imgElements);
            } catch (error) {
                console.error('Error fetching or parsing the HTML:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // const fetchGoogleSheetData = async () => {
        //     try {
        //         const dataArr: MyData[] = [];
        //         for (const item of props.arrayOfDocTemplate) {
        //             const {list, column, line, endColumn, endLine} = item;
        //             let sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${props.sheetUrlId}/values/${list}!${column}${line}`;
        //
        //             if (endColumn && endLine) {
        //                 sheetURL += `:${endColumn}${endLine}`;
        //             }
        //
        //             sheetURL += `?key=${apiKey}`;
        //
        //             // const sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/${props.sheetUrlId}/values/${sheetName}!${cellRange}?key=${apiKey}`;
        //             const response = await fetch(sheetURL);
        //             const data = await response.json();
        //             dataArr.push(data.values);
        //             setSheetData(dataArr.flat());
        //         }
        const fetchGoogleSheetData = async () => {
            try {
                const firstDataArr: MyData[] = [];
                const secondDataArr: MyData[] = [];

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

                const flattenedData: MyData[] = firstDataArr.reduce((acc: MyData[], item: MyData) => {
                    return acc.concat(item);
                }, []);

                setFirstSheetData(flattenedData.slice(0, -2));
                setSecondSheetData(secondDataArr);
            } catch (error) {
                console.error('Произошла ошибка:');
            }
        };
        fetchGoogleSheetData()

    }, []);

    // todo

    let nullIndex = firstSheetData.findIndex(item => item === undefined);

    // Заменяем undefined на img link
    if (imageUrl && nullIndex >= 0) {
        firstSheetData[nullIndex] = [imageUrl]
    }

    if (firstSheetData.length === 0 || secondSheetData.length === 0) {
        return <div>Loading...</div>
    }

    console.log('firstSheetData', firstSheetData)
    console.log('secondSheetData', secondSheetData)
    // todo

    return (
        <div>
            <PreviewPage firstSheetData={firstSheetData} secondSheetData={secondSheetData}/>
        </div>
    );
};

export default GoogleSheetData;
