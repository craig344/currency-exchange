import React, { Component } from 'react';
import { Form, Input, Button, notification, Tabs } from 'antd';
import './index.css'
import history from 'history/browser';
import { Buffer } from 'buffer';
import { COOKIE, createCookie, getCookie } from '../../../services/cookie';
import * as CONSTANTS from '../../../routes/constants'

const { TabPane } = Tabs;

class Login extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      loading: false,
      activeKey: '1'
    };
  }

  componentDidMount() {
    if(getCookie(COOKIE.ACCESS_TOKEN)){
      window.location.assign('/home')
    }

    if (history.location.pathname === "/") {
      history.replace("/login");
    }
    let activeKey = history.location.pathname === '/login' ? '1' : '2'
    this.setState({ activeKey });
  }

  logIn = (values) => {
    this.setState({ loading: true });
    fetch(
      `${"https://homechallenge.volopa.com/auth/getCredentials"}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email.trim(),
          password: values.password,
        }),
      }
    ).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          notification.success({
            message: 'Success',
            description: 'Logged in Successfully'
          })
          responseJson.data && responseJson.data.credentials ?
            this.getToken(responseJson.data.credentials.clientId, responseJson.data.credentials.secret) :
            this.setState({ loading: false });
        } else {
          notification.error({
            message: 'Error',
            description: 'Login failed, Please check your credentials'
          })
          this.setState({ loading: false });
        }
      });
  };

  base64 = (string) => {
    return new Buffer(string).toString('base64')
  }

  getBasicToken = (user, pass) => {
    return this.base64([user, pass].join(':'));
  }

  getToken = (user, pass) => {
    let basicToken = this.getBasicToken(user, pass);
    fetch(
      `${"https://homechallenge.volopa.com/auth/getToken"}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Basic " + basicToken
        },
        body: JSON.stringify({
          grant_type: "client_credentials",
          scope_id: "2"
        }),
      }
    ).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson && responseJson.success === true){
          createCookie(COOKIE.ACCESS_TOKEN, responseJson.access_token, responseJson.expires_in);
          createCookie(COOKIE.REFRESH_TOKEN, responseJson.refresh_token, responseJson.expires_in);
          createCookie(COOKIE.CLIENT_ID, user, responseJson.expires_in)
          window.location.assign(CONSTANTS.URLS.Home);
        }else{
          notification.error({
            message: 'Error',
            description: 'Something went wrong'
          })
          this.setState({ loading: false });
        }
      });
  }

  createUser = (values) => {
    this.setState({ loading: true });
    fetch(
      `${"https://homechallenge.volopa.com/user"}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email.trim(),
          password: values.password,
        }),
      }
    ).then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.success) {
          notification.success({
            message: 'Success',
            description: 'User Created Successfully'
          })
        } else if (responseJson.data && responseJson.data.message) {
          notification.error({
            message: 'Error',
            description: responseJson.data.message
          })
        } else {
          notification.error({
            message: 'Error',
            description: 'Something went wrong'
          })
        }
        this.setState({ loading: false });
      });
  };

  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  activeKey = (key) => {
    if (key === '2') {
      history.replace('/create-user');
      this.setState({ activeKey: '2' })
    } else {
      history.replace('/login');
      this.setState({ activeKey: '1' })
    }
  }

  render() {
    return (
      <div className='login-section'>
        <Tabs activeKey={this.state.activeKey} onTabClick={this.activeKey}>
          <TabPane tab='Log in' key={1}>
            <h5 className='login-heading'>Please use this form to log into your account.</h5>
            <Form
              name="login"
              layout='vertical'
              onFinish={this.logIn}
              onFinishFailed={this.onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { type: 'email', message: 'Please input a valid email!' },
                  { required: true, message: 'Please input your email!' }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={this.state.loading}>
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab='Create User' key={2}>
            <h5 className='login-heading'>Please use this form to create an account.</h5>
            <Form
              name="create-user"
              layout='vertical'
              onFinish={this.createUser}
              onFinishFailed={this.onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { type: 'email', message: 'Please input a valid email!' },
                  { required: true, message: 'Please input your email!' }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[{
                  required: true, message: 'Please input your password!'
                },
                () => ({
                  validator(_, value) {
                    let lowerCaseLetters = /[a-z]/g;
                    let upperCaseLetters = /[A-Z]/g;
                    let numbers = /[0-9]/g;
                    if (!value) {
                      return Promise.resolve();
                    } // Specifications stated password with at least 8 characters but API only accepts passwords with at least 9 characters
                    if (value.length < 9 || !value.match(lowerCaseLetters) || !value.match(upperCaseLetters) || !value.match(numbers)) {
                      return Promise.reject(new Error('User password must be at least 9 characters long and contain at least 1 of each: upper case letter, lowercase letter and a number'));
                    }
                    return Promise.resolve();
                  }
                })
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                rules={[{
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    if (value.length < 8) {
                      console.log(value.length);
                    }
                    return Promise.reject(new Error('The two passwords that you entered do not match!'));
                  },
                })
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={this.state.loading}>
                  Create User
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Login;