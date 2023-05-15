import axios from "axios";


export const SheetApi = {
    getDocsData () {
        // return axios.get('https://sheet.best/api/sheets/7f4e83d2-b430-44f7-a931-cb3c0eb3a966')
       return axios.get(
            "https://docs.google.com/document/d/1TKZFwNdDg-X-DPJiYXjtLC46JkgRjdAI/export?format=txt"
        );
    },
    getSheetData () {
        return axios.get('')
    }
}
