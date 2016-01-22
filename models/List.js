var mongoose = require('mongoose');

var ListSchema = new mongoose.Schema({

	client: { //客户信息
		name: String,
		address: String,
		phone_no: String,
		unit: String,
	},

	deliver: String, //送货
	debug: String, //安调
	visit: String, //上门服务
	install: String, //安装单
	warehouse: String, //库房安装

	outgoing: String, //出库单号
	serial_no: String, //序列号

	saler: String, //报修人（销售）

	value: Number, //分值
	
	engineer: String, //工程师

	date: { //报修日期
		type: Date,
		default: Date.now,
	},

	completed: { //完成情况
		type: Boolean,
		default: false,
	},

	completeTime: Date,

	feedback: { //反馈信息
		type: String,
		default: '',
	},

	checked: {
		type: Boolean,
		default: false,
	},
});

module.exports = mongoose.model('List', ListSchema);