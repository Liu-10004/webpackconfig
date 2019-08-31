import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ClassNames from 'classnames';
import HyInteractionCom from '../HyInteractionCom';
import HyAuthCom from '../../hyauthcom';
//import HyTimePickerCom from 'Hycomponents/featurecoms/hytimepickercom';
//import HyBirthDateCom from 'Hycomponents/featurecoms/hybirthdatecom';
//import HyDropDownCom from 'Hycomponents/featurecoms/hydropdowncom';
// import HyDatePickerCom from 'Hycomponents/featurecoms/hydatepickercom';
import HyInputCom from '../Input';
import HyDataListCom from '../Datalist';
import HyTextAreaCom from '../TextArea';
// import HyButtonPaletteCom from 'Hycomponents/featurecoms/hybuttonpalettecom';
import { Button, Label, Form, Checkbox } from 'semantic-ui-react';
import moment from 'moment';



const languageConfig = {

}

Component.prototype.packageReProps= function (props) {
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

class HyFormCom extends Component {

  static propTypes = {
    // 示例：accountNo为字段名
    // {
    //   "accountNo": {
    //     "groupIndex":0,如果开启分组，为分组编号
    //     "type": "", //组件类型：input|timepicker|select|textarea|checkbox|datepicker|button|label
    //     "isMust": true,// 是否必输
    //     "className": "", //样式
    //     "width": 2, // ui框架定义的宽度
    //     "authOptions": {permsCode,authCode},// 权限组件属性：{permsCode：权限代码,authCode:授权代码}
    //     "interactionOptions": {toolTipText,isMust,findCondition,onBlur},// 交互组件属性
    //     "componentOptions": {}// 组件属性
    //   }
    // }
    elements: PropTypes.object,
    // 以选的交互组件
    selectData: PropTypes.object,
    // 表单数据
    formData: PropTypes.object,
    // 开启分组显示 数组元素为ui框架中form.group中的属性
    groupOptions: PropTypes.array,
    // 是否在表单组件中存储表单数据
    saveFormData: PropTypes.bool
  }

  static defaultProps = {
    filterChangeFieldnames: ["timepicker", "select", "checkbox", "datepicker", "button", "buttonpalette", "birthdate","datalist"],
    className: "flex",
    size: "mini",
    saveFormData: true
  }

  state = {
    formData: {}
  }

  componentWillMount() {
    if (_.has(this.props, "formData") && this.props.saveFormData) {
      this.setState({
        formData: this.props.formData || {}
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props.formData, nextProps.formData)) {
      if (nextProps.saveFormData) {
        this.setState({
          formData: nextProps.formData || {}
        })
      }
    }
  }

  render() {
    const { children, elements, formData, groupOptions, ...defaultProps } = this.props;
    const formProps = this.packageReProps(defaultProps);

    let elementComponents = null;
    if (_.size(groupOptions) > 0) {
      elementComponents = this.getGroup(elements, groupOptions);
    } else {
      elementComponents = this.getComponents(elements);
    }

    const classname = ClassNames("ui form", formProps.className, formProps.size);

    return (
      <div className={classname}>
        {elementComponents}
        {children}
      </div>
    );
  }

  getGroup = (elements, groupOptions) => {
    const formgroup = _.map(groupOptions, (item, index) => {
      const components = this.getComponents(elements, index);
      return (
        <Form.Group key={index} {...item}>
          {components}
        </Form.Group>
      )
    });
    return formgroup;
  }

  getComponents = (elements, groupIndex = -1) => {

    let els = {};
    if (groupIndex !== -1) {
      // 根据传入的分组索引筛选表单组件
      _.forEach(elements, (item, index) => {
        if (!_.has(item, "groupIndex") && groupIndex === 0) {
          els[index] = item;
        } else if (item["groupIndex"] === groupIndex) {
          els[index] = item;
        }
      })
    } else {
      els = elements;
    }

    const elementNode = _.map(els, (item, index) => {
      const { type, className, isMust, width, authOptions = {}, interactionOptions = {}, componentOptions = {} } = item;
      const authComProps = {
        key: index,
        className,
        width,
        ...authOptions
      };
      const _interactionOptions = _.cloneDeep(interactionOptions);
      let value = "";
      if (this.props.saveFormData) {
        value = (_.has(this.state.formData, index)
          && !_.isNull(this.state.formData[index])
          && !_.isUndefined(this.state.formData[index])
        ) ? this.state.formData[index] : '';
      }
      else {
        value = (_.has(this.props.formData, index)
          && !_.isNull(this.props.formData[index])
          && !_.isUndefined(this.props.formData[index])
        ) ? this.props.formData[index] : '';
      }

      // 如果类型为datepicker，则默认为强管控字段
      if (type === "datepicker") {
        // 如果是日期选择控件，需要使用强制管控属性
        _interactionOptions["isConstraint"] = true;
        _interactionOptions["value"] = value;
      } else if (type === "checkbox") {
        // 如果是checkbox控件，则需要转换value为checked的bool类型
        _interactionOptions["checked"] = _.trim(value) === "" ? false : value;
      } else {
        _interactionOptions["value"] = value;
      }
      // 所有控件默认添加点击事件处理
      _interactionOptions["onClick"] = this.onClick;

      if (_.includes(this.props.filterChangeFieldnames, type)) {
        // 根据定义判断当前控件是否为需要出发change事件的控件，为其添加对应事件
        _interactionOptions["onChange"] = this.onChange;
      } else if (type === "input" || type === "textarea") {
        // 获取input控件的开启change事件标识
        let enableChange = _.get(_interactionOptions, "enableChange");

        // 如果开启了change标识，则为input控件添加change事件，否则只需要添加blur事件
        if (!_.isUndefined(enableChange) && enableChange) {
          _interactionOptions["onChange"] = this.onChange;
        } else {
          _interactionOptions["enableChange"] = false;
        }
        _interactionOptions["onBlur"] = this.onBlur;

      } else {
        // 其它控件默认添加change和blur事件
        _interactionOptions["onChange"] = this.onChange;
        _interactionOptions["onBlur"] = this.onBlur;
      }

      // 根据参数获取相应组件
      const _component = this[`get${type}Component`](componentOptions, index);

      const isHyComponent = this.getIsHyComponent(type);

      // 如果 付款类别 没有选择微信或支付宝，那么就隐藏 调用接口 选项
      if (index === "online_flg" && !["$", "&"].includes(this.state.formData.pay_genre)) {
        return null;
      }

      return (
        <Form.Field {...authComProps} type={type} control={HyAuthCom}>
          <HyInteractionCom
            ref={(c) => this[index] = c}
            fieldname={index}
            isMust={isMust}
            isHyComponent={isHyComponent}
            {..._interactionOptions} >
            {_component}
          </HyInteractionCom>
        </Form.Field>
      )
    })

    return elementNode;
  }

  //#region 创建组件
  /**
   * 获取input组件
   */
  getinputComponent = (option = {}, fieldname = "") => {
    const selected = _.has(this.props,"selectData") && _.has(this.props.selectData,fieldname) && this.props.selectData[fieldname] ? true : false;
    return <HyInputCom {...option} selected={selected} />
  }

  getdatalistComponent = (option = {}, fieldname = "") => {
    const selected = _.has(this.props,"selectData") && _.has(this.props.selectData,fieldname) && this.props.selectData[fieldname] ? true : false;
    return <HyDataListCom {...option} selected={selected} />
  }

  /**
   * 获取dropdown组件
   */
  // getselectComponent = (option = {}, fieldname = "") => {
  //   let search = true;
  //   let value = null;
  //   const isNotValue = !_.has(option, "value");
  //   if (_.has(option, "multiple") && option.multiple) {
  //     search = false;
  //   }

  //   if (isNotValue && _.has(option, "multiple") && option.multiple) {
  //     value = [];
  //   } else if (isNotValue) {
  //     value = "";
  //   } else {
  //     value = option.value;
  //   }

  //   if (_.has(option.search)) {
  //     search = option.search;
  //   }

  //   const selected = _.has(this.props,"selectData") && _.has(this.props.selectData,fieldname) && this.props.selectData[fieldname] ? true : false;

  //   return <HyDropDownCom {...option} search={search} value={value} selected={selected} />
  // }

  /**
   * 获取timepicker组件
   */
  // gettimepickerComponent = (option = {}, fieldname = "") => {
  //   return <HyTimePickerCom {...option} />
  // }

  /**
   * 获取birthdate组件
   */
  // getbirthdateComponent = (option = {}, fieldname = "") => {
  //   return <HyBirthDateCom {...option} />
  // }

  /**
   * 获取checkbox组件
   */
  getcheckboxComponent = (option = {}, fieldname = "") => {
    const { isMust, showmessage, ...options } = option;
    return <Checkbox
      {...options}
    />
  }

  /**
   * 获取textarea组件
   */
  gettextareaComponent = (option = {}, fieldname = "") => {
    return <HyTextAreaCom {...option} />
  }

  /**
   * 获取日期控件
   */
  // getdatepickerComponent = (option = {}, fieldname = "") => {

  //   const selected = _.has(this.props,"selectData") && _.has(this.props.selectData,fieldname) && this.props.selectData[fieldname] ? true : false;

  //   return <HyDatePickerCom {...option} selected={selected} />
  // }

  /**
   * 获取按钮控件
   */
  getbuttonComponent = (option = {}, fieldname = "") => {
    const { content, ...buttonOptions } = option;
    return <Button {...buttonOptions} >{content}</Button>
  }

  /**
   * 获取label组件
   *
   * @memberof HyFormCom
   */
  getlabelComponent = (option = {}, fieldname = "") => {
    return <Label {...option}></Label>
  }

  /**
   * 获取label组件
   *
   * @memberof HyFormCom
   */
  // getbuttonpaletteComponent = (option = {}, fieldname = "") => {
  //   return <HyButtonPaletteCom {...option}></HyButtonPaletteCom>
  // }
  //#endregion

  //#region 事件处理

  /**
   * 表单内点击事件
   *
   * @memberof HyFormCom
   */
  onClick = (event, data) => {
    this.props.onClick && this.props.onClick(event, data);
  }

  /**
   * 焦点离开事件
   */
  onBlur = (event, data) => {
    // 获取state中的表单数据
    let _value = data.value || data.checked;
    if (_.isUndefined(_value)) {
      _value = "";
    }
    this.setState({
      "formData": {
        ...this.state.formData,
        [data.fieldname]: _value
      }
    }, () => {
      const _data = {
        eventData: data,
        formData: this.state.formData
      }
      this.props.onBlur && this.props.onBlur(event, _data);
    })

  }

  /**
   *
   * @param {*} event
   * @param {*} data
   */
  onChange = (event, data) => {
    let _value = data.value || data.checked;
    if (_.isUndefined(_value)) {
      _value = "";
    }
    this.setState({
      "formData": {
        ...this.state.formData,
        [data.fieldname]: _value
      }
    }, () => {
      const _data = {
        eventData: data,
        formData: this.state.formData
      }
      this.props.onChange && this.props.onChange(event, _data);
    })
  }

  /**
   * 根据类型获取是否为自定义组件
   *
   * @memberof HyFormCom
   */
  getIsHyComponent = (type) => {
    if (type === "checkbox" || type === "button") {
      return false;
    } else {
      return true;
    }
  }
  //#endregion

  //#region 公共方法
  GetValue = () => {
    // 结构传入的form配置属性
    const { elements } = this.props;
    let error = false;

    _.forEach(elements, (item, index) => {
      // 检查表单内的元素是否有发生错误的情况
      if (!error && this[index] && _.has(this[index].state, "error") && this[index].state.error) {
        error = true;
      }
      // 检查表单的必输项目
      if (_.has(item.interactionOptions, "isMust")
        && item.interactionOptions.isMust
        && this[index]
        && (!_.has(this.state.formData, index)
          || _.trim(this.state.formData[index]) === ""
          || _.isUndefined(this.state.formData[index])
          || _.isNull(this.state.formData[index])
          || (_.isArray(this.state.formData[index]) && _.size(this.state.formData[index]) === 0))) {
        // 提示项目为必输域
        this[index].showMessage(true, languageConfig.showMessage);//"该项目为必输域"
        error = true;
      }
    })

    return { error, formData: this.state.formData };
  }
  //#endregion
}


export default HyFormCom;