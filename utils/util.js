function computedsStar(res){
  var num = res.toString().substring(0,1)
  var arr = []
  for(var i=0;i<5;i++){
    if(i<=num){
      arr[i] = 1
    }else{
      arr[i] = 0
    }
  }
  return arr
}

function http(url,callback){
  wx.request({
    url: url,
    header: {
      'Content-Type': 'application/json,application/json'
    },
    method: 'GET',
    success:function(opt){
      callback(opt.data)
    }
  })
}
function castsConcat(opt){
  var str = ''
  for(var i in opt){
    str = str + opt[i].name+'/'
  }
  return str.substring(0,str.length-2)
}
function castsInfo(opt){
  var arr = []
  for(var i in opt){
    var cast = {
      img: opt[i].avatars ? opt[i].avatars.large: '',
      name:opt[i].name
    }
    arr.push(cast)
  }
  return arr
}
module.exports = {
  computedsStar: computedsStar,
  http:http,
  castsConcat: castsConcat,
  castsInfo: castsInfo
}
