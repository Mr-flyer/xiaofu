import HTTP from '../utils/http';

class globalModel extends HTTP {
  constructor() {
    super() // 致此 this才有效
  }
  // 向后台 上传用户信息 --- vant 弹窗组件直接调用此接口便可
  userUpdate(data) {
    return this.request({
      url: `api/v1/user/user_info`,
      method: 'POST', data, 
      // useLocalToken: true // 使用 小程序APP缓存的Token
    })
  }
  // 向微信客户端拉取授权、用户信息 并上传至客户端 --- 自定义授权弹窗逻辑
  uploadUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          // 用户已授权
          if (res.authSetting['scope.userInfo']) {
            // 拉取用户信息
            wx.getUserInfo({
              lang: 'zh_CN',
              success: res => resolve(res),
              fail: () => {
                wx.showModal({
                  title: '提示',
                  content: '小程序无法获取您的个人信息，功能将受限制，请前去登录',
                  showCancel: false,
                  complete: function () {
                    wx.removeStorageSync('token');
                    wx.reLaunch({
                      url: '/pages/welcome/welcome'
                    })
                  }
                })
              }
            })
          } else {
            // 此处会弹出 微信自带授权弹窗
            reject('用户未授权')
          }
        },
        fail(err) {
          console.log(err);
        }
      })
    })
    .then(({userInfo, rawData}) => {
      const data = {
        avatar_url: userInfo.avatarUrl,
        city: userInfo.city,
        country: userInfo.country,
        language: userInfo.language,
        sex: userInfo.gender,
        nick_name: userInfo.nickName,
        province: userInfo.province,
        raw_data: JSON.parse(rawData)
      }
      // 上传用户信息至服务器
      return this.userUpdate(data)
    })
    .then(res => {
      console.log(res);
      const {status:error_code, msg:title} = res
      if (error_code) {
        return wx.showToast({ title, icon: 'none', duration: 618 })
      }
      return new Promise((resolve, reject) => {
        resolve('登录成功！！')
        // 上传成功，设置不需要上传用户信息了
        getApp().globalData.needUpdate = false;
        // 重新拉取token
        const requestInfo = getApp().globalData.requestInfo;
        if(requestInfo){
            globalModel.getToken(requestInfo.url, requestInfo.data, requestInfo.method, requestInfo.resolve);
        }
      })
    })
  }
}

export default new globalModel();