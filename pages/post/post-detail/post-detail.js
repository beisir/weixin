var itemList = require('../../../data/posts_data.js')
var app = getApp();
Page({
  data:{
    isplay: false
  },
  onLoad (opt){
    var id = opt.id;
    var item = itemList.itemList[id]
    this.setData({
      item:item
    })
    this.data.chekid = id;
    var collected = wx.getStorageSync("collected");
    if(collected){
      var checked = collected[id];
      this.setData({
        checked: checked
      })
    }else{
      var obj = {};
      obj[id] = false;
      wx.setStorageSync("collected",obj)
    }
    console.log(app.globalData.musicIsplay)
    if (app.globalData.musicIsplay && app.globalData.currentMusic === id){
      this.setData({
        isplay: true
      })
    }
    this.setMusic();
  },
  setMusic (){
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isplay: true
      })
      app.globalData.musicIsplay = true
      app.globalData.currentMusic = that.data.chekid
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isplay: false
      })
      app.globalData.musicIsplay = false
      app.globalData.currentMusic = null
    })
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isplay: false
      })
      app.globalData.musicIsplay = false
      app.globalData.currentMusic = null
    })
  },
  showFn (){
    var collected = wx.getStorageSync("collected");
    var postColl = collected[this.data.chekid]
    postColl = !postColl;
    collected[this.data.chekid] = postColl;
    // console.log(collected)     
    // wx.showToast({
    //   title: postColl ? "收藏成功" : "取消收藏"
    // })
    // this.showModal(collected, postColl)
    this.showToast(collected, postColl)
  },
  showModal(collected, postColl){
    var that = this;
    wx.showModal({
      title:'收藏',
      content: postColl?'收藏该文章':'取消收藏该文章',
      showCancel:true,
      cancelText:'取消',
      success:function(opt){
        if (opt.confirm){
          wx.setStorageSync("collected", collected);
          that.setData({
            checked: postColl
          })
        }
      }
    })
  },
  showToast(collected, postColl){
    wx.showToast({
      title: postColl ? "收藏成功" : "取消收藏"
    })
    wx.setStorageSync("collected", collected);
    this.setData({
      checked: postColl
    })
  },
  shareFn (){
    var list = [
      "分享到好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList:list,
      itemColor:"#000",
      success: function(res){
        wx.showModal({
          title: list[res.tapIndex]+'分享',
          content:"暂时不支持分享"
        })
      }
    })
  },
  audioFn (){
    var isplay = this.data.isplay;
    var id = itemList.itemList[this.data.chekid].music;    
    if (isplay){
      wx.pauseBackgroundAudio()
      this.setData({
        isplay: false
      })
    }else{
      wx.playBackgroundAudio(id)
      this.setData({
        isplay : true
      })     
    }

  }
})