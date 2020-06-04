import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import specialModel from '../../../models/special';
Page({
  data: {
    canUse: getApp().globalData.canUse,
    navbarData: {
      navigationBarTextStyle: 'black', // 胶囊主题 white || black
      navigationBarTitleText: '结算中心', //  导航栏标题文本
      // navigationBarBackgroundColor: 'aqua', // 导航栏背景色
      // statusBgColor: '', // 状态栏背景色
      // showPre: true, // 是否只展示返回键 默认 false
      // hideCapsule: true, // 是否隐藏胶囊
    },
  },
  onLoad: function () {
    let page = getCurrentPages()
    // console.log("当前页面", page.pop());
    console.log("前一页data:", page[page.length-2].data);
    // 获取购物车页data
    let { targetArr, totalPrice } = page[page.length-2].data
    console.log(targetArr, totalPrice);
    this.setData({
      targetArr, totalPrice
    })
  },
  submitOrder() {
    let { orderOther, targetArr } = this.data;
    if(!orderOther) {
      return Toast.fail('请选择收货地址')
    }
    let selectArr = targetArr.map(v => ({
      product_id: v.product_id,
      product_count: v.count,
      specs_list: v.specs_list,
    }))
    console.log('支付data', {
      products: selectArr, ...orderOther
    });
    specialModel.setGoodsOrder({
      products: selectArr, ...orderOther
    }).then(res => {
      specialModel.getPayment(res.data.order_id)
      let orderList = wx.getStorageSync('shopCart')
      targetArr.forEach(val => {

        orderList.forEach((v, i) => {
          if(v.cartData.length == 1 && v.cartData.findIndex(v => v.id == val.id) >= 0) {
            orderList.splice(i, 1)
          }else {
            let idx = v.cartData.findIndex(v => v.id == val.id)
            idx >= 0 && v.cartData.splice(idx, 1)
            let index = v.result ? v.result.findIndex(v => v == id) : -1
            index >= 0 && v.result.splice(index, 1)
          }
        })
      })
      wx.setStorageSync('shopCart', orderList)
    })
  },
  // 选择地址
  changeAddress() {
    console.log(111);
    let that = this
    wx.chooseAddress({
      success(res) {
        console.log(res);
        let orderOther = {
          country: '中国',
          province: res.provinceName,
          city: res.cityName,
          address: res.detailInfo,
          national_code: res.nationalCode,
          postal_code: res.postalCode,
          user_name: res.userName,
          // tel_number: res.telNumber
          tel_number: "13637348894"
        }
        that.setData({
          orderOther,
          orderAddress: {
            ...orderOther,
            userName: res.userName
          }
        })
      },
      fail() {
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.address']) {
              wx.showModal({
                title: '用户未授权',
                content: '拒绝授权将不能体验小程序完整功能，点击确定开启授权',
                success: (res) => {
                  if (res.confirm) {
                    wx.openSetting({})
                  }
                }
              })
            }
          }
        })
      }
    })
  },
})