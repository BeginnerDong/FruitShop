import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
			isFirstLoadAllStandard:['getMainData']
  },
  onLoad: function () {
    const self=this;
		
  },

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.getMainData()
	},
	
	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id
		};
		postData.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['联系客服']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in',
			},
		};
		const callback = (res) => {
			console.log(1000, res);
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0]
			}
			self.setData({
				web_mainData: self.data.mainData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.articleGet(postData, callback);
	},
	
	phoneCall() {
		const self = this;
		wx.makePhoneCall({
			phoneNumber: self.data.mainData.description,
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
