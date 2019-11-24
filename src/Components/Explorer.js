import React from 'react';
import { Input } from 'antd';

import './Explorer.css';
import logo_black from '../assets/logo_black.png'

const { Search } = Input;

class Explorer extends React.Component {

    render () {
        return (
            <div>
                <div className="explorer-logo">
                    <img  src={logo_black} alt="fireSpot"/>
                </div>
                <div className="explorer-searchbar">
                    <Search placeholder="참여하려는 투표 코드를 입력하세요!" onSearch={this.props.onSearch} size="large" enterButton="Join"/>
                    {this.props.addendum}
                </div>
            </div>
        )
    }
}

export default Explorer