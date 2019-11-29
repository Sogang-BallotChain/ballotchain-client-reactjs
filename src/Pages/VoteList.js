import React from 'react'
import BallotList from '../Components/BallotList'
/* 
    Props
    1) user_email
    2) user_login
    3) flag
*/

class VoteList extends React.Component {

    state = {
        nav: ''
    }

    componentDidMount() {
        this.setState({nav: this.props.flag})
    }

    getContent() {
        switch(this.state.nav) {
            case 'join':
                return <BallotList 
                    flag="join"
                    user_email= {this.props.user_email} 
                    title="참여한 투표 목록" 
                    sub_title="참여한 투표 목록을 확인할 수 있습니다."/>
            case 'register':
                return <BallotList 
                    flag="register" 
                    user_email= {this.props.user_email}
                    title="생성한 투표 목록" 
                    sub_title="생성한 투표 목록을 확인할 수 있습니다."/>
            default:
                return <div>Default content</div>
        }
    }

    render() {
        return (
            <div style={{background: '#fff', padding: 24, minHeight: 560}}>
                { this.getContent() }
            </div>
        )
    }
}

export default VoteList