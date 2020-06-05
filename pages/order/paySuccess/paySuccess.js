const http = require('../../../utils/httpdemo');
Page({
    data: {
        canUse: getApp().globalData.canUse,
        navbarData: {
            navigationBarTextStyle: 'black', // 胶囊主题 white || black
            navigationBarTitleText: '支付成功', //  导航栏标题文本
            // navigationBarBackgroundColor: 'aqua', // 导航栏背景色
            // statusBgColor: '', // 状态栏背景色
            // showPre: true, // 是否只展示返回键 默认 false
            // hideCapsule: true, // 是否隐藏胶囊
        },
    },
    // 返回首页
    backHome() {
        wx.reLaunch({
            url: `/pages/index/index`
        })
    },
    // 查看订单
    viewOrder() {
      wx.redirectTo({
        url: `/pages/order/index/index`
      })
    }
})