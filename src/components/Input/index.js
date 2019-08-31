import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { defaultCheckFunction } from './logic';
import { Label, Input, Icon, Checkbox } from 'semantic-ui-react';

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

class HyInputCom extends Component {

  static propTypes = {
    // 是否对输入的内容进行校验强管控
    isConstraint: PropTypes.bool,
    // 校验函数，如过不传使用默认校验,返回一个校验对象{error: bool, message: string}
    checkFunction: PropTypes.func,
    // 校验类型，校验函数不传的情况下使用以下默认的校验类型进行校验
    checkType: PropTypes.oneOf([
      // 整数
      "integer",
      // 非零整数
      "integernzero",
      // 正整数
      "zhinteger",
      // 非零正整数
      "zhintegernzero",
      // 负整数
      "fuinteger",
      // 非零负整数
      "fuintegernzero",
      // 浮点数
      "float",
      // 非零浮点数
      "floatnzero",
      // 正浮点数
      "zhfloat",
      // 非零正浮点数
      "zhfloatnzero",
      // 负浮点数
      "fufloat",
      // 非零负浮点数
      "fufloatnzero"
    ]),
    // 是否开启checkbox
    enableCheckBox: PropTypes.bool,
    // 组件是否被选中
    selected: PropTypes.bool,
    // 最大值（值不为NaN有效）
    max: PropTypes.number,
    // 最小值（值不为NaN有效）
    min: PropTypes.number,
    // 最大长度（值不为Null有效）
    maxlength: PropTypes.number,
    //鼠标离开时是否检查在值改变的时候触发blur
    blurCheckDiff: PropTypes.bool
  }

  static defaultProps = {
    // 默认校验方法
    checkFunction: (value, conditions) => defaultCheckFunction(value, conditions),
    // 受控字段值
    value: "",
    error: false,
    isConstraint: false,
    enableCheckBox: false,
    selected: false,
    blurCheckDiff: true
  }

  state = {
    value: (_.has(this.props, "value") && !_.isNull(this.props.value) && !_.isUndefined(this.props.value)) ? this.props.value : ""
  }
  // 出发blur事件计时器
  // timer = null;

  componentWillMount() { }

  componentDidMount() {
    // const checkValue = this.props.checkFunction(this.state.value, this.props);
    // this.props.showmessage && this.props.showmessage(checkValue.error, checkValue.message);
  }

  componentWillReceiveProps(nextProps) {
    let value = (_.isNull(nextProps.value) || _.isUndefined(nextProps.value) || !_.has(nextProps, "value")) ? "" : nextProps.value;
    if (!_.isEqual(this.props.value, value)
      || !_.isEqual(this.props.checkType, nextProps.checkType)
      || !_.isEqual(this.props.isConstraint, nextProps.isConstraint)
      || !_.isEqual(this.props.checkFunction, nextProps.checkFunction)
      || !_.isEqual(this.props.max, nextProps.max)
      || !_.isEqual(this.props.min, nextProps.min)
      || !_.isEqual(this.props.isMust, nextProps.isMust)
      || !_.isEqual(this.props.maxlength, nextProps.maxlength)) {
      const checkValue = this.props.checkFunction(value, nextProps);
      this.props.showmessage && this.props.showmessage(checkValue.error, checkValue.message);
    }

    if (!_.isEqual(this.props.value, nextProps.value)) {
      this.setState({ value: value });
    }
  }

  componentWillUpdate(nextProps, nextState) { }

  componentDidUpdate(prevProps, prevState) { }

  componentWillUnmount() {
    // 清空blur计时器
    // clearTimeout(this.timer);
  }

