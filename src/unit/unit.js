let arr = ['QS9lRVlJbHRxTFVhZjF1Mkd1WW1ZaGR1emtOTkhYdytjRTJFSHJCaUFFVmVFOEFjR0NCS0xBPT0', 'VDhpazU5MzY1TUpQUDNYUzA1THUxck1nM2lMQ0tXRGlmYk9hbC81TGpmV251d3EyUGRyZ0x3PT0', 'QWVLaTBRaTBPZmlZaTF4Zm94a00vaVJoV3dmcUpRc0hlOFNZK2w0dGk2c1JHcjdsdWNDeHFnPT0', 'ZzYwUk9GNHJkcW95Uk9zdVJ3L3FHdTFOVm0vMzFPTi9iMGVMYkJ0MVozQkV3aXdFQ3o2dm93PT0']
export const setUserInfo = () => {
  let userInfo = {
    accessToken: getQueryString('Access-Token'),// ||arr[0],
    communityId: getQueryString('communityId'),// ||'412f422026d74abc971d907cc579a27a'||'412f422026d74abc971d907cc579a27a',
    lng: getQueryString('lng') || '',
    lat: getQueryString('lat') || '',
    bgColor: getQueryString('bgColor') ? '#' + getQueryString('bgColor') : '',
    isCustomer: getQueryString('isCustomer') || '',
  }

  window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
}

//根据key截取url传参
export const getQueryString = (name) => {
  let urlArr = window.location.href.split('?');
  if (urlArr.length == 1) {
    return ''
  } else {
    let str = ''
    urlArr = urlArr[1]
    urlArr = urlArr.split('&')
    urlArr.forEach(v => {
      if (v.indexOf(name) != -1) {
        try {
          str = v.split('=')[1] != undefined ? v.split('=')[1] : null
        } catch (e) {
          str = ''
        }
      }
    })
    return str;
  }
}

//获取缓存信息
export const getUserInfo = () => {
  return JSON.parse(window.localStorage.getItem('userInfo'))
}
//判断是否在微信
export const is_Weixn = () => {
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
}
//判断当前是ios还是安卓
export const judge = () => {
  var u = navigator.userAgent;
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  if (isiOS) {
    return true
  } else if (isAndroid) {
    return false
  }
}
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}
