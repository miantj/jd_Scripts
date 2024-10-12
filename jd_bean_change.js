/*
cron "28 8,21 * * *" jd_bean_change.js, tag:资产变化强化版by-ccwav
export BEANCHANGE_PERSENT="10"  分段变量，ck太多一起发通知会失败，可以分10个一发
 */

//详细说明参考 https://github.com/ccwav/QLScript2.

const $ = new Env('京东资产统计');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const dyx = require('./function/dylanx.js');
let NowHour = new Date().getHours();

//默认开启缓存模式
let checkbeanDetailMode = 1;
if ($.isNode() && process.env.BEANCHANGE_BEANDETAILMODE) {
    checkbeanDetailMode = process.env.BEANCHANGE_BEANDETAILMODE * 1;
}

const fs = require('fs');
const CR = require('crypto-js');
const moment = require("moment");
let matchtitle = "昨日";
let yesterday = "";
let TodayDate = "";
let startDate = "";
let endDate = "";
try {
    yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
    TodayDate = moment().format("YYYY-MM-DD");
    startDate = moment().startOf("month").format("YYYY_MM");
    endDate = moment().endOf("month").format("YYYY-MM-DD");
} catch (e) {
    console.log("依赖缺失，请先安装依赖moment!");
    return
}
let RemainMessage = '\n';
RemainMessage += "⭕提醒:⭕" + '\n';
RemainMessage += '【特价金币】特价版APP->我的->金币(可兑换无门槛红包)\n';
RemainMessage += '【话费积分】APP->充值中心-赚积分兑话费（180天效期）\n';
RemainMessage += '【礼品卡额】APP->我的->礼品卡（包含E卡，品牌类卡，超市卡）\n';
RemainMessage += '【超市卡】APP首页->京东超市->超市卡（超市商品可用）\n';
RemainMessage += '【老农场】APP->我的->东东农场->回旧版,完成可兑换无门槛红包,可用于任意商品\n';
RemainMessage += '【新农场】APP->我的->东东农场,完成可在记录里查看奖品\n';
RemainMessage += '【奖票】APP->我的->玩一玩,可兑换京豆、红包等\n';
RemainMessage += '【汪贝余额】APP首页->京东超市->每日签到,可兑换\n';
RemainMessage += '【省钱币】小程序->底部超级会场->天天领红包,可兑换购物红包\n';
RemainMessage += '【其他】不同类别红包不能叠加使用，自测\n';
console.log(RemainMessage);
if (!fs.existsSync("./BeanCache")) {
    fs.mkdirSync("./BeanCache");
}

let strBeanCache = "./BeanCache/" + yesterday + ".json";
let strNewBeanCache = "./BeanCache/" + TodayDate + ".json";
let TodayCache = [];
let Fileexists = fs.existsSync(strBeanCache);
let TempBeanCache = [];
if (!Fileexists) {
    yesterday = TodayDate;
    strBeanCache = strNewBeanCache;
    Fileexists = fs.existsSync(strBeanCache);
    matchtitle = "今日";
}
if (Fileexists) {
    console.log("检测到资产变动缓存文件" + yesterday + ".json，载入...");
    TempBeanCache = fs.readFileSync(strBeanCache, 'utf-8');
    if (TempBeanCache) {
        TempBeanCache = TempBeanCache.toString();
        TempBeanCache = JSON.parse(TempBeanCache);
    }
}

Fileexists = fs.existsSync(strNewBeanCache);
if (Fileexists) {
    console.log("检测到资产变动缓存文件" + TodayDate + ".json，载入...");
    TodayCache = fs.readFileSync(strNewBeanCache, 'utf-8');
    if (TodayCache) {
        TodayCache = TodayCache.toString();
        TodayCache = JSON.parse(TodayCache);
    }
}


let allMessage = '';
let allMessage2 = '';
let allReceiveMessage = '';
let allWarnMessage = '';
let ReturnMessage = '';
let ReturnMessageMonth = '';
let allMessageMonth = '';

let MessageUserGp2 = '';
let ReceiveMessageGp2 = '';
let WarnMessageGp2 = '';
let allMessageGp2 = '';
let allMessage2Gp2 = '';
let allMessageMonthGp2 = '';
let IndexGp2 = 0;

let MessageUserGp3 = '';
let ReceiveMessageGp3 = '';
let WarnMessageGp3 = '';
let allMessageGp3 = '';
let allMessage2Gp3 = '';
let allMessageMonthGp3 = '';
let IndexGp3 = 0;

let MessageUserGp4 = '';
let ReceiveMessageGp4 = '';
let WarnMessageGp4 = '';
let allMessageGp4 = '';
let allMessageMonthGp4 = '';
let allMessage2Gp4 = '';
let IndexGp4 = 0;

let notifySkipList = "";
let IndexAll = 0;
let EnableMonth = "false";
let isSignError = false;
let ReturnMessageTitle = "";
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [], cookie = '';
const JD_API_HOST = 'https://api.m.jd.com/client.action';
let intPerSent = 0;
let i = 0;
let llShowMonth = false;
let Today = new Date();
let strAllNotify = "";
let strSubNotify = "";
let llPetError = false;
let strGuoqi = "";
let TempBaipiao = "";
let llgeterror = false;
let time = new Date().getHours();
let WP_APP_TOKEN_ONE = "";
if ($.isNode()) {
    if (process.env.WP_APP_TOKEN_ONE) {
        WP_APP_TOKEN_ONE = process.env.WP_APP_TOKEN_ONE;
    }
}
//if(WP_APP_TOKEN_ONE)
//console.log(`检测到已配置Wxpusher的Token，启用一对一推送...`);
//else
//console.log(`检测到未配置Wxpusher的Token，禁用一对一推送...`);

let jdSignUrl = 'https://api.nolanstore.cc/sign'
if (process.env.SIGNURL)
    jdSignUrl = process.env.SIGNURL;

let epsignurl = ""
if (process.env.epsignurl)
    epsignurl = process.env.epsignurl;

if ($.isNode() && process.env.BEANCHANGE_PERSENT) {
    intPerSent = parseInt(process.env.BEANCHANGE_PERSENT);
    console.log(`检测到设定了分段通知:` + intPerSent);
}

if ($.isNode() && process.env.BEANCHANGE_USERGP2) {
    MessageUserGp2 = process.env.BEANCHANGE_USERGP2 ? process.env.BEANCHANGE_USERGP2.split('&') : [];
    intPerSent = 0; //分组推送，禁用账户拆分
    console.log(`检测到设定了分组推送2,将禁用分段通知`);
}

if ($.isNode() && process.env.BEANCHANGE_USERGP3) {
    MessageUserGp3 = process.env.BEANCHANGE_USERGP3 ? process.env.BEANCHANGE_USERGP3.split('&') : [];
    intPerSent = 0; //分组推送，禁用账户拆分
    console.log(`检测到设定了分组推送3,将禁用分段通知`);
}

if ($.isNode() && process.env.BEANCHANGE_USERGP4) {
    MessageUserGp4 = process.env.BEANCHANGE_USERGP4 ? process.env.BEANCHANGE_USERGP4.split('&') : [];
    intPerSent = 0; //分组推送，禁用账户拆分
    console.log(`检测到设定了分组推送4,将禁用分段通知`);
}

//取消月结查询
//if ($.isNode() && process.env.BEANCHANGE_ENABLEMONTH) {
//EnableMonth = process.env.BEANCHANGE_ENABLEMONTH;
//}

if ($.isNode() && process.env.BEANCHANGE_SUBNOTIFY) {
    strSubNotify = process.env.BEANCHANGE_SUBNOTIFY;
    strSubNotify += "\n";
    console.log(`检测到预览置顶内容,将在一对一推送的预览显示...\n`);
}

if ($.isNode() && process.env.BEANCHANGE_ALLNOTIFY) {
    strAllNotify = process.env.BEANCHANGE_ALLNOTIFY;
    console.log(`检测到设定了公告,将在推送信息中置顶显示...`);
    strAllNotify = "✨✨✨✨✨✨✨公告✨✨✨✨✨✨✨\n" + strAllNotify;
    console.log(strAllNotify + "\n");
    strAllNotify += "\n🎏🎏🎏🎏🎏🎏🎏🎏🎏🎏🎏🎏🎏🎏🎏\n"
}


if (EnableMonth == "true" && Today.getDate() == 1 && Today.getHours() > 17)
    llShowMonth = true;

let userIndex2 = -1;
let userIndex3 = -1;
let userIndex4 = -1;


if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false')
        console.log = () => { };
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

//查询开关
let strDisableList = "";
let DisableIndex = -1;
if ($.isNode()) {
    strDisableList = process.env.BEANCHANGE_DISABLELIST ? process.env.BEANCHANGE_DISABLELIST.split('&') : [];
}

//老农场
let EnableJdFruit = true;
DisableIndex = strDisableList.findIndex((item) => item === "老农场");
if (DisableIndex != -1) {
    console.log("检测到设定关闭老农场查询");
    EnableJdFruit = false;
}


//7天过期京豆
let EnableOverBean = true;
DisableIndex = strDisableList.findIndex((item) => item === "过期京豆");
if (DisableIndex != -1) {
    console.log("检测到设定关闭过期京豆查询");
    EnableOverBean = false
}

//查优惠券
let EnableChaQuan = false;
DisableIndex = strDisableList.findIndex((item) => item === "查优惠券");
if (DisableIndex != -1) {
    console.log("检测到设定关闭优惠券查询");
    EnableChaQuan = false
}

DisableIndex = strDisableList.findIndex((item) => item === "活动攻略");
if (DisableIndex != -1) {
    console.log("检测到设定关闭活动攻略显示");
    RemainMessage = "";
}


//京豆收益查询
let EnableCheckBean = true;
DisableIndex = strDisableList.findIndex((item) => item === "京豆收益");
if (DisableIndex != -1) {
    console.log("检测到设定关闭京豆收益查询");
    EnableCheckBean = false
}

