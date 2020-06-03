// pages/goods/goodsDetails/index.js
import { specs_list } from "../../../static/mock/goodsTypes";
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
    swiperSeq: 1,  // 
    time: 30 * 60 * 60 * 1000, // 倒计时
    showSKU: true, // SKU显隐
    specs_list, // 默认商品规格数据
    stepNum: 1, // 默认选择商品1数量
    stock: 10, // 可选商品数量
    name: '商品名称', // 商品名称
    price: 10, // 商品价格
  },
  onLoad: function(options) {
    console.log(options);
    this.setData({ ...options })
    // specialModel.getGoodsDetail(options.goodsId)
    // .then(({data}) => {
    //   console.log(data);
    //   this.setData({...data})
    // })
    // this.setData({
    //   "navbarData.navigationBarTitleText": "商品详情"
    // });
    
  },
  // 前往订单页
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
    let { goodsId, price, name } = this.data
    let targetArr = this.data.specs_list.map(v => ({
      id: v.val, name: v.name
    }))
    let goodObj = {
      goodsId, price, name, tags: targetArr
    }
    // if(targetArr.every(v => v)) {
      console.log("选择的商品规格：", targetArr);
      let shopCartData = wx.getStorageSync('shopCart')
      if(shopCartData) {
        
      }else {
        wx.setStorageSync('shopCart', [])
      }
      // wx.navigateTo({
      //   url: `/pages/index/index?active=2`
      // })
    // }else if(!this.data.showSKU) {
    //   this.setData({ showSKU: true })
    // }
  },
  // 步进器值改变时
  onChangeStepper({detail}) {
    this.data.stock = detail;
  },
  // 显示上拉弹窗
  hangActionSheetShow() {
    this.setData({ showSKU: true })
  },
  // 隐藏下拉弹窗
  hangActionSheetClose() {
    let selectTxt = this.data.specs_list.map(v => v.selectVal).join('、')
    console.log("选择的商品规格：", selectTxt);
    this.setData({ 
      showSKU: false,
      selectTxt
    })
  }
})