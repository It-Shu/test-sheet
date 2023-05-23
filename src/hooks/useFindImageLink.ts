import { SheetDataType } from "../GoogleSheetData";
import { useMemo } from "react";

export const useFindImageLink = (sheetData: SheetDataType[]) => {

    const memoizedFindImageLink = useMemo(() => {
        const cache = new Map();

        return (data: SheetDataType[]): string => {
            const cacheKey = JSON.stringify(data);
            if (cache.has(cacheKey)) {
                return cache.get(cacheKey) || "";
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
                        cache.set(cacheKey, link);
                        return link;
                    }
                }
            }
            cache.set(cacheKey, "");
            return "";
        };
    }, [sheetData]);

    const imageLink = memoizedFindImageLink(sheetData);
    return { imageLink };
};
