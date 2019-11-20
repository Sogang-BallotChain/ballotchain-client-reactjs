import React from 'react'
import axios from 'axios'

import {
    Modal, Form, Input, Button, Layout, Icon
} from 'antd'

/* 
    props
    1) onCancel (visibility)
    2) onLoginSuccess
    3) onLoginFailed
*/

const {
    Header
} = Layout;

const LoginForm = Form.create({name: 'login'}) (

    class extends React.Component {
        render () {
            const {getFieldDecorator} = this.props.form;
            return (
                <div>
                    <Modal visible={this.props.visible} footer={null} onCancel={this.props.onCancel}>
                        <Layout style={{ background: '#fff' }}>
                            <Header style={{ background: '#fff', padding: 0 }} align="center">
                                <h1> Log in </h1>
                            </Header>
                            <Form onSubmit = {this.props.onSubmit} className="login-form">
                                <Form.Item>
                                    {getFieldDecorator('username', {
                                        rules: [{ required: true, message: 'Please input your email!' }],
                                    })(
                                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)' }} />} placeholder="Email" />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator('password', {
                                        rules: [{ required: true, message: 'Please input your passoword!' }],
                                    })(
                                        <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button" block>
                                        Log in
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

class LoginModal extends React.Component {

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    handleCancel = (e) => {
        this.props.onCancel()
        this.formRef.props.form.resetFields();
    }

    handleSubmit = (e) => {
        const form = this.formRef.props.form;
        e.preventDefault();
        form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const res = await axios.post('/user/signin', {
                    "email": values.username,
                    "password": values.password
                });
                
                if (res.status === 200) {
                    if (res.data.success === 1) {
                        console.log("Login success")
                        this.props.onLoginSuccess(values.username)
                    }
                    else {
                        console.log("Login error")
                        this.props.onLoginFailed()
                    }
                }
                else {
                    console.log("Login error")
                    this.props.onLoginFailed()
                }
            }
        })
        this.formRef.props.form.resetFields();
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

export default LoginModal