var _0xodE='jsjiami.com.v7';const _0x276c32=_0x2e12;(function(_0x49a335,_0xacb462,_0x1bf12f,_0x134895,_0x22414f,_0x110291,_0x49a37d){return _0x49a335=_0x49a335>>0x7,_0x110291='hs',_0x49a37d='hs',function(_0x348cde,_0x1d7497,_0x24074b,_0x62910d,_0x1cad1b){const _0x536f37=_0x2e12;_0x62910d='tfi',_0x110291=_0x62910d+_0x110291,_0x1cad1b='up',_0x49a37d+=_0x1cad1b,_0x110291=_0x24074b(_0x110291),_0x49a37d=_0x24074b(_0x49a37d),_0x24074b=0x0;const _0x15d605=_0x348cde();while(!![]&&--_0x134895+_0x1d7497){try{_0x62910d=-parseInt(_0x536f37(0x295,'en%l'))/0x1+-parseInt(_0x536f37(0x346,'8pLj'))/0x2*(parseInt(_0x536f37(0x1cc,'4)21'))/0x3)+parseInt(_0x536f37(0x1a5,'4x)J'))/0x4*(parseInt(_0x536f37(0x2ad,'2zg!'))/0x5)+parseInt(_0x536f37(0xd1,'5J%b'))/0x6*(parseInt(_0x536f37(0x276,'ODO1'))/0x7)+-parseInt(_0x536f37(0x301,'Rx#*'))/0x8+parseInt(_0x536f37(0x35f,'8pLj'))/0x9+parseInt(_0x536f37(0xc3,'GlD0'))/0xa;}catch(_0x13808c){_0x62910d=_0x24074b;}finally{_0x1cad1b=_0x15d605[_0x110291]();if(_0x49a335<=_0x134895)_0x24074b?_0x22414f?_0x62910d=_0x1cad1b:_0x22414f=_0x1cad1b:_0x24074b=_0x1cad1b;else{if(_0x24074b==_0x22414f['replace'](/[uAnMKrteYTSHCkgWdpw=]/g,'')){if(_0x62910d===_0x1d7497){_0x15d605['un'+_0x110291](_0x1cad1b);break;}_0x15d605[_0x49a37d](_0x1cad1b);}}}}}(_0x1bf12f,_0xacb462,function(_0x42d409,_0x121451,_0x46ed0a,_0x13f011,_0x434d44,_0x47a14f,_0xfba53){return _0x121451='\x73\x70\x6c\x69\x74',_0x42d409=arguments[0x0],_0x42d409=_0x42d409[_0x121451](''),_0x46ed0a=`\x72\x65\x76\x65\x72\x73\x65`,_0x42d409=_0x42d409[_0x46ed0a]('\x76'),_0x13f011=`\x6a\x6f\x69\x6e`,(0x186f62,_0x42d409[_0x13f011](''));});}(0x6280,0x3f352,_0x3cc9,0xc7),_0x3cc9)&&(_0xodE=`\xf82`);const _0x4b12a2=(function(){const _0x3142a2=_0x2e12,_0x4e1117={'EmkPx':function(_0x44ee02,_0x4d34dd){return _0x44ee02>_0x4d34dd;},'wfZYn':function(_0x41ba6f,_0x1958c2){return _0x41ba6f===_0x1958c2;},'RmvoE':_0x3142a2(0x289,'A*Z&'),'GEcKz':_0x3142a2(0x218,'hvm^'),'jLFur':function(_0x482ed8,_0x41a32c){return _0x482ed8===_0x41a32c;},'wporU':_0x3142a2(0x186,'ygrf')};let _0x46453e=!![];return function(_0x52e203,_0x5153c5){const _0x20494c=_0x46453e?function(){const _0x157477=_0x2e12,_0x41c610={'xfFIV':function(_0x4ad20c,_0x3109b9){const _0x494e9d=_0x2e12;return _0x4e1117[_0x494e9d(0x373,'hPZX')](_0x4ad20c,_0x3109b9);}};if(_0x4e1117[_0x157477(0x2d7,'pPSU')](_0x4e1117[_0x157477(0x1e4,'ju!I')],_0x4e1117[_0x157477(0x1b9,'@BTv')]))_0x4b4623[_0x157477(0x118,'o4$z')]=_0x3e577a['rs'][_0x157477(0x277,'T3cS')][_0x157477(0x235,')wjz')]?!![]:![];else{if(_0x5153c5){if(_0x4e1117[_0x157477(0x199,'7Eg#')](_0x4e1117[_0x157477(0xf5,'9t(%')],_0x4e1117[_0x157477(0x214,'go^z')])){const _0x1fa574=_0x5153c5[_0x157477(0x321,'7H]3')](_0x52e203,arguments);return _0x5153c5=null,_0x1fa574;}else _0x136278[_0x157477(0x2d6,'IMfq')]=_0x5df44e[_0x157477(0x1e3,'F7Zw')][_0x157477(0x210,'7JkP')]+'个',_0x41c610[_0x157477(0x338,'7H]3')](_0x4fc950[_0x157477(0x378,'7a#B')][_0x157477(0x189,'Rx#*')],0x7530)&&(_0x13acf8[_0x157477(0x21d,'vtXH')]+=_0x157477(0x1b3,'7H]3'));}}}:function(){};return _0x46453e=![],_0x20494c;};}()),_0x340fd8=_0x4b12a2(this,function(){const _0x4ed781=_0x2e12,_0x48f205={'sppws':_0x4ed781(0x217,'9t(%')};return _0x340fd8[_0x4ed781(0x1af,'7Eg#')]()[_0x4ed781(0x311,'4)21')](_0x48f205[_0x4ed781(0x129,'T3cS')])[_0x4ed781(0x1f8,'Rx#*')]()[_0x4ed781(0x278,']zZ]')](_0x340fd8)[_0x4ed781(0x16b,'o4$z')](_0x48f205[_0x4ed781(0x2d2,'[rss')]);});_0x340fd8();const _0x2ec96b=require(_0x276c32(0x284,'hPZX')),_0x128722=require(_0x276c32(0x9a,'8Luw')),_0x4d30f4=require(_0x276c32(0x206,'GlD0')),_0x2b1b29=require(_0x276c32(0x122,'hPZX'));function wanyiwan(){const _0x3119fd=_0x276c32,_0x646527={'KYlCo':_0x3119fd(0x1de,'w8$('),'qjGkF':function(_0x496bbe,_0x476a95){return _0x496bbe!==_0x476a95;},'XjeYF':_0x3119fd(0x263,'T3cS'),'lNEtz':_0x3119fd(0x2f6,'ODO1'),'CSdOu':_0x3119fd(0x2ff,'w8$('),'zXEHo':_0x3119fd(0x372,'5sSM'),'Meynf':function(_0x5c503c,_0x2c56f2){return _0x5c503c==_0x2c56f2;},'TEdgZ':_0x3119fd(0x17b,'ODO1'),'jAsMW':function(_0x5eb3c3,_0x2ab972){return _0x5eb3c3!==_0x2ab972;},'anKaP':_0x3119fd(0x168,'4x)J'),'wYTDs':_0x3119fd(0x115,'T3cS'),'IgGpB':function(_0x2393ad){return _0x2393ad();},'kGixD':_0x3119fd(0x2db,'ju!I'),'GUgrp':_0x3119fd(0x2b2,'ygrf'),'TEaii':_0x3119fd(0x2e5,'QgoX')};return new Promise(async _0x48a939=>{const _0x50fb94=_0x3119fd;if(_0x646527[_0x50fb94(0x1ec,'jXN7')](_0x646527[_0x50fb94(0xd7,'IMfq')],_0x646527[_0x50fb94(0xf4,')wjz')])){const _0x598843={'url':_0x50fb94(0x1dc,'go^z'),'body':_0x50fb94(0xbb,')wjz')+$['UA'][_0x50fb94(0x356,'ju!I')](';')[0x2]+_0x50fb94(0x254,'hPZX')+Date[_0x50fb94(0x22a,'8pLj')](),'headers':{'Cookie':cookie,'content-type':_0x50fb94(0xac,'(oSB'),'Origin':_0x50fb94(0x1e9,'w8$('),'Referer':_0x50fb94(0x2ca,'ygrf'),'User-Agent':$['UA']},'ciphers':_0x646527[_0x50fb94(0x10f,'ODO1')],'timeout':0x7530};$[_0x50fb94(0x2ec,'!M@r')](_0x598843,(_0xa69edf,_0x26decf,_0x14e200)=>{const _0x399a96=_0x50fb94,_0x547b97={'LUzBa':_0x646527[_0x399a96(0x303,'7Eg#')]};try{if(_0xa69edf)_0x646527[_0x399a96(0x2c5,'71[D')](_0x646527[_0x399a96(0x16d,'0Igy')],_0x646527[_0x399a96(0x149,'0Igy')])?$[_0x399a96(0x2be,'(^2G')](_0xa69edf):_0x19048d[_0x399a96(0x2f1,'Z40#')](_0x547b97[_0x399a96(0x280,'o4$z')]);else{if(_0x14e200){if(_0x646527[_0x399a96(0x209,'8pLj')](_0x646527[_0x399a96(0xde,'Z40#')],_0x646527[_0x399a96(0x302,'9t(%')]))_0x14e200=$[_0x399a96(0x29d,'hvm^')](_0x14e200),_0x646527[_0x399a96(0x11e,'go^z')](_0x14e200[_0x399a96(0x1d1,'vtXH')][_0x399a96(0xd9,'o4$z')],0x0)&&($[_0x399a96(0x2ed,'Va&U')]=_0x14e200[_0x399a96(0x15c,'4)21')][_0x399a96(0x1db,'vtXH')][_0x399a96(0x171,']zZ]')]||0x0);else{const _0x13c603=_0x143cb7?function(){const _0x534290=_0x399a96;if(_0x2aa498){const _0x738b5c=_0x130c1c[_0x534290(0x111,'8pLj')](_0xe1c320,arguments);return _0xfdb61=null,_0x738b5c;}}:function(){};return _0x49fbdf=![],_0x13c603;}}else $[_0x399a96(0x193,'@BTv')](_0x646527[_0x399a96(0xaa,'Rx#*')]);}}catch(_0x28efc2){$[_0x399a96(0x35e,'4x)J')](_0x28efc2);}finally{_0x646527[_0x399a96(0x2f4,'Rx#*')](_0x646527[_0x399a96(0x127,'!M@r')],_0x646527[_0x399a96(0x1fb,'[rss')])?_0x646527[_0x399a96(0x29b,'GlD0')](_0x48a939):_0xbefd6b?(_0x117f9f[_0x399a96(0x27c,'(^2G')](''+_0x42bba4[_0x399a96(0xb0,'4x)J')](_0x5aa6d1)),_0x218774[_0x399a96(0x36e,'4x)J')](_0x399a96(0x1b0,'7JkP'))):(_0x350085[_0x399a96(0x2d4,'9t(%')]=_0x200a57[_0x399a96(0x310,'VOVM')](/"score":(\d+)/)?_0x55177c[_0x399a96(0x310,'VOVM')](/"score":(\d+)/)[0x1]:0x0,_0x47aced[_0x399a96(0xce,'4x)J')]=_0xec4602[_0x399a96(0x1c5,'w8$(')](/"currentBeanNum":(\d+)/)?_0x4e3ecd[_0x399a96(0xea,'pPSU')](/"currentBeanNum":(\d+)/)[0x1]:0x0,_0x7f747d[_0x399a96(0x261,'QgoX')]=_0x439b71[_0x399a96(0x1b5,'EKUp')](/"showName":"(.*?)"/)?_0x4c8285[_0x399a96(0x173,'7Eg#')](/"showName":"(.*?)"/)[0x1]:_0x57cd05[_0x399a96(0x2e1,'F7Zw')]);}});}else _0x31d428[_0x50fb94(0x1be,'pPSU')]=_0x31fc13[_0x50fb94(0x281,'5sSM')][_0x50fb94(0x24d,'en%l')][_0x50fb94(0xe4,'QgoX')]||0x0;});}async function getuserinfo_6dy_bak(){const _0x189387=_0x276c32,_0x5e43c0={'iYzuS':function(_0x5ebaf2,_0x41f5b6){return _0x5ebaf2==_0x41f5b6;},'lzHJk':function(_0x31599a,_0x2aa6a4){return _0x31599a===_0x2aa6a4;},'gNGuw':_0x189387(0x1a1,'2zg!'),'RstkT':_0x189387(0x94,'T3cS'),'SqbpU':function(_0x4ba68b,_0x1edd4b){return _0x4ba68b!==_0x1edd4b;},'BgFLd':_0x189387(0x1a4,'xir#'),'fPZFC':_0x189387(0xc7,']zZ]'),'lRyhc':function(_0x54675f,_0x2d09a5){return _0x54675f===_0x2d09a5;},'FSUoE':_0x189387(0x2aa,'Rx#*'),'SeCiu':_0x189387(0x1f9,'EKUp'),'XqQxK':_0x189387(0xb8,'hvm^'),'iyIqG':function(_0x38be1a){return _0x38be1a();},'VEXlv':_0x189387(0xee,'Z40#'),'ykTkQ':_0x189387(0x30a,'ODO1'),'DpYIO':_0x189387(0x341,'hPZX'),'yWUuW':_0x189387(0xc5,'T3cS')};let _0x3fef14={'url':_0x5e43c0[_0x189387(0x2a9,'7a#B')],'headers':{'Accept':_0x5e43c0[_0x189387(0x322,'nY6C')],'accept-encoding':_0x5e43c0[_0x189387(0x357,'ygrf')],'content-type':_0x5e43c0[_0x189387(0x25d,'8Luw')],'Cookie':cookie,'User-Agent':$['UA']}};return new Promise(_0x4c7ed7=>{const _0x4bdeec=_0x189387,_0x55c2c4={'wqtkP':function(_0xe40060,_0x49e204){const _0x4eb2bc=_0x2e12;return _0x5e43c0[_0x4eb2bc(0x9d,'o4$z')](_0xe40060,_0x49e204);},'NQdls':function(_0x5d368e,_0x3ab46d){const _0x75bf56=_0x2e12;return _0x5e43c0[_0x75bf56(0x108,'9t(%')](_0x5d368e,_0x3ab46d);},'xCezi':_0x5e43c0[_0x4bdeec(0x1dd,'Ungq')],'IxFlu':_0x5e43c0[_0x4bdeec(0x242,'bhF@')],'odAlB':function(_0x3cd63f,_0x1b1d96){const _0x3aade2=_0x4bdeec;return _0x5e43c0[_0x3aade2(0x1c1,'ygrf')](_0x3cd63f,_0x1b1d96);},'mIHNi':_0x5e43c0[_0x4bdeec(0x192,'VOVM')],'DDgUQ':_0x5e43c0[_0x4bdeec(0x252,'2zg!')],'QZdGO':function(_0x5dc5b1,_0x201d0c){const _0x5b2358=_0x4bdeec;return _0x5e43c0[_0x5b2358(0xbd,'hvm^')](_0x5dc5b1,_0x201d0c);},'jWVeD':_0x5e43c0[_0x4bdeec(0x1d4,'7a#B')],'cXXuw':function(_0x208b89,_0x4f7a2f){const _0x2cd88f=_0x4bdeec;return _0x5e43c0[_0x2cd88f(0x141,'ODO1')](_0x208b89,_0x4f7a2f);},'BbDLi':_0x5e43c0[_0x4bdeec(0x191,'7JkP')],'OtmXO':_0x5e43c0[_0x4bdeec(0x259,'2zg!')],'WpYxz':function(_0x5547dc){const _0x2cc1c2=_0x4bdeec;return _0x5e43c0[_0x2cc1c2(0x1e5,'en%l')](_0x5547dc);}};$[_0x4bdeec(0x1d8,'2zg!')](_0x3fef14,async(_0x3159b5,_0x1c54d4,_0x483afb)=>{const _0x5cc36d=_0x4bdeec;try{if(_0x3159b5)console[_0x5cc36d(0x2bf,')wjz')](''+JSON[_0x5cc36d(0x241,'Z40#')](_0x3159b5)),console[_0x5cc36d(0x27b,'5J%b')](_0x5cc36d(0x2ba,'8pLj'));else{if(_0x483afb){_0x483afb=JSON[_0x5cc36d(0x152,'vtXH')](_0x483afb);if(_0x55c2c4[_0x5cc36d(0x1ce,'en%l')](_0x483afb[_0x55c2c4[_0x5cc36d(0x2cb,'(oSB')]],_0x55c2c4[_0x5cc36d(0xcb,'!M@r')])){if(_0x55c2c4[_0x5cc36d(0x18e,'hPZX')](_0x55c2c4[_0x5cc36d(0x31e,'Ungq')],_0x55c2c4[_0x5cc36d(0x32c,'5J%b')])){$[_0x5cc36d(0x30c,'Va&U')]=![];return;}else{_0x2597cb=_0x4f7aa4[_0x5cc36d(0x32a,'cnE$')](_0x334b3a);if(_0x55c2c4[_0x5cc36d(0x154,'Rx#*')](_0xd9c6bb[_0x5cc36d(0xb3,'GlD0')],0x1a1b98))_0x4c0b3c[_0x5cc36d(0x24c,'4x)J')]=_0x16aada['rs'][_0x5cc36d(0x283,'ygrf')][_0x5cc36d(0x292,'71[D')]?!![]:![];else{}}}if(_0x55c2c4[_0x5cc36d(0x9c,'7JkP')](_0x483afb[_0x5cc36d(0x28b,'(^2G')],'0')&&_0x483afb[_0x5cc36d(0x2c6,'Z40#')]){const _0x41e50f=_0x55c2c4[_0x5cc36d(0x233,'Va&U')][_0x5cc36d(0x101,'8Luw')]('|');let _0x1e664f=0x0;while(!![]){switch(_0x41e50f[_0x1e664f++]){case'0':$[_0x5cc36d(0xfb,'!M@r')]=_0x483afb[_0x5cc36d(0x198,'xir#')]?.[_0x5cc36d(0xc4,'5J%b')]?.[_0x5cc36d(0x26e,'QgoX')]?.[_0x5cc36d(0x26d,'pPSU')];continue;case'1':$[_0x5cc36d(0x309,'EKUp')]=_0x483afb[_0x5cc36d(0x34f,'8pLj')]?.[_0x5cc36d(0xd3,'[rss')]?.[_0x5cc36d(0x2e8,'F7Zw')]||'';continue;case'2':$[_0x5cc36d(0x11c,'@BTv')]=_0x55c2c4[_0x5cc36d(0xe3,'0Igy')](_0x483afb[_0x5cc36d(0xa0,'go^z')]?.[_0x5cc36d(0x323,'vtXH')]?.[_0x5cc36d(0xd6,'GlD0')],0x1);continue;case'3':$[_0x5cc36d(0x153,'pPSU')]=$[_0x5cc36d(0xc0,'0Igy')];continue;case'4':$[_0x5cc36d(0x1d6,'71[D')]=_0x483afb[_0x5cc36d(0x11f,'0Igy')]?.[_0x5cc36d(0xf9,')wjz')]?.[_0x5cc36d(0xa6,'Ungq')]||0x0;continue;}break;}}}else $[_0x5cc36d(0x27b,'5J%b')](_0x55c2c4[_0x5cc36d(0x35c,'9t(%')]);}}catch(_0x10df86){$[_0x5cc36d(0x196,'Va&U')](_0x10df86,_0x1c54d4);}finally{_0x55c2c4[_0x5cc36d(0x169,'(^2G')](_0x55c2c4[_0x5cc36d(0x133,'o4$z')],_0x55c2c4[_0x5cc36d(0x158,'xir#')])?(_0x493c4c[_0x5cc36d(0x1a8,'w8$(')]=_0x1cd09e[_0x5cc36d(0x177,'Ungq')](/"score":(\d+)/)?_0x2ad713[_0x5cc36d(0x1ad,'Jgnn')](/"score":(\d+)/)[0x1]:0x0,_0x549d63[_0x5cc36d(0x2b6,'7JkP')]=_0xa0f54b[_0x5cc36d(0x369,'jXN7')](/"currentBeanNum":(\d+)/)?_0x455528[_0x5cc36d(0x2f0,'5sSM')](/"currentBeanNum":(\d+)/)[0x1]:0x0,_0x334806[_0x5cc36d(0x331,'Ungq')]=_0x3355ea[_0x5cc36d(0x35d,'hPZX')](/"showName":"(.*?)"/)?_0x5c2c7e[_0x5cc36d(0x1d0,'4)21')](/"showName":"(.*?)"/)[0x1]:_0x2aaf25[_0x5cc36d(0x349,'jXN7')]):_0x55c2c4[_0x5cc36d(0x15a,'go^z')](_0x4c7ed7);}});});}async function getuserinfo_6dy(){const _0x6b0148=_0x276c32,_0x1dfa45={'tEfiZ':function(_0x391712,_0x5d6977){return _0x391712!==_0x5d6977;},'Vkcpe':_0x6b0148(0x270,'QgoX'),'nRlJz':_0x6b0148(0xbe,'ODO1'),'IXWzM':function(_0x36f60d,_0x87be58){return _0x36f60d===_0x87be58;},'AUfzc':_0x6b0148(0x250,']zZ]'),'pOOBp':function(_0x1bc59f,_0x214562){return _0x1bc59f===_0x214562;},'CxIbr':_0x6b0148(0xa7,'QgoX'),'YTAxD':_0x6b0148(0x142,'ju!I'),'tvFPh':_0x6b0148(0x1c4,'xir#'),'DiSbf':_0x6b0148(0x223,'Va&U'),'CoEnA':function(_0x280baa,_0x13660f){return _0x280baa==_0x13660f;},'ERKpC':function(_0x52e161,_0xb9baf9){return _0x52e161!==_0xb9baf9;},'wfCVm':_0x6b0148(0x12e,'7Eg#'),'CrKYe':_0x6b0148(0x325,'VOVM'),'IUMdf':_0x6b0148(0xa3,'7a#B'),'eUWkn':function(_0x7a2062){return _0x7a2062();},'ndUrK':function(_0x6f471e,_0x410b3a){return _0x6f471e>_0x410b3a;},'WaWUB':_0x6b0148(0x260,'o4$z'),'APAaM':_0x6b0148(0x1c3,'IMfq'),'GnuDV':_0x6b0148(0x2a3,'4x)J'),'WQDtN':_0x6b0148(0x1bb,'4x)J'),'rYrZG':_0x6b0148(0x253,'7H]3'),'KwibW':_0x6b0148(0x213,'0Igy'),'NFOat':_0x6b0148(0x288,'go^z'),'Preqc':_0x6b0148(0x2bd,'ygrf'),'CaFtZ':_0x6b0148(0x20d,'8Luw'),'KCjwh':_0x6b0148(0x1c6,'hPZX'),'ptAlN':_0x6b0148(0x19e,'[rss'),'jOedd':_0x6b0148(0x315,'8Luw'),'JsitV':_0x6b0148(0x246,'EKUp'),'OKvui':_0x6b0148(0x1ca,'2zg!'),'cYYnQ':_0x6b0148(0x164,'71[D'),'oiSCf':_0x6b0148(0x1fd,'5J%b'),'USKrO':_0x6b0148(0x377,'8pLj')};let _0x50edb4={'orgFlag':_0x1dfa45[_0x6b0148(0x1ed,'VOVM')],'callSource':_0x1dfa45[_0x6b0148(0x17f,'Ungq')],'channel':0x1,'isHomewhite':0x1,'bizModelCode':'6','externalLoginType':'1','bizModeClientType':_0x1dfa45[_0x6b0148(0x9b,'7a#B')],'appId':_0x1dfa45[_0x6b0148(0x296,'A*Z&')],'token':_0x1dfa45[_0x6b0148(0x125,'go^z')],'tenantCode':_0x1dfa45[_0x6b0148(0x275,'7a#B')],'uuid':'','client':_0x1dfa45[_0x6b0148(0xad,'2zg!')],'sourceType':_0x1dfa45[_0x6b0148(0x30d,'2zg!')]},_0x36bff8={'appId':_0x1dfa45[_0x6b0148(0x1bf,'(^2G')],'fn':_0x1dfa45[_0x6b0148(0x34e,'Z40#')],'body':_0x50edb4,'apid':_0x1dfa45[_0x6b0148(0x2cf,'Jgnn')],'client':_0x1dfa45[_0x6b0148(0x156,'0Igy')],'user':$[_0x6b0148(0x14a,'9t(%')],'code':0x1,'ua':$['UA']};_0x50edb4=await _0x128722[_0x6b0148(0xff,'en%l')](_0x36bff8);let _0x4d16fe={'url':_0x6b0148(0x1fe,'!M@r')+_0x50edb4+_0x6b0148(0x1a3,'5J%b'),'headers':{'Accept':_0x1dfa45[_0x6b0148(0x1eb,'hPZX')],'accept-encoding':_0x1dfa45[_0x6b0148(0x334,'Rx#*')],'content-type':_0x1dfa45[_0x6b0148(0x104,'Z40#')],'referer':_0x1dfa45[_0x6b0148(0x24e,'8Luw')],'Cookie':cookie,'User-Agent':$['UA']},'ciphers':_0x1dfa45[_0x6b0148(0x1da,'pPSU')]};return new Promise(_0x5cef1a=>{const _0x22ccb1=_0x6b0148,_0x4e7e18={'gjmeZ':function(_0x4a218b,_0x1cff79){const _0x7ce315=_0x2e12;return _0x1dfa45[_0x7ce315(0x358,'w8$(')](_0x4a218b,_0x1cff79);},'NfdiK':function(_0x1915aa,_0x137bd2){const _0x53804f=_0x2e12;return _0x1dfa45[_0x53804f(0x2a4,'7JkP')](_0x1915aa,_0x137bd2);}};$[_0x22ccb1(0x15f,'w8$(')](_0x4d16fe,async(_0x30f5cb,_0x41c36f,_0x5d78c9)=>{const _0x41d4bb=_0x22ccb1;if(_0x1dfa45[_0x41d4bb(0x342,'go^z')](_0x1dfa45[_0x41d4bb(0x2fd,'o4$z')],_0x1dfa45[_0x41d4bb(0x2bc,'Ungq')]))try{if(_0x1dfa45[_0x41d4bb(0x33b,'4)21')](_0x1dfa45[_0x41d4bb(0x355,'(oSB')],_0x1dfa45[_0x41d4bb(0x248,'Va&U')])){if(_0x30f5cb)console[_0x41d4bb(0xc2,'VOVM')](''+JSON[_0x41d4bb(0x162,'EKUp')](_0x30f5cb)),console[_0x41d4bb(0x28d,'(oSB')](_0x41d4bb(0xf0,'7H]3'));else{if(_0x5d78c9){_0x5d78c9=JSON[_0x41d4bb(0x2fe,'nY6C')](_0x5d78c9);if(_0x1dfa45[_0x41d4bb(0x360,'4x)J')](_0x5d78c9[_0x1dfa45[_0x41d4bb(0x20a,'7a#B')]],_0x1dfa45[_0x41d4bb(0x318,'Jgnn')])){if(_0x1dfa45[_0x41d4bb(0x17c,'5J%b')](_0x1dfa45[_0x41d4bb(0x347,'2zg!')],_0x1dfa45[_0x41d4bb(0x13c,'4)21')]))_0x165312[_0x41d4bb(0x2c9,'IMfq')](_0x295359,_0x167b35);else{$[_0x41d4bb(0x2dd,'5J%b')]=![];return;}}if(_0x1dfa45[_0x41d4bb(0x376,'ygrf')](_0x5d78c9[_0x41d4bb(0x35a,'nY6C')],'0')&&_0x5d78c9[_0x41d4bb(0x324,'Va&U')]){const _0x44704b=_0x1dfa45[_0x41d4bb(0x1fa,'8pLj')][_0x41d4bb(0x1f2,'5sSM')]('|');let _0x52da43=0x0;while(!![]){switch(_0x44704b[_0x52da43++]){case'0':$[_0x41d4bb(0xfb,'!M@r')]=_0x5d78c9[_0x41d4bb(0x166,'@BTv')]?.[_0x41d4bb(0x1b6,'en%l')]?.[_0x41d4bb(0x245,'jXN7')]?.[_0x41d4bb(0x18f,'o4$z')];continue;case'1':$[_0x41d4bb(0x1b8,'71[D')]=_0x5d78c9[_0x41d4bb(0x2ee,'w8$(')]?.[_0x41d4bb(0x27f,'(oSB')]?.[_0x41d4bb(0x20c,'9t(%')]||'';continue;case'2':$[_0x41d4bb(0x15e,'Va&U')]=_0x5d78c9[_0x41d4bb(0x379,'8Luw')]?.[_0x41d4bb(0x1f7,'EKUp')]?.[_0x41d4bb(0x2af,'GlD0')]||0x0;continue;case'3':$[_0x41d4bb(0x1a2,'Ungq')]=_0x1dfa45[_0x41d4bb(0x2ef,'xir#')](_0x5d78c9[_0x41d4bb(0x305,'(oSB')]?.[_0x41d4bb(0x165,'nY6C')]?.[_0x41d4bb(0x200,'8pLj')],0x1);continue;case'4':$[_0x41d4bb(0x261,'QgoX')]=$[_0x41d4bb(0x207,'8Luw')];continue;}break;}}}else{if(_0x1dfa45[_0x41d4bb(0x99,'4x)J')](_0x1dfa45[_0x41d4bb(0x2bb,'QgoX')],_0x1dfa45[_0x41d4bb(0x343,'xir#')]))$[_0x41d4bb(0x16c,'cnE$')](_0x1dfa45[_0x41d4bb(0x2e4,'5sSM')]);else{_0x51ffca=_0x7d690f[_0x41d4bb(0x32a,'cnE$')](_0x5f0db7);if(_0x4e7e18[_0x41d4bb(0x17e,'go^z')](_0x4aec4e[_0x41d4bb(0x257,'5J%b')],0x0))_0xadd60e[_0x41d4bb(0x1b2,'pPSU')]=_0x18810e[_0x41d4bb(0x324,'Va&U')][_0x41d4bb(0x1fc,'hPZX')]+'个',_0x4e7e18[_0x41d4bb(0x16a,'xir#')](_0x3d6d7e[_0x41d4bb(0x31a,'T3cS')][_0x41d4bb(0x31c,'IMfq')],0x7530)&&(_0x15dfe9[_0x41d4bb(0x2cc,'Rx#*')]+=_0x41d4bb(0x351,'!M@r'));else{}}}}}else try{_0x2c95a8[_0x41d4bb(0x327,'hPZX')]=_0x2b48a4[_0x41d4bb(0x281,'5sSM')][_0x41d4bb(0x337,'5sSM')][_0x41d4bb(0x370,')wjz')][0x0][_0x41d4bb(0x26f,'7a#B')]||0x0,_0x2b1e0e[_0x41d4bb(0x332,'71[D')]=_0x308648[_0x41d4bb(0x324,'Va&U')][_0x41d4bb(0x208,'(oSB')][_0x41d4bb(0x2a2,'vtXH')][0x0][_0x41d4bb(0xab,'71[D')]||0x0;}catch{}}catch(_0x46bb63){$[_0x41d4bb(0x34c,'w8$(')](_0x46bb63,_0x41c36f);}finally{_0x1dfa45[_0x41d4bb(0x143,'bhF@')](_0x5cef1a);}else{_0x1fd336[_0x41d4bb(0xdf,'IMfq')]=![];return;}});});}async function _0x4e9bee(){const _0x2a3cf1=_0x276c32,_0x45f8b1={'okGRB':function(_0xe29881,_0x1b57d3){return _0xe29881!==_0x1b57d3;},'BcnMH':_0x2a3cf1(0x1cf,'4)21'),'xySlW':function(_0x131f97,_0x4ae568){return _0x131f97===_0x4ae568;},'tpXVB':_0x2a3cf1(0x32f,'xir#'),'HoHQK':_0x2a3cf1(0x25a,'en%l'),'FRGet':function(_0x31b695){return _0x31b695();},'NCbDI':function(_0x3a1840,_0x2355ed){return _0x3a1840==_0x2355ed;},'LZvOT':function(_0x596db1){return _0x596db1();},'jEmPx':_0x2a3cf1(0x12d,'!M@r'),'txoVl':_0x2a3cf1(0xcf,'hvm^')};let _0x23a03={'url':_0x2a3cf1(0xec,'2zg!'),'body':_0x2a3cf1(0x2c4,'Va&U')+Date[_0x2a3cf1(0x267,'Jgnn')]()+_0x2a3cf1(0x222,'ygrf'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Origin':_0x45f8b1[_0x2a3cf1(0xa4,'Ungq')],'Referer':_0x45f8b1[_0x2a3cf1(0x1f4,'8Luw')]}};return new Promise(_0x2c6169=>{const _0x3d1590=_0x2a3cf1,_0x12ea75={'YSqhZ':function(_0x4832da,_0x17b0f8){const _0x58921b=_0x2e12;return _0x45f8b1[_0x58921b(0x188,')wjz')](_0x4832da,_0x17b0f8);},'ddGsz':function(_0x40e88f){const _0x467cc3=_0x2e12;return _0x45f8b1[_0x467cc3(0x1cb,'7Eg#')](_0x40e88f);}};$[_0x3d1590(0x2d9,'Z40#')](_0x23a03,async(_0x8a0949,_0x3c527f,_0xcc2578)=>{const _0x10e86e=_0x3d1590;if(_0x45f8b1[_0x10e86e(0x240,'IMfq')](_0x45f8b1[_0x10e86e(0xc6,'!M@r')],_0x45f8b1[_0x10e86e(0x2f3,'[rss')])){const _0x7142e4=_0x3c20ac[_0x10e86e(0x14e,'7JkP')](_0x358a25);_0x12ea75[_0x10e86e(0x33c,'vtXH')](_0x7142e4[_0x10e86e(0x22e,'4x)J')],0x3e8)&&(_0x3caf44[_0x10e86e(0x247,'9t(%')]=_0x7142e4['rs'][_0x10e86e(0x353,'ygrf')][_0x10e86e(0x30b,'ODO1')]);}else try{_0x45f8b1[_0x10e86e(0x2b4,'bhF@')](_0x45f8b1[_0x10e86e(0xa5,'!M@r')],_0x45f8b1[_0x10e86e(0x1c0,'w8$(')])?_0x8a0949?(console[_0x10e86e(0x27b,'5J%b')](''+JSON[_0x10e86e(0x22d,'hvm^')](_0x8a0949)),console[_0x10e86e(0xa2,'nY6C')](_0x10e86e(0x271,'EKUp'))):($[_0x10e86e(0x159,'5sSM')]=_0xcc2578[_0x10e86e(0x2b1,'cnE$')](/"score":(\d+)/)?_0xcc2578[_0x10e86e(0x2a7,')wjz')](/"score":(\d+)/)[0x1]:0x0,$[_0x10e86e(0x19c,'4)21')]=_0xcc2578[_0x10e86e(0x212,'(^2G')](/"currentBeanNum":(\d+)/)?_0xcc2578[_0x10e86e(0x21b,'Z40#')](/"currentBeanNum":(\d+)/)[0x1]:0x0,$[_0x10e86e(0x363,'71[D')]=_0xcc2578[_0x10e86e(0xd4,'en%l')](/"showName":"(.*?)"/)?_0xcc2578[_0x10e86e(0xeb,'o4$z')](/"showName":"(.*?)"/)[0x1]:$[_0x10e86e(0x147,'7Eg#')]):_0x1c652f[_0x10e86e(0x266,'Va&U')]+=_0x10e86e(0x2c1,'ygrf');}catch(_0x485ab4){$[_0x10e86e(0x319,'EKUp')](_0x485ab4,_0x3c527f);}finally{_0x45f8b1[_0x10e86e(0x160,'(oSB')](_0x45f8b1[_0x10e86e(0x178,'jXN7')],_0x45f8b1[_0x10e86e(0x285,'Jgnn')])?_0x45f8b1[_0x10e86e(0x97,'xir#')](_0x2c6169):_0x12ea75[_0x10e86e(0xfc,'7H]3')](_0x41badc);}});});}async function queryScores(){const _0x4cfd34=_0x276c32,_0x29be36={'njBGf':function(_0x4fe76b,_0x1df6b0){return _0x4fe76b(_0x1df6b0);},'bZQmc':function(_0x48eca9,_0x2ab39c){return _0x48eca9===_0x2ab39c;},'qNsMp':_0x4cfd34(0xb7,'T3cS'),'imgNg':function(_0x3230fc,_0x2a7888){return _0x3230fc!==_0x2a7888;},'vlXGb':_0x4cfd34(0x2cd,'Rx#*'),'mlRJi':function(_0x15f201,_0x2f666a){return _0x15f201==_0x2f666a;},'FpKhN':function(_0xc1a3d2){return _0xc1a3d2();},'Mapqh':_0x4cfd34(0x19f,'xir#'),'IIsri':_0x4cfd34(0x1cd,'F7Zw'),'LKKvP':_0x4cfd34(0x17d,'Va&U'),'fuwoI':_0x4cfd34(0x1bd,'!M@r')};let _0x3cc498='',_0x435a1f={'appId':_0x29be36[_0x4cfd34(0x181,'[rss')],'functionId':_0x29be36[_0x4cfd34(0xed,'[rss')],'body':{},'appid':_0x29be36[_0x4cfd34(0x176,'5sSM')],'user':$[_0x4cfd34(0x2c0,'GlD0')],'code':0x0,'ua':$['UA']};body=await _0x2b1b29[_0x4cfd34(0x31d,'GlD0')](_0x435a1f);let _0x44d467={'url':_0x4cfd34(0x28f,'7JkP')+body+_0x4cfd34(0x313,'go^z'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Referer':_0x29be36[_0x4cfd34(0x2c7,'4x)J')]}};return new Promise(_0x484265=>{const _0x22c31f=_0x4cfd34,_0x50b53={'DIeiJ':function(_0x45f156,_0x3c6b35){const _0x22dca8=_0x2e12;return _0x29be36[_0x22dca8(0x328,'71[D')](_0x45f156,_0x3c6b35);},'bsOCy':function(_0xb0dcfa,_0x58981b){const _0x434eeb=_0x2e12;return _0x29be36[_0x434eeb(0x9e,'Ungq')](_0xb0dcfa,_0x58981b);},'syzGJ':_0x29be36[_0x22c31f(0x96,'A*Z&')],'embvl':function(_0x1cdf2f,_0x4ea26e){const _0x2c8e17=_0x22c31f;return _0x29be36[_0x2c8e17(0x21a,'EKUp')](_0x1cdf2f,_0x4ea26e);},'GibUn':_0x29be36[_0x22c31f(0x359,'71[D')],'QWqRO':function(_0x41410c,_0x25f8eb){const _0x4c6c0d=_0x22c31f;return _0x29be36[_0x4c6c0d(0x10e,'hvm^')](_0x41410c,_0x25f8eb);},'fQXOL':function(_0x4c4583){const _0x44d192=_0x22c31f;return _0x29be36[_0x44d192(0x367,'nY6C')](_0x4c4583);}};$[_0x22c31f(0x2d0,'ju!I')](_0x44d467,async(_0x2ca2e4,_0x5e5071,_0x31e5dc)=>{const _0x30303a=_0x22c31f;if(_0x50b53[_0x30303a(0x224,'9t(%')](_0x50b53[_0x30303a(0x10c,'ygrf')],_0x50b53[_0x30303a(0x146,'8pLj')]))try{if(_0x50b53[_0x30303a(0x26c,')wjz')](_0x50b53[_0x30303a(0x17a,'8pLj')],_0x50b53[_0x30303a(0x175,'7Eg#')]))_0x50b53[_0x30303a(0x2eb,'7JkP')](_0x138215,_0x5b6b90);else{const _0x2911e6=JSON[_0x30303a(0x137,'5J%b')](_0x31e5dc);_0x50b53[_0x30303a(0xd0,'0Igy')](_0x2911e6[_0x30303a(0x2b5,'bhF@')],0x3e8)&&($[_0x30303a(0x1ae,'vtXH')]=_0x2911e6['rs'][_0x30303a(0x130,'4x)J')][_0x30303a(0x30b,'ODO1')]);}}catch(_0x56282a){$[_0x30303a(0x319,'EKUp')](_0x56282a,_0x5e5071);}finally{_0x50b53[_0x30303a(0xae,'2zg!')](_0x484265);}else _0x59dff4[_0x30303a(0x1e7,'5J%b')]=_0x403a16['rs'][_0x30303a(0x23d,'IMfq')][_0x30303a(0x28a,'8pLj')];});});}function _0x2e12(_0x5b1974,_0x3f7744){const _0x3f65ed=_0x3cc9();return _0x2e12=function(_0x1b71a9,_0x1f1e46){_0x1b71a9=_0x1b71a9-0x93;let _0x3cc946=_0x3f65ed[_0x1b71a9];if(_0x2e12['OXwpTM']===undefined){var _0x2e1247=function(_0x2e6ba8){const _0x15a0fd='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x3f7ac3='',_0x291499='',_0x4099ae=_0x3f7ac3+_0x2e1247;for(let _0xa613a9=0x0,_0x53fabd,_0x142f9e,_0x143cb7=0x0;_0x142f9e=_0x2e6ba8['charAt'](_0x143cb7++);~_0x142f9e&&(_0x53fabd=_0xa613a9%0x4?_0x53fabd*0x40+_0x142f9e:_0x142f9e,_0xa613a9++%0x4)?_0x3f7ac3+=_0x4099ae['charCodeAt'](_0x143cb7+0xa)-0xa!==0x0?String['fromCharCode'](0xff&_0x53fabd>>(-0x2*_0xa613a9&0x6)):_0xa613a9:0x0){_0x142f9e=_0x15a0fd['indexOf'](_0x142f9e);}for(let _0x15aad5=0x0,_0x2fa361=_0x3f7ac3['length'];_0x15aad5<_0x2fa361;_0x15aad5++){_0x291499+='%'+('00'+_0x3f7ac3['charCodeAt'](_0x15aad5)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x291499);};const _0x4e878e=function(_0x3ee40b,_0x2483c4){let _0x49fbdf=[],_0x2aa498=0x0,_0x3b6cc7,_0xa3ea15='';_0x3ee40b=_0x2e1247(_0x3ee40b);let _0x11d321;for(_0x11d321=0x0;_0x11d321<0x100;_0x11d321++){_0x49fbdf[_0x11d321]=_0x11d321;}for(_0x11d321=0x0;_0x11d321<0x100;_0x11d321++){_0x2aa498=(_0x2aa498+_0x49fbdf[_0x11d321]+_0x2483c4['charCodeAt'](_0x11d321%_0x2483c4['length']))%0x100,_0x3b6cc7=_0x49fbdf[_0x11d321],_0x49fbdf[_0x11d321]=_0x49fbdf[_0x2aa498],_0x49fbdf[_0x2aa498]=_0x3b6cc7;}_0x11d321=0x0,_0x2aa498=0x0;for(let _0x130c1c=0x0;_0x130c1c<_0x3ee40b['length'];_0x130c1c++){_0x11d321=(_0x11d321+0x1)%0x100,_0x2aa498=(_0x2aa498+_0x49fbdf[_0x11d321])%0x100,_0x3b6cc7=_0x49fbdf[_0x11d321],_0x49fbdf[_0x11d321]=_0x49fbdf[_0x2aa498],_0x49fbdf[_0x2aa498]=_0x3b6cc7,_0xa3ea15+=String['fromCharCode'](_0x3ee40b['charCodeAt'](_0x130c1c)^_0x49fbdf[(_0x49fbdf[_0x11d321]+_0x49fbdf[_0x2aa498])%0x100]);}return _0xa3ea15;};_0x2e12['roFiuR']=_0x4e878e,_0x5b1974=arguments,_0x2e12['OXwpTM']=!![];}const _0x39a514=_0x3f65ed[0x0],_0x411473=_0x1b71a9+_0x39a514,_0x192814=_0x5b1974[_0x411473];if(!_0x192814){if(_0x2e12['YUDnav']===undefined){const _0xe1c320=function(_0xfdb61){this['VknySz']=_0xfdb61,this['ZLESaV']=[0x1,0x0,0x0],this['rWWegx']=function(){return'newState';},this['BBmpYz']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['PaueKz']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0xe1c320['prototype']['enQpJx']=function(){const _0x3e93fe=new RegExp(this['BBmpYz']+this['PaueKz']),_0x491bee=_0x3e93fe['test'](this['rWWegx']['toString']())?--this['ZLESaV'][0x1]:--this['ZLESaV'][0x0];return this['uSVnMd'](_0x491bee);},_0xe1c320['prototype']['uSVnMd']=function(_0x37668f){if(!Boolean(~_0x37668f))return _0x37668f;return this['vJBFnR'](this['VknySz']);},_0xe1c320['prototype']['vJBFnR']=function(_0x7d1e0a){for(let _0x4d6759=0x0,_0x1b2128=this['ZLESaV']['length'];_0x4d6759<_0x1b2128;_0x4d6759++){this['ZLESaV']['push'](Math['round'](Math['random']())),_0x1b2128=this['ZLESaV']['length'];}return _0x7d1e0a(this['ZLESaV'][0x0]);},new _0xe1c320(_0x2e12)['enQpJx'](),_0x2e12['YUDnav']=!![];}_0x3cc946=_0x2e12['roFiuR'](_0x3cc946,_0x1f1e46),_0x5b1974[_0x411473]=_0x3cc946;}else _0x3cc946=_0x192814;return _0x3cc946;},_0x2e12(_0x5b1974,_0x3f7744);}function _0x3cc9(){const _0x2c6ba5=(function(){return[...[_0xodE,'kSjSKsSujYitKagpmeiHn.wcAoTmu.rAvCMH7dWH==','WOddOmk2nmogWPDirrhcNSkPCSouWPdcHKr/WPO9W6K+dhy','WQ7dNCo5dMe','W4zTEHJcHvJcRCoLWQ7cHxmI','y8krnG/dOW','W6/dP8oDW4vKhX50W5flqmoJAmoIsSomWRBcOw7dJmk3WPJdL8oY','b8kJWRPhcSooceLT','gvJdUSoomq','W6rkWOdcUdRdM3XWDCktWQ5M','rf3dTCksWRRcKWfugWyg','W7BdHH3dQSk8','dCoYC8otkq','W7FdS8ohW7eDchuOdY4ZWRujna','W491WP/cSv8FaNy','o3/dI8opatKQuLWxWRhdOKddMmo26k2w5RcT5AEQ6lsB772R6k6b5Qgy5P+557Ye6ls+6ywC6k6T','iCkLWRm','WORcJb4RW7pdJw1T','W5ZOG5dLHPZMJ6C1x+whUEE7IUwnICk7','W6BdUCkmW5/dIW','WRZcUIBcRYe','v29PW77dLg/cUmk9','WPXzWRNdTx5vWPvhl8oZW7/dQmo5bfi2rmoRW6lcLSopW4CV','ruhdK8kOWRJcLY5BgayRduBcSW','kmomtgSn','qmkGmSoGgq','WOaTDbNdKfZdTCoxWOtcLsXqvCksW6vXW7/cNW','rbS4zxtdMb8DWPBcOCoQWQbOWQ7cJCk7W5y9W5vbiSogW4xcKHxdLmoSW47dLSonnatcJG','WOebqH9cACkUWR5QW7iSW5xdHmk+W6VdQYCyW5RdUSotW57dGwhcTteTWPvaA8k/WOmBztrlCghdJxG','WO7cHaSRW6NdGgrWfW','W4tdSSoVW4fn','oCk6WOX2ea','i2rBrCo8','WPmoDmotW44','fMldTmo4WRSAWOvnmq','WQBdMSo3mNK','imkRWQbdoG','WRm5W5KwWQZdVSovWOyci0DWW7FdH8ouESk0u23dPSk0WOBdTq','W6qfesrb','WOGbBCoWW7NcTCo7mrq','tuldSCkHWQa','hWddJ2XpWOhcU1XoBSo1W5ytWR0opCko','W7DaWRRcINK','W7PKBmksWPBdHLdcGq','Fmkacr7dKxFdQSocaLKVWPuTWO4er8oYBbakdbXRoCka','Be1OW6ddRG','WPSSB8kGWQ0','WQy3FCkhWQC','W4pdVSogW6m','W4BcUhf0W7tdOdXP','W4ddPSkBlCo2W4rcwq','WRxdO8onW7rS','W5e0pvJdNqRdV8oeWO7dHG','tLFdOmkJWPRcLbvuaq','Ba9LbW14ktjIW43dItVcMq','hX/dKG','W6/cJef4W5W','WQZcRJCgW5u','W5xdUSobW7CfeW','WPiqASo0W5NdRmk7BbayW49qa8ocW4NcLI3cIhrCufZdVSocr8kQW7FcVCoZWRdcMCoRW4hdMq','ySkXWPpcHCo1','5lUH5lUw5P+z5yQb5zI66l2Z5zQ356MD5Pw65O20','W4fvWQ3cJKO','Bs3cImkjs2G5uN4WWQFdVW','WOOfBmo3W48','W5BdQmkalSol','B8kieXS','semlWOez','s2vfW73dMG','WR83Db9d','W7BdQ8kCm8olW4vqv1VcQSkvAConW4G','WP7dPmoka0S0AXDnW5m','jCk+WQbqiCkDrGH6Amo1pSouWP7dSCkSW4fCW7pcPW','ibq/oCoJ','WR4VW4qOWR4','FConWPJcSwu','FSk1amoyka','wYtdSmojW5/dTCkaW6dcHGxcSmoj','t8k1jCoGpY7dL8o9D8oIW6a','WR3cIGSLW58','WRbAWRRdLeG','cs0Oi8ox','WPNdOSoDd2a9zWnt','umkYiCo0ja','eSo2DmoeeKtdPmkSWRu','p8oRD8ogW5C','WRdcQchcQt3cR3lcSmkk','W77dUCktW4tdQ0VcKK8','5lM95lUh5P2F5yMT5zIH6lYY5zUc56QS5PAv5O2F','WRBdRZdcS8kD','j1/cVM/dKG','WOqZW4qYWPW','W47dS8kDmmomWPalgutcNmkeCmowW47dKaOQW4XTWRT/fcddT8kDp8oPF8klWQP8WQldUSkmW6adF8ofASkQca4OyCkOhmohW4FcGCkvi23dT8k5nSkRWOFdISkPv05Uhf4','WOebqH9cACkUWR57W64WWOJcH8o9WQ/dPw1vW5BdUmkrWPldN2hcTZCTW4GoF8kIWOqqsgq','W4PmW4/dNmkcvgVcLSk0rSo2jKmZeCoNw3JdPqa','WPVdTtpcVCkoW77dGGNdOG','rSkydCoupq','uw1UW5pdTg/cUmk9','cdmM','WPqlAq','pwRdJ8otfMeYxX8cWQVdJrpdJSkIW4WoWQLvaGlcVNOGWR/dSGZdUSkgW6RcNSoDW57dRXSSpbOhWQpdSeJcTmkNW4K8rCoamSk3WOVdSSovxSoLWQPjW49tWOexW5hdLW0gW6NcUSoDW7pdK8ktWRqlhCkFawNcPCoCWRxcPmopvKNdQaW8Bb/cHSoWW7XUz2HsevuLWRG+hgjeWOtcOue8xmo5WPm5h8ofWR/dTSo2WQmFxCoIW4BcTeXVBwxcOr7cKCoMlNHYWQOAWRZdSCkbWRzfW7ldGZhcMqZcPxKDWOrer8kGlmoLn8kvdCkLyH96FmoeqmkTCSkHFbdcVdxcIe/dJ8oAbHKrW6X7WQHFWPGblSkFrSoyW4hcK3bId8kdWRldJeRdSgtcSs5mWQrXW4SMWO52lmownCkDW5VcLCkYWPnBdmo3pCkgvmoSWOGRfSoqWPmWW7BcRmoIpSkqyG','WO/cRtJdQ8k3WReBtt5wWO5bW701B2VdMq','CCk5k8oqbSkiWRpcNG','dhdcQmkwWPZcH8koW4lcRW','WOpdRctcUSk9','WRddImorW7LB','omokBNqG','gZqdcSofWRFcJSo6F0ddHSoXw1S','rCkUF8kvEq','WP7dQqq','cmoNC8oaEWJcPmkPWQhcMGRdQmkFyCkpx8krW5T7WRyBW4Pee8oPWR0SvYldOIldLmoegCoiWR7dMqxcGmkIFCobW7xdR2a5WQ7dRtRcHCkRkZpdICk9','lhxdLSoubG','zSokW6pcLSk0','W6RdSSoDW5z/','cHhcMCkvwMfrlG','WO0uCCo2W78','WO8uraj4pCoNW74','W7/cHwS','wM95qCkpW7ldQ8kYoqZcRmkG','e8k6W60XWPG','W6nBWPVdUWlcHNnMc8kcWQ4','WRJcTJxcGI4','WRxcLSkZWR4Q','eNyNrgi','W5tdRSoqW50acwCM','m8k7W4uAWP4','WPmwW5S3WOW','lrJdJLyZ','vNndW67dTW','vNLwuSoaEuuSgMJcVW3cTCouDmk4WP/cICoHWPmQWQJdKxGnzXWRWPiKrmkHW4NdMu3dGCk+WQdcNSk9kSkgWRhdSYhdOCo9CSkiWPZdHbtdKHW0p8kIW5/dKc7dOu/dJ8kSWPhdSmoLdvZcOeZcJCkmhGq0WOCqc3OYWPn5dLurWPeKowZdG8odqalcIgzwxgRdKwBcMMSJW6BdK39xW7uOqCo4W5JdOmkEW47dMCkEcL3dKIVcImoPEbjjpCkmq2ZcUcjxW6mFjSoBov0ZW6ZdO8kyWRxcUaClW5BdOCk8k8kcESoOdCkMtSo6hrq9FgbTW7JcVwr1FvRdNmoycmkeW4fflmkmz2FdJmkajHiqWQZcHSo+jwxdVcFcGKHklmoAiItcNCkZC8o8WR5Th8oEW6FdQmo/uZaPqmkZl8o8WQnbtmkzdmkokSkxWPtcJangW443etnRmCobFa/dM8k0W7lcKCk4W4xcLmo+W4xdLSoVidfFd3BcJJD2vvZcH8opW5jMmSknBu7cRcqHlJpdIg/cPJ7cRLKFw0i1E8o0kIbWfJ3cOCkhBttcKutdOWhdVmk4xrhdL8kvW44/W7CFqmkoWRVdUmk6B8omkmk8WOKFW4tcNKfcowRdUf3dUf1LhI5mqCkevwJdJ2iZceFdISkZChZcPGSxW6ZcQCk3yCo5FX3cSL5L','BujUsq88kayb','edqElmoD','WP3dRSkwv2POoqfiW4ZdO3uoWPNcLgXQW5m','W6ZdQZddT8knWRmCtW57W4LeW6O3A2NdPSk5WQzwW4dORltMS6NLP53OTiBVVzxOR4pMOB7MN4FNVOhOTB3PHOxORQa','5lUu5lMM5P6R5yQ95zIl6l215zIb56Md5Pwy5O2S','W6BdM8o4W6bB','gSkUWODooa','WPZdQrq','nZqQi8o3WRiPWRzngqf/W5XHWPHiWQyHW4FcRKRORRRMSjZLPjNOT7RVV43OR5FMO4lMNiZNV7xOTPFPHyVOR7i','a2vvxmoD','lmkGW7SCWQlcI24ZW4W','WPq6ku0','neddG8ogWOW','5PYb5yIg5zQ36lYo5zU956UU5PwV5O6j','cJW2oCog','WOuAuq','n2Kluh8','se84WROM','dGu9rNddKKm','W4rzW4NdGCkKhshdI8kurSo2','WPGZW4OzWPRdMq','WRWLuCkxWPC','W7ddSCo2W5bVvvGPW5u','WPWOW5KSWPVcKCkjW4WabLXLWRBdV8kuECk/e0JdPSkRW6m','eH7dT1q5','ggT3lmof','fgNdOCo4WOCeWPLynmowWOhdUCkJuxyFWR8mWRe','pCkLWQDu','W6pcHNNcIrORcIRdOSovjLNcQa','dNhdG8oyWPy','WQVcG8k1WRqSh8okW4Ol','W4hcMxJcKre','WRdcG8kZWQ0XqSkmWOmtqmo9oSkXECkVb8kpWP7cImk1qConWRnLWRv7W7tdRN3dU8oFWPldO8o+orXjAtBcT8kQzCkBs3L6mZvuAmo4sCk6lXa','dxNcS8kBWOhcP8kw','BSogWQZcV2RdUNNcIa','WRdcQYlcOcdcHx3cOSkmxKj9WRldVafxC8ktgSowW6nnW4uMW6RdHNqN','iISKhmoqWRtcTmo6FNBdPmoRxvy','hgS7t1G','pMFcH04','eK0PBeS','l3vlBmo0','WP4MhutdGr3cLmoAWPy','uhL/W7NdSxu','s8kJhCoHlG','W7fiWOZdSWpcMMj1n8k1WQ9UpXpcSa','W7DyWQ7dPXa','WR3cSIWvW58','hIRdVfOG','W4uuW7tcVgKkWOWllSoZWRRcRCk4ta0Tsmk9W7xdGSksWPPIms3cV1BcP2W4W71X','W5iOWPa','W63cGCo1j8o7pmoUdhRdPSkJESo4W7NcJCkrWP5bW7baW4T8zb5Qa8o6W5ZdLXFcTSkRp8oyW6RcLXldL2RcO1lcSXi','W4DXWP8','W5xdSSkla8oqW45b','W6ddQwVdVb3cPuZcS8kTFW','iaVdT2qO','E0X2W5BdLW','W5XTWQ/dPH4','oI/cOmk2CW','xCkDg8oxhW','fcyJaSoXWQJcPCoPqLFdQa','ngNdQCoaaq','W4/cSCoEb8oHAmkgtg7dICkemCoI','n8obxmoQW7BcMahdNa','W4X7WOW','nMzMDSo6','eZCHa8onWRJcOCoVE0RdQCkRruaAW6G/wW/cKmozCe7cLmoEW5lcU8o4AmkpfmkVgW','pSk/WRDdn8ougG','lK8/ALiUFXu','dSo8Ca','hX/dKMKqW4tcRvbgzmo7W71aW7vx6k6O5Rk+5AsF6lA477+t6k6M5Qcg5P6I57Yi6lAz6yAv6k+W','W6pcVCoOlSof','W4pcTfi','k3xcT8ksWQq','dGy7Dh0','WPxcMaOrW7BdRwPVfW','o8ojtmoKW7hcLWRdLG','WOhdLCoRW696vmklWRFcRW','f8ofu8opW4i','WRBcVIBcUtRcG27cV8klv0mnW67dQXFOR47MSj3LPOlOTyVVVR/ORAZMO7NMNi/NViFOTANPHAROR4G','hHBdIxmrW6xcVK1j','fNrlwmoGExC6','W49EWP3dPdlcKej7l8krWQ1oiXhcU8ooja','WRJdH8oXW7L+','WOP5C150CZqTx8kq','b0H5FCoczx/dL13dNuaZsbxdVcy','W6zvWOFdPspcH2n3l8kFWRm','fIyLdG','k8kOnZpORAxMSzRLPRxOTPpVVBZOR4hMOOpMNk/NVi3OTjtPHQZOR6a','W4RdQmko','W6VdVmoo','WONcNa4hW78','oLSPv1qKya','h2/cOSklWQFcRCkjW5K','W4NcOmo7fCoP','hJWWkW','kHlcGmkouw1NjCoQW4zzWRa','ahLmrSo8zhqNkgZdSvRdMSowFCkW','W5PZW4SPWOBdImosWOOFbazYW6hdVSoBFCkS','kmo8t8oHcG','AmkDC8oxW73cQWtdGa','W5JcJw7cGY4','WPSkESo2W4xcV8oW','W6foWQKPWPy','WOBdQrFcSmkxW57dTW/dOmkb','W7xdTSoDW5z4qvq','EM5KW6VdRG','bNpcOa','sSkZWPJcHmov','ng7dI8okawz3ffmbWRFcKXVcKSoLW4vbWRHrcLNdUwW8W64','W7/dRCoAW6uA','fatcKCkzz3Xdp8oQ','svZdPCkjWRJcGHm','W6XoWOZdUYq','tmk6m8ojcYtdGq','gIW6WRxcPwVcRSkkWO8HWQG','W7XpWRWeWRu','W40MoJvD','WRlcHZSvW70','W77dTCkloCoV'],...(function(){return[...['WP0VW4bbWQegWQ5aW7hcPG','W6JdPrNdRSkB','aNhcVSkdWRK','k8k7W4yxWQy','W6RdJINdQCkS','hM7cOSkCWR3cT8koW4lcQW','WOqWW5GVWR3dMmodWPeYc1PZW5hdVmoCFa','bK1bxmoD','W47dQ8oxW68A','WQaTaehdMGFcKSobWONcLgSiaq','mN7dQSoioq','lqNdG24TW4dcSLW','WPxdNmo3W7rBC8kfWRhcQW','bGOTyxK','5Psm5yEu5z2X5P6k6k+m5Aso6lwN','WQxdTCoaW7DF','WRRdQSoYW4ZcQL7dJvr9','WQzyWOddP24','W6ldOSk0W4ddQHJdKWCHnLdcN8kCl2tdPqLBl8kq','su/dQKOMW7pcT0a','zvZdMCk+WO0','W4pdPZ/dSmkxWQCc','WQpcRrhcTsi','W43cUhD6W5u','p2juvmoe','r8oDWPJcU0q','W6VcK1/cLHi','W7dcHwJcNW','pN/dNSoumtmTvuy','fMv2BmoN','W5PQWRZcQuG','WPRdTtxcQ8ki','WPxdOXFcPmkiW6JdPGNdVmkcW5niW4rIWRtOR7xMSQBLP57OTRpVVOVORiNMOjVMNyxNVBROT6NPHk7ORP4','lSooFmoxW5u','A8kTWRJcUSo4','b21Mxmohy3qNnwpdO0NdUSoFESkRWPNcLCoPWQ8rWQVdJW','W6VdVmooW7bLvW','bWq+','W7tdStVdRmkxWRmcqq','woIdQowfQoAnL8krj+wfKUE7T+wnRYq','W6b1WQ80WR4','oLhcOSkuWOO','o0SZvK8PDHr6W63cVcpcHmoaq8kqqSoIthtdIcC4wSoVW63dUSkTW40QwCoJW6RdHmonW6XJDmkSW6RdH8kaW6PKCqfeWRdcMSkCzCoXWQVcQfLfW6ZdGHCiWOu','xvJdHSkMWP8','WRZcLSkZWRW','WPeGoKFdVq','f3pcPgxdQG','dxxdO8opWQyp','ggfnrCoAlt56gN/dRrhdVSkwCCk7W5JcHmozWQ9h','eL/cOSkdWOC','W7NdP8kIW6/dSeZcMKC','W4NdRmkJW4ldUW','F8owWR3cHuRdUNNcIa','emoNrSoCdW','AKeoWPO','pb46w0C','i3BcMLZdKG','DKeAWQSUvW','oc4/cmo8WRlcOCo1Dq','omk5WOfvgG','eMVdPSovWR0tWPfd','WO7cMYyTW7q','WQ06zSklWR3dLhlcJCks','WQJcMmk0WQK','WPNKU7BKUjdLHABLNB9ZxXJdM8oY5P6M6k+i6kYS5RgG5Asv6lwCi+kbPU+5QokbM++5IW','x2ahWO0l','tCoIWOVcRvS','W4/dTmkLl8oyW4nk','WPiBkgpdSG','W6/dVSowW5uL','gmk5WRfshmogbei','xSkAaGJdNhNdQCot','ertdJhOb','W4NdTIRdRSkQW6HacZbiW4GlW6L3zghcMmk7WQ5EW5/cPCoEWOjalv3dKuZcMCo2DrlcP8k+W7FdQSoneKRdV8kjk2pcJuhcUbyjFxdcIuW','mWGjlSof','dCoKBmoEW7NcVd/dPHPyWOzcWOVcTHxdSfzHWQxdSmoiWRhdLfRcG8k3zhVdOYJdLCkOaCkNsmo3CCkjW7BcVmkUWPtcI8oeaL8TiSoTWQddUCotuSkbWOWJkKZcJt4sW7ekWRyIWO7dII/cS8oVFGGoWQe','W6VdJJpdKCkZ','mbNcJCkuwa','ySkAnr/dS3tdISoxhvmcWR8OWPm','W5PuWRe5WPC','WROAhhRdKq','gfpdMSotoa','WPKArrS','kKCQAKGJDGHw','kCkRWQbb','WQNdUCoQce8','fZWWkCol','WRtcMmkG','WP0UWPXgW4O','eMxcHgBdQq','W6ddL8kZW73dJG','W6VdPIRdRmk8WRC7sYvzW41GW6O8FgldJW','W4qAaY17','WOKnECoQW4/cSSolnbLD','WQiFtmkrWOW','tNnRW6xdS1xcP8kIWOLXW7elW5FcTcKlWR/dI8oco3TsW5GxW4GqbdjD','WPtdPXhcVmkUW77dSrldGSkwW5m','W5qWgHPF','W6/cLwXHW48','W5pcNSoIj8oT','W5jzW4NdN8ku','pCkJWRz5aW','emkoW5SMWR0','WRVcO8oXWOtcObRdIfeHtbFcPmou','cb8uj8ol','W7bdWQdcHKi','W7nBWPiNWRu','dN3cS8ky','Eh7dKSksWPJcVJnLr1zCj3xcMh/dQSk9WPNdNmkJWOtdQuNcTmoeW53dSuddJmoVW7DaoHKfWQSJWQHDjG1GfCoMzWD9W4tdGKxcL8oLlCkbsmkeW7reW4OjW5VcNSoMWOVcK8o5WRPnWOaCrmkscqa','x0BdS8kKWRFcNaLCda','h0vUt8o8','WRJcQadcQsJcILlcT8kivg0NWQZdPW','W504oWnhxcm3CSkvfSkxW5L4dv7cP8oAzmo7WQKtWRpdV3BcQmo4rq','W4GNpW5cBceSACkF','ne0rwLWPDW','kaJdG20a','f1BdMSoPka','WRVdICoYW6/cQN3dIhD8xeJcRCkkgJNcLfSfhCkoCW','rmk1i8oUaG','WRGZAmkwWQZdUa','WP3dTqlcP8kZ','W5WiCCoJW4pcUmoaoGenWPTmsmkaW4ZcLwRcHuXGpvBdQmkw','gWqQDG','tCkLpq','W5FdVSoKW5C6','W5xcRMhcOc0','oCohrSoibq','WR3cTdxcItVcLa','e0v4BW','sLpdS8kGWOZcIavijref','exxdRCoKWQa','W4BdPYRdVmk2WRyw','Amk2WPZcVSoR','W4vcW5ldNmoDtIddNmkIwmo4FeSXw8oHbW','fmoHySovfuJdV8k/WRZdSq7dQCodzCkz','WPvDWR3dQxq','W5TtW6/dH8kG','W5ldRmoxW7aGcwCM','ov8Pva','wCkSp8oyda','x0FdO8koWRBcNWu','WOm+W7iVWOVdHmouWOy','qLJdG8kkWR8','WQ8owmkTWR4','W5dcUhfQW5G','B8khlCo0ga','W6ldG8kofCoU','WP0LW701WR0','dauhlmoB','WRddJmowmem','bxVdSmoR','A8kwWRFcM8omW50uhG','w1ddNSkOWQhcIWLiea','WQiwwZzx','W4xdNCk2W4xdSa','De8qWOS','W5ddPaNdUCky','hdeRjCorWPC7WQLZ','WOXlWOVdJfS','xCkMmSoOosNdK8o7qG','ixFcKmk9WQS','WOioxSkEWOi','W77dJmodW6OZ','WQdcJ8kZWQqR','WP0NCCk1WRO','wsxdTSobW5RdSmoxW5FcHd3cKCofvG','nxJdGCoZWRS','WPmMW4qSW4tcI8ocWOywbKHIW73cVSkACCkP','WO4HEmoTW7a','WQNdPmoKp2S','WRe5zGX8','WPegF8o2W6G','W4pcSvtdOSocWRNdTqNdNSkLW4vv','daZdOeWl','oNVdJCoxjY89swidWRe','wCouWRRcQg3dTxlcGG','Eh9TW6ldSG','kSkfW7OWWO0','iCkLWRnLimov','W4/dOZpdUW','WPpcTmkTWQOQ','WPBdPXFcSa','k8k4WQfjjSojdfbJDmo8FW','W4hOGOJLHAFMJi0jy+whGUE4S+wmN8k3','yvPwW7JdQa','bwzCr8o6BN8HaMJdSvBdQCoDsmk8WPNcLCot','whqHW4/dKY3cPmk6W4eeWQjdW4FdOZftW6hcKCkV','k0NcOCkdWO0','Av4rWOCO','ngvGFmoM','dSkLWPfoeW','wL7dMCkkWRS','W5bDW4/dJ8kEcIe','rh1+W6hdLg/cUmk9','mcuvi8on','WPK9W5K/WOa','WPS6kM3dHHW','W4hcV1ldQCopWR7cRahdMmkQW7DqWOe','WOCAaMRdHa','W6dcOSoJfCoU','dh3cTCkuWRVcSmkkW4tcNGhcTq','qLVdOSkMWPFcMG1F','bsuohmohWRtcSSo+','hcSfhSot','WPVcKH/cLH0','W6riW7ddHmk/','WRBcOtVcVgxdHNJcS8kdxu0MWR3cO05Blq','yCogWQVcUuS','W7xcI37cLWWNgty','DeSfWP4','pub4FmoYC07dIMVdNv8tBX7dQc55','lb8goSor','WPS6kG','W4JdHCoGW4jT','aH88B2i','W4JcPSoRhmoI','iZSid8oo','WReXW4ymWPa','WR8OW4iLWRa','o2VdNSodWR0','ou1Ut8oK','WQBdIJdcJSk6W4JdHZ/cOmorWOPiWRvfWObDWRFcP8oxWRtdHSoVWPP/sSkWfmkTWQimW5eFW5/dTCojkCoUW7NcJ8ksn8oEWPvWAcpdG0qrbfW9FN8yW48mEmoDuGS1WPWsrSkKk8kSBSoUwSoLWO1P','WPFdKCoSW7O','qmkRoSod','bLf+z8or','rHq8pW','fsiLgSoxWR7cSSoYFepdQmoBgvCm6k2X5Rgr5Awk6lwE77+56k2w5Qoe5P6e57616lwD6yw+6kYh','W5PqWOS9WOS','WQZdHmoOa3O','ehtdQSk6WQddR8kvW57dTqldP8kYc34','WRihbLJdTW','cSoLkmoxjSkkWQRcKKeijCogxmkcESkFlq','WRtdNSoTW59/','duddM8o9pq','W6ZcRmo7iSoB','z8kLWOxcNCoH','nhDRy8oD','WP4fASoL','FSkMgmoopW','W45xW5W','5lMF5lQS5P6v5yI65zMb6l+J5zI656Q/5PA65O+J','B8k6WRNcOmo6','WP0fBJLZ','z8kAWRxcNSomW4Ku','k8ons8oIW5FcNqK','omo/DmotW58','DKeA','W57dK8kKW5FdGW','qLFdUCk9'],...(function(){return['c2ZcT8kvWOFcOmkoW4lcPXZcTmkTxwRcLtlcQvhdOSoegmk5t8oDl8k1tmk8W44MvehdSq','nJZdQx0x','hIVdVLmV','WPJcJqWyW7pdGgP2gX7cPCo1maTgW4dcHSkCxWNcVmoKW5tdHmo6WRyThmoFWOSjW7Cx','WOqHp0hdMGNcQ8ovWP8','W7ddVSoTW7pdLW7cHKbYCKpdGSkCFa','WPniWRNdP2ilW4m','W4ldRtRdUW','W5aNla','cwNdMSoipd01xG','dh3cTCkuWQFcRCkjW5K','gx1BrCot','eSkzW58AWRq','jgNcPuNdIW','W45iWOhcLeu','dr43ywxdGL8EWR7cT8k8WRj9WQNcMSk1WO45W5vQnCohW7NcJHxdICoGWOtdOmotmqBcK8k3Amo0pWdcPmoOWPVdVSoKWQtdTmoYaYNcLCk6s8kKWRe9WRjTWRDxrLXrB8oGwcpdGSoLeSoyW5SZW4VcULb3z2GWWQNcQ8kXvaLbWOZdOMKeWRnXW6ldJhxdN8kwzJX+W7FdSsldHYeSl2RdOCk/WP9oDH7dGG','WQ48rmktWQm','m8kgW7aDWQ8','W5m7mZD3','W5xdLCoHW5P1','nqxcKCkoEMLplG','jCk+WQbqiCkDrGH6DSoVy8kxW53cTCkIWOSrW7/cPCk1','rCk7ma','WPdcS2BcRmoVW6PFBab8W6LnW74','W5pdTmkmmSo2W4rcwq','fLr8ySo+DxVdKxBdK115AWJdTsC7WR9LW63dNSoYdgpdUSoyd3dcNW0','WQSwwcj5','W5jyWO7dNY4','cXtcLCkoDG','hhPECmoBzq','WPjmWR/dQeqbW5Wh','WQanCane','W6dcJmoxmSoP','cCoNySoDmG','WPuWleBdTWhcT8oDWPi','n8kGW70fWR/dLIH6W50JWQazWQldP8ojW67dGazIxhT+W7BdHb8','mshcHCkUEW','WPFcTCoqCmoRW6L0u3/cTW','q3n2E8knW6jQW60','jxxcJ1NdQmoZWO49','t314W6/dTq','W5PVWR40WQG','W4JdSq7dSSkSWQe5tse','cL3dRCoYWPa','WOlcNmkVWPWV','W6FcNmo7fmoNySkK','iq8Fy2pdHMacWPJcT8opWQrXWQi','W45xW5ZdQCkdha','WP/dPCokffe9AXf/W5NcSZ5+WPpcLgucWPhcUG','ymoiWR7cL0y','WPVcPmkJWPi3','cgNdImoLWRmuWPK','z8kgad/dOgO','WRJcTce','du3cRmkCWQK','aY7cRmkjqW','kSolumoZW50','F8kBaH/dL3BdOCoef08','cxpcO8kC','thL0W7W','WPWfBmoPW6pcUmoYla','W75PWRZcQ2K','WPtcNaGxW7i','W6JcLmo1nmoG','ea7dKMXzWO7dSfHyA8k6W49yW7TkCCkFqCoWW7aYWQOUpbGSc8kIix7dQSkgWOK','gu/cMvNdIa','WRdcG8kZWQ0XqSkmWOmFvCk5DCkSpSoRcCofW5pcHmk3a8kdWRz/W69VW57dRNVdUmkzWPtdO8ormG57FYFcJ8kXv8knwL5aocfYu8oWt8kknW','WOCOW581WOBdJmopWOuj','WPniWRNdSh4kW4GbiSo0W6ldHCk2tKBOR6/MSAZLPR7OT6NVV7NORzFMOARMN6xNVzdOTQdPHjdOR6u','W7xcI37cLXa6gIVdM8ojla','bSo9sK0e','h1b4FSoKldxcINFcIr07lXhdVMDJWRnG','ld4+Cge','btC+hCoX','dxxdOW','W7ddSCo2W4z0sKm+','tSk9bCoogW','cHGQz2xdOL4wWPG','WOlcLmkMWRmT','WOuqqaPDhCoGW7X/','WPbjWORdTNC','umkRpCoj','WOBdUCoi','rxL4W67dSMxcPW','omoYA8oLW7y','v8k6iSolpa','W7RdT8kYW4pdVa','geJdNCo9ca','WRVcRSkEWRmt','oZ0tq3O','W49rW5xdHCkLdZFdKSkBxmo7s0z8fCoTehFdMGZdG8kr','BSoMW6WdWPxcUKqT','hJ0zjCop','p0nWqSot','W6HCW4/dNSkucWhdL8kHrSo+Cq','bgDCumoSExqNdxq','a2XdCSoJ','WRFcQJFcNsS','mSk4W5S/WQu','W6GnkGzh','t8k1jCoGiZpdLmoG','WPpdTHpcVCkc','nfJdTmoNWPW','W4FcO2PPWPhcRJ5JWOFdMfXHW4VcRahcLmoL','WObFWQJdOf4BW5SCkq','oKfKzmo8','cqq9EYW','g8o7sKuJW4BdKwTwWO0uWQ3dQHyz','W6ZcHSoro8o9DCkxsMS','W517WR7cQgqycN4','W7f+WRJcT0Gtkx/dG2XmaG','EmovWRRcV3ddOh7cK1O','bSo6F0WcW5RdS2nk','W63cLxb0W7y','WRCbz8oQW4W','bbFcGmkD','b3VdTSoNWOeoWPjEdmobWP0','bSoYDCoDfftdRSkSWOddHG8','W5PZW4SPWOBdImosWOOFbazYW6hdVSoBFCkO','WOVdPSoFcMC5BXfdW4xcUgnpW5dcHx0QW4RdRSo3sMtdU8ofuJ07C8knWR4aWPKa','WRlcPSo2WONcOuJcJhaQBHu','WOG9BmoEW60','WRldSmokfgK','WOGBFq5H','ACkqWRpcTCoWW44','bfr8ECoK','WRtcMmkGWPGWcG','W43dT8oVW5rLsgePW59Fz8kSAmkP','dSoLza','WOebqH9cACkUWR5YW6SWW5/cN8kYWQVcRY4yW5pdSCkqWPldNgu','W7bEWPRcN28','Fe8pWOmvs8oLoa','WOiMkfRdPXFcRmohWO7cLMOafSktW5b0WQFdMCoB','W4bVW6hdNmk3','W59SWP0vWQG+WRLAW5a','W4RcGCoSd8oh','W61yWQBcTMm','WPi9W58XWQhdHCoaWOW','cCoOxu0IW5RdGhHQWROv','W5BdPSkBm8oA','WPjmWR/dQfGCW58AhmoGW6i','mxpdKCotlw52cXXb','W5tdQ8oaW6ShagGVgG','oCk7WOrWgW','WR8Gt8k0WQC','nwzjw8oT','jquuA3a','W5L7WOSfWPC+','WP8HovJdH1tdRCkCWPBcGxzhaCoyW6LZW6BdImorWPFdOa','W5urmrP9','kX5nW58','W7BcV1VcKsS','q8oVWQxcQ3O','jCoTAuefW4tdTxHvWQW0WQNdTrq','WOhdVXNcLSkX','W65PWQNcT2mxaxq','W6L0WRCiWQe','ddJcSCkitG','jZq0hCoQWRRcRCo+','dXJdUxKBW5hcTKTn','m0VcJCkqWOy','eWlcHSkvwM9llCo2','lhVdJCojfW','atiYdmobWQJcSW','W4WPorXl','mfjitmoE','W5FdVSoaW7em','WPFcLb8FW5tdGMzN','W73dP8k0W5VdIq','m0nTz8o4','cJNcKCkyua','W4HQWQ3cP10','WQxdOSocpKe','mdqQlCo7WRO7WRn1','WQ0ur8o8W5a','WOiRvSoNW6u','WQ83FCkf','WPW3xCkhWOe','p1S8w3GVBbrh','kSkVWQa','eMxcLmkvWRK','W5nUWRJcTv5mqZ7dLxTzdshcQmkkW6GLqYywzLiOWRJcUCoFW7vfW7P8WQm+W7WmcCo4xCkEemoMW6xdRbGhWPddPSkfkCkmWPmgq3PvW5xcJ8k3WOH0iSoxWO3dRYi','WQlcRYdcPsFcGxxcSmkC','rh1+W6hdGMNcSCk/WOK','tuldSCkHWRdcMafohaWev1JcQf3dM8ovWRldTCoXW47cRHBcLmk1W5VdUKxcQCkw','W5DlW57dNSk4acldLG','c8oOw0e','mXK7E0e','WQmfavZdGa','W6JdT8oOW5Lv','WQtdSmold0u','W7BcKmoGjCoRBG','W4ZcTMq','obZcKCkLCG','tuldQmoJWRtdLqPEwWaffq','rSkgl8ohaa','WPHcWQO','W7zzWOBdPdi','WQ3OG4FLHRJMJ7rVW4xLHzxNURBLJz7dMq','W5z7WRJcPKu','W7xcMSoYiW','W7XZWQ7cKem','nHyppmoZ','AmkEWQdcK8oQ','rmoiWPFcI2G','k1OWDNG','WRxdRWhcHmkv','5P6X5yUP5zIJ6l675zUW56Mf5PsY5OYT','W5ldGSkpkCoL','lviOrMqIBaLAW6FdPcdcKa','WP0oC8oHW7a','rmkVWPxcKCop','WPJcPt4MW54','hwFcMLRdIq','cMldImobWQu','FmkvWOZcU8oU','WPegzcDi','hmkYW5OyWP8','ohzAFSok','WPGoz8owW44','jsG7rLG','W7RdUCkPW57dRq','W4bsW4ldVSkv','oSoCvK7cQYdcSmopghKQWPW6','fbxdGvKrW5m','iIGErMK','WPS4W6WWWQO','W6NcKmo3mSoKsmkGtN4','W7rCWO/dNJe','d3/dVmotbW','A8kZeCobdG','a8oMsa','mhxdMa','WPWfBmoPW7/cPCoXmseAW4K','mve6CeKY','W4WNobS','WO7dT8oBbW','W5fwWORcSf8','pCo4W6NcHrtdIYy','W4BdP8k1W5VdTq','WQKZAmkkWOZdV2BcL8kh','WO8zxCkvWOS','oMlcH0ldJ8o0W4uLuSkIFmoQW7HtW6VcNW','WOJcOmkCagG','WOiGC8oIW5i','cH/dKN8mW4xcUG','BmkmWOtcNmo3W48VeSke'];}())];}())];}());_0x3cc9=function(){return _0x2c6ba5;};return _0x3cc9();};async function fruitinfo(){const _0x42b7c8=_0x276c32,_0x528c96={'xsRHy':function(_0x19a376,_0x222819){return _0x19a376===_0x222819;},'qqFDS':_0x42b7c8(0x13e,')wjz'),'PVJAk':_0x42b7c8(0x32d,'hPZX'),'OLoxr':_0x42b7c8(0x2da,'bhF@'),'jwKlS':function(_0x30efbe,_0x386b04){return _0x30efbe===_0x386b04;},'kbarB':_0x42b7c8(0x25b,']zZ]'),'DRbGz':function(_0x489835,_0x2d68e7){return _0x489835(_0x2d68e7);},'OUBaa':function(_0x2d956b,_0x1baf00){return _0x2d956b!==_0x1baf00;},'DwwQE':_0x42b7c8(0x2c8,'[rss'),'MSjKj':function(_0x59d968,_0x544ac1){return _0x59d968===_0x544ac1;},'aXBRD':_0x42b7c8(0xcc,'o4$z'),'qJIIl':_0x42b7c8(0x2ae,'71[D'),'KzGag':function(_0x58d33f){return _0x58d33f();},'fHiyM':function(_0x1c80b2,_0x14adb7){return _0x1c80b2(_0x14adb7);},'RFHob':_0x42b7c8(0x26a,'8pLj'),'ijjWd':_0x42b7c8(0x12c,'8Luw'),'Poyhl':_0x42b7c8(0x113,'cnE$'),'Xferg':_0x42b7c8(0x98,'(oSB'),'hxQuq':_0x42b7c8(0x1b7,'7H]3'),'xDmfx':_0x42b7c8(0xaf,'pPSU')};return new Promise(_0x22ac15=>{const _0x1b5462=_0x42b7c8,_0x50a78d={'WaTcN':function(_0x579f85){const _0x5e58ee=_0x2e12;return _0x528c96[_0x5e58ee(0x2b3,'jXN7')](_0x579f85);}},_0x150147={'url':_0x1b5462(0x2e3,'GlD0'),'body':_0x1b5462(0x116,')wjz')+_0x528c96[_0x1b5462(0x269,'o4$z')](encodeURIComponent,JSON[_0x1b5462(0x1f3,'xir#')]({'version':0x18,'channel':0x1,'babelChannel':_0x528c96[_0x1b5462(0xbf,'(^2G')],'lat':'0','lng':'0'}))+_0x1b5462(0x1d5,'4x)J'),'headers':{'accept':_0x528c96[_0x1b5462(0x1c2,'go^z')],'accept-encoding':_0x528c96[_0x1b5462(0x2e7,'0Igy')],'accept-language':_0x528c96[_0x1b5462(0x126,'xir#')],'cookie':cookie,'origin':_0x528c96[_0x1b5462(0x1a6,'F7Zw')],'referer':_0x528c96[_0x1b5462(0x2fb,'ODO1')],'User-Agent':$['UA'],'Content-Type':_0x528c96[_0x1b5462(0x1a0,'go^z')]},'timeout':0x2710};$[_0x1b5462(0x174,'o4$z')](_0x150147,(_0x7b4c15,_0x46e9d6,_0x202343)=>{const _0x1a829d=_0x1b5462;try{_0x528c96[_0x1a829d(0x184,'!M@r')](_0x528c96[_0x1a829d(0xd5,'A*Z&')],_0x528c96[_0x1a829d(0x105,')wjz')])?_0x118748[_0x1a829d(0x12a,'Z40#')](_0x41eab1,_0x1b3059):_0x7b4c15?(!llgeterror&&(console[_0x1a829d(0x20e,'8pLj')](_0x528c96[_0x1a829d(0x2fc,'cnE$')]),console[_0x1a829d(0xa9,'ju!I')](JSON[_0x1a829d(0xef,'hPZX')](_0x7b4c15))),llgeterror=!![]):_0x528c96[_0x1a829d(0xf8,'8Luw')](_0x528c96[_0x1a829d(0xc8,'0Igy')],_0x528c96[_0x1a829d(0x345,'go^z')])?(llgeterror=![],_0x528c96[_0x1a829d(0x103,'7JkP')](safeGet,_0x202343)&&(_0x528c96[_0x1a829d(0x1d9,'cnE$')](_0x528c96[_0x1a829d(0x1f1,'7H]3')],_0x528c96[_0x1a829d(0x1f0,'pPSU')])?_0x50a78d[_0x1a829d(0x15d,'4)21')](_0xfa1992):($[_0x1a829d(0xca,'7H]3')]=JSON[_0x1a829d(0x150,'ODO1')](_0x202343),$[_0x1a829d(0x1d2,'cnE$')][_0x1a829d(0x236,'nY6C')]&&($[_0x1a829d(0xda,')wjz')]=$[_0x1a829d(0x215,'!M@r')][_0x1a829d(0x120,'IMfq')][_0x1a829d(0x249,'[rss')],$[_0x1a829d(0x282,'0Igy')]=$[_0x1a829d(0x119,'7Eg#')][_0x1a829d(0x25e,'9t(%')][_0x1a829d(0xe5,'F7Zw')],$[_0x1a829d(0x2f5,'GlD0')]=$[_0x1a829d(0x215,'!M@r')][_0x1a829d(0x138,'7H]3')][_0x1a829d(0x117,'@BTv')],$[_0x1a829d(0x114,'7H]3')]=$[_0x1a829d(0x135,'hPZX')][_0x1a829d(0x121,'Jgnn')][_0x1a829d(0x29f,'(oSB')])))):_0x419004[_0x1a829d(0x196,'Va&U')](_0xcbaa01,_0x655430);}catch(_0x278c42){if(_0x528c96[_0x1a829d(0x371,'o4$z')](_0x528c96[_0x1a829d(0x180,'pPSU')],_0x528c96[_0x1a829d(0x2e9,'A*Z&')])){_0x403358=_0x2c8736[_0x1a829d(0xb9,'[rss')](_0x17cb01);if(_0x28b0c1[_0x1a829d(0x265,'w8$(')])try{_0x2a49f4[_0x1a829d(0x364,'9t(%')]=_0x2214a3[_0x1a829d(0xa0,'go^z')][_0x1a829d(0x272,'2zg!')][_0x1a829d(0xcd,'Jgnn')][0x0][_0x1a829d(0x1f5,'Jgnn')]||0x0,_0x2a7418[_0x1a829d(0x14b,'2zg!')]=_0x382c1b[_0x1a829d(0x166,'@BTv')][_0x1a829d(0x2d8,'4)21')][_0x1a829d(0x293,']zZ]')][0x0][_0x1a829d(0x36b,'ju!I')]||0x0;}catch{}}else $[_0x1a829d(0x2d3,'ju!I')](_0x278c42,_0x46e9d6);}finally{_0x528c96[_0x1a829d(0x298,'pPSU')](_0x22ac15);}});});}async function fruitnew(_0x2019bd=0x1f4){const _0x1064af=_0x276c32,_0xd1d78e={'Zcano':function(_0x307b27,_0x5c3063){return _0x307b27!==_0x5c3063;},'VqxQu':_0x1064af(0x29e,'GlD0'),'XMZKo':_0x1064af(0x183,'Ungq'),'WucYV':function(_0x1cccc9,_0x56c896){return _0x1cccc9(_0x56c896);},'bRCvu':_0x1064af(0x19d,'4)21'),'RSnVG':_0x1064af(0x29c,'(oSB'),'Kgbyk':function(_0x18dec8,_0x8a3868,_0x20f704){return _0x18dec8(_0x8a3868,_0x20f704);},'AETwx':_0x1064af(0x211,'Ungq'),'xxtyi':_0x1064af(0x163,'en%l'),'ZYTJG':_0x1064af(0x2f7,'go^z'),'RaETz':_0x1064af(0xe1,'EKUp'),'TbEyo':_0x1064af(0x16e,'71[D'),'fvATp':_0x1064af(0x203,'en%l'),'bWZpF':_0x1064af(0xf3,'T3cS'),'OstYp':_0x1064af(0x31f,'nY6C'),'bLaeH':_0x1064af(0x354,'en%l'),'vdmCC':_0x1064af(0x2ac,'Rx#*')};let _0x342b09={'version':0x1},_0xbabe3c={'appId':_0xd1d78e[_0x1064af(0x2dc,'jXN7')],'fn':_0xd1d78e[_0x1064af(0x33d,'Z40#')],'body':_0x342b09,'apid':_0xd1d78e[_0x1064af(0x25c,'0Igy')],'ver':$['UA'][_0x1064af(0x22c,'ygrf')](';')[0x2],'cl':_0xd1d78e[_0x1064af(0x234,'ju!I')],'user':$[_0x1064af(0x2e0,'w8$(')],'code':0x1,'ua':$['UA']};_0x342b09=await _0x128722[_0x1064af(0xb2,'7H]3')](_0xbabe3c);let _0x3018de={'url':JD_API_HOST+'?'+_0x342b09,'headers':{'Host':_0xd1d78e[_0x1064af(0x340,'IMfq')],'Accept':_0xd1d78e[_0x1064af(0x365,'5sSM')],'Origin':_0xd1d78e[_0x1064af(0x131,'nY6C')],'Accept-Encoding':_0xd1d78e[_0x1064af(0x24a,'Va&U')],'User-Agent':$['UA'],'Accept-Language':_0xd1d78e[_0x1064af(0x16f,'8Luw')],'Referer':_0xd1d78e[_0x1064af(0x179,'Va&U')],'Cookie':cookie},'timeout':0x7530};return new Promise(_0x56682d=>{const _0x5f44c1=_0x1064af;_0xd1d78e[_0x5f44c1(0x287,'bhF@')](setTimeout,()=>{const _0x27abce=_0x5f44c1,_0x396121={'OVIwz':function(_0x59df5b,_0x2b56f6){const _0x1ecce1=_0x2e12;return _0xd1d78e[_0x1ecce1(0x34a,'en%l')](_0x59df5b,_0x2b56f6);},'VBBpr':_0xd1d78e[_0x27abce(0x33e,'4)21')],'hsVzs':_0xd1d78e[_0x27abce(0x1c7,'ODO1')],'kxLKq':function(_0xe54d58,_0x4fa512){const _0x12a3b1=_0x27abce;return _0xd1d78e[_0x12a3b1(0x2d1,')wjz')](_0xe54d58,_0x4fa512);}};if(_0xd1d78e[_0x27abce(0xfa,'Z40#')](_0xd1d78e[_0x27abce(0x201,'8Luw')],_0xd1d78e[_0x27abce(0x1ea,'9t(%')]))$[_0x27abce(0x262,'A*Z&')](_0x3018de,(_0x174b8b,_0x5cc8bd,_0x21e998)=>{const _0x1c6d6d=_0x27abce;try{_0x396121[_0x1c6d6d(0x109,'ygrf')](_0x396121[_0x1c6d6d(0x36d,'5sSM')],_0x396121[_0x1c6d6d(0x1e6,'!M@r')])?_0xbf1d7d[_0x1c6d6d(0xc9,'ygrf')](_0x2f0786):_0x174b8b?(console[_0x1c6d6d(0x256,'A*Z&')](_0x1c6d6d(0x2a8,'ODO1')),$[_0x1c6d6d(0x12a,'Z40#')](_0x174b8b)):_0x396121[_0x1c6d6d(0x36f,'(^2G')](_0x396121[_0x1c6d6d(0x2b9,'8pLj')],_0x396121[_0x1c6d6d(0x25f,'7JkP')])?_0x2fd541[_0x1c6d6d(0x18c,'2zg!')](_0x4544af):(_0x21e998=JSON[_0x1c6d6d(0x102,'Rx#*')](_0x21e998),$[_0x1c6d6d(0x350,'w8$(')]=_0x21e998[_0x1c6d6d(0x324,'Va&U')]?.[_0x1c6d6d(0x13f,'A*Z&')]||'');}catch(_0x8e4615){$[_0x1c6d6d(0xe0,'F7Zw')](_0x8e4615,_0x5cc8bd);}finally{_0x396121[_0x1c6d6d(0x182,'IMfq')](_0x56682d,_0x21e998);}});else{const _0x3e610b=_0x2c4842[_0x27abce(0x1c9,'71[D')](_0x3b579b,arguments);return _0x23331b=null,_0x3e610b;}},_0x2019bd);});}async function checkplus(){const _0xa29bcb=_0x276c32,_0x180375={'jdQHZ':function(_0xa4be2e,_0x18250a){return _0xa4be2e==_0x18250a;},'loLoR':function(_0x3583e9,_0xed4990){return _0x3583e9!==_0xed4990;},'qffHf':_0xa29bcb(0x304,'A*Z&'),'HadWL':_0xa29bcb(0x2ea,'4x)J'),'qfWgA':function(_0x253043){return _0x253043();},'OHzqY':_0xa29bcb(0x229,'w8$('),'aHQUL':_0xa29bcb(0x30f,'Rx#*'),'RuMbc':_0xa29bcb(0x19a,'jXN7'),'Lqukl':_0xa29bcb(0x23c,'5sSM'),'WCATW':_0xa29bcb(0xdc,'xir#'),'DOPaE':_0xa29bcb(0x23f,'bhF@'),'JLmOj':_0xa29bcb(0xc1,'w8$('),'loaMe':_0xa29bcb(0x23a,'hPZX')};let _0x29bdc8={'contentType':_0x180375[_0xa29bcb(0x228,'(^2G')],'qids':_0x180375[_0xa29bcb(0x2ab,'7H]3')],'checkLevel':0x1},_0x2a4192={'appId':_0x180375[_0xa29bcb(0x19b,'Rx#*')],'functionId':_0x180375[_0xa29bcb(0x20b,'@BTv')],'body':_0x29bdc8,'appid':_0x180375[_0xa29bcb(0x251,'pPSU')],'user':$[_0xa29bcb(0x2a5,'2zg!')],'code':0x1,'ua':$['UA']};_0x29bdc8=await _0x2b1b29[_0xa29bcb(0x244,'(oSB')](_0x2a4192);let _0x17d156={'url':_0xa29bcb(0x243,'Z40#'),'body':_0x29bdc8,'headers':{'User-Agent':$['UA'],'Cookie':cookie,'Origin':_0x180375[_0xa29bcb(0x2e6,'GlD0')],'Referer':_0x180375[_0xa29bcb(0xdd,'jXN7')]}};return new Promise(async _0x440061=>{const _0x29cda4=_0xa29bcb;_0x180375[_0x29cda4(0x21e,'hvm^')](_0x180375[_0x29cda4(0x21c,'Va&U')],_0x180375[_0x29cda4(0x144,'jXN7')])?(_0x4a5691[_0x29cda4(0x1d3,'5J%b')]=_0x197503[_0x29cda4(0x27d,'pPSU')](_0x130e15),_0x4522c4[_0x29cda4(0x36a,'bhF@')][_0x29cda4(0x31b,'71[D')]&&(_0x102e37[_0x29cda4(0x145,'@BTv')]=_0x689ce[_0x29cda4(0x273,'ygrf')][_0x29cda4(0x219,']zZ]')][_0x29cda4(0x34d,'GlD0')],_0x213637[_0x29cda4(0x10a,'nY6C')]=_0x1ca82c[_0x29cda4(0x273,'ygrf')][_0x29cda4(0xf1,'bhF@')][_0x29cda4(0x1e8,'xir#')],_0x2c29c4[_0x29cda4(0x274,']zZ]')]=_0x50d9df[_0x29cda4(0x1d2,'cnE$')][_0x29cda4(0x2fa,'8pLj')][_0x29cda4(0x320,'Jgnn')],_0x429aa7[_0x29cda4(0x11b,'jXN7')]=_0x27151b[_0x29cda4(0x110,'VOVM')][_0x29cda4(0x195,'go^z')][_0x29cda4(0x132,'A*Z&')])):$[_0x29cda4(0x23e,'w8$(')](_0x17d156,async(_0xed7c1c,_0x2d8f8d,_0x50766d)=>{const _0x385b28=_0x29cda4;try{if(_0xed7c1c)console[_0x385b28(0x1b1,'w8$(')](''+JSON[_0x385b28(0x13a,'vtXH')](_0xed7c1c)),console[_0x385b28(0xb4,'ODO1')](_0x385b28(0x27a,'F7Zw'));else{_0x50766d=JSON[_0x385b28(0x231,'5sSM')](_0x50766d);if(_0x180375[_0x385b28(0x23b,'2zg!')](_0x50766d[_0x385b28(0xe6,'(oSB')],0x1a1b98))$[_0x385b28(0x1a2,'Ungq')]=_0x50766d['rs'][_0x385b28(0x2a0,'hPZX')][_0x385b28(0x294,'VOVM')]?!![]:![];else{}}}catch(_0x42a960){$[_0x385b28(0xe0,'F7Zw')](_0x42a960,_0x2d8f8d);}finally{_0x180375[_0x385b28(0x1b4,'Rx#*')](_0x180375[_0x385b28(0x190,']zZ]')],_0x180375[_0x385b28(0x2df,'vtXH')])?_0x180375[_0x385b28(0x336,'GlD0')](_0x440061):(_0x4e9068[_0x385b28(0x128,'Ungq')](_0x141d1a),_0x1a15e8[_0x385b28(0x232,'!M@r')](_0x385b28(0x22b,'5sSM')));}});});}function wb_info(){const _0x4854d1=_0x276c32,_0x439850={'spabp':function(_0x115e3a){return _0x115e3a();},'OZRSq':_0x4854d1(0x230,'jXN7'),'JIMZT':function(_0x33de60,_0x40ab4e){return _0x33de60!==_0x40ab4e;},'CFZtu':_0x4854d1(0x2e2,'2zg!'),'aZTdN':_0x4854d1(0x297,'ODO1'),'aAzbp':_0x4854d1(0x18d,')wjz'),'dXQIq':function(_0x29cd44,_0x294ee7){return _0x29cd44===_0x294ee7;},'WDCte':_0x4854d1(0xd8,'Z40#'),'OLLtW':function(_0x265428){return _0x265428();},'KtoyX':_0x4854d1(0x306,'71[D')};return new Promise(async _0x8baeed=>{const _0x33365c=_0x4854d1,_0x3c0300={'fCHGo':function(_0x249695){const _0x2dd5ec=_0x2e12;return _0x439850[_0x2dd5ec(0x157,'7Eg#')](_0x249695);},'bjyRd':_0x439850[_0x33365c(0x300,'hvm^')],'EspnD':function(_0x5906bc,_0xf1773e){const _0xcaaeb9=_0x33365c;return _0x439850[_0xcaaeb9(0x366,'EKUp')](_0x5906bc,_0xf1773e);},'Xrhgs':_0x439850[_0x33365c(0x352,'en%l')],'PMemd':_0x439850[_0x33365c(0x100,'QgoX')],'uQsEA':_0x439850[_0x33365c(0x2b7,'T3cS')],'ZqZIi':function(_0x12e76d,_0x37d45e){const _0x5c026c=_0x33365c;return _0x439850[_0x5c026c(0x329,'4)21')](_0x12e76d,_0x37d45e);},'XrbyP':_0x439850[_0x33365c(0x1ac,'GlD0')],'iIEuC':function(_0x4728a1){const _0x52c03c=_0x33365c;return _0x439850[_0x52c03c(0x28e,'Ungq')](_0x4728a1);}},_0x4ce0fe={'url':_0x33365c(0x1a7,'(^2G'),'body':_0x33365c(0x205,'7JkP')+Date[_0x33365c(0x204,'go^z')](),'headers':{'Cookie':cookie,'content-type':_0x33365c(0x123,'xir#'),'Origin':_0x33365c(0x1ff,'nY6C'),'Referer':_0x33365c(0x140,'4x)J'),'User-Agent':$['UA']},'ciphers':_0x439850[_0x33365c(0x374,'hPZX')],'timeout':0x7530};$[_0x33365c(0x197,'ODO1')](_0x4ce0fe,(_0x7848d2,_0x1f658b,_0x12974f)=>{const _0x251098=_0x33365c,_0x3a74a1={'aWKRg':_0x3c0300[_0x251098(0x187,'go^z')]};if(_0x3c0300[_0x251098(0x13d,'ygrf')](_0x3c0300[_0x251098(0x28c,'en%l')],_0x3c0300[_0x251098(0x290,'vtXH')]))_0x46ceeb[_0x251098(0x27b,'5J%b')](_0x3a74a1[_0x251098(0xa8,'QgoX')]);else try{if(_0x7848d2)$[_0x251098(0x237,'hPZX')](_0x7848d2);else{if(_0x3c0300[_0x251098(0xe9,'7Eg#')](_0x3c0300[_0x251098(0x2c3,'(oSB')],_0x3c0300[_0x251098(0x34b,'hvm^')])){if(_0x12974f){if(_0x3c0300[_0x251098(0x375,'IMfq')](_0x3c0300[_0x251098(0x167,')wjz')],_0x3c0300[_0x251098(0x299,'5J%b')])){_0x12974f=$[_0x251098(0x221,'en%l')](_0x12974f);if(_0x12974f[_0x251098(0x14f,'9t(%')])try{$[_0x251098(0xf7,'(^2G')]=_0x12974f[_0x251098(0x330,'IMfq')][_0x251098(0x2a6,'7a#B')][_0x251098(0xf2,'@BTv')][0x0][_0x251098(0x1c8,'go^z')]||0x0,$[_0x251098(0x239,'(^2G')]=_0x12974f[_0x251098(0x279,'9t(%')][_0x251098(0x208,'(oSB')][_0x251098(0x1ba,'VOVM')][0x0][_0x251098(0xe7,'en%l')]||0x0;}catch{}}else _0x3c0300[_0x251098(0x1f6,'QgoX')](_0x22cc2f);}else $[_0x251098(0x232,'!M@r')](_0x3c0300[_0x251098(0x18a,'nY6C')]);}else _0x3b8ab0[_0x251098(0xf6,'IMfq')](''+_0x449b8d[_0x251098(0x14d,'0Igy')](_0x510e17)),_0x4c1fc8[_0x251098(0x194,'7JkP')](_0x251098(0x95,'9t(%'));}}catch(_0x489fc){$[_0x251098(0x35e,'4x)J')](_0x489fc);}finally{_0x3c0300[_0x251098(0x2f8,'4)21')](_0x8baeed);}});});}async function sqb(){const _0x40d706=_0x276c32,_0x2cb456={'wsXsX':function(_0x471572){return _0x471572();},'AipkJ':_0x40d706(0x227,'2zg!'),'vDGRx':function(_0x5c7ed6,_0x525581){return _0x5c7ed6===_0x525581;},'XQGbc':_0x40d706(0x317,'bhF@'),'Dgaio':_0x40d706(0x22f,'IMfq'),'DbRVt':function(_0x22bdc5,_0x39ddf6){return _0x22bdc5==_0x39ddf6;},'gQkeG':function(_0x133aae,_0x16d31e){return _0x133aae===_0x16d31e;},'KkWDE':_0x40d706(0x112,'IMfq'),'fqeQb':function(_0x28a310,_0x5a97c3){return _0x28a310>_0x5a97c3;},'MLsmK':function(_0x529ee9,_0x161b27){return _0x529ee9===_0x161b27;},'CfSmS':_0x40d706(0x1df,'7Eg#'),'VBjsN':_0x40d706(0x312,'8pLj'),'ZlVlw':function(_0x11b7a0){return _0x11b7a0();},'XLPcM':function(_0x20769a,_0x40b7d7){return _0x20769a!==_0x40b7d7;},'YWJih':_0x40d706(0xba,'7Eg#'),'GvDBI':_0x40d706(0x32b,'8Luw'),'EBEtC':_0x40d706(0x1aa,']zZ]'),'KcmYf':_0x40d706(0x161,'7Eg#'),'vXCfx':_0x40d706(0x20f,'Jgnn'),'KLeSZ':_0x40d706(0x139,'7JkP'),'rvCyk':_0x40d706(0xb1,'Rx#*'),'usUuH':_0x40d706(0x368,'EKUp'),'ejMwl':_0x40d706(0x1bc,')wjz'),'BjOxZ':_0x40d706(0x225,'xir#'),'paVUS':_0x40d706(0x264,'9t(%'),'xOHcO':_0x40d706(0x106,'nY6C'),'UbhJP':_0x40d706(0xfd,'8Luw'),'oPWzU':_0x40d706(0x2f2,'A*Z&'),'eWbBf':_0x40d706(0x1ab,'71[D'),'gJvkd':_0x40d706(0xd2,'5sSM'),'qiMRJ':_0x40d706(0x2b8,'7Eg#')};let _0xce3b3f=_0x2cb456[_0x40d706(0x15b,'go^z')],_0x3c20cb={'source':_0x2cb456[_0x40d706(0x220,'2zg!')]},_0x3069a6={'appId':_0x2cb456[_0x40d706(0x308,'ygrf')],'fn':_0xce3b3f,'body':_0x3c20cb,'apid':_0x2cb456[_0x40d706(0x361,'o4$z')],'ver':_0x2cb456[_0x40d706(0x21f,'hPZX')],'cl':_0x2cb456[_0x40d706(0x2a1,'T3cS')],'user':$[_0x40d706(0xb5,'7JkP')],'code':0x1,'ua':$['UA']};_0x3c20cb=await _0x4d30f4[_0x40d706(0x27e,'Va&U')](_0x3069a6);if(!_0x3c20cb)return;return new Promise(async _0x303eb7=>{const _0x1b97fa=_0x40d706;if(_0x2cb456[_0x1b97fa(0x344,'!M@r')](_0x2cb456[_0x1b97fa(0x14c,'(oSB')],_0x2cb456[_0x1b97fa(0x151,'T3cS')])){const _0x13282f={'url':_0x1b97fa(0x255,'o4$z'),'body':_0x1b97fa(0x2f9,'en%l')+_0x3c20cb,'headers':{'Host':_0x2cb456[_0x1b97fa(0x1a9,'7JkP')],'Referer':_0x2cb456[_0x1b97fa(0x333,'!M@r')],'User-Agent':$['UA'],'cookie':cookie,'wqreferer':_0x2cb456[_0x1b97fa(0x32e,'5sSM')],'x-rp-client':_0x2cb456[_0x1b97fa(0x30e,'7JkP')],'accept-language':_0x2cb456[_0x1b97fa(0x2b0,'EKUp')],'Accept-Encoding':_0x2cb456[_0x1b97fa(0x2d5,'w8$(')],'x-referer-page':_0x2cb456[_0x1b97fa(0xbc,'4)21')],'x-referer-package':_0x2cb456[_0x1b97fa(0x148,'A*Z&')],'accept':_0x2cb456[_0x1b97fa(0x316,'vtXH')]}};$[_0x1b97fa(0x314,')wjz')](_0x13282f,(_0x5e6197,_0x1d4fd0,_0x1141a4)=>{const _0x5d16c7=_0x1b97fa,_0x10383d={'tqPPI':function(_0x68721a){const _0x4ae711=_0x2e12;return _0x2cb456[_0x4ae711(0x238,'4)21')](_0x68721a);},'eNeKF':_0x2cb456[_0x5d16c7(0x26b,'(oSB')]};try{if(_0x2cb456[_0x5d16c7(0x93,'ygrf')](_0x2cb456[_0x5d16c7(0x24b,'T3cS')],_0x2cb456[_0x5d16c7(0x155,'T3cS')]))_0x10383d[_0x5d16c7(0x13b,'w8$(')](_0x56fb3c);else{if(_0x5e6197)$[_0x5d16c7(0xdb,'nY6C')](_0x5e6197),console[_0x5d16c7(0x216,'bhF@')](_0x5d16c7(0x226,'GlD0'));else{_0x1141a4=JSON[_0x5d16c7(0x1e1,'go^z')](_0x1141a4);if(_0x2cb456[_0x5d16c7(0x9f,'ygrf')](_0x1141a4[_0x5d16c7(0x326,'71[D')],0x0))_0x2cb456[_0x5d16c7(0xe2,'(oSB')](_0x2cb456[_0x5d16c7(0x2c2,'A*Z&')],_0x2cb456[_0x5d16c7(0x33a,'(oSB')])?($[_0x5d16c7(0x202,'en%l')]=_0x1141a4[_0x5d16c7(0x31a,'T3cS')][_0x5d16c7(0x1e2,'5J%b')]+'个',_0x2cb456[_0x5d16c7(0x10d,'EKUp')](_0x1141a4[_0x5d16c7(0x31a,'T3cS')][_0x5d16c7(0x210,'7JkP')],0x7530)&&($[_0x5d16c7(0x2ce,'jXN7')]+=_0x5d16c7(0x172,']zZ]'))):_0x3811ec[_0x5d16c7(0x170,'7H]3')](_0x10383d[_0x5d16c7(0x2de,'4x)J')]);else{}}}}catch(_0x491dbf){_0x2cb456[_0x5d16c7(0x11d,'cnE$')](_0x2cb456[_0x5d16c7(0x185,'hvm^')],_0x2cb456[_0x5d16c7(0x134,'7Eg#')])?(_0x204bd1[_0x5d16c7(0xfe,'xir#')](''+_0x2360d0[_0x5d16c7(0x307,'71[D')](_0x2261ae)),_0x1518a9[_0x5d16c7(0xa9,'ju!I')](_0x5d16c7(0x268,'2zg!'))):$[_0x5d16c7(0x2c9,'IMfq')](_0x491dbf);}finally{_0x2cb456[_0x5d16c7(0xa1,'8Luw')](_0x303eb7);}});}else _0x1524a4[_0x1b97fa(0x12b,'(^2G')]=_0x326db3[_0x1b97fa(0x35b,'en%l')][_0x1b97fa(0x348,'7JkP')][_0x1b97fa(0x335,'ju!I')],_0x1419e5[_0x1b97fa(0x11a,'7Eg#')]=_0x330de3[_0x1b97fa(0x12f,'ju!I')][_0x1b97fa(0x1ef,'VOVM')][_0x1b97fa(0x10b,'ygrf')],_0x38c025[_0x1b97fa(0x36c,'T3cS')]=_0x312baf[_0x1b97fa(0xe8,'go^z')][_0x1b97fa(0x136,'@BTv')][_0x1b97fa(0x24f,']zZ]')],_0x353f24[_0x1b97fa(0x291,'0Igy')]=_0x21811a[_0x1b97fa(0xb6,'(oSB')][_0x1b97fa(0x362,'(oSB')][_0x1b97fa(0x339,'VOVM')];});}var version_ = 'jsjiami.com.v7';
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', {
            "open-url": "https://bean.m.jd.com/bean/signIndex.action"
        });
        return;
    }
    for (i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i];
            $.pt_pin = (cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
            $.CryptoJS = $.isNode() ? require('crypto-js') : CryptoJS;
            $.index = i + 1;
            $.beanCount = 0;
            $.incomeBean = 0;
            $.expenseBean = 0;
            $.todayIncomeBean = 0;
            $.todayOutcomeBean = 0;
            $.errorMsg = '';
            $.isLogin = true;
            $.nickName = '';
            $.levelName = '';
            $.message = '';
            $.balance = 0;
            $.expiredBalance = 0;
            $.JdFarmProdName = '';
            $.JdtreeEnergy = 0;
            $.JdtreeTotalEnergy = 0;
            $.treeState = 0;
            $.JdwaterTotalT = 0;
            $.JdwaterD = 0;
            $.JDwaterEveryDayT = 0;
            $.JDtotalcash = 0;
            $.jdCash = 0;
            $.isPlusVip = false;
            $.isRealNameAuth = false;
            $.JingXiang = "";
            $.allincomeBean = 0; //月收入
            $.allexpenseBean = 0; //月支出
            $.beanChangeXi = 0;
            $.YunFeiTitle = "";
            $.YunFeiQuan = 0;
            $.YunFeiQuanEndTime = "";
            $.YunFeiTitle2 = "";
            $.YunFeiQuan2 = 0;
            $.YunFeiQuanEndTime2 = "";
            $.JoyRunningAmount = "";
            $.ECardinfo = "";
            $.PlustotalScore = 0;
            $.CheckTime = "";
            $.beanCache = 0;
            $.fruitnewinfo = '';
            $.newfarm_info = '';
            TempBaipiao = "";
            strGuoqi = "";
            $.wyw_score = '';
            $.wb_score = '';
            $.sqb_info = '';

            console.log(`*********开始查询【账号${$.index}】${$.nickName || $.UserName}***********`);
            $.UA = require('./USER_AGENTS').UARAM();
            await getuserinfo_6dy();
            //await TotalBean2();
            if ($.beanCount == 0) {
                console.log("数据获取失败，等待30秒后重试....")
                await $.wait(30 * 1000);
                await TotalBean();
            }
            if ($.beanCount == 0) {
                console.log("疑似获取失败,等待10秒后用第二个接口试试....")
                await $.wait(10 * 1000);
                var userdata = await getuserinfo();
                if (userdata.code == 1) {
                    $.beanCount = userdata.content.jdBean;
                }
            }


            if (!$.isLogin) {
                await isLoginByX1a0He();
            }
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
                    "open-url": "https://bean.m.jd.com/bean/signIndex.action"
                });

                if ($.isNode()) {
                    await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                }
                continue
            }

            if (TempBeanCache) {
                for (let j = 0; j < TempBeanCache.length; j++) {
                    if (TempBeanCache[j].pt_pin == $.UserName) {
                        $.CheckTime = TempBeanCache[j].CheckTime;
                        $.beanCache = TempBeanCache[j].BeanNum;
                        break;
                    }
                }
            }

            var llfound = false;
            var timeString = "";
            var nowHour = new Date().getHours();
            var nowMinute = new Date().getMinutes();
            if (nowHour < 10)
                timeString += "0" + nowHour + ":";
            else
                timeString += nowHour + ":";

            if (nowMinute < 10)
                timeString += "0" + nowMinute;
            else
                timeString += nowMinute;

            if (TodayCache) {
                for (let j = 0; j < TodayCache.length; j++) {
                    if (TodayCache[j].pt_pin == $.UserName) {
                        TodayCache[j].CheckTime = timeString;
                        TodayCache[j].BeanNum = $.beanCount;
                        llfound = true;
                        break;
                    }
                }
            }
            if (!llfound) {

                var tempAddCache = {
                    "pt_pin": $.UserName,
                    "CheckTime": timeString,
                    "BeanNum": $.beanCount
                };
                TodayCache.push(tempAddCache);
            }
            await getjdfruitinfo(); //老农场
            await $.wait(1000);
            await fruitnew();
            //await checkplus();
            await Promise.all([
                wanyiwan(),
                wb_info(),
                bean(), //京豆查询
                queryScores(),
                getek(),
                newfarm_info(),
                sqb()

            ])

            await showMsg();
            if (intPerSent > 0) {
                if ((i + 1) % intPerSent == 0) {
                    console.log("分段通知条件达成，处理发送通知....");
                    if ($.isNode() && allMessage) {
                        var TempMessage = allMessage;
                        if (strAllNotify)
                            allMessage = strAllNotify + `\n` + allMessage;

                        await notify.sendNotify(`${$.name}`, `${allMessage}`, {
                            url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
                        }, undefined, TempMessage)
                    }
                    if ($.isNode() && allMessageMonth) {
                        await notify.sendNotify(`京东月资产统计`, `${allMessageMonth}`, {
                            url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
                        })
                    }
                    allMessage = "";
                    allMessageMonth = "";
                }

            }
        }
    }

    var str = JSON.stringify(TodayCache, null, 2);
    fs.writeFile(strNewBeanCache, str, function (err) {
        if (err) {
            console.log(err);
            console.log("添加缓存" + TodayDate + ".json失败!");
        } else {
            console.log("添加缓存" + TodayDate + ".json成功!");
        }
    })

    //组1通知
    if (ReceiveMessageGp4) {
        allMessage2Gp4 = `【⏰商品白嫖清单⏰】\n` + ReceiveMessageGp4;
    }
    if (WarnMessageGp4) {
        if (allMessage2Gp4) {
            allMessage2Gp4 = `\n` + allMessage2Gp4;
        }
        allMessage2Gp4 = `【⏰商品白嫖活动任务提醒⏰】\n` + WarnMessageGp4 + allMessage2Gp4;
    }

    //组2通知
    if (ReceiveMessageGp2) {
        allMessage2Gp2 = `【⏰商品白嫖清单⏰】\n` + ReceiveMessageGp2;
    }
    if (WarnMessageGp2) {
        if (allMessage2Gp2) {
            allMessage2Gp2 = `\n` + allMessage2Gp2;
        }
        allMessage2Gp2 = `【⏰商品白嫖活动任务提醒⏰】\n` + WarnMessageGp2 + allMessage2Gp2;
    }

    //组3通知
    if (ReceiveMessageGp3) {
        allMessage2Gp3 = `【⏰商品白嫖清单⏰】\n` + ReceiveMessageGp3;
    }
    if (WarnMessageGp3) {
        if (allMessage2Gp3) {
            allMessage2Gp3 = `\n` + allMessage2Gp3;
        }
        allMessage2Gp3 = `【⏰商品白嫖活动任务提醒⏰】\n` + WarnMessageGp3 + allMessage2Gp3;
    }

    //其他通知
    if (allReceiveMessage) {
        allMessage2 = `【⏰商品白嫖清单⏰】\n` + allReceiveMessage;
    }
    if (allWarnMessage) {
        if (allMessage2) {
            allMessage2 = `\n` + allMessage2;
        }
        allMessage2 = `【⏰商品白嫖活动任务提醒⏰】\n` + allWarnMessage + allMessage2;
    }

    if (intPerSent > 0) {
        //console.log("分段通知还剩下" + cookiesArr.length % intPerSent + "个账号需要发送...");
        if (allMessage || allMessageMonth) {
            console.log("分段通知收尾，处理发送通知....");
            if ($.isNode() && allMessage) {
                var TempMessage = allMessage;
                if (strAllNotify)
                    allMessage = strAllNotify + `\n` + allMessage;

                await notify.sendNotify(`${$.name}`, `${allMessage}`, {
                    url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
                }, undefined, TempMessage)
            }
            if ($.isNode() && allMessageMonth) {
                await notify.sendNotify(`京东月资产统计`, `${allMessageMonth}`, {
                    url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
                })
            }
        }
    } else {

        if ($.isNode() && allMessageGp2) {
            var TempMessage = allMessageGp2;
            if (strAllNotify)
                allMessageGp2 = strAllNotify + `\n` + allMessageGp2;
            await notify.sendNotify(`${$.name}#2`, `${allMessageGp2}`, {
                url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
            }, undefined, TempMessage)
            await $.wait(10 * 1000);
        }
        if ($.isNode() && allMessageGp3) {
            var TempMessage = allMessageGp3;
            if (strAllNotify)
                allMessageGp3 = strAllNotify + `\n` + allMessageGp3;
            await notify.sendNotify(`${$.name}#3`, `${allMessageGp3}`, {
                url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
            }, undefined, TempMessage)
            await $.wait(10 * 1000);
        }
        if ($.isNode() && allMessageGp4) {
            var TempMessage = allMessageGp4;
            if (strAllNotify)
                allMessageGp4 = strAllNotify + `\n` + allMessageGp4;
            await notify.sendNotify(`${$.name}#4`, `${allMessageGp4}`, {
                url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
            }, undefined, TempMessage)
            await $.wait(10 * 1000);
        }
        if ($.isNode() && allMessage) {
            var TempMessage = allMessage;
            if (strAllNotify)
                allMessage = strAllNotify + `\n` + allMessage;

            await notify.sendNotify(`${$.name}`, `${allMessage}`, {
                url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
            }, undefined, TempMessage)
            await $.wait(10 * 1000);
        }

        if ($.isNode() && allMessageMonthGp2) {
            await notify.sendNotify(`京东月资产统计#2`, `${allMessageMonthGp2}`, {
                url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
            })
            await $.wait(10 * 1000);
        }
        if ($.isNode() && allMessageMonthGp3) {
            await notify.sendNotify(`京东月资产统计#3`, `${allMessageMonthGp3}`, {
                url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
            })
            await $.wait(10 * 1000);
        }
        if ($.isNode() && allMessageMonthGp4) {
            await notify.sendNotify(`京东月资产统计#4`, `${allMessageMonthGp4}`, {
                url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
            })
            await $.wait(10 * 1000);
        }
        if ($.isNode() && allMessageMonth) {
            await notify.sendNotify(`京东月资产统计`, `${allMessageMonth}`, {
                url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
            })
            await $.wait(10 * 1000);
        }
    }

    if ($.isNode() && allMessage2Gp2) {
        allMessage2Gp2 += RemainMessage;
        await notify.sendNotify("京东白嫖提醒#2", `${allMessage2Gp2}`, {
            url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
        })
        await $.wait(10 * 1000);
    }
    if ($.isNode() && allMessage2Gp3) {
        allMessage2Gp3 += RemainMessage;
        await notify.sendNotify("京东白嫖提醒#3", `${allMessage2Gp3}`, {
            url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
        })
        await $.wait(10 * 1000);
    }
    if ($.isNode() && allMessage2Gp4) {
        allMessage2Gp4 += RemainMessage;
        await notify.sendNotify("京东白嫖提醒#4", `${allMessage2Gp4}`, {
            url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
        })
        await $.wait(10 * 1000);
    }
    if ($.isNode() && allMessage2) {
        allMessage2 += RemainMessage;
        await notify.sendNotify("京东白嫖提醒", `${allMessage2}`, {
            url: `https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean`
        })
        await $.wait(10 * 1000);
    }

})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })
async function showMsg() {
    //if ($.errorMsg)
    //return
    ReturnMessageTitle = "";
    ReturnMessage = "";
    var strsummary = "";
    if (MessageUserGp2) {
        userIndex2 = MessageUserGp2.findIndex((item) => item === $.pt_pin);
    }
    if (MessageUserGp3) {
        userIndex3 = MessageUserGp3.findIndex((item) => item === $.pt_pin);
    }
    if (MessageUserGp4) {
        userIndex4 = MessageUserGp4.findIndex((item) => item === $.pt_pin);
    }

    if (userIndex2 != -1) {
        IndexGp2 += 1;
        ReturnMessageTitle = `【账号${IndexGp2}🆔】${$.nickName || $.UserName}`;
    }
    if (userIndex3 != -1) {
        IndexGp3 += 1;
        ReturnMessageTitle = `【账号${IndexGp3}🆔】${$.nickName || $.UserName}`;
    }
    if (userIndex4 != -1) {
        IndexGp4 += 1;
        ReturnMessageTitle = `【账号${IndexGp4}🆔】${$.nickName || $.UserName}`;
    }
    if (userIndex2 == -1 && userIndex3 == -1 && userIndex4 == -1) {
        IndexAll += 1;
        ReturnMessageTitle = `【账号${IndexAll}🆔】${$.nickName || $.UserName}`;
    }


    if ($.JingXiang||1) {
        if ($.isRealNameAuth)
            if (cookie.includes("app_open"))
                ReturnMessageTitle += `(wskey已实名)\n`;
            else
                ReturnMessageTitle += `(已实名)\n`;
        else
            if (cookie.includes("app_open"))
                ReturnMessageTitle += `(wskey未实名)\n`;
            else
                ReturnMessageTitle += `(未实名)\n`;

        ReturnMessage += `【账号信息】`;
        if ($.isPlusVip) {
            ReturnMessage += `Plus会员`;
        } else {
            ReturnMessage += $.levelName||'普通会员';
        }
        if ($.PlustotalScore)
            ReturnMessage += `(${$.PlustotalScore}分)`
        ReturnMessage += `\n`;
        //ReturnMessage += `,京享值${$.JingXiang}\n`;
    } else {
        ReturnMessageTitle += `\n`;
    }
    if (llShowMonth) {
        ReturnMessageMonth = ReturnMessage;
        ReturnMessageMonth += `\n【上月收入】：${$.allincomeBean}京豆 🐶\n`;
        ReturnMessageMonth += `【上月支出】：${$.allexpenseBean}京豆 🐶\n`;

        console.log(ReturnMessageMonth);

        if (userIndex2 != -1) {
            allMessageMonthGp2 += ReturnMessageMonth + `\n`;
        }
        if (userIndex3 != -1) {
            allMessageMonthGp3 += ReturnMessageMonth + `\n`;
        }
        if (userIndex4 != -1) {
            allMessageMonthGp4 += ReturnMessageMonth + `\n`;
        }
        if (userIndex2 == -1 && userIndex3 == -1 && userIndex4 == -1) {
            allMessageMonth += ReturnMessageMonth + `\n`;
        }
        if ($.isNode() && WP_APP_TOKEN_ONE) {
            try {
                await notify.sendNotifybyWxPucher("京东月资产统计", `${ReturnMessageMonth}`, `${$.UserName}`);
            } catch {
                $.log(`一对一推送异常，请拷贝库里的sendnotify.js文件到deps目录下，在拉库重试！！！\n`);
            }
        }

    }
    if (EnableCheckBean) {
        if (checkbeanDetailMode == 0) {
            ReturnMessage += `【今日京豆】收${$.todayIncomeBean}豆`;
            strsummary += `收${$.todayIncomeBean}豆,`;
            if ($.todayOutcomeBean != 0) {
                ReturnMessage += `,支${$.todayOutcomeBean}豆`;
            }
            ReturnMessage += `\n`;
            ReturnMessage += `【昨日京豆】收${$.incomeBean}豆`;

            if ($.expenseBean != 0) {
                ReturnMessage += `,支${$.expenseBean}豆`;
            }
            ReturnMessage += `\n`;
        } else {
            if (TempBeanCache) {
                ReturnMessage += `【京豆变动】${$.beanCount - $.beanCache}豆(与${matchtitle}${$.CheckTime}比较)`;
                strsummary += `变动${$.beanCount - $.beanCache}豆,`;
                ReturnMessage += `\n`;
            }
            else {
                ReturnMessage += `【京豆变动】未找到缓存,下次出结果统计`;
                ReturnMessage += `\n`;
            }
        }
    }


    if ($.beanCount) {
        ReturnMessage += `【当前京豆】${$.beanCount - $.beanChangeXi}豆(≈${(($.beanCount - $.beanChangeXi) / 100).toFixed(2)}元)\n`;
    } else {
        if ($.levelName || $.JingXiang)
            ReturnMessage += `【当前京豆】获取失败,接口返回空数据\n`;
        else {
            ReturnMessage += `【当前京豆】${$.beanCount - $.beanChangeXi}豆(≈${(($.beanCount - $.beanChangeXi) / 100).toFixed(2)}元)\n`;
        }
    }

    if ($.JDtotalcash) {
        ReturnMessage += `【特价金币】${$.JDtotalcash}币(≈${($.JDtotalcash / 10000).toFixed(2)}元)\n`;
    }
    if ($.ECardinfo)
        ReturnMessage += `【礼品卡额】${$.ECardinfo}元\n`;

    if ($.JoyRunningAmount)
        ReturnMessage += `【汪汪赛跑】${$.JoyRunningAmount}元\n`;

    if ($.JdFarmProdName != "") {
        if ($.JdtreeEnergy != 0) {
            if ($.treeState === 2 || $.treeState === 3) {
                ReturnMessage += `【老农场】${$.JdFarmProdName} 可以兑换了!\n`;
                TempBaipiao += `【老农场】${$.JdFarmProdName} 可以兑换了!\n`;
                if (userIndex2 != -1) {
                    ReceiveMessageGp2 += `【账号${IndexGp2} ${$.nickName || $.UserName}】${$.JdFarmProdName} (老农场)\n`;
                }
                if (userIndex3 != -1) {
                    ReceiveMessageGp3 += `【账号${IndexGp3} ${$.nickName || $.UserName}】${$.JdFarmProdName} (老农场)\n`;
                }
                if (userIndex4 != -1) {
                    ReceiveMessageGp4 += `【账号${IndexGp4} ${$.nickName || $.UserName}】${$.JdFarmProdName} (老农场)\n`;
                }
                if (userIndex2 == -1 && userIndex3 == -1 && userIndex4 == -1) {
                    allReceiveMessage += `【账号${IndexAll} ${$.nickName || $.UserName}】${$.JdFarmProdName} (老农场)\n`;
                }
            } else {
                //if ($.JdwaterD != 'Infinity' && $.JdwaterD != '-Infinity') {
                //ReturnMessage += `【老农场】${$.JdFarmProdName}(${(($.JdtreeEnergy / $.JdtreeTotalEnergy) * 100).toFixed(0)}%,${$.JdwaterD}天)\n`;
                //} else {
                ReturnMessage += `【老农场】${$.JdFarmProdName}(${(($.JdtreeEnergy / $.JdtreeTotalEnergy) * 100).toFixed(0)}%)\n`;

                //}
            }
        } else {
            if ($.treeState === 0) {
                TempBaipiao += `【老农场】水果领取后未重新种植!\n`;

                if (userIndex2 != -1) {
                    WarnMessageGp2 += `【账号${IndexGp2} ${$.nickName || $.UserName}】水果领取后未重新种植! (老农场)\n`;
                }
                if (userIndex3 != -1) {
                    WarnMessageGp3 += `【账号${IndexGp3} ${$.nickName || $.UserName}】水果领取后未重新种植! (老农场)\n`;
                }
                if (userIndex4 != -1) {
                    WarnMessageGp4 += `【账号${IndexGp4} ${$.nickName || $.UserName}】水果领取后未重新种植! (老农场)\n`;
                }
                if (userIndex2 == -1 && userIndex3 == -1 && userIndex4 == -1) {
                    allWarnMessage += `【账号${IndexAll} ${$.nickName || $.UserName}】水果领取后未重新种植! (老农场)\n`;
                }

            } else if ($.treeState === 1) {
                ReturnMessage += `【老农场】${$.JdFarmProdName}种植中...\n`;
            } else {
                TempBaipiao += `【老农场】状态异常!\n`;
                if (userIndex2 != -1) {
                    WarnMessageGp2 += `【账号${IndexGp2} ${$.nickName || $.UserName}】状态异常! (老农场)\n`;
                }
                if (userIndex3 != -1) {
                    WarnMessageGp3 += `【账号${IndexGp3} ${$.nickName || $.UserName}】状态异常! (老农场)\n`;
                }
                if (userIndex4 != -1) {
                    WarnMessageGp4 += `【账号${IndexGp4} ${$.nickName || $.UserName}】状态异常! (老农场)\n`;
                }
                if (userIndex2 == -1 && userIndex3 == -1 && userIndex4 == -1) {
                    allWarnMessage += `【账号${IndexAll} ${$.nickName || $.UserName}】状态异常! (老农场)\n`;
                }
                //ReturnMessage += `【老农场】${$.JdFarmProdName}状态异常${$.treeState}...\n`;
            }
        }
    }
    if ($.fruitnewinfo){
        //ReturnMessage += `【新农场】种植进度${$.fruitnewinfo}\n`;
        if ($.fruitnewinfo.skuName && $.fruitnewinfo.treeFullStage == 5 ){
            ReturnMessage += `【新农场】种植完成!\n`;
            TempBaipiao += `【新农场】种植完成!\n`;
            allReceiveMessage += `【账号${IndexAll} ${$.nickName || $.UserName}】种植完成，去领取吧 (新农场)\n`;
        } else if ($.fruitnewinfo.skuName && $.fruitnewinfo.treeCurrentState === 0){
            ReturnMessage += '【新农场】种植进度' + $.fruitnewinfo.treeFullStage +'/5(' + $.fruitnewinfo.currentProcess+'%)\n';
        } else if ($.fruitnewinfo.treeFullStage === 0){
            ReturnMessage += `【新农场】未种植!\n`;
            //TempBaipiao += `【新农场】未种植!\n`;
            //allWarnMessage += `【账号${IndexAll} ${$.nickName || $.UserName}】未种植，快去种植吧! (新农场)\n`;
        } else {
            ReturnMessage += '【新农场】可能枯萎了，请重新种植！\n';
        }
    } 
    if ($.newfarm_info){
            //ReturnMessage += `【新农场】奖品未兑换!\n`;
            TempBaipiao += `【新农场】奖品未兑换!\n`;
            allReceiveMessage += `【账号${IndexAll} ${$.nickName || $.UserName}】\n ${$.newfarm_info}\n 快去兑换吧 (新农场)\n`;        
    }

    let dwscore = await dwappinfo();
    if (dwscore) {
        let dwappex = await dwappexpire();
        ReturnMessage += `【话费积分】${dwscore}`;
        if (dwappex) {
            ReturnMessage += `(近7日将过期${dwappex})`;
        }
        ReturnMessage += `\n`;
    }
    let marketcard = await marketCard();
    if (marketcard && marketcard.balance != '0.00' ) {
        ReturnMessage += `【超市卡】${marketcard.balance}元`;
        if (marketcard.expirationGiftAmountDes) {
            ReturnMessage += `(${marketcard.expirationGiftAmountDes})`;
        }
        ReturnMessage += `\n`;
    }
    if ($.wyw_score != '' ) {
        ReturnMessage += `【玩一玩奖票】${$.wyw_score}个`;
        ReturnMessage += `\n`;
    }
    if ($.wb_score != '' ) {
        ReturnMessage += `【汪贝余额】${$.wb_score}个${$.wb_expire!=0?'(近7日将过期'+$.wb_expire+')':''}`;
        ReturnMessage += `\n`;
    }    
    if ($.sqb_info != '' ) {
        ReturnMessage += `【省钱币】${$.sqb_info}`;
        ReturnMessage += `\n`;
    }        
    if ($.jdCash) {
        ReturnMessage += `【其他信息】`;

        if ($.jdCash) {
            ReturnMessage += `领现金:${$.jdCash}元`;
        }

        ReturnMessage += `\n`;

    }

    if (strGuoqi) {
        ReturnMessage += `💸💸💸临期京豆明细💸💸💸\n`;
        ReturnMessage += `${strGuoqi}`;
    }

    ReturnMessage += `🧧🧧🧧红包明细🧧🧧🧧\n`;
    ReturnMessage += `${$.message}`;
    strsummary += `红包${$.balance}元`
    if ($.YunFeiQuan) {
        var strTempYF = "【免运费券】" + $.YunFeiQuan + "张";
        if ($.YunFeiQuanEndTime)
            strTempYF += "(有效期至" + $.YunFeiQuanEndTime + ")";
        strTempYF += "\n";
        ReturnMessage += strTempYF
    }
    if ($.YunFeiQuan2) {
        var strTempYF2 = "【免运费券】" + $.YunFeiQuan2 + "张";
        if ($.YunFeiQuanEndTime2)
            strTempYF += "(有效期至" + $.YunFeiQuanEndTime2 + ")";
        strTempYF2 += "\n";
        ReturnMessage += strTempYF2
    }

    if (userIndex2 != -1) {
        allMessageGp2 += ReturnMessageTitle + ReturnMessage + `\n`;
    }
    if (userIndex3 != -1) {
        allMessageGp3 += ReturnMessageTitle + ReturnMessage + `\n`;
    }
    if (userIndex4 != -1) {
        allMessageGp4 += ReturnMessageTitle + ReturnMessage + `\n`;
    }
    if (userIndex2 == -1 && userIndex3 == -1 && userIndex4 == -1) {
        allMessage += ReturnMessageTitle + ReturnMessage + `\n------\n`;
    }

    console.log(`${ReturnMessageTitle + ReturnMessage}`);

    if ($.isNode() && WP_APP_TOKEN_ONE) {
        var strTitle = "京东资产统计";
        if ($.JingXiang||1) {
            if ($.isRealNameAuth)
                if (cookie.includes("app_open"))
                    ReturnMessage = `【账号名称】${$.nickName || $.UserName}(wskey已实名)\n` + ReturnMessage;
                else
                    ReturnMessage = `【账号名称】${$.nickName || $.UserName}(已实名)\n` + ReturnMessage;
            else
                if (cookie.includes("app_open"))
                    ReturnMessage = `【账号名称】${$.nickName || $.UserName}(wskey未实名)\n` + ReturnMessage;
                else
                    ReturnMessage = `【账号名称】${$.nickName || $.UserName}(未实名)\n` + ReturnMessage;

        } else {
            ReturnMessage = `【账号名称】${$.nickName || $.UserName}\n` + ReturnMessage;
        }
        if (TempBaipiao) {
            TempBaipiao = `【⏰商品白嫖活动提醒⏰】\n` + TempBaipiao;
            ReturnMessage = TempBaipiao + `\n` + ReturnMessage;
        }

        ReturnMessage += RemainMessage;

        if (strAllNotify)
            ReturnMessage = strAllNotify + `\n` + ReturnMessage;
        try {
            await notify.sendNotifybyWxPucher(strTitle, `${ReturnMessage}`, `${$.UserName}`, undefined, strsummary);
        } catch {
            $.log(`一对一推送异常，请拷贝库里的sendnotify.js文件到deps目录下，在拉库重试！！！\n`);
        }
    }

    //$.msg($.name, '', ReturnMessage , {"open-url": "https://bean.m.jd.com/beanDetail/index.action?resourceValue=bean"});
}
async function bean() {

    if (EnableCheckBean && checkbeanDetailMode == 0) {

        // console.log(`北京时间零点时间戳:${parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000}`);
        // console.log(`北京时间2020-10-28 06:16:05::${new Date("2020/10/28 06:16:05+08:00").getTime()}`)
        // 不管哪个时区。得到都是当前时刻北京时间的时间戳 new Date().getTime() + new Date().getTimezoneOffset()*60*1000 + 8*60*60*1000

        //前一天的0:0:0时间戳
        const tm = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000 - (24 * 60 * 60 * 1000);
        // 今天0:0:0时间戳
        const tm1 = parseInt((Date.now() + 28800000) / 86400000) * 86400000 - 28800000;
        let page = 1,
            t = 0,
            yesterdayArr = [],
            todayArr = [];
        do {
            let response = await getJingBeanBalanceDetail(page);
            await $.wait(1000);
            // console.log(`第${page}页: ${JSON.stringify(response)}`);
            if (response && response.code === "0") {
                page++;
                let detailList = response.jingDetailList;
                if (detailList && detailList.length > 0) {
                    for (let item of detailList) {
                        const date = item.date.replace(/-/g, '/') + "+08:00";
                        if (new Date(date).getTime() >= tm1 && (!item['eventMassage'].includes("退还") && !item['eventMassage'].includes("物流") && !item['eventMassage'].includes('扣赠'))) {
                            todayArr.push(item);
                        } else if (tm <= new Date(date).getTime() && new Date(date).getTime() < tm1 && (!item['eventMassage'].includes("退还") && !item['eventMassage'].includes("物流") && !item['eventMassage'].includes('扣赠'))) {
                            //昨日的
                            yesterdayArr.push(item);
                        } else if (tm > new Date(date).getTime()) {
                            //前天的
                            t = 1;
                            break;
                        }
                    }
                } else {
                    $.errorMsg = `数据异常`;
                    $.msg($.name, ``, `账号${$.index}：${$.nickName}\n${$.errorMsg}`);
                    t = 1;
                }
            } else if (response && response.code === "3") {
                console.log(`cookie已过期，或者填写不规范，跳出`)
                t = 1;
            } else {
                console.log(`未知情况：${JSON.stringify(response)}`);
                console.log(`未知情况，跳出`)
                t = 1;
            }
        } while (t === 0);
        for (let item of yesterdayArr) {
            if (Number(item.amount) > 0) {
                $.incomeBean += Number(item.amount);
            } else if (Number(item.amount) < 0) {
                $.expenseBean += Number(item.amount);
            }
        }
        for (let item of todayArr) {
            if (Number(item.amount) > 0) {
                $.todayIncomeBean += Number(item.amount);
            } else if (Number(item.amount) < 0) {
                $.todayOutcomeBean += Number(item.amount);
            }
        }
        $.todayOutcomeBean = -$.todayOutcomeBean;
        $.expenseBean = -$.expenseBean;
    }

    if (EnableOverBean) {
        await jingBeanDetail(); //过期京豆	    
    }
    await redPacket();
    if (EnableChaQuan)
        await getCoupon();
}

