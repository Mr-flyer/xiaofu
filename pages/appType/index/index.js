// pages/appType/index/index.js
import specialModel from '../../../models/special';
Component({
  options: {
    styleIsolation: 'shared', // 取消组件样式隔离, shared == 组件、外部样式共享
  },
  data: {
    TabCur: 0, // 当前选中tab
    MainCur: 0, // 选中tab对应的内容
    VerticalNavTop: 0, // tab栏距顶距离
    list: [], // 商品数据列表
    load: true,
    searchValue: '',    //搜索值
    goodsInfo: [
      {
        superChapterId: 494,
        title: "Android Studio 4.0 稳定版发布了",
      },
      {
        superChapterId: 494,
        title: "Android Studio 4.0 稳定版发布了",
      },
      {
        superChapterId: 494,
        title: "Android Studio 4.0 稳定版发布了",
      }
    ]
  },
  attached: function(){
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    // let list = [{}];
    // for (let i = 0; i < 26; i++) {
    //   list[i] = {};
    //   list[i].name = String.fromCharCode(65 + i);
    //   list[i].id = i;
    // }
    // this.setData({
    //   list: list,
    //   listCur: list[0]
    // })
    specialModel.getGoodsTypes()
    .then(({data}) => {
      // let list = data.map(v => ({
      //   name: v.name, id: v.id
      // }))
      this.setData({
        list: data,
        listCur: data[0]
      })
      // console.log(data);
    })
    wx.hideLoading()
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
      let { index } = e.currentTarget.dataset
      console.log(index);
      wx.navigateTo({
        url: `/pages/goods/goodsDetails/index?goodsId=${index}`
      })
    },
    // 点击侧边栏时
    tabSelect(e) {
      this.setData({
        TabCur: e.currentTarget.dataset.id,
        MainCur: e.currentTarget.dataset.id,
        VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
      })
    },
    // 内容区域滑动时
    VerticalMain(e) {
      let that = this;
      let list = this.data.list;
      let tabHeight = 0;
      if (this.data.load) {
        for (let i = 0; i < list.length; i++) {
          // view == id 为 `main-${i}` 的页面节点实例对象
          let view = this.createSelectorQuery().select("#main-" + list[i].id);
          view.fields({
            size: true, // 是否返回节点尺寸
          }, data => {
            // console.log(data);
            list[i].top = tabHeight; // 距顶高度
            tabHeight = tabHeight + data ? data.height : 0;
            list[i].bottom = tabHeight;     
          }).exec();
        }
        that.setData({
          load: false,
          list: list
        })
      }
      let scrollTop = e.detail.scrollTop + 20;
      for (let i = 0; i < list.length; i++) {
        if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
          that.setData({
            VerticalNavTop: (list[i].id - 1) * 50,
            TabCur: list[i].id
          })
          return false
        }
      }
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
  }
  
})