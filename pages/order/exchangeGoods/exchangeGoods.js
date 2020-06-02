const http = require('../../../utils/httpdemo');
Page({
    data: {
        canUse: getApp().globalData.canUse,
        navbarData: {
            navigationBarTextStyle: 'black', // 胶囊主题 white || black
            navigationBarTitleText: '换货申请', //  导航栏标题文本
            // navigationBarBackgroundColor: 'aqua', // 导航栏背景色
            // statusBgColor: '', // 状态栏背景色
            // showPre: true, // 是否只展示返回键 默认 false
            // hideCapsule: true, // 是否隐藏胶囊
        },
        checked: true,
        showCause: false,
        causeList: ['质量问题', '尺码不合适']
    },
    onChange(event) {
        this.setData({
          checked: event.detail,
        });
    },
    // 选择地址
    changeAddress() {
        wx.chooseAddress({
            success (res) {
              console.log(res.userName)
              console.log(res.postalCode)
              console.log(res.provinceName)
              console.log(res.cityName)
              console.log(res.countyName)
              console.log(res.detailInfo)
              console.log(res.nationalCode)
              console.log(res.telNumber)
            },
            fail() {
                wx.getSetting({
                    success(res) {
                        if(!res.authSetting['scope.address']) {
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
    // 换货原因
    onConfirmCause() {
        this.setData({
            showCause: false
        })
    },
    // 打开换货原因
    onOpenCause() {
        this.setData({
            showCause: true
        })
    },
    // 关闭换货原因
    onCloseCause() {
        this.setData({
            showCause: false
        })
    },
    // 换货数量
    onChangeNumber() {

    },
    submit() {
        wx.navigateTo({
            url: '../exchangeGoodsConfirm/exchangeGoodsConfirm'
        })
    }
})