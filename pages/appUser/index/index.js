// pages/appUser/index/index.js
import specialModel from '../../../models/special';
import dayjs from '../../../utils/dayjs';
import util from '../../../utils/util';
Component({
  data: {
    orderStatusList: [{
      status: 1,
      img: '../../../static/images/personal/pay_status_1.png',
      name: '待付款',
      num: 1
    }, {
      status: 2,
      img: '../../../static/images/personal/pay_status_2.png',
      name: '待收货',
      num: 0
    }, {
      status: 3,
      img: '../../../static/images/personal/pay_status_3.png',
      name: '已完成',
      num: 0
    }, {
      status: 4,
      img: '../../../static/images/personal/pay_status_4.png',
      name: '换货中',
      num: 0
    }]
  },
  attached: function () {
    specialModel.getStudentInfo().then(({
      data
    }) => {
      // 格式化入学日期
      let schoolTime = data.admission_date ? dayjs(parseInt(data.admission_date)).format('YYYY年-MM月'):'';
      this.setData({
        schoolTime,
        userInfo: data
      })
    })
  },
  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { 
      // console.log("个人中心");
    },
    hide: function () { },
    resize: function () { },
  },
  methods: {
    // 选择地址
    changeAddress() {
      util.getAddress(function(res) {
        console.log(res.userName)
        console.log(res.postalCode)
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)
        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)
      }) 
    },
    //  我的订单
    myOrder(e) {
      if (e.currentTarget.dataset.status) {
        wx.navigateTo({
          url: `../order/index/index?status=${e.currentTarget.dataset.status}`
        })

      } else {
        wx.navigateTo({
          url: '../order/index/index?status=0'
        })
      }
    },
    editUserInfo() {
      wx.navigateTo({
        url: `/pages/login/studentIdentity/index?new_student=${this.data.userInfo.new_student}&isEdit=true`
      })
    }
  }
})