async function Monthbean() {
    let time = new Date();
    let year = time.getFullYear();
    let month = parseInt(time.getMonth()); //取上个月
    if (month == 0) {
        //一月份，取去年12月，所以月份=12，年份减1
        month = 12;
        year -= 1;
    }

    //开始时间 时间戳
    let start = new Date(year + "-" + month + "-01 00:00:00").getTime();
    console.log(`计算月京豆起始日期:` + GetDateTime(new Date(year + "-" + month + "-01 00:00:00")));

    //结束时间 时间戳
    if (month == 12) {
        //取去年12月，进1个月，所以月份=1，年份加1
        month = 1;
        year += 1;
    }
    let end = new Date(year + "-" + (month + 1) + "-01 00:00:00").getTime();
    console.log(`计算月京豆结束日期:` + GetDateTime(new Date(year + "-" + (month + 1) + "-01 00:00:00")));

    let allpage = 1,
        allt = 0,
        allyesterdayArr = [];
    do {
        let response = await getJingBeanBalanceDetail(allpage);
        await $.wait(1000);
        // console.log(`第${allpage}页: ${JSON.stringify(response)}`);
        if (response && response.code === "0") {
            allpage++;
            let detailList = response.jingDetailList;
            if (detailList && detailList.length > 0) {
                for (let item of detailList) {
                    const date = item.date.replace(/-/g, '/') + "+08:00";
                    if (start <= new Date(date).getTime() && new Date(date).getTime() < end) {
                        //日期区间内的京豆记录
                        allyesterdayArr.push(item);
                    } else if (start > new Date(date).getTime()) {
                        //前天的
                        allt = 1;
                        break;
                    }
                }
            } else {
                $.errorMsg = `数据异常`;
                $.msg($.name, ``, `账号${$.index}：${$.nickName}\n${$.errorMsg}`);
                allt = 1;
            }
        } else if (response && response.code === "3") {
            console.log(`cookie已过期，或者填写不规范，跳出`)
            allt = 1;
        } else {
            console.log(`未知情况：${JSON.stringify(response)}`);
            console.log(`未知情况，跳出`)
            allt = 1;
        }
    } while (allt === 0);

    for (let item of allyesterdayArr) {
        if (Number(item.amount) > 0) {
            $.allincomeBean += Number(item.amount);
        } else if (Number(item.amount) < 0) {
            $.allexpenseBean += Number(item.amount);
        }
    }

}


