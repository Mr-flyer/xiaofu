//index.js
const http = require('../../../utils/httpdemo')
import specialModel from '../../../models/special';
let loadMoreView, searchView, page = 0
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
        page: 0, // 页码
        name: '春夏校服', // tab项标题
      },
      "project": {
        load: true,
        page: 0,
        name: '秋冬校服',
      }
    },
    searchValue: '',    //搜索值
    scrollTop: 0,
    offsetTop: 0,
    // tags: [
    //   {
    //     text: "标签1"
    //   },
    //   {
    //     text: "标签2"
    //   },
    //   {
    //     text: "标签3"
    //   },
    //   {
    //     text: "标签3"
    //   },
    //   {
    //     text: "标签3"
    //   },
    // ]
  },  
  attached: function() {
    // 初始化页面数据
    this.loadData('article', true)
    // 获取列表底侧加载更多组件实例
    loadMoreView = this.selectComponent("#loadMoreView");
    searchView = this.selectComponent("#searchView");
    // searchView.show(this.data.searchValue);
  },
  pageLifetimes: {
    show() {
      this.setData({
        searchValue: ''
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
    onScroll(event) {
      wx.createSelectorQuery()
        .select('#scroller')
        .boundingClientRect((res) => {
          this.setData({
            scrollTop: event.detail.scrollTop,
            // offsetTop: res.top,
          });
        })
        .exec();
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
      let { active, tabsObj } = this.data
      // 只更新当前tab项中页码
      tabsObj[active].page = 0
      this.loadData(active, false)
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
    loadData(viewType, showLoading) {
      var that = this
      let activeTab = this.data.tabsObj[viewType]
      specialModel.getGoodsList({page: 1})
      .then(({data}) => {
        // console.log(data);
        activeTab.load = false
          var items = that.data.items
          if(activeTab.page == 0) { // 如果是第一页则直接替换
            items = data.items
            // wx.stopPullDownRefresh()
          } else { // 反之则往后拼接
            items = items.concat(data.items)
          }
          that.setData({
            items: items, refreshed: true,
            active: viewType
          })
          loadMoreView.loadMoreComplete({curPage: data.page, pageCount: data.pages})
      }).catch(err => {
        if(page!=0) {
          loadMoreView.loadMoreFail() 
        }
      })
      // http.get({
      //   url: `/${viewType}/list/${page}/json`,
      //   // showLoading,
      //   showLoading: activeTab.page == 0 && activeTab.load, // 切换tab项后若为首次加载则展示loading
      //   success: (res) => {
      //     activeTab.load = false
      //     var items = that.data.items
      //     if(activeTab.page == 0) { // 如果是第一页则直接替换
      //       items = res.datas
      //       // wx.stopPullDownRefresh()
      //     } else { // 反之则往后拼接
      //       items = items.concat(res.datas)
      //     }
      //     that.setData({
      //       items: items, refreshed: true,
      //       active: viewType
      //     })
      //     console.log(res);
      //     loadMoreView.loadMoreComplete(res)
      //   },
      //   fail: () => {
      //     if(page!=0) {
      //       loadMoreView.loadMoreFail() 
      //     }
      //   }
      // })
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