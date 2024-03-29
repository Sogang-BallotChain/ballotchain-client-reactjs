import React from 'react';

import LoginModal from './Components/LoginModal'
import SignupModal from './Components/SignupModal';

import VoteJoin from './Pages/VoteJoin'
import VoteRegister from './Pages/VoteRegister'
import JoinList from './Pages/JoinList'
import RegisterList from './Pages/RegisterList'

import logo_white from './assets/logo_white.png'

import {Layout, Menu, Button, notification, Icon, Popover} from 'antd'
import 'antd/dist/antd.css';
import './App.css';

const {SubMenu} = Menu;
const {Header, Content, Footer} = Layout;

class App extends React.Component {

  state={
    nav: 'Home',
    login_modal_visible: false,
    signup_modal_visible: false,
    user_login: false,
    user_email: "",
    menu_switch: false
  }

  getContent() {
    switch(this.state.nav) {
      case 'Home': 
        return <VoteJoin user_email = {this.state.user_email} user_login={this.state.user_login}/>
      case 'New Ballot': 
        return <VoteRegister user_email = {this.state.user_email} user_login={this.state.user_login}/>
      case 'JoinList':
        return <JoinList user_email = {this.state.user_email} user_login={this.state.user_login}/>
      case 'RegisterList':
          return <RegisterList user_email = {this.state.user_email} user_login={this.state.user_login}/>
      default: return <div>default nav</div>
    }
  }

  onClickLogoutBtn = (e) => {
    this.setState({
      user_email: "",
      user_login: false
    })
    window.location.reload()
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

  onMenuSelect = (obj) => {
    const selected_menu = obj.key
    this.setState({
      nav: selected_menu,
      menu_switch: !this.state.menu_switch
    })
  }

  onPopoverSelect = (obj) => {
    const selected_menu = obj.key
    obj.selectedKeys.pop()
    this.setState({
      nav: selected_menu,
      menu_switch: !this.state.menu_switch
    })
  }

  render () {

  /* 우상단 유저 popover 메뉴 */
  const popover = (
    <Menu onSelect = {this.onPopoverSelect}>
      <SubMenu title="투표 목록">
        <Menu.Item key="JoinList"> 참여한 투표 목록 </Menu.Item>
        <Menu.Item key="RegisterList"> 생성한 투표 목록 </Menu.Item>
      </SubMenu>
      <SubMenu title="회원 정보 관리" disabled>
        <Menu.Item>5d menu item</Menu.Item>
        <Menu.Item>6th menu item</Menu.Item>
      </SubMenu>
    </Menu>
  )
  return (
    <Layout className="layout" style={{minWidth: "720px"}}>
      {/* Header */}
      <Header>
        <div className="logo">
          <img  src={logo_white} 
          style={{margin: "16px 24px 16px 0", position: "absolute", top: 0}}alt="fireSpot"
          onClick={()=>{window.location.reload();}}/>
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
              <Popover placement="bottomRight" title={this.state.user_email} content={popover} trigger="hover">
                <Button shape="circle"><Icon type="user" /></Button>
              </Popover>
            </div>
          }
        </div>

        <Menu
          theme="dark"
          mode = "horizontal"
          defaultSelectedKeys={[this.state.nav]}
          style = {{lineHeight: '64px'}}
          onSelect = {this.onMenuSelect}
        >
          <Menu.Item key="Home" onClick={()=> {this.setState({nav: "Home"})}}> Home </Menu.Item>
          <Menu.Item key="New Ballot" onClick={()=> {this.setState({nav: "Home"})}}> New Ballot </Menu.Item>
        </Menu>
      </Header>

      {/* Content */}
      <Content>
        {this.getContent()}

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
