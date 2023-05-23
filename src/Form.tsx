import React, {useCallback, useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Form as RBForm, Button} from 'react-bootstrap';
import {SheetApi} from "./api/sheet-api";
import Modal from "./modal/Modal";
import {useModal} from "./modal/hooks/useModal";
import GoogleSheetData from "./google-docs"

type FormType = {
    // sheetLink: string
}

export type ConvertResultType = {
    list: string,
    column: string,
    line: string,
    endColumn: string | undefined,
    endLine: string | undefined
}

const Form: React.FC<FormType> = (props) => {

    const [sheetLink, setSheetLink] = useState('');
    const [docLink, setDocLink] = useState('');

    const [objects, setObjects] = useState<string[]>([])

    const [docUrlID, setDocUrlID] = useState<string | null>('')
    const [sheetUrlID, setSheetUrlID] = useState<string | null>('')

    const [convertResult, setConvertResult] = useState<ConvertResultType[]>([])
    const {modalActive, handleClose, handleActive} = useModal(false);


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
        const fetchData = async () => {
            try {
                const response = await SheetApi.getDocsData(`https://docs.google.com/document/d/${docUrlID}/export?format=txt`);
                const regex = /{([^{}]+)}/g;
                const matches = response.data.match(regex);

                if (matches !== null) {
                    setObjects(matches.map((match: string) => match.substring(1, match.length - 1)));
                }
            } catch (error) {
                console.error('Error occurred while fetching data:', error);
            }
        };

        if (docUrlID) {
            fetchData();
        }

    }, [docUrlID]) // todo нужно добавить валидацию для инпутов для проверки ссылки на sheet и docs


    useEffect(() => {
        const resultArrays = objects.map(result => result.split("-"));


        const result = resultArrays.map(([list, column, line, endColumn, endLine]) => ({
            list,
            column: columnMap[column] || column,
            line,
            endColumn: columnMap[endColumn] || endColumn,
            endLine,
        }));

        setConvertResult(result)
    }, [objects])

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

    const handlePreviewClick = () => {
        handleActive()
    };

    const handleDownloadClick = useCallback(() => {
        handleActive()
    }, [docLink, sheetLink]);

    return (
        <div>
            <RBForm>
                <RBForm.Group>
                    <RBForm.Label>Ссылка на Google Sheets:</RBForm.Label>
                    <RBForm.Control type="text" value={sheetLink} onChange={handleSheetLinkChange}/>
                </RBForm.Group>
                <RBForm.Group>
                    <RBForm.Label>Ссылка на Google Docs:</RBForm.Label>
                    <RBForm.Control type="text" value={docLink} onChange={handleDocLinkChange}/>
                </RBForm.Group>
            </RBForm>
            <div className="d-flex justify-content-end mt-4 m-5">
                <Button variant="light" onClick={handlePreviewClick}>
                    Предварительный просмотр
                </Button>

                {convertResult.length === 0 && <Button variant="light" onClick={handleDownloadClick}>
                    Заполните поля
                </Button>}

                {convertResult.length > 0 && sheetUrlID &&
                <GoogleSheetData handleDownloadClick={handleDownloadClick} sheetUrlId={sheetUrlID}
                                 arrayOfDocTemplate={convertResult}/>}
            </div>
        </div>
    );
};

export default Form;
