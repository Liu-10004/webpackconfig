/**
 * Created by liubingqun on 17/12/13.
 */
import React, {Component} from 'react';
import './index.less'
import {Link} from 'react-router-dom';
export default class Header extends Component {
  handleClick = () => {
    localStorage.setItem('userId', '');
    localStorage.setItem('entId', '');
  }

  render() {
    return (
      <div className="header">
                <span onClick={this.handleClick}>
                  <Link to={'/login'}>退出登录</Link>
                </span>
        <span></span>
        <span>欢迎您</span>
      </div>
    )
  }
}