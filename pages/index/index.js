// 首页
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
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
    active: 0, // tab选中索引
    navTitle: ["校服预定", "分类", "购物车", "个人中心"]
  },
  onLoad: function(options) {
    Toast.loading('加载中...')
    options.active = Number(options.active) || 0
    this.setData({...options})
    let shopCart = wx.getStorageSync('shopCart')
    let num = Array.isArray(shopCart) ? shopCart.map(v => v.cartData).flat().length || null : null

    this.setData({
      num
    })
  },
  parentCallBack ({detail}) {
    // console.log("父辈接受", detail)
    let shopCart = wx.getStorageSync('shopCart')
    let num = Array.isArray(shopCart) ? shopCart.map(v => v.cartData).flat().length || null : null

    this.setData({
      ...detail, num
    })
  },
  onChange(event) {
    // event.detail 的值为当前选中项的索引
    this.setData({ 
      active: event.detail,
      "navbarData.navigationBarTitleText": this.data.navTitle[event.detail]
    });
  },
})