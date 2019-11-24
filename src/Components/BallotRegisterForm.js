import React from 'react'
import {Form, Input, Button, Icon, DatePicker, notification} from 'antd'
import './BallotRegisterForm.css'

let id = 0;
/*
    Props
    - user_email, user_login
*/
class BallotRegisterForm extends React.Component {
    
    
    addCandidate = () => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        if (keys.length >= 32) {
            return;
        }
        const nextKeys = keys.concat(id++);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
          keys: nextKeys,
        });
    }

    removeCandidate = k => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
          return;
        }
    
        // can use data-binding to set
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }

            /* 로그인한 상태이어야 한다. */
            if (this.props.user_login === false) {
                notification.open({
                    message: '로그인이 필요합니다.',
                    description: 'You need to login first',
                    icon: <Icon type="warning" style={{ color: 'orange' }} />
                })
                return;
            }

            /* 한 명 이상의 후보를 입력해야 한다. */
            const { getFieldValue } = this.props.form;
            const keys = getFieldValue('keys');
            if (keys.length === 0) {
                notification.open({
                    message: '투표 생성 실패!',
                    description: '후보를 한 명 이상 추가해주세요.',
                    icon: <Icon type="exclamation" style={{ color: 'red' }} />
                })
                return;
            }
        })
    }


    render () {
        const formItemLayoutWithOutLabel = {
            wrapperCol: {
              xs: { span: 24, offset: 0 },
              sm: { span: 20, offset: 4 },
            },
        };

        const addCandidateBtnLayout = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 20, offset: 4 },
            },
        }

        const { getFieldDecorator, getFieldValue } = this.props.form;
        const formItemLayout = {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
          },
        };
    
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => (
          <Form.Item
            {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
            label={index === 0 ? 'Candidates' : ''}
            required={false}
            key={k}
          >
            {getFieldDecorator(`names[${k}]`, {
              validateTrigger: ['onChange', 'onBlur'],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: "Please input candidate's name or delete this field.",
                },
              ],
            })(<Input placeholder="candidate name" style={{ width: '60%', marginRight: 8 }} />)}
            {keys.length > 1 ? (
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                onClick={() => this.removeCandidate(k)}
              />
            ) : null}
          </Form.Item>
        ));

        const date_config = {
            rules: [{ type: 'object', required: true, message: 'Please select time!' }],
        };

        return (
            <React.Fragment>
            <div className='ballot-register-form-header'>
                <h1> <b>새 투표 생성 </b></h1>
                <hr></hr>
            </div>
            
            <Form onSubmit={this.handleSubmit}>
                <div className='ballot-register-form' >
                <Form.Item label="1. 투표 주제를 입력해주세요">
                    {getFieldDecorator('ballot-name', {
                            rules: [{required: true, message: 'Please input ballot name'}]
                        })(<Input placeholder={"투표 주제를 입력해주세요"}/>)}   
                </Form.Item>
                <Form.Item label="2. 후보자를 추가해주세요">
                    {formItems}
                </Form.Item>
                <Form.Item {...addCandidateBtnLayout}>
                    <Button type="default" onClick={this.addCandidate} style={{ width: '30%' }}>
                    <Icon type="plus" /> 후보 추가하기
                </Button>
                </Form.Item>
                <Form.Item label="3. 투표 시작 시간을 선택하세요">
                    {getFieldDecorator('start-time-picker', date_config)(
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                    )}
                </Form.Item>
                <Form.Item label="4. 투표 종료 시간을 선택하세요">
                    {getFieldDecorator('end-time-picker', date_config)(
                        <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                    )}
                </Form.Item>
                </div>
                <div className="ballot-header"><hr></hr></div>
                <div style={{textAlign: "center"}}>
                <Button type="primary" htmlType="submit" size="large" style={{margin: "30px 0 0 0"}}>
                    투표 생성
                </Button>
                </div>
            </Form>
            </React.Fragment>
        )
    }
}

const WrappedBallotRegisterForm = Form.create({ name: 'ballot_register_form' })(BallotRegisterForm);
export default WrappedBallotRegisterForm