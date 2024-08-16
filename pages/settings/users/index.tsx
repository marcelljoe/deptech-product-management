import React, { useEffect, useReducer } from "react";
import type { ReactElement } from 'react'
import { getLoginSession } from '@/lib/auth';;
import useSWR, { SWRConfig } from "swr";
import dynamic from "next/dynamic";
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router';
import { NextApiRequest } from "next";
import { Card, Table, Button, Space, Input } from "antd";
import DashboardLayout from "../../../components/layouts/Dashboard";
import { PageHeader } from '@ant-design/pro-layout'
import { useApp } from "../../../context/AppContext";
import { IState } from "../../../interfaces/user.interface";
import Notifications from "../../../components/Notifications";
import { showDeleteConfirm } from "../../../components/modals/ModalAlert";
import axios from "axios";
import { TableRenderer } from "@/components/TableRenderer";
const Modals = dynamic(() => import('./_modal'), { loading: () => <p></p> })
const { Search } = Input

const Users = (props: any, { fallback }: any) => {
    const [states, setStates] = useReducer((state: IState, newState: Partial<IState>) => ({ ...state, ...newState }), props)
    const router = useRouter();
    const { statesContex, setSubmitNotif } = useApp();

    const url = `http://localhost:5007/api/users/list?page=${states.data.currentPage}&row=${states.data.dataPerPage}&column=${states.filter.columns}&direction=${states.filter.directions}`
    const { data: fetchedData, mutate, error } = useSWR(url)
    let data = fetchedData?.data

    const handleOpenModal = (param: any) => {
        setStates({
            [param.name]: param.value,
            typeModal: param.typeModal,
            dataModal: param.dataModal ? param.dataModal : {}
        });
    }

    const deleteUser = async (param: any) => {
        let response = await deleteThis(param)
        if (response.status !== 200) {
            alert(response.error);
          } else {
            mutate()
            Notifications("success", "Data successfully Deleted.", "");
          }
    }

    const submitUpdate = async (param: any) => {
        let response = await updateThis(param)
        if (response.status !== 200) {
            setStates({
              isLoading: false,
            });
            alert(response.error);
          } else {
            setStates({
                isLoading: false,
                openModal: false,
              });
            mutate()
            Notifications("success", "Data successfully Updated.", "");
          }
    }

    const submit = async (param: any) => {
        let response = await saveThis(param)
        if (response.status !== 200) {
            setStates({
              isLoading: false,
            });
            alert(response.error);
          } else {
            setStates({
                isLoading: false,
                openModal: false,
              });
            mutate()
            Notifications("success", "Data successfully Entried.", "");
          }
    }

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        setStates({
            data: {
                ...states.data,
                dataPerPage: pagination.pageSize,
                currentPage: pagination.current,
            },
            filter: {
                ...states.filter,
                columns: sorter.field,
                directions: sorter.order
            }
        })
    };

    // const handleChange = (e) => {
    //     setStates({
    //         data: {
    //             ...states.data,
    //             [e.target.name]: e.target.value
    //         },
    //         isLoading: true
    //     });
    // };

    useEffect(() => {
        const { type, message, description } = statesContex.submitNotif
        Notifications(type, message, description)
        setSubmitNotif({ type: "", message: "", description: "" })
    }, [])

    useEffect(() => {
        let columns: any = TableRenderer(states.master.table);

        columns.push({
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (text: any, record: any) => (
                <>
                    <Space size="middle">
                        <a className={"link"} style={{ margin: '0 1em 1em 0' }}
                            onClick={() =>
                                handleOpenModal({
                                    name: "openModal",
                                    value: true,
                                    typeModal: "Update",
                                    dataModal: record
                                })
                            }
                        >
                            Edit
                        </a>
                        <a className={"link"} style={{ margin: '0 1em 1em 0' }}
                            onClick={() => showDeleteConfirm({ onOk: (() => deleteUser(record)) })}
                        >
                            Delete
                        </a>
                    </Space>
                </>
            )
        })

        setStates({
            columns: columns
        })
    }, [])

    useEffect(() => {
        if (data) {
            setStates({
                isLoading: false,
                data: {
                    ...states.data,
                    dataPerPage: data.dataPerPage,
                    currentPage: data.currentPage,
                    totalData: data.totalData,
                    totalPage: data.totalPage,
                    list: data.data,
                    key: states.data.key ? states.data.key : ""
                }
            })
        }
    }, [data])

    const dataSource = states?.data.list
    // const page = Number(states.data.currentPage)
    // const rowsPerPage = states.data.dataPerPage.toString()

    dataSource.forEach((i: any, index: number) => {
        i.key = index;
        i.no =
      states.data.currentPage === 1
        ? Number(index + 1)
        : states.data.currentPage === 2
        ? Number(states.data.dataPerPage) + (index + 1)
        : (Number(states.data.currentPage) - 1) *
            Number(states.data.dataPerPage) +
          (index + 1);
    });

    if (error) {
        return <p>Failed to load</p>
    }

    if (!data && !states.data) {
        setStates({ isLoading: true })
    }

    return (
        <>
            <SWRConfig value={{ fallback }}>
                <PageHeader
                    title="User Management"
                    extra={[
                        <Button key="1"
                            onClick={() =>
                                handleOpenModal({
                                    name: "openModal",
                                    value: true,
                                    typeModal: "Add",
                                })
                            }
                            className={'button'}
                            shape="round"
                        >
                            Add User
                        </Button>
                    ]}
                />
                <Card
                    className="custom-card"
                    title="List User"
                    extra={<Search
                        name="key"
                        placeholder="input search text"
                    // value={states.data.key}
                    // onSearch={onSearch}
                    // onChange={handleChange}
                    />
                    }
                >
                    <Table
                        loading={states.isLoading}
                        dataSource={dataSource}
                        columns={states.columns}
                        size="middle"
                        pagination={{
                            current: states.data.currentPage as number,
                            total: states.data.totalData as number,
                            pageSize: states.data.dataPerPage as number
                        }}
                        onChange={handleTableChange}
                    />
                </Card>
                <Modals
                    open={states.openModal}
                    header={states.typeModal == "Add" ? "Add User" : "Update User"}
                    handleOpenModal={handleOpenModal}
                    submit={states.typeModal == "Add" ? submit : submitUpdate}
                    data={states.dataModal}
                />
            </SWRConfig>
        </>
    )
}

