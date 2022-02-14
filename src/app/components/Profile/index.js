import { Button, Col, Input, notification, Form, DatePicker, Row, Spin } from 'antd';
import moment from 'moment';
import react from 'react';
import React, { Component } from 'react';
import { fetchApi } from '../../../services/api';


class Profile extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            userData: undefined,
            disableUpdate: true,
            updateLoad: false,
            loading: true
        };
    }


    componentDidMount() {
        fetchApi('user', 'get').then((res) => {
            res && res.success && res.data && res.data.user && this.setState({ userData: res.data.user });
            this.formRef.current.setFieldsValue({
                first_name: res.data.user.first_name,
                last_name: res.data.user.last_name,
                dob: moment(res.data.user.dob, 'YYYY-MM-DD')
            });
            this.setState({ loading: false })
        });
    }

    updateProfile = (values) => {
        this.setState({ updateLoad: true })
        fetchApi('user', 'put', {
            firstName: values.first_name,
            lastName: values.last_name,
            dob: values.dob && values.dob.format('YYYY-MM-DD')
        }).then((res) => {
            if (res && res.success) {
                notification.success({
                    message: 'Success',
                    description: 'User details updated successfully'
                })
                this.setState({ userData: res.data.user, disableUpdate: true })
            }
            this.setState({ updateLoad: false });
        })
    }

    onFinishFailed = (error) => {
        console.log(error);
    }

    formChange = (change) => {
        if ((change[0].name[0] !== 'dob' && this.state.userData[change[0].name[0]] !== change[0].value) || (change[0].name[0] === 'dob' && this.state.userData[change[0].name[0]] !== change[0].value.format('YYYY-MM-DD'))) {
            this.setState({ disableUpdate: false })
        } else {
            this.setState({ disableUpdate: true })
        }
    }

    render() {
        return (
            <>
                <Spin size='large' spinning={this.state.loading}>
                    <Row>
                        <Col span={8} offset={8}>
                            <h3>Update Profile</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} offset={8}>
                            <Form
                                name="basic"
                                initialValues={{ remember: true }}
                                onFinish={this.updateProfile}
                                onFinishFailed={this.onFinishFailed}
                                onFieldsChange={this.formChange}
                                autoComplete="off"
                                ref={this.formRef}
                            >
                                <Form.Item
                                    label="First Name"
                                    name="first_name"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Last Name"
                                    name="last_name"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Date of Birth"
                                    name="dob"
                                >
                                    <DatePicker />
                                </Form.Item>

                                <Form.Item wrapperCol={{ offset: 12 }}>
                                    <Button type="primary" htmlType="submit" disabled={this.state.disableUpdate} loading={this.state.updateLoad}>
                                        Update
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Spin>
            </>
        )
    }
}

export default Profile;