  render() {
    // 分离当前组件使用的属性和子组件使用的属性
    const {
      children,
      checkFunction,
      isConstraint,
      checkType,
      showmessage,
      max,
      min,
      maxlength,
      text,
      isMust,
      signs,
      enableCheckBox,
      selected,
      list,
      options,
      ...childrenProps
    } = this.props;

    const checked = enableCheckBox && selected ? true : false;

    const { value } = this.state;

    const eventProps = {
      onClick: this.props.onClick,
      onChange: this.onChange,
      onFocus: this.props.onFocus,
      onBlur: this.onBlur
    }

    if (!_.has(childrenProps, "type")) {
      childrenProps["type"] = "text";
    }
    // 根据props-渲染不同结构的input
    if (!_.has(this.props, "text") && !signs && !isMust) {
      return (
        <Input {...childrenProps} {...eventProps} value={value}>
          {
            enableCheckBox ? <Checkbox className="input-checkbox-div" checked={checked} onClick={this.onCheckBoxClick.bind(this)} /> : null
          }
        </Input>
      );
    } else if (!signs) {
      if (!_.has(childrenProps, "inline")) {
        childrenProps["inline"] = "true";
      }
      return (
        <Input {...childrenProps} {...eventProps} value={value}>
          {text && isMust ? <div className='form-must'><span>*</span><Label>{text}</Label></div> : <Label>{text}</Label>}
          {
            enableCheckBox ? <Checkbox className="input-checkbox-div" checked={checked} onClick={this.onCheckBoxClick.bind(this)} /> : null
          }
          <input />
        </Input>
      )
    } else {
      let _className = _.size(signs) === 1 ? "icon" : "icon2";
      _className = childrenProps.className + ` ${_className}`
      return (
        <Input icon {...childrenProps} className={_className} {...eventProps} value={value}>
          {text && !isMust ? <Label>{text}</Label> : null}
          {text && isMust ? <div className='form-must'><span>*</span><Label>{text}</Label></div> : null}
          {
            enableCheckBox ? <Checkbox className="input-checkbox-div" checked={checked} onClick={this.onCheckBoxClick.bind(this)} /> : null
          }
          <input />
          {
            _.map(signs, (item, index) => {
              let _className = `icon${index + 1}`;
              _className = item.className + ` ${_className}`;
              return <Icon key={index} {...item} className={_className} onClick={this.onClick.bind(this, index)} />;
            })
          }
        </Input>
      )
    }
  }

  /**
   * 焦点移开事件
   */
  onBlur = (event, data) => {
    if (this.props.disabled) {
      return;
    }
    // 清空blur事件计时器
    // clearTimeout(this.timer);

    // 如果blur时检查是否相同并且props中的value和state中的value相同，则不需要上传value
    if (this.props.blurCheckDiff && _.isEqual(this.props.value, this.state.value)) {
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
    if (this.props.disabled) {
      return;
    }
    // 清空blur事件计时器
    // clearTimeout(this.timer);

    // 如果props中的value和data中的value相同，则不需要上传value
    // if (_.isEqual(this.props.value, data.value)) {
    //   return;
    // }

    // 根据传入的校验条件对变更的值进行校验
    const checkValue = this.props.checkFunction(data.value, this.props);

    if (this.props.isConstraint && checkValue.error) {
      return;
    }

    // 更新管控value并且调用父组件的change事件
    this.setState({
      value: data.value
    }, () => {
      // 判断上次的错误状态和本次的错误状态是否一致，不一致则上报错误状态
      if (!_.isEqual(checkValue.error, this.props.error)) {
        this.props.showmessage && this.props.showmessage(checkValue.error, checkValue.message)
      }
      // 如果附件的change事件存在，则调用否则延迟500毫秒调用blur事件
      if (this.props.onChange) {
        this.props.onChange(event, data);
      } else {
        // this.timer = setTimeout(() => {
        //   const _event = {
        //     ...event,
        //     eventType: "onChange"
        //   }
        //   this.props.onBlur && this.props.onBlur(_event, data);
        // }, 500);
      }
    })
  }

  /**
   * icon点击事件
   *
   * @memberof HyInputCom
   */
  onClick = (index, event, data) => {
    if (this.props.disabled) {
      return;
    }
    this.props.onClick && this.props.onClick(event, { ...data, type: "icon", index: index });
  }

  /**
   * 点击checkbox触发
   *
   * @memberof HyInputCom
   */
  onCheckBoxClick = (event, data) => {
    if (this.props.disabled) {
      return;
    }
    this.props.onClick && this.props.onClick(event, { ...data, type: "checkbox" });
  }
}

export default HyInputCom;