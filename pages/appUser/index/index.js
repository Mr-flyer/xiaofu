// pages/appUser/index/index.js
const http = require('../../../utils/httpdemo');
import specialModel from '../../../models/special';
Component({
    data: {
        orderStatusList:[
            {
                status: 1,
                img: '../../../static/images/personal/pay_status_1.png',
                name: '待付款',
                num: 1
            },{
                status: 2,
                img: '../../../static/images/personal/pay_status_2.png',
                name: '待收货',
                num: 0
            },{
                status: 3,
                img: '../../../static/images/personal/pay_status_3.png',
                name: '已完成',
                num: 0
            },{
                status: 4,
                img: '../../../static/images/personal/pay_status_4.png',
                name: '换货中',
                num: 0
            }
        ]
    },
    attached: function(){
      specialModel.getStudentInfo().then(({data}) => {
        console.log(data);
        this.setData({
          userInfo: data
        })
      })
    },
    methods: {
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
        //  我的订单
        myOrder(e) {
            if(e.currentTarget.dataset.status) {
                wx.navigateTo({
                    url: `../order/index/index?status=${e.currentTarget.dataset.status}`
                })
                
            }else {
                wx.navigateTo({
                    url: '../order/index/index?status=0'
                })
            }
        },
        editUserInfo() {
          wx.navigateTo({
            url: `/pages/login/studentIdentity/index`
          })
        }
    }
})