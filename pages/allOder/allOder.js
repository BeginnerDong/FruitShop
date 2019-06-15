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
		searchItem: {},

	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.mainData = [];
		if (options.num) {
			self.changeSearch(options.num)
		} else {
			self.getMainData()
		};
		self.setData({
			web_mainData: self.data.mainData
		});

	},

	onShow() {
		const self = this;

	},
	


	pay(e) {
		const self = this;
		var id = api.getDataSet(e, 'id');
		var price = api.getDataSet(e, 'price')
		const postData = {
			token: wx.getStorageSync('token'),
			searchItem: {
				id: id
			},
			score:price
			/* 			wxPay: {
							price: self.data.totalPrice
						} */
		};
		const callback = (res) => {
			if (res.solely_code == 100000) {
				const payCallback = (payData) => {
					if (payData == 1) {
						api.showToast('支付成功', 'none');
						self.getMainData(true)
					};

				};
				api.realPay(res.info, payCallback);
			}

		};
		api.pay(postData, callback);
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.order_step = ['in',[0,3]];
		postData.searchItem.thirdapp_id = getApp().globalData.thirdapp_id;
		postData.order = {
			create_time: 'desc'
		}
		postData.getAfter = {
			qr: {
				tableName: 'Qrcode',
				middleKey: 'order_no',
				key: 'order_no',
				condition: '=',
				searchItem: {
					status: 1
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
		api.orderGet(postData, callback);
	},

	deleteOrder(e) {
		const self = this;
		const postData = {};
		postData.token = wx.getStorageSync('token');
		postData.searchItem = {};
		postData.searchItem.id = api.getDataSet(e, 'id');
		const callback = res => {
			api.dealRes(res);
			self.getMainData(true);
		};
		api.orderDelete(postData, callback);
	},


	zoomTap(e) {
		const self = this;
		var index = api.getDataSet(e, 'index');
		self.data.showZoom = true;
		self.data.url = self.data.mainData[index].qr[0].url;
		self.setData({
			web_url: self.data.url,
			web_showZoom: self.data.showZoom
		})
	},

	closeZoom() {
		const self = this;
		self.data.showZoom = false;
		self.setData({
			web_showZoom: self.data.showZoom
		})
	},



	menuClick: function(e) {
		const self = this;
		api.buttonCanClick(self);
		const num = e.currentTarget.dataset.num;
		self.changeSearch(num);
	},

	changeSearch(num) {
		const self = this;
		this.setData({
			num: num
		});
		self.data.searchItem = {}
		if (num == '0') {

		} else if (num == '1') {
			self.data.searchItem.pay_status = '0';

		} else if (num == '2') {
			self.data.searchItem.pay_status = '1';
			self.data.searchItem.transport_status = '0';
		} else if (num == '3') {
			self.data.searchItem.pay_status = '1';
			self.data.searchItem.transport_status = '1';
		} else if (num == '4') {
			self.data.searchItem.pay_status = '1';
			self.data.searchItem.transport_status = '2';
		}
		self.setData({
			web_mainData: [],
		});
		self.getMainData(true);
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
