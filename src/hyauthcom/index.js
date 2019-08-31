import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const controlEnum = {
  // 新建
  "N": "permNew",
  // 导入
  "I": "permImport",
  // 修改
  "M": "permModify",
  // 删除
  "D": "permDel",
  // 恢复
  "R": "permDel"
}

class HyAuthCom extends Component {

  static propTypes = {
    // 子节点数据
    children: PropTypes.object.isRequired,
    // 权限代码
    permsCode: PropTypes.array,
    // 授权代码
    authCode: PropTypes.array,
    // 管控字段名称
    controlFieldName: PropTypes.oneOf(["N", "I", "M", "D", "R"]),
    // 单位id
    unitId: PropTypes.string,
    // 控制类型默认是控制显示隐藏，如果传入则根据枚举类型进行判断，暂时只支持disabled属性
    controlTyp: PropTypes.oneOf(["display","disabled"])
  }

  render() {
    let _disabled = false;

    // 获取权限代码和授权代码
    const { children, permsCode, authCode, controlFieldName, unitId, disabled, controlTyp = "display", ...childrenProps } = this.props;

    // 如果sku无效，则直接返回null
    const checkSKU = HyAuthCom.CheckAuthCode(authCode);
    if (checkSKU && controlTyp === "display") {
      return null;
    }

    // 判断管控字段，如果为管控则直接返回null
    if (HyAuthCom.CheckControlFieldName(controlFieldName, unitId)) {
      return null;
    }

    // 获取授权状态
    const authState = HyAuthCom.CheckPermsCode(permsCode);

    // 判断组件的disabled状态
    if (_.has(childrenProps, "disabled") && childrenProps.disabled !== undefined) {
      // 当props中的disabled和授权状态都为true时，设置disabled为true否则为false
      _disabled = (childrenProps.disabled && authState) ? true : false;
    } else {
      _disabled = authState;
    }

    // 判断SKU，如果SKU无效并且控制类型为disabled，则向子组件传递禁用标记
    if(checkSKU && controlTyp === "disabled"){
      _disabled = true;
    }

    // 如果子节点不存在直接返回null
    if (!children) {
      return null;
    }

    const currentdisabled = _disabled ? { disabled: true } : {};

    // 克隆子节点，传入disabled属性
    const childcom = React.cloneElement(children, {
      ...childrenProps,
      ...currentdisabled
    });

    return childcom;
  }
}


// 输出权限校验函数
HyAuthCom.CheckPermsCode = (permsCode) => {
  if (_.size(permsCode) === 0) {
    // 如果传入的code为空则直接返回正确
    return false;
  } else if (_.isString(permsCode)) {
    // 如果传入的是一个单一的code字符串
    return (global.__USERPARAMS__ && global.__USERPARAMS__[permsCode]) ? false : true;
  } else if (_.isPlainObject(permsCode)) {
    // 如果传入的是一个权限code对象
    // 暂未处理
  } else if (_.isArray(permsCode)) {
    let _reauth = true;
    // 如果传入的是一个权限code数组
    _.forEach(permsCode, (item) => {
      if (global.__USERPARAMS__ && global.__USERPARAMS__[item]) {
        _reauth = false;
        return;
      }
    })
    return _reauth;
  } else {
    return (global.__USERPARAMS__ && global.__USERPARAMS__[permsCode]) ? false : true;
  }
};

// 输出授权校验函数
HyAuthCom.CheckAuthCode = (authCode) => {
  if (_.size(authCode) === 0) {
    // 如果传入的code为空则直接返回正确
    return false;
  } else if (_.isString(authCode)) {
    // 如果传入的是一个单一的code字符串
    return (global.__SKUMAP__ && global.__SKUMAP__[authCode]) ? false : true;
  } else if (_.isPlainObject(authCode)) {
    // 如果传入的是一个权限code对象
    // 暂未处理
  } else if (_.isArray(authCode)) {
    let _reauth = true;
    // 如果传入的是一个权限code数组
    _.forEach(authCode, (item) => {
      if (global.__SKUMAP__ && global.__SKUMAP__[item]) {
        _reauth = false;
        return;
      }
    })
    return _reauth;
  } else {
    return (global.__SKUMAP__ && global.__SKUMAP__[authCode]) ? false : true;
  }
};

/*
 * 校验管控
 * 返回true为管控，返回false为不管控
 *
 */
HyAuthCom.CheckControlFieldName = (controlFieldName, unitId) => {
  // 如果管控参数字段名为空，或者单位id为空，则认为不管控
  if (_.trim(controlFieldName) === "") {
    return false;
  }

  // 如果单位id与global中的单位id相同，则认为不管控
  if (_.trim(unitId) !== "" && global.__UNITINFO__ && global.__UNITINFO__.UnitUid === unitId) {
    return false;
  }

  if (global.__CONTROLHANDLE__
    && _.has(global.__CONTROLHANDLE__, controlEnum[controlFieldName])
    && global.__CONTROLHANDLE__[controlEnum[controlFieldName]]) {
    return true;
  } else if (global.__UNITINFO__ && global.__UNITINFO__["ParentUnitFlg"] === "0" && controlFieldName === "I") {
    return true;
  } else {
    return false;
  }
}

export default HyAuthCom;