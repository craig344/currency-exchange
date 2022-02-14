import { Card, Col, Empty, Row, Skeleton, Spin } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Meta from 'antd/lib/card/Meta';
import React, { Component } from 'react';
import { fetchApi } from '../../../services/api';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      userData: undefined,
      currencies: undefined,
      loading: true
    };
  }


  componentDidMount() {
    Promise.all([
      fetchApi('user', 'get'),
      fetchApi('currencies', 'get')
    ]).then((res) => {
      res[0] && res[0].success && res[0].data && res[0].data.user && this.setState({ userData: res[0].data.user });
      res[1] && res[1].success && res[1].data && res[1].data.currencies && this.setState({ currencies: res[1].data.currencies })
      this.setState({loading: false})
    });
  }

  render() {
    return (
      <>
      <Spin size='large' spinning={this.state.loading}>
        <Row>
          <Col>
            <h3>{this.state.userData && this.state.userData.first_name ?
              'Hello ' + this.state.userData.first_name + '.' :
              'You should set your name in the Profile section.'} Your account balances are as per bellow:</h3>
          </Col>
        </Row>
        <Row>
          {this.state.currencies && this.state.userData.balances ? this.state.userData.balances.map((val, i) => {
            let currency = this.state.currencies.find((currency) => currency.id === val.currency_id)
            let flag = currency.code.toLowerCase()
            return(
            <Col xxl={3} lg={4} md={6} sm={8} xs={12} key={i}>
              <Card>
                <Meta
                  avatar={<Avatar src={'/flags/' + flag + '.png'} />}
                  title={currency.code}
                  description={val.amount.toFixed(2)}
                />
              </Card>
            </Col>
          )}) : (
            <Col span={24}>
              <Empty />
            </Col>
          )
        }
        </Row>
        </Spin>
      </>
    )
  }
}

export default Dashboard;