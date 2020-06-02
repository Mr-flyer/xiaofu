Component({
  options: {
      styleIsolation: 'shared', // 取消组件样式隔离, shared == 组件、外部样式共享
  },
  /**
   * 组件的属性列表
   */
  properties: {
    showLogistics: {
      type: Boolean,
      value: false
    }
  },
  data: {
    isLogisticsNumber: false,
    isLlogisticsCompany: false
  },
  methods: {
    // 关闭物流弹框
    onCloseLogistics() {
      this.triggerEvent('myevent', '');
    },
    // 输入物流单号
    onChangeLogisticsNumber(e) {
      this.setData({
        logisticsNumber: e.detail,
        isLogisticsNumber: false
      })
    },
    logisticsConfirm() {
      if(!this.data.logisticsNumber) {
        this.setData({
          isLogisticsNumber: true
        })
      }
      if(!this.data.logisticsCompany) {
        this.setData({
          isLlogisticsCompany: true
        })
      }
      if(this.data.logisticsNumber && this.data.logisticsCompany) {
        this.onCloseLogistics();
      }
    },
    handleTap() {
    },
    show: function() {
      this.setData({
        isLogisticsNumber: false,
        isLlogisticsCompany: false,
        logisticsNumber: '',
        logisticsCompany: ''
      })
    },
  }
})