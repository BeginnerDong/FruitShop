import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
	data: {
		mainData: [],

		isFirstLoadAllStandard: ['getMainData'],

	},
	//事件处理函数

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
					title: ['=', ['关于我们']],
				},
				middleKey: 'menu_id',
				key: 'id',
				condition: 'in',
			},
		};
		postData.order = {
			listorder: 'desc'
		};
		const callback = (res) => {
			console.log(1000, res);
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
				self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
			}
			self.setData({
				web_mainData: self.data.mainData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.articleGet(postData, callback);
	},


})
