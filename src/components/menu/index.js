/**
 * 菜单组件组件
 *
 *
    切换酒店点击事件
    onPopupDivSelectHotelClick(event,data)
    切换班次点击事件
    onPopupDivSelectClassClick(event,data)
    菜单点击事件
    onMenuClick(event,data)
 *
 *
**/
import React, { Component } from 'react'
//import { connect } from 'dva';
import PropTypes from 'prop-types';
import { Sidebar, Segment, Menu, Icon, Grid, Popup } from 'semantic-ui-react';
import { BaseComponent } from 'Myutilities/component_helper';
import _ from 'lodash';
import './index.less'
import moment from 'moment';
import HyButtonCom from 'Mycomponents/Button';
// import languageConfig from 'Hylocalize/components/businesscoms/hymenucom';
import { RemoveSessionItem } from 'Myutilities/sessionstorage_helper';

const languageConfig = {

}

const __CHAININFO__ = {
  ChainFlg :'1'
}

const __UNITINFO__ = {
  UnitFlg :'0'
}

const __UNITLIST__ = [
  {
    name:'jinjiang'
  },
  {
    name:'七天'
  }
]
const __USERMENU__ = [
  {
    name:'报表',
    menu_nm:'报表',
    "isuserbtn": 'true',
    children:[
      {menu_nm:'报表1'},
      {menu_nm:'报表2'},
    ]

  },
  {name:'入住统计',menu_nm:'入住统计',},
  {name:'离店统计',menu_nm:'离店统计',}
]

const global = {

}

global.__CHAININFO__ = __CHAININFO__;
global.__UNITINFO__ = __UNITINFO__;
global.__UNITLIST__ = __UNITLIST__;
global.__USERMENU__ = __USERMENU__;