function apptaskUrl(functionId = "", body = "") {
    return {
        url: `${JD_API_HOST}?functionId=${functionId}`,
        body,
        headers: {
            'Cookie': cookie,
            'Host': 'api.m.jd.com',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': '',
            'User-Agent': 'JD4iPhone/167774 (iPhone; iOS 14.7.1; Scale/3.00)',
            'Accept-Language': 'zh-Hans-CN;q=1',
            'Accept-Encoding': 'gzip, deflate, br',
        },
        timeout: 10000
    }
}

function TotalBean() {
    return new Promise(async resolve => {
        const options = {
            "url": `https://wq.jd.com/user/info/QueryJDUserInfo?sceneval=2`,
            "headers": {
                "Accept": "application/json,text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Encoding": "gzip, deflate, br",
                "Accept-Language": "zh-cn",
                "Connection": "keep-alive",
                "Cookie": cookie,
                "Referer": "https://wqs.jd.com/my/jingdou/my.shtml?sceneval=2",
                "User-Agent": $.UA
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`TotalBean API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['retcode'] === 13) {
                            $.isLogin = false; //cookie过期
                            return
                        }
                        if (data['retcode'] === 0) {
                            //$.nickName = (data['base'] && data['base'].nickname) || $.UserName;
							$.nickName = $.UserName;
                            //$.isPlusVip=data['isPlusVip'];
                            $.isRealNameAuth = data['isRealNameAuth'];
                            $.beanCount = (data['base'] && data['base'].jdNum) || 0;
                            $.JingXiang = (data['base'] && data['base'].jvalue) || 0;
                        } else {
                            $.nickName = $.UserName
                        }



                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
    })
}

function TotalBean2() {
    return new Promise(async (resolve) => {
        const options = {
            url: `https://wxapp.m.jd.com/kwxhome/myJd/home.json?&useGuideModule=0&bizId=&brandId=&fromType=wxapp&timestamp=${Date.now()}`,
            headers: {
                Cookie: cookie,
                'content-type': `application/x-www-form-urlencoded`,
                Connection: `keep-alive`,
                'Accept-Encoding': `gzip,compress,br,deflate`,
                Referer: `https://servicewechat.com/wxa5bf5ee667d91626/161/page-frame.html`,
                Host: `wxapp.m.jd.com`,
                'User-Agent': `Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.10(0x18000a2a) NetType/WIFI Language/zh_CN`,
            },
            timeout: 10000
        };
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err);
                } else {
                    if (data) {
                        data = JSON.parse(data);

                        if (!data.user) {
                            return;
                        }
                        const userInfo = data.user;
                        if (userInfo) {
                            if (!$.nickName)
                                $.nickName = userInfo.petName;
                            if ($.beanCount == 0) {
                                $.beanCount = userInfo.jingBean;
                            }
                            $.JingXiang = userInfo.uclass;
                        }
                    } else {
                        $.log('京东服务器返回空数据');
                    }
                }
            } catch (e) {
                $.logErr(e);
            }
            finally {
                resolve();
            }
        });
    });
}


