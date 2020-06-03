Component({
  options: {
      styleIsolation: 'shared', // 取消组件样式隔离, shared == 组件、外部样式共享
  },
  properties: {
    searchValue: {
      type: String,
      value: ''
    }
  },
  data: {
    // autoFocus: false,   //自动获取焦点
  },
  attached(){
  },
  methods: {
    // // 获取焦点
    // searchFocus() {
    //   this.setData({
    //     autoFocus: true
    //   })
    // },
    // // 搜索框取消
    // searchCancel() {
    //   this.setData({
    //     autoFocus: false
    //   })
    // },
    searchOnChange(e) {
      this.triggerEvent('searchChange', e.detail);
    },
    onSearch() {
      this.triggerEvent('searchEvent', '');
    }
  }
})