import { baseUrl } from '../config';
import { saveTokens, getToken, removeToken } from './token';
import Toast from '../miniprogram_npm/@vant/weapp/toast/toast';

// 需自定义错误提示状态码的文本
const errCodeArr = [10010, 3]
const tips = {
  1: '出错啦',
  2: '登录出错',
  3: '用户信息未上传'
};
const updateTokenCodeArr = [10040, 10050, 10000]
class HTTP {
  request({url, data = {}, method = 'GET', isLogin = false, refreshToken = false}) {
    return new Promise((resolve, reject) => {
      let { need_user_info, need_wechat_user_info } = wx.getStorageSync('isUpdata')
      if(need_user_info && need_wechat_user_info) {
        // wx.
      }
      let accessToken = getToken('access_token');
      // let accessToken = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTExNTA3NDgsIm5iZiI6MTU5MTE1MDc0OCwianRpIjoiYjYzMjg0NzEtM2Y5NC00OGUzLTg1Y2QtNzNlZDNkZjAyM2UzIiwiZXhwIjoxNTkxMTg2NzQ4LCJpZGVudGl0eSI6IlVzZXIjMSIsImZyZXNoIjpmYWxzZSwidHlwZSI6ImFjY2VzcyJ9.DKOeQQDXp54_Leh9QIRY3mipgf3QYXNDGJgtHOfmp1M';
      // isLogin == 拉取token接口无需请求头
      let header = isLogin ? {} : {
        'Content-Type': 'application/json',
        'Authorization': refreshToken || accessToken // `refreshToken`为 双token模式下更新token所需参数
      }
      wx.request({
        url: baseUrl + url, header, method, data,
        success: ({ data, statusCode }) => { // 请求发送成功
          // 校验返回数据是否为对象
          const isObj = Object.prototype.toString.call(data).slice(8,-1) === "Object"
          // 校验网络状态码是否正常
          const flag = ''.startsWith.call(statusCode, 2)
          if(isObj) { // 服务器返回数据正常
            // 格式化 数据字段名，用于后续统一错误处理
            this._formatResponseData(data, {errCode: 'error_code', errMsg: 'msg'})
          }else { // 服务器返回数据异常 -- 如 404则返回空页面字符，而非数据对象
            data = { errCode: 1, errMsg: '数据异常！！'}
          }
          // token 失效，从新登陆
          if(updateTokenCodeArr.includes(data.errCode)) {
            return this.login( url, data, method, resolve, reject )
          }
          // flag -- 网络状态码正常， errCode -- 数据状态码正常
          flag && !data.errCode ? resolve(data) : reject(data)
        },
        fail: err => reject(err) // 请求发送失败 -- 例如请求超时
      })
    })
    .catch(err => {
      Toast.clear(); // 清除 loading
      // 排除需自定义错误提示语的状态码，其他均采用后台提示语
      if(!errCodeArr.includes(err.errCode)) this._showError(err)
      return Promise.reject(err) // 注：此处直接 返回结果 会在后续调用直接进入 then(),若想进入 catch() 则应返回 Promise.reject(err)
    }) // 统一错误处理
  }
  /**
   * 登录、授权、获取token
   * @param {*} options // 因token失效 而请求失败的请求参数，用于后续从新发送请求
   */
  login(url, data, method, resolve, reject) {
    return this._getToken().then(res => {
      const { access_token, refresh_token, need_wechat_user_info } = res.data
      saveTokens(access_token, refresh_token); // 本地缓存 token
      // 是否需上传微信用户信息
      if(need_wechat_user_info) {
        wx.getSetting({ success: res => {
          if(res.authSetting['scope.userInfo']) { // 已授权 则静默上传
            wx.getUserInfo({
              success(res) { getApp()._getUserInfo(res) }
            })
          }else { // 未授权则开启自定义弹窗
            getApp().globalData.needUpdate = !flag
          }
        }})
      }
      // 从新发送之前因 token 失效的请求
      resolve && resolve(this.request({ url, data, method }))
      // if(!resolve) return res
    }).catch(err => reject ? reject(err) : Promise.reject(err))
  }
  // 获取token
  _getToken() {
    removeToken(); // 移除本地缓存中 token
    return this.request({
      url: `api/v1/user/get_token`,
      data: { code: '123456' }, method: "POST", isLogin: true 
    })
    // return new Promise((success, fail) => wx.login({ success, fail }))
    // .then(({code}) => {  // 2. 通过微信接口获取 code
    //   if(!code) return this._showError({errCode: 2})
    //   return this.request({
    //     url: `api/v1/user/get_token`,
    //     data: { code }, method: "POST", isLogin: true 
    //   })
    // })
  }
  // 通过 refreshToken 静默更新 access_token
  _refreshToken(url, data, method, resolve) {
    const refreshToken = getToken('refresh_token');
    // options.refreshToken = refreshToken
    this.request({ url: `api/v2/user/refresh_token` })
    .then(res => {
      const { access_token, refresh_token } = res.data.result
      saveTokens(access_token, refresh_token)
      // 从新发送之前因 token 失效的请求
      resolve && resolve(this.request({ url, data, method, refreshToken }))
    })
  }
  // 错误提示
  _showError(options = {}) {
    const { errCode, errMsg } = options
    let title = errMsg || tips[errCode] // 优先使用 后端返回的错误信息
    if(errMsg && errMsg.includes('fail timeout')) title = "请求超时，请稍后再试"
    wx.showToast({ title, icon: 'none', duration: 2000 })
  }
  /**
   * 格式化响应提示参数
   * @param {object} data // 网络响应数据
   * @param {object} param1 
   */
  _formatResponseData(data, {errCode, errMsg}) {
    if(errCode && !data.hasOwnProperty('errCode')) // 统一错误码字段名为：errCode
    data['errCode'] = typeof data[errCode] === "number" ? data[errCode] : 1; 
    if(errMsg && !data.hasOwnProperty('errMsg')) // 统一错误提示信息为：errMsg
    data['errMsg'] = data[errMsg];
    [errCode, errMsg].map( v => delete data[v]) // 移除旧属性
  }
}
export default HTTP;