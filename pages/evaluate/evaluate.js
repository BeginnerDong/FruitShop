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

		mainData: [],
		isFirstLoadAllStandard: ['getMainData'],
		searchItem: {},
		submitData:{
			type:1,
			content:''
		}
	},


	onLoad(options) {
		const self = this;
		api.commonInit(self);
		self.data.id = options.id;
		self.getMainData()
	},

	  messageAdd(){
	  const self = this;
	  
	  const postData = {};
	  postData.tokenFuncName = 'getProjectToken';
	  postData.data = api.cloneForm(self.data.submitData);
	  postData.data.relation_id = self.data.mainData.id;
	  postData.data.relation_table = 'product';
	  console.log(postData)
	  postData.saveAfter = [{
	    tableName:'OrderItem',
	    FuncName:'update',
	    searchItem:{
	      id:self.data.mainData.products[0].id
	    },
	    data:{
	      isremark:1,

	    }
	  }]
	  const callback = (data)=>{  
			api.buttonCanClick(self,true);
	    if(data.solely_code == 100000){
	      api.showToast('评价成功','none');
	      setTimeout(function(){
	        api.pathTo('/pages/user/user','rela')
	      }, 1000)
	    }else{
	      api.showToast(res.msg,'none');
	    };
	  };
	  api.messageAdd(postData,callback);  
	},
	
	submit(){
	  const self = this;
	  api.buttonCanClick(self);
	  const pass = api.checkComplete(self.data.submitData);
	  if(pass){
	      self.messageAdd(); 
	  }else{
			api.buttonCanClick(self,true);
	    api.showToast('请补全信息','none');
	   
	  };
	},
	
	
	
	
	changeBind(e){
	  const self = this;
	  api.fillChange(e,self,'submitData');
	
	  self.setData({
	    web_submitData:self.data.submitData,
	  }); 
	  console.log(self.data.submitData)
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
