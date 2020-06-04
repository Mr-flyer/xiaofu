import HTTP from '../utils/http';

class SpecialModel extends HTTP {
  // 获取短信验证码
  getVerificationCode(data) {
    return this.request({
      url: `api/v1/captcha/`,
      method: 'POST', data
    })
  }
  // 手机号解密
  getPhoneEncode(data) {
    return this.request({
      url: `api/v1/user/user_phone`,
      method: 'POST', data
    })
  }
  // 上传用户填写个人额外信息
  pushStudentInfo(data) {
    return this.request({
      url: `api/v1/user/user_info`,
      method: 'POST', data
    })
  }
  // 拉取用户信息
  getStudentInfo() {
    return this.request({
      url: `api/v1/user/user_info`,
      method: 'GET'
    })
  }
  // 获取商品列表
  getGoodsList(page) {
    return this.request({
      url: `api/v1/product/list?page=${page}`,
      method: 'POST'
    })
  }
  // 获取商品详情
  getGoodsDetail(goodId) {
    return this.request({
      url: `api/v1/product/?id=${goodId}`,
      method: 'GET'
    })
  }
  // 搜索商品
  getGoodsSearch(data) {
    return this.request({
      url: `api/v1/product/school_keyword`,
      method: 'POST', data
    })
  }
  // 获取商品类型及对应商品
  getGoodsTypes() {
    return this.request({
      url: `api/v1/school/list_2_prodcuts`,
      method: 'GET'
    })
  }
  // 提交订单 --- 结算中心页
  setGoodsOrder(data) {
    return this.request({
      url: `api/v1/order/`,
      method: 'POST', data
    })
  }
  // 获取订单列表
  getOrderLists() {
    return this.request({
      url: `api/v1/order/list`,
      // method: 'POST'
    })
  }
  // 获取订单详情
  getOrderDetails(orderId) {
    return this.request({
      url: `api/v1/order/info/${orderId}`,
      method: 'POST',
    })
  }
  // 支付
  getPayment(order_id) {
    let _that = this;
    this.getConfig(order_id).then((data) => {
      wx.requestPayment({
        timeStamp: data.data.timestamp,
        nonceStr: data.data.nonceStr,
        package: data.data.package,
        signType: data.data.signType,
        paySign: data.data.paySign,
        success: function(res) {
          _that.getPaySuccess(order_id).then((data)=>{});
            wx.redirectTo({
              url: '/pages/order/paySuccess/paySuccess'
            })
        },
        fail:function(err) {
          if(err.errMsg === 'requestPayment:fail cancel') {
            wx.showToast({ title: '您取消了支付', icon: 'none', duration: 2000 });
          }else {
            wx.redirectTo({
              url: `/pages/order/payFail/payFail?order_id=${order_id}`
            })
          }
        },
        complete:function(res) {
          console.log(res)
        }
      })
    }).catch((err) => {
      wx.showToast({ title: '订单异常或已完成支付', icon: 'none', duration: 2000 });
    })
  }
  /**
   * @method getConfig --获取微信支付配置
   * @param {string|number} order_id --订单编号
   */
  getConfig(order_id) {
    return this.request({
      url: `api/v1/pay/jsapi/${order_id}`,
      method: 'GET'
    })
  }
  /**
   * @method getPaySuccess --支付成功
   * @param {string|number} order_id --订单编号
   */
  getPaySuccess(order_id) {
    return this.request({
      url: `api/v1/pay/result/${order_id}`,
      method: 'GET'
    })
  }


  /**
   * 测试接口
   * @param {*} data 
   */
  getList(viewType, page) {
    return this.request({
        url: `/${viewType}/list/${page}/json`
    })
  }
}

export default new SpecialModel();