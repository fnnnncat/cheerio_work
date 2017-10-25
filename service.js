var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var i = 0;
var page_c=16;//页数
var url = "http://www.cnblogs.com/fnncat";//blog网址

function fetchPage(x) {
    console.log("into the fetchPage")
    saveAllUrl(page_c);   
}
function saveAllUrl(page_c){
var url_list_co=[];
var urls_list=[];
var co=0;
 for(var j=1;j<page_c+1;j++){ 
    console.log(j)
    var title_url=url+"/default.html?page="+j;
    http.get(title_url, function (res) {     
        var html = '';        //用来存储请求网页的整个html内容
        var titles = [];        
        res.setEncoding('utf-8'); //防止中文乱码
     //监听data事件，每次取一块数据
        res.on('data', function (chunk) {   
            html += chunk;
        });
     //监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
        res.on('end', function () {

         var $ = cheerio.load(html); //采用cheerio模块解析html
         var count=$('.postTitle a').length;
         
          for(var i=0;i<count;i++){
             co++;
             var item_post_url=$('.postTitle a')[i].attribs.href;
             var url_list = {
             item_post_url:item_post_url
             }
            startRequest(item_post_url,co);
          }
        });
    }).on('error', function (err) {
        console.log(err);
    });
   
  } 
 
}

function startRequest(x,co) {
    console.log("into the startRequest"+co)    
    http.get(x, function (res) {     
        var html = '';          
        res.setEncoding('utf-8');
        res.on('end', function () {
         var $ = cheerio.load(html); 
         var news_item = {
            title: $('#cb_post_title_url').text().trim(),
            Time:  $('#post-date').text().trim(),
            link: x,
            content:$('#cnblogs_post_body')   
            };
      var news_title = $('.postTitle a').text().trim();
      console.log(news_item);
      savedContent($,news_title,news_item,co);  //存储每篇文章的内容及文章标题
     });

    }).on('error', function (err) {
        console.log(err);
    });

}
//存储所爬取的内容资源
function savedContent($, news_title,news_item,co) {
//博客内容添加到/data文件夹下
        fs.appendFileSync("data/"+co+news_title + '.txt',news_item.content, 'utf-8', function (err) {            
            if (err) {
                console.log(err);
            }
        });   
}

fetchPage(url);