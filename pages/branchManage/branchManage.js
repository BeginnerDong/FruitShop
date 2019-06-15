import {
	Api
} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {
	Token
} from '../../utils/token.js';
const token = new Token();

Page({
	data: {

		mainData: [],
		isFirstLoadAllStandard: ['getMainData', 'getLocation'],
		searchItem: {},

		La1: '',
		lo1: '',
		order: {}
	},



	onLoad(options) {
		const self = this;
		api.commonInit(self);

		self.getLocation()
	},

	choose(e) {
		const self = this;
		const user_no = api.getDataSet(e, 'user_no');
		self.data.user_no = user_no;
		getApp().globalData.user_no = self.data.user_no;
		setTimeout(function() {
			wx.navigateBack({
				delta: 1
			});
		}, 300);
	},



	getMainData(isNew) {
		const self = this;
		var lat = self.data.la1;
		var lon = self.data.lo1;
		var orderKey = 'ACOS(SIN((' + lat + '* 3.1415) / 180 ) *SIN((latitude * 3.1415) / 180 ) +COS((' + lat +
			' * 3.1415) / 180 ) * COS((latitude * 3.1415) / 180 ) *COS((' + lon +
			' * 3.1415) / 180 - (longitude * 3.1415) / 180 ) ) * 6379';
		self.data.order[orderKey] = 'asc';
		if (isNew) {
			api.clearPageIndex(self)
		};
		const postData = {};
		postData.paginate = api.cloneForm(self.data.paginate);
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = api.cloneForm(self.data.searchItem);
		postData.searchItem.user_type = 1
		postData.order = api.cloneForm(self.data.order)
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.mainData.push.apply(self.data.mainData, res.info.data);
				for (var i = 0; i < self.data.mainData.length; i++) {

					if (self.data.mainData[i].user_no == self.data.meInfoData.passage1) {
						self.data.mainData[i].isdefault = 1;
						self.data.index = i;
					};
					self.data.mainData[i].distance =
						api.distance(self.data.la1, self.data.lo1, self.data.mainData[i].latitude, self.data.mainData[i].longitude)
					console.log('self.data.mainData[i].distance', self.data.mainData[i].distance)
				}
			} else {
				self.data.isLoadAll = true;
				api.showToast('没有更多了', 'none')
			}
			self.setData({
				web_mainData: self.data.mainData
			});
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getMainData', self);
		};
		api.userInfoGet(postData, callback);
	},

	userInfoUpdate(e) {
		const self = this;
		var index = api.getDataSet(e, 'index');
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			user_no: wx.getStorageSync('info').user_no
		};
		postData.data = {
			passage1: self.data.mainData[index].user_no
		}
		const callback = (res) => {
			if (res.solely_code == 100000) {
				self.data.mainData[index].isdefault = 1;
				if (self.data.index) {
					delete self.data.mainData[self.data.index].isdefault;
				}
			};
			self.setData({
				web_mainData: self.data.mainData
			})
		};
		api.userInfoUpdate(postData, callback);
	},


	getLocation() {
		const self = this;
		const callback = (res) => {
			if (res) {
				self.data.la1 = res.latitude;
				self.data.lo1 = res.longitude
			};
			self.getMeInfoData()
		};

		api.getLocation('getGeocoder', callback);
		api.checkLoadAll(self.data.isFirstLoadAllStandard, 'getLocation', self)
	},

	getMeInfoData() {
		const self = this;
		const postData = {}
		postData.tokenFuncName = 'getProjectToken';
		postData.searchItem = {
			user_no: wx.getStorageSync('info').user_no
		};
		const callback = (res) => {
			if (res.info.data.length > 0) {
				self.data.meInfoData = res.info.data[0];
				self.getMainData();
			};
		};
		api.userInfoGet(postData, callback);
	},

	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	intoPath(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'nav');
	},


	onReachBottom() {
		const self = this;
		if (!self.data.isLoadAll) {
			self.data.paginate.currentPage++;
			self.getMainData();
		};
	},

	intoPathRedi(e) {
		const self = this;
		wx.navigateBack({
			delta: 1
		})
	},

	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},
})
