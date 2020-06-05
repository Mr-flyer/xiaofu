// pages/appUser/index/index.js
import specialModel from '../../../models/special';
import Dialog from '../../../miniprogram_npm/@vant/weapp/dialog/dialog';
let loadMoreView, logisticspopup
Page({
  data: {
    canUse: getApp().globalData.canUse,
    navbarData: {
      navigationBarTextStyle: 'black', // 胶囊主题 white || black
      navigationBarTitleText: '我的订单', //  导航栏标题文本
      // navigationBarBackgroundColor: 'aqua', // 导航栏背景色
      // statusBgColor: '', // 状态栏背景色
      // showPre: true, // 是否只展示返回键 默认 false
      // hideCapsule: true, // 是否隐藏胶囊
    },
    
    showLogistics: false,
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
        "name": "3",
        "title": "待收货"
      },
      {
        "name": "4",
        "title": "已完成"
      },
      {
        "name": "5",
        "title": "退换中"
      }
    ],
    select: 0,
    topNum: 0, //滚动条位置
    refreshing: false, // 监听设为 true 时 ==> 触发refresh事件
    refreshed: false, // true ==> 收起下拉刷新，可多次设置为true（即便原来已经是true了）
    orderStatus: {
      1:"待付款", 2:"待发货", 3:"待收货", 4:"已完成", 5:"退换中",
    },
    activeOrderList: [],
    isRequest: false
  },
  onLoad(options) {
    if (options.status) {
      this.setData({
        active: options.status || 0
      })
    }
  },
  onShow() {
    if(this.data.active == 0) {
      specialModel.getOrderLists()
      .then(({
        data
      }) => {
        data = data || []
        data.forEach(el => {
          el.snap_items = JSON.parse(el.snap_items.replace(/'/gi,'"'))
          el.snap_address = JSON.parse(el.snap_address.replace(/'/gi,'"'))
          el.orderStatus = this.data.orderStatus[el.order_status]
        });
        this.setData({
          orderList: data,
          activeOrderList: data,
          isRequest: true
        })
      })
    }
    // 获取列表底侧加载更多组件实例
    loadMoreView = this.selectComponent("#loadMoreView");
    // 物流信息组件实例
    logisticspopup = this.selectComponent('#logisticspopup');
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
    this.setData({
      isRequest: false,
      topNum: 0
    })
    this.requestData();
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
  changeStatusList(e) {
    this.setData({
      topNum: 0,
      active: e.detail.index
    })
    this.requestData();
  },
  requestData() {
    let _that = this;
    if(!this.data.isRequest) {
      specialModel.getOrderLists()
      .then(({
        data
      }) => {
        data = data || []
        data.forEach(el => {
          el.snap_items = JSON.parse(el.snap_items.replace(/'/gi,'"'))
          el.snap_address = JSON.parse(el.snap_address.replace(/'/gi,'"'))
          el.orderStatus = this.data.orderStatus[el.order_status]
        });
        _that.setData({
          orderList: data,
          isRequest: true,
          refreshed: true
        })
        _that.selectOrderList(this.data.active);
      })
    }else {
      _that.selectOrderList(this.data.active);
    }
  },
  // 根据订单状体筛选订单列表
  selectOrderList(status) {
    if(status == 0) {
      this.setData({
        activeOrderList: this.data.orderList
      })
    }else {
      let tempOrderList = this.data.orderList.filter(item => item.order_status == status)
      this.setData({
        activeOrderList: tempOrderList
      })
    }
  },
  // 立即支付
  payment(e) {
    wx.showLoading({title: '拉取支付中...'})
    let { orderid } = e.currentTarget.dataset
    console.log(orderid);
    specialModel.getPayment(orderid);
  },
  // 退货
  handTuihuo() {
    Dialog.alert({
      title: '提示',
      message: '已申请退货，请保持手机网络畅通，已便于客服与您联系',
    })
    // console.log(object);
  },
})