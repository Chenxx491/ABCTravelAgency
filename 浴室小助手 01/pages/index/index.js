//index.js
//获取应用实例
Page({
  local:"",
  data: {
    //轮播图片
    imgUrls:[
      {
        id:0,
        url:"https://aecpm.alicdn.com/simba/img/TB183NQapLM8KJjSZFBSutJHVXa.jpg"
      },
      {
        id:1,
        url:"https://img.alicdn.com/tfs/TB1tY4aFHj1gK0jSZFuXXcrHpXa-520-280.png_q90_.webp",
      },
      {
        id:2,
        url:"https://aecpm.alicdn.com/simba/img/TB1XotJXQfb_uJkSnhJSuvdDVXa.jpg",}
    ],
    indicatorDots:true,
    autoplay:true,
    interval:3000,
    indicatoractivecolor:"#7FFF00",
    circular:true
  },
  //页面开始加载就会触发
  onLoad: function () {
    var that=this;
    wx.getLocation({
      success:function(res){
        var latitude=res.latitude
        var longitude=res.longitude
        wx.chooseLocation({
          latitude:latitude,
          longitude:longitude,
          success:function(res){

            that.setData({
              local:""
            }),
            that.setData({
              local:res.address
            })
          },
          fail:function(){
            console.log("失败");
          },
          complete:function(){
            //complete
          }
        })
      },
      fail:function(){
        console.log("失败");
      },
      complete:function(){
        //complete
      }
    })
  },
  goyuyue:function(){
    wx.navigateTo({
      url: '/pages/yuyue/yuyue',
    })
  },
  gobaoxiu:function(){
    wx.navigateTo({
      url: '/pages/baoxiu/baoxiu',
    })
  },
  getScancode:function(){
    var _this=this
    //允许从相机和相册中扫码
    wx.scanCode({
      success: (res) => {
        var result=res.result;

        _this.setData({
          result: result,
        })
      },
    })
  }
  });
