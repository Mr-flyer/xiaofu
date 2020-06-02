// pages/appSCar/index/index.js
import { cartData } from '../../../static/mock/cartData';
// import HTTP from '../../../utils/http';
// let http = new HTTP()
Component({
  options: {
    styleIsolation: 'shared', // 取消组件样式隔离, shared == 组件、外部样式共享
  },
  data: {
    orderList: [
      {
        name: "南京师范大学附属中学",
        result: [], checkedGroup: false,
        cartData: cartData.slice(0, 2),
      },
      {
        name: "科技金融大厦",
        result: [], checkedGroup: false,
        cartData: cartData.slice(2, 3),
      },
      {
        name: "奥体中心",
        result: [], checkedGroup: false,
        cartData: cartData.slice(3, 4),
      },
      {
        name: "浦口",
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
      // 所有商品
      let cartDataAll = this.data.orderList.map(v => v.cartData).flat()
      // 选中商品id
      let target = this.data.orderList.map(v => v.result).flat()
      // 选中商品详细信息
      let targetArr = target.map(id => cartDataAll.find(v => v.id == id))
      // 计算总价
      let totalPrice = targetArr.reduce((acc, cur) => acc + cur.price * cur.amount, 0)
      this.setData({
        totalPrice,
        checkedAll: field.every(v => v.checkedGroup) // 全选
      })
    }
  },
  attached: function(){
    // const taget = this.selectComponent(`#swipe-cell`);
    // taget.open()
    wx.login({
      success: function(res) {
        console.log(res);
      },
      fail(err) {
        console.log(err);
      }
    })
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
      orderList[index].cartData[idx].amount = e.detail;
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
    // 提交订单
    onClickButton() {
      wx.navigateTo({
        url: `/pages/order/settleCenter/settleCenter`
      })
    },
  }
})