import React from 'react'
import BallotRegisterForm from '../Components/BallotRegisterForm'
/*
    Props
    - user_email, user_login
*/
class VoteRegister extends React.Component {
    render () {
        return (
            <div style={{background: '#fff', padding: 24, minHeight: 560}}>
                <BallotRegisterForm user_email={this.props.user_email} user_login={this.props.user_login} />
            </div>
        )
    }
}

export default VoteRegister