// pages/login/studentIdentity/index.js
Page({
  data: {
    canUse: getApp().globalData.canUse,
    navbarData: {
      navigationBarTextStyle: 'black', // 胶囊主题 white || black
      navigationBarTitleText: '身份选择', //  导航栏标题文本
      // navigationBarBackgroundColor: 'aqua', // 导航栏背景色
      // statusBgColor: '', // 状态栏背景色
      // showPre: true, // 是否只展示返回键 默认 false
      hideCapsule: true, // 是否隐藏胶囊,
      isEdit: false,
      new_student: ''
    },
  },
  onLoad(option) {
    if(option.isEdit) {
      this.setData({
        isEdit: true
      })
    }
    if(option.new_student) {
      this.setData({
        new_student: option.new_student
      })
    }
  },
  gotoIndex() {
    wx.reLaunch({
      url: `/pages/index/index`
    })
  },
  gotoUserInfo() {
    wx.navigateTo({
      url: `/pages/login/userInfo/index`
    })
  }
})