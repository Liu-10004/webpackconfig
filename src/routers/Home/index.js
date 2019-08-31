import React, {Component} from 'react';
import Header from 'Mycomponents/Header/Header';
import Button from 'Mycomponents/Button';
import Form from 'Mycomponents/Form';
import Menu from 'Mycomponents/menu';
import './index.less'

export default class Home extends Component {

  _click = (event,data)=>{
    console.log(event,data)
  }
  render() {

    return (
      <div className="home">
        <Header/>
        <Menu onClick = {this._click}/>
      </div>
    )
  }
}