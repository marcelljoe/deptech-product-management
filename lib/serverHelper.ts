import {compare, hash} from 'bcryptjs'
const saltOrRounds = 10
import dayjs from "dayjs"
export const intOrZ = (value: string): number => {
    return value ? parseInt(value) : 0;
  }

export async function verifyPwrd(password: string | undefined, hshPassword: string) {
    const isValid = await compare(password ? password : "", hshPassword)
    return isValid;
}

export const sortMenu = async (menu: any) => {
    let a = []
    let tempHeader = null
    let tempHeaderIndex = 0
    let tempLevel = 0
    let tempData = []
    let pushCount: any = null

    for (let index = 0; index < menu.length; index++) {
        const menu_header = menu[index].menu_header
        const level = parseInt(menu[index].level)
        const sub = menu[index].sub

        if (tempHeader != menu_header && tempHeader != sub) {
            tempHeader = menu_header
            tempLevel = level
            tempData = []
            tempHeaderIndex = pushCount == null ? 0 : pushCount + 1

            if (sub == 0) {
                a.push(menu[index])
                pushCount = pushCount == null ? 0 : pushCount + 1
            }
        }

        if (tempHeader == sub) {
            tempData.push(menu[index])
        }

        if (tempHeader != menu_header && tempHeader != null || index == menu.length - 1) {
            Object.assign(a[pushCount], {[`subMenu${tempLevel + 1}`]: tempData});
        }
    }

    return a
}

export const weekRange = (date: string) => {
    let currentDate = dayjs(date)
    let weekStart = currentDate.startOf("isoWeek").format('DD MMM YYYY');
    let weekEnd = currentDate.endOf("isoWeek").format('DD MMM YYYY');
    return weekStart + ' - ' + weekEnd
};

export const formatNumber = (number: number) => {
    if (number === undefined || number === null) {
        return null;
    } else {
        //   return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        let nf = new Intl.NumberFormat('en-US');
        return nf.format(number)
    }
};

export const hashPassword = async (string: string | undefined) => {
    const hashPassword = await hash(string ? string : "", saltOrRounds);
    return hashPassword
}

export const titleCase = (str: any) => {
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
