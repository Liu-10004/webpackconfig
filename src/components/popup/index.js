
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Portal } from 'semantic-ui-react';
import normalizeTarget from './eventStack/normalizeTarget';
import EventTarget from "./eventStack/EventTarget";
import { isBrowser } from './logic';

import _ from 'lodash'

export const POSITIONS = [
    'top left',
    'left center',
    'top right',
    'bottom right',
    'bottom left',
    'right center',
    'left on',
    'top center',
    'bottom center',
];

class HyPopupCom extends Component {
    static propTypes = {
        children: PropTypes.node,
        // Primary content.
        className: PropTypes.string,
        //在滚动窗口时隐藏弹出窗口。
        hideOnScroll: PropTypes.bool,
        //hoverable bool 是否弹出窗口不应该关闭。
        hoverable: PropTypes.bool,
        //打开还是关闭
        isopen: PropTypes.bool,
        //位置 top left、top right、bottom right、bottom left、right center、left center、top center、bottom center
        position: PropTypes.string,
        //要在定义弹出窗口的地方呈现元素。
        trigger: PropTypes.node,
        //关闭时的回调函数
        onClose: PropTypes.func,
        //打开的回调
        onOpen: PropTypes.func,
    }

    constructor(props) {
        super(props);
        this._targets = new Map()
      }

    state = {
        position: this.props.position,
        isopen: this.props.isopen,
        style: {},
    }
    static defaultProps = {
        // 受控字段值
        position: 'top left',
        hideOnScroll: true
    }

    scrollTarget = document.getElementById("root")
    handleOpen = (event, data) => {
        if (this.props.onOpen) {
            return this.props.onOpen(event, data);
        }
    }
    // handleClose = (event, data) => {
    //     if (this.props.onClose) {
    //         return this.props.onClose(event, data);
    //     }
    //     this.setState({ open: false })
    // }

    handleonMount = () => {
        if (this.props.onMount) {
            return this.props.onMount();
        }
    }

    handleonUnmount = () => {
        if (this.props.onUnmount) {
            return this.props.onUnmount();
        }
    }

    isStyleInViewport = (style) => {
        const { pageYOffset, pageXOffset } = window
        const { clientWidth, clientHeight } = document.documentElement
        const element = {
            top: style.top,
            left: style.left,
            width: this.popupCoords.width,
            height: this.popupCoords.height,
        }
        if (_.isNumber(style.right)) {
            element.left = clientWidth - style.right - element.width
        }
        if (_.isNumber(style.bottom)) {
            element.top = clientHeight - style.bottom - element.height
        }

        // hidden on top
        if (element.top < pageYOffset) return false
        // hidden on the bottom
        if (element.top + element.height > pageYOffset + clientHeight) return false
        // hidden the left
        if (element.left < pageXOffset) return false
        // hidden on the right
        if (element.left + element.width > pageXOffset + clientWidth) return false

        return true
    }

    setPopupStyle = () => {
        if (!this.props.coords || !this.popupCoords) return

        let position = this.props.position;
        let style = this.computePopupStyle(position);
        const positions = _.without(POSITIONS, position).concat([position])
        for (let i = 0; !this.isStyleInViewport(style) && i < positions.length; i += 1) {
            style = this.computePopupStyle(positions[i])
            position = positions[i]
        }

        style = _.mapValues(style, value => (_.isNumber(value) ? `${value}px` : value))
        this.setState({ style, position })
    }

    computePopupStyle = (positions) => {
        const style = {};
        //const { offset } = this.props;
        const { pageYOffset, pageXOffset } = window
        const { clientWidth, clientHeight } = document.documentElement

        if (_.includes(positions, 'right')) {
            style.right = Math.round(clientWidth - (this.props.coords.right + pageXOffset))
            style.left = 'auto'
        } else if (_.includes(positions, 'left')) {
            style.left = Math.round(this.props.coords.left + pageXOffset)
            style.right = 'auto'
        } else { // if not left nor right, we are horizontally centering the element
            const xOffset = (this.props.coords.width - this.popupCoords.width) / 2
            style.left = Math.round(this.props.coords.left + xOffset + pageXOffset)
            style.right = 'auto'
        }

        if (_.includes(positions, 'top')) {
            style.bottom = Math.round(clientHeight - (this.props.coords.top + pageYOffset))
            style.top = 'auto'
        } else if (_.includes(positions, 'bottom')) {
            style.top = Math.round(this.props.coords.bottom + pageYOffset)
            style.bottom = 'auto'
        } else if (_.includes(positions, 'on')) {
            style.top = Math.round(this.props.coords.top)
            style.bottom = 'auto'
            const xOffset = this.popupCoords.width
            if (_.includes(positions, 'right')) {
                style.right -= xOffset
            } else {
                style.left -= xOffset
            }
        }
        else { // if not top nor bottom, we are vertically centering the element
            const yOffset = (this.props.coords.height + this.popupCoords.height) / 2
            style.top = Math.round((this.props.coords.bottom + pageYOffset) - yOffset)
            style.bottom = 'auto'

            const xOffset = this.popupCoords.width + 8
            if (_.includes(positions, 'right')) {
                style.right -= xOffset
            } else {
                style.left -= xOffset
            }
        }

        return style
    }

