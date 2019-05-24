import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
    is_show:false,
		is_showb:false
  },
	show(e){
		const self=this;
		self.data.is_show=!self.data.is_show;
		self.setData({
			is_show:self.data.is_show
		})
	},
	showb(e){
		const self=this;
		self.data.is_showb=!self.data.is_showb;
		self.setData({
			is_showb:self.data.is_showb
		})
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
