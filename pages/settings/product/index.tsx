import React, { useEffect, useReducer, Suspense, useCallback } from "react";
import useSWR, { SWRConfig } from "swr";
import dynamic from "next/dynamic";
import type { ReactElement } from "react";
import { getLoginSession } from "@/lib/auth";
import SearchBar from "../../../components/SearchBar";
import DashboardLayout from "../../../components/layouts/Dashboard";
import { IState } from "../../../interfaces/product_cat.interface";
import Card from "antd/lib/card";
import { PageHeader } from '@ant-design/pro-layout'
import Table from "antd/lib/table";
import Button from "antd/lib/button";
import ButtonGroup from "antd/lib/button/button-group";
import { useApp } from "../../../context/AppContext";
import Input from "antd/lib/input";
import Notifications from "../../../components/Notifications";
import { GetServerSideProps, NextApiRequest } from "next";
import { useRouter } from "next/router";
import { showDeleteConfirm } from "@/components/modals/ModalAlert";
import { TableRenderer } from "@/components/TableRenderer";
import axios from "axios";

const { Search } = Input;

const Modals = dynamic(() => import("./_modal"), {
  loading: () => <p>Loading...</p>,
});
const Products = (props: any, { fallback }: any) => {
  const router = useRouter();
  const { statesContex, setSubmitNotif } = useApp();
  const [states, setStates] = useReducer(
    (state: IState, newState: Partial<IState>) => ({ ...state, ...newState }),
    props
  );

  let url = `http://localhost:5007/api/product/list?row=${states.data.dataPerPage}&page=${states.data.currentPage}&key=${states.filter.key}&column=${states.filter.columns}&direction=${states.filter.directions}`
  const { data: fetchedData, mutate, error } = useSWR(url)
  let data = fetchedData?.data

  const handleOpenModal = (param: any) => {
    setStates({
      [param.name]: param.value,
      typeModal: param.typeModal,
      dataModal: param.dataModal ? param.dataModal : {}
    });
  };

  const handleSearch = useCallback(
    (data: any) => {
      setStates({
        filter: data,
        data: {
          ...states.data,
          currentPage: 1,
        },
      });
    },
    [states.filter, states.data]
  );

  // const handleFilter = (data: any) => {
  //   setStates({
  //     filter: data,
  //     isLoading: true,
  //   });
  // };

  const addNewData = async (param: any) => {
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
  };

  const modifyData = async (param: any) => {
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
  };

  const deleteData = async (param: any) => {
    let response = await deleteThis(param)
    if (response.status !== 200) {
      alert(response.error);
    } else {
      mutate()
      Notifications("success", "Data successfully Deleted.", "");
    }
  };

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
        directions: sorter.order,
      },
    });
  };

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

  useEffect(() => {
    const { type, message, description } = statesContex.submitNotif;
    Notifications(type, message, description);
    setSubmitNotif({ type: "", message: "", description: "" });
  }, []);

  const dataSource = states?.data.list;
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

  useEffect(() => {
    let columns: any = TableRenderer(states.master.table);
    columns.push({
      title: "Action",
      align: "center",
      widht: "10%",
      render: (text: any, record: any) => (
        <ButtonGroup>
          <Button
            style={{
              border: "1px rgb(45, 149, 236) solid",
              marginRight: "10px",
              color: "rgb(45, 149, 236)",
              borderRadius: "10px",
            }}
            className={"buttondel2"}
            // className={"link button2"}
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
          </Button>
          <Button
            className={"buttondel3"}
            style={{
              border: "1px red solid",
              color: "red",
              borderRadius: "10px",
              // border: "1px red solid",
            }}
            // className="buttontable"
            onClick={() =>
              showDeleteConfirm({ onOk: () => deleteData(record) })
            }
          >
            Delete
          </Button>
        </ButtonGroup>
      )
    })
    setStates({
      columns: columns,
    });
  }, []);

  return (
    <>
      <SWRConfig value={{ fallback }}>
        <PageHeader
          title="Products"
          extra={[
            <Button
              key="1"
              onClick={() =>
                handleOpenModal({
                  name: "openModal",
                  value: true,
                  typeModal: "Add",
                })
              }
              className={"button"}
              shape="round"
            >
              Add
            </Button>
          ]}
        />
        <Card
          className="custom-card"
          title="List of Products"
          extra={
            <SearchBar handleFilter={handleSearch} filter={states.filter} />

            // <Search
            //   name="key"
            //   placeholder="input search text"
            //   // value={states.data.key}
            //   // onSearch={onSearch}
            //   // onChange={handleChange}
            // />
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
              pageSize: states.data.dataPerPage as number,
            }}
            onChange={handleTableChange}
          />
        </Card>
        <Modals
          data={states.dataModal}
          open={states.openModal}
          header={states.typeModal == "Add" ? "Add Product" : "Update Product"}
          handleOpenModal={handleOpenModal}
          submit={states.typeModal == "Add" ? addNewData : modifyData}
          master={states.master}
        />
      </SWRConfig>
    </>
  );
};

const saveThis = async (data: any) => {
  let res: any = await axios.post(`http://localhost:5007/api/product/saveProduct`, {
    name: data.name,
    description: data.description,
    picture: data.picture,
    category_id: data.category_id
  });
  return res
};

const updateThis = async (data: any) => {
  let res: any = await axios.put(`http://localhost:5007/api/product/edit`, {
    name: data.name,
    description: data.description,
    picture: data.picture,
    category_id: data.category_id,
    id: data.id
  });
  return res
};

const deleteThis = async (data: any) => {
  let res: any = await axios.delete(`http://localhost:5007/api/product/deleted/${data.id}`);
  return res
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getLoginSession(ctx.req as NextApiRequest);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  interface RgPagination {
    row: string | number;
    page: string | number;
    key: string;
    direction: string;
    column: string;
    limit: number | string;
  }

  const params: RgPagination = {
    row: 10,
    page: 0,
    key: "",
    direction: "",
    column: "",
    limit: "",
  };

  const getList: any = await axios.get(`http://localhost:5007/api/product/list?key=${params.key}&page=${params.page}&row=${params.row}&column=${params.column}&direction=${params.direction}`, {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(res => res.data.data)

  const masterCategories: any = await axios.get(`http://localhost:5007/api/product_category/master`, {
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
    key: "",
  };

  return {
    props: {
      fallback: {
        "/api/product/list": JSON.parse(JSON.stringify(data)),
      },
      data: JSON.parse(JSON.stringify(data)),
      master: {
        table: JSON.parse(JSON.stringify(getList.tabling)),
        categories: JSON.parse(JSON.stringify(masterCategories))
      },
      isLoading: false,
      openModal: false,
      typeModal: "",
      dataModal: {},
      filter: {
        key: "",
        directions: "",
        columns: "",
      },
    },
  };
};

export default Products;

Products.getLayout = function getLayout(page: ReactElement) {
  return <DashboardLayout>{page}</DashboardLayout>;
};
