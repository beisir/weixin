var util = require("../../utils/util.js")
var app = getApp();
Page({
  data:{
    in_theaters:{},
    top250:{},
    coming_soon:{},
    searchResult:{},
    containerShow:true,
    searchPage:false,
    close:false
  },
  onLoad:function(){
    var in_theaters = app.globalData.douban + "/v2/movie/in_theaters?start=0&count=3";
    var top250 = app.globalData.douban + "/v2/movie/top250?start=0&count=3";
    var coming_soon = app.globalData.douban + "/v2/movie/coming_soon?start=0&count=3";
    this.getMoveList(in_theaters,"in_theaters","正在热映")
    this.getMoveList(top250,"top250","top250")
    this.getMoveList(coming_soon,"coming_soon","即将上映")
  },
  getMoveList(url,key,cathTitle){
    var that = this
    wx.request({
      url: url,
      header: {
        'Content-Type': 'application/json,application/json'
      },
      method: 'GET',
      success: function (res) {
        that.getData(res.data, key, cathTitle)    
      }
    })  
  },
  getData(opt, key, cathTitle){
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
    // this.data.list.push(arr)
    var newobj = {}
    newobj[key] = {
      produc: arr,
      cathTitle: cathTitle
    }
    this.setData(newobj)
  },
  moreTap(event){
    var moreTitle = event.currentTarget.dataset.moretitle
    console.log(event)
    wx.navigateTo({
      url: 'more/more?mt=' + moreTitle
    })
  },
  onBindFocus(){
    this.setData({
      containerShow: false,
      searchPage: true,
      close: true
    })
  },
  onBindChange(event){
    var text = event.detail.value;
    var searchUrl = app.globalData.douban + '/v2/movie/search?q='+text;
    this.getMoveList(searchUrl,'searchResult', '')
  },
  onClose(){
    this.setData({
      containerShow: true,
      searchPage: false,
      close: false,
      searchResult:{}
    })
  },
  onMovieTap (event){
    var id = event.currentTarget.dataset.id
    wx.navigateTo({
      url: 'detail/detail?id=' + id,
    })
  }
})