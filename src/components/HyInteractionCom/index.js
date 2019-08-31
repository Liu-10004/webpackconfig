import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react'
import _ from 'lodash';

class HyInteractionCom extends Component {

  static propTypes = {
    // 子节点数据
    children: PropTypes.object.isRequired,
    // 需要提示的内容
    toolTipText: PropTypes.string,
    // 启用点击事件（onClick）
    enableClick: PropTypes.bool,
    // 启用变更事件 (onChange)
    enableChange: PropTypes.bool,
    // 启用焦点离开事件 (onblur)
    enableBlur: PropTypes.bool,
    // 启用获得焦点事件 （onFocus）
    enableFocus: PropTypes.bool,
    // 是否为必输域
    isMust: PropTypes.bool,
    // 查询条件
    // 代表从哪个对象里查找相关的日志数据
    // 用于日志查询使用：accountDto[0]
    findCondition: PropTypes.string,
    // 焦点离开事件
    onBlur: PropTypes.func
  }

  static defaultProps = {
    // 启用点击事件
    enableClick: true,
    // 启用变更事件 (onChange)
    enableChange: true,
    // 启用焦点离开事件 (onblur)
    enableBlur: true,
    // 启用获得焦点事件 （onFocus）
    enableFocus: true
  }

  state = {
    isOpen: false,
    error: false,
    message: ''
  }

  // 出发blur事件计时器
  timer = null;

  componentWillUnmount() {
    // 清空blur计时器
    clearTimeout(this.timer);
  }

  render() {
    // 分离当前组件使用的属性和子组件使用的属性
    const {
      ref,
      children,
      enableClick,
      enableChange,
      enableBlur,
      enableFocus,
      toolTipText,
      isMust,
      findCondition,
      onChange,
      onBlur,
      isHyComponent,
      isNotMust,
      type,
      ...childrenProps
    } = this.props;

    const { message, isOpen } = this.state;
    const error = this.state.error ? true : undefined;

    // 如果子组件不存在则直接返回null
    if (!children) {
      return null;
    }

    // 检查子组件是否为hy组件（非原声和UI框架组件）
    // const isHyComponent = this.checkHyComponent(children);

    // 组装需要克隆的props参数
    const cloneValue = {
      ...childrenProps,
      ref: c => this.childrenComponent = c,
      error,
      onClick: enableClick ? this.onClick : null,
      onFocus: enableFocus ? this.onFocus : null,
      onBlur: enableBlur ? this.onBlur : null,
      onChange: enableChange ? this.onChange : null
    }

    // 根据管控字段判断该字段是否禁用
    const { fieldname } = childrenProps;
    // 获取当前操作类型，如果为N则不进行管控
    const handleTyp = _.has(global.__CONTROLHANDLE__, "handleTyp") ? global.__CONTROLHANDLE__["handleTyp"] : "";
    const mnUnitId = _.has(global.__CONTROLHANDLE__, "unitId") ? global.__CONTROLHANDLE__["unitId"] : "";
    const unitId = global.__UNITINFO__ ? global.__UNITINFO__["UnitUid"] : "";
    if (handleTyp !== "N" && _.has(global.__CONTROLFIELD__, fieldname) && mnUnitId !== "" && unitId !== mnUnitId) {
      cloneValue["disabled"] = true;
    }

    // 如果是hy组件，则添加showmessage属性，便于子组件报错时可以调用该方法弹出出错信息
    if (isHyComponent) {
      cloneValue["showmessage"] = this.showMessage;
      cloneValue["isMust"] = isMust;
    }

    // 克隆子组件
    const childcom = React.cloneElement(children, cloneValue);

    return (
      <Popup
        trigger={childcom}
        position='top center'
        size="mini"
        on="focus"
        open={(isOpen && message) ? true : false}
        onClose={this.handleClose}
        className='input_popup'>
        {toolTipText || message}
      </Popup>
    );
  }

  /**
   * 判断子组件是否为hy组件
   */
  checkHyComponent = (children) => {
    if (_.startsWith(children.type.name, "Hy")) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 处理popup关闭事件
   */
  handleClose = () => {
    if (!this.props.isConstraint || !this.state.error) {
      this.setState({
        isOpen: false
      })
    }
  }

  /**
   * 处理子组件点击事件并设置isOpen属性为true
   * 考虑有些子组件没有焦点，所以采用点击事件来打开提示框
   */
  onClick = (event, data) => {
    this.setState({
      isOpen: true
    }, () => {
      const _data = {
        interactionProps: this.packageReProps(),
        ...data
      }
      this.props.onClick && this.props.enableClick && this.props.onClick(event, _data);
    })
  }

  onChange = (event, data) => {
    // 清空blur事件计时器
    clearTimeout(this.timer);

    // 整理上报的数据
    const _data = {
      interactionProps: this.packageReProps(),
      ...data
    }
    // 如果附件的change事件存在，则调用否则延迟500毫秒调用blur事件
    if (this.props.onChange && this.props.enableChange) {
      this.props.onChange(event, _data);
    } else {
      this.timer = setTimeout(() => {
        this.props.onBlur && this.props.onBlur(event, _data);
      }, 500);
    }
  }
  /**
   * 子组件获取焦点后变更提示框打开状态为true
   */
  onFocus = (event, data) => {
    let target = event.target;
    this.setState({
      isOpen: true
    }, () => {
      const _data = {
        interactionProps: this.packageReProps(),
        ...data,
        target
      }
      this.props.onFocus && this.props.enableFocus && this.props.onFocus(event, _data);
    })
  }

  /**
   * 焦点移开事件
   */
  onBlur = (event, data) => {
    // 清空blur事件计时器
    clearTimeout(this.timer);

    let comValue = null;
    if (!data) {
      comValue = {
        interactionProps: this.packageReProps(),
        value: this.state.value
      }
    } else {
      comValue = data;
    }
    this.props.onBlur && this.props.enableBlur && this.props.onBlur(event, comValue);
  }

  /**
   * 提示错误信息方法
   */
  showMessage = (error, message) => {
    this.setState({ error: error, message: message })
  }
}

export default HyInteractionCom;