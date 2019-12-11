import React from 'react'
import {Form, Input, Button, Icon, DatePicker, Result, Spin, Row, Col, notification} from 'antd'

import VoteJoin from '../Pages/VoteJoin'
import EmailModal from './EmailModal'
import Uploader from './Uploader'

import './BallotRegisterForm.css'
import axios from 'axios'

const moment = require('moment-timezone')

let id = 0;
/*
    Props
    - user_email, user_login
*/
class BallotRegisterForm extends React.Component {
    
    state = {
      nav: 'register_form',
      error_message: '',
      email_modal_visible: false,

      ballot_email: '', 
      ballot_name: '',
      ballot_candidate_list: [],
      ballot_voter_list: [],
      ballot_start_time: 0,
      ballot_end_time: 0
    }

    getContent = () => {
      switch(this.state.nav) {
        case 'register_form': 
          return this.registerForm()
        case 'loading':
          return this.loading(this.registerForm())
        case 'home':
          return <VoteJoin user_email={this.props.user_email} user_login={this.props.user_login}/>
        case 'success':
          return this.showResult("success", "투표 생성 성공!", "Voting success!")
        case 'fail':
          return this.showResult("error", "투표 생성 실패!", this.state.error_message)
        case 'warning':
          return this.showResult("warning", "생성이 지연되고 있습니다.", "관리자에게 문의하세요.")
        default:
          return <div>default case</div>
      }
    }

    /* Loading spin wrapper */
    loading = (component) => {
      return (
          <Spin tip="Loading ... ">
              {component}
          </Spin>
      )
    }

    /* eamil 인증 modal */
    showEmailModal = () => {
      return (
        <EmailModal
              user_email={this.props.user_email}
              visible={this.state.email_modal_visible} 
              onCancel={()=>{
                this.setState({email_modal_visible: false})
              }}
              onSuccess={()=>{
                this.onVerificationSuccess()
                this.setState({email_modal_visible: false})
              }}
              onFail={()=>{
                notification.open({
                message: '이메일 인증 실패!',
                description: '인증 코드가 일치하지 않습니다!',
                icon: <Icon type="exclamation" style={{ color: 'red' }} />
              })
            }}
          />
      )
    }

    /* 헤더 부분 출력하는 함수 */
    formHeader = () => {
      return (
        <div className='ballot-register-form-header'>
            <h1> <b>새 투표 생성 </b></h1>
            <hr></hr>
        </div>
      )
    }

    /* 투표 생성 결과 (실패, 경고, 성공) 을 출력하는 함수 */ 
    showResult = (status, title, subTitle) => {
      return(
      <React.Fragment>
      {this.formHeader()}
      <Result
          status={status}
          title={title}
          subTitle={subTitle}
          extra={[
              <Button type="primary" onClick={() => this.setState({nav: 'home'})}>
                  Go home
              </Button>,
          ]}
      />
      </React.Fragment>
    )}

