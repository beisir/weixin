var app = getApp()
var util = require('../../../utils/util.js');
Page({
  data:{
    movie:{}
  },
  onLoad(options){
    var id = options.id
    var url = app.globalData.douban + "/v2/movie/subject/"+id;
    util.http(url,this.getData)
  },
  getData(data){
    var director = {
      avatar:'',
      name:'',
      id:''
    }
    if(data.directors[0].name!=null){
      if(data.directors[0].avatars != null){  
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name;
      director.id = data.directors[0].id
    }
    var movie = {
      movieImg: data.images ? data.images.large: '',
      country: data.countries[0],
      title: data.title,
      originalTitle:data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      generes: data.genres.join('、'),
      stars: util.computedsStar(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.castsConcat(data.casts),
      castsInfo: util.castsInfo(data.casts),
      summary: data.summary
    }
    this.setData({
      movie: movie
    })
  },
  lookImage(event){
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src]
    })
  },
  goIndex (){
    wx.navigateTo({
      url: '../../index/index'
    })
  }
})