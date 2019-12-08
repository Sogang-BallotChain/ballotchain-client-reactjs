import React from 'react'
import {
    Modal, Form, Input, Button, Layout, Icon, notification
} from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';

const { Header } = Layout;

/* Sign-up input form */
const SignupForm = Form.create({name: 'signin'})(

    class extends React.Component {

        state = {
            confirmDirty: false
        }

        handleConfirmBlur = (e) => {
            const value = e.target.value;
            this.setState({ confirmDirty: this.state.confirmDirty || !!value });
        }

        compareToFirstPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && value !== form.getFieldValue('password')) {
                callback('Two passwords that you enter is inconsistent!');
            } else {
                callback();
            }
        }

        validateToNextPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && this.state.confirmDirty) {
                form.validateFields(['confirm'], {force: true});
            }
            callback();
        }

        render(){
            const {getFieldDecorator} = this.props.form;
            return(
                <div>
                    <Modal visible={this.props.visible} footer={null} onCancel = {this.props.onCancel} >
                    <Layout style={{ background: '#fff' }}>
                        <Header style={{ background: '#fff', padding: 0 }} align="center">
                                <h1> Sign up </h1>
                        </Header>
                        <Form onSubmit = {this.props.onSubmit}> 
                            <Form.Item label="Email">
                                {getFieldDecorator('email', {
                                    rules: [{type: 'email',message: 'The input is not valid E-mail!',},
                                    {required: true, message: 'Please input your email!',}]
                                }) (
                                    <Input />
                                )}
                            </Form.Item>
                            <Form.Item label="Password" >
                                {getFieldDecorator('password', {
                                    rules: [{
                                        required: true, message: 'Please input your password!'
                                    }, {
                                        validator: this.validateToNextPassword,
                                    }]
                                })(
                                    <Input type="password" />
                                )}
                            </Form.Item>
                            <Form.Item label="Confirm Password">
                                {getFieldDecorator('confirm', {
                                    rules: [{
                                        required: true, message: 'Please confirm your password!'
                                    }, {
                                        validator: this.compareToFirstPassword,
                                    }]
                                })(
                                    <Input type="password" onBlur={this.handleConfirmBlur} />
                                )}
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit">Sign up</Button>
                            </Form.Item>
                        </Form>
                    </Layout>
                    </Modal>
                </div>
            )
        }
    }
);

/*
    props
    0) visible
    1) onCancel
    2) onSubmit
*/
class SignupModal extends React.Component {

    saveFormRef = (formRef) => {
        this.formRef = formRef;
    }

    onSignupSuccess = () => {

    }

    onSignupFailed = (msg = "Server not connected") => {
        notification.open({
            message: 'Signup failed! ' + msg,
            description: '이메일 또는 비밀번호를 다시 입력해주세요.',
            icon: <Icon type="exclamation" style={{ color: 'red' }} />
        })
    }

    handleSubmit = (e) => {
        const form = this.formRef.props.form;
        e.preventDefault();

        form.validateFields(async (err, values) => {

            /* Only if field is valid */
            if (!err) {
                console.log('Received values of form: ', values);

                let email_array = values.email.split("@")
                console.log(email_array)
                if (email_array[1] !== "sogang.ac.kr") {
                    notification.open({
                        message: '서강대학교 이메일이 아닙니다!',
                        description: '@sogang.ac.kr 이메일을 입력해주세요!',
                        icon: <Icon type="exclamation" style={{ color: 'red' }} />
                    })
                    return;
                }
                let res = await axios.post("/user/signup", {
                    "email": values.email,
                    "password": values.password
                })
                
                /* Check whether response is correct */
                if (res.status === 200) {
                    if(res.data.success === 1) {

                        /* Sign up success */
                        console.log("Sign up success")
                        this.props.onSubmit()

                        /* Reset input fields */
                        form.resetFields();
                    }
                    else {
                        console.log("Sign up failed")
                        this.onSignupFailed(res.data.message)
                    }
                }
                else {
                    console.log("Sign up failed")
                    this.onSignupFailed()
                }
            }
        })
    }

    render() {
        return (
            <SignupForm 
                wrappedComponentRef = {this.saveFormRef}
                visible = {this.props.visible}
                onCancel={this.props.onCancel}
                onSubmit={this.handleSubmit}
            />
        )
    }
}

export default SignupModal