    /* 투표 생성 Form */
    registerForm () {
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
          {this.formHeader()}
          <Form onSubmit={this.handleSubmit}>
              <div className='ballot-register-form' >
              <Form.Item label="1. 투표 주제를 입력해주세요">
                  {getFieldDecorator('ballot_name', {
                          rules: [{required: true, message: 'Please input ballot name'}]
                      })(<Input placeholder={"투표 주제를 입력해주세요"}/>)}   
              </Form.Item>
              <hr style={{ display: "block", height: "1px", border: 0, borderTop: "1px solid #dcdcdc", margin: "1em 0", padding: 0 }} />
              <Form.Item label="2. 후보자를 추가해주세요 (필수)">
                  {formItems}
              </Form.Item>

              <Form.Item {...addCandidateBtnLayout}>
                  <Button type="default" onClick={this.addCandidate} style={{ width: '30%' }}>
                  <Icon type="plus" /> 후보 추가
              </Button>
              </Form.Item>

              <hr style={{ display: "block", height: "1px", border: 0, borderTop: "1px solid #dcdcdc", margin: "1em 0", padding: 0 }} />
              <Form.Item label="3. 유권자를 추가해주세요 (선택)">
                  <Uploader onUploadSuccess = {(rows) => {
                    let voter_list = []
                    rows.forEach(row => {
                      voter_list = voter_list.concat(row)
                    })
                    this.setState({ballot_voter_list: voter_list})
                    console.log(this.state.ballot_voter_list)
                  }}/>
              </Form.Item>
              
              <hr style={{ display: "block", height: "1px", border: 0, borderTop: "1px solid #dcdcdc", margin: "1em 0", padding: 0 }} />
              <Row>
                <Col span={24}>
                  <Form.Item label="3. 투표 시작 시간을 선택하세요">
                  {getFieldDecorator('ballot_start_time', date_config)(
                      <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                  )}
                  </Form.Item>
                </Col>
                <Col span={24} offset={0}>
                  <Form.Item label="4. 투표 종료 시간을 선택하세요">
                    {getFieldDecorator('ballot_end_time', date_config)(
                      < DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
                    )}
                  </Form.Item>
                </Col>
              </Row>
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

    onVerificationSuccess = async () => {

      /* API call */
      this.setState({nav: 'loading'})
      let res = await axios.post('/vote/register/', {
        "email": this.state.ballot_email,
        "name": this.state.ballot_name,
        "candidate_list": this.state.ballot_candidate_list,
        "voter_list": this.state.ballot_voter_list,
        "start_time": this.state.ballot_start_time,
        "end_time": this.state.ballot_end_time
      })

      /* API 호출 결과에 따른 화면 출력 */
      if (res.status === 200) {
        let json_body = res.data
        let success = json_body.success
        if (success === 1) {
          this.setState({nav: 'success'})
        }
        else {
          this.setState({nav: 'fail', error_message: json_body.message})
        }
      }
      else {
        this.setState({nav: 'warning'})
      }
    }

    /* 투표지 제출 */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, fieldsValue) => {
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

            const { getFieldValue } = this.props.form;

            /* 후보자 목록 형성 */
            const keys = getFieldValue('keys');
            const names = fieldsValue.names;
            const candidate_list = keys.map(key => names[key])

            /* Change dates to timestamps */
            const start_timestamp = moment(fieldsValue.ballot_start_time._d).tz('Europe/London').unix() * 1000
            const end_timestamp = moment(fieldsValue.ballot_end_time._d).tz('Europe/London').unix() * 1000

            /* 한 명 이상의 후보를 입력해야 한다. */
            if (keys.length === 0) {
                notification.open({
                    message: '투표 생성 실패!',
                    description: '후보를 한 명 이상 추가해주세요.',
                    icon: <Icon type="exclamation" style={{ color: 'red' }} />
                })
                return;
            }

            /* 시작 시간이 끝 시간보다 이를 경우 */
            if (start_timestamp > end_timestamp) {
              notification.open({
                message: '투표 생성 실패!',
                description: '종료시간이 시작시간보다 이릅니다!',
                icon: <Icon type="exclamation" style={{ color: 'red' }} />
              })
              return;
            }

            /* 폼 결과를 state 에 저장하여 이후 onVerificationSuccess 에서 사용할 수 있게 함 */
            this.setState({
              ballot_email: this.props.user_email,
              ballot_name: fieldsValue.ballot_name,
              ballot_candidate_list: candidate_list,
              ballot_start_time: start_timestamp,
              ballot_end_time: end_timestamp
            })

            /* 본인 인증 창 보여줌 */
            this.setState({
              email_modal_visible: true
            })
        })
    }

    render () {
        return (
            <React.Fragment>
              { this.state.email_modal_visible === true 
              ? this.showEmailModal()
              : <React.Fragment> </React.Fragment>}
              
              {this.getContent()}
            </React.Fragment>
        )
    }
}

const WrappedBallotRegisterForm = Form.create({ name: 'ballot_register_form' })(BallotRegisterForm);
export default WrappedBallotRegisterForm