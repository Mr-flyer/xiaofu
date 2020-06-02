const http = require('../../../utils/httpdemo');
Page({
    options: {
        styleIsolation: 'shared', // 取消组件样式隔离, shared == 组件、外部样式共享
    },
    data: {
        canUse: getApp().globalData.canUse,
        navbarData: {
            navigationBarTextStyle: 'black', // 胶囊主题 white || black
            navigationBarTitleText: '订单跟踪', //  导航栏标题文本
            // navigationBarBackgroundColor: 'aqua', // 导航栏背景色
            // statusBgColor: '', // 状态栏背景色
            // showPre: true, // 是否只展示返回键 默认 false
            // hideCapsule: true, // 是否隐藏胶囊
        },
        steps: [
            {
              text: '您的订单已确认，仓库正在配送',
              desc: '2020-10-19 18:54:30'
            },
            {
              text: '您的订单已提交，正在打包',
              desc: '2020-10-19 18:54:30'
            },
            {
              text: '您的订单已提交，正在打包',
              desc: '2020-10-19 18:54:30'
            }
        ],
    },
    // 复制物流单号
    copyText() {
        wx.setClipboardData({
            data: '这是要复制的文字',
            success: function() {
                wx.showToast({
                    title: '复制成功'
                })
            }
        })
    }
})