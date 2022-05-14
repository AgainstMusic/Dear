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
    return cate(event)
}

//分类管理
async function cate(event){
  try {
    switch(event.action){
      case 'add':{
        return await db.collection(event.sql).add({data:event.params})
      }
      case 'delete': {
        return await db.collection(event.sql).doc(event.id).remove();
      }
      case 'update': {
        return await db.collection(event.sql).where({ _id:event.id }).update({ data: event.params });
      }
      case 'query': {
        let limit = event.num || 1000;
        return await db.collection(event.sql).where(event.map).limit(limit).get();
      }
      case 'get': {
        return await db.collection(event.sql).where(event.map).get();
      }
      default: {
        return '方法不存在'
      }
    }   
  } catch (e) {
    return e;
  }
}