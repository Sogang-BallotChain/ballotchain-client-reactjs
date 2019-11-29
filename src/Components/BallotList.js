import React from 'react'
import {Table, Spin, Button, Icon} from 'antd'
import axios from 'axios'

import './BallotList.css'

const moment = require('moment-timezone')

/*
    Props
    1) flag
    2) title
    3) sub_title
    4) user_email
*/

/* Columns of table */
const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id,'},
    { title: 'Name', dataIndex: 'name', key: 'name'},
    { title: 'Address', dataIndex: 'address', key: 'address'},
    { title: 'Start time', dataIndex: 'start_time', key: 'start_time'},
    { title: 'End time', dataIndex: 'end_time', key: 'end_time'}
];

class BallotList extends React.Component {

    state = {
        loading: false,
        page: 1,
        dataSource: [],
        id_list: []
    }

    componentDidMount() {
        this.fetchList()
    }

    getContent() {
        if (this.state.loading === true)
            return this.loading(this.list())
        else
            return this.list()
    }

    nextPage = async () => {
        await this.setState({page: this.state.page + 1})
        this.fetchList()
    }

    prevPage = async () => {
        if (this.state.page > 1) {
            await this.setState({page: this.state.page - 1})
            this.fetchList()
        }
    }

    fetchList = async () => {

        /* set loading flag */
        this.setState({loading: true})

        /* call api */
        let res = await axios.post('/vote/profile/', {
            "flag": this.props.flag,
            "email": this.props.user_email,
            "page": this.state.page
        })

        /* 데이터를 받아서 테이블에 뿌린다. */
        if (res.status === 200) {
            let json_body = res.data;
            let success = json_body.success;
            
            if (success === 1) {

                /* 마지막 페이지인지 확인한다. */
                let id_list = json_body.data;
                if (JSON.stringify(this.state.id_list) === JSON.stringify(id_list)) {
                    await this.setState({loading: false, page: this.state.page - 1})
                    return;
                }
                this.setState({id_list: id_list})

                let temp = []
                for(var idx in id_list) {
                    let vote_id = id_list[idx]
                    let v = await this.fetchListEntry(idx, vote_id)
                    temp.push(v)
                }
                this.setState({dataSource: temp})
            }
        }

        /* Unset loading flag */
        this.setState({loading: false})
    }

    /* vote_id 에 해당하는 투표 정보를 가져옴 */
    fetchListEntry = async (idx, vote_id) => {
        let res = await axios.get('/vote/' + vote_id)
        if (res.status === 200) {
            let json_body = res.data
            let success = json_body.success
            if (success === 1) {
                let data = json_body.data
                return {
                    key: idx,
                    id: vote_id,
                    name: data.name,
                    address: data.address,
                    start_time: moment(new Date(data.start_time)).tz('Europe/London').format('YYYY-MM-DD, HH:mm:ss'),
                    end_time: moment(new Date(data.end_time)).tz('Europe/London').format('YYYY-MM-DD, HH:mm:ss')
                }
            }
        }
    }

    loading = (component) => {
        return (
            <Spin tip="Loading ... ">
                {component}
            </Spin>
        )
    }

    listHeader () {
        return (
            <div className="ballot-list-header">
                <h1> <b> {this.props.title} </b> </h1>
                <h4> <i> {this.props.sub_title} </i> </h4>
                <hr></hr>
            </div>
        )
    }

    list() {
        return (
            <div className="ballot-list">
                <Table columns={columns} dataSource={this.state.dataSource} pagination={false} bordered={true} 
                onRow={(record, rowIndex) => {
                    return {
                      onClick: event => {console.log(record, rowIndex)}, // click row
                    };
                }}/>
            </div>
        )
    }

    listBottom () {
        return (
            <div className="ballot-list-bottom">
                <div style={{float: "right", margin: "20px 0 0 0"}}>
                    <Button type="primary" style={{margin: "0 20px 0 0"}} onClick={this.prevPage}> <Icon type="left" /> prev </Button>
                    <Button type="primary" style={{margin: "0 20px 0 0"}} onClick={this.nextPage}> next <Icon type="right" /> </Button>
                </div>
            </div>
        )
    }

    render() {
        return (
            <React.Fragment>
                {this.listHeader()}
                {this.getContent()}
                {this.listBottom()}
            </React.Fragment>
        )
    }
}

export default BallotList