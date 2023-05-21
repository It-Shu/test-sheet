import axios from "axios";


export const SheetApi = {
    getDocsData (url: string) {
       return axios.get(url);
    },
    getSheetData (url: string) {
        return axios.get(url);
    }
}
