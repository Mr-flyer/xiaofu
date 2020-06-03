Component({
    options: {
       styleIsolation: 'shared', // 取消组件样式隔离, shared == 组件、外部样式共享
    },
    /**
     * 组件的属性列表
     */
    properties: {
      goodsInfo: {
        type: Object,
        value: {
          count: 1,
          id: "2d10",
          name: "商品名称",
          price: 30,
          product_id: "1",
          specs_list:[
            {specs_info_id: "o-101-EFGH", name: "女生"},
            {specs_info_id: "o-101-EFGH", name: "S"},
            {specs_info_id: "o-101-EFGH", name: "短裤"},
          ],
        }
      }
    },
    lifetimes: {
      attached: function() {
        // 在组件实例进入页面节点树时执行
        let tagsTxt = this.data.goodsInfo.specs_list.map(v => v.name).join('、')
        this.setData({ tagsTxt })
      },
      detached: function() {
        // 在组件实例被从页面节点树移除时执行
      },
    },
})