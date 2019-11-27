import React from 'react'
import axios from 'axios'

import {
    Modal, Form, Input, Button, Layout, Icon, notification
} from 'antd'

const moment = require('moment-timezone')

/* 
    props
    0) visible
    1) onCancel
    2) onSuccess
    3) onFailed
*/

const { Header } = Layout;

const LoginForm = Form.create({name: 'login'}) (

    class extends React.Component {
        render () {
            const {getFieldDecorator} = this.props.form;
            return (
                <div>
                    <Modal visible={this.props.visible} footer={null} onCancel={this.props.onCancel}>
                        <Layout style={{ background: '#fff' }}>
                            <Header style={{ background: '#fff', padding: 0 }} align="center">
                                <h1> Email verification </h1>
                            </Header>
                            <Form onSubmit = {this.props.onSubmit} className="login-form">
                                <Form.Item>
                                    {getFieldDecorator('email_verification_code', {
                                        rules: [{ required: true, message: 'Please input your verification code!' }],
                                    })(
                                        <Input prefix={<Icon type="check" style={{ color: 'rgba(0, 0, 0, .25)' }} />} placeholder="Verification code" />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" style={{backgroundColor: "green"} } htmlType="submit" className="login-form-button" block>
                                        Check
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Layout>
                    </Modal>
                </div>
            )
        }
    }
);

class EmailModal extends React.Component {

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    handleCancel = (e) => {
        this.props.onCancel()
        this.formRef.props.form.resetFields();
    }

    callApi = async () => {
        const res = await axios.post('/vote/verification/', {
            "email": "omnipede@naver.com",
            "start_time": (moment().tz('Asia/Seoul').unix() + 600) * 1000 ,
            "end_time": (moment().tz('Asia/Seoul').unix() + 600) * 1000
        });

        if (res.status !== 200) {
            notification.open({
                message: '인증코드 전송 실패!',
                description: '서버 관리자에게 문의하세요!',
                icon: <Icon type="exclamation" style={{ color: 'red' }} />
            })
            return
        }
        console.log('Email code is sent')
    }

    constructor(props) {
        super(props)
        this.callApi()
    }

    handleSubmit = (e) => {
        const form = this.formRef.props.form;
        e.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                console.log('check clicked')
                const res = await axios.post('/vote/check/', {
                    "email": "omnipede@naver.com",
                    "code": values.email_verification_code,
                    "start_time": (moment().tz('Asia/Seoul').unix() + 600) * 1000 ,
                    "end_time": (moment().tz('Asia/Seoul').unix() + 600) * 1000
                });

                if (res.status === 200) {
                    if (res.data.success === 1) {
                        console.log("Verification success")
                        this.props.onSuccess()
                        this.formRef.props.form.resetFields();
                    }
                    else {
                        console.log("Verification error")
                        this.props.onFail()
                    }
                }
                else {
                    console.log("Verification error")
                    this.props.onFail()
                }
            }
        })
    }

    render() {
        return (
            <LoginForm
                wrappedComponentRef = {this.saveFormRef}
                visible = {this.props.visible}
                onCancel = {this.handleCancel}
                onSubmit = {this.handleSubmit}
            />
        )
    }
}

export default EmailModal