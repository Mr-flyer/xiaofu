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
    console.log('订单页');
    let page = getCurrentPages()
    console.log("当前页面", page.pop());
    console.log(page[page.length-1]);
    let { targetArr, totalPrice } = page[page.length-1].data
    console.log(targetArr);
    this.setData({
      targetArr, totalPrice
    })
  },
  submitOrder() {
    let { orderOther } = this.data;
    if(!orderOther) {
      return Toast.fail('请选择收货地址')
    }
    let selectArr = this.data.targetArr.map(v => ({
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
      console.log(res);
    })
  },
  // 选择地址
  changeAddress() {
    let that = this
    wx.chooseAddress({
      success(res) {
        let orderOther = {
          country: '中国',
          province: res.provinceName,
          city: res.cityName,
          address: res.detailInfo,
          national_code: res.nationalCode,
          postal_code: res.postalCode,
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