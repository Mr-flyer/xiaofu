//index.js
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
    active: 2, // tab选中索引
    navTitle: ["校服预定", "分类", "购物车", "个人中心"]
  },
  onLoad: function(options) {
    this.setData({...options})
  },
  parentCallBack ({detail}) {
    console.log("父辈接受", detail)
    this.setData({
      ...detail
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