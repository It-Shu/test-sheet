import React, {useEffect, useState} from 'react';
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
import {SheetDataType} from './GoogleSheetData';
import {saveAs} from 'file-saver';
import {Button} from "react-bootstrap";
import {SheetApi} from "./api/sheet-api";
import {useDocNumberFinder} from "./hooks/useDocNumberFinder";
import {useFindImageLink} from "./hooks/useFindImageLink";

type NewDocumentProps = {
    firstSheetData: SheetDataType[];
    secondSheetData: SheetDataType[];
};

const NewDocument: React.FC<NewDocumentProps> = React.memo((props) => {
    const [imageData, setImageData] = useState<Uint8Array | undefined>(undefined);

    const {imageLink} = useFindImageLink(props.firstSheetData)
    const {documentNumber} = useDocNumberFinder(props.firstSheetData)

    useEffect(() => {
        const getImage = async () => {
            if (imageLink) {
                try {
                    const response = await SheetApi.getImageLink(imageLink);
                    const imageArrayBuffer = new Uint8Array(response.data);
                    setImageData(imageArrayBuffer);
                } catch (error) {
                    console.error('Failed to load image:', error);
                }
            }
        };

        getImage();

    }, [imageLink]);



    const generateChildren = (): (Paragraph | Table)[] => {
        const children: (Paragraph | Table)[] = [];

        if (documentNumber) {
            const numberParagraph = new Paragraph({
                children: [new TextRun({text: 'Номер документа: ', bold: true}), new TextRun({
                    text: documentNumber,
                    bold: true
                })],
            });
            children.push(numberParagraph);
        }

        for (const row of props.firstSheetData) {
            if (Array.isArray(row)) {
                const data = row.filter((cell) => typeof cell === 'string' && !cell.startsWith('http') && cell !== documentNumber);
                if (data.length > 0) {
                    const paragraph = new Paragraph({
                        text: data.join(', '),
                    });
                    children.push(paragraph);
                }
            }
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

        children.push(
            new Paragraph({
                text: 'Первая таблица',
                heading: HeadingLevel.HEADING_1,
                spacing: {before: 200, after: 200},
            })
        );

        const firstTable = generateTable(props.secondSheetData[0]);
        children.push(firstTable);

        children.push(
            new Paragraph({
                text: 'Вторая таблица',
                heading: HeadingLevel.HEADING_1,
                spacing: {before: 200, after: 200},
            })
        );

        const secondTable = generateTable(props.secondSheetData[1]);
        children.push(secondTable);

        return children;
    };
    const generateTable = (data: SheetDataType): Table => {
        const rows = data
            .map((row) => {
                if (Array.isArray(row)) {
                    const cells = row.map((cell: string | null) => {
                        const cellText = cell ? cell : '';
                        return new TableCell({
                            children: [new Paragraph({text: cellText})],
                            columnSpan: 1,
                            rowSpan: 1,
                        });
                    });

                    return new TableRow({
                        children: cells,
                    });
                }

                return null;
            })
            .filter(Boolean) as TableRow[];

        return new Table({
            rows,
        });
    };

    const handleExport = () => {
        if (imageData) {
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
        }
    };


    return (
        <div>
            <Button variant="light" onClick={handleExport} className="mb-2">
                Загрузить файл
            </Button>
        </div>
    );
});

export default NewDocument;
