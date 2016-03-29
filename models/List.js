var mongoose = require('mongoose');

var ListSchema = new mongoose.Schema({
	serial_number: String,

	client: { //客户信息
		unit: String,
		name: String,
		address: String,
		phone_no: String,
	},

	deliver: String, //送货服务
	debug: String, //安装调试
	visit: String, //上门服务
	install: String, //安装单
	warehouse: String, //库房安装

	outgoing: String, //出库单号
	serial_no: String, //序列号

	saler: String, //报修人（销售）

	value: Number, //分值
	
	engineer: String, //工程师

	attached1: String, //附件1

	attached2: String, //附件2

	attached3: String, //附件3

	date: { //报修日期
		type: Date,
		default: Date.now,
	},

	accepted: { //是否接单
		type: Boolean,
		default: false,
	},

	acceptTime: Date, //接单时间

	serveTime: Date, //上门时间

	completed: { //完成情况
		type: Boolean,
		default: false,
	},

	completeTime: Date,

	feedback: { //反馈信息
		type: String,
	},

	checked: {
		type: Boolean,
		default: false,
	},

	checkTime: Date,

	checkMonth: String,
});

module.exports = mongoose.model('List', ListSchema);