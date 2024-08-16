import React, { useEffect, useReducer } from "react";
// import { modalState } from "../../../interfaces/product_cat.interface"
import Modal from "antd/lib/modal";
import Button from "antd/lib/button";
import Form from "antd/lib/form";
import Col from "antd/lib/col";
import Input from "antd/lib/input";
import Row from "antd/lib/row";
import Select from "antd/lib/select";
import Space from "antd/lib/space";
import Notifications from "@/components/Notifications";
import { modalState } from "../../../interfaces/transactions.interface"
import { Table } from "antd";

let initialState = {
  isLoading: true,
  oldId: "",
  role: [],
  maxQ: 0,
  form: {
    description: '',
    product_id: "",
    label: "",
    quantity: 0
  },
  dataTable: []
} as unknown as modalState

const Modals = (props: any) => {
  const [states, setStates] = useReducer((state: modalState, newState: Partial<modalState>) => ({ ...state, ...newState }), initialState);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    const { name, value } = e.currentTarget
    if(name == 'quantity') {
      if(Number(value) <= Number(states.maxQ)) {
        setStates({
          form: {
            ...states.form,
            quantity: value
          }
        })
      } else {
        setStates({
          form: {
            ...states.form,
            quantity: states.maxQ
          }
        })
      }
    } else {
      setStates({
        form: {
          ...states.form,
          [name]: value
        }
      })  
    }
  };

  const handleChangeSelect = (value: string, option: any) => {
    const name = option.name

    const {dataTable}= states
    let exist = dataTable.find(x => x.product_id == value)

    let finalMax = exist?.quantity ? option.quantity - Number(exist?.quantity) : option.quantity
    setStates({
      form: {
        ...states.form,
        [name]: value,
        label: option.label,
        quantity: finalMax
      },
      maxQ: finalMax
    });
  };

  const submit = () => {
    const { form, oldId, dataTable } = states
    let datas = {
      description: form.description,
      dataTable
    }
    if (form.description == "" || dataTable.length < 1) {
      Notifications('error', "Fill all data.", '')
    } else {
      props.submit({ ...datas })
      setStates(initialState)
    }
  }

  const add2Row = async () => {
    const { form, dataTable, maxQ } = states
    if(Number(form.quantity) > 0) {
    let data = dataTable
    let maxVal = Number(maxQ) - Number(form.quantity)
    data.push({ key: data.length + 1, product_id: form.product_id, label: form.label, quantity: form.quantity, description: form.description })

    setStates({
      dataTable: data,
      form: {
        ...states.form,
        quantity: maxVal
      },
      maxQ: maxVal
    })
    console.log(states.form)
  }
  }

  const close = () => {
    props.handleOpenModal({ name: "openModal", value: false });
    setStates(initialState)
  };

  const handleProduct = async (data: any) => {
    let { dataTable } = states;
    dataTable.splice(data.data.key - 1, 1);
    setStates({
      dataTable,
    });
  };

  useEffect(() => {
    const { data } = props

    if (data && Object.keys(data).length != 0) {
      setStates({
        oldId: data.id,
        form: {
          ...states.form,
          ...data
        }
      })
    }
  }, [props.data])

  useEffect(() => {
    const { dataTable } = props
    if (dataTable) {
      setStates({
        dataTable: props.dataTable
      })
    }
  }, [props.dataTable])

  useEffect(() => {
    const { master } = props
    if (master) {
      setStates({
        master: props.master
      })
    }
  }, [props.master])

  return (
    <Modal
      destroyOnClose
      title={props.header}
      width={800}
      centered
      className={"modal"}
      open={props.open}
      onCancel={close}
      footer={null}
    >
      <Row>
        <Col span={24}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="Transaction Description (Stock Out)">
                  <Input
                    className="input"
                    name="description"
                    value={states.form.description}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </Form.Item>
              </Col>
              {states.oldId ? null : (
                <>
                  <Col span={11}>
                    <Form.Item label="Product" name="product_id" initialValue={states.form.product_id}>
                      <Select
                        value={states.form.product_id}
                        onChange={handleChangeSelect}
                        options={states.master?.products}
                        placeholder="Choose an option"
                        className={"select"}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item label="Quantity">
                      <Input
                        tabIndex={20}
                        id="qtyRef"
                        name="quantity"
                        value={states.form.quantity}
                        max={states.maxQ}
                        min={0}
                        type="number"
                        onChange={handleChange}
                        placeholder="0"
                        className={"input"}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item label="Action">
                      <Button
                        // className="button"
                        shape="round"
                        style={{ marginRight: "10px" }}
                        onClick={add2Row}
                      >
                        Add
                      </Button>
                    </Form.Item>
                  </Col>
                </>
              )}
              <Col span={24}>
                <Table
                  size="middle"
                  pagination={false}
                  dataSource={[...states.dataTable]}
                >
                  <Table.Column title="Product" dataIndex="label" key="label" />
                  <Table.Column
                    title="Quantity"
                    dataIndex="quantity"
                    key="quantity"
                    align="right"
                  />
                  {states.oldId ? null : (
                    <Table.Column
                    title="Action"
                    key="action"
                    render={(text, record) => (
                      <Button.Group>
                        <Button
                          onClick={() => handleProduct({ data: record })}
                        >
                          Delete
                        </Button>
                      </Button.Group>
                    )}
                  />
                  )}
                </Table>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      {states.oldId ? null : (
      <Space size={0}>
        <Button
          className="button"
          shape="round"
          style={{ marginRight: "10px" }}
          onClick={submit}
          disabled={states.dataTable.length < 1 ? true : false}
        >
          Save
        </Button>
        <Button
          onClick={close}
          className="buttondel"
          shape="round"
        // style={{ backgroundColor: "#252733", borderBottomRightRadius: 8 }}
        >
          Cancel
        </Button>
      </Space>
      )}
      {/* <Row justify="center">
                <Col>
                    <Button onClick={close}>Cancel</Button>
                </Col>
                <Col>
                    <Button onClick={() => handleSubmit({
                        id: states.id,
                        fullname: states.fullname,
                        sender: states.sender,
                        id_number: states.id_number
                    })}>Save</Button>
                </Col>
            </Row> */}
    </Modal>
  );
}

Modals.displayName = "theModal";
export default React.memo(Modals);