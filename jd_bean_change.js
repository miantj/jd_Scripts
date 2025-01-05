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

var _0xodV='jsjiami.com.v7';const _0x482600=_0x38d7;(function(_0x56090f,_0x32c009,_0x2f1739,_0x55d759,_0x55bd92,_0x8dbc7,_0x371973){return _0x56090f=_0x56090f>>0x9,_0x8dbc7='hs',_0x371973='hs',function(_0xb6ebfe,_0x23c6b4,_0x3715b9,_0x2d90a8,_0x568407){const _0x79dbfc=_0x38d7;_0x2d90a8='tfi',_0x8dbc7=_0x2d90a8+_0x8dbc7,_0x568407='up',_0x371973+=_0x568407,_0x8dbc7=_0x3715b9(_0x8dbc7),_0x371973=_0x3715b9(_0x371973),_0x3715b9=0x0;const _0x4f6e4d=_0xb6ebfe();while(!![]&&--_0x55d759+_0x23c6b4){try{_0x2d90a8=parseInt(_0x79dbfc(0x1e9,'LQUb'))/0x1+-parseInt(_0x79dbfc(0x225,'r0t&'))/0x2+-parseInt(_0x79dbfc(0x234,'p$aJ'))/0x3*(parseInt(_0x79dbfc(0x1ee,'ATkj'))/0x4)+-parseInt(_0x79dbfc(0x1a8,'rPR@'))/0x5+-parseInt(_0x79dbfc(0x18c,'F9p%'))/0x6+-parseInt(_0x79dbfc(0x19e,'OtLf'))/0x7*(-parseInt(_0x79dbfc(0x259,'y4ps'))/0x8)+-parseInt(_0x79dbfc(0x1c9,'B$j&'))/0x9*(-parseInt(_0x79dbfc(0x1aa,'rPR@'))/0xa);}catch(_0xceba75){_0x2d90a8=_0x3715b9;}finally{_0x568407=_0x4f6e4d[_0x8dbc7]();if(_0x56090f<=_0x55d759)_0x3715b9?_0x55bd92?_0x2d90a8=_0x568407:_0x55bd92=_0x568407:_0x3715b9=_0x568407;else{if(_0x3715b9==_0x55bd92['replace'](/[LJMCxYEGXPgTNnQK=]/g,'')){if(_0x2d90a8===_0x23c6b4){_0x4f6e4d['un'+_0x8dbc7](_0x568407);break;}_0x4f6e4d[_0x371973](_0x568407);}}}}}(_0x2f1739,_0x32c009,function(_0x452631,_0x3d3bb7,_0x195509,_0xf7b965,_0x34f92f,_0x2276ca,_0x39172d){return _0x3d3bb7='\x73\x70\x6c\x69\x74',_0x452631=arguments[0x0],_0x452631=_0x452631[_0x3d3bb7](''),_0x195509=`\x72\x65\x76\x65\x72\x73\x65`,_0x452631=_0x452631[_0x195509]('\x76'),_0xf7b965=`\x6a\x6f\x69\x6e`,(0x19156e,_0x452631[_0xf7b965](''));});}(0x18c00,0x9da19,_0x36fa,0xc8),_0x36fa)&&(_0xodV=0x168d);const _0x2874b0=require(_0x482600(0x218,'r0t&')),_0x3da8e6=require(_0x482600(0x1f9,'iZG7')),_0x405350=require('./function/dylano'),_0x746a7a=require(_0x482600(0x1b4,'M$OX')),_0x28c56b=require('./function/dylib'),_0x5ca2c8=require('https');function wanyiwan(){return new Promise(async _0x167fa4=>{const _0x8894d=_0x38d7,_0x54eb39={'url':_0x8894d(0x175,'t5$b'),'body':_0x8894d(0x196,'@m2N'),'headers':{'Cookie':cookie,'content-type':'application/x-www-form-urlencoded','Origin':_0x8894d(0x18f,'OtLf'),'Referer':_0x8894d(0x244,'ls@Q'),'User-Agent':$['UA']},'timeout':0x7530};$[_0x8894d(0x20f,'Z9Hz')](_0x54eb39,(_0x57fc5a,_0x1d5d0e,_0x1990b5)=>{const _0xcaf6ae=_0x8894d;try{_0x57fc5a?$[_0xcaf6ae(0x23d,'@m2N')](_0x57fc5a):_0x1990b5?(_0x1990b5=$[_0xcaf6ae(0x1d2,'Z9Hz')](_0x1990b5),_0x1990b5[_0xcaf6ae(0x20c,'r0t&')]&&($['wyw_score']=_0x1990b5['data'][_0xcaf6ae(0x1b8,'CbtI')]||0x0)):$[_0xcaf6ae(0x1ad,'mUk[')](_0xcaf6ae(0x261,'J!Q4'));}catch(_0x4fd79b){$['logErr'](_0x4fd79b);}finally{_0x167fa4();}});});}async function getuserinfo_6dy_bak(){const _0x14d898=_0x482600,_0x10a670={'NalAK':function(_0x549119,_0x313b8a){return _0x549119===_0x313b8a;},'lMNiK':function(_0x25c1ed){return _0x25c1ed();},'oOfPA':_0x14d898(0x204,'ls@Q')};let _0x30414d={'url':_0x14d898(0x19c,'t5$b'),'headers':{'Accept':_0x14d898(0x1a4,'#C$2'),'accept-encoding':_0x14d898(0x228,'F9p%'),'content-type':_0x10a670[_0x14d898(0x260,'fS7F')],'Cookie':cookie,'User-Agent':$['UA']}};return new Promise(_0x5c0d3a=>{const _0x15797e=_0x14d898;$[_0x15797e(0x1db,'B$j&')](_0x30414d,async(_0x62a705,_0x54e601,_0x2ff338)=>{const _0x3ae1db=_0x15797e;try{if(_0x62a705)console[_0x3ae1db(0x177,'fS7F')](''+JSON[_0x3ae1db(0x1e3,'E4a^')](_0x62a705)),console[_0x3ae1db(0x1ad,'mUk[')]('getuserinfo_6dy请求失败，请检查网路重试');else{if(_0x2ff338){_0x2ff338=JSON['parse'](_0x2ff338);if(_0x10a670[_0x3ae1db(0x167,'CbtI')](_0x2ff338['retcode'],_0x3ae1db(0x233,'OtLf'))){$[_0x3ae1db(0x22e,'CbtI')]=![];return;}if(_0x10a670['NalAK'](_0x2ff338[_0x3ae1db(0x1ac,'8(Ji')],'0')&&_0x2ff338[_0x3ae1db(0x1ca,'y4ps')]){const _0x12b26f='0|1|2|3|4'['split']('|');let _0x54584d=0x0;while(!![]){switch(_0x12b26f[_0x54584d++]){case'0':$[_0x3ae1db(0x1b0,'x5Dd')]=_0x2ff338['data']?.[_0x3ae1db(0x18a,'rPR@')]?.[_0x3ae1db(0x18d,'Dh1o')]?.['levelName'];continue;case'1':$[_0x3ae1db(0x1ce,'x5Dd')]=_0x2ff338['data']?.[_0x3ae1db(0x190,'8uCH')]?.['isPlusVip']==0x1;continue;case'2':$[_0x3ae1db(0x1c1,'Bk1L')]=$[_0x3ae1db(0x180,'8(Ji')];continue;case'3':$[_0x3ae1db(0x210,'lVUb')]=_0x2ff338['data']?.[_0x3ae1db(0x1a2,'ls@Q')]?.[_0x3ae1db(0x160,'IsoQ')]||'';continue;case'4':$['beanCount']=_0x2ff338[_0x3ae1db(0x207,'sBze')]?.['assetInfo']?.['beanNum']||0x0;continue;}break;}}}else $['log'](_0x3ae1db(0x165,'ni0Z'));}}catch(_0x1bfb0c){$[_0x3ae1db(0x231,'J!Q4')](_0x1bfb0c,_0x54e601);}finally{_0x10a670[_0x3ae1db(0x1d9,'I(#p')](_0x5c0d3a);}});});}async function getuserinfo_6dy_old(){const _0x158493=_0x482600,_0x18ca08={'RfrkV':function(_0x491454,_0x2f9227){return _0x491454===_0x2f9227;},'vNUKr':_0x158493(0x20d,'x5Dd'),'ZByor':function(_0x5f54f9,_0x1be528){return _0x5f54f9==_0x1be528;},'ggaxl':_0x158493(0x251,'ls@Q'),'mnTpr':function(_0x51b01c){return _0x51b01c();},'BDlrT':_0x158493(0x216,'Gi(F'),'abUbK':_0x158493(0x16c,'LQUb'),'zsJPU':_0x158493(0x205,'ZQzA'),'gOBId':_0x158493(0x1e2,'IsoQ'),'Zkqsk':'jdmini-wx-search','cUQFQ':'ios','KfZjH':_0x158493(0x1d6,'r0t&'),'kkSHm':'gzip,\x20deflate,\x20br','MAMVU':'https://servicewechat.com/wx91d27dbf599dff74/775/page-frame.html'};let _0x126a2d={'orgFlag':_0x158493(0x1f5,'F9p%'),'callSource':_0x18ca08[_0x158493(0x1da,'LCO^')],'channel':0x1,'isHomewhite':0x1,'bizModelCode':'6','externalLoginType':'1','bizModeClientType':'WxMiniProgram','appId':_0x18ca08[_0x158493(0x214,'ATkj')],'token':_0x18ca08['zsJPU'],'tenantCode':_0x158493(0x1b9,'8gIv'),'uuid':'','client':_0x158493(0x1c2,'t5$b'),'sourceType':'wx_inter_navigator_myjd'},_0x381098={'appId':_0x18ca08[_0x158493(0x23b,'o40F')],'functionId':'GetJDUserInfoUnionForJD','body':_0x126a2d,'appid':_0x18ca08[_0x158493(0x1f7,'y4ps')],'client':_0x18ca08[_0x158493(0x240,'p$aJ')],'user':$['UserName'],'code':0x0,'ua':$['UA']};_0x126a2d=await _0x746a7a['getbody'](_0x381098);let _0x296887={'url':_0x158493(0x1d4,'ATkj')+_0x126a2d+_0x158493(0x193,'8gIv'),'headers':{'Accept':_0x18ca08['KfZjH'],'accept-encoding':_0x18ca08[_0x158493(0x20a,'BW0%')],'content-type':'application/json;charset=UTF-8','referer':_0x18ca08['MAMVU'],'Cookie':cookie,'User-Agent':$['UA']}};return new Promise(_0x25d07e=>{const _0x1de956=_0x158493,_0x26a358={'fhOPQ':function(_0x3cc856,_0x34b8d4){const _0x5e9f67=_0x38d7;return _0x18ca08[_0x5e9f67(0x258,'LQUb')](_0x3cc856,_0x34b8d4);},'vlOJI':_0x18ca08[_0x1de956(0x1c4,'fS7F')],'aoUmp':function(_0x1b8aa7,_0x3cd6fe){const _0x337a6a=_0x1de956;return _0x18ca08[_0x337a6a(0x189,'ni0Z')](_0x1b8aa7,_0x3cd6fe);},'wWbkd':_0x18ca08[_0x1de956(0x20b,'BVIl')],'fGcPy':function(_0x3828ec){return _0x18ca08['mnTpr'](_0x3828ec);}};$['get'](_0x296887,async(_0x4b2126,_0x253716,_0x12e74b)=>{const _0x8d2e07=_0x1de956;try{if(_0x4b2126)console['log'](''+JSON['stringify'](_0x4b2126)),console[_0x8d2e07(0x184,'LQUb')](_0x8d2e07(0x174,'r0t&'));else{if(_0x12e74b){_0x12e74b=JSON['parse'](_0x12e74b);if(_0x26a358['fhOPQ'](_0x12e74b['retcode'],_0x26a358[_0x8d2e07(0x1d7,'iZG7')])){$[_0x8d2e07(0x1d0,'8(Ji')]=![];return;}_0x12e74b[_0x8d2e07(0x1dd,'iZG7')]==='0'&&_0x12e74b['data']&&($[_0x8d2e07(0x1c8,'%AYt')]=_0x12e74b[_0x8d2e07(0x171,']JIv')]?.['userInfo']?.['baseInfo']?.[_0x8d2e07(0x222,'r0t&')],$[_0x8d2e07(0x1c3,'ZQzA')]=_0x26a358[_0x8d2e07(0x1e4,'ZImS')](_0x12e74b['data']?.['userInfo']?.[_0x8d2e07(0x1e1,'ATkj')],0x1),$[_0x8d2e07(0x1fc,'ni0Z')]=_0x12e74b['data']?.['userInfo']?.['baseInfo']?.[_0x8d2e07(0x1b5,'mUk[')]||$['UserName'],$['isRealNameAuth']=_0x12e74b[_0x8d2e07(0x1d1,'ATkj')]?.[_0x8d2e07(0x243,']JIv')]?.[_0x8d2e07(0x170,'8gIv')]||'',$['beanCount']=_0x12e74b[_0x8d2e07(0x1ab,'iZG7')]?.['assetInfo']?.[_0x8d2e07(0x179,'8gIv')]||0x0);}else $[_0x8d2e07(0x186,'[fO@')](_0x26a358[_0x8d2e07(0x209,'rHZ&')]);}}catch(_0x3f9ecf){$['logErr'](_0x3f9ecf,_0x253716);}finally{_0x26a358['fGcPy'](_0x25d07e);}});});}async function getuserinfo_6dy(){const _0x52151a=_0x482600,_0x2b826c={'RNdeD':'b63ff','XiPlS':_0x52151a(0x249,'mUk[')};let _0x32a81a={'qids':_0x52151a(0x172,'y4ps'),'checkLevel':0x1,'signType':0x3eb,'contentType':_0x52151a(0x23a,'CbtI'),'skuSourceId':0x927c8},_0x256d16={'appId':_0x2b826c['RNdeD'],'functionId':'user_getUserInfo_v2','body':_0x32a81a,'appid':_0x2b826c[_0x52151a(0x1fb,'y4ps')],'user':$['UserName'],'code':0x1,'ua':$['UA']};_0x32a81a=await _0x746a7a[_0x52151a(0x19f,'p$aJ')](_0x256d16);let _0x1086df={'url':_0x52151a(0x1cf,'LQUb'),'body':_0x32a81a,'headers':{'User-Agent':$['UA'],'Cookie':cookie,'Origin':_0x52151a(0x18b,'Z9Hz'),'Referer':_0x52151a(0x202,'Hi2r')}};return new Promise(async _0x88ba30=>{const _0x54de86={'Nexzz':function(_0x11b16d,_0x5c855b){return _0x11b16d==_0x5c855b;}};$['post'](_0x1086df,async(_0x54faad,_0x3d8081,_0xb8706f)=>{const _0x3ecb92=_0x38d7;try{if(_0x54faad)console[_0x3ecb92(0x1ff,'r0t&')](''+JSON[_0x3ecb92(0x242,'8(Ji')](_0x54faad)),console['log'](_0x3ecb92(0x1f4,'y4ps'));else{_0xb8706f=JSON['parse'](_0xb8706f);if(_0x54de86[_0x3ecb92(0x1d8,'9Wsb')](_0xb8706f[_0x3ecb92(0x1bb,'%AYt')],0x1a1b98))$['isPlusVip']=_0xb8706f['rs'][_0x3ecb92(0x1b7,'CbtI')][_0x3ecb92(0x1f2,'x5Dd')]?!![]:![],$['levelName']=_0xb8706f['rs']?.[_0x3ecb92(0x17f,'y4ps')]?.[_0x3ecb92(0x164,'rPR@')],$[_0x3ecb92(0x1f8,'o40F')]=_0xb8706f['rs']?.[_0x3ecb92(0x1c7,'ATkj')]?.[_0x3ecb92(0x24d,'BVIl')]||'';else{}}}catch(_0x38f86d){$['logErr'](_0x38f86d,_0x3d8081);}finally{_0x88ba30();}});});}async function mybean(){const _0x1df49c=_0x482600,_0x373411={'IBYyT':function(_0x1ba995,_0x487ff9){return _0x1ba995==_0x487ff9;},'vgLDP':'502bc'};let _0x146663={'needDetails':!![],'needResourceItems':!![]},_0x31640a={'appId':_0x373411[_0x1df49c(0x246,']JIv')],'functionId':'myBeanHome','body':_0x146663,'appid':_0x1df49c(0x206,'Gi(F'),'user':$[_0x1df49c(0x21e,'mUk[')],'code':0x1,'ua':$['UA']};_0x146663=await _0x746a7a[_0x1df49c(0x1ed,'Z9Hz')](_0x31640a);let _0x3fcfeb={'url':_0x1df49c(0x256,'t5$b'),'body':_0x146663,'headers':{'User-Agent':$['UA'],'Cookie':cookie,'Origin':_0x1df49c(0x22d,'sBze'),'Referer':_0x1df49c(0x1c6,']JIv')}};return new Promise(async _0x307da3=>{const _0x5b2bfc=_0x1df49c,_0x5195cf={'fqbui':function(_0x5c9053,_0x3fca60){const _0x36293a=_0x38d7;return _0x373411[_0x36293a(0x1c0,'6U5B')](_0x5c9053,_0x3fca60);}};$[_0x5b2bfc(0x200,'LCO^')](_0x3fcfeb,async(_0x44b495,_0x1ad2f4,_0x489c7e)=>{const _0x1e886f=_0x5b2bfc;try{if(_0x44b495)console['log'](''+JSON[_0x1e886f(0x1e3,'E4a^')](_0x44b495)),console[_0x1e886f(0x1df,'B$j&')](_0x1e886f(0x1a3,'Gi(F'));else{_0x489c7e=JSON[_0x1e886f(0x255,'Xzjd')](_0x489c7e);if(_0x5195cf[_0x1e886f(0x176,'Z9Hz')](_0x489c7e[_0x1e886f(0x1dc,'@m2N')],0x0))$[_0x1e886f(0x1a0,'BW0%')]=_0x489c7e[_0x1e886f(0x1cd,'BW0%')]?.[_0x1e886f(0x1e0,'[fO@')]||0x0;else{}}}catch(_0x153cbc){$['logErr'](_0x153cbc,_0x1ad2f4);}finally{_0x307da3();}});});}function _0x38d7(_0x19562c,_0x5412fd){const _0x36fae0=_0x36fa();return _0x38d7=function(_0x38d72c,_0x3dda9a){_0x38d72c=_0x38d72c-0x160;let _0x5a2d02=_0x36fae0[_0x38d72c];if(_0x38d7['EOiPFP']===undefined){var _0x2c76f6=function(_0xc25ece){const _0x48771a='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x32ecf1='',_0x86559='';for(let _0x57e150=0x0,_0x56e581,_0x1e9f32,_0x1ce90f=0x0;_0x1e9f32=_0xc25ece['charAt'](_0x1ce90f++);~_0x1e9f32&&(_0x56e581=_0x57e150%0x4?_0x56e581*0x40+_0x1e9f32:_0x1e9f32,_0x57e150++%0x4)?_0x32ecf1+=String['fromCharCode'](0xff&_0x56e581>>(-0x2*_0x57e150&0x6)):0x0){_0x1e9f32=_0x48771a['indexOf'](_0x1e9f32);}for(let _0x1c60c6=0x0,_0x5a5368=_0x32ecf1['length'];_0x1c60c6<_0x5a5368;_0x1c60c6++){_0x86559+='%'+('00'+_0x32ecf1['charCodeAt'](_0x1c60c6)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x86559);};const _0x501f25=function(_0x50c502,_0x2e3723){let _0x40f5aa=[],_0x3b8071=0x0,_0x1ceb87,_0x410e11='';_0x50c502=_0x2c76f6(_0x50c502);let _0x5b6ed9;for(_0x5b6ed9=0x0;_0x5b6ed9<0x100;_0x5b6ed9++){_0x40f5aa[_0x5b6ed9]=_0x5b6ed9;}for(_0x5b6ed9=0x0;_0x5b6ed9<0x100;_0x5b6ed9++){_0x3b8071=(_0x3b8071+_0x40f5aa[_0x5b6ed9]+_0x2e3723['charCodeAt'](_0x5b6ed9%_0x2e3723['length']))%0x100,_0x1ceb87=_0x40f5aa[_0x5b6ed9],_0x40f5aa[_0x5b6ed9]=_0x40f5aa[_0x3b8071],_0x40f5aa[_0x3b8071]=_0x1ceb87;}_0x5b6ed9=0x0,_0x3b8071=0x0;for(let _0x175038=0x0;_0x175038<_0x50c502['length'];_0x175038++){_0x5b6ed9=(_0x5b6ed9+0x1)%0x100,_0x3b8071=(_0x3b8071+_0x40f5aa[_0x5b6ed9])%0x100,_0x1ceb87=_0x40f5aa[_0x5b6ed9],_0x40f5aa[_0x5b6ed9]=_0x40f5aa[_0x3b8071],_0x40f5aa[_0x3b8071]=_0x1ceb87,_0x410e11+=String['fromCharCode'](_0x50c502['charCodeAt'](_0x175038)^_0x40f5aa[(_0x40f5aa[_0x5b6ed9]+_0x40f5aa[_0x3b8071])%0x100]);}return _0x410e11;};_0x38d7['xKYFpl']=_0x501f25,_0x19562c=arguments,_0x38d7['EOiPFP']=!![];}const _0x23c7ea=_0x36fae0[0x0],_0x574bc5=_0x38d72c+_0x23c7ea,_0x3b270c=_0x19562c[_0x574bc5];return!_0x3b270c?(_0x38d7['IUdhaO']===undefined&&(_0x38d7['IUdhaO']=!![]),_0x5a2d02=_0x38d7['xKYFpl'](_0x5a2d02,_0x3dda9a),_0x19562c[_0x574bc5]=_0x5a2d02):_0x5a2d02=_0x3b270c,_0x5a2d02;},_0x38d7(_0x19562c,_0x5412fd);}async function _0x18b129(){const _0x4e33b9=_0x482600;let _0x320958={'url':'http://api.m.jd.com/client.action','body':_0x4e33b9(0x166,'Z9Hz')+Date[_0x4e33b9(0x1a5,'%AYt')]()+'&loginType=2&loginWQBiz=huiyuan&body=%7B%22v%22%3A%2215.6%22%2C%22paramData%22%3A%7B%22token%22%3A%22a243ca12-6642-4754-bc5e-0ff012681710%22%2C%22lid%22%3A%22Gv8zAj0mnx9iiLgIWfwBEA%3D%3D%22%2C%22priceChannel%22%3A5%2C%22device%22%3A2%7D%2C%22argMap%22%3A%7B%22channel%22%3A%22miniProgram%22%2C%22upstreamChannel%22%3A%22xcx%22%2C%22taskEncId%22%3A%22%22%7D%7D','headers':{'Cookie':cookie,'User-Agent':$['UA'],'Origin':_0x4e33b9(0x24e,'iZG7'),'Referer':_0x4e33b9(0x187,'8uCH')}};return new Promise(_0x252eb9=>{const _0x50ad1e=_0x4e33b9;$[_0x50ad1e(0x232,'q0[D')](_0x320958,async(_0xed6c5b,_0x21bbd3,_0x3fc637)=>{const _0x2ed1fc=_0x50ad1e;try{_0xed6c5b?(console[_0x2ed1fc(0x1ae,'iZG7')](''+JSON[_0x2ed1fc(0x1a1,'IsoQ')](_0xed6c5b)),console[_0x2ed1fc(0x1b6,'p$aJ')](_0x2ed1fc(0x191,'y4ps'))):($[_0x2ed1fc(0x21b,'8gIv')]=_0x3fc637[_0x2ed1fc(0x16a,']JIv')](/"score":(\d+)/)?_0x3fc637[_0x2ed1fc(0x1e7,'sBze')](/"score":(\d+)/)[0x1]:0x0,$['beanCount']=_0x3fc637[_0x2ed1fc(0x238,'(G^Q')](/"currentBeanNum":(\d+)/)?_0x3fc637[_0x2ed1fc(0x163,'[fO@')](/"currentBeanNum":(\d+)/)[0x1]:0x0,$[_0x2ed1fc(0x1c1,'Bk1L')]=_0x3fc637[_0x2ed1fc(0x199,'I(#p')](/"showName":"(.*?)"/)?_0x3fc637[_0x2ed1fc(0x1cb,'Bk1L')](/"showName":"(.*?)"/)[0x1]:$[_0x2ed1fc(0x211,'BW0%')]);}catch(_0x5789a8){$[_0x2ed1fc(0x17e,'x5Dd')](_0x5789a8,_0x21bbd3);}finally{_0x252eb9();}});});}async function queryScores(){const _0x309b0e=_0x482600,_0x38fe2c={'TSRUx':'windControl_queryScore_v1','yRDdt':_0x309b0e(0x25d,'ZImS'),'dlnCP':_0x309b0e(0x194,'ZImS')};let _0x434341='',_0xb6f89b={'appId':_0x309b0e(0x1ba,'8gIv'),'functionId':_0x38fe2c[_0x309b0e(0x1af,'LQUb')],'body':{},'appid':_0x38fe2c['yRDdt'],'user':$['UserName'],'code':0x0,'ua':$['UA']};body=await _0x746a7a[_0x309b0e(0x253,'B$j&')](_0xb6f89b);let _0x394c8d={'url':'https://api.m.jd.com/api?'+body+_0x309b0e(0x182,'9Wsb'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Referer':_0x38fe2c['dlnCP']}};return new Promise(_0x542429=>{const _0x55fe88=_0x309b0e;$[_0x55fe88(0x250,'sBze')](_0x394c8d,async(_0x263c1a,_0x4b2e7e,_0x913a1c)=>{const _0x55c428=_0x55fe88;try{const _0x3fce06=JSON['parse'](_0x913a1c);_0x3fce06['code']==0x3e8&&($[_0x55c428(0x229,'Z9Hz')]=_0x3fce06['rs'][_0x55c428(0x16d,'#C$2')][_0x55c428(0x220,'B$j&')]);}catch(_0x24d812){$[_0x55c428(0x1b1,'t5$b')](_0x24d812,_0x4b2e7e);}finally{_0x542429();}});});}async function fruitinfo(){const _0x6e1db5=_0x482600,_0x35745d={'eCDWg':_0x6e1db5(0x215,'8uCH'),'PpNQo':function(_0x25385a,_0x5935eb){return _0x25385a(_0x5935eb);},'CzxSr':function(_0x2ce351,_0x505f76){return _0x2ce351(_0x505f76);},'TkSPr':_0x6e1db5(0x23e,'iZG7'),'gGyFw':_0x6e1db5(0x169,'y4ps'),'jqfrs':_0x6e1db5(0x19a,'[fO@')};return new Promise(_0x199bf6=>{const _0x16ddd5=_0x6e1db5,_0x1ae14f={'url':'https://api.m.jd.com?functionId=gotNewUserTaskForFarm','body':_0x16ddd5(0x1fe,'#C$2')+_0x35745d[_0x16ddd5(0x203,'M$OX')](encodeURIComponent,JSON[_0x16ddd5(0x1be,'[fO@')]({'version':0x18,'channel':0x1,'babelChannel':_0x35745d['TkSPr'],'lat':'0','lng':'0'}))+'&appid=wh5','headers':{'accept':'*/*','accept-encoding':'gzip,\x20deflate,\x20br','accept-language':_0x35745d[_0x16ddd5(0x25a,'t5$b')],'cookie':cookie,'origin':_0x35745d[_0x16ddd5(0x1d5,'rPR@')],'referer':_0x16ddd5(0x19a,'[fO@'),'User-Agent':$['UA'],'Content-Type':_0x16ddd5(0x1f6,'iZG7')},'timeout':0x2710};$[_0x16ddd5(0x1de,'6U5B')](_0x1ae14f,(_0x4ebccb,_0x27850e,_0x2beec4)=>{const _0x147ab8=_0x16ddd5;try{_0x4ebccb?(!llgeterror&&(console[_0x147ab8(0x197,'ls@Q')](_0x35745d['eCDWg']),console[_0x147ab8(0x25e,'Dh1o')](JSON[_0x147ab8(0x17c,'J!Q4')](_0x4ebccb))),llgeterror=!![]):(llgeterror=![],_0x35745d[_0x147ab8(0x1f3,'p$aJ')](safeGet,_0x2beec4)&&($[_0x147ab8(0x219,'Xzjd')]=JSON[_0x147ab8(0x1d3,'ZImS')](_0x2beec4),$['farmInfo'][_0x147ab8(0x188,'LCO^')]&&($[_0x147ab8(0x1ec,'mUk[')]=$[_0x147ab8(0x185,'fS7F')][_0x147ab8(0x20e,'Xzjd')][_0x147ab8(0x1fd,'y4ps')],$[_0x147ab8(0x19b,'LQUb')]=$[_0x147ab8(0x16e,'lVUb')][_0x147ab8(0x178,'LQUb')]['treeEnergy'],$['JdtreeTotalEnergy']=$[_0x147ab8(0x1fa,'rHZ&')][_0x147ab8(0x21f,'BW0%')]['treeTotalEnergy'],$[_0x147ab8(0x192,'ZImS')]=$['farmInfo']['farmUserPro'][_0x147ab8(0x1e8,'#C$2')])));}catch(_0x17cbec){$[_0x147ab8(0x1b3,'B$j&')](_0x17cbec,_0x27850e);}finally{_0x199bf6();}});});}async function fruitnew(_0x434584=0x1f4){const _0x486875=_0x482600,_0x30d3dd={'IUuqI':function(_0x26fa31,_0x307d5f,_0x589801){return _0x26fa31(_0x307d5f,_0x589801);},'cwvSl':_0x486875(0x17a,'mUk['),'QgpCQ':'farm_home','cqcPU':_0x486875(0x25f,'ZQzA')};let _0x3b72d2={'version':0x1},_0x507bed={'appId':_0x30d3dd[_0x486875(0x23c,'Hi2r')],'fn':_0x30d3dd['QgpCQ'],'body':_0x3b72d2,'apid':_0x486875(0x221,'(G^Q'),'ver':$['UA']['split'](';')[0x2],'cl':_0x486875(0x24b,'B$j&'),'user':$[_0x486875(0x181,'iZG7')],'code':0x1,'ua':$['UA']};_0x3b72d2=await _0x3da8e6['getbody'](_0x507bed);let _0x32f7e4={'url':JD_API_HOST+'?'+_0x3b72d2,'headers':{'Host':_0x486875(0x22f,'Hi2r'),'Accept':'*/*','Origin':'https://h5.m.jd.com','Accept-Encoding':'gzip,\x20deflate,\x20br','User-Agent':$['UA'],'Accept-Language':'zh-CN,zh-Hans;q=0.9','Referer':_0x30d3dd['cqcPU'],'Cookie':cookie},'timeout':0x7530,'ciphers':_0x28c56b['cpstr']};return new Promise(_0x28493e=>{_0x30d3dd['IUuqI'](setTimeout,()=>{$['get'](_0x32f7e4,(_0x43b81e,_0x16d264,_0x13bda3)=>{const _0x361c67=_0x38d7;try{_0x43b81e?(console['log'](_0x361c67(0x227,'LCO^')),$[_0x361c67(0x23f,'q0[D')](_0x43b81e)):(_0x13bda3=JSON[_0x361c67(0x212,'9Wsb')](_0x13bda3),$[_0x361c67(0x213,'J!Q4')]=_0x13bda3[_0x361c67(0x24c,'q0[D')]?.[_0x361c67(0x254,'Z9Hz')]||'');}catch(_0x379c3a){$[_0x361c67(0x1b1,'t5$b')](_0x379c3a,_0x16d264);}finally{_0x28493e(_0x13bda3);}});},_0x434584);});}async function checkplus(){const _0x5bb6e4=_0x482600,_0x2146dd={'JHdDG':_0x5bb6e4(0x247,'iZG7'),'ZbGyj':_0x5bb6e4(0x1ef,']JIv'),'vPfuW':_0x5bb6e4(0x1a6,'8gIv')};let _0x2ab3cf={'contentType':_0x5bb6e4(0x235,'E4a^'),'qids':_0x5bb6e4(0x17d,'B$j&'),'checkLevel':0x1},_0x800f44={'appId':_0x5bb6e4(0x226,'x5Dd'),'functionId':_0x2146dd[_0x5bb6e4(0x1c5,'BW0%')],'body':_0x2ab3cf,'appid':_0x2146dd['ZbGyj'],'user':$[_0x5bb6e4(0x248,'x5Dd')],'code':0x1,'ua':$['UA']};_0x2ab3cf=await _0x746a7a['getbody'](_0x800f44);let _0x40597f={'url':'https://api.m.jd.com/api?functionId=user_getUserInfo_v2','body':_0x2ab3cf,'headers':{'User-Agent':$['UA'],'Cookie':cookie,'Origin':'https://plus.m.jd.com','Referer':_0x2146dd[_0x5bb6e4(0x208,'t5$b')]}};return new Promise(async _0x35443c=>{$['post'](_0x40597f,async(_0x234054,_0x389533,_0x5e2dfc)=>{const _0x5d2378=_0x38d7;try{if(_0x234054)console[_0x5d2378(0x22a,'OtLf')](''+JSON[_0x5d2378(0x17c,'J!Q4')](_0x234054)),console[_0x5d2378(0x18e,'rHZ&')](_0x5d2378(0x195,'9Wsb'));else{_0x5e2dfc=JSON[_0x5d2378(0x255,'Xzjd')](_0x5e2dfc);if(_0x5e2dfc['code']==0x1a1b98)$[_0x5d2378(0x19d,'Gi(F')]=_0x5e2dfc['rs'][_0x5d2378(0x1bd,'BVIl')]['endDays']?!![]:![];else{}}}catch(_0x476608){$[_0x5d2378(0x236,'ni0Z')](_0x476608,_0x389533);}finally{_0x35443c();}});});}function _0x36fa(){const _0x10f7f5=(function(){return[...[_0xodV,'YXgGjQTCsjiMCaEmKiKL.nPXcogKmng.NvG7JxML==','W7i+CcPqWQn3ltePBu/dObBcV1W','W7CHzdTPWRu','W4uVBr/dJsztqW','W41+mXddHq','jSkeWOyF','WQZdP8klWQ3dNa','W4qOeSkuFxlcGbC4W7fWsHddQCoeW7y','A11UWPxcMwG4WQ/cUG','W7NcTs/dJ8oM','W6RdU8oMW6vM','WO9dWR45gvW3WR8','FLhdLq','WOTttCoXu2/cLWXR','W5H0cCokW5q','eMZcR8kblG','FMmOWQDbmbtcKCoLpKtdTCodWQldReJcJfuBxSohu8ojWOG5nX7dLJJdLbRcIwdcTdmIBNNdM1fjWQZdQLb3WQjbWRldJ8oDx28lmtVcTSolW77dSMtcIq7cG0WomSkRW55JWPddJwa','WRldRmkRWR7dQgpdOHpdL8kZcCoDWRxdNCkMuNbThwC','kCkoWPqFcmkMzJZcOW','b8k4DXtdU8oYWPe','WPPmWP7cUa','WOXlWQKXpW','WOpcOdNcTYq','pexcV8kK','W5aRfeGwiauvW54','W4iqiSoWvdiVW6bYvCkzWQXpzYJdSSkpW7ldR2BdJCoSW7HXjZmCWRtcU1ToW6X5Ex9pW5pdRxZcKSk/m0/dO2FdUCoupmolWQBdTmo+W5DKDa','CmkwW7HeWRCBWPO','WQBdOCkQWQW','W6D4WRVdK1K','W6JcMsxdISon','WQRdTmkQWR3cHZ/cQaddTCk/rSoCW5xdLSkVgvPSfIFdKCkWWQtdU8klW6NcQW84WO9xW7hdOCoE','W4BcNsxdNCoG','WRxcGatcSrGiW7RcLYKyzNnRWRTKWR51yfHNemkBW4WKWRJcUSkDbW','WPlcQxOxWPG','W7D8nColfq','FM48WPb3','k8otvCkDsW','wCkuyq','umo9WOpcPG','WPBcOee+WR4xWRO','W5pdLSomW6G','uSkECG','EKX9WPlcTMi+WRZcRCow','WQVdS8koWQhdIgpdKqJdTq','W48jW5fcWRK','i8kgWOqXvg3cLeNcNq','W7NcLWldLmoy','yNyVWRW','zvjBqvrcoG','kSoNWRpcUuW','zSoJWRn9WRC7x8ozla','WPTwymkYeJS0WQPAFmkMW7j6','lCoGWQBcOgC','WPHbWPm3bW','v8oKEr7cLvtdP8oSWRRdUJe7mCkR','W7rYWOddK1X7WRq','W7BdRCkgWPZdMLRdLG','zNSPWQrTAe7dJCo8iK7cQmoD','ESo6vG/dIXNdK8o7WRpdSH4UoCoIWPldJd0','lCkeWPyLb8kazJ/cQhrf','W5W2igackIa','WPBdPvtcGCoL','W55SWRRcKoIVNEAZSowKM+I2No+8T+IUNoAGJ+ACPEE+KoI1IUMfMoIULW','W5O0W78WWQajcSk3WPO/fwm+','WOxcTuuXWRGqWR4OWOXiWO9HAxChfCkls8kxr1emlqZdNdKKbxVcLMpcPSkV','WQrgWPVcQKe','W6eSW5RdLCkGpCkiWPedl8ooWPJdRYG','W4RdQLmOWR8qWQS1WOPjW44QAdyrdmkk','EYpcLSoJBtxcOCkQ','WQzeWRRcTxK','lSkDy8oLa2qniq','WPbmWOFcVa','Cmo+WRjHW5K','WRJcNXm','gCo4sSkB','d8odi2tcL8kmW7BcP0xdHHxcSmoT','WOpdKmk+WRxdImoOWPKYW4jsW7PQW6nWWQhdGIaeW4S0WPFcKCotqCkMqqjnaMjA','W5xcNMJdS2i','EqqxW5v6W4xdPCoZe8ohAr5+WOpdGYNdLs/dH8k/WQ3dI3RcMSkhW4r3WOvwW5i','W5mzjmkKqNNdTWz5Db7cVudcTmkuW53dOSoZDCoQW5RcMmoNaMj6smkqgCo/asC','DmohpvZdSCoLe8kpxKvHWO3cJXG','i8oNWRpcUW','yw7dGeWu','AHxcHSoLqa','m0/cMmknba','W5mJbSkFra'],...(function(){return[...['WQFcHrFcVHqyW6G','WOHODbu','iCkbqNNcK8oMWR9jW7pcOmod','W6n4WOFdHq','lmoxWRpdJZRcGGpdM1hcUCo2WO3cRM4','dvFcRSk3j8owWQO2','W4L4p8occG','W7/dS11fW4dcU8kPWO3dKmk3obK','WQpdOSklWQ/dTG','wos4O+s4LEwgV+wCUZ9nkCkCWQJMNypOROFORzNMSO3LPlZOTkdcO+kcGU+6NUkcO++5Ra','ACoByeBdSCoVbmodxG','pZhdP8kqW5fZWPlcPa','W7RdNXlcQb8iW6/cII8zjZH4WQrQWR4U','iCkbqNNcJ8o7WRXu','kColWOBdRYNcNa','W6uHBHhdUYzbshi','AXe7eI80xvG','W77cKgtdKgpdLvtdSSobn8okl04VyCkqW6ugWOJdLSkzyd7dJCkXW7hcT8oeoCoitSoYW4pcSSotnKiqWOFcMSo4zxK','smoZwG3cQvJdMSo7','pKxcUCkOpmoeWQiHm8koFG','sSkEytFdJSoSWQhcRx7dUG','gsVdPCkmW7P2WQdcTSk+sq','WRJcLqlcUb0LW7RcJIu','wmkRWOW','WOPuACoTvsBdRKPOCfVdVbhcSCodWP/dOCkIjmk8WPZcHSoMxw03wCoFrSkOxxCGkXyOt8k2b8oRWOOeFmoFp8oSumk7uq/cU8kjWOtcQmoxWOKwzSkfehTZW7S4','W6pdGKFdPubDW7BcQaOnBbO','W5TUD0if','5PEz5ysl5zYd5PYk6k+95As96lEJ','W7CkW4KqW6vhkCk9WOKmoNiSW6tcSCobW5C','W4n7WOhdGKDWWRKKWRVdN8kfpSkZW5q','o8kzga','W4VdJColW6Wih3jdEmoyW6Lpf8kCy0xdQCoeWQ55i8kEW5/dUCkNWRFdGCkChtxcG8kWrWCYm8kFrY7cG8kLpKZdVXVdR8oJW7BcNSojmSkCyYxcJW','F+IaI+weRUAnGCoexowfREE7M+wmPSkP','l8oYWRpcQLDUC2/dSCk3dZ1CBvzjeCkyiSon','W6SHstzIWRL8','WORdLmkJW6VdLSo8W5X5WPXDW6b0','WRq9uxVdGq','W7xdRK9PW4BcPW','rmkRWPHF','zSogtXi','W7tcPc3dPCk/pCk/aSkPihud','yCkTW4qhcvxdIxddKw/cJmk0h344WPD8WOhcMNDJ','lmkBz8olp3C','wgm7WRbf','bYpdTSkbW7C','W6qWW6/dTCkZiW','WRmnnWy2WO8MaeyxjNxcKcFdQaldNmk7WPVdGSodnSogyCokW7VdL8kA','W68qW4RdUCkL','WOJdK8k8WPBdLW','x8o9WOdcHSkcdW','W5xdTWq','wmkRWOXUWPVcLq','WQxdGeVcLSoB','nmoZWQxcMuSWoq','ASkrW4zcWR4vWP3dV34','y2q5WQv7zf3dKq','CaatW4LGWPZcQ8kOcSoAAb95W57dHIpdGc/dGmkZW7a','WO9jC8o0CN3cSG5eFuVdIrdcS8oiWOBdOCkThmk8WO/dJq','yhaqWPnI','WPhcTLaVWO4uWROOWRbuWOq8wdqwdCkJemod','W6WRivyTmJ4z','BCoSsGZcUfVdGSoTWRZdSbOPlW','D8ogm8k2FdmndXFcRCkuW4C','v8kEzG','umkLWP9k','W4yHbSklzMdcIaaPW6rIwYZdTa','WOZcSueTWQjjW7bZWO1sWOG3zdSEtmkrsmkBta0cBXq','W5HPpCoDbJdcNmodWPJdMhtcJmkiW5FdKMXkC8kKWRtdT8opWOSMlJdcQhOFmMDmBW','n8oPWRtcRG','5lQ05lMO5P2Q5yIy5zM76l2Y5zMA56U95Psk5O+g','fColWQRcJui','wCkuyttdJCoBWRS','W6fYWOFdHf9R','n8kbqMFcOW','F0RdKKKWm8k/ewPsWOxcL8k3qHVdImkUW6bCvf/cTLjuFKirpmkHymo4pCohhColvmkAW4pdJmkolLJcUsldTv0','vubYWPxcO24IWQlcNmoHWPVcLwbjj8krbKSRdCko6k2J5Rot5AEC6lsN776F6kYr5Qgv5P6W572o6lAq6yAl6kY3','W7GcjmoRCq','W4GzW5JdRb7cHXZdUgKeWQFcTmkT','ChNdN380','W4iHBH/dVh0ofJVdQG','W7lcHwtdGq','W6JcLcldISo3g8o5tcLHW7jugW','WRKIrG','WOPuACoTvsBdRKPZiaFdP1BcUmocW4BdP8kUiCoY','W4f1oSorW6C','5P6u5yIG5zMa6l+45zMQ56QV5PA85O6u','W4CEWRiqW6NcJSk5WRlcUSoDeSodWOVdNa'],...(function(){return['WQldTg7cSq','gCo2s8kCEG','DuHOWP/cNW','W5/cJYZdNCo2W4fsz8osjSoxustdVIpcNhRcMCkzWO0','5lUS5lUO5PYn5yIV5zIL6l+r5zQ+56I+5PsT5O65','W7vIWPRdKKD2WQiRWP7dQmoBiCkMW643W5KbWO4JcSk2sq/cL8keWOOmWPPVyK7cMmoua8oLgrdcTSk9cMBcJ3Ctz8kMW4C5rSofWOD2WOhcLSoaW7NdKCkUW5/dU0W','W4WZArHo','ENG7WR5CxKldJSoWCrNdVConW6ddR0NdJeiGsSkyw8kvWPmTEq/dHwO','WOrfW4FcMMtcNLddKqaAW7ldSmoVWPW','E3yOWRrA','cSobBSk1sG','W50CB8kXqZO3WQTXq8ofWRSBlstdSmkwWQu','z8oIWRnQWRC2umoziCo5xmo1WQr1WORcL8ohW4JdOa','i8ofWPpdHXlcGcVdLq','rmkRWOjfWP0','W4y7uHpdGInUr3JcV8kFWQOYW7K','CNyOWRy','W4HYW5JcHH/dRrVcGwrAWPddT8kEWPZdINpdHHJcQmkzWRhdII04mWKGASosW6WBzq','WR/cPHRcQIe','WRpcLqdcQaioW6NcII4rzWm3WQXY6kYN5RcB5AwX6lsj77Yo6k6F5QcV5PYg57Yf6ls76ysw6kYH','F0RdKKKWm8k/ewPsWOxcL8k3qHVdImkUW6bCvf/cTLjuFKirpmkHymo4pCohhColvmkdW4/dVmkfb1FcGt3dOxdcVdZdTq','W7vMWPBdHfO','W4jvoW','W4WfjmoTCNTLWR1dv8kF','W40TyrJdRtPn','FSk1cbNdKq','kSoosgxdUCocjW','W6RdTvPfW5RcSSkLWPZdGa','d8kUiWNcLCoGW7S','W5u3i2eriq','WO5bWP/cQN/dGu/dI2GiWQdcSSkKW6ZdUYtcMa','tmkwW5fzWP4tWPNdVa','WRhcTLaVWP8sWRi5','WP91iSowbJ3cQCooWOhdKIFcKCoeW4JdKMuppCkhWOddJCosW55R','W7xcSmoMW7VcIYdcSrJdTCk1jCo3WQO','W4ylmq','W4HBlSoSW686n8kb','Dez7','oKT9u3i/qKFcPmkuW48CW5VcRMmRW67cKmo7W7TnWRRcSCk8eq','d8o2s8kcsN/cO2Lub8kw','gSk2ECoHpW','W5NcNYBdNCoAW6jrzq','W7TJWOddGuaLW6jQWQFdOmktiSoVW5X6W5SeW44Uamk3','WQDaWPHwW79xE8kHWP8dfKay','WRCSuNldRxVcOCor','Cs3cGW','p8kcc1pcHfybvLpdSJlcNvlcGqldQSk7mJe+','j0XSuuHRcWC','WPLiWP7cRfNdL1JdKfunWQdcN8o3W4hdRoIUTEAYTEwLTUI2Vo++P+ISMEAGU+AFVoE8TUI3REMhSUIUQG','W6ZcIJldNmo7dCoTsYu','WOKVxWldMNjmvtpcVCkbWQSTWQZcLrKPW4X9rCoUW7Wqza','W7dcJcpdICoBq8kJedbJW6jurMNcPSoXjMmkBCoIW5ypmmoWWOVcPmoYixuDCeVdK2uEW7bUESo2','WPLyhCo46k6y5Rcr5AEm6lAs77+96k2a5QoA5P2g576Z6lwl6ywW6k+x','vCoNWONcOmkefmkVBCkVWOhcP8kEfJNdGmkuEtJdKSoEWQpcMCkdh8kNFmo9WQGbbmkWFSkcWQO2uXzBW44Qamkue2a1e8kzWQBcOZf0fNxdVJmaW71NrvzXhLjalYeiW58TW4KpeG8eECkxWRO8WO7dOSkcEKLDdSkHW6H+DcWwjgpcJZFcRahcRSkAWQWEjHrmWPpdKCk2W5nisJTnt20ICcVdLmkXemk+W60EvmkXySklnmoMmcfssSk8imkFvriXvhHPWQhcUmkwWPJdL8ovW6hdSCoaWQ1T','DbSa','W6NdRKfcW4a','F0igWPPu','Cf1OWOZcHdv+W6BcOmodWOhcHNCjl8otpe5Ic8obW7NcVG','W6aaiSoYqM1fWQf2v8kxW7S','F0RdKKKWm8k/ewzhW4hdMmkQbv/dHSoKWQ1qvH3dUfDojfy7pmkNy8k+o8ohmSoarSkWW5/dUSkHc2pcGIJdQNhcVtFdV8olWQWVWOPM','D8oqqfJdQ8o7imolqW','ymkBluhcOIT5','WQhdSg7cSSoLBCkR','oKhcQSkRkSoyWRi9fW','W50zWPiCW6BcHCkEWRxcRG','BqCcW4TAW4JdOSoO','C8oACLhdV8oMvUITLEAXSEwKJEI0PU+/PoISMEAITUAFIoE8VoI3PoMgPEITIq','C8oHWQz0WO0Sx8ozimoZqCkZWRrJWRBcMSkeWPRdStZcLCoqWPi7WPRcLSkxW5C','k8keWPu','W4C8DaBdKhupcwxcTSkRWQXOW7ZcIKj/W5SVhmk1W6O','nmkfWP4vxW','WPNdNxVcMCkIWRKczCoKe8osDsi','W4VcTvq6WRqaW7aXWOrvWOORztmEbCota8kFxfeyxW3dJYyQrhhcL2pcPSkZ','WP3dNNdcNCkLWRuooSoGo8oItqldMa','WOdcPee8','A8kaW4biWR8wWPe','CCoVwa','WOJcQLi','W743bmovxW','W5u9mKephtirW4S','E1hdGxWXEW','WPpcV8o4fmoYW6VcRSkuk8kLWRiN','uSkECHpdKmon','WRJdI3BdLx7cJa/cTmopkCkmzvPTASkAWRG','C8oPxbtcIvJdMSo7','WQRdUN0'];}())];}())];}());_0x36fa=function(){return _0x10f7f5;};return _0x36fa();};async function sqb(){const _0x4f2bee=_0x482600,_0xc7e527={'GCAhg':function(_0x3a2606,_0xb17781){return _0x3a2606==_0xb17781;},'icwtp':function(_0x46cb87){return _0x46cb87();},'RcZuO':_0x4f2bee(0x224,'ZQzA'),'kVnwP':'zh-CN,zh;q=0.9','Ntggw':_0x4f2bee(0x1a9,'iZG7'),'dwhMe':'wx91d27dbf599dff74','SPLZq':_0x4f2bee(0x245,'ZQzA'),'aMxvN':_0x4f2bee(0x1e5,']JIv'),'RMmWf':'60d61','WPMjU':_0x4f2bee(0x21c,'8uCH'),'jfazC':_0x4f2bee(0x230,'Dh1o')};let _0x57d921=_0xc7e527['SPLZq'],_0x386f0a={'source':_0xc7e527[_0x4f2bee(0x1bf,'ZImS')]},_0x192087={'appId':_0xc7e527[_0x4f2bee(0x252,'sBze')],'fn':_0x57d921,'body':_0x386f0a,'apid':_0x4f2bee(0x1f1,'%AYt'),'ver':_0xc7e527[_0x4f2bee(0x1cc,'r0t&')],'cl':_0xc7e527[_0x4f2bee(0x1ea,'sBze')],'user':$[_0x4f2bee(0x217,'(G^Q')],'code':0x1,'ua':$['UA']};_0x386f0a=await _0x405350[_0x4f2bee(0x19f,'p$aJ')](_0x192087);if(!_0x386f0a)return;return new Promise(async _0x3bfc08=>{const _0x12f520=_0x4f2bee,_0x323056={'ykNeP':function(_0x457f02,_0x1b489a){const _0x25f5c3=_0x38d7;return _0xc7e527[_0x25f5c3(0x1bc,'Hi2r')](_0x457f02,_0x1b489a);},'cVWZU':function(_0x5783e3){return _0xc7e527['icwtp'](_0x5783e3);}},_0x1d06db={'url':_0x12f520(0x21d,'M$OX'),'body':_0x12f520(0x168,']JIv')+_0x386f0a,'headers':{'Host':_0x12f520(0x1b2,'180#'),'Referer':_0xc7e527['RcZuO'],'User-Agent':$['UA'],'cookie':cookie,'wqreferer':_0x12f520(0x22b,'6U5B'),'x-rp-client':_0x12f520(0x25b,'8gIv'),'accept-language':_0xc7e527[_0x12f520(0x173,'r0t&')],'Accept-Encoding':_0x12f520(0x1f0,'mUk['),'x-referer-page':_0xc7e527[_0x12f520(0x237,']JIv')],'x-referer-package':_0xc7e527[_0x12f520(0x1a7,'E4a^')],'accept':_0x12f520(0x24f,'9Wsb')}};$['post'](_0x1d06db,(_0xf9d1b9,_0x3b58d7,_0x2055f7)=>{const _0x1f04fe=_0x12f520;try{if(_0xf9d1b9)$[_0x1f04fe(0x239,'o40F')](_0xf9d1b9),console[_0x1f04fe(0x223,'q0[D')](_0x1f04fe(0x257,'[fO@'));else{_0x2055f7=JSON[_0x1f04fe(0x162,'LCO^')](_0x2055f7);if(_0x323056[_0x1f04fe(0x1eb,'Bk1L')](_0x2055f7[_0x1f04fe(0x241,'sBze')],0x0))$['sqb_info']=_0x2055f7[_0x1f04fe(0x161,'p$aJ')][_0x1f04fe(0x198,'J!Q4')]+'个',_0x2055f7[_0x1f04fe(0x25c,'M$OX')][_0x1f04fe(0x16f,'q0[D')]>0x7530&&($['sqb_info']+=_0x1f04fe(0x22c,'OtLf'));else{}}}catch(_0x5c56e8){$[_0x1f04fe(0x21a,'lVUb')](_0x5c56e8);}finally{_0x323056[_0x1f04fe(0x16b,'LCO^')](_0x3bfc08);}});});}var version_ = 'jsjiami.com.v7';
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
            await mybean();
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
            await $.wait(500);
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
        ReturnMessage += `【京东 E卡】${$.ECardinfo}元\n`;

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
        url: `https://api.m.jd.com/api?functionId=queryChannelUserCard`,
        body: `cthr=1&client=h5&clientVersion=&t=${Date.now()}&loginWQBiz=&appid=mygiftcard&functionId=queryChannelUserCard&body=null`,
        headers: {
            //'Host': 'api.m.jd.com',
            'Origin': 'https://o.jd.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': $.UA,
            'Cookie': cookie
        }
    }
    return new Promise(async (resolve) => {
        $.post(opt, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`getek请求失败!!`)
                } else {
                    data = JSON.parse(data)
                    if (data.code == '000000') {
                        $.ECardinfo = Number(data.data.totalAmount);
                    } else {
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