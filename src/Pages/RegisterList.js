import React from 'react'
import VoteList from './VoteList'

/*
    Props
    1) user_email
    2) user_login
*/

class JoinList extends React.Component {
    render() {
        return(<VoteList user_email = {this.props.user_email} user_login={this.props.user_login} flag="register" />)
    }
}

export default JoinList