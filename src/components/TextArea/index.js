import React, { Component } from 'react';
import _ from 'lodash';
import ClassNames from 'classnames';

import { Label, TextArea } from 'semantic-ui-react';
import PropTypes from 'prop-types';

class HyTextAreaCom extends Component {
  static propTypes = {
    children: PropTypes.node,
    //Primary content
    text: PropTypes.string,
    //title内容
    onClick: PropTypes.func,
    //点击事件
    onChange: PropTypes.func,
    //值改变时
    onFocus: PropTypes.func,
    //焦点事件
    onBlur: PropTypes.func,
    //失去焦点事件
  }
  // Primary content.
  static defaultProps = {
    // 受控字段值
    value: "",
  }

  state = {
    value: _.has(this.props, "value") ? this.props.value : ""
  }

  // 出发blur事件计时器
  timer = null;

  componentWillMount() { }

  componentDidMount() { }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.value, nextProps.value)) {
      
      this.props.showmessage && this.props.showmessage(false, '');
      this.setState({
        value: nextProps.value
      });
    }
  }

  componentWillUnmount() {
    // 清空blur计时器
    clearTimeout(this.timer);
  }

  render() {
    // 分离当前组件使用的属性和子组件使用的属性
    const {
      showmessage,
      children,
      text,
      isMust,
      ...childrenProps
    } = this.props;

    const { value } = this.state;

    const eventProps = {
      onClick: this.props.onClick,
      onChange: this.onChange,
      onFocus: this.props.onFocus,
      onBlur: this.onBlur
    }

    const _className = ClassNames(
      "ui textarea",
      this.props.className,
      { "error": this.props.error }
    );

    if (!_.has(this.props, "text")) {
      return (
        <div className={_className}>
          {children}
          <TextArea key='1' {...childrenProps} {...eventProps} value={value} />
        </div>
      )
    } else {
      return (
        <div className={_className}>
          {isMust ? <div className='form-must'><span>*</span><Label>{text}</Label></div> : <Label>{text}</Label>}
          <TextArea key='2' {...childrenProps} {...eventProps} value={value} />
        </div>
      )
    }
  }

  /**
   * 焦点移开事件
   */
  onBlur = (event, data) => {
    // 清空blur事件计时器
    clearTimeout(this.timer);

    // 如果props中的value和state中的value相同，则不需要上传value
    if (_.isEqual(this.props.value, this.state.value)) {
      return;
    }

    let comValue = null;
    if (!data) {
      const _props = this.packageReProps();
      comValue = {
        ..._props,
        value: this.state.value
      }
    } else {
      comValue = data;
    }
    this.props.onBlur && this.props.onBlur(event, comValue);
  }

  /**
   * 子组件值发生变更时事件
   *
   */
  onChange = (event, data) => {

    // 清空blur事件计时器
    clearTimeout(this.timer);

    this.setState({
      value: data.value
    }, () => {

      // 如果附件的change事件存在，则调用否则延迟500毫秒调用blur事件
      if (this.props.onChange) {
        this.props.onChange(event, data);
      } else {
        this.timer = setTimeout(() => {
          this.props.onBlur && this.props.onBlur(event, data);
        }, 500);
      }
    })
  }
}

export default HyTextAreaCom;