import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';

import { Button, Label } from 'semantic-ui-react'

import _ from 'lodash';
import key from 'keymaster';

import HyAuthCom from '../../hyauthcom';

const _key = global.__KEYMASTER__ || key;

Component.prototype._packageReProps= function (props) {
  const _props = props || this.props;
  if (!_props) {
    return {};
  }
  let reProps = {};
  _.forEach(_props, (item, index) => {
    if (!_.isFunction(item)) {
      reProps[index] = item;
    }
  });

  return reProps;
}

class HyButtonCom extends Component {

  static propTypes = {
   
    keyboard: PropTypes.string,
    // 按钮点击事件
    onClick: PropTypes.func,
    // 权限代码
    permsCode: PropTypes.array,
    // 授权代码
    authCode: PropTypes.array,
    // 管控字段名称
    controlFieldName: PropTypes.oneOf(["N", "I", "M", "D", "R"]),
    // 单位id
    unitId: PropTypes.string
  }

  bindKeyed = false;

  componentDidMount() {
    // if (!this.bindKeyed && _.has(this.props, "keyboard")
    //   && _.trim(this.props.keyboard) !== ""
    //   && _.has(global.__SHORTKEYMAP__, this.props.keyboard)
    //   && _.trim(global.__SHORTKEYMAP__[this.props.keyboard]) !== ""
    //   && (!_.has(this.props, "permsCode") || !HyAuthCom.CheckPermsCode(this.props.permsCode))
    //   && (!_.has(this.props, "authCode") || !HyAuthCom.CheckAuthCode(this.props.authCode))) {

    //   this.bindKeyed = true;
    //   _key(global.__SHORTKEYMAP__[this.props.keyboard], (e) => {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     const { children, keyboard, ...componentProps } = this.props;
    //     // 如果button的props是否存在click，则执行click
    //     if (_.has(this.props, "onClick")) {
    //       this.props.onClick(this, this.packageReProps(componentProps));
    //     }


    //     return false;
    //   })
    // }
  }

  componentWillUnmount() {
    if (_.has(this.props, "keyboard")
      && _.trim(this.props.keyboard) !== ""
      && _.has(global.__SHORTKEYMAP__, this.props.keyboard)
      && _.trim(global.__SHORTKEYMAP__[this.props.keyboard]) !== "") {
      _key.unbind(global.__SHORTKEYMAP__[this.props.keyboard], "all");
    }
  }

  render() {

    const { keyboard, onClick, permsCode, authCode, className, controlFieldName, unitId, ...componentProps } = this.props;
    return (
      <HyAuthCom permsCode={permsCode} authCode={authCode} controlFieldName={controlFieldName} unitId={unitId}>
        <Button
          className={className}
          onClick={this._onClick}
          {...componentProps} />
      </HyAuthCom>
    )
  }

  _onClick = (event, data) => {
    event.stopPropagation();
    event.preventDefault();
    this.props.onClick && this.props.onClick(event, data);
  }

}

export default HyButtonCom;