function isLoginByX1a0He() {
    return new Promise((resolve) => {
        const options = {
            url: 'https://plogin.m.jd.com/cgi-bin/ml/islogin',
            headers: {
                "Cookie": cookie,
                "referer": "https://h5.m.jd.com/",
                "User-Agent": "jdapp;iPhone;10.1.2;15.0;network/wifi;Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            },
            timeout: 10000
        }
        $.get(options, (err, resp, data) => {
            try {
                if (data) {
                    data = JSON.parse(data);
                    if (data.islogin === "1") {
                        console.log(`使用X1a0He写的接口加强检测: Cookie有效\n`)
                    } else if (data.islogin === "0") {
                        $.isLogin = false;
                        console.log(`使用X1a0He写的接口加强检测: Cookie无效\n`)
                    } else {
                        console.log(`使用X1a0He写的接口加强检测: 未知返回，不作变更...\n`)
                        $.error = `${$.nickName} :` + `使用X1a0He写的接口加强检测: 未知返回...\n`
                    }
                }
            } catch (e) {
                console.log(e);
            }
            finally {
                resolve();
            }
        });
    });
}

function getJingBeanBalanceDetail(page) {
    return new Promise(async resolve => {
        const options = {
            "url": `https://bean.m.jd.com/beanDetail/detail.json?page=${page}`,
            "body": `body=${escape(JSON.stringify({ "pageSize": "20", "page": page.toString() }))}&appid=ld`,
            "headers": {
                'User-Agent': $.UA,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': cookie,
            }
        }
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`getJingBeanBalanceDetail API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        // console.log(data)
                    } else {
                        // console.log(`京东服务器返回空数据`)
                    }
                }
            } catch (e) {
                // $.logErr(e, resp)
            } finally {
                resolve(data);
            }
        })
    })
}

function jingBeanDetail() {
    return new Promise(async resolve => {
        setTimeout(async () => {
            var strsign = "";
            if (epsignurl) {
                strsign = await getepsign('jingBeanDetail', { "pageSize": "20", "page": "1" });
                strsign = strsign.body;
            }
            else
                strsign = await dyx.getbody('jingBeanDetail', { "pageSize": "20", "page": "1" });

            const options = {
                "url": `https://api.m.jd.com/client.action?functionId=jingBeanDetail`,
                "body": strsign,
                "headers": {
                    'User-Agent': $.UA,
                    'Host': 'api.m.jd.com',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': cookie,
                }
            }
            $.post(options, (err, resp, data) => {
                try {
                    if (err) {
                        console.log(`${JSON.stringify(err)}`)
                        console.log(`${$.name} jingBeanDetail API请求失败，请检查网路重试`)
                    } else {
                        if (data) {
                            data = JSON.parse(data);
                            if (data?.others?.jingBeanExpiringInfo?.detailList) {
                                const { detailList = [] } = data?.others?.jingBeanExpiringInfo;
                                detailList.map(item => {
                                    strGuoqi += `【${(item['eventMassage']).replace("即将过期京豆", "").replace("年", "-").replace("月", "-").replace("日", "")}】过期${item['amount']}豆\n`;
                                })
                            }
                        } else {
                            console.log(`jingBeanDetail 京东服务器返回空数据`)
                        }
                    }
                } catch (e) {
                    if (epsignurl)
                        $.logErr(e, resp)
                    else
                        console.log("因为没有指定带ep的Sign,获取过期豆子信息次数多了就会失败.")
                } finally {
                    resolve(data);
                }
            })
        }, 0 * 1000);
    })
}

