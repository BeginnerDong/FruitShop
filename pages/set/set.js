//logs.js
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
		
		submitData: {
			name:'',
			phone:'',
		},
		isFirstLoadAllStandard: ['userInfoGet'],
	},



	onLoad() {
		const self = this;
		api.commonInit(self);
		self.userInfoGet();
	},


	userInfoGet() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		const callback = (res) => {		
			if(res.solely_code==100000){
				self.data.userData = res.info.data[0];
				self.data.submitData.name = res.info.data[0].info.name;
				self.data.submitData.phone = res.info.data[0].info.phone;
			};
			api.checkLoadAll(self.data.isFirstLoadAllStandard, 'userInfoGet', self);
			self.setData({
				web_userData:self.data.userData,
				web_submitData:self.data.submitData
			})
		};
		api.userGet(postData, callback);
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




	submit() {
		const self = this;
		api.buttonCanClick(self);
		var phone = self.data.submitData.phone;
		const pass = api.checkComplete(self.data.submitData);
		console.log('pass', pass);
		console.log('self.data.submitData',self.data.submitData)
		if (pass) {
			if (phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)) {
				api.buttonCanClick(self, true)
				api.showToast('手机格式不正确', 'none')

			} else {
				
				const callback = (user, res) => {
					self.userInfoUpdate();
				};
				api.getAuthSetting(callback);
			}
		} else {
			api.buttonCanClick(self, true);
			api.showToast('请补全信息', 'none')
		};
	},

	



	
	userInfoUpdate() {
		const self = this;
		const postData = {};
		postData.tokenFuncName = 'getProjectToken';
		if(!wx.getStorageSync('info')||!wx.getStorageSync('info').headImgUrl){
		  postData.refreshToken = true;
		};
		postData.data = {};
		postData.data = api.cloneForm(self.data.submitData);
		const callback = (data) => {		
			api.buttonCanClick(self, true);
			if (data.solely_code == 100000) {			
				api.showToast('完善成功', 'none');	
			setTimeout(function() {
				wx.navigateBack({
					delta:1
				})
			}, 2000);
				
			} else {
				
				api.showToast(data.msg, 'none', 1000)
			}
		};
		api.userInfoUpdate(postData, callback);
	},
	
	
	intoPathRedirect(e) {
		const self = this;
		api.pathTo(api.getDataSet(e, 'path'), 'redi');
	},
	


})
