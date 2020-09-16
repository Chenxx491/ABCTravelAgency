Page({
  handleGetUserInfo(e){
    const {userInfo}=e.detail;
    wx.setStorageSync("userinfo",userInfo);
    wx.navigateBack({
      delta: 1
    });
    wx.redirectTo({
      url: '/pages/mine/mine',
    });
  }
})