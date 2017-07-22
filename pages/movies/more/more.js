var app = getApp();
var util = require('../../../utils/util.js')
Page({
  data:{
    requestUrl:'',
    count:0,
    isEmpty:true
  },
  onLoad(options){
    var mt = options.mt
    this.data.navTitle = mt
    var dataUrl = ''
    switch(mt){
      case '正在热映': dataUrl = app.globalData.douban + '/v2/movie/in_theaters';break;
      case 'top250': dataUrl = app.globalData.douban + '/v2/movie/top250'; break;
      case '即将上映': dataUrl = app.globalData.douban + '/v2/movie/coming_soon'; break;
    }
    this.data.requestUrl = dataUrl
    util.http(dataUrl,this.callBack)

  },
  onReady(){
    wx.setNavigationBarTitle({
      title: this.data.navTitle
    })
  },
  callBack (opt){
    var arr = [];
    var subjects = opt.subjects
    for (var ind in subjects) {
      var obj = subjects[ind]
      arr.push({
        stars: util.computedsStar(obj.rating.stars),
        title: obj.title,
        large: obj.images.large,
        average: obj.rating.average,
        id: obj.id
      })
    }
    var total = {};
    // 判断是否以一次加载
    if (!this.data.isEmpty){    // 如果不是证明是上拉加载
      total = this.data.produc.concat(arr)  //把获取的新数据和之前的数据拼接在一起并从新赋值
    }else{
      total = arr 
      this.data.isEmpty = false   // 第一次会走的判断，直接赋值   
    }
    this.setData({
      produc: total,
    })
    this.data.count+=20
    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },
  onReachBottom (event){
    var nextUrl = this.data.requestUrl + '?start=' + this.data.count + '&count=20';
    util.http(nextUrl, this.callBack)
    wx.showNavigationBarLoading()
  },
  onPullDownRefresh(){
    console.log(this.data.requestUrl)
    var refreshUrl = this.data.requestUrl + '?start=0&count=20'
    this.data.produc = {}
    this.data.isEmpty = true
    this.data.count = 0
    util.http(refreshUrl,this.callBack)
    wx.showNavigationBarLoading()
  },
  onMovieTap(event) {
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?id=' + id,
    })
  }
})