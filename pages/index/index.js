import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();

//index.js
//获取应用实例
//触摸开始的事件

Page({
	data: {
		is_show: true,
		circular: true,
		sliderData: [],
		labelData: [],
		swiperIndex: 0,
		currentData: '',
		mainData:[],
		isFirstLoadAllStandard: ['getSliderData', 'getLabelData','getMainData']
	},

	onLoad(options) {
		const self = this;
		api.commonInit(self);
		setTimeout(function() {
			self.show()
		}, 2000);
		self.getSliderData();
		self.getLabelData()
	},


	getLabelData() {
		const self = this;
		const postData = {};
		postData.getBefore = {
			partner: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['商品类别']],
				},
				middleKey: 'parentid',
				key: 'id',
				condition: 'in',
			},
		};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
		};
		postData.order = {
			listorder: 'desc',
		};
		const callback = (res) => {
			console.log(1000, res);
			if (res.info.data.length > 0) {
				self.data.labelData.push.apply(self.data.labelData, res.info.data);
				self.data.currentData = self.data.labelData[0].id;
			}
			self.setData({
				currentData: self.data.currentData,
				web_labelData: self.data.labelData,
			});
			self.getMainData()
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getLabelData', self);
		};
		api.labelGet(postData, callback);
	},

	getMainData(isNew) {
		const self = this;
		if (isNew) {
			api.clearPageIndex(self);
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
			category_id:self.data.currentData
		};
		const callback = (res) => {
			api.buttonCanClick(self,true);
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data)
			} else {
				self.isLoadAll = true;
			}
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
			self.setData({
				web_mainData: self.data.mainData,
			});
		};
		api.productGet(postData, callback);
	},

	getSliderData() {
		const self = this;
		const postData = {};
		postData.getBefore = {
			partner: {
				tableName: 'Label',
				searchItem: {
					title: ['=', ['首页轮播']],
				},
				middleKey: 'parentid',
				key: 'id',
				condition: 'in',
			},
		};
		postData.searchItem = {
			thirdapp_id: getApp().globalData.thirdapp_id,
		};
		const callback = (res) => {
			console.log(1000, res);
			
			if (res.info.data.length > 0) {
				self.data.sliderData.push.apply(self.data.sliderData, res.info.data);
			}
			self.setData({
				web_sliderData: self.data.sliderData,
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getSliderData', self);
		};
		api.labelGet(postData, callback);
	},


	checkCurrent(e) {
		const self = this;
		api.buttonCanClick(self);
		var id = api.getDataSet(e, 'id');
		if (self.data.currentData === id) {
			api.buttonCanClick(self,true);
			return false;
		} else {
			self.data.currentData = id;
			self.setData({
				currentData: self.data.currentData
			});
			self.getMainData(true)
		}
	},
	
	addCart(e){
		const self = this;e
		var index =api.getDataSet(e,'index');
		var res = api.setStorageArray('cartData', self.data.mainData[index], 'id', 999);
		if (res) {
			api.showToast('加入成功', 'none', 1000);
		};
	},

	show(e) {
		const self = this;
		self.data.is_show = false;
		self.setData({
			is_show: self.data.is_show
		})
	},

	swiperChange(e) {
		this.setData({
			swiperIndex: e.detail.current
		})
	},

	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},
	
	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	}
	
})
