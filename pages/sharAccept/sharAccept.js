import {coludRequest,showToast,showModal} from "../../utils/anysWS";
import {formatTime} from "../../utils/util"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow(){
    // 判断有没有登录
    if(app.globalData.userInfo===null){
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
      }else{
        this.setData({
          userInfo:app.globalData.userInfo,
        })
    }
    // 判断有没有页面参数open_id
    let pages =  getCurrentPages();
    let current =pages[pages.length-1];
    let options = current.options;
    const {open_id}=options;
    const that = this;
    // 判断有没有页面参数open_id 
    if(open_id){
      // 先判断自己是不是单身 省流量
      if(app.globalData.userInfo.isSingle){
        coludRequest('zsgc',{sql:'daer_user', action:'get', map: { open_id } },function(res){
          const loverUserInfo = res.result.data[0];
          // 查询链接人的信息看是否单身
          if(loverUserInfo.isSingle){
            // 是单身
            showModal({title: '您是否想要与'+loverUserInfo.nickName+'成为彼此唯一的Dear',
              showCancel: true,
              cancelText: '不想要',
              cancelColor: '#000000',
              confirmText: '想要',
              confirmColor: '#3CC51F',
            }).then(result=>{
              // 判读自己是否想要组成情侣
              if(!result.confirm){
                // 不想直接跳回
                that.jumpWe()
              }else{
                // 想的话然后添加数据库
                app.globalData.loverUserInfo = loverUserInfo;
                wx.cloud.callFunction({
                  name: 'lover',
                  data: {
                    userA_id: app.globalData.userInfo._id,
                    userA_avatarUrl: app.globalData.userInfo.avatarUrl,
                    userA_nickName: app.globalData.userInfo.nickName,
                    userB_id: loverUserInfo._id,
                    userB_avatarUrl: loverUserInfo.avatarUrl,
                    userB_nickName: loverUserInfo.nickName,
                  },
                  success(res1){
                    console.log(res1);
                    // 把生成二人信息库的id传给邀请人对邀请人的资料进行更新修改
                    coludRequest('zsgc',{sql:'daer_user', action:'update',id:loverUserInfo._id, params: {
                      dear_id:app.globalData.userInfo._id,
                      dear_nickName:app.globalData.userInfo.nickName,
                      dear_avatarUrl:app.globalData.userInfo.avatarUrl,
                      love_time:Date.parse(new Date()),
                      lover_id:res1.result._id,
                      isSingle:false}},function(){})
                    
                    coludRequest('zsgc',{sql:'daer_user', action:'update',id:app.globalData.userInfo._id, params: {
                      dear_id:loverUserInfo._id,
                      dear_nickName:loverUserInfo.nickName,
                      dear_avatarUrl:loverUserInfo.avatarUrl,
                      love_time:Date.parse(new Date()),
                      lover_id:res1.result._id,
                      isSingle:false}},function(){
                      // 获取数据用于自身的数据更新防止偷腥 自己进行更新
                      app.globalData.userInfo.dear=loverUserInfo._id;
                      app.globalData.userInfo.lover_id=res1.result._id;
                      app.globalData.userInfo.isSingle=false;
                      wx.setStorageSync('userInfo', app.globalData.userInfo)
                      that.setData({
                        userInfo:app.globalData.userInfo
                      })
                       // 对自己也进行修改
                      that.jumpWe()
                    })
                    
                  }
                })
              }
            })
          }else{
            // 不是单身
            showModal({title: '对不起您来晚了，他已经属于别人的了，下一次一定要及时把握住机会，别自己后悔',
              showCancel: false,
              cancelColor: '#000000',
              confirmText: '加油！',
              confirmColor: '#3CC51F',
            }).then((res)=>{that.jumpWe()})
              
          }
        })
      }else{
        showModal({title: '对不起Dear只能有一个',showCancel: false,cancelColor: '#000000',confirmText: '确定',confirmColor: '#3CC51F',})
        .then((res)=>{
          console.log(res);
          this.jumpWe()
        })
        
      }
      
    }
    
  },
  jumpWe(){
    wx.navigateTo({
      url: '/pages/we/we',
      success: (result) => {
        
      },
      fail: () => {},
      complete: () => {}
    });
      
    // wx.switchTab({
    //   url: '/pages/we/we',
    // })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
  }
})