const saveThis = async (data: any) => {
    let res: any = await axios.post(`http://localhost:5007/api/users/saveUser`, {
        username: data.username,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
        gender: data.gender,
        birthdate: data.birthdate,
        email: data.email
    });
    return res
};

const updateThis = async (data: any) => {
    let res: any = await axios.put(`http://localhost:5007/api/users/edit`, {
        username: data.username,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
        gender: data.gender,
        birthdate: data.birthdate,
        email: data.email,
        id: data.id
    });
    return res
};

const deleteThis = async (data: any) => {
    let res: any = await axios.delete(`http://localhost:5007/api/users/deleted/${data.id}`);
    return res
};

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

    interface IPagination {
        row: string | number
        page: string | number
        key: string
        direction: string
        column: string
        limit: number | string
    }

    const params: IPagination = {
        row: 10,
        page: 0,
        key: "",
        direction: "",
        column: "",
        limit: ""
    }

    const getList: any = await axios.get(`http://localhost:5007/api/users/list?key=${params.key}&page=${params.page}&row=${params.row}&column=${params.column}&direction=${params.direction}`, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data.data)

    const data = {
        dataPerPage: getList.dataPerPage,
        currentPage: getList.currentPage,
        totalData: getList.totalData,
        totalPage: getList.totalPage,
        list: getList.data,
        key: ""
    }

    return {
        props: {
            fallback: {
                '/api/users/list': JSON.parse(JSON.stringify(data))
            },
            data: JSON.parse(JSON.stringify(data)),
            master: {
                table: JSON.parse(JSON.stringify(getList.tabling)),
            },
            isLoading: false,
            openModal: false,
            typeModal: "",
            dataModal: {},
            filter: {
                key: "",
                directions: "",
                columns: ""
            }
        }
    }
}

export default Users;

Users.getLayout = function getLayout(page: ReactElement) {
    return (
        <DashboardLayout>{page}</DashboardLayout>
    )
}