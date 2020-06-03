const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const getAddress = suc => {
  wx.chooseAddress({
    success (res) {
      suc(res);
    },
    fail() {
        wx.getSetting({
            success(res) {
                if(!res.authSetting['scope.address']) {
                    wx.showModal({
                        title: '用户未授权',
                        content: '拒绝授权将不能体验小程序完整功能，点击确定开启授权',
                        success: (res) => {
                          if (res.confirm) {
                            wx.openSetting({})
                          }
                        }
                    })   
                }
            }
        })      
    }
  })
}
module.exports = {
  formatTime: formatTime,
  getAddress: getAddress
}
