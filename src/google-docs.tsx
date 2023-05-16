import React, { useEffect, useState } from 'react';
import { read, utils } from 'xlsx';

const GoogleSheetData: React.FC = () => {
    const [sheetData, setSheetData] = useState<any[][] | null>(null);
    const apiKey = 'AIzaSyCFY3hmuLkD-Tzc-9MLCam0f3RzZ0r9l0E'; // Replace with your actual API key

    useEffect(() => {
        const fetchGoogleSheetData = async () => {
            try {
                const sheetURL = `https://sheets.googleapis.com/v4/spreadsheets/1WXp4jZQYbV7a8TG_Merpc6dQ-YuZbYxZC_In6ny5Qkg/values/Результат?key=${apiKey}`;
                const response = await fetch(sheetURL);
                const data = await response.json();
                setSheetData(data.values);
            } catch (error) {
                console.error('Произошла ошибка:');
            }
        };

        fetchGoogleSheetData();
    }, [apiKey]); // Add apiKey as a dependency to useEffect

    if (!sheetData) {
        return <div>Загрузка данных...</div>;
    }

    return (
        <div>
            <h1>Данные таблицы:</h1>
            <table>
                <thead>
                <tr>
                    {sheetData[0].map((header: string, index: number) => (
                        <th key={index}>{header}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {sheetData.slice(1).map((row: any[], index: number) => (
                    <tr key={index}>
                        {row.map((cell: any, cellIndex: number) => (
                            <td key={cellIndex}>{cell}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default GoogleSheetData;


// import React, { useEffect, useState } from 'react';
// import {read, utils} from "xlsx";
//
// const GoogleSheetTable = () => {
//
//     const [sheetData, setSheetData] = useState<any>([]);
//     const [isActive, setIsActive] = useState(false)
//     const [sheetNames, setSheetNames] = useState<string[]>([])
//
//     useEffect(() => {
//         // const fetchSheetData = async () => {
//         //     try {
//         //         debugger
//         //         const sheetURL = 'https://docs.google.com/spreadsheets/d/1WXp4jZQYbV7a8TG_Merpc6dQ-YuZbYxZC_In6ny5Qkg/edit#gid=0'; // Замените на фактический URL таблицы Google Sheets
//         //         const response = await fetch(sheetURL);
//         //         const data = await response.arrayBuffer();
//         //         const workbook = read(data, { type: 'array' });
//         //         const sheetData = workbook.Sheets['Результат'];
//         //
//         //         // Преобразование данных листа в формат массива объектов
//         //         const jsonData = utils.sheet_to_json(sheetData, { header: 1 });
//         //         setSheetData(jsonData);
//         //     } catch (error) {
//         //         console.error('Произошла ошибка при загрузке данных:');
//         //     }
//         // };
//         //
//         // fetchSheetData();
//         const fetchGoogleSheetData = async () => {
//             try {
//                 // debugger
//                 const sheetURL = 'https://docs.google.com/spreadsheets/d/1WXp4jZQYbV7a8TG_Merpc6dQ-YuZbYxZC_In6ny5Qkg/edit#gid=0'; // Замените на фактический URL таблицы Google Sheets
//                 const response = await fetch(sheetURL);
//                 const data = await response.arrayBuffer();
//                 const workbook = read(data, { type: 'array' });
//
//                 // Получаем метаданные таблицы
//                 const spreadsheetId = '1WXp4jZQYbV7a8TG_Merpc6dQ-YuZbYxZC_In6ny5Qkg'; // Замените на фактический ID таблицы
//                 const metadataURL = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets(properties(title))`;
//                 const metadataResponse = await fetch(metadataURL);
//                 const metadata = await metadataResponse.json();
//
//                 // Извлекаем фактические пользовательские названия листов
//                 const sheetNames = metadata.sheets.map((sheet:any) => sheet.properties.title);
//
//                 console.log('Названия страниц:', sheetNames);
//
//                 // Ваш код для работы с данными на других страницах
//                 // Например:
//                 const sheetName = 'Название_Листа'; // Замените на фактическое название листа
//                 const worksheet = workbook.Sheets[sheetName];
//                 const jsonData = utils.sheet_to_json(worksheet, { header: 1 });
//                 console.log(`Данные из листа "${sheetName}":`, jsonData);
//
//             } catch (error) {
//                 console.error('Произошла ошибка:');
//             }
//         };
//
//         fetchGoogleSheetData();
//     }, [isActive]);
//     console.log(sheetData)
//
//     return (
//         <div>
//             <h1>Данные таблицы:</h1>
//             <button onClick={() => setIsActive(!isActive)}>Get SheetJS Data</button>
//         </div>
//     );
// };
//
// export default GoogleSheetTable;
