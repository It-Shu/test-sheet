import React, { useEffect, useState } from 'react';
import {
    Document,
    HeadingLevel,
    ImageRun,
    Packer,
    Paragraph,
    Table,
    TableCell,
    TableRow,
    TextRun,
} from 'docx';
import { MyData } from './google-docs';
import { saveAs } from 'file-saver';
import axios from 'axios';

type NewDocumentProps = {
    firstSheetData: MyData[];
    secondSheetData: MyData[];
};

const NewDocument: React.FC<NewDocumentProps> = (props) => {
    const [imageData, setImageData] = useState<Uint8Array | undefined>(undefined);

    useEffect(() => {
        const getImage = async () => {
            const imageLink = findImageLink(props.firstSheetData);
            if (imageLink) {
                try {
                    const response = await axios.get(imageLink, { responseType: 'arraybuffer' });
                    const imageArrayBuffer = new Uint8Array(response.data);
                    setImageData(imageArrayBuffer);
                } catch (error) {
                    console.error('Failed to load image:', error);
                }
            }
        };

        getImage();
    }, [props.firstSheetData]);

    const findImageLink = (data: MyData[]): string | undefined => {
        for (const row of data) {
            if (Array.isArray(row)) {
                for (const cell of row) {
                    if (typeof cell === 'string' && cell.startsWith('http')) {
                        return cell;
                    }
                }
            }
        }
        return undefined;
    };

    const generateTable = (data: MyData): Table => {
        const rows = data.map((row) => {
            if (Array.isArray(row)) {
                const cells = row.map((cell: string | null) => {
                    const cellText = cell ? cell : '';
                    return new TableCell({
                        children: [new Paragraph({ text: cellText })],
                        columnSpan: 1,
                        rowSpan: 1,
                    });
                });

                return new TableRow({
                    children: cells,
                });
            }

            return null;
        }).filter(Boolean) as TableRow[];

        return new Table({
            rows,
        });
    };

    const generateChildren = (): (Paragraph | Table)[] => {
        const children: (Paragraph | Table)[] = [];

        const numberIndex = props.firstSheetData.findIndex((row) => row.includes('1411'));
    // todo 1411 может измениться на любое другое число , нужно вставлять только то что в данных
        if (numberIndex !== -1) {
            const numberParagraph = new Paragraph({
                children: [
                    new TextRun({ text: 'Номер документа: ', bold: true }),
                    new TextRun({ text: '1411', bold: true }),
                ],
            });
            children.push(numberParagraph);
        }

        if (imageData) {
            const imageParagraph = new Paragraph({
                children: [
                    new ImageRun({
                        data: imageData,
                        transformation: {
                            width: 300,
                            height: 40,
                        },
                    }),
                ],
            });
            children.push(imageParagraph);
        }

        const filteredData = props.firstSheetData.filter((row) => {
            return !row.includes('1411') && !row.some((cell) => typeof cell === 'string' && cell.startsWith('http'));
        });
        console.log('filteredData',filteredData.flat())
        // todo filteredData может измениться на любое другое значение , нужно вставлять только то что в данных


        children.push(
            new Paragraph({
                text: 'Первая таблица',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 200 },
            })
        );

        const firstTable = generateTable(props.secondSheetData[0]);
        children.push(firstTable);

        children.push(
            new Paragraph({
                text: 'Вторая таблица',
                heading: HeadingLevel.HEADING_1,
                spacing: { before: 200, after: 200 },
            })
        );

        const secondTable = generateTable(props.secondSheetData[1]);
        children.push(secondTable);

        return children;
    };




    const handleExport = () => {
        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: generateChildren(),
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, 'NewDocument.docx');
        });
    };

    return (
        <div>
            <button onClick={handleExport}>Export DOCX</button>
        </div>
    );
};

export default NewDocument;
