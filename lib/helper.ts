// import * as crypto from "crypto";
// import { getLoginSession } from '@/lib/auth';;
import { exeQuery } from "./db";
import { compare, hash } from "bcryptjs";
const saltOrRounds = 10;
import dayjs from "dayjs";

export async function verifyPwrd(
  password: string | undefined,
  hshPassword: string
) {
  const isValid = await compare(password ? password : "", hshPassword);
  return isValid;
}

export const sortMenu = async (menu: any) => {
  let a = [];
  let tempHeader = null;
  let tempHeaderIndex = 0;
  let tempLevel = 0;
  let tempData = [];
  let pushCount: any = null;

  for (let index = 0; index < menu.length; index++) {
    const menu_header = menu[index].menu_header;
    const level = parseInt(menu[index].level);
    const sub = menu[index].sub;

    if (tempHeader != menu_header && tempHeader != sub) {
      tempHeader = menu_header;
      tempLevel = level;
      tempData = [];
      tempHeaderIndex = pushCount == null ? 0 : pushCount + 1;

      if (sub == 0) {
        a.push(menu[index]);
        pushCount = pushCount == null ? 0 : pushCount + 1;
      }
    }

    if (tempHeader == sub) {
      tempData.push(menu[index]);
    }

    if (
      (tempHeader != menu_header && tempHeader != null) ||
      index == menu.length - 1
    ) {
      Object.assign(a[pushCount], { [`subMenu${tempLevel + 1}`]: tempData });
    }
  }

  return a;
};
