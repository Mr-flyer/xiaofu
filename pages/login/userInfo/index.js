// pages/login/userInfo/index.js
import Notify from '../../../miniprogram_npm/@vant/weapp/notify/notify';
import dayjs from '../../../utils/dayjs';
import specialModel from '../../../models/special';
import { saveTokens, getToken, removeToken } from '../../../utils/token';
Page({
  data: {
    canUse: getApp().globalData.canUse,
    navbarData: {
      navigationBarTextStyle: 'black', // 胶囊主题 white || black
      navigationBarTitleText: '完善个人信息', //  导航栏标题文本
      // navigationBarBackgroundColor: 'aqua', // 导航栏背景色
      // statusBgColor: '', // 状态栏背景色
      // showPre: true, // 是否只展示返回键 默认 false
      hideCapsule: true, // 是否隐藏胶囊
    },
    showTime: false, // 时间选择器显隐
    // minDate: new Date(2020, 0, 1).getTime(),
    maxDate: new Date().getTime(), // 可选最大时间 -- 时间选择器
    currentDate: new Date().getTime(), // 默认选中时间 -- 时间选择器
    formatter(type, value) { // 格式下拉框文本 -- 时间选择器
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`
      }
      return value;
    },
    frmData: { // 表单提交数据
      sex: "1",
      school: "",
      admission_date: "",
      student_class: "",
      user_name: "",
      student_id: "",
    },
    icon: { // 性别选择图集
      normal_boy: '/static/images/other/sex_boy@2x.png',
      active_boy: '/static/images/other/sex_boy_active@2x.png',
      normal_girl: '/static/images/other/sex_girl@2x.png',
      active_girl: '/static/images/other/sex_girl_active@2x.png',
    },
  },
  onLoad: function(option) {
    let _that = this;
    // 获取用户选择的新、旧生并存入要提交的表单
    Object.assign(this.data.frmData, {new_student: option.new_student ? option.new_student : ''});
    if(option.isEdit) {
      specialModel.getStudentInfo().then(({
        data
      }) => {
        _that.setData({
          "frmData.sex": data.sex==0?'1':'2',
          "frmData.school": data.school,
          "frmData.admission_date": data.admission_date,
          "frmData.student_class": data.student_class,
          "frmData.user_name": data.user_name,
          "frmData.student_id": data.student_id,
          enrollmentTime: data.admission_date ? dayjs(parseInt(data.admission_date)).format('YYYY年-MM月-DD日') : ''
        })
      })
    }
    // getApp().mta() // 小程序SDK 埋点
  },
  // 表单提交时
  frmSubmit() {
    let _that = this;
    let { frmData } = this.data
    for (let [key, val] of Object.entries(frmData)) {
      if(!String(val).trim()) {
        return Notify({
          message: "必填项不能为空！",
          type: "warning",
        }); 
      }
    }
    // console.log("校验通过", frmData);
    specialModel.pushStudentInfo(frmData)
    .then(res => {
      wx.setStorageSync('need_user_info', false);
      wx.showToast({
        title: _that.isEdit ?'修改成功':'登记成功'
      })
      wx.reLaunch({
        url: `/pages/index/index`
      })
    })
  },
  // 输入框失焦时 -- 记录表单值
  handIptBlur(e) {
    let { name } = e.currentTarget.dataset
    this.data.frmData[name] = e.detail.value
    // console.log(this.data.frmData);
  },
  // 选择性别
  onChangeRadioSex(event) {
    this.setData({
      "frmData.sex": event.detail,
    });
  },
  // 选择日期 -- 开启日期下拉窗
  handShowTimePicker() {
    this.setData({
      showTime: true,
    })
  },
  // 日期下拉窗 -- 确认
  handTimepickerConfirm({detail}) {
    let targetTime = dayjs(detail).format('YYYY年-MM月-DD日')
    this.setData({
      showTime: false,
      enrollmentTime: targetTime,
      "frmData.admission_date": detail
    })
  },
  // 日期下拉窗 -- 取消
  handTimepickerCancel() {
    this.setData({
      showTime: false,
    })
  },
  gotoIndex() {
    wx.reLaunch({
      url: `/pages/index/index`
    })
  }
})