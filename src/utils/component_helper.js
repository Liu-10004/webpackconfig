import _ from 'lodash';
import { RemoveSessionItem } from 'Myutilities/sessionstorage_helper.js';
/**
 * 判断组件是否需要渲染
 * @param {*} nextProps
 * @param {*} nextState
 */
function shouldComponentUpdate(nextProps, nextState) {
  if (!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)) {
    return true
  } else {
    return false
  }
}

/**
 * 解密参数，并返回参数对象
 *
 * @returns
 */
function _decryptParams(props) {
  if (props.params && props.params.paramobject && props.params.encryptstr) {
    if (global.__ENCRYPT__.Comparison(props.params.paramobject, props.params.encryptstr)) {
      return JSON.parse(unescape(props.params.paramobject));
    } else {
      //注销操作 删除存储节点
      RemoveSessionItem('tabData');
      RemoveSessionItem('currentTabData');
      RemoveSessionItem('TurnInfo');
      RemoveSessionItem('TurnCount');
      RemoveSessionItem('cacheData');
      RemoveSessionItem('UserData');
      // 跳转到网站根目录
      alert('Parametric parsing error!');
      window.location.replace('/');
    }
  } else {
    return props.params;
  }
}

/**
 * 加密参数，支持穿入字符串和参数对象两种方式
 *
 * @param {any} params
 * @returns
 */
function _encryptParams(params, notEncode) {
  if (!_.isString(params)) {
    params = escape(JSON.stringify(params));
  }
  return global.__ENCRYPT__.Encrypt(params, notEncode);
}

/**
 * 整理当前组件中的props属性，过滤方法，只返回属性
 */
function _packageReProps(props) {
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

export function BaseComponent(component) {
  component.prototype.shouldComponentUpdate = shouldComponentUpdate;
  component.prototype.decryptParams = _decryptParams;
  component.prototype.encryptParams = _encryptParams;
  component.prototype.packageReProps = _packageReProps;
}