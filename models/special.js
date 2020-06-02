import HTTP from '../utils/http';

class SpecialModel extends HTTP {
  // 获取短信验证码
  getVerificationCode(data) {
    return this.request({
      url: `api/v1/captcha/`,
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
  getGoodsList(data) {
    return this.request({
      url: `api/v1/product/list`,
      method: 'POST', data
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
      url: `api/v1/school/list`,
      method: 'POST', data
    })
  }
  // 获取商品类型
  getGoodsTypes() {
    return this.request({
      url: `api/v1/school/list_2_prodcuts`,
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