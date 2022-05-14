
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
exports.main = async (event) => {
  console.log(event);
  const wxContext = cloud.getWXContext();
  // openId是唯一的
    return await db.collection("lover").add({
      data: {
        ...event,
        friends:[],//朋友圈
        time:Date.parse(new Date()),
      },
    })
}