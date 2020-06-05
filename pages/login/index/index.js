import Toast from './../../../miniprogram_npm/@vant/weapp/toast/toast';
import specialModel from '../../../models/special';
Page({
  data: {
    canUse: getApp().globalData.canUse,
    navbarData: {
      navigationBarTextStyle: 'black', // 胶囊主题 white || black
      navigationBarTitleText: '校服预定', //  导航栏标题文本
      // navigationBarBackgroundColor: 'aqua', // 导航栏背景色
      // statusBgColor: '', // 状态栏背景色
      // showPre: true, // 是否只展示返回键 默认 false
      hideCapsule: true, // 是否隐藏胶囊
    },
    DotStyle: 0, // 轮播点样式
    cardCur: 0, // 默认选中轮播
    swiperList: [{ // 轮播素材列表
      id: 0,
      type: 'image',
      url: '/static/images/other/example01@2x.png'
    }, {
      id: 1,
        type: 'image',
        url: '/static/images/other/example02@2x.png',
    }, {
      id: 2,
      type: 'image',
      url: '/static/images/other/example03@2x.png'
    }],
  },
  onLoad: function() {
    let { need_user_info } = wx.getStorageSync('isUpdata')
    this.setData({
      isRegister: need_user_info
    })
  },
  // cardSwiper 轮播图
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // 前往注册学生信息
  getphonenumber(e) {
    let { errMsg, encryptedData, iv } = e.detail
    errMsg = errMsg.slice(e.type.length+1).trim()
    if(errMsg ==='ok') {
      Toast.loading('正在获取手机号...')
      new Promise((success, fail) => wx.login({ success, fail}))
      .then(({code}) => specialModel.getPhoneEncode({encrypted_data: encryptedData, iv, code}))
      .then(() => {
        Toast.clear();
        wx.showToast({
          title: '获取成功',
          icon: 'none', duration: 2000
        })  
        wx.navigateTo({
          url: '/pages/login/studentIdentity/index'
        })
      })
    }else {
      wx.showToast({
        title: '您尚未授权，无法获取手机号！',
        icon: 'none', duration: 2000
      })
    }
  },
  // 直接登录
  gotoIndex() {
    wx.redirectTo({
      url: `/pages/index/index`
    })
  }, 
  // 微信登录
  loginWechat({detail}) {
    getApp()._getUserInfo(detail)
  }
})