function getepsign(n, o, t = "sign") {
    let e = {
        url: epsignurl,
        form: {
            functionId: n, body: $.toStr(o),
        }, headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    };
    return new Promise(n => {
        $.post(e, async (o, t, e) => {
            try {
                o ? console.log(o) : e = JSON.parse(e)
                if (e.code === 200 && e.data) {
                    n({ body: e.data.convertUrlNew })
                }
            } catch (n) {
                $.logErr(n, t)
            } finally {
                n({ body: e.convertUrlNew })
            }
        })
    })
}

function getSignfromNolan(functionId, body) {
    var strsign = '';
    let data = {
        "fn": functionId,
        "body": body
    }
    return new Promise((resolve) => {
        let url = {
            url: jdSignUrl,
            body: JSON.stringify(data),
            followRedirect: false,
            headers: {
                'Accept': '*/*',
                "accept-encoding": "gzip, deflate, br",
                'Content-Type': 'application/json'
            },
            timeout: 30000
        }
        $.post(url, async (err, resp, data) => {
            try {
                data = JSON.parse(data);
                if (data && data.body) {
                    if (data.body)
                        strsign = data.body || '';
                    if (strsign != '')
                        resolve(strsign);
                    else
                        console.log("签名获取失败.");
                } else {
                    console.log("签名获取失败.");
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(strsign);
            }
        })
    })
}


function redPacket() {
    return new Promise(async resolve => {
        const options = {
            "url": `https://api.m.jd.com/client.action?functionId=myhongbao_getUsableHongBaoList&body=%7B%22appId%22%3A%22appHongBao%22%2C%22appToken%22%3A%22apphongbao_token%22%2C%22platformId%22%3A%22appHongBao%22%2C%22platformToken%22%3A%22apphongbao_token%22%2C%22platform%22%3A%221%22%2C%22orgType%22%3A%222%22%2C%22country%22%3A%22cn%22%2C%22childActivityId%22%3A%22-1%22%2C%22childActiveName%22%3A%22-1%22%2C%22childActivityTime%22%3A%22-1%22%2C%22childActivityUrl%22%3A%22-1%22%2C%22openId%22%3A%22-1%22%2C%22activityArea%22%3A%22-1%22%2C%22applicantErp%22%3A%22-1%22%2C%22eid%22%3A%22-1%22%2C%22fp%22%3A%22-1%22%2C%22shshshfp%22%3A%22-1%22%2C%22shshshfpa%22%3A%22-1%22%2C%22shshshfpb%22%3A%22-1%22%2C%22jda%22%3A%22-1%22%2C%22activityType%22%3A%221%22%2C%22isRvc%22%3A%22-1%22%2C%22pageClickKey%22%3A%22-1%22%2C%22extend%22%3A%22-1%22%2C%22organization%22%3A%22JD%22%7D&appid=JDReactMyRedEnvelope&client=apple&clientVersion=7.0.0`,
            "headers": {
                'Host': 'api.m.jd.com',
                'Accept': '*/*',
                'Connection': 'keep-alive',
                'Accept-Language': 'zh-cn',
                'Referer': 'https://h5.m.jd.com/',
                'Accept-Encoding': 'gzip, deflate, br',
                "Cookie": cookie,
                'User-Agent': $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")
            }
        }
        $.get(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`redPacket API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        $.jxRed = 0,
                            $.jsRed = 0,
                            $.jdRed = 0,
                            $.jdhRed = 0,
                            $.jdwxRed = 0,
                            $.jdGeneralRed = 0,
                            $.jxRedExpire = 0,
                            $.jsRedExpire = 0,
                            $.jdRedExpire = 0,
                            $.jdhRedExpire = 0;
                        $.jdwxRedExpire = 0,
                            $.jdGeneralRedExpire = 0

                        let t = new Date();
                        t.setDate(t.getDate() + 1);
                        t.setHours(0, 0, 0, 0);
                        t = parseInt((t - 1) / 1000) * 1000;

                        for (let vo of data.hongBaoList || []) {
                            if (vo.orgLimitStr) {
                                if (vo.orgLimitStr.includes("京喜") && !vo.orgLimitStr.includes("特价")) {
                                    $.jxRed += parseFloat(vo.balance)
                                    if (vo['endTime'] === t) {
                                        $.jxRedExpire += parseFloat(vo.balance)
                                    }
                                    continue;
                                } else if (vo.orgLimitStr.includes("购物小程序")) {
                                    $.jdwxRed += parseFloat(vo.balance)
                                    if (vo['endTime'] === t) {
                                        $.jdwxRedExpire += parseFloat(vo.balance)
                                    }
                                    continue;
                                } else if (vo.orgLimitStr.includes("京东商城")) {
                                    $.jdRed += parseFloat(vo.balance)
                                    if (vo['endTime'] === t) {
                                        $.jdRedExpire += parseFloat(vo.balance)
                                    }
                                    continue;
                                } else if (vo.orgLimitStr.includes("极速") || vo.orgLimitStr.includes("京东特价") || vo.orgLimitStr.includes("京喜特价")) {
                                    $.jsRed += parseFloat(vo.balance)
                                    if (vo['endTime'] === t) {
                                        $.jsRedExpire += parseFloat(vo.balance)
                                    }
                                    continue;
                                } else if (vo.orgLimitStr && vo.orgLimitStr.includes("京东健康")) {
                                    $.jdhRed += parseFloat(vo.balance)
                                    if (vo['endTime'] === t) {
                                        $.jdhRedExpire += parseFloat(vo.balance)
                                    }
                                    continue;
                                }
                            }
                            $.jdGeneralRed += parseFloat(vo.balance)
                            if (vo['endTime'] === t) {
                                $.jdGeneralRedExpire += parseFloat(vo.balance)
                            }
                        }

                        $.balance = ($.jxRed + $.jsRed + $.jdRed + $.jdhRed + $.jdwxRed + $.jdGeneralRed).toFixed(2);
                        $.jxRed = $.jxRed.toFixed(2);
                        $.jsRed = $.jsRed.toFixed(2);
                        $.jdRed = $.jdRed.toFixed(2);
                        $.jdhRed = $.jdhRed.toFixed(2);
                        $.jdwxRed = $.jdwxRed.toFixed(2);
                        $.jdGeneralRed = $.jdGeneralRed.toFixed(2);
                        $.expiredBalance = ($.jxRedExpire + $.jsRedExpire + $.jdRedExpire + $.jdhRedExpire + $.jdwxRedExpire + $.jdGeneralRedExpire).toFixed(2);
                        $.message += `【红包总额】${$.balance}元(今日总过期${$.expiredBalance}) \n`;
                        if ($.jxRed > 0) {
                            if ($.jxRedExpire > 0)
                                $.message += `【京喜红包】${$.jxRed}元(今日将过期${$.jxRedExpire.toFixed(2)}) \n`;
                            else
                                $.message += `【京喜红包】${$.jxRed}元 \n`;
                        }

                        if ($.jsRed > 0) {
                            if ($.jsRedExpire > 0)
                                $.message += `【特价版APP】${$.jsRed}元(今日将过期${$.jsRedExpire.toFixed(2)}) \n`;
                            else
                                $.message += `【特价版APP】${$.jsRed}元 \n`;
                        }

                        if ($.jdRed > 0) {
                            if ($.jdRedExpire > 0)
                                $.message += `【京东APP】${$.jdRed}元(今日将过期${$.jdRedExpire.toFixed(2)}) \n`;
                            else
                                $.message += `【京东APP】${$.jdRed}元 \n`;
                        }

                        if ($.jdhRed > 0) {
                            if ($.jdhRedExpire > 0)
                                $.message += `【健康红包】${$.jdhRed}元(今日将过期${$.jdhRedExpire.toFixed(2)}) \n`;
                            else
                                $.message += `【健康红包】${$.jdhRed}元 \n`;
                        }

                        if ($.jdwxRed > 0) {
                            if ($.jdwxRedExpire > 0)
                                $.message += `【微信小程序】${$.jdwxRed}元(今日将过期${$.jdwxRedExpire.toFixed(2)}) \n`;
                            else
                                $.message += `【微信小程序】${$.jdwxRed}元 \n`;
                        }

                        if ($.jdGeneralRed > 0) {
                            if ($.jdGeneralRedExpire > 0)
                                $.message += `【全平台通用】${$.jdGeneralRed}元(今日将过期${$.jdGeneralRedExpire.toFixed(2)}) \n`;
                            else
                                $.message += `【全平台通用】${$.jdGeneralRed}元 \n`;

                        }

                    } else {
                        console.log(`京东服务器返回空数据`)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            }
            finally {
                resolve(data);
            }
        })
    })
}

function getCoupon() {
    return new Promise(resolve => {
        let options = {
            url: `https://wq.jd.com/activeapi/queryjdcouponlistwithfinance?state=1&wxadd=1&filterswitch=1&_=${Date.now()}&sceneval=2&g_login_type=1&callback=jsonpCBKB&g_ty=ls`,
            headers: {
                'authority': 'wq.jd.com',
                "User-Agent": $.UA,
                'accept': '*/*',
                'referer': 'https://wqs.jd.com/',
                'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
                'cookie': cookie
            },
            timeout: 10000
        }
        $.get(options, async (err, resp, data) => {
            try {
                data = JSON.parse(data.match(new RegExp(/jsonpCBK.?\((.*);*/))[1]);
                let couponTitle = '';
                let couponId = '';
                // 删除可使用且非超市、生鲜、京贴;
                let useable = data.coupon.useable;
                $.todayEndTime = new Date(new Date(new Date().getTime()).setHours(23, 59, 59, 999)).getTime();
                $.tomorrowEndTime = new Date(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).setHours(23, 59, 59, 999)).getTime();
                $.platFormInfo = "";
                for (let i = 0; i < useable.length; i++) {
                    //console.log(useable[i]);
                    if (useable[i].limitStr.indexOf('全品类') > -1) {
                        $.beginTime = useable[i].beginTime;
                        if ($.beginTime < new Date().getTime() && useable[i].quota <= 100 && useable[i].coupontype === 1) {
                            //$.couponEndTime = new Date(parseInt(useable[i].endTime)).Format('yyyy-MM-dd');
                            $.couponName = useable[i].limitStr;
                            if (useable[i].platFormInfo)
                                $.platFormInfo = useable[i].platFormInfo;

                            var decquota = parseFloat(useable[i].quota).toFixed(2);
                            var decdisc = parseFloat(useable[i].discount).toFixed(2);
                            if (useable[i].quota > useable[i].discount + 5 && useable[i].discount < 2)
                                continue
                            $.message += `【全品类券】满${decquota}减${decdisc}元`;

                            if (useable[i].endTime < $.todayEndTime) {
                                $.message += `(今日过期,${$.platFormInfo})\n`;
                            } else if (useable[i].endTime < $.tomorrowEndTime) {
                                $.message += `(明日将过期,${$.platFormInfo})\n`;
                            } else {
                                $.message += `(${$.platFormInfo})\n`;
                            }

                        }
                    }
                    if (useable[i].couponTitle.indexOf('运费券') > -1 && useable[i].limitStr.indexOf('自营商品运费') > -1) {
                        if (!$.YunFeiTitle) {
                            $.YunFeiTitle = useable[i].couponTitle;
                            $.YunFeiQuanEndTime = new Date(parseInt(useable[i].endTime)).Format('yyyy-MM-dd');
                            $.YunFeiQuan += 1;
                        } else {
                            if ($.YunFeiTitle == useable[i].couponTitle) {
                                $.YunFeiQuanEndTime = new Date(parseInt(useable[i].endTime)).Format('yyyy-MM-dd');
                                $.YunFeiQuan += 1;
                            } else {
                                if (!$.YunFeiTitle2)
                                    $.YunFeiTitle2 = useable[i].couponTitle;

                                if ($.YunFeiTitle2 == useable[i].couponTitle) {
                                    $.YunFeiQuanEndTime2 = new Date(parseInt(useable[i].endTime)).Format('yyyy-MM-dd');
                                    $.YunFeiQuan2 += 1;
                                }
                            }

                        }

                    }
                    if (useable[i].couponTitle.indexOf('特价版APP活动') > -1 && useable[i].limitStr == '仅可购买活动商品') {
                        $.beginTime = useable[i].beginTime;
                        if ($.beginTime < new Date().getTime() && useable[i].coupontype === 1) {
                            if (useable[i].platFormInfo)
                                $.platFormInfo = useable[i].platFormInfo;
                            var decquota = parseFloat(useable[i].quota).toFixed(2);
                            var decdisc = parseFloat(useable[i].discount).toFixed(2);

                            $.message += `【特价版券】满${decquota}减${decdisc}元`;

                            if (useable[i].endTime < $.todayEndTime) {
                                $.message += `(今日过期,${$.platFormInfo})\n`;
                            } else if (useable[i].endTime < $.tomorrowEndTime) {
                                $.message += `(明日将过期,${$.platFormInfo})\n`;
                            } else {
                                $.message += `(${$.platFormInfo})\n`;
                            }

                        }

                    }
                    //8是支付券， 7是白条券
                    if (useable[i].couponStyle == 7 || useable[i].couponStyle == 8) {
                        $.beginTime = useable[i].beginTime;
                        if ($.beginTime > new Date().getTime() || useable[i].quota > 50 || useable[i].coupontype != 1) {
                            continue;
                        }

                        if (useable[i].couponStyle == 8) {
                            $.couponType = "支付立减";
                        } else {
                            $.couponType = "白条优惠";
                        }
                        if (useable[i].discount < useable[i].quota)
                            $.message += `【${$.couponType}】满${useable[i].quota}减${useable[i].discount}元`;
                        else
                            $.message += `【${$.couponType}】立减${useable[i].discount}元`;
                        if (useable[i].platFormInfo)
                            $.platFormInfo = useable[i].platFormInfo;

                        //$.couponEndTime = new Date(parseInt(useable[i].endTime)).Format('yyyy-MM-dd');

                        if (useable[i].endTime < $.todayEndTime) {
                            $.message += `(今日过期,${$.platFormInfo})\n`;
                        } else if (useable[i].endTime < $.tomorrowEndTime) {
                            $.message += `(明日将过期,${$.platFormInfo})\n`;
                        } else {
                            $.message += `(${$.platFormInfo})\n`;
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            }
            finally {
                resolve();
            }
        })
    })
}

function jdfruitRequest(function_id, body = {}, timeout = 1000) {
    return new Promise(resolve => {
        setTimeout(() => {
            $.get(taskfruitUrl(function_id, body), (err, resp, data) => {
                try {
                    if (err) {
                        console.log('\n老农场: API查询请求失败 ‼️‼️')
                        console.log(JSON.stringify(err));
                        console.log(`function_id:${function_id}`)
                        $.logErr(err);
                    } else {
                        if (safeGet(data)) {
                            data = JSON.parse(data);
                            if (data.code == "400") {
                                console.log('老农场: ' + data.message);
                                llgeterror = true;
                            }
                            else
                                $.JDwaterEveryDayT = data.firstWaterInit.totalWaterTimes;
                        }
                    }
                } catch (e) {
                    $.logErr(e, resp);
                }
                finally {
                    resolve(data);
                }
            })
        }, timeout)
    })
}

async function getjdfruitinfo() {
    if (EnableJdFruit) {
        llgeterror = false;

        //await jdfruitRequest('taskInitForFarm', {
        //    "version": 14,
        //    "channel": 1,
        //    "babelChannel": "120"
        //});
        //
        //if (llgeterror)
        //	return
        //
        await fruitinfo();
        if (llgeterror) {
            console.log(`老农场API查询失败,等待10秒后再次尝试...`)
            await $.wait(10 * 1000);
            await fruitinfo();
        }
        if (llgeterror) {
            console.log(`老农场API查询失败,有空重启路由器换个IP吧.`)
        }

    }
    return;
}

async function getjdfruit() {
    return new Promise(resolve => {
        const option = {
            url: `${JD_API_HOST}?functionId=initForFarm`,
            body: `body=${escape(JSON.stringify({ "version": 4 }))}&appid=wh5&clientVersion=9.1.0`,
            headers: {
                "accept": "*/*",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "zh-CN,zh;q=0.9",
                "cache-control": "no-cache",
                "cookie": cookie,
                "origin": "https://home.m.jd.com",
                "pragma": "no-cache",
                "referer": "https://home.m.jd.com/myJd/newhome.action",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 10000
        };
        $.post(option, (err, resp, data) => {
            try {
                if (err) {
                    if (!llgeterror) {
                        console.log('\n老农场: API查询请求失败 ‼️‼️');
                        console.log(JSON.stringify(err));
                    }
                    llgeterror = true;
                } else {
                    llgeterror = false;
                    if (safeGet(data)) {
                        $.farmInfo = JSON.parse(data)
                        if ($.farmInfo.farmUserPro) {
                            $.JdFarmProdName = $.farmInfo.farmUserPro.name;
                            $.JdtreeEnergy = $.farmInfo.farmUserPro.treeEnergy;
                            $.JdtreeTotalEnergy = $.farmInfo.farmUserPro.treeTotalEnergy;
                            $.treeState = $.farmInfo.treeState;
                            let waterEveryDayT = $.JDwaterEveryDayT;
                            let waterTotalT = ($.farmInfo.farmUserPro.treeTotalEnergy - $.farmInfo.farmUserPro.treeEnergy) / 10; //一共还需浇多少次水
                            let waterD = Math.ceil(waterTotalT / waterEveryDayT);

                            $.JdwaterTotalT = waterTotalT;
                            $.JdwaterD = waterD;
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            }
            finally {
                resolve();
            }
        })
    })
}

function taskfruitUrl(function_id, body = {}) {
    return {
        url: `${JD_API_HOST}?functionId=${function_id}&body=${encodeURIComponent(JSON.stringify(body))}&appid=wh5`,
        headers: {
            "Host": "api.m.jd.com",
            "Accept": "*/*",
            "Origin": "https://carry.m.jd.com",
            "Accept-Encoding": "gzip, deflate, br",
            "User-Agent": $.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1"),
            "Accept-Language": "zh-CN,zh-Hans;q=0.9",
            "Referer": "https://carry.m.jd.com/",
            "Cookie": cookie
        },
        timeout: 10000
    }
}

function safeGet(data) {
    try {
        if (typeof JSON.parse(data) == "object") {
            return true;
        }
    } catch (e) {
        console.log(e);
        console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
        return false;
    }
}



function taskcashUrl(functionId, body = {}) {
    const struuid = randomString(16);
    let nowTime = Date.now();
    let _0x7683x5 = `${"lite-android&"}${JSON["stringify"](body)}${"&android&3.1.0&"}${functionId}&${nowTime}&${struuid}`;
    let _0x7683x6 = "12aea658f76e453faf803d15c40a72e0";
    const _0x7683x7 = $["isNode"]() ? require("crypto-js") : CryptoJS;
    let sign = _0x7683x7.HmacSHA256(_0x7683x5, _0x7683x6).toString();
    let strurl = JD_API_HOST + "api?functionId=" + functionId + "&body=" + `${escape(JSON["stringify"](body))}&appid=lite-android&client=android&uuid=` + struuid + `&clientVersion=3.1.0&t=${nowTime}&sign=${sign}`;
    return {
        url: strurl,
        headers: {
            'Host': "api.m.jd.com",
            'accept': "*/*",
            'kernelplatform': "RN",
            'user-agent': "JDMobileLite/3.1.0 (iPad; iOS 14.4; Scale/2.00)",
            'accept-language': "zh-Hans-CN;q=1, ja-CN;q=0.9",
            'Cookie': cookie
        },
        timeout: 10000
    }
}

function randomString(e) {
    e = e || 32;
    let t = "0123456789abcdef",
        a = t.length,
        n = "";
    for (let i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a));
    return n
}

Date.prototype.Format = function (fmt) {
    var e,
        n = this,
        d = fmt,
        l = {
            "M+": n.getMonth() + 1,
            "d+": n.getDate(),
            "D+": n.getDate(),
            "h+": n.getHours(),
            "H+": n.getHours(),
            "m+": n.getMinutes(),
            "s+": n.getSeconds(),
            "w+": n.getDay(),
            "q+": Math.floor((n.getMonth() + 3) / 3),
            "S+": n.getMilliseconds()
        };
    /(y+)/i.test(d) && (d = d.replace(RegExp.$1, "".concat(n.getFullYear()).substr(4 - RegExp.$1.length)));
    for (var k in l) {
        if (new RegExp("(".concat(k, ")")).test(d)) {
            var t,
                a = "S+" === k ? "000" : "00";
            d = d.replace(RegExp.$1, 1 == RegExp.$1.length ? l[k] : ("".concat(a) + l[k]).substr("".concat(l[k]).length))
        }
    }
    return d;
}

function jsonParse(str) {
    if (typeof str == "string") {
        try {
            return JSON.parse(str);
        } catch (e) {
            console.log(e);
            $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
            return [];
        }
    }
}
function timeFormat(time) {
    let date;
    if (time) {
        date = new Date(time)
    } else {
        date = new Date();
    }
    return date.getFullYear() + '-' + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate());
}


function GetDateTime(date) {

    var timeString = "";

    var timeString = date.getFullYear() + "-";
    if ((date.getMonth() + 1) < 10)
        timeString += "0" + (date.getMonth() + 1) + "-";
    else
        timeString += (date.getMonth() + 1) + "-";

    if ((date.getDate()) < 10)
        timeString += "0" + date.getDate() + " ";
    else
        timeString += date.getDate() + " ";

    if ((date.getHours()) < 10)
        timeString += "0" + date.getHours() + ":";
    else
        timeString += date.getHours() + ":";

    if ((date.getMinutes()) < 10)
        timeString += "0" + date.getMinutes() + ":";
    else
        timeString += date.getMinutes() + ":";

    if ((date.getSeconds()) < 10)
        timeString += "0" + date.getSeconds();
    else
        timeString += date.getSeconds();

    return timeString;
}

async function getuserinfo() {
    var body = [{ "pin": "$cooMrdGatewayUid$" }];
    var ua = `jdapp;iPhone;${random(["11.1.0", "10.5.0", "10.3.6"])};${random(["13.5", "14.0", "15.0"])};${uuidRandom()};network/wifi;supportApplePay/0;hasUPPay/0;hasOCPay/0;model/iPhone11,6;addressid/7565095847;supportBestPay/0;appBuild/167541;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`;

    let config = {
        url: 'https://lop-proxy.jd.com/JingIntegralApi/userAccount',
        body: JSON.stringify(body),
        headers: {
            "host": "lop-proxy.jd.com",
            "jexpress-report-time": Date.now().toString(),
            "access": "H5",
            "source-client": "2",
            "accept": "application/json, text/plain, */*",
            "d_model": "iPhone11,6",
            "accept-encoding": "gzip",
            "lop-dn": "jingcai.jd.com",
            "user-agent": ua,
            "partner": "",
            "screen": "375*812",
            "cookie": cookie,
            "x-requested-with": "XMLHttpRequest",
            "version": "1.0.0",
            "uuid": randomNumber(10),
            "clientinfo": "{\"appName\":\"jingcai\",\"client\":\"m\"}",
            "d_brand": "iPhone",
            "appparams": "{\"appid\":158,\"ticket_type\":\"m\"}",
            "sdkversion": "1.0.7",
            "area": area(),
            "client": "iOS",
            "referer": "https://jingcai-h5.jd.com/",
            "eid": "",
            "osversion": random(["13.5", "14.0", "15.0"]),
            "networktype": "wifi",
            "jexpress-trace-id": uuid(),
            "origin": "https://jingcai-h5.jd.com",
            "app-key": "jexpress",
            "event-id": uuid(),
            "clientversion": random(["11.1.0", "10.5.0", "10.3.6"]),
            "content-type": "application/json;charset=utf-8",
            "build": "167541",
            "biz-type": "service-monitor",
            "forcebot": "0"
        }
    }
    return new Promise(resolve => {
        $.post(config, async (err, resp, data) => {
            try {
                //console.log(data)
                if (err) {
                    console.log(err)
                } else {
                    data = JSON.parse(data);
                }
            } catch (e) {
                $.logErr(e, resp)
            }
            finally {
                resolve(data || '');
            }
        })
    })
}
function dwappinfo() {
    let ts = Date.now();
    let opt = {
        url: `https://dwapp.jd.com/user/dwSignInfo`,
        body: JSON.stringify({ "t": ts, "channelSource": "txzs", "encStr": CR.MD5(ts + 'e9c398ffcb2d4824b4d0a703e38yffdd').toString() }),
        headers: {
            'Origin': 'https://txsm-m.jd.com',
            'Content-Type': 'application/json',
            'User-Agent': $.UA,
            'Cookie': cookie
        }
    }
    return new Promise(async (resolve) => {
        $.post(opt, async (err, resp, data) => {
            let ccc = '';
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`dwappinfo 请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (data.code == 200) {
                        ccc = data.data.balanceNum;
                    } else {
                        console.log(data.msg);
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(ccc);
            }
        })
    })
}
function dwappexpire() {
    let opt = {
        url: `https://api.m.jd.com/api?functionId=DATAWALLET_USER_QUERY_EXPIRED_SCORE&appid=h5-sep&body=%7B%22expireDayNum%22%3A7%7D&client=m&clientVersion=6.0.0`,
        headers: {
			'Origin':'https://prodev.m.jd.com',
            'User-Agent': $.UA,
            'Cookie': cookie
        }
    }
    return new Promise(async (resolve) => {
        $.post(opt, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`dwappexpire 请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data)
                    if (data.code == 200) {
                        data = data.data.expireNum;
						
                    } else {
                        //console.log(data.msg);
                        data = '';
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(data);
            }
        })
    })
}

function getek() {
    let opt = {
        url: `https://mygiftcard.jd.com/giftcard/queryChannelUserCard`,
        //body: `appid=wh5&clientVersion=1.0.0&functionId=wanrentuan_superise_send&body={"channel":2}&area=2_2813_61130_0`,
        headers: {
            //'Host': 'api.m.jd.com',
            'Origin': 'https://o.jd.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': $.UA,
            'Cookie': cookie
        }
    }
    return new Promise(async (resolve) => {
        $.get(opt, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`getek请求失败!!!!`)
                } else {
                    data = JSON.parse(data)
                    if (data.code == 000000) {
                        $.ECardinfo = Number(data.data.totalAmount);
                    } else {
                        console.log(data.msg)
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            } finally {
                resolve(data)
            }
        })
    })
}
function marketCard() {
    let opt = {
        url: `https://api.m.jd.com/atop_channel_marketCard_cardInfo`,
        body: `appid=jd-super-market&t=${Date.now()}&functionId=atop_channel_marketCard_cardInfo&client=m&uuid=&body=%7B%22babelChannel%22%3A%22ttt9%22%2C%22isJdApp%22%3A%221%22%2C%22isWx%22%3A%220%22%7D`,
        headers: {
            'Origin': 'https://pro.m.jd.com',
            'User-Agent': $.UA,
            'Cookie': cookie
        }
    }
    let carddata = '';
    return new Promise(async (resolve) => {
        $.post(opt, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`marketCard 请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data)
                    if (data.success) {
                        carddata = data.data?.floorData?.items ? data.data?.floorData?.items[0].marketCardVO : '';
                    } else {
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve(carddata);
            }
        })
    })
}
function newfarm_info() {
    let opt = {
        url: `https://api.m.jd.com/client.action`,
        body: `appid=signed_wh5&client=android&clientVersion=12.4.2&screen=393*0&wqDefault=false&build=99108&osVersion=12&t=${Date.now()}&body={"version":1,"type":1}&functionId=farm_award_detail`,
        headers: {
            'Origin': 'https://h5.m.jd.com',
            'User-Agent': $.UA,
            'Cookie': cookie
        }
    }
    return new Promise(async (resolve) => {
        $.post(opt, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`newfarm_info 请求失败，请检查网路重试`)
                } else {
                    
                    data = JSON.parse(data);
                    if (data.data.success) {
                        if (data.data.result.plantAwards && data.data.result.plantAwards.length > 0){
                            for (let i of  data.data.result.plantAwards ){
                                if (i.awardStatus == 1){
                                    $.newfarm_info = `${i.skuName} -> ${i.exchangeRemind}`;
                                }
                            }
                        }
                    } else {
                    }
                }
            } catch (e) {
                $.logErr(e, resp);
            } finally {
                resolve();
            }
        })
    })
}

function area() {
    let i = getRand(1, 30)
    let o = getRand(70, 3000)
    let x = getRand(900, 60000)
    let g = getRand(600, 30000)
    let a = i + '_' + o + '_' + x + '_' + g;
    return a
};
function getRand(min, max) {
    return parseInt(Math.random() * (max - min)) + min;
};
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
};
function uuidRandom() {
    return Math.random().toString(16).slice(2, 10) +
        Math.random().toString(16).slice(2, 10) +
        Math.random().toString(16).slice(2, 10) +
        Math.random().toString(16).slice(2, 10) +
        Math.random().toString(16).slice(2, 10);
}
function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function randomNumber(len) {
    let chars = '0123456789';
    let maxPos = chars.length;
    let str = '';
    for (let i = 0; i < len; i++) {
        str += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return Date.now() + str;
}


function Env(t, e) {
    "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0);
    class s {
        constructor(t) {
            this.env = t
        }
        send(t, e = "GET") {
            t = "string" == typeof t ? {
                url: t
            }
                : t;
            let s = this.get;
            return "POST" === e && (s = this.post),
                new Promise((e, i) => {
                    s.call(this, t, (t, s, r) => {
                        t ? i(t) : e(s)
                    })
                })
        }
        get(t) {
            return this.send.call(this.env, t)
        }
        post(t) {
            return this.send.call(this.env, t, "POST")
        }
    }
    return new class {
        constructor(t, e) {
            this.name = t,
                this.http = new s(this),
                this.data = null,
                this.dataFile = "box.dat",
                this.logs = [],
                this.isMute = !1,
                this.isNeedRewrite = !1,
                this.logSeparator = "\n",
                this.startTime = (new Date).getTime(),
                Object.assign(this, e),
                this.log("", `🔔${this.name}, 开始!`)
        }
        isNode() {
            return "undefined" != typeof module && !!module.exports
        }
        isQuanX() {
            return "undefined" != typeof $task
        }
        isSurge() {
            return "undefined" != typeof $httpClient && "undefined" == typeof $loon
        }
        isLoon() {
            return "undefined" != typeof $loon
        }
        toObj(t, e = null) {
            try {
                return JSON.parse(t)
            } catch {
                return e
            }
        }
        toStr(t, e = null) {
            try {
                return JSON.stringify(t)
            } catch {
                return e
            }
        }
        getjson(t, e) {
            let s = e;
            const i = this.getdata(t);
            if (i)
                try {
                    s = JSON.parse(this.getdata(t))
                } catch { }
            return s
        }
        setjson(t, e) {
            try {
                return this.setdata(JSON.stringify(t), e)
            } catch {
                return !1
            }
        }
        getScript(t) {
            return new Promise(e => {
                this.get({
                    url: t
                }, (t, s, i) => e(i))
            })
        }
        runScript(t, e) {
            return new Promise(s => {
                let i = this.getdata("@chavy_boxjs_userCfgs.httpapi");
                i = i ? i.replace(/\n/g, "").trim() : i;
                let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");
                r = r ? 1 * r : 20,
                    r = e && e.timeout ? e.timeout : r;
                const [o, h] = i.split("@"),
                    n = {
                        url: `http://${h}/v1/scripting/evaluate`,
                        body: {
                            script_text: t,
                            mock_type: "cron",
                            timeout: r
                        },
                        headers: {
                            "X-Key": o,
                            Accept: "*/*"
                        }
                    };
                this.post(n, (t, e, i) => s(i))
            }).catch(t => this.logErr(t))
        }
        loaddata() {
            if (!this.isNode())
                return {}; {
                this.fs = this.fs ? this.fs : require("fs"),
                    this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e);
                if (!s && !i)
                    return {}; {
                    const i = s ? t : e;
                    try {
                        return JSON.parse(this.fs.readFileSync(i))
                    } catch (t) {
                        return {}
                    }
                }
            }
        }
        writedata() {
            if (this.isNode()) {
                this.fs = this.fs ? this.fs : require("fs"),
                    this.path = this.path ? this.path : require("path");
                const t = this.path.resolve(this.dataFile),
                    e = this.path.resolve(process.cwd(), this.dataFile),
                    s = this.fs.existsSync(t),
                    i = !s && this.fs.existsSync(e),
                    r = JSON.stringify(this.data);
                s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r)
            }
        }
        lodash_get(t, e, s) {
            const i = e.replace(/\[(\d+)\]/g, ".$1").split(".");
            let r = t;
            for (const t of i)
                if (r = Object(r)[t], void 0 === r)
                    return s;
            return r
        }
        lodash_set(t, e, s) {
            return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t)
        }
        getdata(t) {
            let e = this.getval(t);
            if (/^@/.test(t)) {
                const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t),
                    r = s ? this.getval(s) : "";
                if (r)
                    try {
                        const t = JSON.parse(r);
                        e = t ? this.lodash_get(t, i, "") : e
                    } catch (t) {
                        e = ""
                    }
            }
            return e
        }
        setdata(t, e) {
            let s = !1;
            if (/^@/.test(e)) {
                const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e),
                    o = this.getval(i),
                    h = i ? "null" === o ? null : o || "{}" : "{}";
                try {
                    const e = JSON.parse(h);
                    this.lodash_set(e, r, t),
                        s = this.setval(JSON.stringify(e), i)
                } catch (e) {
                    const o = {};
                    this.lodash_set(o, r, t),
                        s = this.setval(JSON.stringify(o), i)
                }
            } else
                s = this.setval(t, e);
            return s
        }
        getval(t) {
            return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null
        }
        setval(t, e) {
            return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null
        }
        initGotEnv(t) {
            this.got = this.got ? this.got : require("got"),
                this.cktough = this.cktough ? this.cktough : require("tough-cookie"),
                this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar,
                t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))
        }
        get(t, e = (() => { })) {
            t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]),
                this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                    "X-Surge-Skip-Scripting": !1
                })), $httpClient.get(t, (t, s, i) => {
                    !t && s && (s.body = i, s.statusCode = s.status),
                        e(t, s, i)
                })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                    hints: !1
                })), $task.fetch(t).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => {
                    try {
                        if (t.headers["set-cookie"]) {
                            const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();
                            s && this.ckjar.setCookieSync(s, null),
                                e.cookieJar = this.ckjar
                        }
                    } catch (t) {
                        this.logErr(t)
                    }
                }).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }, t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body)
                }))
        }
        post(t, e = (() => { })) {
            if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon())
                this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, {
                    "X-Surge-Skip-Scripting": !1
                })), $httpClient.post(t, (t, s, i) => {
                    !t && s && (s.body = i, s.statusCode = s.status),
                        e(t, s, i)
                });
            else if (this.isQuanX())
                t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, {
                    hints: !1
                })), $task.fetch(t).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }, t => e(t));
            else if (this.isNode()) {
                this.initGotEnv(t);
                const {
                    url: s,
                    ...i
                } = t;
                this.got.post(s, i).then(t => {
                    const {
                        statusCode: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    } = t;
                    e(null, {
                        status: s,
                        statusCode: i,
                        headers: r,
                        body: o
                    }, o)
                }, t => {
                    const {
                        message: s,
                        response: i
                    } = t;
                    e(s, i, i && i.body)
                })
            }
        }
        time(t, e = null) {
            const s = e ? new Date(e) : new Date;
            let i = {
                "M+": s.getMonth() + 1,
                "d+": s.getDate(),
                "H+": s.getHours(),
                "m+": s.getMinutes(),
                "s+": s.getSeconds(),
                "q+": Math.floor((s.getMonth() + 3) / 3),
                S: s.getMilliseconds()
            };
            /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length)));
            for (let e in i)
                new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length)));
            return t
        }
        msg(e = t, s = "", i = "", r) {
            const o = t => {
                if (!t)
                    return t;
                if ("string" == typeof t)
                    return this.isLoon() ? t : this.isQuanX() ? {
                        "open-url": t
                    }
                        : this.isSurge() ? {
                            url: t
                        }
                            : void 0;
                if ("object" == typeof t) {
                    if (this.isLoon()) {
                        let e = t.openUrl || t.url || t["open-url"],
                            s = t.mediaUrl || t["media-url"];
                        return {
                            openUrl: e,
                            mediaUrl: s
                        }
                    }
                    if (this.isQuanX()) {
                        let e = t["open-url"] || t.url || t.openUrl,
                            s = t["media-url"] || t.mediaUrl;
                        return {
                            "open-url": e,
                            "media-url": s
                        }
                    }
                    if (this.isSurge()) {
                        let e = t.url || t.openUrl || t["open-url"];
                        return {
                            url: e
                        }
                    }
                }
            };
            if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) {
                let t = ["", "==============📣系统通知📣=============="];
                t.push(e),
                    s && t.push(s),
                    i && t.push(i),
                    console.log(t.join("\n")),
                    this.logs = this.logs.concat(t)
            }
        }
        log(...t) {
            t.length > 0 && (this.logs = [...this.logs, ...t]),
                console.log(t.join(this.logSeparator))
        }
        logErr(t, e) {
            const s = !this.isSurge() && !this.isQuanX() && !this.isLoon();
            s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t)
        }
        wait(t) {
            return new Promise(e => setTimeout(e, t))
        }
        done(t = {}) {
            const e = (new Date).getTime(),
                s = (e - this.startTime) / 1e3;
            this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`),
                this.log(),
                (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t)
        }
    }
        (t, e)
}