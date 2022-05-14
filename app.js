// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env:'chatting-8g0h4h1s3c781f9d',
      traceUser: true
    });
    if(wx.getStorageSync('userInfo')){
      this.globalData.userInfo = wx.getStorageSync('userInfo')
    }
  },
  globalData: {
    userInfo: null,
  }
})
