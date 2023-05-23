import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form as RBForm, Button} from 'react-bootstrap';
import {SheetApi} from "./api/sheet-api";
import GoogleSheetData from "./GoogleSheetData"

export type ConvertResultType = {
    list: string,
    column: string,
    line: string,
    endColumn: string | null,
    endLine: string | null
}

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

const Form: React.FC = React.memo(() => {

    const [sheetLink, setSheetLink] = useState('');
    const [docLink, setDocLink] = useState('');

    const [arrayOfTemplateVariables, setArrayOfTemplateVariables] = useState<string[]>([])

    const [docUrlID, setDocUrlID] = useState<string | null>('')
    const [sheetUrlID, setSheetUrlID] = useState<string | null>('')

    const [finalTemplateArr, setFinalTemplateArr] = useState<ConvertResultType[]>([])
    const [errorDoc, setErrorDoc] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await SheetApi.getDocsData(`https://docs.google.com/document/d/${docUrlID}/export?format=txt`);
                const regex = /{([^{}]+)}/g;
                const matches = response.data.match(regex);

                if (matches !== null) {
                    setArrayOfTemplateVariables(matches.map((match: string) => match.substring(1, match.length - 1)));
                }
            } catch (error) {
                setErrorDoc('Ошибка обработки документа')
            }
        };

        if (docUrlID) {
            fetchData();
        }

    }, [docUrlID])

    useEffect(() => {

        const arraysOfTemplates = arrayOfTemplateVariables.map(result => result.split("-"));

        const result = arraysOfTemplates.map(([list, column, line, endColumn, endLine]) => ({
            list,
            column: columnMap[column] || column,
            line,
            endColumn: columnMap[endColumn] || endColumn,
            endLine,
        }));

        setFinalTemplateArr(result)

    }, [arrayOfTemplateVariables])

    useEffect(() => {

        const extractIdFromLink = (link: string, regex: RegExp) => {
            const matches = link.match(regex);
            return matches ? matches[1] : null;
        };
        const getConvertUrl = (docLink: string, sheetLink: string) => {
            if (docLink) {
                const docRegex = /\/document\/d\/([A-Za-z0-9_-]+)/;
                const docUrlID = extractIdFromLink(docLink, docRegex);
                setDocUrlID(docUrlID);
            }
            if (sheetLink) {
                const sheetRegex = /\/spreadsheets\/d\/([A-Za-z0-9_-]+)/;
                const sheetUrlID = extractIdFromLink(sheetLink, sheetRegex);
                setSheetUrlID(sheetUrlID);
            }
        }
        if (docLink && sheetLink) {
            getConvertUrl(docLink, sheetLink)
        }
    }, [docLink, sheetLink])

    const handleSheetLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSheetLink(event.target.value);
    };

    const handleDocLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDocLink(event.target.value);
    };


    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            <RBForm className="w-75">
                <RBForm.Group className="d-flex flex-column align-items-center">
                    <RBForm.Label className="text-center">Ссылка на Google Sheets:</RBForm.Label>
                    <RBForm.Control type="text" value={sheetLink} onChange={handleSheetLinkChange}/>
                </RBForm.Group>
                <RBForm.Group className="d-flex flex-column align-items-center">
                    <RBForm.Label className="text-center">Ссылка на Google Docs:</RBForm.Label>
                    <RBForm.Control type="text" value={docLink} onChange={handleDocLinkChange}/>
                </RBForm.Group>
            </RBForm>
            {!arrayOfTemplateVariables && errorDoc}
            <div className="d-flex align-self-end m-5 flex-lg-row flex-md-row flex-sm-row flex-column">
                {finalTemplateArr.length === 0 && <div>
                    <Button variant="light" className="me-sm-3 me-md-3 me-lg-3 mb-2">
                        Предварительный просмотр
                    </Button>
                    <Button variant="light" className="mb-2">
                        Заполните поля
                    </Button>
                </div>}
                {finalTemplateArr.length > 0 && sheetUrlID &&
                <GoogleSheetData sheetLink={sheetLink} sheetUrlId={sheetUrlID} arrayOfDocTemplate={finalTemplateArr}/>}
            </div>
        </div>
    );
});

export default Form;
