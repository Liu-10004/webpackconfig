import Validator from 'Myutilities/validator';

import _ from 'lodash';

const languageConfig = {
  integer:'无效',
  overrun:'过大'
};

// 默认的校验方法
export const defaultCheckFunction = (value, conditions) => {

  if (value === "") {
    return { error: false, message: '' };
  }

  let isValid = true;
  const _value = Number(value);
  // 获取校验条件
  const { checkType, max, min, maxlength, toolTipText } = conditions;

  //#region 根据checktype校验
  if (checkType) {
    switch (checkType) {
      case 'integer':
        isValid = Validator.integer(value);
        if (!isValid) {
          return { error: true, message: toolTipText || languageConfig.integer };
        } else if (_.isNaN(_value)) {
          return { error: true, message: toolTipText || languageConfig.integer };
        } else if (_value > 2147483647 || _value < -2147483647) {
          return { error: true, message: languageConfig.overrun };
        }
        break;
      case 'integernzero':
        isValid = Validator.integer(value);
        if (!isValid) {
          return { error: true, message: toolTipText || languageConfig.integernzero };
        } else if (_.isNaN(_value) || _value === 0) {
          return { error: true, message: toolTipText || languageConfig.integernzero };
        } else if (_value > 2147483647 || _value < -2147483647) {
          return { error: true, message: languageConfig.overrun };
        }
        break;
      case 'zhinteger':
        isValid = Validator.zhinteger(value);
        if (!isValid) {
          return { error: true, message: toolTipText || languageConfig.zhinteger };
        } else if (_.isNaN(_value)) {
          return { error: true, message: toolTipText || languageConfig.zhinteger };
        } else if (_value > 2147483647) {
          return { error: true, message: languageConfig.overrun };
        }
        break;
      case 'zhintegernzero':
        isValid = Validator.zhinteger(value);
        if (!isValid) {
          return { error: true, message: toolTipText || languageConfig.zhintegernzero };
        } else if (_.isNaN(_value) || _value <= 0) {
          return { error: true, message: toolTipText || languageConfig.zhintegernzero };
        } else if (_value > 2147483647) {
          return { error: true, message: languageConfig.overrun };
        }
        break;
      case 'fuinteger':
        isValid = Validator.fuinteger(value);
        if (!isValid) {
          return { error: true, message: toolTipText || languageConfig.fuinteger };
        } else if (_.isNaN(_value)) {
          return { error: true, message: toolTipText || languageConfig.fuinteger };
        } else if (_value < -2147483647) {
          return { error: true, message: languageConfig.overrun };
        }
        break;
      case 'fuintegernzero':
        isValid = Validator.fuinteger(value);
        if (!isValid) {
          return { error: true, message: toolTipText || languageConfig.fuintegernzero };
        } else if (_.isNaN(_value) || _value >= 0) {
          return { error: true, message: toolTipText || languageConfig.fuintegernzero };
        } else if (_value < -2147483647) {
          return { error: true, message: languageConfig.overrun };
        }
        break;
      case 'float':
        isValid = Validator.float(value);
        if (!isValid) {
          return { error: true, message: toolTipText || languageConfig.float };
        } else if (_.isNaN(_value)) {
          return { error: true, message: toolTipText || languageConfig.float };
        } else if (_value < -999999999999.9999 || _value > 999999999999.9999) {
          return { error: true, message: languageConfig.overrun };
        }
        break;
      case 'floatnzero':
        isValid = Validator.float(value);
        if (!isValid) {
          return { error: true, message: toolTipText || languageConfig.floatnzero };
        } else if (_.isNaN(_value) || _value === 0) {
          return { error: true, message: toolTipText || languageConfig.floatnzero };
        } else if (_value < -999999999999.9999 || _value > 999999999999.9999) {
          return { error: true, message: languageConfig.overrun };
        }
        break;
      case 'zhfloat':
        isValid = Validator.zhfloat(value);
        if (!isValid) {
          return { error: true, message: toolTipText || languageConfig.zhfloat };
        } else if (_.isNaN(_value)) {
          return { error: true, message: toolTipText || languageConfig.zhfloat };
        } else if (_value > 999999999999.9999) {
          return { error: true, message: languageConfig.overrun };
        }
        break;
      case 'zhfloatnzero':
        isValid = Validator.zhfloat(value);
        if (!isValid) {
          return { error: true, message: toolTipText || languageConfig.zhfloatnzero };
        } else if (_.isNaN(_value) || _value <= 0) {
          return { error: true, message: toolTipText || languageConfig.zhfloatnzero };
        } else if (_value > 999999999999.9999) {
          return { error: true, message: languageConfig.overrun };
        }
        break;
      case 'fufloat':
        isValid = Validator.fufloat(value);
        if (!isValid) {
          return { error: true, message: toolTipText || languageConfig.fufloat };
        } else if (_.isNaN(_value)) {
          return { error: true, message: toolTipText || languageConfig.fufloat };
        } else if (_value < -999999999999.9999) {
          return { error: true, message: languageConfig.overrun };
        }
        break;
      case 'fufloatnzero':
        isValid = Validator.fufloat(value);
        if (!isValid) {
          return { error: true, message: toolTipText || languageConfig.fufloatnzero };
        } else if (_.isNaN(_value) || _value >= 0) {
          return { error: true, message: toolTipText || languageConfig.fufloatnzero };
        } else if (_value < -999999999999.9999) {
          return { error: true, message: languageConfig.overrun };
        }
        break;
      default:
        break;
    }
  }
  //#endregion

  // #region 校验小数点
  if (checkType && !_.isNaN(_value) && global && global.__CURRENCY__) {
    let _scale = Number(global.__CURRENCY__._scale);
    if (_.isNaN(_scale)) {
      _scale = 2;
    }
    let _tmScale = _value ? _value.toString().split('.') : [];
    if (_tmScale.length > 2) {
      return { error: false, message: languageConfig.error };
    } else if (_tmScale.length === 2 && _tmScale[1].length > _scale) {
      return { error: false, message: `${languageConfig.errot_scale}（${_scale}）` };
    }
  }
  // #endregion

  //#region 校验最大值
  if (!_.isNull(max) && !_.isNaN(Number(max)) && !_.isNaN(_value) && _.trim(max) !== '' && _value > Number(max)) {
    return { error: true, message: `${languageConfig.error_max} (${max})` };
  }
  //#endregion

  //#region 校验最小值
  if (!_.isNull(min) && !_.isNaN(Number(min)) && !_.isNaN(_value) && _.trim(min) !== '' && _value < Number(min)) {
    return { error: true, message: `${languageConfig.error_min} (${min})` };
  }
  //#endregion

  //#region 校验最大长度
  if (!_.isNull(maxlength) && !_.isNaN(Number(maxlength)) && _.trim(maxlength) !== '' && _.toString(value).length > Number(maxlength)) {
    return { error: true, message: `${languageConfig.error_maxlength}（${maxlength}）` };
  }
  //#endregion

  return { error: false, message: '' };
}