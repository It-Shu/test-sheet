import {SheetDataType} from "../Components/GoogleSheetData";
import {useEffect, useState} from "react";

export const useDocNumberFinder = (sheetData: SheetDataType[]) => {

    const [documentNumber, setDocumentNumber] = useState<string>("");
    useEffect(() => {
        const numberRow = sheetData.find((row) => {
            return row.some((cell) => typeof cell === "string" && !isNaN(Number(cell)));
        });

        if (numberRow) {
            const number = numberRow.find((cell) => typeof cell === "string" && !isNaN(Number(cell)));
            if (number) {
                setDocumentNumber(number.toString());
            }
        }
    }, [sheetData])

    return {documentNumber}
}
