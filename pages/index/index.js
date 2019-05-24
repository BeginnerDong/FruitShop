import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

//index.js
//获取应用实例
//触摸开始的事件

Page({
  data: {
		 is_show:true,
		 imgUrls: [
		   '../../image/banner.png',
		   '../../image/banner.png',
		   '../../image/banner.png'
		 ],
			swiperIndex: 0,
			currentData : 0
    },
    bindchange:function(e){
     const self  = this;
     self.setData({
       currentData: e.detail.current
     })
   },
   //点击切换，滑块index赋值
   checkCurrent:function(e){
     const self = this;
     if (self.data.currentData === e.currentTarget.dataset.current){
         return false;
     }else{
   
       self.setData({
         currentData: e.currentTarget.dataset.current
       })
     }
   },
		
	show(e){
		const self=this;
		self.data.is_show=false;
		self.setData({
			is_show:self.data.is_show
		})
	},
	onLoad: function (options) {
	},
	 swiperChange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },
	
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  }
	})
