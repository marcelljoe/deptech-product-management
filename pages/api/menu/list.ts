import * as model from "./_model";
import cors from "../../../lib/cors";
import type { NextApiRequest, NextApiResponse } from 'next'
import { getLoginSession } from "../../../lib/auth";
import { sortMenu } from "../../../lib/helper"
import protectAPI from "../../../lib/protectApi";
import { IInsert } from "../../../interfaces/menu.interface";


const menuData = [
  {
    menu_header: 1,
    menu: 'Admin',
    path: '/settings',
    level: 1,
    sub: 0,
    icon: 'SettingOutlined',
    m_insert: 1,
    m_update: 1,
    m_delete: 1,
    m_approve: 1,
    m_view: 1
  },
  {
    menu_header: 2,
    menu: 'User',
    path: '/settings/users',
    level: 2,
    sub: 1,
    icon: '',
    m_insert: 1,
    m_update: 1,
    m_delete: 1,
    m_approve: 1,
    m_view: 1
  },
  {
    menu_header: 3,
    menu: 'Product',
    path: '/settings/product',
    level: 2,
    sub: 1,
    icon: '',
    m_insert: 1,
    m_update: 1,
    m_delete: 1,
    m_approve: 1,
    m_view: 1
  },
  {
    menu_header: 4,
    menu: 'Product Category',
    path: '/settings/product_category',
    level: 2,
    sub: 1,
    icon: '',
    m_insert: 1,
    m_update: 1,
    m_delete: 1,
    m_approve: 1,
    m_view: 1
  },
  {
    menu_header: 5,
    menu: 'Transactions',
    path: '/transactions',
    level: 1,
    sub: 0,
    icon: 'InboxOutlined',
    m_insert: 1,
    m_update: 1,
    m_delete: 1,
    m_approve: 1,
    m_view: 1
  },
  {
    menu_header: 6,
    menu: 'Stock In',
    path: '/transactions/in',
    level: 2,
    sub: 5,
    icon: '',
    m_insert: 1,
    m_update: 1,
    m_delete: 1,
    m_approve: 1,
    m_view: 1
  },
  {
    menu_header: 7,
    menu: 'Stock Out',
    path: '/transactions/out',
    level: 2,
    sub: 5,
    icon: '',
    m_insert: 1,
    m_update: 1,
    m_delete: 1,
    m_approve: 1,
    m_view: 1
  },
]


export async function getMenu(param: any) {
  return menuData
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await cors(req, res);

    const session: any = await getLoginSession(req)
    if (!session) {
      return res.status(401).json({ message: "Unauthorized!" })
    }

    if (req.method !== 'GET') {
      return res.status(403).json({ message: "Forbidden!" })
    }

    const { type } = req.query

    if (type == '2') {
      return res.json(menuData)
    }

    if (!type) {
      const result = await sortMenu(menuData)
      return res.send({ data: result, session: session })
    }
  } catch (err: any) {
    res.status(500).json({ message: err.message })
  }
}

export default protectAPI(handler);