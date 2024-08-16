const XLSX = require('xlsx')

export function titleCase(str: any) {
    if(/[A-Z]/.test(str)) {
        let strg = str.replace(/([A-Z])/g, " $1")
        let splitStr = strg.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        return splitStr.join(' ');
    } else {
        let strg = str.replace(/_/g, ' ')
        let splitStr = strg.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        return splitStr.join(' ');
    }
}

export const loadExcel = (file: string) => {
    return new Promise((resolve, reject) => {
        var wb = XLSX.readFile(file);
        const data: any = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
        let jsonData: any = []
        for (let index = 0; index < data.length; index++) {
            let obj: any = {}
            for (let index2 = 0; index2 < data[index].length; index2++) {
                obj[data[0][index2].replace(/\s/g, '')] = data[index][index2]
            }
            if (index > 0) {
                jsonData.push(obj)
            }
        }
        resolve(jsonData)
    })
}