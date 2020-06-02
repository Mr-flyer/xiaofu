// pages/login/loginMobile/index.js
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
import specialModel from '../../../models/special';
Page({
  data: {
    canUse: getApp().globalData.canUse,
    navbarData: {
      navigationBarTextStyle: 'black', // 胶囊主题 white || black
      navigationBarTitleText: '手机登录', //  导航栏标题文本
      // navigationBarBackgroundColor: 'aqua', // 导航栏背景色
      // statusBgColor: '', // 状态栏背景色
      // showPre: true, // 是否只展示返回键 默认 false
      hideCapsule: true, // 是否隐藏胶囊
    },
    initTime: 60, // 默认倒计时
    time: 60, // 初始倒计时
    // isBtnDisabled: true,

  },
  // 页面渲染后 执行
  onLoad: function() {
    // Notify("通知内容");
    // console.log(specialModel); 
  },
  // 表单提交 -- 登录
  formSubmit(e) {
    let { value } = e.detail
    let { smsid } = this.data
    for (let [key, val] of Object.entries(value)) {
      if(!val.trim()) {
        return Notify({
          message: "必填项不能为空！！",
          type: "warning",
        });
      }
    }
    // 是否最少发送过一次验证码
    if(!smsid) {
      return Notify({
        message: "请先获取短信验证码",
        type: "warning",
      });
    }
    value.smsid = smsid
    Toast.loading({ duration: 0, message: '提交中...' });
    // 手机验证码登录验证
    specialModel.pushStudentInfo(value)
    .then(res => {
      wx.navigateTo({
        url: `/pages/login/studentIdentity/index`
      })
    })
  },
  // 同步手机号码至 data
  handSetPhone({detail}) {
    this.data.phone = detail.trim()
  },
  // 获取验证码
  handGetCode(e) {
    // console.log(e);
    // return false
    let { phone } = this.data;
    if(!phone) {
      return Notify({
        message: "请先填写手机号码",
        type: "warning",
      });
    }else if(!(/^1[3456789]\d{9}$/.test(phone))){
      return Notify({
        message: "手机号输入有误！！",
        type: "warning",
      });
    }
    if(!this.data.isFlag) {
      this.data.isFlag = true;
      specialModel.getVerificationCode({phone})
      .then(({data}) => {
        this.data.smsid = data.smsid
      })
      let { time, initTime } = this.data
      this.timer = setInterval(() => {
        time--;
        if(time <= 0) { // 倒计时结束 -- 销毁定时器、初始化倒计时
          clearInterval(this.timer);
          this.data.isFlag = false
          this.setData({ isBtnDisabled: false, time: initTime })
        }else {
          this.setData({ time })
        }
      }, 1000)
      this.setData({ isBtnDisabled: true })
    }
  },
  // 跳过提交
  gotoIndex() {
    wx.redirectTo({
      url: `/pages/index/index`
    })
  },
})