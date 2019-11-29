import React from 'react'
import {Table} from 'antd'
import axios from 'axios'

import './BallotList.css'
/*
    Props
    1) flag
    2) title
    3) sub_title
    4) user_email
*/

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id,'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Start time',
      dataIndex: 'start_time',
      key: 'start_time',
    },
    {
        title: 'End time',
        dataIndex: 'end_time',
        key: 'end_time',
    }
];

const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
];


class BallotList extends React.Component {

    state = {
        page: 1
    }

    constructor (props) {
        super(props)
        this.fetchList()
    }
    /*
        1) 투표 번호
        2) 투표 제목
        3) 블록체인 주소
        4) 시작 시간
        5) 종료 시간
    */
    fetchList = async () => {

        /* TODO: set loading flag */
        let res = await axios.post('/vote/profile/', {
            "flag": this.props.flag,
            "email": this.props.user_email,
            "page": this.state.page
        })

        /*  */
        if (res.status === 200) {
            let json_body = res.data;
            let success = json_body.success;
            
            if (success === 1) {
                let id_list = json_body.data;
                console.log(id_list)
                
                for(var idx in id_list) {
                    let vote_id = id_list[idx]
                    this.fetchListEntry(vote_id)
                }   
            }
            else {

            }
        }
        else {

        }
    }

    /* vote_id 에 해당하는 투표 정보를 가져옴 */
    fetchListEntry = async (vote_id) => {
        let res = await axios.get('/vote/' + vote_id)
        if (res === 200) {

        }
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
                <Table columns={columns} dataSource={data} />
            </div>
        )
    }

    render() {
        return (
            <React.Fragment>
                {this.listHeader()}
                {this.list()}
            </React.Fragment>
        )
    }
}

export default BallotList