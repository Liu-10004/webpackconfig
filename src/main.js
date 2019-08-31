import React, {Component} from 'react';
import {render} from 'react-dom';
import Home from './routers/Home'
import {
  HashRouter as Router, //提供一个路由容器
  Route, //单条路由
  Switch //只匹配一次
} from 'react-router-dom';


render(
  <Router>
    <Switch>
      {/*只有当路径为 / 的时候，才会匹配路由*/}
      <Route exact path="/" component={Home}/>
      
    </Switch>
  </Router>
  , document.getElementById('app'));