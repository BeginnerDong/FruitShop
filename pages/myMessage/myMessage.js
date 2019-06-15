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
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id
		};
		postData.getBefore = {
			caseData: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['我的消息']],
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
				self.data.mainData.push.apply(self.data.mainData, res.info.data)
			}
			self.setData({
				web_mainData: self.data.mainData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.articleGet(postData, callback);
	},



	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll && self.data.buttonCanClick) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},

	intoPathRedirect(e) {

		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},
})
