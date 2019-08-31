import React, {Component, PropTypes} from 'react';
import _ from 'lodash';

// component tooltip
import { Input, Label, List, Icon ,Popup} from 'semantic-ui-react';
import HyPopupCom from '../popup/index.js';
import { defaultCheckFunction } from './logic';
// css
import './index.less';

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

class HyDataListCom extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      value: (_.has(props, "value") && !_.isNull(props.value) && !_.isUndefined(props.value)) ? props.value : "", //数据列表的值
      listHeight: 0,
      isFocus:true 
    }
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

  componentWillReceiveProps(nextProps) {
    let value = (_.isNull(nextProps.value) || _.isUndefined(nextProps.value) || !_.has(nextProps, "value")) ? "" : nextProps.value;
    if (!_.isEqual(this.props.value, value)
      || !_.isEqual(this.props.checkType, nextProps.checkType)
      || !_.isEqual(this.props.isConstraint, nextProps.isConstraint)
      || !_.isEqual(this.props.checkFunction, nextProps.checkFunction)
      || !_.isEqual(this.props.max, nextProps.max)
      || !_.isEqual(this.props.min, nextProps.min)
      || !_.isEqual(this.props.maxlength, nextProps.maxlength)) {
      const checkValue = this.props.checkFunction(value, nextProps);
      this.props.showmessage && this.props.showmessage(checkValue.error, checkValue.message);
    }

    if (!_.isEqual(this.props.value, nextProps.value)) {
      this.setState({ value: value });
    }
  }

  render() {
    const style = { position: 'absolute' }
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
      list,
      options,
    } = this.props;
    return (
      <Popup
        ref="hydatalistcom1"
        className={'hydatalistcom2'}
        isopen={this.state.open}
        onOpen={this._onOpenHandle}
        onClose={this._onClose}
        position={this.state.position}
        coords={this.state.coords}
        style={style}
        position='bottom right'
        hideOnScroll={true}
        trigger={
          <Input 
            ref={c => this.dropdownCom = c} 
            onChange={this.onChange} 
            onBlur={this.onBlur} 
            onFocus={this.onFocus}
            value={this.state.value}
            disabled={this.props.disabled}>
            {text && !isMust ? <Label>{text}</Label> : null}
            {text && isMust ? <div className='form-must'><span>*</span><Label>{text}</Label></div> : null}
            {this.state.isFocus?<Icon name='caret down'/>: null}
            <input/>
          </Input>
        }>
        {this._getList()}
      </Popup>
    )
  }

  /**
   * 焦点移开事件
   */
  onBlur = (event, data) => {
    

  }

  onFocus = () =>{
    this.setState({
      isFocus: true
    })
  }

  _onOpenHandle = (event, obj) => {
    let listHeight = 0;
    let coords = event.currentTarget.getBoundingClientRect()
    console.log(coords)
    if(coords){
      const {height} = this.getViewPort();
      listHeight = height - coords.bottom - 10;
    }
    this.setState({ open: true, coords: coords, listHeight});
  }

  _onClose = () =>{
    this.setState({ open: false}) 
    if (this.context.setCloseOnDocumentClick) {
      this.context.setCloseOnDocumentClick(true);
    }
  }


  _getList = () =>{
    const {options} = this.props; 
    const stateValue = this.state.value;
    let filterOptions;
    if(stateValue){
      filterOptions = _.filter(options, item => {
        return item.text && item.text.indexOf(stateValue) !== -1;
      })
    }else{
      filterOptions = options;
    }
    return <List className='hydatalistcom-list' style={{maxHeight: this.state.listHeight}}>
      {_.map(filterOptions, option =>{
        const {key, value, text, ...otherOption} = option;
        return <List.Item key={key} onClick={this.onClickItem} {...otherOption}>{text}</List.Item>
      })}
    </List>
  }

  getViewPort () {
    if(document.compatMode == "BackCompat") {   //浏览器嗅探，混杂模式
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        };
    } else {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        };
    }
}

  onClickItem = (e, data) => {
    this.setState({
      value: data.children,
      open: false,
      isFocus: !this.state.isFocus
    },()=>{
      if (this.props.disabled) {
        return;
      }
      // 清空blur事件计时器
      // clearTimeout(this.timer);
  
      // 如果blur时检查是否相同并且props中的value和state中的value相同，则不需要上传value
      if (this.props.blurCheckDiff && _.isEqual(this.props.value, this.state.value)) {
        return;
      }
      const _props = this.packageReProps();
      let comValue = null;
      comValue = {
        ..._props,
        value: this.state.value
      }
      this.props.onBlur && this.props.onBlur(e, comValue);
    
    })
  }
  
  onChange = (e, data) =>{
    if (this.props.disabled) {
      return;
    }
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
      const _props = this.packageReProps();
      let comValue = null;
      comValue = {
        ..._props,
        value: this.state.value
      }
      // 如果附件的change事件存在，则调用否则延迟500毫秒调用blur事件
      if (this.props.onChange) {
        this.props.onChange(e, comValue);
      }
    })
  }




}
export default HyDataListCom;
