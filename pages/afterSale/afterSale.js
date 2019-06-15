import {
	Api
} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();



Page({
	data: {
		num: 1,
		mainData: [],
		isFirstLoadAllStandard: ['getMainData'],
		searchItem: {},
		submitData:{
			passage1:''
		}
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.id = options.id;
		self.getMainData()
	},

	changeBind(e) {
		const self = this;
		if (api.getDataSet(e, 'value')) {
			self.data.submitData[api.getDataSet(e, 'key')] = api.getDataSet(e, 'value');
		} else {
			api.fillChange(e, self, 'submitData');
		};
		self.setData({
			web_submitData: self.data.submitData,
		});
		console.log(self.data.submitData)
	},

	change(e){
		const self = this;
		var num = api.getDataSet(e,'num');
		self.data.num = num;
		self.setData({
			num:self.data.num
		})
	},


	submit() {
		const self = this;
		api.buttonCanClick(self);
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass);
		console.log('self.data.submitData', self.data.submitData)
		if (pass) {
				self.orderUpdate();
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none')
		};
	},






	orderUpdate() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			id:self.data.id
		};
		postData.data = {
			passage1:self.data.submitData.passage1,
			behavior:self.data.num,
			order_step:1
		};
		const callback = (data) => {
			api.buttonCanClick(self, true);
			if (data.solely_code == 100000) {
				api.showToast('申请成功', 'none');
				setTimeout(function() {
					api.pathTo('/pages/afterSaleOder/afterSaleOder','redi')
				}, 2000);
			} else {
				api.showToast(data.msg, 'none', 1000)
			}
		};
		api.orderUpdate(postData, callback);
	},



	getMainData() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			id: self.data.id
		};
		postData.searchItem.thirdapp_id = getApp().globalData.thirdapp_id
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true)
				if (res.info.data.length > 0) {
					self.data.mainData = res.info.data[0]
				}

				self.setData({
					web_mainData: self.data.mainData,
				});
			} else {
				api.buttonCanClick(self, true)
				api.showToast(res.msg, 'none')
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.orderGet(postData, callback);
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
