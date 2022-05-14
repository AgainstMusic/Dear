import {coludRequest,showToast,showModal} from "../../utils/anysWS";
import {formatTime} from "../../utils/util"
const app = getApp();
Page({
  /**
   * 1判断有没有授权登录
   *  一如果有不用跳转
   * 二 如果没有跳转授权
   * 2 判断有没有页面参数open_id
   *    一 如果有判断是否进行绑定
   *      《1》不进行绑定 然后跳转到没有参数的主页面
   *      《2》进行绑定 先判断是否单身
   *        1.是的话直接跳转主页面
   *        2.不是的话创建新的数据库 进行数据更新
   *    二 没有不执行
   * 
   * 一 如果有进行查询添加
   * 二 如果没有结束
   */
  /**
   * 页面的初始数据
   */
  data: {
    value: "",
    setInter:""
  },
  onLoad(){
    const that =this
    if(app.globalData.userInfo===null) {
      return
    }else{
      coludRequest('zsgc',{sql:'daer_user', action:'get',map: { _id:app.globalData.userInfo._id }},function(res){
          console.log(res.result.data[0]);
          const userInfo = res.result.data[0];
          app.globalData.userInfo = userInfo;
          wx.setStorageSync('userInfo', userInfo);
          if(!userInfo.isSingle){
            that.setData({
              loverUserInfo:{
                _id:userInfo.dear_id,
                avatarUrl:userInfo.dear_avatarUrl,
                nickName:userInfo.dear_nickName
              },
              value:formatTime(new Date(userInfo.love_time))
            })
            that.timeInterval(formatTime(new Date(userInfo.love_time)));
          }
          
        
      })
    };
  },
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
        });
    }
  },
  // 结束清除计时器
  onunload(){
    clearInterval(that.data.setInter)
  },
  onShareAppMessage(){
    const open_id = app.globalData.userInfo.open_id;
    return {
      title: '邀请我的Dear.',
      path: '/pages/sharAccept/sharAccept?open_id=' + open_id,
    }
  },
  handleChange(e) {
    const that = this
    coludRequest('zsgc',{sql:'daer_user', action:'update',id:app.globalData.userInfo.dear_id, params: {love_time:Date.parse(new Date(e.detail.date))}},function(){})
    coludRequest('zsgc',{sql:'daer_user', action:'update',id:app.globalData.userInfo._id, params: {love_time:Date.parse(new Date(e.detail.date))}},function(){})
    // 对本地的恋爱数据进行修改
    app.globalData.userInfo.love_time=Date.parse(new Date(e.detail.date));
    that.timeInterval(e.detail.date)
  },
  // 计时更新函数
  timer(commonTime){
    this.setData({
      minute:Math.ceil(Math.round(commonTime/60)/1000),
      day:Math.round(commonTime/24/36)/100000,
    })
  },
  timeInterval(value){
    const that =this;
    clearInterval(that.data.setInter)
    const startTime = Date.parse(new Date(value));
    const nowTime =  Date.parse(new Date());
    var commonTime = nowTime - startTime;
    that.setData({
      value,
      year:Math.round(commonTime/366/24/36000)/100,
      mouth:Math.floor(Math.round(commonTime/31/24/3600)/1000),
      week:Math.floor(Math.round(commonTime/7/24/3600)/1000),
      day:Math.round(commonTime/24/36)/100000,
      hour:Math.ceil(Math.round(commonTime/3600)/1000),
      minute:Math.ceil(Math.round(commonTime/60)/1000),
    })
    that.data.setInter =setInterval(()=> {
      commonTime=commonTime+1000
      that.timer(commonTime)
    }, 1000);
  },
  // 提示邀请
  inviteLove(){
    showToast({title: '请先邀请你的唯一',icon:"error",mask: true,duration: 2000})
  },
  // 跳转we页面
  jumpWe(){
    wx.switchTab({
      url: '/pages/we/we',
    })
  },
  // 分手
  parted(){
    const that = this
    console.log(that.data.loverUserInfo.nickName);
    showModal({title: '您确定要离开'+that.data.loverUserInfo.nickName,
      showCancel: true,
      cancelText: '在想想',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
    }).then(result=>{
      // 判读自己是否要离开
      if(!result.confirm){
        return 
      }else{
        // 对自己的信息进行修改更新
        coludRequest('zsgc',{sql:'daer_user', action:'update',id:app.globalData.userInfo._id, params: {
          isSingle: true,
          dear_id:"",//爱人的id
          dear_nickName:"",//爱人的名字
          dear_avatarUrl:"",//爱人的头像
          lover_id:"",//俩人生成的id，love_time:
          love_time:"",//恋爱时间
        }},function(){})
        // 对别人的信息进行修改更新
        coludRequest('zsgc',{sql:'daer_user', action:'update',id:app.globalData.userInfo.dear_id, params: {
          isSingle: true,
          dear_id:"",//爱人的id
          dear_nickName:"",//爱人的名字
          dear_avatarUrl:"",//爱人的头像
          lover_id:"",//俩人生成的id，love_time:
          love_time:"",//恋爱时间
        }},function(){})
        // 删除两个人的生成的数据库
        coludRequest('zsgc',{sql:'lover', action:'delete',id:app.globalData.userInfo.lover_id},function(){
        })
        app.globalData.userInfo.dear_id="";
        app.globalData.userInfo.lover_id="";
        app.globalData.userInfo.isSingle=true;
        app.globalData.userInfo.dear_nickName="";
        app.globalData.userInfo.dear_avatarUrl=true;
        wx.setStorageSync('userInfo', app.globalData.userInfo)
        that.setData({
          userInfo:app.globalData.userInfo,
          loverUserInfo:null
        })
        clearInterval(that.data.setInter)
      }
    })
  }
})