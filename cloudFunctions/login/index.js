// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env:'chatting-8g0h4h1s3c781f9d',
    traceUser: true
  }
)
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  // openId是唯一的
  let openId = wxContext.OPENID;
  const result = await db.collection("daer_user").where({open_id: openId}).get();
  console.log(result);
  // 判断这个人是否存在于数据库 有的话 调用更新 没的话加入数据库
  if(result.data.length > 0) {
    return result
  } else{
    return await db.collection("daer_user").add({
      data: {
        ...event.userInfo,
        open_id: openId,
        isSingle: true,
        dear_id:"",//爱人的id
        dear_nickName:"",//爱人的名字
        dear_avatarUrl:"",//爱人的头像
        lover_id:"",//俩人生成的id，love_time:
        love_time:"",//恋爱时间
        createTime: new Date()
      },
      
    })
  }
  
}