//app.js
import mta from 'mta_wechat_sdk/mta_analysis'; // 站点流量统计
import globalModel from 'models/global'; 
import { saveTokens, getToken, removeToken } from 'utils/token';
import Toast from './miniprogram_npm/@vant/weapp/toast/toast';
App({
  // 小程序启动之后 触发
  onLaunch: function (options) {
    Toast.setDefaultOptions({
      type: "loading", duration: 0, forbidClick: true,
    })
    !wx.getStorageSync('isUpdata') && globalModel._getToken().then(res => {
      let { access_token, refresh_token, need_user_info, need_wechat_user_info } = res.data
      saveTokens(access_token, refresh_token);
      wx.setStorageSync('isUpdata', res.data);
      // 未上传微信用户信息 且 未注册学生信息 前往登录页
      if(need_user_info && need_wechat_user_info) {
        wx.redirectTo({
          url: `/pages/login/index/index`
        })
      }
    })
    // 网站流量统计
    mta.App.init({ 
      "appID":"500720942", 
      "eventID":"500720969", 
      "autoReport": true, 
      "statParam": true, 
      "ignoreParams": [], 
      "statPullDownFresh":true, 
      "statShareApp":true, 
      "statReachBottom":true 
    });
    // 通过分享进入小程序时
    this.globalData.share = [1007, 1008].includes(options.scene)
    wx.getSystemInfo({
      success: res => {
        let { statusBarHeight, version, model, system } = res
        // 换算标题栏高度
        let { titleBarHeight } = this._setCapsuleClearance(statusBarHeight, system)
        Object.assign(this.globalData, {
          statusBarHeight, version, model, titleBarHeight,
          canUse: this.compareVersion(version, '6.6.0') >= 0, // 能否使用自定义头部
          isIphonex: this._isIphonex(model)  
        })
      }
    })
  },
  mta() {
    mta.Page.init()
  }, // 执行 `埋点` 代码，统计小程序内相关流量
  /**
   * 通过 Object 的 get、set方法实现属性全局监听 --- 设置目标属性时额外执行某些操作
   * @param {Function} callback 
   */
  watch(callback) {
    // Object.defineProperty(目标对象, 目标属性, 属性描述符)
    Object.defineProperty(this.globalData, "needUpdate", {
      configurable: true, // 目标属性可修改、删除
      enumerable: true, // 目标属性可枚举
      set(value) { // 设置目标属性时执行 --- 存储目标属性
        this._name = value; // 模拟属性赋值,此处只是用一个属性临时存储一下 needUpdate的值 并无实际意义
        callback(value); // 执行回调 ==== 关键
      },
      get() { // 访问目标属性时执行 --- 获取目标属性
        return this._name // 模拟取值
      }
    })
  },
  // 微信版本号比较
  compareVersion(v1, v2) {
    v1 = v1.split('.')
    v2 = v2.split('.')
    const len = Math.max(v1.length, v2.length)

    while (v1.length < len) { v1.push('0') }
    while (v2.length < len) { v2.push('0') }

    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])
      if (num1 > num2) return 1
      else if (num1 < num2) return -1
    }
    return 0
  },
  // 是否为高屏手机
  _isIphonex(model) {
    let shebei = ['iPhone X', 'iPhone11', 'MI 9']
    return shebei.some(v => model.startsWith(v))
  },
  /**
   * 设置胶囊上下间隙、及高度
   * @param {Number} statusBarHeight 状态栏高度 
   * @param {Object} system 设备系统信息
   */
  _setCapsuleClearance(statusBarHeight, system) {
    let jianxi
    if(wx.canIUse("getMenuButtonBoundingClientRect.top")) {
      // 同小程序API获取胶囊距顶间隙 - 状态栏高度
      jianxi = wx.getMenuButtonBoundingClientRect().top - statusBarHeight
    } else {
      // 根据手机系统设置不同的胶囊间隙
      if (system.startsWith('Android')) jianxi = 8
      else if (system.startsWith('iOS')) jianxi = 6
      else jianxi = 6
    }
    // 系统默认胶囊宽高为 87 32
    let titleBarHeight = 32 + jianxi * 2
    return {
      jianxi, titleBarHeight
    }
  },
  // 确认 -- 获取用户信息并上传
  _getUserInfo({ userInfo }) {
    if (userInfo) {
      Toast.loading('登录中...')
      const data = { // **** 上传参数根据实际情况而定 ****
        nick_name: userInfo.nickName,  // 微信昵称
        avatar_url: userInfo.avatarUrl, // 微信头像
      };
      // 本地存储 用户信息 备份
      wx.setStorageSync("userinfo", data);
      // 上传用户信息
      globalModel.userUpdate(data)
      .then(res => {
        Toast.clear();
        // 上传成功，关闭授权弹窗
        this.globalData.needUpdate = false;
        wx.redirectTo({
          url: "/pages/index/index"
        })
      });
    } else {
      wx.showToast({
        title: "您尚未授权，部分功能可能无法使用",
        icon: "none",
      });
      // wx.redirectTo({
      //   url: "/pages/index/index"
      // })
    } // 用户拒绝授权
  },
  /**
   * 订单支付 --- 结算中心页
   * @param {Object} orderCode  {订单ID，订单编号}
   */
  _orderPayment(orderCode, _that) {
    specialModel.getOrderPaymentParameter(orderCode)
      .then(res => new Promise((success, fail) => wx.requestPayment({ ...res.results, success, fail })))
      .then(() => { // 支付成功
        wx.navigateTo({
          url: `/pages/form_results/form_results`
        })
        // 通知后台
        return specialModel.pushPaymentSuccess(orderCode)
      })
      .catch(err => { // 支付失败
        let { detail, status, errMsg, msg } = err, title
        if (errMsg) { // 只针对微信支付接口异常
          title = err.errMsg.includes('fail cancel') ? '您取消了支付！' : '支付失败！'
        } else if (detail == "error" && status == '10030') { // 支付成功但 通知后台失败！
          title = '订单成功通知发送失败!'
        } else {
          title = msg
        }
        wx.showToast({
          title, icon: 'none', duration: 2000
        })
      })
  },
  globalData: {
    userInfo: null
  }
})