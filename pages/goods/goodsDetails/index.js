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
    showSKU: false, // SKU显隐
    specs_list, // 默认商品规格数据
    count: 1, // 默认选择商品1数量
    stock: 10, // 可选商品数量
    name: '商品名称', // 商品名称
    price: 10, // 商品价格
    schoolName: 'xx学校',
    schoolId: 2,
  },
  onLoad: function(options) {
    console.log(options);
    this.setData({ ...options })
    specialModel.getGoodsDetail(options.goodsId)
    .then(({data}) => {
      console.log(data);
      this.setData({...data})
    })
    this.setData({
      "navbarData.navigationBarTitleText": "商品详情"
    });
    
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
    let { goodsId, price, name, count, school_name: schoolName, school_id: schoolId } = this.data
    let targetArr = this.data.specs_list.map(v => ({
      specs_info_id: v.val, name: v.selectVal
    }))
    let goodsInfo = {
      product_id: goodsId, price, name, count,
      specs_list: targetArr
    }
    // console.log(object);
    console.log(targetArr);
    
    if(targetArr.every(v => v.specs_info_id)) {
      // console.log("选择的商品规格：", targetArr);
      let shopCartData = wx.getStorageSync('shopCart')
      // console.log('添加商品至购物车', goodsInfo);
      if(shopCartData) {
        // console.log('添加成功');
        let targetGoods = shopCartData.find(v => v.schoolId === schoolId)
        if(targetGoods) {
          if(targetGoods.cartData) {
            goodsInfo.id = String(schoolId) + goodsId + targetGoods.cartData.length
            targetGoods.cartData.unshift(goodsInfo)
          }else {
            goodsInfo.id = goodsId + '0'
            targetGoods.cartData = [goodsInfo]
          }
        }else {
          goodsInfo.id = String(schoolId) + goodsId + '0'
          shopCartData.unshift({
            schoolName, schoolId, cartData: [goodsInfo]
          })
        }
        wx.setStorageSync('shopCart', shopCartData)
      }else {
        // console.log('sss');
        goodsInfo.id = String(schoolId) + goodsId + '0'
        wx.setStorageSync('shopCart', [
          {
            schoolName, schoolId, cartData: [goodsInfo]
          }
        ])
      }
      wx.navigateTo({
        url: `/pages/index/index?active=2`
      })
    }else if(!this.data.showSKU) {
      this.setData({ showSKU: true })
    }
  },
  // 步进器值改变时
  onChangeStepper({detail}) {
    this.data.count = detail;
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