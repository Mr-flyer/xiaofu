Component({
  options: {
      styleIsolation: 'shared', // 取消组件样式隔离, shared == 组件、外部样式共享
  },
  /**
   * 组件的属性列表
   */
  properties: {
    orderObj: {
      type: Object,
      value: {
        userName: '张大力',
        province: '江苏省',
        city: '南京市',
        address: '福润雅居翠竹园111栋江苏省南京市福润雅居翠竹园111栋',
        tel_number: '13512345678'
      }
    },
    isArrow: {
      type: Boolean,
      value: false
    }
  },
})