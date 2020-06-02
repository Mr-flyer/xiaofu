// pages/goods/goodsDetails/index.js
import { types } from "../../../static/mock/goodsTypes";
import specialModel from '../../../models/special';
Page({
  data: {
    canUse: getApp().globalData.canUse,
    navbarData: {
      navigationBarTextStyle: 'black', // 胶囊主题 white || black
      navigationBarTitleText: '商品详情', //  导航栏标题文本
      // navigationBarBackgroundColor: 'aqua', // 导航栏背景色
      // statusBgColor: '', // 状态栏背景色
      // showPre: true, // 是否只展示返回键 默认 false
      // hideCapsule: true, // 是否隐藏胶囊
    },
    swiperSeq: 1,
    time: 30 * 60 * 60 * 1000,
    showactionSheet: false,
    radio: "1",
    types
  },
  onLoad: function(options) {
    console.log(options);
    this.setData({ ...options })
    specialModel.getGoodsDetail(options.goodsId)
    .then(({data}) => {
      console.log(data);
      this.setData({...data})
    })
    // this.setData({
    //   "navbarData.navigationBarTitleText": "商品详情"
    // });
    
  },
  // formSubmit(e) {
  //   console.log(e);
  // },
  
  gotoOrder() {
    wx.navigateTo({
      url: `/pages/order/settleCenter/settleCenter`
    })
  },
  // 商品图片轮播切换完成时
  hangSwiperEnd(e) {
    let { current: swiperSeq } = e.detail
    this.setData({
      swiperSeq: ++swiperSeq,
    })
  },
  // 计时器数值改变时
  onChangeTimeDown(e) {
    this.setData({
      timeData: e.detail,
    });
  },
  // 选择商品规格
  onChangeRadio(e) {
    let { detail } = e
    let { idx } = e.currentTarget.dataset
    let selectVal = this.data.specs_list[idx].specs_info.find(v => v.specs_info_id == detail).name
    this.setData({ 
      [`specs_list[${idx}].val`]: detail,
      [`specs_list[${idx}].selectVal`]: selectVal,
    })
  },
  // 添加至购物车
  addShopCart() {
    let targetArr = this.data.specs_list.map(v => v.val)
    if(targetArr.every(v => v)) {
      console.log("选择的商品规格：", targetArr);
      wx.navigateTo({
        url: `/pages/index/index?active=2`
      })
    }else if(!this.data.showactionSheet) {
      this.setData({ showactionSheet: true })
    }
    // let txtArr = this.data.specs_list.map(v => v.selectVal)
    // console.log("选择的商品规格：", txtArr);

  },
  // 步进器值改变时
  onChangeStepper({detail}) {
    // console.log(detail);
    // this.setData({ stock: detail })
  },
  // 显示上拉弹窗
  hangActionSheetShow() {
    this.setData({ showactionSheet: true })
  },
  // 隐藏下拉弹窗
  hangActionSheetClose() {
    let selectTxt = this.data.specs_list.map(v => v.selectVal).join('、')
    console.log("选择的商品规格：", selectTxt);
    this.setData({ 
      showactionSheet: false,
      selectTxt
    })
  }
})