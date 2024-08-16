import React, { useReducer, useEffect } from "react";
import Link from "next/link";
import Space from "antd/lib/space";
import Dropdown from "antd/lib/dropdown";
import Avatar from "antd/lib/avatar";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Layout from "antd/lib/layout";
import Menu from "antd/lib/menu";
import Image from "next/image";
import Logo from "../../public/img/logo.png";
import LogoCollapsed from "../../public/img/logo.png";
import CustomIcon from "../CustomIcon";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  DownOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import Styles from "../../styles/Test.module.css";
import useSWR from "swr";
import { useRouter } from "next/router";

const { Header, Sider, Content } = Layout;

const submenuKeys = ["/entstat", "/regstat"];

let initialState = {
  collapsed: true,
  isMobile: false,
  openKeys: [],
  menu: [],
  session: {
    name: "",
    email: "",
    role: "",
  },
};

const Anchor = ({ children }: any) => {
  // const { defaultAlgorithm, darkAlgorithm } = theme;
  // const [isDarkMode, setIsDarkMode] = useState(false);
  let router = useRouter();
  const [states, setStates] = useReducer(
    (state: any, newState: Partial<any>) => ({ ...state, ...newState }),
    initialState
  );
  const url = `/api/menu/list`;
  const { data, error } = useSWR(url);

  const items: MenuProps["items"] = [
    {
      key: 99,
      label: <Link href="/api/auth/logout">Logout</Link>,
    },
  ];

  const onOpenChange = (keys: any) => {
    const latestOpenKey = keys.find(
      (key: any) => states.openKeys.indexOf(key) === -1
    );
    if (submenuKeys.indexOf(latestOpenKey) === -1) {
      setStates({ openKeys: keys });
    } else {
      setStates({ openKeys: latestOpenKey ? [latestOpenKey] : [] });
    }
  };

  const toggle = () => {
    setStates({ collapsed: !states.collapsed });
  };

  useEffect(() => {
    const decData = async () => {
      setStates({
        menu: data.data,
        session: {
          name: data.session.firstname + ' ' + data.session.lastname,
          email: data.session.email,
        },
      });
    };

    if (data) {
      decData();
    }
  }, [data]);

  let currentPath: any = router.asPath;
  let activeKey = currentPath;

  useEffect(() => {
    window.innerWidth <= 600
      ? setStates({ collapsed: true, isMobile: true })
      : setStates({ collapsed: false, isMobile: false });
  }, []);

  let menuItems =
    states.menu?.length > 0
      ? states.menu.map((item: any, index: number) => {
          if (item.subMenu2 && item.subMenu2?.length > 0) {
            let submenus = item.subMenu2.map((item: any, index: number) => ({
              key: item.path,
              label: <Link href={item.path}>{item.menu}</Link>,
            }));
            return {
              label: item.menu,
              key: item.menu,
              icon: <CustomIcon type={item.icon} />,
              children: submenus,
            };
          }
          return {
            label: <Link href={item.path}>{item.menu}</Link>,
            icon: <CustomIcon type={item.icon} />,
            key: item.path,
          };
        })
      : [];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        className={"sider"}
        trigger={null}
        collapsible
        collapsed={states.collapsed}
      >
        <div className={"logoSider"}>
          <Image
            width={states.collapsed ? 50 : 80}
            height={states.collapsed ? 20 : 25}
            alt="Logo"
            src={states.collapsed ? LogoCollapsed : Logo}
          />
        </div>
        <Menu
          className={"sidebar"}
          mode="inline"
          defaultSelectedKeys={["0"]}
          openKeys={states.openKeys}
          onOpenChange={onOpenChange}
          selectedKeys={activeKey}
          items={menuItems}
        />
      </Sider>
      <Layout className={Styles.siteLayout}>
        <Header
          //   className={Styles.siteLayoutBackground}
          className="ant-menu-submenu"
          style={{
            background: "transparent",
            paddingLeft: 0,
            paddingRight: 20,
            // color: "red",
            boxShadow: "0px 0px 0px #00000005",
            // border: "none",
            // borderColor: " rgba(0, 0, 0, 0.04)",
          }}
        >
          <Row justify="space-between">
            <Space size={0}>
              {React.createElement(
                states.collapsed
                  ? (MenuUnfoldOutlined as any)
                  : (MenuFoldOutlined as any),
                {
                  className: `${Styles.trigger}`,
                  //   className: "sidebar ant-menu",
                  onClick: toggle,
                }
              )}
              {!states.isMobile || (states.isMobile && states.collapsed) ? (
                <h5 className="font-brand" style={{ marginLeft: "-3px" }}>
                  <b>Product Management</b>
                </h5>
              ) : null}
            </Space>
            <Space>
              <Space></Space>
              <Row align="middle">
                <Dropdown menu={{ items }}>
                  <a
                    style={{ marginTop: -5, marginRight: "10px" }}
                    className={"flexCenter"}
                    onClick={(e) => e.preventDefault()}
                  >
                    <Avatar
                      size={32}
                      style={{
                        color: "grey",
                        backgroundColor: "transparent",
                        fontSize: "22px",
                      }}
                      icon={<UserOutlined style={{ fontSize: "22px" }} />}
                    />
                    <Col style={{ marginLeft: 10, marginRight: 15 }}>
                      <h5
                        style={{
                          color: "black",
                          fontWeight: "normal",
                          lineHeight: "normal",
                          marginBottom: 0,
                        }}
                      >
                        {states.session.name}
                      </h5>
                      <h5
                        className={"link"}
                        style={{
                          lineHeight: "normal",
                          fontWeight: "normal",
                          marginBottom: 0,
                        }}
                      >
                        {states.session.email}
                      </h5>
                    </Col>
                    <DownOutlined style={{ color: "grey", fontSize: "12px" }} />
                  </a>
                </Dropdown>
              </Row>
            </Space>
          </Row>
        </Header>
        <Content className={"content"}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default React.memo(Anchor);
