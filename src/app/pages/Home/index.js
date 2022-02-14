import React, { Component } from 'react';
import './index.css'
import { Tabs, Button } from 'antd';
import Dashboard from '../../components/Dashboard';
import { COOKIE, deleteCookie } from '../../../services/cookie';
import Exchange from '../../components/Exchange';
import Profile from '../../components/Profile';
const { TabPane } = Tabs;


class Home extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      loading: false,
      activeKey: '1',
      title: undefined
    };
  }


  componentDidMount() {
    let activeKey;
    switch (window.location.pathname) {
      case '/currency-exchange':
        activeKey = '2'
        break
      case '/profile':
        activeKey = '3'
        break
      default:
        activeKey = '1'
    }
    this.setState({ activeKey });
  }

  logOut = () => {
    deleteCookie(COOKIE.ACCESS_TOKEN);
    deleteCookie(COOKIE.REFRESH_TOKEN);
    window.location.assign("/");
  }

  activeKey = (key) => {
    switch (key) {
      case '1':
        window.location.assign('/home');
        break
      case '2':
        window.location.assign('/currency-exchange');
        break
      case '3':
        window.location.assign('/profile');
        break
      default:
        window.location.assign('/home');
    }
  }

  render() {
    const operations = <Button type='primary' onClick={this.logOut}>Log Out</Button>;
    return (
      <div className='body-section'>
        <h1>Currency Exchange App</h1>
        <Tabs activeKey={this.state.activeKey} onTabClick={this.activeKey} tabBarExtraContent={operations}>
          <TabPane tab="Home" key="1">
            <Dashboard />
          </TabPane>
          <TabPane tab="Currency Exchange" key="2">
            <Exchange />
          </TabPane>
          <TabPane tab="Profile" key="3">
            <Profile />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

export default Home;