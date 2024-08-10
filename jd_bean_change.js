/*
cron "28 8,21 * * *" jd_bean_change.js, tag:资产变化强化版by-ccwav
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
RemainMessage += '【其他】不同类别红包不能叠加使用，自测';

let WP_APP_TOKEN_ONE = "";

let TempBaipiao = "";
let llgeterror = false;
let time = new Date().getHours();
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


var _0xod4='jsjiami.com.v7';function _0x178e(_0x5f40ec,_0x438134){const _0x131612=_0x2c96();return _0x178e=function(_0x597d93,_0x2f8a01){_0x597d93=_0x597d93-0x127;let _0x2c9628=_0x131612[_0x597d93];if(_0x178e['NMuUtb']===undefined){var _0x178e36=function(_0x5671a7){const _0x48ecae='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0xccbbbc='',_0x2529c0='',_0x3233ba=_0xccbbbc+_0x178e36;for(let _0x39a1b0=0x0,_0x3f6981,_0x4e99e7,_0x1c8c7f=0x0;_0x4e99e7=_0x5671a7['charAt'](_0x1c8c7f++);~_0x4e99e7&&(_0x3f6981=_0x39a1b0%0x4?_0x3f6981*0x40+_0x4e99e7:_0x4e99e7,_0x39a1b0++%0x4)?_0xccbbbc+=_0x3233ba['charCodeAt'](_0x1c8c7f+0xa)-0xa!==0x0?String['fromCharCode'](0xff&_0x3f6981>>(-0x2*_0x39a1b0&0x6)):_0x39a1b0:0x0){_0x4e99e7=_0x48ecae['indexOf'](_0x4e99e7);}for(let _0x5a5219=0x0,_0x57fd12=_0xccbbbc['length'];_0x5a5219<_0x57fd12;_0x5a5219++){_0x2529c0+='%'+('00'+_0xccbbbc['charCodeAt'](_0x5a5219)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x2529c0);};const _0x815dc5=function(_0x490f7c,_0x15d9a4){let _0x306a27=[],_0x3bf69c=0x0,_0x1bd740,_0x542a04='';_0x490f7c=_0x178e36(_0x490f7c);let _0x36246e;for(_0x36246e=0x0;_0x36246e<0x100;_0x36246e++){_0x306a27[_0x36246e]=_0x36246e;}for(_0x36246e=0x0;_0x36246e<0x100;_0x36246e++){_0x3bf69c=(_0x3bf69c+_0x306a27[_0x36246e]+_0x15d9a4['charCodeAt'](_0x36246e%_0x15d9a4['length']))%0x100,_0x1bd740=_0x306a27[_0x36246e],_0x306a27[_0x36246e]=_0x306a27[_0x3bf69c],_0x306a27[_0x3bf69c]=_0x1bd740;}_0x36246e=0x0,_0x3bf69c=0x0;for(let _0x3bf2b1=0x0;_0x3bf2b1<_0x490f7c['length'];_0x3bf2b1++){_0x36246e=(_0x36246e+0x1)%0x100,_0x3bf69c=(_0x3bf69c+_0x306a27[_0x36246e])%0x100,_0x1bd740=_0x306a27[_0x36246e],_0x306a27[_0x36246e]=_0x306a27[_0x3bf69c],_0x306a27[_0x3bf69c]=_0x1bd740,_0x542a04+=String['fromCharCode'](_0x490f7c['charCodeAt'](_0x3bf2b1)^_0x306a27[(_0x306a27[_0x36246e]+_0x306a27[_0x3bf69c])%0x100]);}return _0x542a04;};_0x178e['HWUdek']=_0x815dc5,_0x5f40ec=arguments,_0x178e['NMuUtb']=!![];}const _0x25fba6=_0x131612[0x0],_0x5272e2=_0x597d93+_0x25fba6,_0x2d9e3e=_0x5f40ec[_0x5272e2];if(!_0x2d9e3e){if(_0x178e['rLFgaH']===undefined){const _0x574921=function(_0x369d97){this['yQaprM']=_0x369d97,this['zfgytY']=[0x1,0x0,0x0],this['EKgVvy']=function(){return'newState';},this['AfsYoS']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['kPRlnr']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x574921['prototype']['IxvdaV']=function(){const _0x3f9423=new RegExp(this['AfsYoS']+this['kPRlnr']),_0xa834c6=_0x3f9423['test'](this['EKgVvy']['toString']())?--this['zfgytY'][0x1]:--this['zfgytY'][0x0];return this['huZOwr'](_0xa834c6);},_0x574921['prototype']['huZOwr']=function(_0x3bd389){if(!Boolean(~_0x3bd389))return _0x3bd389;return this['iDAyPI'](this['yQaprM']);},_0x574921['prototype']['iDAyPI']=function(_0x4e192a){for(let _0x13d0c4=0x0,_0x4b85b7=this['zfgytY']['length'];_0x13d0c4<_0x4b85b7;_0x13d0c4++){this['zfgytY']['push'](Math['round'](Math['random']())),_0x4b85b7=this['zfgytY']['length'];}return _0x4e192a(this['zfgytY'][0x0]);},new _0x574921(_0x178e)['IxvdaV'](),_0x178e['rLFgaH']=!![];}_0x2c9628=_0x178e['HWUdek'](_0x2c9628,_0x2f8a01),_0x5f40ec[_0x5272e2]=_0x2c9628;}else _0x2c9628=_0x2d9e3e;return _0x2c9628;},_0x178e(_0x5f40ec,_0x438134);}const _0x4712a7=_0x178e;(function(_0x54c923,_0x2a32dd,_0x4e9c3d,_0x3b8ba1,_0x37c99f,_0x42ff22,_0x4e5758){return _0x54c923=_0x54c923>>0x5,_0x42ff22='hs',_0x4e5758='hs',function(_0x46e1e6,_0x2b1327,_0x4851b7,_0x2fe46a,_0x37e27d){const _0x4bb1a8=_0x178e;_0x2fe46a='tfi',_0x42ff22=_0x2fe46a+_0x42ff22,_0x37e27d='up',_0x4e5758+=_0x37e27d,_0x42ff22=_0x4851b7(_0x42ff22),_0x4e5758=_0x4851b7(_0x4e5758),_0x4851b7=0x0;const _0x431bc6=_0x46e1e6();while(!![]&&--_0x3b8ba1+_0x2b1327){try{_0x2fe46a=-parseInt(_0x4bb1a8(0x233,'Gnx*'))/0x1+-parseInt(_0x4bb1a8(0x14d,'uS[b'))/0x2+-parseInt(_0x4bb1a8(0x255,'Nxi#'))/0x3+parseInt(_0x4bb1a8(0x1d4,'uS[b'))/0x4*(parseInt(_0x4bb1a8(0x2fa,'xp0d'))/0x5)+parseInt(_0x4bb1a8(0x2f1,'KO)n'))/0x6+-parseInt(_0x4bb1a8(0x13a,'RT3Y'))/0x7*(-parseInt(_0x4bb1a8(0x293,'wTrx'))/0x8)+parseInt(_0x4bb1a8(0x21b,'&K^Y'))/0x9*(-parseInt(_0x4bb1a8(0x244,'TD*7'))/0xa);}catch(_0x5b10ec){_0x2fe46a=_0x4851b7;}finally{_0x37e27d=_0x431bc6[_0x42ff22]();if(_0x54c923<=_0x3b8ba1)_0x4851b7?_0x37c99f?_0x2fe46a=_0x37e27d:_0x37c99f=_0x37e27d:_0x4851b7=_0x37e27d;else{if(_0x4851b7==_0x37c99f['replace'](/[YxBkdPCgQyGqwfenXlHATL=]/g,'')){if(_0x2fe46a===_0x2b1327){_0x431bc6['un'+_0x42ff22](_0x37e27d);break;}_0x431bc6[_0x4e5758](_0x37e27d);}}}}}(_0x4e9c3d,_0x2a32dd,function(_0x16228d,_0xb162b3,_0x32168e,_0x396e8a,_0x4f30a8,_0x49ae18,_0x210bf0){return _0xb162b3='\x73\x70\x6c\x69\x74',_0x16228d=arguments[0x0],_0x16228d=_0x16228d[_0xb162b3](''),_0x32168e=`\x72\x65\x76\x65\x72\x73\x65`,_0x16228d=_0x16228d[_0x32168e]('\x76'),_0x396e8a=`\x6a\x6f\x69\x6e`,(0x17d3f7,_0x16228d[_0x396e8a](''));});}(0x17a0,0x41cf4,_0x2c96,0xbf),_0x2c96)&&(_0xod4=`\xeec`);const _0x4b6ae0=(function(){let _0x2cc066=!![];return function(_0x71f817,_0x47fcac){const _0x355beb=_0x2cc066?function(){const _0x12d0dd=_0x178e;if(_0x47fcac){const _0x1bae06=_0x47fcac[_0x12d0dd(0x1b5,'aJRe')](_0x71f817,arguments);return _0x47fcac=null,_0x1bae06;}}:function(){};return _0x2cc066=![],_0x355beb;};}()),_0x53cbbc=_0x4b6ae0(this,function(){const _0x411f5a=_0x178e,_0x5e80be={'xrjTF':_0x411f5a(0x2da,'(YAL')};return _0x53cbbc[_0x411f5a(0x17f,'%5dh')]()[_0x411f5a(0x302,'uS[b')](_0x5e80be[_0x411f5a(0x20e,'Oply')])[_0x411f5a(0x180,'f^Jz')]()[_0x411f5a(0x128,'TD*7')](_0x53cbbc)[_0x411f5a(0x1e4,'CXyr')](_0x5e80be[_0x411f5a(0x1c0,'yZBE')]);});_0x53cbbc();const _0xf7b57=require(_0x4712a7(0x25c,'aJRe')),_0x2e48f4=require(_0x4712a7(0x1ab,'@Ay7')),_0x151ada=require(_0x4712a7(0x217,'6FWW')),_0x16ca3a=require(_0x4712a7(0x1aa,'DR[p'));function _0x2c96(){const _0x269bfe=(function(){return[...[_0xod4,'CjseXwjiqxagmkiy.cdYoHmTl.LvQ7HPfTHnTGAB==','amoiEmoWF8oBWOak','WOj/WRldJSoU','WP/cQti1WQq','lJSXimkMdfqvWOS','WOtcRqqiWOS3W7O','W5xcGmkeWPjADWmAomkMWOldRhVcS0xcNJnxWP3dNmk5WRawqSo+EtfqcCo5ybhdHCkHW4tdOCo3WQBcM8oV','WOZdMSonAJ8','j3ecWOS','WRNcH8oJWPDUWQSRW6alnCoTW4LFtCkbf1FcGSk4WQxcLKZcOGhcKMRcVSoUW5T4','AtZdTSo+W4z4iZC','WO/cVZScWQuWW7lcVq','W6RdHSkNW4m+W7LYW5GinSocWPnJ','c+s6Gos6L+wfNUwDHmkzWQPmzCoT5PYL6k+V6k+o5Row5AsG6lskFEkdQo+6O+kdI++5RG','sWLpW4vfW6iaW44','DG5EW4D4WRLcWOrEWOecfGVcRCkEW7BdRrhdTCopWP06WQtcUqWIWQjahCo6WQquCaddHdpcImk2daGlCCk4W7RcVHv2Exnkkg/cIG','k37dOCosW6LUgWzA','eSk+w8olrSkXyCoF','W48OWOtcI8o9','DsjbW7rj','nIyZ','W73cUdFdMJS','yL7cKSk0w0/cSa','WP3dQxhcRKi3WQ/dGCocWQOGWPJdGqPGWOae','nxZdISkuW6ffWOeFWQ3cPmo2W6LxrSkDWQ1k','W7xdTIZcTNG','jmoKW5pdTHtcN8otWRpdJSoYWRRdTa','j8kVE8obWRa','E8kXW4JcGa','z8k5WRpdQga','AxVdQmoLWP0','WOZdVmk0FN0','W7e+WRatW5mps8kQ','af7dHCkhWQDSW6DvWR3dJGxcHwbYzmoWW4BcKfi','CuVcLSk7tq','W6yycbuRAJRdLa','W4tdPJNcPeVdImoxyq','W7fgW6GAa8kahmkp','WRxcLSoNWPHV','W4/dTbRcRxFdLCoNz8oj','dxS1WPrq','lSkItq','kCk7s8oOWRS','WQFdJmo0sYRdN8ovWP/cI8oVoZaVWQmbWPVdTq/dG0itW50','W5VdOSkXsX0','W57dTsdcLuq','W5JdQmkKrY7cHa','tSkJgczbFapdJmkOW7e','W6VcSSkwWPjA','zH9gW7zd','W6pcQ1RcO38','iH02p8k6','W7RcGh3cGNq','heC3WRXK','W7NcOMpcQuKXWO/dH8ozWQvJWRNdLGnZWOKo','W7Ogfrq1','vdhdRCkpW7S','W6/KUBFKUkJLHOJLNP0RWQzazSok5P6B6kYK6k+65Rkx5Awb6lw5WQVIG53VUyxIGPVVUja','eSobDmoYgSkvWOiahSojvmozW4apWQafqG','uCkFWRldRexdNeyI','W7pdQmkSBaG','kCoJW5RdRhi','W6NcLu8Bgq','WQrtWOZdSmoMBmo0','DJVdGSkUW5G','sWdcJCkbWQGXW4XQ','DZ/dTSk0W4i','yNNdK8oXWQGOWQu','W7JdJ8oxW57cQW','WRhcJ8kNa8oxh8oTta','hSoiW4hdVbK','W4FdT8kVAYG','W5xcP2xcTNKNWR7dMSo9WRzG','WQddQ8koBNFcKdzkWOm0WQGDWQNcQG','W5iddGar','c8kCyCoFWO4ybIldTa','hG9wWR0f','iNldVmo1W44','WQLjWPZdHmo0l8kOWRddJSoWcuOZW75GWRaWWOGiaCk6W45WWQj8W7pcJGGqfeDWW4qqb3xcMSoUWQC9wfRcNb5zs8kAgSoOWO3cHCkalCkGbW','E8o5W7JcQt8','WPJcHmkku8o5','WOFdHSkKWQDKWQa','WQVdMCo0wG','jheBWO1n','mHTIqSoK','fXrKWPS7W5PTW77cKGtcKHRcVMHagxu4x8ojWRPqaMnqaCkWWPG','WOtdJmk2WQe','BYhdICkeW5TjWOexWQ7cJ8k3W6HCtCkf','yCoJqsW','hfFcMSkPWRWZW7HpW4ddTaS','WR3cRsaPWRy','layBW4S4W79DW5Cl','W4FdMmo8W7VcNG','W5JcTSkrWO9W','W77dO8kfyY7cM8kcjNKSW4nKFCk0','W60LkmoFbG','AhtcImknqG','kCkyDCoZwW','DCo1BaSK','eSoEACo3rCoqWPqmfSodwSoYWPnhW7NORPdMSBlLPANOT7ZVVz3OR4VMOkhMNzJNVjdOTP3PHzBOR7W','W5xcHHNdGejejNRdNIvGWPKQWPhcL8oPoW','WQJcLSoHWOHI','W7pcU8kcWQnz','WQ3dNCoHvrRcISkpW57cJW','D2/cJCkDBq','WPqGq2ddOa','W4pdK8oqWQ05','vmk4hIHkCWVdMW','W73dQSo3fCkEfCoBW6hdKCkbWPeI','WRBdKSk2WRzH','yL7cLCkIwf8','W7dcVeOApW','W5VcLCkcWO9Gi0PA','W5tcNqldNsCkjha','WOdcSCk6sCo7xCkDWQ0','oMqDWODlWPxcJZBcSq','W5FdTSoDW7RcNG','AmoVW5VcRGVdKmoCzeu','gflcR8kLWPm','WOmywMpdPG','WOekqhu','DSo2rYqyWOCRWOdcHW','h8oJW6VdIMRcVa','oCkhzCoSWPa','W7BcKee9da','WPpcS8khu8o7','WPe+kKpdHMRdRCo+','W73cKe7cRu8','W5uAnq8S','W6O6f8ocamoDzaO','eM7dP8ojW6jSjG9xdMTqsw/dIc3cMa','WPVcPNq','FGi3uCoSW7jaumo9W5mkfCoRjSkWimkY','WOhdOSo4sdS','jSkMWOxdV8oD','W4xdQctcSNBdLmoeBConWPlcHa','FYrxW5DuWOVcGt3cH1S','smowW7ZcGt8','z8o9W7NcRYVdKmoVF2xdLSkV','iCkoWOddPmo+','WPJcRghdTbW','W47dIqNcHhG','WOqPz1/dKG','W6RcTuW0zq','W4ddQmkqDI7cN8k8mW','D17cKG','WQySW5uXA8onrJJdMq','W5mbWQlcOSoy','h8oJW6S','WOlcNCkWhmoqemoMrG','pLOhBCoLzCkhW6VdIdBdLG','W57cKXC','WQeDkv3dQq','W5xdSGNcUfa','Cw7dGSo2WPq4WR0Wtq','W6WaWOpcUmobexdcPCkrysNcUW','W6DgW6GelW','W4BdUsRcJqNcGKFcL8ktlq','k8kIwCo8ESkI','DMJdLCo6WQKRWRuIuq','AJNcQ8kmWRi7jrbriL9w','Fb9lW5LfW7ya'],...(function(){return[...['WPZdOSk1rwa','WQeuahVdVG','WRtcKSoLWP5RWOyRW7Kh','W5ZcUCo4WO8TdSoVfdi','ySkeWPhdUgC','W5VcLCkcWO98pKLhgmk4WPG','W5FcUe0KEulcSmoGBgOeaCo0W6K','CIddVmknW7PvWQmFWRi','WPBcRCk6emo6','W5/cNqtdKWy','oKldQCoCW4q','nKWJsColW79svG','iCkStmouv8k4y8oxfG','emk7osVdSL/dSZ5oW7bGW6G','WO49W58htG','ncZcNSkJWPmQWR0QumoD','W5/cPe7cRua','W5JdN8o7W6pcHq','zYRcLmo1WQe','Er9EW4j4W6yFW4jrWPCez1ddP8kn6k2L5Rkb5Awd6lA/776U6k2v5QkC5PY0576g6lAa6yAB6kYE','kCo2WPRdUSkS','WPWstN/dQW','W73dGCk7vrS','sxZcLSk/BG','W6C+WRanW78','W7tcOeO+y0RcRCoNEq','W7dcQ2hcJ0S','WQ3cHmo2WOLyWQ8VW6a3kCoMWPr8umkifJpcL8oI','zSkZWRldSea','oSoGWORdGSkk','WOFcQghdJJG','WQGIkhtdUNK','WQPzwvjtzHJdTL1Sdq','hSk9odldTqVcUwzpWQSOW6RdG0H/DmkFuCoDzW','W5/cGxaHsW','W7ZcNSoCWRWS','d8ooWQNdHSk+','W73cV8omWOaM','W47cV10Odq','pHtcGmkIwKJcOCoNW5KSieHsWRLoWQXu','W4ZdS8kZucW','WP7cUKhdMdZcIgJcMmkgdSk0emkEW6G','hSobW5tdVJG','xCk0csfRDH8','WO0QW6y+AW','mKi1xCk/','W5hcM8kx','kLhcGmkWWQe','WQmNvMxdRa','eGvGWPy','5Psw5ysB5z2W5PYK6k+G5AAx6lAu','W5NcLCkeWOm','rCkBWRpdTgddHG','xf/dS8o/WO4','WR0+FgldOq','W6JcH8kvWPbNlefq','W64shmoaoG','WPFcISkip8oq','WPJdNmowtb8','W5tdOSkvWPZOR7dMSORLPA3OTkdVV7dORQhMOkdMNAdNVR3OTA7PHylORPW','5PsW5ysR5z6P5P2W6kYO5AEj6lES','W4VcMmkwWOTZ','WQtcUWiEWQK','f3hcJmkoWO8','W5ZcS8oPWQ8ZmG','W4JcUCoMWO0I','WRqLW4eSFCorvItdR8o5seHdWRetaW','i8oYWQJdNCkAW5nqtGK','W60xWOlcPmoggMFcU8kwAsdcIXKjyUITPEAZVowLJoI0TE+8OoITQEAHQoAEGoE/NUI0LUMgUoITOa','W5VdGCobWRWyWQrJDG','W6iSWQCmW5mps8kQ','WPNcIqiEWRO','z8o9W7NcRZFdJCoSyG','smovW5/cJdu','WQ7cHLxdQZa','wCoKsIuY','W4pcTCoPWOqKjmordJ8K','WPudW545EG','bmkyWRRdSSo4f8oAeKuECqBdPSkTW4RcJmkKtCo1W69AW6OMnI3dV8ozW5GdWOpdLCkAW6W','WRJcKM8UiXLm','WQLjWPZdHmo0l8kOWRddGSoLtquUWRKKWR56W4uea8o4WOb1WRGMW6FcPaGwfWf2W4q/dgFcQmo4WRyfq2JcIG9+CCkrdSooWRBcJCkghCk4','WOpcTYSmWQi/W7NcTW','W6hcTfxcNNK','d286Amo8','W7NdTSk0wde','W6xcR8oRWPGpiCoJha','W4dcKgSwAq','W5qnoJu7','kG8XfCkt','kgxdOmop','WQKSo1ldOa','WPRcTYydWQ8XW7RcPSoTlsFdIwHrmdnxFCoyatddSmkMmmo6','W78ecIiqDG','W53cVCo6WOKP','WOJcQ8onWRGmbCog','W5tdRxfqW5W1W47cU8oEnqi','WQyOlL/dI2tdTCo1W68','umkBWRq','ieBcHSkQWQm','W7BcO1y9pG','W7TiW70','W7RdNCk7Ct4','WQi8W5O8xmolxdJdPmo8bL1TWOawbflcHmkOD8kEe8kVzSoUWRpdJSkUW6COCmkbWR0agmosEtFdSSkyW6/dOmkGW5nXWRH/WP7dJSkuWORdLK3cMCopE8kzW6tdNSoxlG','W7NcR3NcVhq9WRRdHSok','dNy4WRX8','BHTyW4rU','W7yVWQTqW7Dpr8kHhmodW4xdTW','W7moWQ01W4m','W7RcJqe/ihb+hSkZWRbMWRKbWO4','WQNdMCoYvGZcLSkFW4lcQ8oXiq','aeOcxmof','rfJdK8oyWP0','C8o5W7JcTXldLW','oCoKWPNdG8kmW4G','W78ecG','qSknWQxdS1/dI045vmkCcrTFW6VdJhJdOqOY','W6VdHCowWQqO','W5RcTuxcVK04WPxdICoaWQfoWONdJa4','WRhdOabUFftcO8oSt1q','W4lcNqldGWS','W5xcPu0qwG','WOKeuW','WPjqWQFdUSoa','W6WtWOtcVmoGdhdcOmkOFsa','WQZcHCo2WP5cWQyVW6yfiW','W5vqW7i4hq','W6VdHmkRW4iXW7WRW5SXlCoVWQu','rCkBWRtdOMpdLKu','WQjzxa','W4BcJHxdLt0qi2VdNq','WRtcSCkSxSobDCkEWQ7cLq','ahWtA8oj','WOhcSs8IWP4S','WPBcSmoHWO0OlSoAacD0FSogeSo9pMNcKhCkzJWYW7z6WQHlsGlcISoSWOJdUmklg8kBWRBcPvtcRNXUWQL9W43cMsj5uSkTmCk1WPOVWPLFWODrW5zgjH3cOmk0u8oufSoXWOVcJeOLW7WAW4Lazc3dSCoQAa3dL3DTj8kVW4FcPXFcL8kTWQWUgI8CWQNdJmoiWR9QqsOGWQZcUSkIlcrdW4n1W6ScWPzTWRpdLmklWPhcTmo7pmolW6bJAuddQdhdGJxdKSkCeCkVwCkcW5VcMMBdJY7dHmkpWRSGW4PDuhm2W7ddTmkEWPFcSmkpkSkFWRS8W41ZDvH5yCojftLHWRxdVSkmf2ddNSkdW4yXW7iDrH/cPmk1nmohWRjzWPH1u8kiWR/dQebwWOJcUHldImkQWQZdJ8ocWRmojmkZz8kFyI3cRmoKW6Cade/dSbCMzSogWRPvvmopW7L9fKSfzCkpwxZcKSkHcIRcMsddJYTVaZzdf0uzW4jJWRfZhXyBgcuEWOpdICkodv7cICksW6yDyan6W6WEmmoFg8kBW7yKWRBcK8o5WQ7dHxihWRddG8otWOfwrhFcTCkFmXSFgSo9w1NcPHtcMwP/WPFcImoTWR11xmoTwxjCo2RcVuFcLb7dK8kcW7LXW5RcIMNdSGbQvmkXw8kCW6qHnSklW4hdOb7dILFcM07dMSouW6mHbCkV','WP7cHmkTp8oq','x8ovCJu9','W7PgW64uiG','W4xcKSoLWOaW','DCo+bSkopCoIw8okax1vW4G','W7KLnqOB','W5RcIatdGb1EBtddIcv0WP5HW5dcMCoHlxZdGmkyWPu','yGRdM8kVW6O','kmkgx8ouWQmcmsxdOW','fLNcJW','W6FcN0umqNXGe8oUWQ06W71kWPSpkCki','W4RdK8oqWQ8','zgZdL8o/WR4','iCkStmouqCk+ASov','f1FcNmkNWOe','W5ZcTSoAWPG0','owldSmoJW4W','nfua','W6G6WPlcOCo0','WRe+kKpdGwxdPSo0','DmkAlJvZ','W682WP3cKSo2','W7RdV8kjya8','tSoYW4dcJYK','WQGMW5mAwSoq','fc8Ii8ky','W5pdOSk3DY/cK8kGpxGUW6jAjSk1loITSUAYSowKREI0SE+8OUIUHUAIR+ACKEE+MUI3OEMfMEIUHW','W6tdLSoNW7q','pcGMkmkGc1atWR7dHCoc'],...(function(){return['W78RWRyoW6LBaSoQwSovW4pdO8knWOTlWRtcLMeGdh1enSkHDW','i0OUWO9V','W6XHWPXXa8klgh/cHSkXeaK','W7S6WRqBW7yVtmkOvW','pMOrrmoN','CL7cH8k5EL7cUa','WOLnWQVdLSo3','vbneW5btW6OmW4vy','g8osFSoPEmouWOSa','W4BdKmo0W5dcGa','d0NdTSo6W6a','W4tdPrlcJNa','wCoDW7/cRJm','amoVW4BdLcq','oNuoWPXgWPO','CSoSW6FcQWO','oCo1WORdMmkbW4DVqqa','WQz4WQWOFCkXqW','kIGMnSkq','eSkJy8oRWOi','WQxcPG4eWQy','pNJdQSoAW7C','B8k9WOpdR2O','WOxcVSkroSoS','W6VcT8ktWQXb','WOBcTSo3oMxdH8oQghWKW4XWrG','Bg/dQ8o8WQaLWRi','y8oJrYa/WO4KWOK','maXaWP8k','B8kxmrrt','jSoUWP/dTmkDW5i','WOdcVZWeWOq','WPueW4yUza','a0aEASof','WQ4uWQnaESkfimkjWOSsWOy','W5hcO3BcTw87WQ7dHSoz','WQFcSZ4FWQa','WQldMCo0wde','WPlcQmkWsSoM','pCk9WOldQmox','pcGMkmk8fLmo','i3xcSSkxWQa','cvpcICk2WOOO','nYGGjSkD','DSoJFt0V','gSovWQNdU8kA','W6ZcTCkJWQ9q','AHvEW5zNW5aoW4rnWPq','lJSXimkHf0eaWOldSSodxqNcHra','ngxdTmo+W7v7','W74aWPpcTmoMc3tcPSkD','tb9jW5LJ','kCkKxCosrSkXyCoF','WO0FqgtdLcVcQs5EW7yxWR94WRqECSoMW48GW4mXrSkfWPy','zNpdICoGWRm+WQKNxmo0WPS','fXDrWOyu','W5OUWRuKW7C','WRTKWQpdJSo+','l0xcJCk2WQCHW7by','WOFcPwBdJGJcL0pcI8kPcSkgamkJW67cSSoH','g8o4W7JdVYldOCkkWQKSyeRdQCoRW5KGWO7cVmkCqIpcJrfqWQdcL8kgv1O1W7BdRuX9','WO3cOCk7uSoe','W70BWQu7W4S','BwJdK8oJWRr2W7nRs8o6WPVdULNcQLusW6GxWPelzmolWOG','emk7nspdTG','WRVdJSkFx28','W7riW74s','WQ3cLSoQWRfY','W5ytpSoDmW','vSknWRpdPhJdU04RuW','WPRcGCkNsCor','WO9sWR3dHSo1','W73cJmk3dgNdK8odW7VcS8o3hWLc','bSoeWPhdHmko','W7/cSMiywq','W5JdQmkK','aL3dLmodW4W','W74kgqqk','W646n8oc','WQKOW4a8qa','qSknWQxdS0xdNeyI','pmkTodddO1tdKYDcW6XHW74','y1fJwmkZW60erCkM','WPxcJmkJimoB','yfFcK8kKA0NcOmo9W58SAL9y','mflcRSkLWPSTW41pW7/dOIRcIN4S','gGTZ','WQBdI8oqvYZcLSkSW5NcIW','WRtcMmo0WR51WRO','CCkzWQFdHey','D8kNcYHn','sqxdKmo9W590W7XYW4pdSqJcQa','WR/dHmkbWQ1a','lLuyWRD1','W7G0nSoBj8ohBX9ZW6u3','kt0MlmkBh1WhWPC','W68CWPlcLCoubMy','j8oWW6tcPrFdJCoEDexdGCo9pX/dUh5inmk6W7VcPIpdIJP0','keWdz8o6','gCouESohrmoh','W5NdPSk3ytq','eCoPW63dOvVcOCoqWQyO','W7/dRCo1','W4/cPLqocG','thNdRCoQWOi','WPnuWQ/dS8ob','W7ZcSWldSr4','gmoPB8o7rW','uCoTrYOf','W7SWWQu7W6Gt','mJ0GnCkgqHPoWO/dH8oefHBdJankvX9hlmoFWQNdVSomW5u','W45MW4aYdq','hCoJW63dN00','c8kotXW3tvldOCo6W5C7W5JdTxicWRlcGh/cO8oVW7a','sCoerqeh','zNpdG8o2','W5RcKCkeWObgkvu','igmfBSoG','WOtcOKtdNdO','W6hcTuO6repcOSoU','peGNqCoUW59vvmo3','h8kHD8oWAW','WOJcK8kL','W4/dTbJcPgpdISo/B8ouWPJcT2mmhW','bmkRhXRdKq','y1dcSCk2uW','lSoGWOZdKa','pIGGja','CbThW5i','sCkLdYPQDq/dMmk2','maGylmkW','W5tcVCo6WOS','g8kaaJhdQG','WR/dL8oZtW','WRRcUSokWPDV','W7SWWQu','WPhcU2BdLcNcIKpcJSkcbCktcG','WQ7cSZ4ZWOS','r8okW6lcJrG','WRHgW4hdPSkfssZcMCkWEX7cNMW','W4BdHSoqWR4IW7aQnMHGW7ZdV8koW5bYEHVdS8og','AHv5W4n5W6OdW4W','W7tcIN8ihdvQeq','W43dVmoUWR8F','j8kuFCovWOmcaJ7dG8kKrq','WO8ub0BdVq','W6m5WPVcLCo3','c8kyECoaWPO','gSoVW73dHM8','W4pcN3hcVx0','yCkStSojyCk0mCongWu','W57dNSorWR0oWQHWAMK7WRFdOCot','hSoTW7JdRha','WQxdT8k7','W67cILS','aIuDdmkw','WQlcL8kVv8oN','5lMJ5lQK5P6n5yQA5zIX6lYX5zIK56Uk5PAl5O+T','cuazDCoV','d8oWW5FdQaG','W4hdS8oNW57cKa','W7xcUmoMWP8Q'];}())];}())];}());_0x2c96=function(){return _0x269bfe;};return _0x2c96();};async function getuserinfo_6dy(){const _0x3a683e=_0x4712a7,_0x147201={'PshNZ':function(_0x10861f,_0x4d45df){return _0x10861f===_0x4d45df;},'NZqTc':_0x3a683e(0x2de,'CZ@B'),'noaPU':function(_0x3d3980,_0x11a6b1){return _0x3d3980!==_0x11a6b1;},'Sqfwz':_0x3a683e(0x176,'rWlV'),'xelAH':_0x3a683e(0x288,'jm&3'),'NoUrr':_0x3a683e(0x23d,'jA8N'),'eBamY':_0x3a683e(0x1df,'T6l5'),'YCTlI':function(_0x26cb16,_0x4aad7d){return _0x26cb16===_0x4aad7d;},'fZtyf':_0x3a683e(0x2b4,'HmSO'),'hNDPm':_0x3a683e(0x1af,'jfo6'),'YOFVm':_0x3a683e(0x144,'6FWW'),'icqIw':function(_0x2cb14e,_0x2a051f){return _0x2cb14e==_0x2a051f;},'IITNK':_0x3a683e(0x23f,'Gnx*'),'IcRaC':_0x3a683e(0x239,'HmSO'),'KgDxG':_0x3a683e(0x18f,'RT3Y'),'JtkXf':function(_0x4d1d95){return _0x4d1d95();},'DkZzu':_0x3a683e(0x285,'CZ@B'),'qKwtG':_0x3a683e(0x1e8,'T6l5'),'PgSxG':_0x3a683e(0x1cd,')5Fz'),'UWXRA':_0x3a683e(0x19c,'&K*%')};let _0x42f975={'url':_0x147201[_0x3a683e(0x1bb,'&K^Y')],'headers':{'Accept':_0x147201[_0x3a683e(0x1fc,'luX#')],'accept-encoding':_0x147201[_0x3a683e(0x2a3,'6FWW')],'content-type':_0x147201[_0x3a683e(0x1c8,'&K^Y')],'Cookie':cookie,'User-Agent':$['UA']}};return new Promise(_0x366252=>{const _0x77dccc=_0x3a683e,_0x1c05e0={'XUHvF':function(_0x2d668d,_0x2c99ab){const _0xc7ea6e=_0x178e;return _0x147201[_0xc7ea6e(0x1ed,'CE$y')](_0x2d668d,_0x2c99ab);},'NZxsb':_0x147201[_0x77dccc(0x25b,'f^Jz')],'yyzkL':function(_0x548266,_0x245c20){const _0x37864e=_0x77dccc;return _0x147201[_0x37864e(0x162,'FYVz')](_0x548266,_0x245c20);},'YAZEG':_0x147201[_0x77dccc(0x1ac,'yZBE')],'Xcdiq':_0x147201[_0x77dccc(0x1c4,'%5dh')],'imxsW':_0x147201[_0x77dccc(0x139,'CZ@B')],'yYwNe':_0x147201[_0x77dccc(0x1f0,'GCbz')],'xfZOT':function(_0x51ed34,_0x1f6a8d){const _0x3dba50=_0x77dccc;return _0x147201[_0x3dba50(0x26a,'TD*7')](_0x51ed34,_0x1f6a8d);},'RrBEU':_0x147201[_0x77dccc(0x1ae,'Oply')],'gTkJY':_0x147201[_0x77dccc(0x1bd,'Oply')],'SVlST':_0x147201[_0x77dccc(0x27f,'235O')],'QASMy':function(_0x599e92,_0x4cd159){const _0x312c0f=_0x77dccc;return _0x147201[_0x312c0f(0x186,'FYVz')](_0x599e92,_0x4cd159);},'XhhvO':function(_0x343c67,_0x3ff71a){const _0x33f286=_0x77dccc;return _0x147201[_0x33f286(0x2e5,'&3kO')](_0x343c67,_0x3ff71a);},'cwbKC':_0x147201[_0x77dccc(0x27e,'w$m*')],'ePfla':_0x147201[_0x77dccc(0x261,'(YAL')],'ZpnnJ':_0x147201[_0x77dccc(0x14e,'CXyr')],'cNJqN':function(_0x3ab62b){const _0xeeb02b=_0x77dccc;return _0x147201[_0xeeb02b(0x243,'(YAL')](_0x3ab62b);}};$[_0x77dccc(0x296,'HmSO')](_0x42f975,async(_0xda6e19,_0x864ac4,_0x2e7d27)=>{const _0x3c1326=_0x77dccc;if(_0x1c05e0[_0x3c1326(0x257,'))rI')](_0x1c05e0[_0x3c1326(0x218,'RT3Y')],_0x1c05e0[_0x3c1326(0x29a,'KO)n')]))try{if(_0xda6e19){if(_0x1c05e0[_0x3c1326(0x24a,'luX#')](_0x1c05e0[_0x3c1326(0x161,'xp0d')],_0x1c05e0[_0x3c1326(0x12f,')Jy3')]))console[_0x3c1326(0x13d,'KO)n')](''+JSON[_0x3c1326(0x24e,'))rI')](_0xda6e19)),console[_0x3c1326(0x2c4,'uS[b')](_0x3c1326(0x1f6,')5Fz'));else{_0x2dbeed[_0x3c1326(0x198,'CE$y')]=![];return;}}else{if(_0x1c05e0[_0x3c1326(0x26b,'luX#')](_0x1c05e0[_0x3c1326(0x1ca,'Nxi#')],_0x1c05e0[_0x3c1326(0x2c2,'@Ay7')]))_0x5dba3a[_0x3c1326(0x20d,'FYVz')](_0x5cf68f,_0xc807dc);else{if(_0x2e7d27){_0x2e7d27=JSON[_0x3c1326(0x2ac,'JS4z')](_0x2e7d27);if(_0x1c05e0[_0x3c1326(0x13c,'))rI')](_0x2e7d27[_0x1c05e0[_0x3c1326(0x287,'DR[p')]],_0x1c05e0[_0x3c1326(0x1fb,'aJRe')])){$[_0x3c1326(0x2f2,'TD*7')]=![];return;}if(_0x1c05e0[_0x3c1326(0x2ff,'xjx%')](_0x2e7d27[_0x3c1326(0x1a9,'aJRe')],'0')&&_0x2e7d27[_0x3c1326(0x2d6,'5Qc[')]){const _0x1bdc76=_0x1c05e0[_0x3c1326(0x2eb,'Oply')][_0x3c1326(0x1da,'KO)n')]('|');let _0x19d46f=0x0;while(!![]){switch(_0x1bdc76[_0x19d46f++]){case'0':$[_0x3c1326(0x1dc,'rcGB')]=_0x2e7d27[_0x3c1326(0x2c6,'!Hr1')]?.[_0x3c1326(0x194,')5Fz')]?.[_0x3c1326(0x2aa,'DR[p')]||'';continue;case'1':$[_0x3c1326(0x286,'CE$y')]=$[_0x3c1326(0x28a,'wTrx')];continue;case'2':$[_0x3c1326(0x23c,'@Ay7')]=_0x1c05e0[_0x3c1326(0x306,'GCbz')](_0x2e7d27[_0x3c1326(0x1eb,'NlkG')]?.[_0x3c1326(0x142,'HmSO')]?.[_0x3c1326(0x278,'jfo6')],0x1);continue;case'3':$[_0x3c1326(0x2db,'eWo7')]=_0x2e7d27[_0x3c1326(0x1e5,'RT3Y')]?.[_0x3c1326(0x1b6,'Nxi#')]?.[_0x3c1326(0x1b7,'yZBE')]?.[_0x3c1326(0x16a,'6FWW')];continue;case'4':$[_0x3c1326(0x295,'go%0')]=_0x2e7d27[_0x3c1326(0x20b,'luX#')]?.[_0x3c1326(0x137,'HmSO')]?.[_0x3c1326(0x2dd,'aJRe')]||0x0;continue;}break;}}}else _0x1c05e0[_0x3c1326(0x246,'5Qc[')](_0x1c05e0[_0x3c1326(0x249,'jfo6')],_0x1c05e0[_0x3c1326(0x22b,'go%0')])?$[_0x3c1326(0x148,'T6l5')](_0x1c05e0[_0x3c1326(0x297,'uS[b')]):(_0x2bf9f8=_0x1c722b[_0x3c1326(0x29e,'%5dh')](_0x2c7770),_0xe004e3[_0x3c1326(0x17a,'235O')]=_0x41ba33[_0x3c1326(0x171,'*oqe')]?.[_0x3c1326(0x2a5,'w$m*')]||'');}}}catch(_0x59b8d0){$[_0x3c1326(0x231,'X%RW')](_0x59b8d0,_0x864ac4);}finally{_0x1c05e0[_0x3c1326(0x181,'!Hr1')](_0x366252);}else _0x52263e?(_0x5d583e[_0x3c1326(0x227,'FYVz')](''+_0x55c129[_0x3c1326(0x173,'t2)k')](_0x4be8ab)),_0x2a8c3c[_0x3c1326(0x2ae,'luX#')](_0x3c1326(0x279,'G!cU'))):(_0xd45960[_0x3c1326(0x2df,'%5dh')]=_0xb5f0d[_0x3c1326(0x156,'KO)n')](/"score":(\d+)/)?_0x2540cf[_0x3c1326(0x18a,'FYVz')](/"score":(\d+)/)[0x1]:0x0,_0x14185d[_0x3c1326(0x225,'(YAL')]=_0x96a55c[_0x3c1326(0x28f,'go%0')](/"currentBeanNum":(\d+)/)?_0x33a6a0[_0x3c1326(0x2fd,'RT3Y')](/"currentBeanNum":(\d+)/)[0x1]:0x0,_0x5076e0[_0x3c1326(0x2e0,')5Fz')]=_0x3e4574[_0x3c1326(0x23e,'JS4z')](/"showName":"(.*?)"/)?_0x58e74b[_0x3c1326(0x2f7,'CE$y')](/"showName":"(.*?)"/)[0x1]:_0x120b08[_0x3c1326(0x211,'go%0')]);});});}async function _0x4abefe(){const _0x3c4147=_0x4712a7,_0x412823={'lgOvZ':function(_0x54e8f9){return _0x54e8f9();},'jZAaJ':function(_0x364f8f,_0x2ea772){return _0x364f8f!==_0x2ea772;},'GfWRY':_0x3c4147(0x220,'yZBE'),'Torgs':_0x3c4147(0x127,'luX#'),'mhnOW':_0x3c4147(0x2d8,'eWo7')};let _0x52ba66={'url':_0x3c4147(0x12e,'FYVz'),'body':_0x3c4147(0x29b,'(YAL')+Date[_0x3c4147(0x18c,'f^Jz')]()+_0x3c4147(0x2ba,'wTrx'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Origin':_0x412823[_0x3c4147(0x15e,'NlkG')],'Referer':_0x412823[_0x3c4147(0x1d3,'@Ay7')]}};return new Promise(_0x439bd0=>{const _0x3692a6=_0x3c4147;_0x412823[_0x3692a6(0x2d9,'&K^Y')](_0x412823[_0x3692a6(0x29d,'&K^Y')],_0x412823[_0x3692a6(0x28c,'Nxi#')])?(_0x486f7c[_0x3692a6(0x148,'T6l5')](''+_0x36596e[_0x3692a6(0x232,'TD*7')](_0x40d1d8)),_0x4d1484[_0x3692a6(0x16c,'jA8N')](_0x3692a6(0x2d5,'KO)n'))):$[_0x3692a6(0x177,'RT3Y')](_0x52ba66,async(_0x14b1d5,_0x121b8b,_0xfca4f)=>{const _0x33ec4b=_0x3692a6;try{_0x14b1d5?(console[_0x33ec4b(0x216,'235O')](''+JSON[_0x33ec4b(0x151,'*oqe')](_0x14b1d5)),console[_0x33ec4b(0x179,'eWo7')](_0x33ec4b(0x248,'%5dh'))):($[_0x33ec4b(0x1de,'Oply')]=_0xfca4f[_0x33ec4b(0x222,'))rI')](/"score":(\d+)/)?_0xfca4f[_0x33ec4b(0x13f,'Nxi#')](/"score":(\d+)/)[0x1]:0x0,$[_0x33ec4b(0x2fb,'DR[p')]=_0xfca4f[_0x33ec4b(0x1e6,'&K^Y')](/"currentBeanNum":(\d+)/)?_0xfca4f[_0x33ec4b(0x2bd,'xp0d')](/"currentBeanNum":(\d+)/)[0x1]:0x0,$[_0x33ec4b(0x1fe,'t2)k')]=_0xfca4f[_0x33ec4b(0x303,'*oqe')](/"showName":"(.*?)"/)?_0xfca4f[_0x33ec4b(0x292,'wTrx')](/"showName":"(.*?)"/)[0x1]:$[_0x33ec4b(0x205,')Jy3')]);}catch(_0x161645){$[_0x33ec4b(0x291,'Nxi#')](_0x161645,_0x121b8b);}finally{_0x412823[_0x33ec4b(0x1b1,'TD*7')](_0x439bd0);}});});}async function queryScores(){const _0xebf137=_0x4712a7,_0x1732ca={'fsnwA':_0xebf137(0x1ff,')Jy3'),'iKmDB':function(_0x3584d1){return _0x3584d1();},'NVYvc':function(_0xa34788,_0x4b7fb2){return _0xa34788!==_0x4b7fb2;},'dQoKY':_0xebf137(0x2b2,'xp0d'),'QJjfR':_0xebf137(0x13b,'jfo6'),'DfJzo':function(_0x5d616e,_0x11c83c){return _0x5d616e==_0x11c83c;},'kXkCB':_0xebf137(0x1cb,'@Ay7'),'gEwYP':function(_0x341f73,_0x245c70){return _0x341f73===_0x245c70;},'skWag':_0xebf137(0x15b,'CZ@B'),'bbXOr':_0xebf137(0x1e7,'6FWW'),'pwYFR':_0xebf137(0x290,'CE$y'),'IFjYX':_0xebf137(0x146,'aJRe'),'YCZSI':_0xebf137(0x199,'GCbz')};let _0x4ee7ac='',_0x23a607={'appId':_0x1732ca[_0xebf137(0x2e3,'yZBE')],'functionId':_0x1732ca[_0xebf137(0x1f5,'NlkG')],'body':{},'appid':_0x1732ca[_0xebf137(0x1c7,'DR[p')],'user':$[_0xebf137(0x12c,'uS[b')],'code':0x0,'ua':$['UA']};body=await _0x16ca3a[_0xebf137(0x166,'GCbz')](_0x23a607);let _0x1c120b={'url':_0xebf137(0x160,'*oqe')+body+_0xebf137(0x153,'w$m*'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Referer':_0x1732ca[_0xebf137(0x301,'uS[b')]}};return new Promise(_0x893d23=>{const _0x5e3c22=_0xebf137,_0x26d860={'jNXmy':_0x1732ca[_0x5e3c22(0x20a,'luX#')],'JmvxL':function(_0x1b54d7){const _0x36d7ae=_0x5e3c22;return _0x1732ca[_0x36d7ae(0x184,'G!cU')](_0x1b54d7);},'FqXhN':function(_0x78c257,_0x3e3bf4){const _0x1adc8a=_0x5e3c22;return _0x1732ca[_0x1adc8a(0x212,'DR[p')](_0x78c257,_0x3e3bf4);},'Nfvfm':_0x1732ca[_0x5e3c22(0x2a0,'eWo7')],'mGdJf':_0x1732ca[_0x5e3c22(0x282,'(YAL')],'GDSAd':function(_0x25c5d0,_0x12c637){const _0x5e4a03=_0x5e3c22;return _0x1732ca[_0x5e4a03(0x21e,'xjx%')](_0x25c5d0,_0x12c637);},'zxoNI':_0x1732ca[_0x5e3c22(0x1a6,'%5dh')]};_0x1732ca[_0x5e3c22(0x14f,'&K^Y')](_0x1732ca[_0x5e3c22(0x16f,'aJRe')],_0x1732ca[_0x5e3c22(0x168,'235O')])?$[_0x5e3c22(0x28e,'Gnx*')](_0x1c120b,async(_0x59697b,_0x27beeb,_0x197f84)=>{const _0x51f6c3=_0x5e3c22,_0x28b97a={'GoonT':_0x26d860[_0x51f6c3(0x2c0,'Nxi#')],'MFUhL':function(_0x110f23){const _0x43ef37=_0x51f6c3;return _0x26d860[_0x43ef37(0x185,'Oply')](_0x110f23);}};try{if(_0x26d860[_0x51f6c3(0x210,')Jy3')](_0x26d860[_0x51f6c3(0x2d4,'*oqe')],_0x26d860[_0x51f6c3(0x274,'uS[b')])){const _0x3062cf=JSON[_0x51f6c3(0x24d,'eWo7')](_0x197f84);_0x26d860[_0x51f6c3(0x28b,'))rI')](_0x3062cf[_0x51f6c3(0x134,'xp0d')],0x3e8)&&($[_0x51f6c3(0x23b,'))rI')]=_0x3062cf['rs'][_0x51f6c3(0x2a8,'HmSO')][_0x51f6c3(0x307,'%5dh')]);}else return _0x45c54f[_0x51f6c3(0x223,'KO)n')]()[_0x51f6c3(0x2a6,'jfo6')](hlbgbx[_0x51f6c3(0x1ef,'5Qc[')])[_0x51f6c3(0x214,'K#RX')]()[_0x51f6c3(0x21a,'yZBE')](_0x5e15b3)[_0x51f6c3(0x2e6,'&K^Y')](hlbgbx[_0x51f6c3(0x1cf,'KO)n')]);}catch(_0x374719){_0x26d860[_0x51f6c3(0x213,'Nxi#')](_0x26d860[_0x51f6c3(0x2bb,'jA8N')],_0x26d860[_0x51f6c3(0x1e0,'Gnx*')])?_0x28b97a[_0x51f6c3(0x1e3,')Jy3')](_0x29c978):$[_0x51f6c3(0x14a,'&K*%')](_0x374719,_0x27beeb);}finally{_0x26d860[_0x51f6c3(0x2fc,'CE$y')](_0x893d23);}}):_0x54deef[_0x5e3c22(0x1ba,'yZBE')]=_0x39452e['rs'][_0x5e3c22(0x12d,'235O')][_0x5e3c22(0x152,'G!cU')]?!![]:![];});}async function fruitinfo(){const _0x42402e=_0x4712a7,_0x92c061={'pwvgJ':_0x42402e(0x1cc,'luX#'),'Ahcgs':function(_0x49d62d,_0x33c421){return _0x49d62d===_0x33c421;},'YmHQm':_0x42402e(0x207,'5Qc['),'eDkCC':_0x42402e(0x178,'&K*%'),'oerIA':function(_0x64c00c,_0x161e29){return _0x64c00c(_0x161e29);},'ZWGxK':function(_0x33fa93,_0x134771){return _0x33fa93===_0x134771;},'vlfiZ':_0x42402e(0x1a5,'G!cU'),'CBZzi':function(_0x421a58,_0x24dab8){return _0x421a58===_0x24dab8;},'bHdpA':_0x42402e(0x25d,'KO)n'),'svJNI':function(_0x45dcaa){return _0x45dcaa();},'fryap':_0x42402e(0x2b8,'jm&3'),'UziNv':_0x42402e(0x2b5,'Nxi#'),'fQdDW':_0x42402e(0x2cc,'%5dh'),'UFLWW':_0x42402e(0x2c5,'f^Jz'),'EOQwQ':_0x42402e(0x2a1,'f^Jz'),'NOrAp':_0x42402e(0x131,'TD*7'),'Bqscf':_0x42402e(0x283,'xjx%')};return new Promise(_0x577a3d=>{const _0x84f52c=_0x42402e,_0x53efca={'rwzRH':_0x92c061[_0x84f52c(0x154,'jm&3')],'XCCnf':function(_0x244f3f,_0x5a7598){const _0x585662=_0x84f52c;return _0x92c061[_0x585662(0x1dd,'Nxi#')](_0x244f3f,_0x5a7598);},'suCyR':_0x92c061[_0x84f52c(0x190,'6FWW')],'WdVwF':_0x92c061[_0x84f52c(0x2d0,'G!cU')],'pHfxh':function(_0x9218ce,_0x1ce546){const _0x2a528f=_0x84f52c;return _0x92c061[_0x2a528f(0x21f,'235O')](_0x9218ce,_0x1ce546);},'PghtH':function(_0x2ea0c6,_0x31e077){const _0x6d75b1=_0x84f52c;return _0x92c061[_0x6d75b1(0x13e,'Gnx*')](_0x2ea0c6,_0x31e077);},'OCxrd':_0x92c061[_0x84f52c(0x272,'GCbz')],'tWJyV':function(_0x5646b5,_0x4b1728){const _0x5db569=_0x84f52c;return _0x92c061[_0x5db569(0x195,'CZ@B')](_0x5646b5,_0x4b1728);},'Edhuk':_0x92c061[_0x84f52c(0x2cd,'G!cU')],'GjoqS':function(_0x318a4a){const _0x31c2d=_0x84f52c;return _0x92c061[_0x31c2d(0x26e,'jA8N')](_0x318a4a);}};if(_0x92c061[_0x84f52c(0x2bc,'NlkG')](_0x92c061[_0x84f52c(0x132,'rWlV')],_0x92c061[_0x84f52c(0x2ed,'Gnx*')])){const _0x123d29={'url':_0x84f52c(0x1a2,'%5dh'),'body':_0x84f52c(0x262,'6FWW')+_0x92c061[_0x84f52c(0x1bf,'KO)n')](encodeURIComponent,JSON[_0x84f52c(0x20c,'NlkG')]({'version':0x18,'channel':0x1,'babelChannel':_0x92c061[_0x84f52c(0x235,'rcGB')],'lat':'0','lng':'0'}))+_0x84f52c(0x188,'X%RW'),'headers':{'accept':_0x92c061[_0x84f52c(0x2dc,'jm&3')],'accept-encoding':_0x92c061[_0x84f52c(0x2f5,'t2)k')],'accept-language':_0x92c061[_0x84f52c(0x259,'jfo6')],'cookie':cookie,'origin':_0x92c061[_0x84f52c(0x1f9,'GCbz')],'referer':_0x92c061[_0x84f52c(0x15c,'JS4z')],'User-Agent':$['UA'],'Content-Type':_0x92c061[_0x84f52c(0x200,'CXyr')]},'timeout':0x2710};$[_0x84f52c(0x1e9,'CXyr')](_0x123d29,(_0x54b2a0,_0x52fe81,_0x53c570)=>{const _0x515240=_0x84f52c;try{if(_0x54b2a0)!llgeterror&&(console[_0x515240(0x2c4,'uS[b')](_0x53efca[_0x515240(0x196,'CE$y')]),console[_0x515240(0x263,'GCbz')](JSON[_0x515240(0x1a3,'Gnx*')](_0x54b2a0))),llgeterror=!![];else{if(_0x53efca[_0x515240(0x2ee,'HmSO')](_0x53efca[_0x515240(0x22c,'yZBE')],_0x53efca[_0x515240(0x26f,'RT3Y')]))_0x2a487e?(_0x1c1071[_0x515240(0x22a,'JS4z')](_0x515240(0x271,'5Qc[')),_0x519c4a[_0x515240(0x2f6,'jfo6')](_0x28a45a)):(_0x2ee962=_0x3cb7f4[_0x515240(0x1f8,'&K*%')](_0x21a8c7),_0x105df5[_0x515240(0x242,'rWlV')]=_0x2ba88a[_0x515240(0x170,'jfo6')]?.[_0x515240(0x269,'HmSO')]||'');else{llgeterror=![];if(_0x53efca[_0x515240(0x1d9,'&3kO')](safeGet,_0x53c570)){$[_0x515240(0x204,'JS4z')]=JSON[_0x515240(0x253,'235O')](_0x53c570);if($[_0x515240(0x2c8,'X%RW')][_0x515240(0x1ec,'uS[b')]){if(_0x53efca[_0x515240(0x264,'uS[b')](_0x53efca[_0x515240(0x159,'f^Jz')],_0x53efca[_0x515240(0x138,')Jy3')]))$[_0x515240(0x147,'uS[b')]=$[_0x515240(0x1b8,'xp0d')][_0x515240(0x1db,'DR[p')][_0x515240(0x19b,'&K^Y')],$[_0x515240(0x143,'rWlV')]=$[_0x515240(0x27d,'w$m*')][_0x515240(0x2b0,'G!cU')][_0x515240(0x1c2,'t2)k')],$[_0x515240(0x1c9,'DR[p')]=$[_0x515240(0x203,'GCbz')][_0x515240(0x150,'K#RX')][_0x515240(0x1ea,'@Ay7')],$[_0x515240(0x197,'*oqe')]=$[_0x515240(0x1b3,'eWo7')][_0x515240(0x2d7,'*oqe')][_0x515240(0x30a,'G!cU')];else{const _0x5dda4e=_0x1c8c7f?function(){const _0x4801fc=_0x515240;if(_0x3bf69c){const _0x352d1b=_0x3bf2b1[_0x4801fc(0x2c7,'TD*7')](_0x574921,arguments);return _0x369d97=null,_0x352d1b;}}:function(){};return _0x306a27=![],_0x5dda4e;}}}}}}catch(_0x1017ca){$[_0x515240(0x2b9,'CE$y')](_0x1017ca,_0x52fe81);}finally{_0x53efca[_0x515240(0x27c,'CE$y')](_0x53efca[_0x515240(0x193,'wTrx')],_0x53efca[_0x515240(0x1b2,'rcGB')])?_0x53efca[_0x515240(0x2fe,')Jy3')](_0x577a3d):_0x380841[_0x515240(0x309,'Gnx*')](_0x3905a3,_0x206cb2);}});}else _0x84fa2f[_0x84f52c(0x275,'wTrx')](_0x314375,_0x21ec8b);});}async function fruitnew(_0x394da0=0x1f4){const _0x297fb2=_0x4712a7,_0x3e39c5={'IFxWG':function(_0x40adc4){return _0x40adc4();},'aBSKu':function(_0x25cfaa,_0x26bd0b){return _0x25cfaa===_0x26bd0b;},'xehgc':_0x297fb2(0x2ec,'CE$y'),'pGXvH':_0x297fb2(0x183,'go%0'),'FLbqK':_0x297fb2(0x2be,'wTrx'),'QMrqL':function(_0x280d06,_0x106fe1){return _0x280d06!==_0x106fe1;},'MvvkI':_0x297fb2(0x18e,')Jy3'),'PTQJu':function(_0x5b9a22,_0x366c79){return _0x5b9a22(_0x366c79);},'XlIIc':_0x297fb2(0x19a,'RT3Y'),'nUKJS':function(_0x8be2f1,_0x1223b5,_0x335f94){return _0x8be2f1(_0x1223b5,_0x335f94);},'OnKMW':_0x297fb2(0x280,'t2)k'),'pFePf':_0x297fb2(0x241,'X%RW'),'McBjg':_0x297fb2(0x281,'wTrx'),'FViOf':_0x297fb2(0x1bc,'X%RW'),'jDgEQ':_0x297fb2(0x29f,'eWo7'),'xOnZv':_0x297fb2(0x158,')Jy3'),'RquGW':_0x297fb2(0x17e,'!Hr1'),'mRryq':_0x297fb2(0x1f7,'JS4z'),'LFpLq':_0x297fb2(0x1b4,'uS[b'),'vumAb':_0x297fb2(0x256,'rWlV')};let _0x26629f={'version':0x1},_0x199ba2={'appId':_0x3e39c5[_0x297fb2(0x2d2,'w$m*')],'fn':_0x3e39c5[_0x297fb2(0x28d,'*oqe')],'body':_0x26629f,'apid':_0x3e39c5[_0x297fb2(0x25a,'wTrx')],'ver':$['UA'][_0x297fb2(0x2e7,'w$m*')](';')[0x2],'cl':_0x3e39c5[_0x297fb2(0x17c,'w$m*')],'user':$[_0x297fb2(0x1a4,'X%RW')],'code':0x1,'ua':$['UA']};_0x26629f=await _0x2e48f4[_0x297fb2(0x260,'t2)k')](_0x199ba2);let _0x571dcc={'url':JD_API_HOST+'?'+_0x26629f,'headers':{'Host':_0x3e39c5[_0x297fb2(0x130,'eWo7')],'Accept':_0x3e39c5[_0x297fb2(0x1f3,'aJRe')],'Origin':_0x3e39c5[_0x297fb2(0x2ad,'))rI')],'Accept-Encoding':_0x3e39c5[_0x297fb2(0x15d,')5Fz')],'User-Agent':$['UA'],'Accept-Language':_0x3e39c5[_0x297fb2(0x164,'NlkG')],'Referer':_0x3e39c5[_0x297fb2(0x20f,'f^Jz')],'Cookie':cookie},'timeout':0x7530};return new Promise(_0x3a6734=>{const _0x389217=_0x297fb2;_0x3e39c5[_0x389217(0x1f4,'X%RW')](setTimeout,()=>{const _0x14cd2b=_0x389217,_0x2f0bb8={'VFfps':function(_0x3e18d0){const _0x2e54dc=_0x178e;return _0x3e39c5[_0x2e54dc(0x24b,'KO)n')](_0x3e18d0);},'qpaQB':function(_0x193a12,_0xa16b95){const _0x9a1367=_0x178e;return _0x3e39c5[_0x9a1367(0x221,'luX#')](_0x193a12,_0xa16b95);},'PGsil':_0x3e39c5[_0x14cd2b(0x276,'wTrx')],'PmMxS':_0x3e39c5[_0x14cd2b(0x26d,'K#RX')],'jALiE':function(_0x572539,_0x185617){const _0x167f5d=_0x14cd2b;return _0x3e39c5[_0x167f5d(0x2ef,'jA8N')](_0x572539,_0x185617);},'ADtKZ':_0x3e39c5[_0x14cd2b(0x265,'luX#')],'uayJu':function(_0x48e309,_0x4aeb7d){const _0x3dc109=_0x14cd2b;return _0x3e39c5[_0x3dc109(0x251,'HmSO')](_0x48e309,_0x4aeb7d);},'FggEJ':_0x3e39c5[_0x14cd2b(0x14c,'t2)k')],'NxJbS':function(_0x33bf00,_0x73000e){const _0x25b93b=_0x14cd2b;return _0x3e39c5[_0x25b93b(0x305,'jfo6')](_0x33bf00,_0x73000e);}};_0x3e39c5[_0x14cd2b(0x2f8,'(YAL')](_0x3e39c5[_0x14cd2b(0x16b,'X%RW')],_0x3e39c5[_0x14cd2b(0x18d,'*oqe')])?_0x2e3ae7[_0x14cd2b(0x2d3,'(YAL')](_0x4e9716,_0x3d1083):$[_0x14cd2b(0x224,'aJRe')](_0x571dcc,(_0x178502,_0x23ab9d,_0x498ffa)=>{const _0x41eb31=_0x14cd2b,_0x12ef6e={'CNOaL':function(_0xd11f5){const _0x46be45=_0x178e;return _0x2f0bb8[_0x46be45(0x1c3,'GCbz')](_0xd11f5);}};if(_0x2f0bb8[_0x41eb31(0x145,'jA8N')](_0x2f0bb8[_0x41eb31(0x1b0,'HmSO')],_0x2f0bb8[_0x41eb31(0x1c5,'DR[p')]))_0x1db34b[_0x41eb31(0x1ce,'HmSO')]=_0x16c073[_0x41eb31(0x22f,'xp0d')](_0x5bf9e7),_0x26d090[_0x41eb31(0x2f3,'NlkG')][_0x41eb31(0x21d,'w$m*')]&&(_0x320a19[_0x41eb31(0x1f1,'KO)n')]=_0x24b95b[_0x41eb31(0x300,'*oqe')][_0x41eb31(0x2a2,'RT3Y')][_0x41eb31(0x172,'%5dh')],_0x5d7796[_0x41eb31(0x1ad,'&3kO')]=_0x3ac5e9[_0x41eb31(0x240,'6FWW')][_0x41eb31(0x182,'Oply')][_0x41eb31(0x2b1,'&K*%')],_0x41e9f0[_0x41eb31(0x215,'Gnx*')]=_0xfc7509[_0x41eb31(0x169,'))rI')][_0x41eb31(0x229,'jm&3')][_0x41eb31(0x308,'*oqe')],_0x16a962[_0x41eb31(0x22d,'TD*7')]=_0x174c7f[_0x41eb31(0x228,'jA8N')][_0x41eb31(0x23a,'GCbz')][_0x41eb31(0x2b6,'JS4z')]);else try{_0x178502?_0x2f0bb8[_0x41eb31(0x174,'*oqe')](_0x2f0bb8[_0x41eb31(0x2a4,'TD*7')],_0x2f0bb8[_0x41eb31(0x192,'5Qc[')])?(console[_0x41eb31(0x18b,'rcGB')](_0x41eb31(0x267,'yZBE')),$[_0x41eb31(0x254,'go%0')](_0x178502)):_0x12ef6e[_0x41eb31(0x219,'xjx%')](_0x49c747):(_0x498ffa=JSON[_0x41eb31(0x2ea,'*oqe')](_0x498ffa),$[_0x41eb31(0x22e,'G!cU')]=_0x498ffa[_0x41eb31(0x268,'GCbz')]?.[_0x41eb31(0x201,'aJRe')]||'');}catch(_0x4dcea3){$[_0x41eb31(0x1c1,'KO)n')](_0x4dcea3,_0x23ab9d);}finally{_0x2f0bb8[_0x41eb31(0x135,'&K*%')](_0x2f0bb8[_0x41eb31(0x14b,'HmSO')],_0x2f0bb8[_0x41eb31(0x2e1,'5Qc[')])?_0x178b29[_0x41eb31(0x15f,'eWo7')](_0x239ac1,_0x1c0f59):_0x2f0bb8[_0x41eb31(0x2d1,'KO)n')](_0x3a6734,_0x498ffa);}});},_0x394da0);});}async function checkplus(){const _0x5bca60=_0x4712a7,_0x8d02bf={'zYKzy':_0x5bca60(0x1ee,'%5dh'),'WCeAg':function(_0x16215e,_0x2e857d){return _0x16215e==_0x2e857d;},'HFzkA':_0x5bca60(0x1a0,'w$m*'),'IJwCA':function(_0x41ee0,_0x595fd4){return _0x41ee0===_0x595fd4;},'xXpnP':_0x5bca60(0x1d7,'5Qc['),'rbSXW':_0x5bca60(0x2f0,'GCbz'),'Ewrjy':function(_0x477c6a,_0x5a4c00){return _0x477c6a==_0x5a4c00;},'CmvTg':function(_0x3bf691,_0x5b15e2){return _0x3bf691!==_0x5b15e2;},'asEqF':_0x5bca60(0x24c,'aJRe'),'pAszI':function(_0x3b42c5){return _0x3b42c5();},'FhThX':_0x5bca60(0x226,'G!cU'),'ljTru':_0x5bca60(0x1d0,'FYVz'),'ipcgw':_0x5bca60(0x163,'t2)k'),'eYOJv':_0x5bca60(0x2e9,'xp0d'),'ODGjU':_0x5bca60(0x247,'TD*7'),'lbYvl':_0x5bca60(0x250,'&K*%'),'ahcXK':_0x5bca60(0x189,'!Hr1'),'bdGaz':_0x5bca60(0x2c1,'JS4z'),'xTbzO':_0x5bca60(0x1be,'RT3Y')};let _0x10cc4f={'contentType':_0x8d02bf[_0x5bca60(0x1d1,'f^Jz')],'qids':_0x8d02bf[_0x5bca60(0x236,'go%0')],'checkLevel':0x1},_0x5de7ee={'appId':_0x8d02bf[_0x5bca60(0x1a8,'JS4z')],'functionId':_0x8d02bf[_0x5bca60(0x245,'DR[p')],'body':_0x10cc4f,'appid':_0x8d02bf[_0x5bca60(0x2cb,'Gnx*')],'user':$[_0x5bca60(0x1d8,'jA8N')],'code':0x1,'ua':$['UA']};_0x10cc4f=await _0x16ca3a[_0x5bca60(0x1d6,'TD*7')](_0x5de7ee);let _0x42eb51={'url':_0x5bca60(0x1e1,'CZ@B'),'body':_0x10cc4f,'headers':{'User-Agent':$['UA'],'Cookie':cookie,'Origin':_0x8d02bf[_0x5bca60(0x209,'uS[b')],'Referer':_0x8d02bf[_0x5bca60(0x1c6,'*oqe')]}};return new Promise(async _0x4187b6=>{const _0x43addf=_0x5bca60,_0x583420={'Recnh':_0x8d02bf[_0x43addf(0x12b,'CZ@B')],'XAtlM':function(_0x19d81b,_0x289803){const _0x34af4d=_0x43addf;return _0x8d02bf[_0x34af4d(0x2e2,'Gnx*')](_0x19d81b,_0x289803);},'saHpY':_0x8d02bf[_0x43addf(0x136,'K#RX')],'MqwZm':function(_0x16afda,_0x33d502){const _0x4906d9=_0x43addf;return _0x8d02bf[_0x4906d9(0x21c,'w$m*')](_0x16afda,_0x33d502);},'pYffQ':_0x8d02bf[_0x43addf(0x167,'jm&3')],'SmONG':_0x8d02bf[_0x43addf(0x16e,'rWlV')],'LBRVm':function(_0x47c32d,_0x2d6a40){const _0x31aa77=_0x43addf;return _0x8d02bf[_0x31aa77(0x2a9,'!Hr1')](_0x47c32d,_0x2d6a40);},'NKSvw':function(_0x5c2ec2,_0x2fd68f){const _0x2e5e86=_0x43addf;return _0x8d02bf[_0x2e5e86(0x17b,'CE$y')](_0x5c2ec2,_0x2fd68f);},'IeJyE':_0x8d02bf[_0x43addf(0x129,'T6l5')],'rVCTy':function(_0x3170e5){const _0x5ceed4=_0x43addf;return _0x8d02bf[_0x5ceed4(0x25f,'&3kO')](_0x3170e5);}};_0x8d02bf[_0x43addf(0x24f,'DR[p')](_0x8d02bf[_0x43addf(0x2f4,'T6l5')],_0x8d02bf[_0x43addf(0x2ca,'wTrx')])?$[_0x43addf(0x140,'K#RX')](_0x42eb51,async(_0x3b1b0c,_0xb31c02,_0x32028a)=>{const _0x5eadef=_0x43addf,_0x19fdab={'vFzAP':_0x583420[_0x5eadef(0x30b,'%5dh')],'llZUM':function(_0x976462,_0x362cef){const _0x4033dd=_0x5eadef;return _0x583420[_0x4033dd(0x2e4,'w$m*')](_0x976462,_0x362cef);},'zeskA':_0x583420[_0x5eadef(0x304,'NlkG')]};try{if(_0x583420[_0x5eadef(0x289,'KO)n')](_0x583420[_0x5eadef(0x202,'f^Jz')],_0x583420[_0x5eadef(0x187,'DR[p')])){if(_0x3b1b0c)console[_0x5eadef(0x216,'235O')](''+JSON[_0x5eadef(0x2e8,'jfo6')](_0x3b1b0c)),console[_0x5eadef(0x2a7,'Nxi#')](_0x5eadef(0x270,'CXyr'));else{if(_0x583420[_0x5eadef(0x12a,'eWo7')](_0x583420[_0x5eadef(0x2af,'CZ@B')],_0x583420[_0x5eadef(0x2f9,'6FWW')])){_0x32028a=JSON[_0x5eadef(0x252,'jfo6')](_0x32028a);if(_0x583420[_0x5eadef(0x258,'wTrx')](_0x32028a[_0x5eadef(0x165,'TD*7')],0x1a1b98))$[_0x5eadef(0x2c3,'Oply')]=_0x32028a['rs'][_0x5eadef(0x277,'(YAL')][_0x5eadef(0x1d2,'CZ@B')]?!![]:![];else{}}else{const _0x343442=_0x19fdab[_0x5eadef(0x298,'f^Jz')][_0x5eadef(0x1f2,'K#RX')]('|');let _0x475201=0x0;while(!![]){switch(_0x343442[_0x475201++]){case'0':_0x22835c[_0x5eadef(0x16d,'yZBE')]=_0x4c9108[_0x5eadef(0x266,'T6l5')]?.[_0x5eadef(0x2ce,'go%0')]?.[_0x5eadef(0x25e,'235O')]||'';continue;case'1':_0x4cb569[_0x5eadef(0x149,'RT3Y')]=_0x19fdab[_0x5eadef(0x1d5,'@Ay7')](_0x599ee1[_0x5eadef(0x170,'jfo6')]?.[_0x5eadef(0x27b,'eWo7')]?.[_0x5eadef(0x208,'w$m*')],0x1);continue;case'2':_0x5f0fb9[_0x5eadef(0x237,'&K*%')]=_0x4a000c[_0x5eadef(0x171,'*oqe')]?.[_0x5eadef(0x27a,'!Hr1')]?.[_0x5eadef(0x19e,'CE$y')]?.[_0x5eadef(0x238,'wTrx')];continue;case'3':_0x39d0c3[_0x5eadef(0x30c,'X%RW')]=_0x1baab4[_0x5eadef(0x1a1,'%5dh')];continue;case'4':_0x57ba80[_0x5eadef(0x157,'FYVz')]=_0x2aeb53[_0x5eadef(0x175,'wTrx')]?.[_0x5eadef(0x2b7,')Jy3')]?.[_0x5eadef(0x234,'%5dh')]||0x0;continue;}break;}}}}else!_0x227600&&(_0x1650e1[_0x5eadef(0x1a7,'*oqe')](_0x19fdab[_0x5eadef(0x1e2,'w$m*')]),_0x542fdb[_0x5eadef(0x299,'xp0d')](_0x336e09[_0x5eadef(0x206,'&K^Y')](_0x396ae1))),_0x1482f4=!![];}catch(_0x1d25e2){$[_0x5eadef(0x155,')5Fz')](_0x1d25e2,_0xb31c02);}finally{if(_0x583420[_0x5eadef(0x2cf,'t2)k')](_0x583420[_0x5eadef(0x15a,'TD*7')],_0x583420[_0x5eadef(0x273,'CE$y')])){const _0x5352f8=_0x5b71e0[_0x5eadef(0x191,'&3kO')](_0x536064,arguments);return _0x30070c=null,_0x5352f8;}else _0x583420[_0x5eadef(0x133,'rcGB')](_0x4187b6);}}):(_0x1ac639[_0x43addf(0x29c,'DR[p')]=_0x1f97e2[_0x43addf(0x1fd,'!Hr1')](/"score":(\d+)/)?_0x47abaa[_0x43addf(0x1b9,'&K*%')](/"score":(\d+)/)[0x1]:0x0,_0x2866fa[_0x43addf(0x1fa,'RT3Y')]=_0x2d5cb0[_0x43addf(0x141,'(YAL')](/"currentBeanNum":(\d+)/)?_0x356653[_0x43addf(0x28f,'go%0')](/"currentBeanNum":(\d+)/)[0x1]:0x0,_0x29fbd8[_0x43addf(0x286,'CE$y')]=_0x36a7d5[_0x43addf(0x292,'wTrx')](/"showName":"(.*?)"/)?_0x246f7e[_0x43addf(0x2c9,'uS[b')](/"showName":"(.*?)"/)[0x1]:_0x54f45a[_0x43addf(0x26c,'GCbz')]);});}var version_ = 'jsjiami.com.v7';
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

            console.log(`******开始查询【京东账号${$.index}】${$.nickName || $.UserName}*********`);
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
                newfarm_info()
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
            ReturnMessage += `普通会员`;
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
        ReturnMessage += `【汪贝余额】${$.wb_score}${$.wb_expire!=0?'(近7日将过期'+$.wb_expire+')':''}`;
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
function wanyiwan() {
    return new Promise(async (resolve) => {
        const options = {
            url: `http://api.m.jd.com/client.action`,
            body: `functionId=wanyiwan_exchange_page&appid=signed_wh5&body={"version":1}&&networkType=wifi&client=ios&clientVersion=${$.UA.split(';')[2]}&t=${Date.now()}`,
            headers: {
                Cookie: cookie,
                'content-type': `application/x-www-form-urlencoded`,
                // 'Accept-Encoding': `gzip,compress,br,deflate`,
                Origin: `https://pro.m.jd.com`,
                Referer: `https://pro.m.jd.com/`,
                'User-Agent': $.UA,
            },
            timeout: 30000
        };
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err);
                } else {
                    if (data) {
                        data = $.toObj(data);
                        if (data.data.bizCode == 0) {
                            $.wyw_score = data.data.result.score || 0;
                        }

                    } else {
                        $.log('服务器返回空数据');
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
function wb_info() {
    return new Promise(async (resolve) => {
        const options = {
            url: `http://api.m.jd.com/functionId=atop_channel_my_score`,
            body: `appid=jd-super-market&functionId=atop_channel_my_score&client=m&body=%7B%22bizCode%22%3A%22cn_retail_jdsupermarket%22%2C%22scenario%22%3A%22sign%22%2C%22babelChannel%22%3A%22ttt1%22%2C%22isJdApp%22%3A%221%22%2C%22isWx%22%3A%220%22%7D&t=${Date.now()}`,
            headers: {
                Cookie: cookie,
                'content-type': `application/x-www-form-urlencoded`,
                // 'Accept-Encoding': `gzip,compress,br,deflate`,
                Origin: `https://pro.m.jd.com`,
                Referer: `https://pro.m.jd.com/`,
                'User-Agent': $.UA,
            },
            timeout: 30000
        };
        $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err);
                } else {
                    if (data) {
                        data = $.toObj(data);
                        if (data.success) {
                            try{
                               $.wb_score = data.data.floorData.items[0].restScore || 0; 
                               $.wb_expire = data.data.floorData.items[0].nexp || 0; 
                            } catch{}
                        }

                    } else {
                        $.log('服务器返回空数据');
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
                        $.message += `【红包总额】${$.balance}(总过期${$.expiredBalance})元 \n`;
                        if ($.jxRed > 0) {
                            if ($.jxRedExpire > 0)
                                $.message += `【京喜红包】${$.jxRed}(将过期${$.jxRedExpire.toFixed(2)})元 \n`;
                            else
                                $.message += `【京喜红包】${$.jxRed}元 \n`;
                        }

                        if ($.jsRed > 0) {
                            if ($.jsRedExpire > 0)
                                $.message += `【京喜特价】${$.jsRed}(将过期${$.jsRedExpire.toFixed(2)})元 \n`;
                            else
                                $.message += `【京喜特价】${$.jsRed}元 \n`;
                        }

                        if ($.jdRed > 0) {
                            if ($.jdRedExpire > 0)
                                $.message += `【京东红包】${$.jdRed}(将过期${$.jdRedExpire.toFixed(2)})元 \n`;
                            else
                                $.message += `【京东红包】${$.jdRed}元 \n`;
                        }

                        if ($.jdhRed > 0) {
                            if ($.jdhRedExpire > 0)
                                $.message += `【健康红包】${$.jdhRed}(将过期${$.jdhRedExpire.toFixed(2)})元 \n`;
                            else
                                $.message += `【健康红包】${$.jdhRed}元 \n`;
                        }

                        if ($.jdwxRed > 0) {
                            if ($.jdwxRedExpire > 0)
                                $.message += `【微信小程序】${$.jdwxRed}(将过期${$.jdwxRedExpire.toFixed(2)})元 \n`;
                            else
                                $.message += `【微信小程序】${$.jdwxRed}元 \n`;
                        }

                        if ($.jdGeneralRed > 0) {
                            if ($.jdGeneralRedExpire > 0)
                                $.message += `【全平台通用】${$.jdGeneralRed}(将过期${$.jdGeneralRedExpire.toFixed(2)})元 \n`;
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