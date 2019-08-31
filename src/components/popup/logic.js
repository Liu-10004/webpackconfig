/**
 * Returns a createElement() type based on the props of the Component.
 * Useful for calculating what type a component should render as.
 *
 * @param {function} Component A function or ReactClass.
 * @param {object} props A ReactElement props object
 * @param {function} [getDefault] A function that returns a default element type.
 * @returns {string|function} A ReactElement type
 */
import _ from 'lodash';
import cx from 'classnames'
import React, { cloneElement, isValidElement } from 'react'

export const getElementType = (Component, props, getDefault) => {
    const { defaultProps = {} } = Component

    // ----------------------------------------
    // user defined "as" element type

    if (props.as && props.as !== defaultProps.as) return props.as

    // ----------------------------------------
    // computed default element type

    if (getDefault) {
      const computedDefault = getDefault()
      if (computedDefault) return computedDefault
    }

    // ----------------------------------------
    // infer anchor links

    if (props.href) return 'a'

    // ----------------------------------------
    // use defaultProp or 'div'

    return defaultProps.as || 'div'
  }

// eslint-disable-next-line no-confusing-arrow
export const isBrowser = () => {
  const hasDocument = typeof document === 'object' && document !== null
  const hasWindow = typeof window === 'object' && window !== null && window.self === window
  if(!_.isNil(isBrowser.override)){
   return isBrowser.override;
  }else{
   return hasDocument && hasWindow
  }
  //!_.isNil(isBrowser.override) ? isBrowser.override : hasDocument && hasWindow
}

// export const isValidElement = () =>{<P>(object: {} | null | undefined): object is ReactElement<P>};

/**
 * A more robust React.createElement. It can create elements from primitive values.
 *
 * @param {function|string} Component A ReactClass or string
 * @param {function} mapValueToProps A function that maps a primitive value to the Component props
 * @param {string|object|function} val The value to create a ReactElement from
 * @param {Object} [options={}]
 * @param {object} [options.defaultProps={}] Default props object
 * @param {object|function} [options.overrideProps={}] Override props object or function (called with regular props)
 * @returns {object|null}
 */
export const createShorthand = (Component, mapValueToProps, val, options = {}) => {
  if (typeof Component !== 'function' && typeof Component !== 'string') {
    throw new Error('createShorthandFactory() Component must be a string or function.')
  }
  // short circuit noop values
  if (_.isNil(val) || _.isBoolean(val)) return null

  const valIsString = _.isString(val)
  const valIsNumber = _.isNumber(val)

  const isReactElement = isValidElement(val)
  const isPropsObject = _.isPlainObject(val)
  const isPrimitiveValue = valIsString || valIsNumber || _.isArray(val)

  // unhandled type return null
  /* eslint-disable no-console */
  if (!isReactElement && !isPropsObject && !isPrimitiveValue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error([
        'Shorthand value must be a string|number|array|object|ReactElement.',
        ' Use null|undefined|boolean for none',
        ` Received ${typeof val}.`,
      ].join(''))
    }
    return null
  }
  /* eslint-enable no-console */

  // ----------------------------------------
  // Build up props
  // ----------------------------------------
  const { defaultProps = {} } = options

  // User's props
  const usersProps = (isReactElement && val.props)
    || (isPropsObject && val)
    || (isPrimitiveValue && mapValueToProps(val))

  // Override props
  let { overrideProps = {} } = options
  overrideProps = _.isFunction(overrideProps) ? overrideProps({ ...defaultProps, ...usersProps }) : overrideProps

  // Merge props
  /* eslint-disable react/prop-types */
  const props = { ...defaultProps, ...usersProps, ...overrideProps }

  // Merge className
  if (defaultProps.className || overrideProps.className || usersProps.className) {
    const mergedClassesNames = cx(defaultProps.className, overrideProps.className, usersProps.className)
    props.className = _.uniq(mergedClassesNames.split(' ')).join(' ')
  }

  // Merge style
  if (defaultProps.style || overrideProps.style || usersProps.style) {
    props.style = { ...defaultProps.style, ...usersProps.style, ...overrideProps.style }
  }

  // ----------------------------------------
  // Get key
  // ----------------------------------------

  // Use key, childKey, or generate key
  if (_.isNil(props.key)) {
    const { childKey } = props

    if (!_.isNil(childKey)) {
      // apply and consume the childKey
      props.key = typeof childKey === 'function' ? childKey(props) : childKey
      delete props.childKey
    } else if (valIsString || valIsNumber) {
      // use string/number shorthand values as the key
      props.key = val
    }
  }
  /* eslint-enable react/prop-types */

  // ----------------------------------------
  // Create Element
  // ----------------------------------------

  // Clone ReactElements
  if (isReactElement) return cloneElement(val, props)

  // Create ReactElements from built up props
  if (isPrimitiveValue || isPropsObject) return <Component {...props} />
}

/**
 * Tests if children are nil in React and Preact.
 * @param {Object} children The children prop of a component.
 * @returns {Boolean}
 */
export const isNil = children => children === null
|| children === undefined
|| (Array.isArray(children) && children.length === 0)

export const createShorthandFactory = (Component, mapValueToProps) => {
  if (typeof Component !== 'function' && typeof Component !== 'string') {
    throw new Error('createShorthandFactory() Component must be a string or function.')
  }

  return (val, options) => createShorthand(Component, mapValueToProps, val, options)
}

export const getUnhandledProps = (Component, props) => {
  // Note that `handledProps` are generated automatically during build with `babel-plugin-transform-react-handled-props`
  const { handledProps = [] } = Component

  return Object.keys(props).reduce((acc, prop) => {
    if (prop === 'childKey') return acc
    if (handledProps.indexOf(prop) === -1) acc[prop] = props[prop]
    return acc
  }, {})
}

export const TYPES = {
  ADDON: 'addon',
  BEHAVIOR: 'behavior',
  COLLECTION: 'collection',
  ELEMENT: 'element',
  VIEW: 'view',
  MODULE: 'module',
}




