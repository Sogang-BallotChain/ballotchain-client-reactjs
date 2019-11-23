import React from 'react';

import LoginModal from './Components/LoginModal'
import SignupModal from './Components/SignupModal';

import VoteJoin from './Pages/VoteJoin'

import logo_white from './assets/logo_white.png'

import {Layout, Menu, Button, notification, Icon} from 'antd'
import 'antd/dist/antd.css';
import './App.css';

const {Header, Content, Footer} = Layout;

class App extends React.Component {

  state={
    login_modal_visible: false,
    signup_modal_visible: false,
    user_login: false,
    user_email: ""
  }

  onClickLogoutBtn = (e) => {
    this.setState({
      user_email: "",
      user_login: false
    })
  }

  onLoginSuccess = (user_email) => {
    console.log(user_email)
    this.setState({
      login_modal_visible: false,
      user_login: true,
      user_email: user_email
    })
  }

  onLoginFailed = (e) => {
    notification.open({
      message: 'Login failed!',
      description: '이메일 또는 비밀번호를 다시 확인해주세요.',
      icon: <Icon type="exclamation" style={{ color: 'red' }} />
    })
  }

  render () {
  return (
    <Layout className="layout" style={{minWidth: "720px"}}>
      {/* Header */}
      <Header>
        <div className="logo">
          <img  src={logo_white} 
          style={{margin: "16px 24px 16px 0", position: "absolute", top: 0}}alt="fireSpot"/>
        </div>

        {/* Sign up & Login buttons */}
        <div className="btns" style={{top: 0, float: "right"}}>
          {
            this.state.user_login === false ?
            <div>
              <Button style = {{margin: "8px 20px 0 0"}} onClick={()=>this.setState({signup_modal_visible: true})}> Signup </Button> 
              <Button type="primary" style = {{margin: "8px"}} onClick={()=>this.setState({login_modal_visible: true})}> Login </Button> 
            </div> : 
            <div>
              <Button type="danger" style = {{margin: "8px 20px 0 0"}} onClick={this.onClickLogoutBtn}> Logout </Button> 
            </div>
          }
        </div>

        <Menu
          theme="dark"
          mode = "horizontal"
          defaultSelectedKeys={['1']}
          style = {{lineHeight: '64px'}}
        >
          <Menu.Item key="1"> Home </Menu.Item>
          <Menu.Item key="2"> About us </Menu.Item>
        </Menu>
      </Header>

      {/* Content */}
      <Content>
        <VoteJoin user_email = {this.state.user_email} user_login={this.state.user_login}/>

        <LoginModal 
          visible={this.state.login_modal_visible} 
          onCancel ={() => this.setState({login_modal_visible: false})}
          onLoginSuccess = {this.onLoginSuccess}
          onLoginFailed = {this.onLoginFailed}
        />

        <SignupModal
          visible={this.state.signup_modal_visible}
          onCancel={()=> this.setState({signup_modal_visible: false})}
          onSubmit={()=> this.setState({signup_modal_visible: false})}
        />

      </Content> 
      {/* Footer */}
      <Footer style={{textAlign: 'center', minHeight: 280}}>
         BallotChain @2019 Created by omnipede
      </Footer>
    </Layout>
  );
  }
}

export default App;