Component.prototype.packageReProps = function (props) {
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

export default class HyMenuMinCom extends Component {
    static propTypes = {
        //自定义样式
        customClassName: PropTypes.string,
        //是否要隐藏展开按钮  true:是  false:不   默认false
        isShowTopBtn: PropTypes.bool,
        //菜单数据
        dataSource: PropTypes.array,
    };

    static defaultProps = {
        dataSource: global.__USERMENU__,
        customClassName: "",
        isShowTopBtn: true,
    };

    state = {
        //弹出菜单定位属性
        position: {
            position: 'absolute',
            display: 'none',
            left: '0px',
            top: '',
            bottom: '',
        },
        //遮罩层属性
        showDivDisplay: 'none',
        //弹出菜单数据源
        secondMenuData: {},
        style: {
            width: '52px',
            height: '300px',
        },
        open: false,
        //菜单激活样式
        active: '',
        //菜单激活属性存储数组
        activeList: [],
        //用户按钮激活标志
        userA: '',
        //切换酒店激活标志
        hotelA: '',
        //存储绑定使用的button组件集合
        keyboardCom: null,
    }

    menuData = [
      
    ]

    /**
     * 组件将要渲染时
     *
     * @memberof HymenuCom
     */
    componentWillMount() {
    }

    /**
     * 组件渲染完成时
     *
     * @memberof HymenuCom
     */
    componentDidMount() {
        let _height = document.body.clientHeight;
        console.log('_height',_height)
        let menuData = this.menuData;
        let _activeList = [];
        let coms = [];
        //"keyboard": global.__SHORTKEYMAP__[""]
        coms.push(<HyButtonCom name={'SelectHotel'} keyboard="GC02" key={`SelectHotel`} onClick={this.onPopupDivSelectHotelClick} >{'切换酒店'}</HyButtonCom>);
        coms.push(<HyButtonCom name={'SelectClass'} keyboard="GC03" key={`SelectClass`} onClick={this.onPopupDivSelectClassClick} >{'切换班次'}</HyButtonCom>);
        coms.push(<HyButtonCom name={'Help'} key={`Help`}>{'Help'}</HyButtonCom>);
        coms.push(<HyButtonCom name={'updatePassWord'} keyboard="GF19" key={`updatePassWord`} onClick={(event) => { this._onClick(event, { menu_key: "updatePassWord" }, this.state.secondMenuData.children ? true : false) }}>{'修改密码'}</HyButtonCom>);
        coms.push(<HyButtonCom name={'refurbishInfo'} keyboard="GF20" key={`refurbishInfo`} onClick={(event) => { this._onClick(event, { menu_key: "refurbishInfo" }, this.state.secondMenuData.children ? true : false) }}>{'刷新参数'}</HyButtonCom>);
        coms.push(<HyButtonCom name={'out'} keyboard="GF21" key={`out`} onClick={(event) => { this._onClick(event, { menu_key: "out" }, this.state.secondMenuData.children ? true : false) }}>{'注销'}</HyButtonCom>);
        if (menuData) {
            _.forEach(menuData, (item, index) => {
                _activeList.push("");
                coms.push(<HyButtonCom name={item.menu_id} key={`${item.menu_id}-${index}`}>{item.menu_nm}</HyButtonCom>);
                _.forEach(item.children, (item, index) => {
                    coms.push(<HyButtonCom name={item.menu_id} key={`${item.menu_id}-${index}`}>{item.menu_nm}</HyButtonCom>);
                })
            })
        }
        console.log(_activeList)
        let _user = document.querySelector('.User');
        this.bottom
        let _userBtn = _user.getBoundingClientRect();
        this.bottom = _userBtn.bottom;
        console.log(_user,'--------')
        console.log('this1',this);
        this.setState({
            style: {
                width: '52px',
                height: `${_height}px`
            },
            activeList: _activeList,
            keyboardCom: coms,
        })
    }

    /**
     * 组件Prop改变时
     *
     * @param {any} nextProps
     * @memberof HymenuCom
     */
    componentWillReceiveProps(nextProps) {

    }


    /**
     * 组件将要更新
     *
     * @param {any} nextProps
     * @param {any} nextState
     * @memberof HymenuCom
     */
    componentWillUpdate(nextProps, nextState) {

    }

    /**
     * 组件更新完成时
     *
     * @param {any} prevProps
     * @param {any} prevState
     * @memberof HymenuCom
     */
    componentDidUpdate(prevProps, prevState) {

    }

    /**
     * 组件注销时
     *
     * @memberof HymenuCom
     */
    componentWillUnmount() { }


    //渲染函数
    render() {
        //菜单位置控制
        const _className = `HymenuCom left ${this.props.customClassName || ''}`;
        let vertical = true;
        let _style = _.clone(this.state.style);
        return (
            <div className={_className} style={_style}>
                <Sidebar.Pushable as={Segment} >
                    <Sidebar as={Menu} width='thin' direction={'left'} visible={true} vertical={vertical} >
                        {this.getTopBtnCom()}
                        <div className='Bottom-LineTophotel' onMouseOver={this._close}></div>
                        {this.getMenuTitleCom()}
                        <div className='Bottom-LineTop' onMouseOver={this._close}></div>
                        {this.getMenuMainItem()}
                        <Menu.Item onMouseOver={this._close} ></Menu.Item>
                    </Sidebar>
                </Sidebar.Pushable>
                <div className='Bottom-Line' onMouseOver={this._close}></div>
                {this.getBottomMenuCom()}
                <div style={{
                    'height': this.state.style.height,
                    'display': this.state.showDivDisplay
                }} onMouseOver={(event) => { this._close(event, 'showdiv') }} className='ShowMenu'>
                    {this.getSecondMenu()}
                </div>
                <div className='keyboard-none'>
                    {this.state.keyboardCom}
                </div>
            </div>
        );
    }




    /**
     * 鼠标移入一级菜单事件
     *
     * @memberof HyMenuCom
     */
    _onMouseOver = (event, index, item) => {
        //获取当前菜单项位置属性
        let obj = event.currentTarget.getBoundingClientRect();
        //获取当前弹出菜单数据
        let _tempData = item;
        //获取可视高度
        let clientHeight = document.body.clientHeight;
        //计算剩余显示位置
        let temp = _.subtract(clientHeight, obj.top);
        //计算弹出菜单高度
        let iHeight = _.multiply(40, _.size(_tempData.children ? _tempData.children : 1));
        if (_.size(_tempData.children) !== 0) {
            iHeight = iHeight + 40;//加上标题的高度
        }
        //赋值位置信息
        console.log('obj',obj)
        let _top = obj.top;
        //let _bottom = obj.bottom;
        //如果弹出菜单高度大于剩余高度则弹出菜单在底部显示  否则和左侧并列显示
        if (temp <= iHeight) {
            _top = 'auto';
            _bottom = `${0}px`
        }

        let menuData = global.__USERMENU__;
        let _activeList = [];
        if (menuData) {
            _.forEach(menuData, (item, index) => {
                _activeList.push("");
            })
        }
        _activeList[index] = 'A';
        console.log('this2',this);
        // 鼠标进入时，开始往 二级菜单中灌入数据
        this.setState({
            secondMenuData: _tempData
        }, () => {
            //设置数据源后进行定位属性设置
            this.setState({
                position: {
                    ...this.state.position,
                    display: 'block',
                    height: iHeight,
                    top: _top,
                    //bottom: _bottom,
                },
                showDivDisplay: 'block',
                activeList: _activeList,
            },()=>{
              console.log(this.state)
            })
        })
    }


    /**
     * 鼠标移出弹出菜单事件
     *
     * @memberof HyMenuCom
     */
    _onMouseOut = (event, index, item) => {
        this._close();
    }


    /**
     * 弹出菜单点击事件
     *
     * @memberof HyMenuCom
     * 第三个参数是  判断是否有下一级级菜单，如果有下一级菜单，点击就不生效；如果没有，才能生效
     */
    
    _onClick = async (event, data, colse) => {
        if (data.menu_key === 'updatePassWord') { //修改密码
            this.props.dispatch({
                type: "SystemModel/updateModalWindowState",
                key: "01321010A010LP10101",
                title: languageConfig.updatepw,
                size: 'mini',
                params: {
                },
            })
        } else if (data.menu_key === 'refurbishInfo') { //刷新参数
            await RemoveSessionItem("DictionaryData");
            window.location.reload();
        } else if (data.menu_key === 'out') { //注销
            await global.__LOGOUT__();
        } else if (data.menu_nm === "admin") { //点击工作站
            let wsno = global.__WSNO__;
            let wsstate = global.__WSSTATE__;
            const _encryptStr = global.__ENCRYPT__.Encrypt(escape(JSON.stringify(
                {
                    "wsno": wsno, //工作站信息 '0':未配置 '1':已配置
                    "wsstate": wsstate, // 硬件接口主服务 '0':未安装  '1':已安装
                })));
            let url= `0132/80/00/A/011/L/T/004/01/${_encryptStr.orgData}/${_encryptStr.encryptData}`;

            let data = {
                children: [],
                id: -3,
                keymemo: "",
                memo: "",
                menu_cd: "M9010",
                menu_disp_flg: "1",
                menu_icon: "icon1",
                menu_id: -3,
                menu_nm: 'gzz',
                menu_typ: "1",
                menu_url: url,
                parent_menu_id: -3,
                perm_status_flg: "",
                right_cls: "10",
                seq: "10",
                shortkey: "",
                shortkey_cd: "",
                shortkey_drpt: "",
                shortkey_id: "",
                shortkey_typ: "",
                shortkeygrp_cd: "",
                shortkeygrp_drpt: "",
                shortkeygrp_id: "",
                status_flg: "1",
                sys_flg: "1",
                sysid: "GRP",
                use_num: 1,
                version: "",
            };

            if (this.props.onMenuClick) {
                this.props.onMenuClick(event, data);
            }
            this._close();
        } else {
            if (this.props.onMenuClick && !colse) {
                this.props.onMenuClick(event, data);
            }
        }
        if (!colse) {
            this._close();
        }
    }


    /**
     * 关闭弹出菜单
     *
     * @memberof HyMenuCom
     */
    _close = (event, key) => {
        let menuData = this.menuData;
        let _activeList = [];
        if (menuData) {
            _.forEach(menuData, (item, index) => {
                _activeList.push("");
            })
        }
        // TODO: 
        this.setState({
            secondMenuData: {}
        }, () => {
            this.setState({
                position: {
                    ...this.state.position,
                    display: 'none',
                    top: '',
                    bottom: '',
                },
                showDivDisplay: 'none',
                activeList: _activeList,
                userA: '',
                hotelA: '',
            })
        })
    }

    _closeGrid = (event) => {
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * 一级菜单点击事件
     * 如果一级菜单菜单下没有子菜单才返回方法
     * @memberof HyMenuCom
     */
    _onClickFirst = (event, data) => {
        if (!data.children) {
            if (this.props.onMenuClick) {
                this.props.onMenuClick(event, data);
            }
            this._close();
        }
    }


    /**
     * 用户按钮鼠标移入事件
     *
     * @memberof HyMenuMinCom
     */
    _onMouseOverUser = (event) => {
        let data = {
            "menu_icon": "Setting",
            "menu_nm": '设置',
            "isuserbtn": 'true',
            "children": [{
                "menu_url": "availabilitylistrouter/0/0",
                "menu_nm": '更新密码',
                "menu_key": "updatePassWord"
            }, {
                "menu_url": "availabilitylistrouter/0/0",
                "menu_nm": '刷新一下',
                "menu_key": "refurbishInfo"
            }, {
                "menu_url": "availabilitylistrouter/0/0",
                "menu_nm": '退出登录',
                "menu_key": "out"
            }],
        }
        this.setState({
            secondMenuData: data
        }, () => {
            //设置数据源后进行定位属性设置
            this.setState({
                position: {
                    ...this.state.position,
                    display: 'block',
                    height: 160,
                    top: 'auto',
                    bottom: '0px'
                },
                showDivDisplay: 'block',
                userA: 'A',
            })
        })
    }

    /**
     * 获取菜单顶部展开按钮
     *
     * @memberof HymenuCom
     */
    getTopBtnCom = () => {
        if (!this.props.isShowTopBtn) {
            return (<div name='topBtn' className='IsShowTopBtn' onMouseOver={this._close} onClick={this._onClickShow} >
                <Icon name='indent' className='Indent' >topBtn</Icon>
            </div>);
        } else {
            return null;
        }
    }

    /**
     * 菜单标题生成
     *
     * @memberof HymenuCom
     */
    getMenuTitleCom = () => {
        let _loginType = -1;
        //ChainFlg 0单店  1集团
        //UnitFlg  0集团  1单店
        if (global.__CHAININFO__.ChainFlg === '1' && global.__UNITINFO__.UnitFlg === '0') { //unit001
            //集团登陆
            _loginType = 0;
        } else if (global.__CHAININFO__.ChainFlg === '1' && global.__UNITINFO__.UnitFlg === '1') {//unit002
            //单店登陆
            _loginType = 1;
        } else if (global.__CHAININFO__.ChainFlg === '0' && global.__UNITINFO__.UnitFlg === '1') {//HTGRP
            //单体酒店(单身狗)
            _loginType = 2;
        }
        console.log('_loginType',_loginType);
        let classSelectCom = null;
        if (Number(global.__CHAININFO__.ChainFlg) === 0 || (Number(global.__CHAININFO__.ChainFlg) === 1 && Number(global.__UNITINFO__.UnitFlg) === 1)) {
            if (_.size(this.props.turnInfo) > 0) {
                classSelectCom = (<Popup position='right center'
                    style={{ right: 'auto', left: '52px', top: ((_loginType === 0 || _loginType === 1) && _.size(this.props.turnInfo) > 0 && _.size(global.__UNITLIST__) > 1) ? '81px' : '46px', }}
                    className='Menu-Popup'
                    trigger={
                        <div className='info' onMouseOver={this._close} title={_.size(this.props.turnInfo) > 0 ? `${this.props.turnInfo.turnDrpt} ${this.props.turnInfo.turnTm} ` : ''} >
                            <span className='info-span'>
                                {_.size(this.props.turnInfo) > 0 ? this.props.turnInfo.turnDrpt : ''}
                            </span>
                            {moment(global.__BUSINESSDT__).format('MM/DD')}
                        </div>
                    }
                    flowing
                    hoverable>
                    <div onClick={this.onPopupDivSelectClassClick}>
                        {languageConfig.selectClass}
                    </div>
                </Popup>);
            } else {
                //班次不存在
                classSelectCom = <div className='infoDiv' onMouseOver={this._close} >
                    {moment(global.__BUSINESSDT__).format('MM/DD')}</div>
            }
        } else {
            //班次不存在
            classSelectCom = <div className='infoDiv' onMouseOver={this._close} >
                {moment(global.__BUSINESSDT__).format('MM/DD')}</div>
        }

        let hotelSelect = null;
        //判断有下属酒店才显示切换酒店图标
        if ((_loginType === 0 || _loginType === 1) && _.size(global.__UNITLIST__) > 1) {
            hotelSelect = (<Popup position='right center' style={{ right: 'auto', left: '52px', top: '46px', }}
                className='Menu-Popup'
                flowing
                hoverable
                trigger={
                    <div onMouseOver={this.hotelonMouseOver} title={global.__UNITINFO__ ? global.__UNITINFO__.UnitNm : ''} >
                        <HyButtonCom icon style={{ 'height': '35px' }} >
                            <Icon className={`icon16 img76${this.state.hotelA}`} />
                        </HyButtonCom>
                    </div>
                }>
                <div onClick={this.onPopupDivSelectHotelClick}>
                    选择酒店
                </div>
            </Popup>);

        }
        return (
            <div>
                {hotelSelect}
                {classSelectCom}
            </div>
        );

    }


    /**
     * 切换酒店点击事件
     *
     * @memberof HyMenuMinCom
     */
    onPopupDivSelectHotelClick = (event, data) => {
      // 如果父级有 onPopupDivSelectHotelClick 事件，就调用父级的事件
        if (this.props.onPopupDivSelectHotelClick) {
            this.props.onPopupDivSelectHotelClick(event, data);
        }
        this._close();
    }
    /**
     * 切换班次点击事件
     *
     * @memberof HyMenuMinCom
     */
    onPopupDivSelectClassClick = (event, data) => {
        if (this.props.onPopupDivSelectClassClick) {
            this.props.onPopupDivSelectClassClick(event, data);
        }
        this._close();
    }

    /**
     * 获取菜单主体按钮
     *
     * @memberof HyMenuCom
     */
    getMenuMainItem = () => {
        let menuItem = [];
        let _activeList = _.cloneDeep(this.state.activeList);
        const menuData = global.__USERMENU__;
        if (menuData) {
            _.forEach(menuData, (item, index) => {
                let _className = `ItemStyle-left${_activeList[index]}`; // imageDiv ${item.menu_icon}`;
                // 鼠标划入时候，计算二级菜单的高度和位置。
                let _item = <Menu.Item key={index} onMouseOver={(event) => this._onMouseOver(event, index, item)}
                    onClick={(event, data) => { this._onClickFirst(event, item) }}
                    {...item}
                    className={_className}>
                    <HyButtonCom icon>
                        <Icon className={`icon16 ${item.menu_icon}${_activeList[index]}`} >{item.name}</Icon>
                    </HyButtonCom>
                </Menu.Item>
                menuItem.push(_item);
            })
        }
        return menuItem;
    }

    /**
     * 帮助按钮点击事件
     *
     * @memberof HyMenuOpenCom
     */
    helpClick = (event) => {
        //跳转路由方法
        this.props.dispatch({ type: "SystemRouterModel/push", url: `0131/10/10/A/090/L/T/001/01/0/0`, tabIndex: 1 })
        //关闭菜单
        this._close();
    }


    /**
     * 获取菜单底部按钮
     *
     * @memberof HyMenuCom
     */
    getBottomMenuCom = () => {
        return (
            <div className='bottom-div' >
                <Menu.Item key='help' className={`bottom-div-item imageDiv Help`} onMouseOver={this._close}  >
                    <HyButtonCom icon onClick={this.helpClick}>
                        <Icon className='icon16 img88'>?</Icon>
                    </HyButtonCom>
                </Menu.Item>
                <Menu.Item key='usercircle' ref='usercircle' className={`bottom-div-item${this.state.userA} imageDiv User`} onMouseOver={this._onMouseOverUser}  >
                    <HyButtonCom icon>
                        {global.__WSNO__ === '' || global.__WSNO__ === null || global.__WSNO__ === undefined ? <Icon className={`img180`} /> : null}
                        <Icon className={`icon16 img89${this.state.userA}`}>show</Icon>
                    </HyButtonCom>
                </Menu.Item>
            </div>
        )
    }


    hotelonMouseOver = () => {
        this.setState({
            hotelA: 'A',
        })
    }


    /**
     * 获取弹出菜单组件
     *
     * @memberof HyMenuCom
     */
    getSecondMenu = () => {
        let wsNo = '';
        let _children = [];

        let _state = (_.trim(global.__WSNO__) === '' || _.trim(global.__WSSTATE__) === '') ? true : false;
        let titlmenuClass = 'childrenItemTitle';
        if (_.size(this.state.secondMenuData.children) <= 0) {
            titlmenuClass = 'childrenItemTitleOne'
        }

        if (this.state.secondMenuData.isuserbtn === 'true') {
            wsNo = global.__WSNM__ || '没有编号';
            _children.push(<Grid.Column  {...this.state.secondMenuData} textAlign='left' key={-1} className='childrenItemUserTitle' onClick={(event) => { this._onClick(event, this.state.secondMenuData, this.state.secondMenuData.children ? true : false) }} >
                {this.state.secondMenuData.menu_nm}
                <div title={wsNo} className='wsNo'>{_state ? <Icon className={`img180 headImage`} /> : null}{wsNo}</div>
            </Grid.Column>);
        } else {
            //如果有二级菜单再去渲染，没有的话就别渲染了
            this.state.secondMenuData.children&&_children.push(<Grid.Column  {...this.state.secondMenuData} textAlign='left' key={-1} className={titlmenuClass} onClick={(event) => { this._onClick(event, this.state.secondMenuData, this.state.secondMenuData.children ? true : false) }} >
                {this.state.secondMenuData.menu_nm}
            </Grid.Column>);
        }
        if (this.state.secondMenuData.children) {
            _.forEach(this.state.secondMenuData.children, (citem, i) => {
                let children_temp = <Grid.Column {...citem} key={i} textAlign='left' className='childrenItem' onClick={(event) => { this._onClick(event, citem, false) }} >
                    {citem.menu_nm || ''}
                </Grid.Column>
                _children.push(children_temp);
            })
        }
        return (<Grid centered divided columns={1} style={this.state.position} onMouseOver={(event) => { this._closeGrid(event, 'Grid') }} >
            {_children}
        </Grid>)
    }
}

function mapStateToProps({ SystemOperatorModel }) {
    return {
        turnInfo: SystemOperatorModel.turnInfo
    };
}

// export default connect(mapStateToProps)(HyMenuMinCom);
