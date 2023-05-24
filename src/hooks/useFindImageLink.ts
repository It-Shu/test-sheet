import { SheetDataType } from "../GoogleSheetData";
import { useMemo } from "react";

export const useFindImageLink = (sheetData: SheetDataType[]) => {
    const memoizedFindImageLink = useMemo(() => {
        let lastFoundLink = "";

        return (data: SheetDataType[]): string => {
            if (lastFoundLink !== "") {
                return lastFoundLink;
            }

            for (const row of data) {
                if (
                    Array.isArray(row) &&
                    row.some(
                        (cell) => typeof cell === "string" && cell.startsWith("http")
                    )
                ) {
                    const link = row.find(
                        (cell) => typeof cell === "string" && cell.startsWith("http")
                    );
                    if (link) {
                        lastFoundLink = link;
                        return link;
                    }
                }
            }

            return "";
        };
    }, []);

    const imageLink = memoizedFindImageLink(sheetData);
    return { imageLink };
};

