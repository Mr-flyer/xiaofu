//index.js
import specialModel from '../../../models/special';
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
// Toast.loading()
Component({
  options: {
    styleIsolation: 'shared', // 取消组件样式隔离, shared == 组件、外部样式共享
  },
  data: {
    refreshing: false, // 监听设为 true 时 ==> 触发refresh事件
    refreshed: false, // true ==> 收起下拉刷新，可多次设置为true（即便原来已经是true了）
    active: "article", // 当前激活tab项标识字段
    tabsObj: { // tab项列表
      "article": {
        load: true, // 首次加载
        page: 1, // 页码
        name: '春夏校服', // tab项标题
      },
      "project": {
        load: true,
        page: 1,
        name: '秋冬校服',
      }
    },
    initPage: 1,
    searchValue: '',    //搜索值
  },  
  lifetimes: {
    attached: function() {
      // 初始化页面数据
      this.loadData('article')
      // 获取列表底侧加载更多组件实例
      this.loadMoreView = this.selectComponent("#loadMoreView");
    },
  },

  pageLifetimes: {
    show() {
      this.setData({
        searchValue: ''
      })
    }
  },
  methods: {
    gotoGoodsDetails(e) {
      let { goodid } = e.currentTarget.dataset;
      wx.navigateTo({
        url: `/pages/goods/goodsDetails/index?goodsId=${goodid}`
      })
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
      let { active, tabsObj } = this.data
      // 只更新当前tab项中页码
      tabsObj[active].page = 1
      this.loadData(active, false)
    },
  
    /**
     * 页面上拉触底事件的组件内处理函数
     */
    onReachBottom() { this.loadMoreView.loadMore() },
    /**
     * 请求新数据
     * @param {String} viewType tab项类型 
     */
    loadData(viewType) {
      let { initPage } = this.data
      // 获取当前tab 相关参数
      let activeTab = this.data.tabsObj[viewType]
      specialModel.getGoodsList(activeTab.page)
      .then(({data}) => {
        Toast.clear()
        activeTab.load = false
          var items = this.data.items
          if(activeTab.page === initPage) { // 如果是第一页则直接替换
            items = data.items
            // wx.stopPullDownRefresh()
          } else { // 反之则往后拼接
            items = items.concat(data.items)
          }
          this.setData({
            items: items, refreshed: true,
            active: viewType
          })
          this.loadMoreView.loadMoreComplete({curPage: data.page, pageCount: data.pages})
      }).catch(err => {
        if(activeTab.page != initPage) {
          this.loadMoreView.loadMoreFail() 
        }
      })
    },
    /**
     * 页面上拉触底事件的实际处理函数 -- 由组件内部调用
     */
    loadMoreListener(e) {
      let { active, tabsObj } = this.data
      // 只更新当前tab项中页码
      tabsObj[active].page += 1
      this.loadData(active, false)
    },
    // 加载失败点击从新加载
    clickLoadMore(e) {
      this.loadData(this.data.active, false)
    },
    searchChange(e) {
      this.setData({
        searchValue: e.detail
      })
    },
    // 搜索
    searchEvent(val) {
      if(this.data.searchValue) {
        wx.navigateTo({
          url: `/pages/goods/searchList/index?searchValue=${this.data.searchValue}`
        })
      }else {
        wx.showToast({ title: '请输入学校名称', icon: 'none', duration: 2000 });
      }
    },
    // tab项切换后触发
    onChange(e) {
      let { name } = e.detail
      let { tabsObj } = this.data
      // 更新选中标识字段
      this.data.active = name
      // 只更新当前tab项中页码
      tabsObj[name].page = 0
      this.loadData(name, true)
    },
    // 关闭标签 
    handClose(e) {
      let { index } = e.currentTarget.dataset
      console.log(index);
      let { tags } = this.data
      tags.splice(index, 1)
      this.setData({ tags })
    }
  }
})