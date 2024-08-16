import React, { useReducer, useEffect } from "react";

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
import { modalState } from "../../../interfaces/user.interface"
import dayjs from "dayjs";

let initialState = {
    isLoading: true,
    oldId: "",
    role: [],
    form: {
        username: "",
        firstname: "",
        lastname: "",
        email: "",
        birthdate: "",
        gender: "",
        password: "",
        id: undefined
    }
};

const range = (start: any, end: any) => {
    const result = [];
    for (let i = start; i < end; i++) {
      result.push(i);
    }
    return result;
  };
  
  export const disabledDateTime = () => {
    return {
      disabledHours: () => range(0, 24).splice(4, 20),
      disabledMinutes: () => range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  };

const Modals = (props: any) => {
    const [states, setStates] = useReducer((state: modalState, newState: Partial<modalState>) => ({ ...state, ...newState }), initialState);

    const close = () => {
        props.handleOpenModal({ name: "openModal", value: false });
        setStates(initialState)
    };

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

    const handleChangeDate = async (data: any) => {
        if (data.value !== "Invalid Date") {
          await setStates({
            form: {
                ...states.form,
                [data.name]: data.value,    
            }
          });
        } else {
          await setStates({
            form: {
                ...states.form,
                [data.name]: "",    
            }
          });
        }
      };

    const handleChangeSelect = (value: string, option: any) => {
        const name = option.name
        setStates({
            form: {
                ...states.form,
                [name]: value
            }
        });
    };

    const submit = () => {
        const { form, oldId } = states
        if(form.firstname == "" || form.lastname == "" || form.username == "" || form.password == "" || form.email == "" || form.gender == "" || form.birthdate == "") {
            Notifications('error', "Fill all data.", '')
        } else {
            props.submit({ ...form, id: oldId })
            setStates(initialState)    
        }
    }

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
            className={"modal"}
            onCancel={close}
            centered
            footer={
                <Space size={0}>

                    <Button
                        onClick={submit}
                        style={{ borderBottomLeftRadius: 8 }}

                    >
                        Submit
                    </Button>
                    <Button
                        onClick={close}
                        style={{ backgroundColor: "#252733", borderBottomRightRadius: 8 }}

                    >Cancel</Button>
                </Space>
            }
            open={props.open}
        >
            <Form className={"form"} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Username">
                            <Input
                                name="username"
                                type="text"
                                value={states.form.username}
                                onChange={handleChange}
                                placeholder="Username"
                                className={"input"}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Password">
                            <Input.Password
                                name="password"
                                placeholder="Password"
                                value={states.form.password}
                                className={"input"}
                                onChange={handleChange}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="First Name">
                            <Input
                                name="firstname"
                                value={states.form.firstname}
                                onChange={handleChange}
                                placeholder="Name"
                                className={"input"}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Last Name">
                            <Input
                                name="lastname"
                                value={states.form.lastname}
                                onChange={handleChange}
                                placeholder="Name"
                                className={"input"}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="E-mail">
                            <Input
                                name="email"
                                value={states.form.email}
                                onChange={handleChange}
                                placeholder="Name"
                                className={"input"}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Birthdate">
                            <DatePicker
                                // showToday={false}
                                className={"input"}
                                allowClear={false}
                                disabledTime={disabledDateTime}
                                format="DD-MM-YYYY"
                                style={{ width: "100%" }}
                                name="birthdate"
                                onChange={(date) =>
                                    handleChangeDate({
                                        name: "birthdate",
                                        value: date,
                                    })
                                }
                                defaultValue={
                                    states.form.birthdate === ""
                                        ? undefined
                                        : dayjs(states.form.birthdate)
                                }
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                    <Form.Item label="Gender" name="gender" initialValue={states.form.gender}>
                            <Select
                                tabIndex={1}
                                className={"select"}
                                filterOption={(input, option: any) =>
                                    option?.props.label
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                                id="gender"
                                value={states.form.gender}
                                placeholder="- Select -"
                                options={[
                                    {key: 1, name: 'gender', value: 'M', label: 'Male'},
                                    {key: 2, name: 'gender', value: 'F', label: 'Female'},
                                ]}
                                showSearch
                                onChange={handleChangeSelect}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

// export default Modals;
export default React.memo(Modals);