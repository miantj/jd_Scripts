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

var _0xodG='jsjiami.com.v7';const _0x2b6489=_0x2da6;(function(_0x1c2b4f,_0x496d6a,_0x2796ae,_0x5680c9,_0x1595d7,_0x1f498b,_0x4c59d8){return _0x1c2b4f=_0x1c2b4f>>0x5,_0x1f498b='hs',_0x4c59d8='hs',function(_0x13b780,_0x4e7b0b,_0x597144,_0x3237b5,_0x184208){const _0x558fad=_0x2da6;_0x3237b5='tfi',_0x1f498b=_0x3237b5+_0x1f498b,_0x184208='up',_0x4c59d8+=_0x184208,_0x1f498b=_0x597144(_0x1f498b),_0x4c59d8=_0x597144(_0x4c59d8),_0x597144=0x0;const _0x400089=_0x13b780();while(!![]&&--_0x5680c9+_0x4e7b0b){try{_0x3237b5=parseInt(_0x558fad(0x22d,'L!qf'))/0x1+-parseInt(_0x558fad(0x1f5,'9h0&'))/0x2*(parseInt(_0x558fad(0x1e0,'jivs'))/0x3)+-parseInt(_0x558fad(0x1ca,'LT#['))/0x4+-parseInt(_0x558fad(0x1ec,'Azjj'))/0x5*(-parseInt(_0x558fad(0x1ff,'!c)c'))/0x6)+-parseInt(_0x558fad(0x224,'qQrg'))/0x7*(parseInt(_0x558fad(0x1bd,'J&Fl'))/0x8)+parseInt(_0x558fad(0x23b,'#ZrG'))/0x9+parseInt(_0x558fad(0x1c3,'BZkV'))/0xa;}catch(_0x5e00f5){_0x3237b5=_0x597144;}finally{_0x184208=_0x400089[_0x1f498b]();if(_0x1c2b4f<=_0x5680c9)_0x597144?_0x1595d7?_0x3237b5=_0x184208:_0x1595d7=_0x184208:_0x597144=_0x184208;else{if(_0x597144==_0x1595d7['replace'](/[KpOrFHfPQGdEMySbRV=]/g,'')){if(_0x3237b5===_0x4e7b0b){_0x400089['un'+_0x1f498b](_0x184208);break;}_0x400089[_0x4c59d8](_0x184208);}}}}}(_0x2796ae,_0x496d6a,function(_0x1b12cb,_0x279985,_0x20e382,_0x4873c1,_0x30fd42,_0x2d4bf2,_0x2ad56b){return _0x279985='\x73\x70\x6c\x69\x74',_0x1b12cb=arguments[0x0],_0x1b12cb=_0x1b12cb[_0x279985](''),_0x20e382=`\x72\x65\x76\x65\x72\x73\x65`,_0x1b12cb=_0x1b12cb[_0x20e382]('\x76'),_0x4873c1=`\x6a\x6f\x69\x6e`,(0x18fabc,_0x1b12cb[_0x4873c1](''));});}(0x1820,0x99644,_0x2352,0xc3),_0x2352)&&(_0xodG=0xc3);const _0x5e2f36=require(_0x2b6489(0x230,'YVqE')),_0x27cf3a=require(_0x2b6489(0x260,']kt^')),_0x113003=require(_0x2b6489(0x265,'J&Fl')),_0x53476d=require('./function/dylans'),_0x2ec67b=require('./function/dylib'),_0x35bea5=require(_0x2b6489(0x1ed,'zM@#'));function wanyiwan(){const _0x2e17e0={'FzxKe':function(_0x1eeb74){return _0x1eeb74();}};return new Promise(async _0x4b1234=>{const _0x142f8e=_0x2da6,_0x1304ff={'yVXEo':function(_0x48de86){const _0x3a8d41=_0x2da6;return _0x2e17e0[_0x3a8d41(0x1b5,'*Wn2')](_0x48de86);}},_0x3866eb={'url':_0x142f8e(0x1aa,'3duQ'),'body':_0x142f8e(0x24c,'9ZQL'),'headers':{'Cookie':cookie,'content-type':_0x142f8e(0x231,'NfOR'),'Origin':_0x142f8e(0x1d6,'z7Z3'),'Referer':_0x142f8e(0x1c4,'9EDz'),'User-Agent':$['UA']},'timeout':0x7530};$['post'](_0x3866eb,(_0x375ccc,_0x5a6211,_0x1894f5)=>{const _0x125145=_0x142f8e;try{_0x375ccc?$[_0x125145(0x237,'vQvD')](_0x375ccc):_0x1894f5?(_0x1894f5=$['toObj'](_0x1894f5),_0x1894f5['success']&&($[_0x125145(0x1a4,'KS]4')]=_0x1894f5['data'][_0x125145(0x210,'#ZrG')]||0x0)):$[_0x125145(0x204,'dQ[U')](_0x125145(0x1be,'$%tC'));}catch(_0x283672){$[_0x125145(0x236,'GHqI')](_0x283672);}finally{_0x1304ff[_0x125145(0x1b6,'n&Tk')](_0x4b1234);}});});}async function getuserinfo_6dy_bak(){const _0xe03296=_0x2b6489,_0x4d86ba={'dYzFB':function(_0x27ac07,_0x4adddc){return _0x27ac07===_0x4adddc;},'ZNKkm':_0xe03296(0x28b,'uHxQ'),'yZnGc':function(_0x4800b8,_0x19c72a){return _0x4800b8==_0x19c72a;},'fbwbR':function(_0x1ad63a){return _0x1ad63a();},'TYpst':'gzip,\x20deflate,\x20br','jtBdK':_0xe03296(0x1fe,'!yhJ')};let _0x3e527d={'url':_0xe03296(0x28d,'*Wn2'),'headers':{'Accept':'application/json,\x20text/plain','accept-encoding':_0x4d86ba[_0xe03296(0x1ea,'5O[e')],'content-type':_0x4d86ba['jtBdK'],'Cookie':cookie,'User-Agent':$['UA']}};return new Promise(_0x4ba7cf=>{const _0xb429c9=_0xe03296;$[_0xb429c9(0x27c,'KS]4')](_0x3e527d,async(_0x95bef6,_0x3882a3,_0x2371c2)=>{const _0x11e62b=_0xb429c9;try{if(_0x95bef6)console[_0x11e62b(0x22a,'UigO')](''+JSON[_0x11e62b(0x24a,'3%El')](_0x95bef6)),console[_0x11e62b(0x259,'K*s9')](_0x11e62b(0x279,'3%El'));else{if(_0x2371c2){_0x2371c2=JSON[_0x11e62b(0x1b4,'zM@#')](_0x2371c2);if(_0x4d86ba[_0x11e62b(0x218,'YVqE')](_0x2371c2[_0x4d86ba[_0x11e62b(0x234,'vQvD')]],'1001')){$[_0x11e62b(0x1e3,'vQvD')]=![];return;}_0x2371c2['retcode']==='0'&&_0x2371c2[_0x11e62b(0x21b,'GRFx')]&&($[_0x11e62b(0x1c0,'icdE')]=_0x2371c2['data']?.[_0x11e62b(0x269,'9h0&')]?.[_0x11e62b(0x1a7,'qQrg')]?.[_0x11e62b(0x247,'obk9')],$[_0x11e62b(0x262,'icdE')]=_0x4d86ba[_0x11e62b(0x1e9,'icdE')](_0x2371c2[_0x11e62b(0x22e,'obk9')]?.[_0x11e62b(0x25a,'qQrg')]?.[_0x11e62b(0x26e,'9ZQL')],0x1),$[_0x11e62b(0x23d,'!yhJ')]=$[_0x11e62b(0x266,'vU^m')],$[_0x11e62b(0x241,'GwCg')]=_0x2371c2[_0x11e62b(0x27d,'EfuD')]?.['userInfo']?.[_0x11e62b(0x1e5,'vQvD')]||'',$['beanCount']=_0x2371c2[_0x11e62b(0x1f7,'7E)G')]?.[_0x11e62b(0x226,'*Wn2')]?.['beanNum']||0x0);}else $[_0x11e62b(0x285,'pvyr')]('京东服务器返回空数据');}}catch(_0x30c51f){$[_0x11e62b(0x256,'K*s9')](_0x30c51f,_0x3882a3);}finally{_0x4d86ba['fbwbR'](_0x4ba7cf);}});});}async function getuserinfo_6dy(){const _0x3e1a32=_0x2b6489,_0x226259={'FMNTu':function(_0x46fba6,_0x521973){return _0x46fba6===_0x521973;},'xUjck':'retcode','Ghqoj':function(_0x494895,_0x484d04){return _0x494895==_0x484d04;},'zimlz':function(_0x440f05){return _0x440f05();},'JmcuZ':_0x3e1a32(0x1cb,'pvyr'),'cuUGU':_0x3e1a32(0x228,'Azjj'),'rrgKY':'wx91d27dbf599dff74','EImaq':'1999de6cba778f25f29720b0bbf7ff8b','pOams':_0x3e1a32(0x1c5,')$T&'),'dMeUU':_0x3e1a32(0x1e1,'5E)]'),'DaKBz':'ad171','lWufd':'jdmini-wx-search','yjAur':_0x3e1a32(0x21d,'GRFx'),'SsCAS':_0x3e1a32(0x1ef,'icdE'),'ZfXRW':_0x3e1a32(0x1de,'3%El')};let _0x1131d4={'orgFlag':_0x3e1a32(0x215,'5O[e'),'callSource':_0x226259[_0x3e1a32(0x21a,'dQ[U')],'channel':0x1,'isHomewhite':0x1,'bizModelCode':'6','externalLoginType':'1','bizModeClientType':_0x226259[_0x3e1a32(0x1ba,'jivs')],'appId':_0x226259[_0x3e1a32(0x1d0,'GRFx')],'token':_0x226259[_0x3e1a32(0x286,'GHqI')],'tenantCode':_0x226259['pOams'],'uuid':'','client':_0x226259[_0x3e1a32(0x268,')$T&')],'sourceType':'wx_inter_navigator_myjd'},_0x5193b9={'appId':_0x226259[_0x3e1a32(0x288,'3duQ')],'functionId':_0x3e1a32(0x27f,'!xW8'),'body':_0x1131d4,'appid':_0x226259[_0x3e1a32(0x1e2,'BZkV')],'client':_0x226259[_0x3e1a32(0x22f,'YVqE')],'user':$[_0x3e1a32(0x222,'5E)]')],'code':0x0,'ua':$['UA']};_0x1131d4=await _0x53476d['getbody'](_0x5193b9);let _0x23505b={'url':_0x3e1a32(0x20b,'vnC&')+_0x1131d4+_0x3e1a32(0x1b7,')$T&'),'headers':{'Accept':_0x226259['yjAur'],'accept-encoding':_0x226259['SsCAS'],'content-type':'application/json;charset=UTF-8','referer':_0x226259['ZfXRW'],'Cookie':cookie,'User-Agent':$['UA']}};return new Promise(_0x243816=>{const _0x35f5a0=_0x3e1a32,_0x1714eb={'ARQtH':function(_0x5b885a,_0x49da11){const _0x38e1b8=_0x2da6;return _0x226259[_0x38e1b8(0x1f9,'3duQ')](_0x5b885a,_0x49da11);},'xCCdO':_0x226259['xUjck'],'XtSKZ':function(_0x246b18,_0x297a89){const _0x1aea6c=_0x2da6;return _0x226259[_0x1aea6c(0x214,'Azjj')](_0x246b18,_0x297a89);},'cTVeH':function(_0xa9ad6f){const _0x414ef6=_0x2da6;return _0x226259[_0x414ef6(0x25f,'*Wn2')](_0xa9ad6f);}};$[_0x35f5a0(0x271,'eat@')](_0x23505b,async(_0x329756,_0x58c9d4,_0x416c96)=>{const _0x1ae286=_0x35f5a0;try{if(_0x329756)console[_0x1ae286(0x206,'^qsu')](''+JSON[_0x1ae286(0x270,'!c)c')](_0x329756)),console[_0x1ae286(0x1af,'!c)c')]('getuserinfo_6dy请求失败，请检查网路重试');else{if(_0x416c96){_0x416c96=JSON[_0x1ae286(0x264,'!xW8')](_0x416c96);if(_0x1714eb[_0x1ae286(0x1b8,'9EDz')](_0x416c96[_0x1714eb[_0x1ae286(0x240,'GwCg')]],'1001')){$[_0x1ae286(0x1fa,'L!qf')]=![];return;}_0x416c96['retcode']==='0'&&_0x416c96[_0x1ae286(0x1bf,'LT#[')]&&($['levelName']=_0x416c96[_0x1ae286(0x22b,'YTgt')]?.['userInfo']?.[_0x1ae286(0x1a7,'qQrg')]?.['levelName'],$[_0x1ae286(0x232,'L!qf')]=_0x1714eb['XtSKZ'](_0x416c96[_0x1ae286(0x245,'#ZrG')]?.[_0x1ae286(0x257,'$%tC')]?.[_0x1ae286(0x1ab,'5O[e')],0x1),$[_0x1ae286(0x1a8,'3duQ')]=_0x416c96[_0x1ae286(0x255,'jivs')]?.[_0x1ae286(0x246,'K*s9')]?.['baseInfo']?.[_0x1ae286(0x1d9,'*Wn2')]||$[_0x1ae286(0x222,'5E)]')],$[_0x1ae286(0x1e6,'9EDz')]=_0x416c96[_0x1ae286(0x1b9,'vQvD')]?.[_0x1ae286(0x24e,'NfOR')]?.['isRealNameAuth']||'',$[_0x1ae286(0x253,'LT#[')]=_0x416c96['data']?.[_0x1ae286(0x20a,'9EDz')]?.[_0x1ae286(0x23f,'*Wn2')]||0x0);}else $[_0x1ae286(0x1a2,'*Wn2')](_0x1ae286(0x272,'pvyr'));}}catch(_0x1ee954){$[_0x1ae286(0x1d8,'YTgt')](_0x1ee954,_0x58c9d4);}finally{_0x1714eb[_0x1ae286(0x27e,'UigO')](_0x243816);}});});}function _0x2da6(_0x10735e,_0x43cd62){const _0x235276=_0x2352();return _0x2da6=function(_0x2da602,_0x3940ef){_0x2da602=_0x2da602-0x1a2;let _0x25141e=_0x235276[_0x2da602];if(_0x2da6['eUElmi']===undefined){var _0x537244=function(_0x1524e8){const _0x312fae='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x58fd16='',_0x42cf81='';for(let _0x443ae8=0x0,_0x1b4fd7,_0x2bfe01,_0x13834b=0x0;_0x2bfe01=_0x1524e8['charAt'](_0x13834b++);~_0x2bfe01&&(_0x1b4fd7=_0x443ae8%0x4?_0x1b4fd7*0x40+_0x2bfe01:_0x2bfe01,_0x443ae8++%0x4)?_0x58fd16+=String['fromCharCode'](0xff&_0x1b4fd7>>(-0x2*_0x443ae8&0x6)):0x0){_0x2bfe01=_0x312fae['indexOf'](_0x2bfe01);}for(let _0x12d6be=0x0,_0x4d04c8=_0x58fd16['length'];_0x12d6be<_0x4d04c8;_0x12d6be++){_0x42cf81+='%'+('00'+_0x58fd16['charCodeAt'](_0x12d6be)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x42cf81);};const _0x1f7abd=function(_0xa6ab9a,_0x141c07){let _0x3dfd05=[],_0x49e7d7=0x0,_0x151f84,_0x2904c6='';_0xa6ab9a=_0x537244(_0xa6ab9a);let _0x246144;for(_0x246144=0x0;_0x246144<0x100;_0x246144++){_0x3dfd05[_0x246144]=_0x246144;}for(_0x246144=0x0;_0x246144<0x100;_0x246144++){_0x49e7d7=(_0x49e7d7+_0x3dfd05[_0x246144]+_0x141c07['charCodeAt'](_0x246144%_0x141c07['length']))%0x100,_0x151f84=_0x3dfd05[_0x246144],_0x3dfd05[_0x246144]=_0x3dfd05[_0x49e7d7],_0x3dfd05[_0x49e7d7]=_0x151f84;}_0x246144=0x0,_0x49e7d7=0x0;for(let _0x1befd6=0x0;_0x1befd6<_0xa6ab9a['length'];_0x1befd6++){_0x246144=(_0x246144+0x1)%0x100,_0x49e7d7=(_0x49e7d7+_0x3dfd05[_0x246144])%0x100,_0x151f84=_0x3dfd05[_0x246144],_0x3dfd05[_0x246144]=_0x3dfd05[_0x49e7d7],_0x3dfd05[_0x49e7d7]=_0x151f84,_0x2904c6+=String['fromCharCode'](_0xa6ab9a['charCodeAt'](_0x1befd6)^_0x3dfd05[(_0x3dfd05[_0x246144]+_0x3dfd05[_0x49e7d7])%0x100]);}return _0x2904c6;};_0x2da6['MIpLtr']=_0x1f7abd,_0x10735e=arguments,_0x2da6['eUElmi']=!![];}const _0x147e91=_0x235276[0x0],_0x25a246=_0x2da602+_0x147e91,_0x1dbcf6=_0x10735e[_0x25a246];return!_0x1dbcf6?(_0x2da6['bGUkUt']===undefined&&(_0x2da6['bGUkUt']=!![]),_0x25141e=_0x2da6['MIpLtr'](_0x25141e,_0x3940ef),_0x10735e[_0x25a246]=_0x25141e):_0x25141e=_0x1dbcf6,_0x25141e;},_0x2da6(_0x10735e,_0x43cd62);}async function _0x8296d8(){const _0x835615=_0x2b6489,_0x1aa71d={'ZluRE':function(_0x4e2a96){return _0x4e2a96();},'SKsZQ':'https://huiyuan.m.jd.com','JZONA':_0x835615(0x283,'!c)c')};let _0x95e812={'url':'http://api.m.jd.com/client.action','body':_0x835615(0x24d,'qQrg')+Date[_0x835615(0x1cd,'$%tC')]()+_0x835615(0x250,'9ZQL'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Origin':_0x1aa71d[_0x835615(0x28c,'dQ[U')],'Referer':_0x1aa71d['JZONA']}};return new Promise(_0x342273=>{$['post'](_0x95e812,async(_0x2b65ae,_0x1c7fdd,_0x599437)=>{const _0x6e181a=_0x2da6;try{_0x2b65ae?(console[_0x6e181a(0x25e,'!yhJ')](''+JSON[_0x6e181a(0x1d4,'*Wn2')](_0x2b65ae)),console[_0x6e181a(0x22a,'UigO')]('getuserinfo_6dy请求失败，请检查网路重试')):($['JingXiang']=_0x599437['match'](/"score":(\d+)/)?_0x599437[_0x6e181a(0x1a3,'GwCg')](/"score":(\d+)/)[0x1]:0x0,$[_0x6e181a(0x1fd,'NfOR')]=_0x599437[_0x6e181a(0x1b1,'UigO')](/"currentBeanNum":(\d+)/)?_0x599437[_0x6e181a(0x287,'obk9')](/"currentBeanNum":(\d+)/)[0x1]:0x0,$[_0x6e181a(0x261,'9ZQL')]=_0x599437['match'](/"showName":"(.*?)"/)?_0x599437[_0x6e181a(0x238,'ac@N')](/"showName":"(.*?)"/)[0x1]:$[_0x6e181a(0x1b0,'^qsu')]);}catch(_0x3e953e){$[_0x6e181a(0x248,'dQ[U')](_0x3e953e,_0x1c7fdd);}finally{_0x1aa71d[_0x6e181a(0x1f8,'vQvD')](_0x342273);}});});}async function queryScores(){const _0x1f0104=_0x2b6489,_0x190c0f={'KcSVe':_0x1f0104(0x20f,'9h0&'),'gByeZ':'plus_business'};let _0x638294='',_0x57557a={'appId':_0x1f0104(0x200,'YVqE'),'functionId':_0x190c0f[_0x1f0104(0x277,'n&Tk')],'body':{},'appid':_0x190c0f[_0x1f0104(0x205,'uHxQ')],'user':$[_0x1f0104(0x25d,'pvyr')],'code':0x0,'ua':$['UA']};body=await _0x53476d['getbody'](_0x57557a);let _0xe58fad={'url':'https://api.m.jd.com/api?'+body+_0x1f0104(0x21e,'KS]4'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Referer':_0x1f0104(0x1d2,'eat@')}};return new Promise(_0x17ddf3=>{const _0x41d635={'vlVpL':function(_0x19d5c3,_0x41197c){return _0x19d5c3==_0x41197c;}};$['post'](_0xe58fad,async(_0x1fd5a0,_0x415952,_0x28a29c)=>{const _0x3787d8=_0x2da6;try{const _0xe9977c=JSON[_0x3787d8(0x208,'*Wn2')](_0x28a29c);_0x41d635[_0x3787d8(0x23c,'!xW8')](_0xe9977c[_0x3787d8(0x1e7,'zM@#')],0x3e8)&&($['PlustotalScore']=_0xe9977c['rs'][_0x3787d8(0x24b,'!c)c')][_0x3787d8(0x267,'&AB6')]);}catch(_0x54b902){$[_0x3787d8(0x237,'vQvD')](_0x54b902,_0x415952);}finally{_0x17ddf3();}});});}async function fruitinfo(){const _0x5c658d=_0x2b6489,_0x5197a4={'DZcrc':_0x5c658d(0x1dc,'z7Z3'),'eLZPA':function(_0x456267){return _0x456267();},'IOWNf':_0x5c658d(0x1fc,']kt^'),'KMCCN':_0x5c658d(0x282,'YTgt'),'QyEJU':_0x5c658d(0x217,'gfql')};return new Promise(_0x41b920=>{const _0x3bf05b=_0x5c658d,_0x5dc9d1={'RmKXB':_0x5197a4[_0x3bf05b(0x227,'9ZQL')],'LRSiU':function(_0x8b9a0a){return _0x5197a4['eLZPA'](_0x8b9a0a);}},_0x44634f={'url':_0x3bf05b(0x1f0,'jivs'),'body':'body='+encodeURIComponent(JSON['stringify']({'version':0x18,'channel':0x1,'babelChannel':_0x5197a4[_0x3bf05b(0x289,'!xW8')],'lat':'0','lng':'0'}))+'&appid=wh5','headers':{'accept':_0x3bf05b(0x1dd,')$T&'),'accept-encoding':_0x5197a4[_0x3bf05b(0x249,'eat@')],'accept-language':_0x5197a4[_0x3bf05b(0x216,'J&Fl')],'cookie':cookie,'origin':_0x3bf05b(0x1bb,'BZkV'),'referer':_0x3bf05b(0x1fb,'*#O0'),'User-Agent':$['UA'],'Content-Type':_0x3bf05b(0x26b,'YVqE')},'timeout':0x2710};$[_0x3bf05b(0x1b2,'!yhJ')](_0x44634f,(_0x3caf7f,_0x5cb95d,_0x55d16b)=>{const _0x4b2670=_0x3bf05b;try{_0x3caf7f?(!llgeterror&&(console['log'](_0x5dc9d1[_0x4b2670(0x26f,'LT#[')]),console[_0x4b2670(0x276,'vU^m')](JSON[_0x4b2670(0x202,'YTgt')](_0x3caf7f))),llgeterror=!![]):(llgeterror=![],safeGet(_0x55d16b)&&($['farmInfo']=JSON[_0x4b2670(0x275,'LT#[')](_0x55d16b),$[_0x4b2670(0x220,'uHxQ')][_0x4b2670(0x242,'pvyr')]&&($[_0x4b2670(0x1cf,'9EDz')]=$[_0x4b2670(0x280,'#ZrG')][_0x4b2670(0x1d7,'!xW8')]['name'],$['JdtreeEnergy']=$[_0x4b2670(0x229,'Azjj')][_0x4b2670(0x21f,'KS]4')]['treeEnergy'],$[_0x4b2670(0x1b3,'vQvD')]=$[_0x4b2670(0x209,'*Wn2')][_0x4b2670(0x21c,')$T&')]['treeTotalEnergy'],$[_0x4b2670(0x1db,'EfuD')]=$[_0x4b2670(0x20d,'$%tC')]['farmUserPro'][_0x4b2670(0x27b,'9h0&')])));}catch(_0x45aade){$[_0x4b2670(0x1c2,'*Wn2')](_0x45aade,_0x5cb95d);}finally{_0x5dc9d1[_0x4b2670(0x233,'EfuD')](_0x41b920);}});});}async function fruitnew(_0x366556=0x1f4){const _0x331118=_0x2b6489,_0x5ac2b1={'TZJSg':_0x331118(0x252,'7E)G'),'quMJu':_0x331118(0x244,'pvyr')};let _0x5678df={'version':0x1},_0x412174={'appId':_0x331118(0x1c8,'n&Tk'),'fn':'farm_home','body':_0x5678df,'apid':_0x5ac2b1[_0x331118(0x207,'vU^m')],'ver':$['UA'][_0x331118(0x1d5,'#ZrG')](';')[0x2],'cl':_0x331118(0x1c7,'icdE'),'user':$[_0x331118(0x243,'EfuD')],'code':0x1,'ua':$['UA']};_0x5678df=await _0x27cf3a['getbody'](_0x412174);let _0x58ee0c={'url':JD_API_HOST+'?'+_0x5678df,'headers':{'Host':_0x5ac2b1['quMJu'],'Accept':_0x331118(0x274,'5O[e'),'Origin':_0x331118(0x203,'KS]4'),'Accept-Encoding':'gzip,\x20deflate,\x20br','User-Agent':$['UA'],'Accept-Language':_0x331118(0x273,'LT#['),'Referer':'https://h5.m.jd.com/','Cookie':cookie},'timeout':0x7530,'ciphers':_0x2ec67b[_0x331118(0x25c,'z7Z3')]};return new Promise(_0x10e6f1=>{setTimeout(()=>{const _0x300e79=_0x2da6,_0x27c13f={'XOBex':function(_0x3d983b,_0xc02968){return _0x3d983b(_0xc02968);}};$[_0x300e79(0x213,'ac@N')](_0x58ee0c,(_0x52d97a,_0x436094,_0x538069)=>{const _0x59b772=_0x300e79;try{_0x52d97a?(console[_0x59b772(0x258,'qQrg')](_0x59b772(0x281,'dQ[U')),$[_0x59b772(0x1c2,'*Wn2')](_0x52d97a)):(_0x538069=JSON[_0x59b772(0x254,'UigO')](_0x538069),$['fruitnewinfo']=_0x538069[_0x59b772(0x28a,'gfql')]?.[_0x59b772(0x1ae,'J&Fl')]||'');}catch(_0x3e85db){$['logErr'](_0x3e85db,_0x436094);}finally{_0x27c13f['XOBex'](_0x10e6f1,_0x538069);}});},_0x366556);});}async function checkplus(){const _0x4760a7=_0x2b6489,_0x5eab88={'SRWfA':function(_0x59efcd){return _0x59efcd();},'bvewF':_0x4760a7(0x1f6,'GRFx'),'YwlLN':_0x4760a7(0x23e,'9ZQL'),'pRVZH':'user_getUserInfo_v2'};let _0xc8939a={'contentType':_0x5eab88['bvewF'],'qids':_0x4760a7(0x1df,'#ZrG'),'checkLevel':0x1},_0x55873a={'appId':_0x5eab88['YwlLN'],'functionId':_0x5eab88[_0x4760a7(0x239,'5E)]')],'body':_0xc8939a,'appid':_0x4760a7(0x26c,'J&Fl'),'user':$['UserName'],'code':0x1,'ua':$['UA']};_0xc8939a=await _0x53476d['getbody'](_0x55873a);let _0x5c58b9={'url':_0x4760a7(0x1f1,'GwCg'),'body':_0xc8939a,'headers':{'User-Agent':$['UA'],'Cookie':cookie,'Origin':'https://plus.m.jd.com','Referer':_0x4760a7(0x1f4,'5O[e')}};return new Promise(async _0x58845f=>{$['post'](_0x5c58b9,async(_0x1c8fea,_0x5ec571,_0x4a0efd)=>{const _0x81e36d=_0x2da6;try{if(_0x1c8fea)console[_0x81e36d(0x1c6,'&AB6')](''+JSON[_0x81e36d(0x1eb,'K*s9')](_0x1c8fea)),console[_0x81e36d(0x204,'dQ[U')]('\x20API请求失败，请检查网路重试');else{_0x4a0efd=JSON[_0x81e36d(0x1c1,']kt^')](_0x4a0efd);if(_0x4a0efd[_0x81e36d(0x1e7,'zM@#')]==0x1a1b98)$[_0x81e36d(0x221,'9h0&')]=_0x4a0efd['rs'][_0x81e36d(0x1f3,'KS]4')][_0x81e36d(0x1c9,'3duQ')]?!![]:![];else{}}}catch(_0x726016){$[_0x81e36d(0x26a,'!c)c')](_0x726016,_0x5ec571);}finally{_0x5eab88['SRWfA'](_0x58845f);}});});}function _0x2352(){const _0x4f5708=(function(){return[...[_0xodG,'RQPOjrdMsKjbFiSKamViQ.Gcpom.yv7yGHEVfGpR==','W7dOG7dLH7dMJkhcGspLHyxNUyJLJjqz','E1FcKL09WRrqW5ZdS8kGhKunqctcLaW','WRpdHmkmt8oCDCkqsMRcQJvUvCoLegrPaHbcWR7cUSk1bSkaBSoRWQThW5ldNWZdN3ddOvupW6miWQlcIxrothDwW7zPW5e/DmohW60','gColg3xcGWyYW7RdOdtdPSoHamkrWRldU8oMt2VdLdjUwJBdJCkbae3cOMHKf8o4W7n5W6uBi8onW6RdTmo5WOi+WRRdPttcTmk2dwqKbSkAja','iuhdTcddGq','WOBcJ0ZdKmo3WOpcICkWm8knBNC6zSo3W4u','nmomW55lW5pdUmoSWR7cH2JdQ8kiE8kYWPpcPGSvCJXOEG','W7tdHSkoW6tcLSk4WOe','W7hcTYxcOmkScWiwW4VcJCoHsXqnk04kl8ocW7Df','W65nFCo2','W57dGSoBW53dVq','WP5aW68xW4C','W5T3W5XtW4f0W4u','pHdcN8knW5pdKrdcSrVcUwD1WR7dLutdM8knWOOinSksWRyE','W55HWOy','bW7dGM7cM29Wt8oU','W4RcQLhdMmkiWQVcSYibeCodWR/cKmogWRPijCocnru7mK/cHSomWPK4g8kBmG','w8kmuSk2BJaky3KDuW','W7FcQtT8WOO','vtlcKmoClqq+WOfsW40yW5S','dCkox8kAW4WVnZ7cGG','WP7cL03dK8orW4RdG8oTgCozm39DySo1WOtdJSk4dq','WRzqma','tICRW4ep','ieddNW','WQlcHNldIbC','WQVcNgZcNSoM','WR3cNgZcGmokpqlcVG','WOjoW5W9WO9xmCoUrW','W70CeMVcKCoTW5JdGSkdW51Iz1hdHSodW5/dQrhdSCokkJTbimkdoCogngpcGSkaWRi/WOm','wHaWW6C6WRZdHq','sCoMx8k7WRr5W4JdPW','CuddK1NcGHpcNa','WRxdUCkvW6hcM8keWQJdTCkFW61SjMpdVqBdS8kSuSkccCkctWC4Cq','WPRcKrRcOuRdIa','WRL9W5eVW5TWz8kEEf91Bwa0W7tcOdxcR8oIhaNcJHdcRSoYWRPjW43dMYndsbC','WOq3WQinWPaOWP/cHWjbk07dLq','WPzeWPO','eelcPHOg','fSo8W7vRW4NcRmkeW77cGLVdKmkEiG','l05GWQVcNa','WPFcQmkSlKvlWPTUyMX4xZVdGq','W7hdHNjCWQ4','fmoex8kZohjiChGCmbJcKwfjjSo5W7y','WPbsnmoXEq','WQtcIwpcNG','C8knW53dHHaSWO/dQvFcNSks','WQhcMgFcK8o2n1C9WPFcVCk5o0yHFx8xpSoPWQmpnfqchCkrW73dPa','W5dcJ1BdHmolWP7cUmk7aCkjicbvzmo+W43dHmk5n3lcJs4rW74','WPdcGKVdJSo3WOpcICkWiCkECG','tWqGW4KCWRBdHSkR','WQVdO8kRW6NcRCkyWPddQmkD','W6SOm1OFCc7dSa','dcldGLdcOG','xmkGW6ylu20o','W4pdMGhcKmktW4JcTmkkmmkGDN8','WRRcJM3cImo3gGRcT8o7','WPjUWOdcKCka','aflcMHWcW7SnW5u1WPpcISk7xG','muVcPrGLW7W7W4G','W7ldKa8','gSkBwCks','eti8W4FcR0JcMmkuW7pdVWiCWRikW77dNLeWhM3dOEISMoAWUEwNRoI2T++/IoIVQEAJNUAEUoE8IUI1GUMfO+IVUG','WOC9WQGpWPCLW7pcQWzhewW','W5FcQfKu','W7hdKM1pWRK','WRVcSg5VWOjrdmovWOVdOdpcG0RcNSk1xXa','bbVdK2ZcSwnKvCoZWPXEWO1BlmkCgZ7dMCoJmYO9WOmchfTheSk2WOXJxSkW','W5T3W4bqW5nUW73cIJC','q8o5W4vUW4C','W57dOmoLW6tdLq','W7PJFSo+vLD2W5hcPrK4mq','wc3cNSk3mLG','W6JdGCojW4RdISku','WPXaWPPtWRC','W44jahiz','W4pdLNtdLmoMWQJcTCkR','W5NdKuNdSHdcMf4ZWQfCWQKSCG'],...(function(){return[...['mh7dGKdcMG','W4xcS0ldN8kVWQNcVZm','WRqcW5dcHCkf','WRNcMh/cG8onjGK','cCo8lghcVW','gmompwdcKvbtWRtdRchdJSk6gCox','WQO7nmkJoXfJW6tcUYaK','wSoyW7n1W5ZcJ8k+ea','WQ0Ql8oGa0XSW7ldHteKkW','WOVcGW/cOG','W4G6WRlcU0tcNMjB','W5/cRfSqWQ9eo8k8za','WRzqmmobuCkH','fXyrW63cTq','W5/dI8ooDhbWWPJcGmoJ','fSopa8oWdZKryhiFDKJdKMb8i8kHWRdcIa','WRbbWO3cGmkxCc5rhwBdRZHAw8oOW7lcPtJdRwBdOK7dQh/dQZy6WQqHkcdcJdmVW4uUW6vpsJjlWPHVs19/ymo2W49FtCkEWOjgW6Xmi8oPeSonWPRdLmoPW4lcVmoSgCk2W7uwyCkLW7xdOJBcS8kKWPONW5/cJ8o+WOTSWQ8MweRcNCotWO3dL8kFsmkICJZdOspdQYKmamkcW4ioWP4xvb3cLCoLWPjlq8oXW5JdK8opW7PJW6tdNYemWQeFW78oW7inomoxWRnDW5tcK8k2WQJdOSktedjcdmk/ys7cGZqOW47dHG','dCkhW48bC0GLlWXBbHatWP/cPtNcNSksj8kGWP/cHZVdMMbencZdJSkYW7ddN07dM00sWR54y8o2W6rOaeJdRhy4ANBcHSkmyN4vW4FdO8kBcmk8tJG','ebJdHNlcKw5JtG','W4ldLGRcMSksW4hdMSkGcmkAsh4B','W7byWOZcHmkkDXvgjgFdR34jrCoPW53cRsBdIK7dQeJdVYFcPse8WRKTDdxcId0PW488WPeox0PmWOCyCc4immoRWR0UaCoiWOy/WQ83tmo+uCkPWOJcNSo7W4xdS8o4hCoQWRzapSozWQZcPglcPSkIWPGYW5xdTSo9W51EW7P9dGpcK8oBWPZdKmome8oKpMRdK1NcQxCmrSoqWP4FWPiabvZdISk2W4Gnu8kKWOhcGSkjWRHOW6pdJcDnW7GCW7DkWPvAFmkCW6SfWOVcNSkIWQNdVSkedenbvSk4FJpdMN9VWPdcJYpcLCoTyrCWW6LHrM7dObBdOCoOgdNdL8key8oxmmk2weBdLmoBWQfba2hdGSorWOpcVvKwimoBDHe8W57cGYpdUCkcACkRWP18m0auW7fiW6VcKmklvCorW6/dV8kKW6zgWQCanaeKW4NdMHBdL1ddLCkjeJxcULOXqgxdK359rHZcT8kJWPVdKZZcI8kLf8k7W6Tgk8ozchpdJCk2BrNdUNNdNNeQfCkEpY49e8kDdtmEEmk3W4LgtCkPhgikDCkYW6XVW7e9W6nVybP8iSocW6hdOqKDW5HFWRrEW4yBuvrOCSk5mSkTW5ldHWVcVHmbgSk5WRX7W4DUW5BcL8kutdXGbbWLWRtdRSkdW7VcGb4pW7jcWOtdUH7dQMD7gc7dTeNdGvriAW','dSkvxSkh','W7LfBSo5iuv6W5uKtW','W5W1wCo0W6yShWJdTq','W67dNHPLWOu','WR/dKCkmxG','W5eMWRdcJh/cGG','wSo0smkKWRr5W4JdPW','b8kDW4y','W5eMWRa','hSkbW4qqtK8SlG','qreMW5qMW6lcJ8oRW4tdKCkDW50GW4tdSSkAfCkiWOFcL8o9puqdDCk/WR7dGmooWRNcRmo8WO42smkrWR3cQ24gW4RdO8ohWPVcTmkcWO96pSoRWODubrtcUCkxAh18eNLRB2O','W5KlWR9aoG','WPKPi8k8ianRW7m','W4FcTuy','WQhcLhpcGCo5','W4f8W5hdPZjmW5CNW5VcU8k4l1pcOmkfW4iA','WRHDWOdcImkTEcXA','Dv7cQ0fKW6DIW5ddPq','xc3cJCkTi0i1WOSsW4SB','nNpdPKpcSW','ubHdWPtcP8k3CSoVk8ozySktW4DAq8kCW7m','WQpcR13dQt7cVv7dJa','kCocW6zeWRpcLmomdmoUW5q','CCkHW4RdVHa','WRFdO8kEW7FcKCkfWQddRG','d8otaCohlJi','W7tdR3H2WOvrgCoiWO3dOxldIeVdN8kJrHaJWOPnW5WTW6/dI8kUmY9YWRJcUCkNWR/cQq','dLTqWPlcLSk2C8o1lCozkmkeW40','ldOGW53cNG','WR9hWRpcJ8kwAHDwja','W6W9C8ocW6C','emoifmoRmICwCMm','oZ4M','5lMG5lMg5P2l5yMV5zIg6l625zUy56US5PAB5OY8','W4q4fCozW6TVea7cRcrZtCoCDSkLkCkYW5ddOW','DSkxWOa','W44XsSoPW4a','WPRcS18','c8obW73dTSk7','uCkktmkuW4C7CtxcMSkaW7ZcTmomWQftWOXpWQuZWOX1aCkKqCovyCkwWP19wWxdJmox','W4VdMSoiAg1YWOpcJ8o0WOFcGmkcWP3dRd/ORQBMS4BLPyFOTk/VVA3ORjpMOPxMNA/NVO3OTOFPH4RORk0','qcpcISkz','WRBdOSkEW6dcI8kFWQFdTCki','WPhcHK0','A8okW6jM','W73dQZ5ZWQG','axFdOhRcKGRcQXldUMZcMMVdSL5sFg5VWPm2dCoQDq','WONcGWNcRM/dGWW4','5PwQ5yAJ5z2T5P2H6k+b5AEI6lwE','gCkarmkdWO5OoJ3cNCkEW7BcPCoDW6qDWOKs','c8oieSoYl3Pqo3ipBfJdNwrbBSkJW6ZcH8kYbMBcVmktmG','W40QnhC4FYxdUG','WQa1iq','CqVcLmktmq','W57cQfKwWQS','WPXSW6ObW4G','d13dG37cSa','WONcOCo1da','wWaMW4C6WRZdHq'],...(function(){return['WOL0jmoECG','WRpcIwRcNCoWAuVdVSo5bmkjpblcV8oUWQvDW43cM8oaWOxcMmoqW67cLdhcVCkgpNVdICkZWPmHW7BcI8k8f8ooWOvEnhW1je/dKSorgatcHHHEW4i','W4CrWOOgW64','WRFcKNK','hmoEg2BcMa','WOhcMK7dVmorWPpcG8kWfa','W6Stb3a6','W5mYoeefCdddVSkAB8owfIlcOSo+g8klF8kXWPKgeW','cCktW5ihtK8SlG','WRzKW4iOW7XYA8kp','W5lcUv0zWQy','WRb5W5uZW4ePkCofCebYBgDPW7hcQJFdRmo5ff7cM0/cT8kHWR1vW43cLhCacfnPfmobWRbLWORdI8kZxHr9gIWkvg0','nColW7PxW5xcSCkvW7JcHW','WQpcH1tcMSol','W7bejmoucG1FW4P3c8kmWPfkWPy','dfjwWPtcPCkG','d8otaq','gvZdNqFdNreSWQy','W7pdNHX1WOG','W5VcTvldGa','W47dISoAW73dNCkdWRxdQSk/iSotn1mUWQj7WPe','WPBdHmoGWOhcUW','WP3cH2BcPSoM','oCo0W7BdPCkX','m8klW7ddNZXIWOBdQchcI8kIjmoVjCodpcZcKCkntrlcReldIq','WQjVW74SWRm','W6ddJ8oAW64','WRJdHCkTEmo6','FJf/DelcI8ojW4BcNJ8vWPlcJSofiMuuhIBdSaFdGg8','gConW41jW7m','sGiwW5JdUCoLmmoKpCobgmkBW5y','5PYI5yIM5zMf6lYc5zIJ56MT5PEE5O+M','W5OXtmo7','CeJcJuH9W5PvW5tdSa','WP8YW4xdOtK','WRFcKNNcQmoXiq','j3e8mapcICoxW5NcTtauWOBcHmkI','WOTjW5SOWOGKCmkNwmk6WQRcOdRcMYO8WQ/cLtmIW7a','F8klW4ldGIS2WPNdVG','mCocW7u','DulcIa','i8kxWPNdHSoO','WR1JW4uhW5nQDq','WOPHcCkUWPXYwa/dIIv6uSom','WRSInSk8aqv0W7FcHG','hsBcH8kZW5m','qCoOwG','WOy1WQeiWP8SWPNcIGXceNddMa','WQLzW6K5WOLZd8o6r8kSWOVdRZRdKa','WRlcMNdcTmog','WP9JW5CYW5C','nc8MW57cIbpdHmoqW5ZdKb8oW7ijWRxdMgv/gMFcRmoacCk0W7xcRgPTCIZdHmoasZZdHCoPW7/cQmkTWPC','W5KfW4ldSXj8W6q','WQJcIwZcHmoTna3cT8oT','WPZcKHFcQLi','W5ipWRHeo2JcO8kTuKddUCkWWQTwzmoRjmkgW7hcLq','ihpdPL3cGYZcVqxdMfFcMW','eSkvsSk2W5a6','WRxcLh3cHSoTmGNcTa','W6jyFCoNnXSkWO0TcSoyWO8jWOhdGYpdV8oPW7ddVmkzWRuxeCksWR1KESk9W5vvlaVdR8k4B8kqWQy+AwtcUSon','E8ozW7nIW4hcMSkYatO','WRdKUAFKU5dLHQJLNBjOWQZdG3j75P2Z6k286kYX5Rc65As/6lAQkUkdME+6KEkdHo+7Nq','p8odWOu','W4tdI8oiBw0TW57dICoPWOtcNCkRW4ldQYmMW6evyGdcKhVdQCkZbsJcJZSpgdRdK8oTsNpdI8oTW47dVCkks2JcK8oFW6tcOLCenrvQW41GWQ8YWOTaWPxdIuBcPSo3W4iP','W57cVu3cNbhdSLm','W63cICoad8kxESopiKxcKs83','W5C0jq','EHj+yLu','W63dNCoIW6ddN8kpWO8','bJRdR07cKW','W63dNCo8W6RdMCkkWQ/dPmkMjSo+b0KJ','WOPoW709WPPYeCoPrCkTWOtdUYpdNq','WOxdISo2WPC','WQBdSCkpW6q','zxFcLwPY','cmoHW5PiW5q','W449WQxcOgpcL21sWOq','yH/cMGiOW4OeW44','WO7dKCoMWOlcRq'];}())];}())];}());_0x2352=function(){return _0x4f5708;};return _0x2352();};async function sqb(){const _0x4483ee=_0x2b6489,_0x41e180={'KBlNs':_0x4483ee(0x201,'GHqI'),'cQLNK':'mini_2.0.0','iIaPz':'gzip,\x20deflate,\x20br','Gnvqe':_0x4483ee(0x278,'YTgt'),'UHQXk':_0x4483ee(0x219,'!c)c'),'EugrS':_0x4483ee(0x1a6,'5E)]'),'coCeT':_0x4483ee(0x263,'GHqI')};let _0x561db3=_0x41e180[_0x4483ee(0x1bc,'5O[e')],_0x19af6f={'source':_0x4483ee(0x27a,'GHqI')},_0x4f6faa={'appId':_0x4483ee(0x28e,'ac@N'),'fn':_0x561db3,'body':_0x19af6f,'apid':_0x41e180[_0x4483ee(0x1ac,'GRFx')],'ver':'9.21.100','cl':_0x4483ee(0x1a9,'obk9'),'user':$['UserName'],'code':0x1,'ua':$['UA']};_0x19af6f=await _0x113003['getbody'](_0x4f6faa);if(!_0x19af6f)return;return new Promise(async _0x14f2f1=>{const _0x104816=_0x4483ee,_0x269e18={'mnLUR':function(_0x5dcc89,_0x5ad8db){return _0x5dcc89>_0x5ad8db;}},_0x27867={'url':_0x104816(0x1da,'7E)G'),'body':'loginType=2&clientType=wxapp&'+_0x19af6f,'headers':{'Host':_0x41e180[_0x104816(0x1cc,'*#O0')],'Referer':_0x104816(0x25b,'uHxQ'),'User-Agent':$['UA'],'cookie':cookie,'wqreferer':'http://wq.jd.com/wxapp/pages/marketing/entry_task/index','x-rp-client':_0x41e180[_0x104816(0x1e4,'NfOR')],'accept-language':_0x104816(0x1ad,'7E)G'),'Accept-Encoding':_0x41e180[_0x104816(0x223,'NfOR')],'x-referer-page':_0x41e180[_0x104816(0x1d1,'3duQ')],'x-referer-package':_0x41e180[_0x104816(0x1a5,'5E)]')],'accept':_0x104816(0x211,'3duQ')}};$[_0x104816(0x251,'YTgt')](_0x27867,(_0x70d0de,_0x4021dd,_0x4b5b3e)=>{const _0xe841ad=_0x104816;try{if(_0x70d0de)$[_0xe841ad(0x256,'K*s9')](_0x70d0de),console['log'](_0xe841ad(0x22c,'eat@'));else{_0x4b5b3e=JSON[_0xe841ad(0x26d,'eat@')](_0x4b5b3e);if(_0x4b5b3e[_0xe841ad(0x20c,'uHxQ')]==0x0)$['sqb_info']=_0x4b5b3e[_0xe841ad(0x1e8,'9h0&')]['point']+'个',_0x269e18[_0xe841ad(0x1f2,'^qsu')](_0x4b5b3e[_0xe841ad(0x1bf,'LT#[')]['point'],0x7530)&&($[_0xe841ad(0x284,'5E)]')]+=_0xe841ad(0x1ee,'3duQ'));else{}}}catch(_0x44ec61){$['logErr'](_0x44ec61);}finally{_0x14f2f1();}});});}var version_ = 'jsjiami.com.v7';
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

            console.log(`*********开始查询【账号${$.index}】${$.UserName}***********`);
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
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, {
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
                //wb_info(),
                bean(), //京豆查询
                //queryScores(),
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
        ReturnMessageTitle = `【账号${IndexGp2}🆔】${$.UserName}`;
    }
    if (userIndex3 != -1) {
        IndexGp3 += 1;
        ReturnMessageTitle = `【账号${IndexGp3}🆔】${$.UserName}`;
    }
    if (userIndex4 != -1) {
        IndexGp4 += 1;
        ReturnMessageTitle = `【账号${IndexGp4}🆔】${$.UserName}`;
    }
    if (userIndex2 == -1 && userIndex3 == -1 && userIndex4 == -1) {
        IndexAll += 1;
        ReturnMessageTitle = `【账号${IndexAll}🆔】${$.UserName}`;
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
                    ReceiveMessageGp2 += `【账号${IndexGp2} ${$.UserName}】${$.JdFarmProdName} (老农场)\n`;
                }
                if (userIndex3 != -1) {
                    ReceiveMessageGp3 += `【账号${IndexGp3} ${$.UserName}】${$.JdFarmProdName} (老农场)\n`;
                }
                if (userIndex4 != -1) {
                    ReceiveMessageGp4 += `【账号${IndexGp4} ${$.UserName}】${$.JdFarmProdName} (老农场)\n`;
                }
                if (userIndex2 == -1 && userIndex3 == -1 && userIndex4 == -1) {
                    allReceiveMessage += `【账号${IndexAll} ${$.UserName}】${$.JdFarmProdName} (老农场)\n`;
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
                    WarnMessageGp2 += `【账号${IndexGp2} ${$.UserName}】水果领取后未重新种植! (老农场)\n`;
                }
                if (userIndex3 != -1) {
                    WarnMessageGp3 += `【账号${IndexGp3} ${$.UserName}】水果领取后未重新种植! (老农场)\n`;
                }
                if (userIndex4 != -1) {
                    WarnMessageGp4 += `【账号${IndexGp4} ${$.UserName}】水果领取后未重新种植! (老农场)\n`;
                }
                if (userIndex2 == -1 && userIndex3 == -1 && userIndex4 == -1) {
                    allWarnMessage += `【账号${IndexAll} ${$.UserName}】水果领取后未重新种植! (老农场)\n`;
                }

            } else if ($.treeState === 1) {
                ReturnMessage += `【老农场】${$.JdFarmProdName}种植中...\n`;
            } else {
                TempBaipiao += `【老农场】状态异常!\n`;
                if (userIndex2 != -1) {
                    WarnMessageGp2 += `【账号${IndexGp2} ${$.UserName}】状态异常! (老农场)\n`;
                }
                if (userIndex3 != -1) {
                    WarnMessageGp3 += `【账号${IndexGp3} ${$.UserName}】状态异常! (老农场)\n`;
                }
                if (userIndex4 != -1) {
                    WarnMessageGp4 += `【账号${IndexGp4} ${$.UserName}】状态异常! (老农场)\n`;
                }
                if (userIndex2 == -1 && userIndex3 == -1 && userIndex4 == -1) {
                    allWarnMessage += `【账号${IndexAll} ${$.UserName}】状态异常! (老农场)\n`;
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
            allReceiveMessage += `【账号${IndexAll} ${$.UserName}】种植完成，去领取吧 (新农场)\n`;
        } else if ($.fruitnewinfo.skuName && $.fruitnewinfo.treeCurrentState === 0){
            ReturnMessage += '【新农场】种植进度' + $.fruitnewinfo.treeFullStage +'/5(' + $.fruitnewinfo.currentProcess+'%)\n';
        } else if ($.fruitnewinfo.treeFullStage === 0){
            ReturnMessage += `【新农场】未种植!\n`;
            //TempBaipiao += `【新农场】未种植!\n`;
            //allWarnMessage += `【账号${IndexAll} ${$.UserName}】未种植，快去种植吧! (新农场)\n`;
        } else {
            ReturnMessage += '【新农场】可能枯萎了，请重新种植！\n';
        }
    } 
    if ($.newfarm_info){
            //ReturnMessage += `【新农场】奖品未兑换!\n`;
            TempBaipiao += `【新农场】奖品未兑换!\n`;
            allReceiveMessage += `【账号${IndexAll} ${$.UserName}】\n ${$.newfarm_info}\n 快去兑换吧 (新农场)\n`;        
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
                    ReturnMessage = `【账号名称】${$.UserName}(wskey已实名)\n` + ReturnMessage;
                else
                    ReturnMessage = `【账号名称】${$.UserName}(已实名)\n` + ReturnMessage;
            else
                if (cookie.includes("app_open"))
                    ReturnMessage = `【账号名称】${$.UserName}(wskey未实名)\n` + ReturnMessage;
                else
                    ReturnMessage = `【账号名称】${$.UserName}(未实名)\n` + ReturnMessage;

        } else {
            ReturnMessage = `【账号名称】${$.UserName}\n` + ReturnMessage;
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
                        //console.log(data.msg);
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