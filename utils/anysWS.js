/*
Promise 形式 getSetting
*/ 
export const getSetting = ()=>{
    return new Promise((resolve,reject) => {
        wx.getSetting({
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            },
        });
    })
}
/*
Promise 形式 chooseAddress
*/ 
export const chooseAddress = ()=>{
    return new Promise((resolve,reject) => {
        wx.chooseAddress({
            success:(result)=>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            },
        });
    })
}
/*
Promise 形式 openSetting
*/ 
export const coludRequest = (name,data,callback)=>{
    wx.cloud.callFunction({
        name:name,
        data:data,
        success: res => {
            callback(res);
        },
        fail: err => {
            console.log(err);
        }
    })
}

/*
Promise 形式 showModal
    @param{object} param参数
*/ 
export const showModal = (content)=>{
    return new Promise((resolve,reject) => {
        wx.showModal({
            ...content,
            success: (res) => {
                resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
        });
    })
}

/*
Promise 形式 showToast
    @param{object} param参数
*/ 
export const showToast = (content)=>{
    return new Promise((resolve,reject) => {
        wx.showToast({
            ...content,
            // 这个success用箭头函数 主要是下方的this.setCart()中的this指向问题
            success :(res) => {
                resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
        })
    })
}
/*
Promise 形式 login
*/ 
export const login = ()=>{
    return new Promise((resolve,reject) => {
        wx.login({
            timeout:10000,
            success:(result) =>{
                resolve(result);
            },
            fail:(err)=>{
                reject(err);
            }
        })
    })
}
/*
Promise 形式 小程序微信支付
    @param{object} pay参数
*/ 
export const requestPayment = ({pay})=>{
    return new Promise((resolve,reject) => {
        wx.requestPayment({
            ...pay,
            success: (result)=>{
                resolve(result)
            },
            fail: (err)=>{
                reject(err)
            },
            
        });
    })
}