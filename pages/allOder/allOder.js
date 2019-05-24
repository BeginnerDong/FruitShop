import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
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
  onLoad: function () {
    
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
