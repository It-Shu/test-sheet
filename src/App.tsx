import React, {useEffect, useState} from 'react';
import './App.css';
import {SheetApi} from "./api/sheet-api";
import GoogleSheetTable from "./google-docs";

function App() {

    const [docsText, setDocsText] = useState('')
    const [objects, setObjects] = useState<string[]>([])
    const [sheetData, setSheetData] = useState([])
    const [isActive, setIsActive] = useState(false)

    const columnMap: { [key: string]: string } = {
        "1": "A",
        "2": "B",
        "3": "C",
        "4": "D",
        "5": "E",
        "6": "F",
        "7": "G",
        "8": "H",
        "9": "I",
        "10": "J",
    };

    useEffect(() => {
        SheetApi.getDocsData().then(res => setDocsText(res.data))
        const regex = /{([^{}]+)}/g;
        const matches = docsText.match(regex);

        if (matches !== null) {
            setObjects(matches.map((match) => {
                return match.substring(1, match.length - 1);
            }));
        }
        console.log(objects)

        // for (const result of objects) {
        //     const [list, column, line, endColumn, endLine] = result.split("-");
        //
        // }
        const resultArrays = objects.map(result => result.split("-"));

        const results = resultArrays.map(([list, column, line, endColumn, endLine]) => ({
            list,
            column: columnMap[column] || column,
            line,
            endColumn: columnMap[endColumn] || endColumn,
            endLine,
        }));
        console.log(results);
    }, [isActive])

    useEffect(() => {
        SheetApi.getSheetData().then(res => setSheetData(res.data))
    }, [isActive])

    // console.log(sheetData)

        return (
            <div className="App">
                <button onClick={() => setIsActive(!isActive)}>Get</button>
                <pre>{objects}</pre>
                <GoogleSheetTable/>
            </div>
        );
    }


export default App;
