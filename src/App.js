import React from 'react';

import {Layout, Menu} from 'antd'
import 'antd/dist/antd.css';
import './App.css';

import logo_white from './assets/logo_white.png'
import logo_black from './assets/logo_black.png'

const {Header, Content, Footer} = Layout;

function App() {
  return (
    <Layout className="layout">
      {/* Header */}
      <Header>
        <div className="logo">
          <img  src={logo_white } 
          style={{margin: "16px 24px 16px 0", position: "absolute", top: 0}}alt="fireSpot"/>
        </div>
        <Menu
          theme="dark"
          mode = "horizontal"
          defaultSelectedKeys={['2']}
          style = {{lineHeight: '64px'}}
        >
          <Menu.Item key="1">nav 1</Menu.Item>
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="3">nav 3</Menu.Item>
        </Menu>
      </Header>

      {/* Content */}
      <Content>
        <div style={{background: '#fff', padding: 24, minHeight: 560}}>
          Content
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
