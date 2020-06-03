// pages/appSCar/index/index.js
import { cartData } from '../../../static/mock/cartData';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
// import HTTP from '../../../utils/http';
// let http = new HTTP()
Component({
  options: {
    styleIsolation: 'shared', // 取消组件样式隔离, shared == 组件、外部样式共享
  },
  data: {
    orderList: [
      {
        schoolName: "南京师范大学附属中学",
        result: [], checkedGroup: false,
        cartData: cartData.slice(0, 2),
      },
      {
        schoolName: "科技金融大厦",
        result: [], checkedGroup: false,
        cartData: cartData.slice(2, 3),
      },
      {
        schoolName: "奥体中心",
        result: [], checkedGroup: false,
        cartData: cartData.slice(3, 4),
      },
      {
        schoolName: "浦口",
        result: [], checkedGroup: false,
        cartData: cartData.slice(4, 5),
      },
    ],
    // cartData: cartData.slice(0, 2),
    // result: ['a', 'b']
    // adminShow: true,//编辑或完成      
    totalPrice: 0,//总金额 
    checkedAll: false,//是否全选
    // selectArr: [], //已选择的商品  
  },
  observers: {
    "orderList": function (field) {
      let { orderList } = this.data
      if(!Array.isArray(orderList)) return false
      // 所有商品
      let cartDataAll = orderList.map(v => v.cartData).flat()
      // 选中商品id 数组
      let target = orderList.map(v => v.result).flat()
      // 选中商品详细信息 数组
      let targetArr = target.map(id => cartDataAll.find(v => v.id == id))
      if(targetArr[0]) {
        this.data.targetArr = targetArr
        console.log('订单数组', targetArr);
      }
      // console.log("选中商品", targetArr);
      // 计算总价
      let totalPrice = 0
      if(targetArr.every(v => v)) {
        totalPrice = targetArr.reduce((acc, cur) => acc + cur.price * cur.count, 0)
      }
      this.setData({
        totalPrice,
        checkedAll: field.length && field.every(v => v.checkedGroup) // 全选
      })
    }
  },
  attached: function(){
    // const taget = this.selectComponent(`#swipe-cell`);
    // taget.open()
    // 本地缓存购物车数据
    let shopCartData = wx.getStorageSync('shopCart')
    this.setData({ orderList: shopCartData })
  },
  methods: {
    // 店铺复选框
    onChangeGruop(e) {
      let { orderList } = this.data 
      let { idx } = e.currentTarget.dataset
      let { detail } = e
      // orderList[idx].cartData.forEach(el => {
      //   el.checked = detail
      // });
      orderList[idx].result = detail ? orderList[idx].cartData.map(v => String(v.id)) : []
      orderList[idx].checkedGroup = detail;
      this.setData({
        orderList,
      })
    },
    // 商品复选框
    onChangeCheckbox(e) {
      // console.log('当前选中值', e);
      let { idx } = e.currentTarget.dataset
      let { detail } = e
      let { orderList } = this.data
      orderList[idx].checkedGroup = orderList[idx].cartData.length === detail.length;
      orderList[idx].result = detail;
      this.setData({
        orderList
        // [`orderList[${idx}].checkedGroup`]: orderList[idx].cartData.length === detail.length,
        // [`orderList[${idx}].result`]: detail,
      });
    },
    // 步进器
    onChangeStepper(e) {
      let { orderList } = this.data
      let { index, idx } = e.currentTarget.dataset
      orderList[index].cartData[idx].count = e.detail;
      this.setData({
        orderList
      })
    },
    // 全选时
    onChangeCheckAll({detail}) {
      let { orderList } = this.data
      orderList.forEach(el => {
        el.result = detail ? el.cartData.map(v => String(v.id)) : []
        el.checkedGroup = detail
      });
      this.setData({
        orderList,
        checkedAll: detail
      })
    },
    // 立即支付 --- 页脚商品导航
    onSubmitOrder() {
      let { targetArr } = this.data
      if(!Array.isArray(targetArr)) {
        return Toast('最少选择一件商品')
      }else {
        let selectArr = targetArr.map(v => ({
          product_id: v.product_id,
          count: v.count,
          specs_list: v.specs_list,
        }))
        console.log('支付data', selectArr);
        wx.navigateTo({
          url: `/pages/order/settleCenter/settleCenter`
        })
      }
    },
    // 删除商品导航
    onCloseGoods(e) {
      let { instance } = e.detail  // 当前 van-swipe-cell实例 -- 组件参数
      let { id } = e.currentTarget.dataset // 当前 商品 唯一标识（区分与商品ID）
      let { orderList } = this.data // 购物车列表数据
      orderList.forEach((v, i) => {
        if(v.cartData.length == 1) {
          orderList.splice(i, 1)
        }else {
          let idx = v.cartData.findIndex(v => v.id == id)
          idx >= 0 && v.cartData.splice(idx, 1)
          let index = v.result ? v.result.findIndex(v => v == id) : -1
          index >= 0 && v.result.splice(index, 1)
          instance.close()
        }
      })
      this.setData({ orderList })
    }
  }
})