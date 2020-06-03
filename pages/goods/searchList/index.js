//index.js
const http = require('../../../utils/httpdemo')
import specialModel from '../../../models/special';
let loadMoreView, searchView, page = 1;
Page({
  options: {
    styleIsolation: 'shared', // 取消组件样式隔离, shared == 组件、外部样式共享
  },
  data: {
    canUse: getApp().globalData.canUse,
    navbarData: {
      navigationBarTextStyle: 'black', // 胶囊主题 white || black
      navigationBarTitleText: '校服预定', //  导航栏标题文本
      // navigationBarBackgroundColor: 'aqua', // 导航栏背景色
      // statusBgColor: '', // 状态栏背景色
      // showPre: true, // 是否只展示返回键 默认 false
      // hideCapsule: true, // 是否隐藏胶囊
    },
    items: [],
    refreshing: false, // 监听设为 true 时 ==> 触发refresh事件
    refreshed: false, // true ==> 收起下拉刷新，可多次设置为true（即便原来已经是true了）
    searchValue: '',    //搜索值
    autoFocus: false,   //自动获取焦点
  },  
  onLoad: function(options) {
    if(options.searchValue) {
      this.setData({
        searchValue: options.searchValue
      })
    }
    // 获取列表底侧加载更多组件实例
    loadMoreView = this.selectComponent("#loadMoreView");
    searchView = this.selectComponent("#searchView");
    // searchView.show(this.data.searchValue);
    // 初始化页面数据
    this.loadData( true);
  },
  gotoGoodsDetails(e) {
    let { goodid } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/goods/goodsDetails/index?goodsId=${goodid}`
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    page=1;
    this.loadData( false)
  },

  /**
   * 页面上拉触底事件的组件内处理函数
   */
  onReachBottom() { loadMoreView.loadMore() },
  /**
   * 请求新数据
   * @param {String} viewType tab项类型 
   * @param {*} showLoading 
   */
  loadData(showLoading) {
    var that = this
    specialModel.getGoodsSearch({q:this.data.searchValue, page: page})
    .then(({data}) => {
        var items = that.data
        if(page==1) { // 如果是第一页则直接替换
          items = data
          // wx.stopPullDownRefresh()
        } else { // 反之则往后拼接
          items = items.concat(data.items)
        }
        that.setData({
          items: items, refreshed: true,
        })
        loadMoreView.loadMoreComplete({curPage: data.page, pageCount: data.pages})
    }).catch(err => {
      if(page!=1) {
        loadMoreView.loadMoreFail() 
      }
    })
  },
  /**
   * 页面上拉触底事件的实际处理函数 -- 由组件内部调用
   */
  loadMoreListener(e) {
    page++;
    this.loadData(false)
  },
  // 加载失败点击从新加载
  clickLoadMore(e) {
    this.loadData(false)
  },
  searchChange(e) {
    this.setData({
      searchValue: e.detail
    })
  },
  // 搜索
  searchEvent() {
    if(this.data.searchValue) {
      page = 1;
      this.loadData(false);
    }else {
      wx.showToast({ title: '请输入学校名称', icon: 'none', duration: 2000 });
    }
  }
})