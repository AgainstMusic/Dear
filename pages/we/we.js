const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:app.globalData.userInfo
  },
  onLoad(opt){
    if(app.globalData.userInfo===null){
      wx.showToast({
        title: '请先登录',
        
      });
      return
    }
    if(!app.globalData.userInfo.dear){
      const that = this;
      // 重新申请自己的信息
      wx.cloud.database().collection("daer_user").where({
        open_id:app.globalData.userInfo.open_id
      }).get({
        success:(res)=>{
          // 如果又对方的id 那么重新更新自己的信息
          if(res.data[0].dear){
            app.globalData.userInfo = res.data[0]
            wx.setStorageSync('userInfo', res.data[0])
            that.setData({
              userInfo:res.data
            })
            // 同时把对方的信息存储起来
            wx.cloud.database().collection("daer_user").where({
            dear:res.data[0].dear
            }).get({
              success:(res1)=>{
                // const loverUserInfo = res1.data[0];
                wx.setStorageSync('loverUserInfo', res1.data[0])
                that.setData({
                  loverUserInfo:res1.data[0]
                })
              }
            })
          }
        }
      })
    }
  },
  onShow: function () {
    let pages =  getCurrentPages();
    let current =pages[pages.length-1];
    let options = current.options
    const {open_id}=options;
    if(open_id){
      this.getOpenId(open_id)
    }
    
  },
  getOpenId(open_id){
    // 存在然后查询数据库 获取到信息
    wx.cloud.database().collection("daer_user").where({
      open_id
    }).get({
      success:(res)=>{
        // 爱人信息
        const loverUserInfo = res.data[0]
        // 创建二人信息数据库
        wx.cloud.database().collection('lover').add({
          data:{
            userA_id: app.globalData.userInfo._id,
            userA_avatarUrl: app.globalData.userInfo.avatarUrl,
            userA_nickName: app.globalData.userInfo.nickName,
            userB_id: loverUserInfo._id,
            userB_avatarUrl: loverUserInfo.avatarUrl,
            userB_nickName: loverUserInfo.nickName,
            friends:[],//朋友圈
            time:util.formatTime(new Date())
          },
          success(res1){
            // 把生成二人信息库的id传给邀请人对邀请人的资料进行更新修改
            wx.cloud.database().collection("daer_user").where({
              open_id
            }).update({
              data:{
                dear:userInfo._id,
                lover_id:res1.result._id,
                isSingle:false
              }
            })
            // 对自己也进行修改
            wx.cloud.database().collection("daer_user").where({
              open_id:app.globalData.userInfo.open_id
            }).update({
              data:{
                dear:loverUserInfo._id,
                lover_id:res1.result._id,
                isSingle:false
              }
            })
          }
        })
      }
    })
  },
  onShareAppMessage(){
    const open_id = app.globalData.userInfo.open_id;
    return {
      title: '邀请我的Dear.',
      path: '/page/we/we?open_id=' + open_id,
    }
  },
  getUserProfile() {
    this.login()
  },
  login(){
    var that = this;
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res.userInfo);
        wx.cloud.callFunction({
          name: 'login',
          data: {
            userInfo: res.userInfo
          },
          success(res1){
            console.log(res1);
            wx.cloud.database().collection("daer_user").doc(res1.result._id).get({
              success:(res2)=>{
                console.log(res2);
                app.globalData.userInfo = res2.data
                wx.setStorageSync('userInfo', res2.data)
                that.setData({
                  userInfo:res2.data
                })
              }
            })
          }
        })
      }
    })
  }

})