const http = require('../../../utils/httpdemo');
let logisticspopup;
Page({
  data: {
    canUse: getApp().globalData.canUse,
    navbarData: {
      navigationBarTextStyle: 'black', // 胶囊主题 white || black
      navigationBarTitleText: '订单详情', //  导航栏标题文本
      // navigationBarBackgroundColor: 'aqua', // 导航栏背景色
      // statusBgColor: '', // 状态栏背景色
      // showPre: true, // 是否只展示返回键 默认 false
      // hideCapsule: true, // 是否隐藏胶囊
    },
    showLogistics: false,
    min: '',
    second: '',
    startTime: '2020/05/30 13:30:30',
    endTime: '2020/05/30 13:31:45',
    leftTime: 0,
    setTimeoutNumber: ''
  },
  onShow() {
    // 物流信息组件实例
    logisticspopup = this.selectComponent('#logisticspopup');
    this.setData({
      leftTime: Date.parse(this.data.endTime) / 1000 - Date.parse(this.data.startTime) / 1000
    })
    this.countTime();
  },
  // 倒计时
  countTime() {
    if (this.data.leftTime > 0) {
      let m = Math.floor(this.data.leftTime / 60);
      let s = Math.floor(this.data.leftTime % 60);
      this.setData({
        min: m < 10 ? '0' + m : m,
        second: s < 10 ? '0' + s : s
      })
      this.setData({
        setTimeoutNumber: setTimeout(() => {
          this.setData({
            leftTime: this.data.leftTime - 1
          })
          this.countTime();
        }, 1000)
      })
    } else {
      wx.showToast({
        title: '已过期'
      })
    }
  },
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
  // 换货
  exchangeGoods() {
    wx.navigateTo({
      url: '../exchangeGoods/exchangeGoods'
    })
  },
  // 打开物流弹框
  onOpenLogistics() {
    logisticspopup.show();
    this.setData({
      showLogistics: true
    })
  },
  // 关闭物流弹框
  onCloseLogistics() {
    this.setData({
      showLogistics: false
    })
  },
  // 物流信息
  logisticsInfo() {
    wx.navigateTo({
      url: '../logistics/logistics'
    })
  },
  // 立即支付
  payment() {
    wx.navigateTo({
      url: '../paySuccess/paySuccess'
    })
  },
  onHide() {
    clearTimeout(this.data.setTimeoutNumber);
  },
  onUnload() {
    clearTimeout(this.data.setTimeoutNumber);
  }
})