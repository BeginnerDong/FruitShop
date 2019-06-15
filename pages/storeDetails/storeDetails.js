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
		messageData: [],
		indicatorDots: true,
		vertical: false,
		autoplay: true,
		circular: true,
		interval: 2000,
		duration: 500,
		previousMargin: 0,
		nextMargin: 0,
		swiperIndex: 0,
		messageData: [],
		mainData: [],
		isShow: false,
		count: 1,
		id: '',
		buttonType: '',
		isFirstLoadAllStandard: ['getMainData'],
		searchItem: {},

	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);

		if (options.id) {
			self.data.id = options.id
		};
		self.getMainData();
	
		self.setData({
			web_count: self.data.count
		})
	},





	getMainData() {
		const self = this;
		const postData = {};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			id: self.data.id
		};

		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData = res.info.data[0];
				self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
			} else {
				api.showToast('商品信息有误', 'none', 1000);
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
			self.getMessageData();
			console.log('self.data.mainData', self.data.mainData)
		};
		api.productGet(postData, callback);
	},





	counter(e) {

		const self = this;
		if (JSON.stringify(self.data.mainData) != '{}') {
			if (api.getDataSet(e, 'type') == '+') {
				self.data.count++;
			} else if (api.getDataSet(e, 'type') == '-' && self.data.count > '1') {
				self.data.count--;
			}
		} else {
			self.data.count = 1;
		};
		console.log('self.data.count', self.data.count)
		self.countTotalPrice();

	},


	bindManual(e) {
		const self = this;
		var count = e.detail.value;
		self.setData({
			web_count: count
		});
	},



	countTotalPrice() {
		const self = this;
		var totalPrice = 0;
		totalPrice += self.data.count * parseFloat(self.data.mainData.price);
		self.data.totalPrice = totalPrice;
		self.setData({
			web_totalPrice: self.data.totalPrice.toFixed(2),
			web_count: self.data.count

		});
	},



	selectModel(e) {
		const self = this;
		if (self.data.buttonClicked) {
			api.showToast('数据有误请稍等', 'none', 1000);
			setTimeout(function() {
				wx.showLoading();
			}, 800)
			return;
		};
		self.data.buttonType = api.getDataSet(e, 'type');
		console.log(self.data.buttonType)
		var isShow = !self.data.isShow;
		self.setData({
			web_buttonType: self.data.buttonType,
			web_isShow: isShow
		})
	},



	addCart(e) {
		const self = this;
		let formId = e.detail.formId;
		if (JSON.stringify(self.data.mainData) == '{}') {
			api.buttonCanClick(self, true);
			api.showToast('未选中商品', 'none', 1000);

			return;
		};

		self.data.mainData.count = self.data.count;
		self.data.mainData.isSelect = true;
		var res = api.setStorageArray('cartData', self.data.mainData, 'id', 999);
		if (res) {
			api.showToast('加入成功', 'none', 1000);
			self.data.isShow = false;
			self.setData({
				web_isShow: self.data.isShow
			})
		};
		var cartData = api.getStorageArray('cartData');
		var cartRes = api.findItemInArray(cartData, 'id', self.data.id);

	},






	swiperChange(e) {
		const that = this;
		that.setData({
			swiperIndex: e.detail.current,
		})
	},



	goBuy() {
		const self = this;
		api.buttonCanClick(self);
		if (JSON.stringify(self.data.mainData) == '{}') {
			api.buttonCanClick(self, true);
			api.showToast('未选中商品', 'none', 1000);
			return;
		};
		var orderList = [{
			product: [{
				id: self.data.mainData.id,
				count: self.data.count
			}],
			type: 1,
		}];
		wx.setStorageSync('payPro', orderList);
		api.pathTo('/pages/oderTrue/oderTrue', 'nav')
	},


	getMessageData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken',
			postData.searchItem = {
				relation_id: ['in', self.data.mainData.id],
				type: 1,
				user_type: 0
			};
		postData.order = {
			create_time: 'desc'
		};
		postData.getAfter = {
			user: {
				tableName: 'User',
				middleKey: 'user_no',
				key: 'user_no',
				searchItem: {
					status: 1
				},
				condition: '='
			}
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.messageData.push.apply(self.data.messageData, res.info.data);
			} else {
				self.data.isLoadAll = true;
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMessageData', self);
			self.setData({
				web_messageData: self.data.messageData,
			});
		};
		api.messageGet(postData, callback);
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

	isShow() {
		const self = this;
		self.data.isShow = !self.data.isShow;
		self.setData({
			web_isShow: self.data.isShow
		})
	},




})
