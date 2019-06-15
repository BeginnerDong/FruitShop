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
		num: 0,
		mainData: [],
		isFirstLoadAllStandard: ['getMainData'],
		searchItem: {
			shop_no: wx.getStorageSync('shopInfo').user_no,
			behavior: ['in',[1,2]],
			user_type: 0
		},
		getBefore: {},
		submitData: {
			phone: ''
		}
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);

		self.getMainData()
	},

	scan() {
		wx.scanCode({
			success: (res) => {
				console.log(res)
				if (res.errMsg == "scanCode:ok") {
					self.data.searchItem.check_code = res.result
					self.getMainData(true);
				}
			}
		})
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
	
	search(){
		const self = this;
		if(self.data.submitData.phone==''){
			api.showToast('无效搜索','none')
		}else{
			self.data.getBefore.phone = {
				tableName: 'Order',
				searchItem: {
					phone: ['in', [self.data.submitData.phone]],
				},
				middleKey: 'order_no',
				key: 'order_no',
				condition: 'in',
			},
			self.getMainData(true)
		}
	},


	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getThreeToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.thirdapp_id = getApp().globalData.thirdapp_id;
		postData.order = {
			create_time: 'desc'
		}
		if(JSON.stringify(self.data.getBefore)!='{}'){
					postData.getBefore = api.cloneForm(self.data.getBefore);;
		};

		postData.getAfter = {
			order: {
				tableName: 'Order',
				middleKey: 'order_no',
				key: 'order_no',
				condition: '=',
				searchItem: {
					status: 1,
					user_type: 0
				}
			}
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.buttonCanClick(self, true)
				if (res.info.data.length > 0) {
					self.data.mainData.push.apply(self.data.mainData, res.info.data);
				} else {
					self.data.isLoadAll = true;
					api.showToast('没有更多了', 'none');
				};

				self.setData({
					web_mainData: self.data.mainData,
				});
			} else {
				api.buttonCanClick(self, true)
				api.showToast('网络故障', 'none')
			};

			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			console.log('getMainData', self.data.mainData)
		};
		api.qrGet(postData, callback);
	},


	qrUpdate(e) {
		const self = this;
		var index = api.getDataSet(e, 'index')

		const postData = {};
		postData.tokenFuncName = 'getThreeToken';
		postData.data = {
			behavior: 2
		};
		postData.searchItem = {
			check_code: self.data.mainData[index].check_code,
			user_type:0
		};
		postData.saveAfter = [{
			tableName: 'Order',
			FuncName: 'update',
			data: {
				transport_status: 2,
				order_step: 3
			},
			searchItem: {
				id: self.data.mainData[index].order[0].id,
				user_type:0
			}
		}];
		const callback = (res) => {
			if (res.solely_code == 100000) {
				api.showToast('操作成功', 'none');
				setTimeout(function() {
					self.getMainData(true)
				}, 2000);
			} else {
				api.showToast(res.msg, 'none');
			}
		};
		api.qrUpdate(postData, callback);
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
