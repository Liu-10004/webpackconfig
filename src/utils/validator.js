class Validator {
  constructor() {
    this.Regexs = {
      /**
      * @descrition:邮箱规则
      * 1.邮箱以a-z、A-Z、0-9开头，最小长度为1.
      * 2.如果左侧部分包含-、_、.则这些特殊符号的前面必须包一位数字或字母。
      * 3.@符号是必填项
      * 4.右则部分可分为两部分，第一部分为邮件提供商域名地址，第二部分为域名后缀，现已知的最短为2位。最长的为6为。
      * 5.邮件提供商域可以包含特殊字符-、_、.
      */
      email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/,
      /**
       * [ip ipv4、ipv6]
       * "192.168.0.0"
       * "192.168.2.3.1.1"
       * "235.168.2.1"
       * "192.168.254.10"
       * "192.168.254.10.1.1"
       */
      ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])((\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}|(\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){5})$/,
      /**
      * @descrition:判断输入的参数是否是个合格的固定电话号码。
      * 待验证的固定电话号码。
      * 国家代码(2到3位)-区号(2到3位)-电话号码(7到8位)-分机号(3位)
      **/
      fax: /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/,
      /**
      *@descrition:手机号码段规则
      * 13段：130、131、132、133、134、135、136、137、138、139
      * 14段：145、147
      * 15段：150、151、152、153、155、156、157、158、159
      * 17段：170、176、177、178
      * 18段：180、181、182、183、184、185、186、187、188、189
      * 国际码 如：中国(+86)
      */
      phone: /^((\+?[0-9]{1,4})|(\(\+86\)))?(13[0-9]|14[57]|15[012356789]|17[03678]|18[0-9])\d{8}$/,
      /**
       * @descrition 匹配 URL
       */
      url: /^(((ht|f)tp(s?))\:\/\/)?(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|cn|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk|xin)[^\s]*$/,

      /**
       * 匹配http的地址
       * @type {RegExp}
       */
      httpUrl: /^((http(s?))\:\/\/)?(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|cn|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk|xin)[^\s]*$/,
      /**
       * @descrition 匹配 邮编 （开头能为0，共6位数字）
       */
      postcode: /^[0-9]{6}$/,
      /**
       * @descrition 匹配 整数
       */
      integer: /^(\-|\+)?\d+?$/,
      /**
       * @descrition 匹配 正整数 （0-任意）
       */
      zhinteger: /^(?:\d+|\d{1,3}(?:,\d{3})+)?$/,
      /**
       * @descrition 匹配 负整数
       */
      fuinteger: /^(-)?(-((?:\d+|\d{1,3}(?:,\d{3})+)?)?)?$/,
      /**
       * @descrition 匹配 浮点数
       */
      float: /^(\-|\+)?((?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?)?$/,
      /**
       * @descrition 匹配 正浮点数
       */
      zhfloat: /^(?:\d*|\d{1,3}(?:,\d{3})*)(?:\.\d*)?$/,
      /**
       * @descrition 匹配 负浮点数
       */
      fufloat: /^(-)?(-((?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d*)?)?)?$/,
      /**
       * 非零
       */
      nzero: /^[1-9]$/
    }
  }
  // 验证合法邮箱
  isEmail(field) {
    return this.Regexs.email.test(field);
  }
  // 验证合法 ip 地址
  isIP(field) {
    return this.Regexs.ip.test(field);
  }
  // 验证传真
  isFax(field) {
    return this.Regexs.fax.test(field);
  }
  //验证座机
  isTel(field) {
    return this.Regexs.fax.test(field);
  }
  // 验证手机
  isPhone(field) {
    return this.Regexs.phone.test(field);
  }
  // 验证URL
  isUrl(field) {
    return this.Regexs.url.test(field);
  }
  //验证http url
  isHttpUrl(field) {
    return this.Regexs.httpUrl.test(field);
  }
  // 验证邮编
  isPostcode(field) {
    return this.Regexs.postcode.test(field);
  }
  /**
   * 验证数字
   * 参数： 数字，最小值，最大值
   */
  isNumber(field, minNum, maxNum) {
    let temp = + field; //转换为数字类型
    if (isNaN(temp)) {//非数字
      return false;
    }
    if (minNum !== undefined && temp < minNum) {
      return false;
    }
    if (maxNum !== undefined && temp > maxNum) {
      return false
    }
    return true;
  }
  // 验证浮点数
  float(field) {
    return this.Regexs.float.test(field);
  }
  // 验证整数
  integer(field) {
    return this.Regexs.integer.test(field);
  }
  // 验证合法正整数
  zhinteger(field) {
    return this.Regexs.zhinteger.test(field);
  }
  // 验证合法负整数
  fuinteger(field) {
    return this.Regexs.fuinteger.test(field);
  }
  // 验证合法正浮点数
  zhfloat(field) {
    return this.Regexs.zhfloat.test(field);
  }
  // 验证合法负浮点数
  fufloat(field) {
    return this.Regexs.fufloat.test(field);
  }


}

export default new Validator();
