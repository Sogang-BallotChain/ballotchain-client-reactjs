import React from 'react';
import Explorer from './Components/Explorer'
import logo_white from './assets/logo_white.png'

import {Layout, Menu, Button} from 'antd'
import 'antd/dist/antd.css';
import './App.css';

const {Header, Content, Footer} = Layout;

function App() {
  return (
    <Layout className="layout" style={{minWidth: "720px"}}>
      {/* Header */}
      <Header>
        <div className="logo">
          <img  src={logo_white } 
          style={{margin: "16px 24px 16px 0", position: "absolute", top: 0}}alt="fireSpot"/>
        </div>

        <div className="btns" style={{top: 0, float: "right"}}>
          <Button size="large" style = {{margin: "8px 20px 0 0"}}> Signup </Button> 
          <Button size="large" type="primary" style = {{margin: "8px"}}> Login </Button> 
        </div>

        <Menu
          theme="dark"
          mode = "horizontal"
          defaultSelectedKeys={['2']}
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
      </Content>

      {/* Footer */}
      <Footer style={{textAlign: 'center', minHeight: 280}}>
         BallotChain @2019 Created by omnipede
      </Footer>
    </Layout>
  );
}

export default App;
