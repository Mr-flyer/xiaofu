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
  getOrderDetails() {
    return this.request({
      url: `api/v1/..`,
      method: 'POST',
    })
  }

  // 获取微信支付API 所需参数
  getOrderPaymentParameter(data) {
    return this.request({
      url: `api/v1/..`,
      method: 'POST', data
    })
  }
  // 告知后台支付成功
  pushPaymentSuccess(data) {
    return this.request({
      url: `api/v1/..`,
      method: 'POST', data
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