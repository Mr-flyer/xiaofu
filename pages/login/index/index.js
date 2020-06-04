// pages/login/index/index.js
// import moduleName from 'module';
import { saveTokens, getToken, removeToken } from '../../../utils/token';
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
  
  // cardSwiper 轮播图
  cardSwiper(e) {
    this.setData({
      cardCur: e.detail.current
    })
  },
  // 前往手机登录
  gotoLoginMobile() {
    if(wx.getStorageSync('isUpdata').need_user_info) {
      wx.navigateTo({
        url: `/pages/login/loginMobile/index`
      })
    }else {
      wx.redirectTo({
        url: "/pages/index/index"
      })
    }
  },
  // 微信登录
  loginWechat({detail}) {
    getApp()._getUserInfo(detail)
  }
})