    handlePopupRef = (popupRef) => {
        popupRef = ReactDOM.findDOMNode(popupRef);
        this.popupCoords = popupRef ? popupRef.getBoundingClientRect() : null
        this.setPopupStyle()
    }

    getPortalProps = () => {
        const portalProps = {}

        const { on, hoverable } = this.props
        const normalizedOn = _.isArray(on) ? on : [on]

        if (hoverable) {
            portalProps.closeOnPortalMouseLeave = true
            portalProps.mouseLeaveDelay = 300
        }
        if (_.includes(normalizedOn, 'click')) {
            portalProps.openOnTriggerClick = true
            portalProps.closeOnTriggerClick = true
            portalProps.closeOnDocumentClick = true
        }
        if (_.includes(normalizedOn, 'focus')) {
            portalProps.openOnTriggerFocus = true
            portalProps.closeOnTriggerBlur = true
        }
        if (_.includes(normalizedOn, 'hover')) {
            portalProps.openOnTriggerMouseEnter = true
            portalProps.closeOnTriggerMouseLeave = true
            // Taken from SUI: https://git.io/vPmCm
            portalProps.mouseLeaveDelay = 70
            portalProps.mouseEnterDelay = 50
        }

        return portalProps
    }

    _find = (target, autoCreate = true) => {
        const normalized = normalizeTarget(target)

        if (this._targets.has(normalized)) return this._targets.get(normalized);
        if (!autoCreate) return

        const eventTarget = new EventTarget(normalized);
        this._targets.set(normalized, eventTarget);

        return eventTarget
      }

      _remove = (target) => {
        const normalized = normalizeTarget(target)

        this._targets.delete(normalized)
      }

      // ------------------------------------
      // Pub/sub
      // ------------------------------------

      sub = (name, handlers, options = {}) => {
        if (!isBrowser()) return

        const { target = document, pool = 'default' } = options
        const eventTarget = this._find(target)

        eventTarget.sub(name, handlers, pool)
      }

      unsub = (name, handlers, options = {}) => {
        if (!isBrowser()) return

        const { target = document, pool = 'default' } = options
        const eventTarget = this._find(target, false)

        if (eventTarget) {
          eventTarget.unsub(name, handlers, pool)
          if (eventTarget.empty()) this._remove(target)
        }
        //target.removeEventListener(name, handlers)
      }

    // sub = (name, handlers, options = {}) => {
    //     if (!isBrowser()) return
    //     const { target = document } = options
    //     target.addEventListener(name, handlers)
    // }

    // unsub = (name, handlers, options = {}) => {
    //     if (!isBrowser()) return
    //     const { target = document } = options
    //     target.removeEventListener(name, handlers)
    // }

    handlePortalMount = (e) => {
      if(this.props.hideOnScroll){
        this.sub('scroll', this.hideOnScroll, { target: this.scrollTarget })
      }
      _.invoke(this.props, 'onMount', e, this.props)
    }

    handlePortalUnmount = (e) => {
      if(this.props.hideOnScroll){
        this.unsub('scroll', this.hideOnScroll, { target: this.scrollTarget })
      }
      _.invoke(this.props, 'onUnmount', e, this.props)
    }

    hideOnScroll = (e) => {
      this.unsub('scroll', this.hideOnScroll, { target: this.scrollTarget })
      this.handleClose(e)
    }

    handleClose = (e) => {
        this.setState({
          isopen: false
        })
        _.invoke(this.props, 'onClose', e, this.props)
    }


    render() {
        const mergedPortalProps = this.getPortalProps();
        const style = _.assign({}, this.state.style, this.props.style);
        const popupJSX = (<div ref={this.handlePopupRef} className={this.props.className} style={style}>{this.props.children}</div>);
        return (
            <Portal
                {...mergedPortalProps}
                {...this.props}
                onClose={this.handleClose}
                open={this.props.isopen}
                onMount={this.handlePortalMount}
                onUnmount={this.handlePortalUnmount}
            >
                {popupJSX}
            </Portal>
        )
    }
}


export default HyPopupCom;

