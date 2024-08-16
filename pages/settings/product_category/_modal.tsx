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
import DatePicker from "antd/lib/date-picker";
import Notifications from "@/components/Notifications";
import { modalState } from "../../../interfaces/product_cat.interface"
import dayjs from "dayjs";

let initialState = {
  isLoading: true,
  oldId: "",
  role: [],
  form: {
      name: "",
      description: "",
      id: undefined
  }
};

const Modals = (props: any) => {
  const [states, setStates] = useReducer((state: modalState, newState: Partial<modalState>) => ({ ...state, ...newState }), initialState);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault()
    const { name, value } = e.currentTarget
    setStates({
        form: {
            ...states.form,
            [name]: value
        }
    })
};

const submit = () => {
  const { form, oldId } = states
  if(form.description == "" || form.name == "") {
      Notifications('error', "Fill all data.", '')
  } else {
      props.submit({ ...form, id: oldId })
      setStates(initialState)    
  }
}

const close = () => {
  props.handleOpenModal({ name: "openModal", value: false });
  setStates(initialState)
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

  return (
    <Modal
      destroyOnClose
      title={props.header}
      centered
      className={"modal"}
      open={props.open}
      onCancel={close}
      footer={null}
    >
      <Row>
        <Col span={24}>
          <Form layout="vertical">
            <Row>
              <Col span={24}>
                <Form.Item label="Category Name">
                  <Input
                    name="name"
                    value={states.form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="Category Description">
                  <Input
                    name="description"
                    value={states.form.description}
                    onChange={handleChange}
                    placeholder="123412345"
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      <Space size={0}>
        <Button
          className="button"
          shape="round"
          style={{ marginRight: "10px" }}
          onClick={submit}
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