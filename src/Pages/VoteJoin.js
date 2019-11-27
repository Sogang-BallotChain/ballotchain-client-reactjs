import React from 'react'
import {Icon, notification} from 'antd'
import Explorer from '../Components/Explorer'
import Ballot from '../Components/Ballot'

import 'antd/dist/antd.css';
import axios from 'axios'

const moment = require('moment-timezone')

/*
    Props
    - user_email, user_login
 */

class VoteJoin extends React.Component {

    state = {
        nav: "search",

        vote_id: 0,

        vote_name: "",
        vote_start_time: 0,
        vote_end_time: 0,
        vote_addres: "",
        vote_candidate_list: [],
        vote_is_ended: false,
        vote_result: {}
    }

    /* Ballot search success */
    onBallotSearchSuccess = (value, data) => {
        let start_date = moment(new Date(data.start_time)).tz('Europe/London').format('YYYY-MM-DD, HH:mm:ss');
        let end_date = moment(new Date(data.end_time)).tz('Europe/London').format('YYYY-MM-DD, HH:mm:ss');

        this.setState({
            nav: "ballot_found",

            vote_id: value,

            vote_name: data.name,
            vote_start_time: start_date,
            vote_end_time: end_date,
            vote_address: "0x",
            vote_candidate_list: data.candidate_list,
            vote_is_ended: data.is_ended,
            vote_result: data.result
        })
    }

    /* Ballot search failed */
    onBallotSearchFail = () => {
        notification.open({
            message: '존재하지 않는 투표입니다.',
            description: '투표 코드를 확인해주세요.',
            icon: <Icon type="exclamation" style={{ color: 'red' }} />
        })
    }

    /* Searver error */
    onServerError = () => {
        notification.open({
            message: 'Internal server error!',
            description: '관리자에게 문의하세요',
            icon: <Icon type="exclamation" style={{ color: 'red' }} />
        })
    }

    onSearch = async (value) => {
        console.log("Searching ... ", value)

        /* Check login first */
        if (this.props.user_login === false) {
            notification.open({
                message: '로그인이 필요합니다.',
                description: 'You need to login first.', 
                icon: <Icon type="warning" style={{ color: 'orange' }} />})
            return
        }

        /* Call vote view api */
        let res = await axios.get('/vote/' + value)
        if (res.status === 200) {
            let json_response = res.data
            let success = json_response.success
            
            if (success === 1) {
                let data = json_response.data
                this.onBallotSearchSuccess(value, data)
            }
            else {
                let msg = json_response.message
                console.log(msg)
                this.onBallotSearchFail()
            }
        }
        else {
            this.onServerError()
        }
    }

    /* on click new ballot button */
    onClickAddButton (e) {
        console.log("clicked")
    }

    getContent() {
        switch(this.state.nav) {
            case 'search': 
                return <Explorer 
                onSearch={this.onSearch} 
                />
            case 'ballot_found':
                return <Ballot 
                    user_email = {this.props.user_email}
                    vote_id = {this.state.vote_id}
                    name={this.state.vote_name} 
                    start_time = {this.state.vote_start_time}
                    end_time = {this.state.vote_end_time}
                    address = {this.state.vote_address}
                    candidate_list={this.state.vote_candidate_list}
                    is_ended = {this.state.vote_is_ended}
                    result = {this.state.vote_result}
                />
            default:
                return <div></div> 
        }
    }

    render () {
    return (
        <div style={{background: '#fff', padding: 24, minHeight: 560}}>
            { this.getContent() }
        </div>
    )}
}

export default VoteJoin