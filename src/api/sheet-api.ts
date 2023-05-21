import axios from "axios";


export const SheetApi = {
    getDocsData (url: string) {
        // return axios.get('https://sheet.best/api/sheets/7f4e83d2-b430-44f7-a931-cb3c0eb3a966')
       return axios.get(
           url
        );
    },
    getSheetData () {
        return axios.get('https://sheet.best/api/sheets/dd881c59-7957-41f6-be73-d932f8fd8007')
    }
}
