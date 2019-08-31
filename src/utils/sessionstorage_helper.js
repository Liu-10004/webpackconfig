import _ from 'lodash';
/**
 * 根据Key获取本地存储数据
 * @type {string}
 */
export const GetSessionItem = async (localDataKey) => {
  let _tmData;
  try {
    _tmData = await sessionStorage.getItem(localDataKey);
    _tmData = await JSON.parse(_tmData);
  } catch (el) {
    console.error('GetSessionItem', el);
    _tmData = {}
  }
  return _tmData;
}

/**
 * 根据Key设置本地存储数据
 * @type {string}
 * @type {object}
 */
export const SetSessionItem = async (localDataKey, data) => {
  let _tmData;
  try {
    await sessionStorage.setItem(localDataKey, JSON.stringify(data));
    // console.log('key',localDataKey,'data',data);
    _tmData = true;
  } catch (el) {
    // console.log('SetSessionItem', el,'key',localDataKey,'data',data);
    console.log('sessionStorageErr', el);
    _tmData = false
  }
  return _tmData;
}

export const RemoveSessionItem = async (localDataKey) => {
  try {
    await sessionStorage.removeItem(localDataKey);
  } catch (el) {
    console.error('removeItemSessionItem', el);
  }
}


export const GetSessionItemByUrl = async () => {
  const url = window.location.href;
  const urlArray = url.split('/');
  const routerParams = _.takeRight(urlArray, 13);
  const urlParams = _.takeRight(routerParams, 11);
  const urlIndex = urlParams.join('/');
  const routeData = await sessionStorage.getItem("cacheData");
  const tmData = await JSON.parse(routeData);
  if (!_.isArray(tmData) || _.size(tmData) === 0 || !tmData[routerParams[1]]) {
    return {};
  }

  return tmData[routerParams[1]][urlIndex] || {};
}
