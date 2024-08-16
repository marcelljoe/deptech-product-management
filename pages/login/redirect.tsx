import { getLoginSession } from '@/lib/auth';
import { NextApiRequest } from 'next';
import { GetServerSideProps } from 'next'
// import { getMenu } from "../api/menu/list";

const Redirect = () => {
    return (<></>)
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getLoginSession(ctx.req as NextApiRequest)

    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }

    interface IMenu {
        menu_header: number
        menu: string
        path: string
        level: number
        sub: number
        icon: string | null
        m_insert: number
        m_delete: number
        m_update: number
        m_view: number
        m_approve: number
      }

      const menus  = [
        {
          menu_header: 19,
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
          menu_header: 20,
          menu: 'User',
          path: '/settings/users',
          level: 2,
          sub: 19,
          icon: '',
          m_insert: 1,
          m_update: 1,
          m_delete: 1,
          m_approve: 1,
          m_view: 1
        },
  ]

    var path = ""

    for (let index = 0; index < menus.length; index++) {
        const nextSub = menus[index + 1] ? menus[index + 1].sub : ""
        if (menus[index].sub == 0 && nextSub == 0) {
            path = `${menus[index].path}`
            break
        }

        if (menus[index].sub == 0 && menus[index + 1].sub == menus[index].menu_header) {
            path = `${menus[index + 1].path}`
            break
        }
    }
    
    return {
        redirect: {
            destination: path,
            permanent: false
        }
    }
}

export default Redirect;