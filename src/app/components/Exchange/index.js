import { Button, Typography, Col, Input, InputNumber, notification, Row, Select, Spin, Steps, Alert } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import Meta from 'antd/lib/card/Meta';
import Form from 'antd/lib/form/Form';
import React, { Component } from 'react';
import { fetchApi } from '../../../services/api';
const { Step } = Steps;
const { Option } = Select;
const { Text } = Typography;


class Exchange extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            userData: undefined,
            currencies: undefined,
            fromCurrency: undefined,
            toCurrency: undefined,
            exchangeRate: undefined,
            exchangeLoad: false,
            sell: undefined,
            buy: undefined,
            exchanging: false,
            fromText: undefined,
            available: undefined,
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
            this.setState({ loading: false });
        });
    }

    updateFromCurrency = (id, currencies) => {
        let fromCurrency = currencies.find((currency) => currency.id === id);
        let available = (this.state.userData.balances.find((val) => val.currency_id === id))
        available = available && available.amount
        let fromText = available && (<><br /><Text type='primary' className='smaller-text'>{"Available Balance: " + available}</Text></>)
        this.updateFields(undefined, 'sell');
        this.setState({ fromCurrency, available, fromText, },
            () => this.state.toCurrency && this.state.fromCurrency && this.getExchangeRate(this.state.fromCurrency.code, this.state.toCurrency.code));
    }

    updateToCurrency = (id, currencies) => {
        let toCurrency = currencies.find((currency) => currency.id === id);
        this.updateFields(undefined, 'buy');
        this.setState({ toCurrency },
            () => this.state.fromCurrency && this.state.toCurrency && this.getExchangeRate(this.state.fromCurrency.code, this.state.toCurrency.code));
    }

    getExchangeRate = (from, to) => {
        this.setState({ exchangeLoad: true })
        fetchApi('currencies/rate?buyCcy=' + to + '&sellCcy=' + from, 'get').then((res) => {
            if (res && res.success) {
                this.setState({ exchangeRate: res.data.currentRate.rate })
            }
            this.setState({
                exchangeLoad: false,
                buy: undefined,
                sell: undefined
            })
        })
    }

    updateFields = (val, field) => {
        if (val) {
            console.log(val, this.state.available);
            field === 'sell' && val <= this.state.available ? this.setState({ sell: val }) : this.setState({ sell: this.state.sell ? this.state.sell : null });
            if (this.state.exchangeRate) {
                if (field === 'sell') {
                    let buy = val * this.state.exchangeRate
                    this.setState({ buy });
                } else {
                    let sell = val / this.state.exchangeRate
                    val <= this.state.available && this.setState({ sell, buy: val });
                }
            } else {
                field === 'buy' && this.setState({ buy: val });
            }
        } else {
            this.setState({ sell: undefined, buy: undefined });
        }
    }

    exchange = () => {
        this.setState({ exchanging: true });
        fetchApi('currencies/exchange', 'post', {
            buyCcy: this.state.toCurrency.code,
            sellCcy: this.state.fromCurrency.code,
            amount: this.state.sell
        }).then((res) => {
            if (res && res.success) {
                window.location.assign('/home');
            } else {
                notification.error({
                    message: 'Error',
                    description: 'Something went wrong'
                })
                this.setState({ exchanging: false });
            }
        })
    }

    render() {
        if (this.state.userData && this.state.userData.balances && this.state.currencies) {
            var sellCurrencies = this.state.userData.balances.map((val) => (this.state.currencies.find((currency) => currency.id === val.currency_id)))
            if (this.state.toCurrency) sellCurrencies = sellCurrencies.filter((val) => this.state.toCurrency.id !== val.id)
            if (sellCurrencies.length === 0 && this.state.fromCurrency) this.setState({ fromCurrency: undefined, exchangeRate: undefined });

            var buyCurrencies = this.state.currencies;
            if (this.state.fromCurrency) buyCurrencies = buyCurrencies.filter((val) => val.id !== this.state.fromCurrency.id)
            if (buyCurrencies.length === 0 && this.state.toCurrency) this.setState({ toCurrency: undefined, exchangeRate: undefined });
        }
        let fromCurrency = (
            <>
                {this.state.fromCurrency && <img src={'/flags/' + this.state.fromCurrency.code.toLowerCase() + '.png'} alt={this.state.fromCurrency.code} className='exchange-flag' />}
                <Select
                    loading={this.state.loading}
                    allowClear
                    placeholder="Currency"
                    optionFilterProp="children"
                    filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                    onChange={(id) => this.updateFromCurrency(id, this.state.currencies)}
                    value={this.state.fromCurrency && this.state.fromCurrency.id}
                >
                    {
                        sellCurrencies && sellCurrencies.map((val, key) => (
                            <Option value={val.id} key={key}>{val.code}</Option>
                        ))
                    }
                </Select>
            </>
        )
        let from = (
            <>
                <Text type='secondary' className='smaller-text'>I NEED TO EXCHANGE</Text><br />
                <InputNumber controls={false} addonAfter={fromCurrency} onChange={(val) => this.updateFields(val, 'sell')} value={this.state.sell} disabled={!this.state.fromCurrency} />
                {this.state.fromText}
            </>
        )

        let toCurrency = (
            <>
                {this.state.toCurrency && <img src={'/flags/' + this.state.toCurrency.code.toLowerCase() + '.png'} alt={this.state.toCurrency.code} className='exchange-flag' />}
                <Select
                    loading={this.state.loading}
                    allowClear
                    placeholder="Currency"
                    optionFilterProp="children"
                    filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                    onChange={(id) => this.updateToCurrency(id, this.state.currencies)}
                >
                    {
                        buyCurrencies &&
                        buyCurrencies.map((val, key) => {
                            return (
                                <Option value={val.id} key={key}>{val.code}</Option>
                            )
                        })
                    }
                </Select>
            </>
        )
        let to = (
            <>
                <Text type='secondary' className='smaller-text'>TO</Text><br />
                <InputNumber controls={false} addonAfter={toCurrency} onChange={(val) => this.updateFields(val, 'buy')} value={this.state.buy} disabled={!this.state.toCurrency} />
            </>
        )
        let exchange = (
            <>
                <span className='exchange-rate'><span>Current Exchange Rate: </span><Spin size="small" spinning={this.state.exchangeLoad} /> {this.state.exchangeRate ? this.state.exchangeRate : '-'}</span>
            </>
        );
        return (
            <>
                <Row>
                    <Col span={8} offset={8}>
                        <h3>Currency Exchange</h3>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={8}>
                        <Steps progressDot current={3} direction="vertical">
                            <Step description={from} />
                            <Step title={exchange} />
                            <Step description={to} />
                        </Steps>
                    </Col>
                </Row>
                <Row>
                    <Col span={8} offset={8}>
                        <Button type='primary' onClick={this.exchange} disabled={!(this.state.buy && this.state.sell)} loading={this.state.exchanging}>Exchange</Button>
                    </Col>
                </Row>
            </>
        )
    }
}

export default Exchange;