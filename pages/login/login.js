// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  login(userInfo) {
    console.log("123");
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            console.log(res.code, userInfo, '获取code')
            // 获取到code 需要去服务端进行openId的获取
            wx.cloud.callFunction({
              name: 'login',
              data: {
                userInfo: userInfo
              },
              success: (res) => {
                console.log('登录成功')
                console.log(res);
                resolve(res)
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    })
  },
  getUserProfile() {
    var that = this;
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        that.login(res.userInfo).then((res)=>{
          if(res.result._id){
            wx.cloud.database().collection("daer_user").doc(res.result._id).get({
              success:(res2)=>{
                app.globalData.userInfo = res2.data
                wx.setStorageSync('userInfo', res2.data)
                wx.navigateBack({
                  delta: 1, // 回退前 delta(默认为1) 页面
                })
              }
            })
          }else{
            app.globalData.userInfo = res.result.data[0]
            wx.setStorageSync('userInfo', res.result.data[0])
            var pages = getCurrentPages();
            let prevpage = pages[pages.length - 2]; //上一个页面对象
            console.log(prevpage.route) //上一个页面路由地址
            let path = prevpage.route;
            if(path === '/pages/we/we'){
              wx.navigateTo({
                url: '/pages/we/we',
                success: (result)=>{
                },
                fail: ()=>{},
                complete: ()=>{}
              });
              // wx.switchTab({
              //   url: '/pages/we/we',
              //   success: function (e) {  
              //     var page = pages.pop();  
              //     if (page == undefined || page == null) return;  
              //     page.onLoad();  
              //   }  
              // })
            }else{
              wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
              })
            }
            
          }
        })
      }
    })
  },
  
})