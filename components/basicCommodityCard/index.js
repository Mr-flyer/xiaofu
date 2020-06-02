// components/shopCard/index.js
Component({
  externalClasses: ["custom-class", "goods-hd"],
  // options: {
  //   styleIsolation: 'shared', // 取消组件样式隔离, shared == 组件、外部样式共享
  // },
  /**
   * 组件的属性列表
   */
  properties: {
    goodsInfo: Object, // 商品数据
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () {
      
    },
    moved: function () { },
    detached: function () { },
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }

})
