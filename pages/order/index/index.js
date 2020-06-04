// pages/appUser/index/index.js
import specialModel from '../../../models/special';
let loadMoreView, logisticspopup, page = 0;
Page({
  data: {
    showLogistics: false,
    canUse: getApp().globalData.canUse,
    navbarData: {
      navigationBarTextStyle: 'black', // 胶囊主题 white || black
      navigationBarTitleText: '我的订单', //  导航栏标题文本
      // navigationBarBackgroundColor: 'aqua', // 导航栏背景色
      // statusBgColor: '', // 状态栏背景色
      // showPre: true, // 是否只展示返回键 默认 false
      // hideCapsule: true, // 是否隐藏胶囊
    },
    active: '0',
    tabsArr: [{
        "name": "0",
        "title": "全部"
      },
      {
        "name": "1",
        "title": "待付款"
      },
      {
        "name": "2",
        "title": "待收货"
      },
      {
        "name": "3",
        "title": "已完成"
      },
      {
        "name": "4",
        "title": "换货中"
      }
    ],
    select: 0,
    topNum: 0, //滚动条位置
    refreshing: false, // 监听设为 true 时 ==> 触发refresh事件
    refreshed: false, // true ==> 收起下拉刷新，可多次设置为true（即便原来已经是true了）
    orderStatus: {
      1:"待付款", 2:"待发货", 3:"待收货", 4:"已完成", 5:"退换中",
    }
  },
  onShow() {
    specialModel.getOrderLists()
      .then(({
        data
      }) => {
        data.forEach(el => {
          el.snap_items = JSON.parse(el.snap_items.replace(/'/gi,'"'))
          el.snap_address = JSON.parse(el.snap_address.replace(/'/gi,'"'))
          el.orderStatus = this.data.orderStatus[el.order_status]
        });
        console.log(data);
        this.setData({
          orderList: data
        })
      })
    // 获取列表底侧加载更多组件实例
    loadMoreView = this.selectComponent("#loadMoreView");
    // 物流信息组件实例
    logisticspopup = this.selectComponent('#logisticspopup');
  },
  onLoad(options) {
    if (options) {
      this.setData({
        active: options.status
      })
    }
  },
  // 订单列表展开与收起
  moreOpen() {
    if (this.data.select === 0) {
      this.setData({
        select: 1
      })
    } else {
      this.setData({
        select: 0
      })
    }
  },
  onScroll(event) {
    //   wx.createSelectorQuery()
    //     .select('#scroller')
    //     .boundingClientRect((res) => {
    //       this.setData({
    //         scrollTop: event.detail.scrollTop,
    //         // offsetTop: res.top,
    //       });
    //     })
    //     .exec();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // let { active, tabsObj } = this.data
    // // 只更新当前tab项中页码
    // tabsObj[active].page = 0
    // this.loadData(active, false)
  },

  /**
   * 页面上拉触底事件的组件内处理函数
   */
  onReachBottom() {
    loadMoreView.loadMore()
  },
  /**
   * 请求新数据
   * @param {String} viewType tab项类型 
   * @param {*} showLoading 
   */
  loadData(viewType, showLoading) {

  },
  /**
   * 页面上拉触底事件的实际处理函数 -- 由组件内部调用
   */
  loadMoreListener(e) {
    //   let { active, tabsObj } = this.data
    //   // 只更新当前tab项中页码
    //   tabsObj[active].page += 1
    //   this.loadData(active, false)
  },
  // 加载失败点击从新加载
  clickLoadMore(e) {
    //   this.loadData(this.data.active, false)
  },
  // 打开物流弹框
  onOpenLogistics() {
    logisticspopup.show();
    this.setData({
      showLogistics: true
    })
  },
  // 关闭物流弹框
  onCloseLogistics() {
    this.setData({
      showLogistics: false
    })
  },
  // 查看物流
  viewLogistics() {
    wx.navigateTo({
      url: '../logistics/logistics'
    })
  },
  // 订单详情页
  orderDetailBtn(e) {
    let { orderid } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/order/orderDetail/orderDetail?orderId=${orderid}`
    })
  },
  // 切换状态列表时滚动条回到顶部
  changeStatusList() {
    this.setData({
      topNum: 0
    })
  },
  // 立即支付
  payment(e) {
    let { orderid } = e.currentTarget.dataset
    console.log(orderid);
    specialModel.getPayment(orderid);
  },
})