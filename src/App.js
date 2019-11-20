import React from 'react';
import Explorer from './Components/Explorer'
import LoginModal from './Components/LoginModal'
import logo_white from './assets/logo_white.png'

import {Layout, Menu, Button, notification, Icon} from 'antd'
import 'antd/dist/antd.css';
import './App.css';

const {Header, Content, Footer} = Layout;

class App extends React.Component {

  state={
    login_modal_visible: false,
    user_login: false,
    user_email: ""
  }

  onClickLoginBtn = (e) => {
    this.setState({
      login_modal_visible: true
    })
  }

  onClickLoginCancel = (e) => {
    this.setState({
      login_modal_visible: false
    })
  }

  onClickLogoutBtn = (e) => {
    this.setState({
      user_email: "",
      user_login: false
    })
  }

  onLoginSuccess = (e, user_email) => {
    this.setState({
      login_modal_visible: false,
      user_login: true,
      user_email: user_email
    })
  }

  onLoginFailed = (e) => {
    this.setState({
      login_modal_visible: false
    })

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

        <div className="btns" style={{top: 0, float: "right"}}>
          {
            this.state.user_login === false 
            ?
            <div>
            <Button style = {{margin: "8px 20px 0 0"}}> Signup </Button> 
            <Button type="primary" style = {{margin: "8px"}} onClick={this.onClickLoginBtn}> Login </Button> 
            </div>
            : 
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
          <Menu.Item key="1">About us </Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>

      {/* Content */}
      <Content>
        <div style={{background: '#fff', padding: 24, minHeight: 560}}>
          <Explorer />
        </div>

        <LoginModal 
          visible={this.state.login_modal_visible} 
          onCancel ={this.onClickLoginCancel} 
          onLoginSuccess = {this.onLoginSuccess}
          onLoginFailed = {this.onLoginFailed}
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
