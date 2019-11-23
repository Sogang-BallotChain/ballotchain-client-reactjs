import React from 'react'
import {Radio, Descriptions, Button, Form, Icon, Result, Spin, notification} from 'antd'
import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar} from 'recharts'
import './Ballot.css'
import axios from 'axios'

import VoteJoin from '../Pages/VoteJoin'

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px',
};

/*
    Props
    - user_email, user_login, vote_id, name, start_time, end_time, address, candidates_list, is_ended, result
 */


/* 투표 용지 컴포넌트 */
class Ballot extends React.Component {

    state = {
        nav: "select",
        candidates_list: [],
        submit_loading: false
    }

    /* 초기화 함수 */
    componentWillMount() {
        this.setState({
            candidate_list: this.props.candidate_list
        })

        if (this.props.is_ended === false) {
            this.setState({
                nav: "select"
            })
        }
        else {
            this.setState({
                nav: "result"
            })
        }
    }

    /* 투표 정보 보여주는 함수 */
    ballotInfo = () => {
        return (
            <React.Fragment>
            <div className="ballot-header">
                <h1> <b>투표 참여하기 </b> </h1>
                <hr></hr>
            </div>
            <div className="ballot">
                <Descriptions title="1. 투표 정보 일람" bordered style={{padding: "0 0 30px 0"}}>
                    <Descriptions.Item label="주제" span={3}> { this.props.name } </Descriptions.Item>
                    <Descriptions.Item label="투표 블록체인 주소" span={3}> {this.props.address} </Descriptions.Item>
                    <Descriptions.Item label="시작 시간" span={3}> {this.props.start_time} </Descriptions.Item>
                    <Descriptions.Item label="종료 시간"> {this.props.end_time} </Descriptions.Item>
                </Descriptions>
            </div>
            </React.Fragment>
        )
    }

    loading = (component) => {
        return (
            <Spin tip="Loading ... ">
                {component}
            </Spin>
        )
    }

    /* 후보 선택 보여주는 함수 */
    candidateSelect = () => {
        const { getFieldDecorator } = this.props.form;
        return (
            <React.Fragment>
            {this.ballotInfo()}
            <Form onSubmit={this.handleSubmit}>
            <div className="ballot">
                <Descriptions title="2. 후보를 선택하세요">
                    <Form.Item>
                        {getFieldDecorator ('candidate_list',{
                             rules: [{ required: true, message: 'Please select candidate!' }]
                        })(
                            <Radio.Group name="candidate_radio_group">
                                {this.state.candidate_list.map((name, idx) => {
                                 return (<Radio style={radioStyle} value={idx}>  <b>{name}</b> </Radio>)
                                })}
                            </Radio.Group>
                        )}
                    </Form.Item>
                </Descriptions>
            </div>
            <div className="ballot-header"><hr></hr></div>
            <div style={{textAlign: "center", padding: "30px 0 10px 0"}}>
                <Button size="large" type="primary" htmlType="submit"> 투표하기 </Button>
            </div>
            </Form>
            </React.Fragment>
        )
    }

    /* 투표 결과 보여주는 함수 */
    ballotResult = () => {
        console.log(this.props.result)
        let vote_result = []
        for(let name in this.props.result) {
            vote_result.push({
                candidate_name: name,
                vote_count: this.props.result[name]
            })
        }

        return (
            <React.Fragment>
            {this.ballotInfo()}
            <div className="ballot"> 
                <Descriptions title="2. 투표 결과">
                </Descriptions> 

                <BarChart width={730} height={250} data={vote_result}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="candidate_name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="vote_count" fill="#8884d8" />
                </BarChart>
            </div>
            </React.Fragment>
        )
    }

    /* 투표 후 보여주는 화면 */
    onVoteSuccess = (status, title, subTitle) => {
        return(
        <React.Fragment>
        {this.ballotInfo()}
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

    /* 투표 제출 시 호출하는 함수 */
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({ nav: 'loading' })
                let res = await axios.post('/vote/', {
                    "email": this.props.user_email,
                    "vote_id": this.props.vote_id,
                    "candidate": values.candidate_list
                })
                console.log(res)

                /* Response 200 */
                if (res.status === 200) {
                    let json_body = res.data
                    let success = json_body.success
                    if (success === 1) {
                        this.setState({nav: 'vote_success'})
                    }
                    else {
                        this.setState({nav: 'vote_warning'})
                    }
                }
                else if (res.status === 504) {
                    this.setState({nav: 'vote_success'})
                }
                /* Response 500 ~ 504 */
                else {
                    this.setState({nav: 'vote_fail'})
                }
            }
            else {
                notification.open({
                    message: '후보를 선택해주세요!',
                    description: 'Please select one of the candidates!',
                    icon: <Icon type="exclamation" style={{ color: 'red' }} />
                })
            }
        });
    }

    getContent() {
        switch(this.state.nav) {
            case 'select': return this.candidateSelect();
            case 'result': return this.ballotResult();
            case 'vote_success': return this.onVoteSuccess("success", "투표 성공!", "Voting success!");
            case 'vote_warning': return this.onVoteSuccess("warning", "중복 투표 감지!", "Duplicate voting!")
            case 'vote_fail': return this.onVoteSuccess("error", "투표 실패!", "관리자에게 문의하세요")
            case 'home': return <VoteJoin user_email={this.props.user_email} user_login={this.props.user_login}/>
            case 'loading': return this.loading(this.candidateSelect())
            default: return <div></div>
        }
    }

    render() {
    return (
        <React.Fragment>
            {this.getContent()}
        </React.Fragment>
    )}
}

const WrappedBallot = Form.create({ name: 'validate_other' })(Ballot);
export default WrappedBallot