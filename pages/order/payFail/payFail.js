const http = require('../../../utils/httpdemo');
import specialModel from '../../../models/special';
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
            order_id: ''
        },
    },
    onLoad(option) {
        if(option.order_id) {
            this.setData({
                order_id: option.order_id
            })
        }
    },
    // 查看订单
    viewOrder() {
        wx.navigateBack({
            delta: 1
        })
    },
    // 重新支付
    rePayment() {
        if(this.data.order_id) {
            specialModel.getPayment(this.data.order_id);
        }else  {
            wx.showToast({ title: '无订单需支付', icon: 'none', duration: 2000 });
        }
    }
})