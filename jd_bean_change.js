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

var _0xodg='jsjiami.com.v7';const _0x530410=_0x2c03;(function(_0x3e9fe1,_0x1766ad,_0x161468,_0x3c9004,_0x43f78c,_0x26550c,_0xe0d695){return _0x3e9fe1=_0x3e9fe1>>0x8,_0x26550c='hs',_0xe0d695='hs',function(_0x20c3d7,_0x3315cb,_0x30d94c,_0xaae472,_0x2b8ecd){const _0x19569c=_0x2c03;_0xaae472='tfi',_0x26550c=_0xaae472+_0x26550c,_0x2b8ecd='up',_0xe0d695+=_0x2b8ecd,_0x26550c=_0x30d94c(_0x26550c),_0xe0d695=_0x30d94c(_0xe0d695),_0x30d94c=0x0;const _0x4f82b0=_0x20c3d7();while(!![]&&--_0x3c9004+_0x3315cb){try{_0xaae472=-parseInt(_0x19569c(0x327,'g9ca'))/0x1*(-parseInt(_0x19569c(0x331,'T*!c'))/0x2)+parseInt(_0x19569c(0x115,'T*!c'))/0x3*(-parseInt(_0x19569c(0x295,'9qIg'))/0x4)+-parseInt(_0x19569c(0x1cb,'Sxvo'))/0x5+-parseInt(_0x19569c(0x3d8,'X6vt'))/0x6+-parseInt(_0x19569c(0x192,'Ch(!'))/0x7+parseInt(_0x19569c(0x26f,'1#Fg'))/0x8*(-parseInt(_0x19569c(0x231,'$J@4'))/0x9)+parseInt(_0x19569c(0x2bd,'Z4@$'))/0xa*(parseInt(_0x19569c(0x3a7,'Ch(!'))/0xb);}catch(_0x41e3ef){_0xaae472=_0x30d94c;}finally{_0x2b8ecd=_0x4f82b0[_0x26550c]();if(_0x3e9fe1<=_0x3c9004)_0x30d94c?_0x43f78c?_0xaae472=_0x2b8ecd:_0x43f78c=_0x2b8ecd:_0x30d94c=_0x2b8ecd;else{if(_0x30d94c==_0x43f78c['replace'](/[GnPNgXuJbBrAISULOWE=]/g,'')){if(_0xaae472===_0x3315cb){_0x4f82b0['un'+_0x26550c](_0x2b8ecd);break;}_0x4f82b0[_0xe0d695](_0x2b8ecd);}}}}}(_0x161468,_0x1766ad,function(_0x5c0f1d,_0x3a564f,_0x4615e2,_0x3183d5,_0x475d8b,_0x4c079c,_0x17d64d){return _0x3a564f='\x73\x70\x6c\x69\x74',_0x5c0f1d=arguments[0x0],_0x5c0f1d=_0x5c0f1d[_0x3a564f](''),_0x4615e2=`\x72\x65\x76\x65\x72\x73\x65`,_0x5c0f1d=_0x5c0f1d[_0x4615e2]('\x76'),_0x3183d5=`\x6a\x6f\x69\x6e`,(0x18717f,_0x5c0f1d[_0x3183d5](''));});}(0xcb00,0x7cb54,_0x5ac3,0xcd),_0x5ac3)&&(_0xodg=_0x530410(0x237,'xwm2'));const _0x869610=(function(){let _0x2c21cd=!![];return function(_0x59ceaf,_0x521b6b){const _0x18c309=_0x2c21cd?function(){const _0x1c9d4b=_0x2c03;if(_0x521b6b){const _0x4c08e9=_0x521b6b[_0x1c9d4b(0x161,'*BQ@')](_0x59ceaf,arguments);return _0x521b6b=null,_0x4c08e9;}}:function(){};return _0x2c21cd=![],_0x18c309;};}()),_0x440c80=_0x869610(this,function(){const _0x500d85=_0x530410,_0x224c36={'oOwIZ':_0x500d85(0x287,'XE*m')};return _0x440c80[_0x500d85(0x305,'T*!c')]()[_0x500d85(0x3e7,'*BQ@')](_0x224c36[_0x500d85(0x2b7,'J[U*')])[_0x500d85(0x378,']ykf')]()[_0x500d85(0x3a6,']ykf')](_0x440c80)[_0x500d85(0x2b6,']ykf')](_0x224c36[_0x500d85(0x120,'Sxvo')]);});_0x440c80();const _0x17f63f=require(_0x530410(0x3b1,'nEut')),_0x2585f1=require(_0x530410(0x346,'Sxvo')),_0x556d1a=require(_0x530410(0xf5,'Sxvo')),_0x2fed9c=require(_0x530410(0x333,'nQNp'));function _0x5ac3(){const _0x9c4a18=(function(){return[...[_0xodg,'XUjbsGXjuniamNBiJ.XcLogmS.IWvSE7OSNruPAW==','lSo9k2/dLq','WRauiahcVG','WQ0IfdhcNq','fu/dPmkjcZddTa','WO0TlddcPCosWPFcOxldTCoUnCkcuq','iSoQW6tdKSov','odb+iW','kCokW7NdK8onW58BW4NdSmofC8ocW43dNCkVW45LjZ/dNCo8W6dcVwddJmo4W77cPa','W6/cPwVcMWG','WQqTgCkExq','W5BdSYqvWO0','zftcLhrvWQGh','etNcLfzW','WPHmo8oYW4y','WPxdUmkKzSoS','mSkbCmoDv3JcRHZdO8o9WPW','lSopW6FdNmoqW5uvW5pdKmooimkzW5ldNmkUW6GODZVdGComW7VdV3xcHSo7W7JcRSoCWQPGtSkvWPtcNSk3WQ3dUSo8WOpdQSkeW4yQW7dcNtjPqsldVbiuW6ZcI8k+WOxdKmked1z8W5RdMdfxwmkAWPjDWQTznCo+WP3dRSotiSkbW4ZdPwv4W63dGNtcJmkQo8kxWOJdMdRdG3CHcCo1u8kGW5qFWOqtWQGWWRtdTmkXWQLcqbDglx0pWRzcxIBcUt/dHmoLr8kZovtdV8oEvYyegSkcWO4DW7L0gZFdJGWAW6mmyb4PhmkFya','jSkGW6RcHtJdScG','vaOrwve','oCoZmh7dSq','WRJcGSk7WOZdHG','pc9CW6Lc','5PYC5yUI5zMQ6lYT5zMo56Qi5PEz5O2E','hCkWA8osyq','WQlcKc5Nuq','oJb4lYxdQdBcQmoEW6/dTa','iSo9iSoRWO7cPSozE0/dV2FcN8o9ea','cLBcUmkxqmoqW70Y','WPNdN8keFmot','aCoQnmoMWONcUmoFyfa','W5/dMSkqfSoB','W7FdHmkmjSojWOLOW6lcQ3pdNJCpW41ht8o+','WRilWRhcOvtdQSkLea','W5VdGCkkoCoLWOjAW6i','WPVcKmouW7/cJG','WRFdMmktxSoop8kEWQibWQpcSa','WOVcK8kZkdu','W63cS3vwW7e','DqVcGHG','eCoUd8obWPq','W7L1WOTbBW/cHCo7','W4pdR8oNW6xcQSkOWRpdGwldI8kDmG','hSoQpeNdV2bXW5eoWPOQW5S+WRqUWPFdO8ktW70','W5hdSs0zWRXkWRT8s8kg','WPfOW6GE','xCk5r8kCDmkuDYlcQG3cMSo3DCkzW4JcNbHjWOBdRwS5s8o6WRj9WRPiWRpdQI3dQmkXWO/cNSo7omkxthRcH8ovWQddHK7cKSkZW7tdHq','jCo3dxldOW','tmkqW5/cISkR','mrnimsC','W5ZdKmkiomov','W6FcJSovb8kJE8okWOalWQpcUmkrWOi','WQVdRSk8WOZdPa','s8kCsSoKlq','WPpcHmkqdG4','hd3dLYhdSq','WR9DWPddJCoaWOddLmk5WPJcUSol','tComgtVcPa','eXzYW7rb','WQFcOSk2WQpdIq','g0/dS8olBCkmWQW5WOahW4VcK0pcQmogBCksWOm','WQ0/iCkFxG','nCkozSocBwlcRW','W6WEAXZdOSoIW5FcNYVdUCk7bCoiA2/dPtarW4f5WPe','AYdcKWPx','WO0WxchdGCoUW64','W7ZcJetcHty','lhvXF3JdMmosWRNcOq','AWldMZPAWQWvWQmch8okWOC4rwbPyGpdOG','W7NcVgTPW7O','smo8ps/cKIJdMSoOWRC','tCkAz8k5BW','hXpcUCoaW7ldKSknWOjoimkhqYmyxG','pHlcUCoxW6JdNmkuWOy','WPG8WRpcVxq','n3tdNtNdVeVcTmopghPYWPBcU8o1WPa6dIWbWRpdM8o9gLtcT27dVmkdWRLWeCkY','WPaIWQ7cVNG','imouCZ7dKSodWOXnW6NdPLWkamkI','WQpcVSkC','WPNcNbb6AhjngH7dM8oPfeaZF8kPDSklWQuQtgepW5bhAeBdOmk1fCk5cmoJBuC5WPxcTfJdRmoZgJG','lK3cILJcHG','tCkvW4ZcIGm','WRpdUSkhumoz','W64JW5pcJCkY','W7pcVLLD','W6CalCoDW6RdSmkyw8kE','WRO7eCkcrW','WPpcGCkIorrlW5yl','WO7cHSknWPJdQW','WRFdH8kjWPxdSZ8','xd1aoHC','WOGRgHNcUq','gxxcNCktAa','WPn2W55+W5VcQCo/m3dcPWddMmkDyuWxWRhdLu7dNCoyW4PlgmkVW4NcVSoA','WPrMW74wp8krW44tWOi5W7S','W7m/lmouW7a','wmkRAapcLJCMWPuOWQ4OW74aWPG','WPPZW7GlgCoyWOroWQi5W7VcSWBdVuy1gmkIv8o5Fq','W4GJlmonW78','WRe8b8kAydO3Ba','l8ovvdldH8obWQDBW63dRxSq','W6WGW4xcHSkt','cYlcUfLo','ltXkW45Z','WQ/cMg3dGSoXCezfsW','gqtcQmogW4NdMCkC','W4ZdSbGqWOXxWOHNxa','iCo9luNdHwjrW4S+WPSOW5a','ispcRLjVj8oKWRaR','jmkpCCoe','WQ17a8ovW7POW4v6wWFcNG','mSowW4RdK8o9','oSo0W7/dT8oq','zmkIW7RcIq','jfZcHSk8ya','lIeaWORdLW8','W5rxWPDzza','5P2L5yI45zIm6l2E5zII56QX5PE55O2N','WQlcP8o2W5FcNq','jmkty8odsq','jha3W4NdMSk7W5n1DSkl','WPnfW4LhW4S','WRZdMmkvumoZ','gg/cJulcHG','pxpcGv7cVbvVzG','W4JdIvOtW4G','tCkqW5dcGrG','WQ7dJCkeWRldTa','kSkmWRRdMCoc','WQtcMWf4vsKpua','rIjZWO/dGq','WPW9WRxcLwS','W4VdRd8','WO9GiSocW4G','W60jnmoxW7tdUSkyqSkA','mI8vWRZdGa','cLBcUmkxxmonW74VWRitWPe','gMxcKe/cNrbN','jtJcI8o9W7q','kLRdUSkWbq','WOPVW5W1pW','W5tcTgjSW5u','WQdcJHflxq','WORcOmkzWQRdLG','aSoQcvFdLxrcW4WR','W4RcThlcSs3dNCoIW6JdRa','WQv7hmoD','sgNcThD/','WOxdVSkkF8o9','nsiLWP/dSa','WR3cI3RdISoRAKfE','WR0zWPhcQxZdQmknhNjpzMFcRwi','W57cTvZcGsy','qUIcQEwhIEAmTmknWQRLHOtNU5dLJytdGG','zN3cHxnO','qZD1WQ3dUW','zxJdK2BcRG','WObnW7XuW7O','W7VcSeO','W5L1WOTbAadcJSoX','kvldQmktcW','W41WWQbJqW','FqxcKq','DtJcH2pdVv3dSq','qt9Iib8','W6aDW7lcKmkvWPtdU8kUWRFcJmoSWQlcTSoK','WOnjWRtdVWy','WQpcISoSW5dcUq','AsSBwgBdHSoFWOy','pvBcPSkSuW','hHlcUCoxW6/dK8kFWOW','D8k+W5/cMJG','W6JdOSofWRjMWRlcHSkrsW','b8o2pN7dKNu','W43dTZWmWOOEW7eHtCkpWOJdHmkTAfRdG8kCW4CRW6TdWRX+WQWI','AmkiDSoi','WRdcOrn4CG','bwhcKe/cMG','WPxdTCkbWPhdUG','zSo0jYK','rCkvW6lcOmkj','ew3cNKRcOG','WOFcPSkhWR3dMa','W6pcNhvPW7a','W7JcIe7cLdu','zmo0isxcNZldNSo0WOddP8kr','DSk0CCkTDq','ae/dPmkFfZhdO1GgzgxdTunjWQpORQFMS7lLPQtOTixVViVORP7MO5JMNzNNV4ZOTiNPHklORke','oSosqJJdLSoCWRe','rCkIwSkcCW','WQayWQBcQvJdQSkMdxHt','WRf1WRhdSGq','pquyzEIVO+AZREwMGoI3Ho+/OoIVOoAJVoAEG+E+OUI1IEMhR+IUQa','WRhdKCknWPxdMtLdW6G','psf6kXtcPJNcVSkJW67dRN1yWP3dL8kOFq4rWOJcRaPiWR3cNmkWcCo0fCk3CmkWW6xdG8o2WPWPWOFcV8o+vCoLESk+eZ5uvSkvi8kiWQrpzSo0u1TFWOecC3T4jSkmrmoAW7VdSbGQqmk3qeC3W6hcJaWyWQFcQNdcQCkBW5i0g8oyWP/cRmoMnmoKALiEW6pcN13dK8kXEmkTWQhcJmoQxSoVWP1Ht8kmWQC1a8kvW6BcUmoqgCkphLJdJHH0WPBcH1e0dSkBbqqpBSokrfddO1RdN8oABCoEjf4djSkMd8oAW7xdRCkMoJRcPCojWOX5W7m2c8ktWQtdHmo8W78PuCkmWODtW68NW47dJvxcGmo/BSo0WRb5lSkgbSkrCCkWWRBcM0FcSmk3W4TNW7jJvSoRW7ZcV29pW43dKmkWnmkUWQddVvpcQ8o2W7tcJ8o6awuiWO7cKI3cKSoSWQ7cVquywSkjoxm','W5RdVSoUWRju','W6GIW6hcOCkJ','WPvKWP7dQsfaW4u','W43dTZWmWOOEW7eHrmkkWOJcK8k1j17cICoFWOOUW6jcWR5HWQGY','W7WClmoNW7xdNCkwrmkE','WP05aCkftdefBf1WWQrQdMTzWRC5','WOFdPSkjWPFdGW','wCkOxCozWPdcVmoQuw0','sJzwiZO','WRbgWRBdIse','5PA25yEr5z+E5P+L6k265AsF6lAN','h0pcUmktz8ozW7i7WPS','B8kgzSom','WRGfWQq','WOaQtbxdK8kTWRlcGHrSBxpdRmkNxWC7cCknz8oVW5hdKmoUwKldNGqSlcX6ymkStmkvCCo6ouvCgCkqWOpcOKdcK8oha1LMWRRcUG','AXnJfHq','hspcM0XunCoFWRW','khD9hf7dPSolWQtcGxq','dqdcRSoiW7pdJSkCWPfYf8kg','WQvkpConW6JdNCknx8kuzCoNF8kPdN50oW','WRBdG8kiq8k3BmkFWRu3WR3cVSklWPCzW4iVpG','W5VdGCkkoCoZWOrtW6dcUG','W4RdSSoXWP9z','WRdcV8keW6y8W4RdMmoh','WPHJW6esbmklWOywWQPMW6FdUaRcOu85','WPxdNCkUzSoU','CmkJW6lcUW','ff7dOSkdcJpdUfCr','W6SnW6ZcMmkq','A8oMaYtcVZldRCoVWQa','W7igWQZcQ3tdQSkxbM9pgIddV2zIW4yYWO7cLgvygCk2wYawW4/dGCkSW7FcMtmCf0/dSvRcISoyWQBdPcNcLGpcQ0/cQmk2WQVcRSo0WP3dKSk7oY5seM3dIHHwWPRcSwaSW40Tzv3cNCkEu8k8h38hWR0XbCkpW6r2neRdIwjfi1/cUCk6W74ObCoTW7BdTCkmW4PZF1FcRIWhCmkRWOdcVXmgWQ4/WPRcUciCfSkjWPdcQ8oSWQ8kzCo0W5pcJSkOzmkjEhpdMG0DC8khetWKv3GXW5xcKCkEf0S+emk2t3HZgrlcN8oPW7OYb8o4WQVcHSkJcx/cTgxdHSocWOpcQmkYW5JcPfVdNSk1va14aCo2rXeuDH5vBCoVW4BdQx/cSCkPFsZcPSoXWOFdU3hdOhOKWP8rpMnOx2ZdHSk7WP8HWQ3dS8oJuhdcLLdcOs7cHSoWWOxcOMVcLgRdLCklW4JcMSkFWP3cRmk/aNzYhdpcHCoUkSolFH7dSWr8lmk3WOtdMLnlyCoaWPZcJSkYW6pcKtH6WQxcSuC9W4RdICkGWRe2g8ovg8ooW6hdGCkgeSoiue/cMCoAsCk5x8ordmoSqwL+WPf9dhCMrwOpg8olW4Gxvwf0bCo4W4TAzmoibCksxuhcIZ/cL8kRWRNcN0lcIKWNWRRdVsFcKmkOC8kFW5LMW67dKHJcSJePttDIefW','cZv4mcm','eabEcYO','axBcK2JcHa','WObpemoaW4K','lbtcLmoOW4i','ACkWW4lcH8kezmkk','WQddG8kCWOy','WOO8wmkZWO7dTJFdItpdQ0rMW4/dStzHW4m','WPrNW5X/W6FcUCo7nuNcUGe','WP7dV8kfr8ok','WP91WOVdTXWpWOD2z3xdJLWlkSoyWRmuW4Tdqq','W6vEtSktWQ8','WOjIW48baa','Fqb/oGO','wmoLBuFcKNSKW5LQ','5P6W5yIb5zQq6l6a5zMY56Qw5Pwm5O+J','imoZph/dIG','WP3cHWm','CsSV','jd/cMq','pmo1At3dVa','fgpdVmk6ma','W68pW5lcMmkHWOVdKmk9WORcM8oc','ASk5B8oblW','Er7cGGKUWQ9aWRXEECobWO1Lhx45FvRcO8kKW4dcSCkprmkjW7GCWQtdMmkPECkgvSkjWP3cI8oCkKBcRmkkCSofWQ3cGYhdHuP+W4JdJ8ofWOBcJtG','WOFcGSk3jZrgW5eqW4P/AmoVW7BcLCoIjmk3z0WvWPCSlWJdHXK8omk2eCokg8oc','omo1eCo5WOJcPmo9AeZdIeRcKCoIea','h0FcPSktFq','W5xcQef6W6O','AIJcKMxdTgddO8obhW','W593WOXSsadcJSoX','WPGBeCkdEa','W6/dVCozWRHGWR/cICkdrq','W64Nlmo+W78','CIlcKghdTh3dOCodch4','bW7cUW','h8oUzs/dMG','W6xcJu5yW7q','AY9aWRBdIq','W5JdGLmmW4nkWQ7dTee'],...(function(){return[...['hCotqcpdMW','yIZcKge','WRBdH8kWWRhdVG','ymkmDmomjsNcT8k4W6W','kw/cGCk1tG','WODUWPBdQrS','krldOa/dLa','q8oNctZcNW','g3NcIvZcNq','WRHVe8o7W4b/W4u','yvtcGxH0WRKt','WRJdJCkexSoO','WR02e8kqwq','dWdcQmoe','W7hcMhhcTXa','g8oOmwRdTG','W6FcVL9pW5K','WRddJCk7WPpdOJ5lW6a','5lQV5lIT5P+T5yQ35zMs6lYy5zQG56M45PsV5OY/','WQhcImkEWQZdJa','D1tcL3XQ','pXxcS0H5','WO4/sGJdQCo5W7VdGG','AsShtN4','W43dImoBWR9W','W4ZdKmoKWRPD','pJb5jZNdTtxcTq','WQSMyrpdOG','WQbxWPJdOd8','WOjYtSk2WONdSx7dLZtcSa','WPO7taBdJ8oZW7G','gSoFgg/dMG','bsStWOxdOsGezMmgW6aDE8oEwtZdLdLBngZcMSkD','W7VcINDvW4W','CxxcLgjX','mtPnW6u','W67dOSkqb8o+','gSoGmmogWQO','W7ldHJW6WRO','W5NdSwW8W7i','WPXhW6nIW6m','WQJcUr5txW','dmoiCYVdQW','W4pdOJOrWRbkWRHH','W5XPWP1h','WQquvcVdMq','WR/cISoIW7VcV2u','zdbNWOVdMCkCW49F','wWzdaZ7cQSoNFZpdUH/dOWDFWQKNW44Oi1qkq8kjAdpdOmo/WPlcJ8oQmmo/k8kFW5BcMeTtW69zW6jKWRHtm1qZWRrdaSoftcxcOCkRiN3dT8ovot3cGCkZWQO','W5BdTIO/WPzaWRS','WRGfWQtcPxpdKmk6d3OxfttcUMzKW4q1WPtcL01QfCoXetacW5BdImo/','WOFcQmkO','bu/dSCkejZVdPf8C','vYa8xNhdISo0WO/cIwvBhW','WOf2W64Ka8kmW40o','jGJcJ3Dx','WQD1fG','W6FcLwdcMcS','imoPeSodWQO','WPdcMa0KDMyiuvhdImoVvW','oSoFW73dNmolW5GF','sdCTxLRdJSoCWOq','ob19W6bI','WQFdJCkgWPtdPcvqW6qUsti','W4m2W58YkCkUW4e4','dmo4emoR','tCo0fGdcGG','v8kOuSkcrmoblwpcVW','5lI75lUd5PYG5yQD5zUu6l6K5zUo56Q85PAZ5O6p','hfBcUmkjBa','WR7cH13dKmol','WQldJCktwSo1k8ksWRyO','pmo7fSojWOu','W6vBAmkkWOi','BgebWRRdIX4dAN4HWQeFBCoNvJVdJa','AKxcHxTj','W5xdRdSi','xKVdUCkgoCocWQOHW5y','WPZcT8oiW5FcNW','W6D0WQzXDq','DKlcHwrPWRuqDJC0iSkVW6GvbmoNCmoeiG','WP5OW6S+gmkq','W4NdKSkDmCo4WOniW6ZcS1FdNbCtW49m','WP/cJrX6','W4PNWPXEDb3cJCoSqmoYta','dJxdRdC','nJWcWQRdTGKwD3q','pSoTnSoSWOW','WQhdTSkPA8ov','md5T','BvJcG310WQ0tzW','DCk4ASoMoW','WP5PW4LxW4dcUa','ysJcGHnM','WORcNCkGdI9x','r8kxW5xcQcC','W69mWQHDsW','W6xdVSorWPjGWOK','WOu/taBdIa','WPZcS1ZdHSon','DZtcGKRdIG','mfldNCkdcJ3dGumhzxJdIXG','psfJBb3cTtNcVSkGW77dTga','W5OlW4ZcJmkv','hajwfcJdO8oNpshdRqBdSbPvWQi3WOqUjuemfmk1CZ/cVmoJW4xdN8k1mmkOza','hCode0RdIW','oCkjBmozvMRcUaxdRmoNWPhdPSouBspcIK/cOvb6WQ3dJa','jmowwsZdVa','vCkRW4hcRCkX','WRa4aq','ycZcLM3dKuddPmod','W7DIDmkQWRO','a8odzZRdGCocWPjEW6VdP1mEgCkV','WOJcK8omy8kAW58oW7ZcKNRdLsul','WPxcHSk1iJncW5KcW5O','FmkgCCoD','DSoNnI3cJY/dNSo0WRFdRa','jc8vWQldRbmrBa','WQjPiCouW5POW7zHEW','Dcb7WQNdQa','WOfVW4L8W5FcRSobmhhdVq','jSoAnSo+WOO','jmogvtJdMW','lSoBW7VdKSoTW5iCW5i','WQKPochcPq','WP/cQmk7WQRdRCosW7VcHZVcHW','W7ddIK4oW5jnWQNdTq','c0xdTW','WOlcJqv4Eca','WPhcQSonW6RcVa','qSkVBmkFzmobkMG','W4hdOJWD','W70bW6/cL8kE','W6vAW7ddUcNcSCoZc35szfBcOa','xb9/eJW','g2tcHmkYsa','WQFcL8oGW5VcNMpcGSkKqq','cSo8bCoKWR/cPmo8z1q','gYddTHldUa','W7ZdOSoxWRv+WP4','W4/cQhBcMZldIG','W77cRh1qW4KdrSkVWRm','gutcQ8kyzCoB','W5jgW5WY6k6D5RkG5AAA6lwe77+E6k685Qgu5P2457Y66ls86yEH6k6e','Bd7cJMNdUupdQ8kcgxqOWO/dTCkK','W5WHcSoXW5y','WRtdT8keqmo8','kcnVjYpdRZlcRSoR','WPPZW7GlgCoyWOroWR8UWRNdVbVcUGi7uSoVw8o7p8koWR/cJg7dRGlcLmozW7/cKvddUIXDvaDEW54/WR7dI2pdKIpcK0ldH8kgWQTXgbZdJG','WPXBWRFdNtS','WRFcJqveDG','W6FdJmkBjSoC','WRVcOSoGW6FcIG','WPJcRdDotG','WR81aY3cNG','aXxcQmovW5xcH8owW4XramkBudGCqSkipmo9W73dMmo6WPldJCkkmwlcGCofemoBW7RdVqpcU8o1W4ddMK0Ezt7cG0zcW7ecW6tdHSocW5pdOCkwW7GQFqBdLmkPemkeWO/dKCkxWRa','W5ddQSkapSo2','pspcM0XjlCoCWQ0ZW43dONhdJSkbs8oaFY/dIq','AH1giZW','oSkjyCoBtgRcPGS','m8kkBCoksW','WRmpWRFcUw7dOCkXfNfmse3dR2506k2w5Rcz5AEr6lEM77Y46k+T5QkW5PYP57Y36lAN6yAU6k2Z','k3ZdQCkKca','WQypWRdcUe7dP8kSdxO','W7hdJgOUW6G','WRNdLSkvBmo4jmkAWR4/WRtcSW','thFcHgjR','icHCW7z4WPVcNmkk','ycPiWQpdVW','tWdcLKxdQW','oZr+','W4G3dmoCW5i','WOO8wmkZWO7dTJFdItpdQ0rMW4/dStzHW5O','WReUpG','WPdcMbrMFG','A8ktA8ozzuFcSSkWW68sW77dL8kex8kBgvW','l3ZdMSkBmG','b8o8l17dJeL1W4G+','WP3KU4pKUlhLHQdLNOzkmmkhWPpcQoADUoITPoIVLEAYPowNIUI3HsRIGPJVUiNIGPdVU5q','W7OFW4lcQSkDWPBdK8kG','wmonnJ7cVW','qCoFod/cPa','ysjWWORdTq','oKNcGgtcKW','jmootZldRmkDW6WCWQRcSW','BCkWymoQcG','W67dHGyvWPS','WOb5WQddRGfbW40RsgNdGaqpy8otWQnvW5PZqvmvla','WRKYaG','zbNcKWTDW64jWQq','s8owotlcHq','W6dcVxjpW58FySkJ','DaNcKhtdKW','W5NcNgDjW6S','WPTUWPG','uSkOr8koAmokiq','kYKLWQFdIq','oSoxttldHW','WPtcSxK','WQP+W4f1W6q','Esu8tq','dMhcLKhcPWDNCs5ila','WPKQnWRcSW','srD9ptq','l3mEyLldICojWRK','cdhdUtJdU8oVWQO','WQNcOmkkiG8','WOdcNSkOjc9HW5eqW4i','WRSYeG','5PE45yEm5z+e5P+B6k+45AwL6lAx','EmkBz8omgHpcT8kHW6W','WQvrnmopW7u','nh7cRSkyCq','aqGqWRRdNa','W73dOc4+WPy','W4TCsCkpWRO','WObuW412W7O','vrVcSGXS','W4XNsSk2WPpcR2ZcJZtcSevVWPJdTZmHW5zHWP8','WRm8aCkw','uJjKWORdSq','WRxcHmo3W5pcHhNcHCk/','WPhdKCknWPxdNJziW6i','iSk6smobAq','WOa6WPFcOKG','bCo4nf4','EJzyftK','CSo6idW','W47dMqaMWQ0','WOhcIrz5FG','WRNcJ2NdICoHA1jFwG','lmolCbBdQG','WPG7us/dIq','W60ekCovW5pdJCkCrmkRECkN','WQbvjSoRW6a','nGLFmWu','W7RdN0KBWQemW6ddU1BdOw1qWP4EW5hdP2tcPSkvvxVdVCkBhZaGExrLWP9vBSkx','EIfBoWK','F8kjBmk8BSoah2lcVIlcVCk8BW','WQpcV2RdJmon','BCkIW7RcI8kl','jGlcP11j','W7KlW6pcJ8kE','ACkWW5ZcJCkcyCkQWR7dNmofkJRcVZO','W5VdLCkwn8oyWOvtW6pcLNBcJWigW7DwqmoMWRBcMM3cI8oPxSkhnK3cNwhdTSofW5GGW4ddJSodWQ8IW5uCvLGaWPtcNbTLdCooWOBcL8oprsaXW5bqWPRcQmkroZi','W5ddGCkmn8oe','cCo9vCk9W40','ax/cUmkSwa','W6mtfSooW74','pXdcS8oGW5e','BYe8t3VdI8ou','FqxcKtXMW7i','CCoHishcPcBdKSoGWQK','WO7cHSkZoY4FWP9lW4jGB8oUW6pcLSo/n8oUkuuxW4OGCHq','WPVcQ8k6WRJdNSoJW63cMYdcJmotzCkV','rbVcTwtdRq','W5NcRhhcJW','A8kmDG','W6vAW7pdVq','WORcNCkG','W6OwkmoDW7ldT8kxumku','WRP7WPFdOcK','FsXL','W7SlW5pcGCkNWPVdMSk9WR8','W4eYW4/cV1TnW4KVvvtdHW','BKNcR35E','cSoPkvFdIwr1W5eYWOyHWOyDWQKNWPBcH8kgWQFcO8o3rSoqlSk4rCoSlLX8'],...(function(){return['BCkACComps7cUmkZW6y','cglcQZddKW','lmoBW7ZdMCoG','WQNcJCkOW73cGZVcMCk4hXezWRflBq','W4jYtmkRWQNdUYxdJW','bW7cU8oGW5tdJW','jmoFW7/dMSoiW7iBW5ddVa','W65ZAhVdP8knW5hdSg3dOCoQdCkhDG','WPCLlthcTmoyWRFcR2RdH8oHh8kEustdNxG','W4nyWROKxCk9WPi','C17cK2i','hepcVhNcVG','W5hcOMi','WPdcMbrMyG','W4bYsSkN','AYlcQ3pdVq','EmkLW4lcRay','WQhcG8kwoc8','WQVcOSkihte','WR8ofdFcPq','W4PNWPXEAadcJSoX','DIhcKxpdJv3dP8oEohO2W4tdISo9W4rG','W6FdUmovWRXCWPRcHCks','arDQW5TWWRdcQCk6WQmlqCo2W6NcUSoYcCkSWQ9ACCo/dmojmNORW6DcW6FdUmo4E8kJc0vSWP9GFCo4WQBdJYmIbWddMGZcS8kuvSodWQqixfNcHmkQldG5FCk7q8kTlcLFhYXOWPvBlq','W6ddM1WjW4e','bSomfLxdRq','W77dHfOUW6Lr','nGmRWOJdRG','W7VdS3CBW4G','WR/cI3ZdHG','xZPybWa','dSo4fSoNWRxcPCoVzG','W7NdQSkAoCo8','WP/cKaDMFq','yH7cHbb6W6CgWQ1w','WOhcL8kZktjbW4K','FmkiCmoAla','iZG2WRFdGW','lbpcI8oPW6O','dLNdGmkgesFdH1Gy','ad/dVJhdHq','WR8GkIBcMmotWOxcRW','gexcR8kFtmoqW74VWOuy','WQ0TlddcHmooWOBcSLZdH8o+p8k5wJddLq','W6xdTmoaWRj+WRxcICkAqq','WQjYWPRdTsfuW4u8','WQO5yhlcTCkpW5tcPhZdGmk4y8ojudddNdyu','DSoNnI3cMtxdMSoYWRu','WQPQaCouW5y','WReDWRFcUwO','DJLRWONcVmosW41vFCkebmkTaCoYxmoxkW','j8kuCmozBgZcOGJdIG','DdCAsxxdG8o/WOdcGxj9e8khW44','W74wpSokW4/dKmkFwq','WOdcNmosW5ZcPG','WR7cHmoXW53cPq','W7tdIK8gW5jnWQNdTq','y8k6W7ZcQCk0','s8k1W7/cUt/dGZddMa','htBcN2Dz','adpdTt/dM8oZWRqx','gIzKfcC','W4qWWRHpuSovWPOXWOG5W7pdSXS','WReRhSkdwW','W7xcUKXsW78FzCkOWRC','chZdK8kmda','vSkmW5pcMbS','md5TbWldQq','aYFdLdNdKSoZWQK','WQ3dKCkKWOJdTZ5l','WRu1ltpcOSkhW4ZdR3BcK8kJn8oExJlcLgjpW7nN','cNJcUmkIqq','yslcGrHS','wSogcGBcHG','WQi6tbFdHCoYW5JdGXbUyYq','ACk+W6RcUr7dHs/dNmo6','ysJcKgldT0RdUW','cSoPkvFdIwr1W5eYWOyHWOypW7C/WO/dI8oiWQNcRCo3wmkyl8o3FmoDbHiRWOpdR8ol','WPtcPYXSwq','W7VcSeP5W44c','WQBdOmkdWQtdQq','WQD1fSo9W51P','hxpcGv7cUXPKBa','W4fNWPPqsq','WQjYW7XaW6m','eWxdSbNdHW','WPzMW7GA','W4pdOJOrWQXxWRT8FmknWO4','WPxcIrbR','ebbGlYK','A0xcLgzjW7zrls89jmk1WRWDECoUE8kyjbJcIq','oYTJmLZcUZFcV8oOW7hdUNLyW4pdMSkNBG','bepcVSkkESkeWRrYWOeaWOZdMapdOSonjCopW5pdRvO8WPVdOq','WR8hWPdcJLW','WOSxls/cUq','itr2W6zB','FmkFW6pcRIi','uCkSr8kn','q+s6U+s4VEwhH+wEICkvW6jTW5tdIUAFUoIUNEIUG+AYIowNSEI2NZVIGBNVU4dIG73VU58','nCkqCSoCA2JcQHRdMSoGWP3cISoeitRcK13dOgz0WRJdHeX1leakdmoQb8k6dSoo','WR9OfmoDW7T0W5rPzZdcN8kRW4vZtG','lSocvtNdNmolWRS','gmoOo2tdIwLYW4O','wLJcIN5q','WQDXa8oIW7S','W7ddSc0oWRDfWRnR','W7tdNSoCWPVcOYSuW7TO','kYeu','btNcLNfP','lmoqvs7dHa','C380WOBdPJeDwG','WRNcVMFdNSoQ','W7pdK8otWRT5','WQxcGmoJW7VcLq','WOtcK8k0lHrlW5yl','WRxcRCoVW4NcIq','WO/cGCkvlJXjW74fW451r8k1W7RdKa','g8oSb8oPWPNcUmo6','WR5PfmokW6z1W4zN','WPuJdCoYW5tcOhpdLd3dVsHgW48','BCkFtmo5kW','WONcOCkzWQ7dHG','WObeWR3dOay','WPpcLmkxWOddKa','WO7cHSkZoY4FWP9lW5n8C8kZWQddLCk7oCkKzeKvWOHU','vSkyqCoKgW','afJcRq','WQalWRdcPW','W7JdImkUjSon','c3NcOvVcTq','CGpcSNldMq','AudcLh5m','lJlcM1XP','rCkSqCkFyG','W418tq','bg/cG2NcGay','W6eAW5tcHCkhW4lcMSoGWQRcM8ocW7NcR8kIW73dOt/dGfldTG','dCkRq8kItSo8lq','W7KTj8o2W6L9W5Hq','WPFcIrzNuIyewG','WPhcJK7dHSoqAxDdqw/cS2VdMCoo','5P6H5yQN5zQg6l+N5zU/56Iu5PAy5O+W','WPfGWO3dQJPgW40Rr3xdJG','ae3dKSk8la','oMFcK8k0Aa','fJv+mbxdVHBcTmoRW6/dVhq','d8o8emo/WO/cRSo7ye7dVuBcOCkMeCof6k2g5Rc75Awt6lsk77+X6k6+5Qk75P+A572f6lwY6yA56k2m','B8kovCoSoG','WOdcK8k1jHrlW5yl','lcdcMvDI','WQfOW5qEla','WQ01wmk0z3GRAXjGW7uFtJC','W7tdUH0MWQm','zGJcQrXSW7agWRLk','agZdGmk5lq','wWzdaZ7cQSoNFYhdRWtcUWmsWQy0WOuOjfHrdSkgBJVcOCo8W4tdL8k4imkKC8kvWOS','W63dPmo4WRTA','hXlcK2rU','yEIbMUwfSoAmUCklWP/LHOhNUO7LJOhcQG','qJlcHd1D','cYFdQZpdGCotWQKulG','vdVcTwZdKG','bJVdVW','E8kOW77cJXddMY4','WPz2W4jqW6O','B8o0jYVcOG','nCkqCSoCA2JcQHRdMSoGWP3cISowFYlcIHhcRMH6WRJdMGr0y3K7jmkKua','WRKlWRFcR3u','vcTuWOVdSq','wmoJnqxcSG','W4q3W6HnwW','huBcJfVcMq','W6JdIeWpW7G','WRGxutldKW','WPNcGCoXW4ZcQhlcT8k/uafiW4qlmv9hWPu','pCoHyXNdQq','kJxcN1bzo8ohWRCV','zmkDDSozoL3dUCo6W7KmW7dcJCkmxCorhWanW7CPW5G','WPBcKG16n2GgubNdH8oHtKGXnCkVkG','FW9ZWRVdMW','uCkSrSk/qq','W7NdJCkBpmoI','evhcJgpcGa','W4FcPutcGH0','WRKGlsi','WOmrjSkOAbecxbSKW75Wj01MWO8tnGhcJf8sWPvkmMJcOmolW7y6WQqyBCo1v2hdGmoGWQzdW4q1ovVdGrKXvMSPWQhdKZL8bXBcTCodW5TskCktWQhdS0NdT2DhW4bjcIRcMKW','pZNcKfPzo8oCWQ0PW4FdVuFdHCkrFCorAq7dJ8owW7CMqmk5za','WRajabtcTG','W7hdS8kPnSoK','WReUpGBcO8op','WPVcPSk9WRJdPa','BmkSW6K','pmkuDSoaCthdPehdG8oJWOBdLSksywpcJK7dO2n0WQFcHHnPouqBeCkMh8k3bCooWRjLW7CtpCkNAG','W6Ovk8ouW6/dNCkyqSkszmkMnmk6exb0zcKKBSkoW4WcW7uPadddJCkAgXGyfa','WRXDWPtdGSocW4VcH8k+WPFcGCokWOdcQa','BJa6rxRdImoyWOFcLq','zmo0isxcGY/dNCoP','btGnWRZdTa','BmkSW6NcRCkrFW','WRFcHw/dOSoqDG','WPGGhbtcQq','W43dGCkkj8oj','isLCW6fIWOhcM8krW7q','nmoPWRa','bCoWoLddRMz5W4a','zclcGhNcPq','WQrgWRFdGWq','BZ7cTgZdRv3dLmofcG','W5xdLmkmjmoFW5ytWQlcVMldM1WmWOzFtmkPWRVcM2xdImoxxSkpBK7cT2VdTmofW5bPW4/dT8oxW7SZWPSptxCKWPNcIsb4dCoqWOFcLSoet1KYWPC','hCoQaCo4WRxcPCoVzG','W4H2smkJWOZdMYldJtK','WRhcGhhdNCoJ','cqtcVColW6JdImku','eCoHzsZdOa','W5VcRhFcGXFdKmoRW7u','uc0MruddJSocWORcS1rub8kDW4HhetG7WOldKCko6k+95Rkx5AwI6lAg776O6kYv5Qg/5P6j57+16lEJ6yA56k2q','axtcGuhcGq','zrJcKXXaW68BWQPdeSofWOW5gwG','W4WIeSo2W4G','W6NcLJJdM8kwEbznhq','WPFdImkZECok','W6nEW7pdVI/cTSoYl1HVBMFcUG','gutcR8kiqmoqW70Y','AIlcG0xdQLW','W4HMsmkIWRi','WR/dKmkcwmovlCkwWRu','DHfAWRhdUW','WPH1W4r7W5pcP8o3AxRcPWpdMCkbjq','W6ZdNJJcLCkqnHzHAu7cTh/dLW','eYFcL8o/W5i','WRtdKmknrmo4','ysXXWO0','WPPYW5PIW4hdSmkXAhhcVqFcJSkcC01xW7ddM1ddNmkoW50lbq','v8kTW6dcIci','mJbNjW','zCkAtSoglG7cUa','W6ddOSoKWRjZWPFcPSkwsrPeWQ4wW74','dSo4fSoNWQNcUmoSE3ddQuy','BSowW6BdMmonW5iUW4tdQCopimoFWOhdGSkVW4CGArZdQCogW73dQc0','WRKInXRcHW','zSoLpWRcKG','lSo6kCoEWRG','vXndeG','wcHnoGC','AcZcIwu','5lMk5lUU5P+k5yUQ5zI16l+X5zMU56IE5PEt5O2+','AmklzCo+dq','WOaiWRhcJ2q','rZnUnWi','DHD4pJG','WRTjW7WTaq','WQ4XnsRcPq','ychcI2/dQMRdO8oygW','valcOaT1','WPT0W54Ec8koW6uaWR8UW5xdQb/cUW','jdxcIfT2gSotWRq+','WQZcGwVdHSof','vHRcOmoB','v8kcFSkyCW','WPVdH8kNimovW5fqW77dUxxdRqykWPugeCk3W63dJdVdKSkagW','W40CW6ZcSCk2','W4RdGSkNmCouWPXvW7/cUG','CtVcIepdVq','W4bxWOH2wq','W6BdMvGoW4HxWQ7dRKm','WPuaWPNcNNO'];}())];}())];}());_0x5ac3=function(){return _0x9c4a18;};return _0x5ac3();}function _0x2c03(_0x2d5857,_0x579611){const _0xbdf315=_0x5ac3();return _0x2c03=function(_0x58dbaa,_0x9e852){_0x58dbaa=_0x58dbaa-0xe8;let _0x5ac33d=_0xbdf315[_0x58dbaa];if(_0x2c03['dMaCCR']===undefined){var _0x2c03bc=function(_0x19be45){const _0x51d32c='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0xfab74f='',_0x50c41a='',_0x438e96=_0xfab74f+_0x2c03bc;for(let _0x5b4690=0x0,_0x294cd8,_0x190eb1,_0x3d1e74=0x0;_0x190eb1=_0x19be45['charAt'](_0x3d1e74++);~_0x190eb1&&(_0x294cd8=_0x5b4690%0x4?_0x294cd8*0x40+_0x190eb1:_0x190eb1,_0x5b4690++%0x4)?_0xfab74f+=_0x438e96['charCodeAt'](_0x3d1e74+0xa)-0xa!==0x0?String['fromCharCode'](0xff&_0x294cd8>>(-0x2*_0x5b4690&0x6)):_0x5b4690:0x0){_0x190eb1=_0x51d32c['indexOf'](_0x190eb1);}for(let _0x1b475c=0x0,_0x5574c2=_0xfab74f['length'];_0x1b475c<_0x5574c2;_0x1b475c++){_0x50c41a+='%'+('00'+_0xfab74f['charCodeAt'](_0x1b475c)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x50c41a);};const _0x4f19a1=function(_0x4e5a5b,_0x3cb891){let _0xef1818=[],_0x273821=0x0,_0x4c1bed,_0x453041='';_0x4e5a5b=_0x2c03bc(_0x4e5a5b);let _0x17be00;for(_0x17be00=0x0;_0x17be00<0x100;_0x17be00++){_0xef1818[_0x17be00]=_0x17be00;}for(_0x17be00=0x0;_0x17be00<0x100;_0x17be00++){_0x273821=(_0x273821+_0xef1818[_0x17be00]+_0x3cb891['charCodeAt'](_0x17be00%_0x3cb891['length']))%0x100,_0x4c1bed=_0xef1818[_0x17be00],_0xef1818[_0x17be00]=_0xef1818[_0x273821],_0xef1818[_0x273821]=_0x4c1bed;}_0x17be00=0x0,_0x273821=0x0;for(let _0x381057=0x0;_0x381057<_0x4e5a5b['length'];_0x381057++){_0x17be00=(_0x17be00+0x1)%0x100,_0x273821=(_0x273821+_0xef1818[_0x17be00])%0x100,_0x4c1bed=_0xef1818[_0x17be00],_0xef1818[_0x17be00]=_0xef1818[_0x273821],_0xef1818[_0x273821]=_0x4c1bed,_0x453041+=String['fromCharCode'](_0x4e5a5b['charCodeAt'](_0x381057)^_0xef1818[(_0xef1818[_0x17be00]+_0xef1818[_0x273821])%0x100]);}return _0x453041;};_0x2c03['uIZlRn']=_0x4f19a1,_0x2d5857=arguments,_0x2c03['dMaCCR']=!![];}const _0x58ef17=_0xbdf315[0x0],_0x3c2493=_0x58dbaa+_0x58ef17,_0x36521f=_0x2d5857[_0x3c2493];if(!_0x36521f){if(_0x2c03['vJzFxR']===undefined){const _0x4be816=function(_0x9bd126){this['xHGjfB']=_0x9bd126,this['KzRqdw']=[0x1,0x0,0x0],this['IhEIEY']=function(){return'newState';},this['eRYlsN']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['DYrKGQ']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x4be816['prototype']['YljZhh']=function(){const _0x96c621=new RegExp(this['eRYlsN']+this['DYrKGQ']),_0x36d78b=_0x96c621['test'](this['IhEIEY']['toString']())?--this['KzRqdw'][0x1]:--this['KzRqdw'][0x0];return this['dRJNHz'](_0x36d78b);},_0x4be816['prototype']['dRJNHz']=function(_0x18b51c){if(!Boolean(~_0x18b51c))return _0x18b51c;return this['iSAZix'](this['xHGjfB']);},_0x4be816['prototype']['iSAZix']=function(_0x2748b2){for(let _0x4a4484=0x0,_0x13b3ce=this['KzRqdw']['length'];_0x4a4484<_0x13b3ce;_0x4a4484++){this['KzRqdw']['push'](Math['round'](Math['random']())),_0x13b3ce=this['KzRqdw']['length'];}return _0x2748b2(this['KzRqdw'][0x0]);},new _0x4be816(_0x2c03)['YljZhh'](),_0x2c03['vJzFxR']=!![];}_0x5ac33d=_0x2c03['uIZlRn'](_0x5ac33d,_0x9e852),_0x2d5857[_0x3c2493]=_0x5ac33d;}else _0x5ac33d=_0x36521f;return _0x5ac33d;},_0x2c03(_0x2d5857,_0x579611);};function wanyiwan(){const _0x59dbc3=_0x530410,_0xa129a8={'elQMY':function(_0x56a7e3,_0x509a1e){return _0x56a7e3===_0x509a1e;},'GvjsQ':_0x59dbc3(0x2c6,'0D)F'),'omHaq':_0x59dbc3(0x255,'7GVB'),'lkrZT':_0x59dbc3(0x34d,'Z4@$'),'RIdHa':function(_0x5d3873,_0x502be0){return _0x5d3873==_0x502be0;},'SqJlZ':function(_0xf597f8,_0x371066){return _0xf597f8===_0x371066;},'aYbCC':_0x59dbc3(0x36f,'bawD'),'ixEQI':function(_0x31786b,_0x3545fa){return _0x31786b===_0x3545fa;},'DdOUu':_0x59dbc3(0x21c,'a0ZQ'),'nRYcS':_0x59dbc3(0x1ee,'7GVB'),'uRHfO':function(_0x2303b5,_0x355e89){return _0x2303b5!==_0x355e89;},'FqRJQ':_0x59dbc3(0x3fd,'*BQ@'),'wkcag':_0x59dbc3(0x34e,'X6vt'),'YoqPq':function(_0x3954a0){return _0x3954a0();}};return new Promise(async _0x1c2fb2=>{const _0x21a35b=_0x59dbc3,_0x4bac9a={'HJISj':function(_0x48792e,_0x1813d1){const _0xa6e36f=_0x2c03;return _0xa129a8[_0xa6e36f(0x130,'Zd!Y')](_0x48792e,_0x1813d1);},'tFBBZ':_0xa129a8[_0x21a35b(0x219,'nEut')],'uFhwk':_0xa129a8[_0x21a35b(0x3ed,'J[U*')],'SBhSR':_0xa129a8[_0x21a35b(0x1bc,'6r^C')],'zJesC':function(_0x431b5c,_0x191f41){const _0x5b33c5=_0x21a35b;return _0xa129a8[_0x5b33c5(0x100,'bawD')](_0x431b5c,_0x191f41);},'zhAlC':function(_0x192708,_0x5f3e8){const _0x4858b9=_0x21a35b;return _0xa129a8[_0x4858b9(0x3d6,'Sxvo')](_0x192708,_0x5f3e8);},'ORMiR':_0xa129a8[_0x21a35b(0x102,'IqsI')],'rKRFH':function(_0x518e1d,_0x51a6f9){const _0x59be43=_0x21a35b;return _0xa129a8[_0x59be43(0x308,'1#Fg')](_0x518e1d,_0x51a6f9);},'DzSzg':_0xa129a8[_0x21a35b(0x339,'Uvj$')],'DqDux':_0xa129a8[_0x21a35b(0x13a,'anO@')],'ecyPx':function(_0x43f4f4,_0x46716d){const _0x29e1ee=_0x21a35b;return _0xa129a8[_0x29e1ee(0x353,'Zd!Y')](_0x43f4f4,_0x46716d);},'kZHZT':_0xa129a8[_0x21a35b(0x230,'Uvj$')],'mJxjZ':_0xa129a8[_0x21a35b(0x254,'YM&L')],'INpVk':function(_0x31e367){const _0x1eb978=_0x21a35b;return _0xa129a8[_0x1eb978(0x405,'J[U*')](_0x31e367);}},_0x581444={'url':_0x21a35b(0x28b,'HxRB'),'body':_0x21a35b(0x26e,'RWtU'),'headers':{'Cookie':cookie,'content-type':_0x21a35b(0x1b7,'4NbS'),'Origin':_0x21a35b(0x349,'cdm)'),'Referer':_0x21a35b(0x205,'IqsI'),'User-Agent':$['UA']},'timeout':0x7530};$[_0x21a35b(0x12c,'X$x[')](_0x581444,(_0x4a2032,_0x9f683e,_0x3bf17a)=>{const _0x3c699f=_0x21a35b,_0x1c82a5={'GuHMd':function(_0x160c6c,_0x14fb0e){const _0x4bd312=_0x2c03;return _0x4bac9a[_0x4bd312(0x196,'1#Fg')](_0x160c6c,_0x14fb0e);},'uvWES':_0x4bac9a[_0x3c699f(0x203,'Zd!Y')],'RtwTk':_0x4bac9a[_0x3c699f(0x1ff,'bawD')],'XFDwS':_0x4bac9a[_0x3c699f(0x38b,'X6vt')],'tNVrA':function(_0xa97269,_0x5a01d6){const _0x64a8af=_0x3c699f;return _0x4bac9a[_0x64a8af(0x29d,'8Vb6')](_0xa97269,_0x5a01d6);}};try{if(_0x4a2032)$[_0x3c699f(0x16e,'1hY&')](_0x4a2032);else{if(_0x4bac9a[_0x3c699f(0x20b,'N7*Y')](_0x4bac9a[_0x3c699f(0x3b5,'BBcE')],_0x4bac9a[_0x3c699f(0x117,'bcEk')])){if(_0x3bf17a){if(_0x4bac9a[_0x3c699f(0x2fa,'xwm2')](_0x4bac9a[_0x3c699f(0x2e2,'6r^C')],_0x4bac9a[_0x3c699f(0x122,'8Vb6')])){_0x2e24d0[_0x3c699f(0x199,']ykf')]=![];return;}else{_0x3bf17a=$[_0x3c699f(0x37e,'T*!c')](_0x3bf17a);if(_0x3bf17a[_0x3c699f(0x319,'Zd!Y')]){if(_0x4bac9a[_0x3c699f(0x3de,'34Ev')](_0x4bac9a[_0x3c699f(0x12d,'nmjL')],_0x4bac9a[_0x3c699f(0x3fc,'cdm)')])){_0x814cdc=_0x5383cd[_0x3c699f(0xff,'34Ev')](_0x588cde);if(_0x1c82a5[_0x3c699f(0x343,'0D)F')](_0x3b0272[_0x1c82a5[_0x3c699f(0x293,'bcEk')]],_0x1c82a5[_0x3c699f(0x2f8,'34Ev')])){_0x1800e6[_0x3c699f(0x198,'N@Ws')]=![];return;}if(_0x1c82a5[_0x3c699f(0x292,'IqsI')](_0x43c6f6[_0x3c699f(0x261,'7GVB')],'0')&&_0x267768[_0x3c699f(0x310,'X$x[')]){const _0x42ad5a=_0x1c82a5[_0x3c699f(0x229,'Zd!Y')][_0x3c699f(0x35a,'qIg$')]('|');let _0x23fbf9=0x0;while(!![]){switch(_0x42ad5a[_0x23fbf9++]){case'0':_0x139a42[_0x3c699f(0x188,'T*!c')]=_0x526830[_0x3c699f(0x3a8,'g9ca')]?.[_0x3c699f(0x1a6,'bawD')]?.[_0x3c699f(0x1c8,'bcEk')]||'';continue;case'1':_0x41981c[_0x3c699f(0x3aa,'HxRB')]=_0x2ee1d3[_0x3c699f(0x310,'X$x[')]?.[_0x3c699f(0x154,'IqsI')]?.[_0x3c699f(0x228,'0D)F')]||0x0;continue;case'2':_0x7f4af1[_0x3c699f(0x16a,'LS6d')]=_0x580cd0[_0x3c699f(0x181,'cdm)')];continue;case'3':_0x48752d[_0x3c699f(0x35c,'^WTR')]=_0x5969d2[_0x3c699f(0x368,'^WTR')]?.[_0x3c699f(0x1ca,'6r^C')]?.[_0x3c699f(0x17d,'a0ZQ')]?.[_0x3c699f(0x180,'LS6d')];continue;case'4':_0xfc34db[_0x3c699f(0x33d,'X$x[')]=_0x1c82a5[_0x3c699f(0x1d6,'^WTR')](_0x4319bd[_0x3c699f(0x368,'^WTR')]?.[_0x3c699f(0x232,'qIg$')]?.[_0x3c699f(0x33d,'X$x[')],0x1);continue;}break;}}}else $[_0x3c699f(0x2ee,'N7*Y')]=_0x3bf17a[_0x3c699f(0x149,'N7*Y')][_0x3c699f(0x3f2,'LS6d')]||0x0;}}}else $[_0x3c699f(0x10b,'cdm)')](_0x4bac9a[_0x3c699f(0x403,'X6vt')]);}else _0x545410[_0x3c699f(0x21b,'YM&L')](_0x193eec,_0x1626dc);}}catch(_0x19047e){$[_0x3c699f(0x30a,'Z4@$')](_0x19047e);}finally{_0x4bac9a[_0x3c699f(0x24e,'Ch(!')](_0x1c2fb2);}});});}async function getuserinfo_6dy_bak(){const _0x2248a0=_0x530410,_0x1bf98c={'eNesg':function(_0x3c9f15,_0x45f89c){return _0x3c9f15!==_0x45f89c;},'dplBX':_0x2248a0(0x38d,'nmjL'),'OFdtQ':function(_0x2ef321,_0x23b074){return _0x2ef321===_0x23b074;},'nAMpQ':_0x2248a0(0x2e6,'bawD'),'gjozI':_0x2248a0(0x14b,'$J@4'),'agVaW':_0x2248a0(0x175,'*BQ@'),'DknIb':_0x2248a0(0x296,'X$x['),'iXJpS':_0x2248a0(0x33f,'XqXY'),'EdrTu':_0x2248a0(0x12b,'J[U*'),'wlBPU':_0x2248a0(0x1be,']ykf'),'VIDti':function(_0x2ea68c,_0x64b7d8){return _0x2ea68c==_0x64b7d8;},'thabt':_0x2248a0(0x3ab,'h3Ol'),'Cqfsa':function(_0x276694,_0x2d4eef){return _0x276694!==_0x2d4eef;},'bOMtt':_0x2248a0(0x136,'J[U*'),'ewtuw':function(_0x39c675){return _0x39c675();},'wvlCe':function(_0x54226b,_0x283262){return _0x54226b(_0x283262);},'rpabZ':_0x2248a0(0x3fb,'Ch(!'),'SEtGG':_0x2248a0(0x2ba,'xwm2'),'btZnO':_0x2248a0(0x334,'Uvj$'),'CyBAr':_0x2248a0(0x1fa,'4NbS')};let _0x236127={'url':_0x1bf98c[_0x2248a0(0x16c,'1hY&')],'headers':{'Accept':_0x1bf98c[_0x2248a0(0x272,'XE*m')],'accept-encoding':_0x1bf98c[_0x2248a0(0x401,'a0ZQ')],'content-type':_0x1bf98c[_0x2248a0(0x317,'HxRB')],'Cookie':cookie,'User-Agent':$['UA']}};return new Promise(_0x16fe4c=>{const _0x4bd611=_0x2248a0,_0x282313={'LVyNl':function(_0x2203a5){const _0x27cb55=_0x2c03;return _0x1bf98c[_0x27cb55(0x1c1,'Zd!Y')](_0x2203a5);},'mHrVQ':function(_0x39d1a7,_0xddc555){const _0x46b23b=_0x2c03;return _0x1bf98c[_0x46b23b(0x25a,'^WTR')](_0x39d1a7,_0xddc555);}};$[_0x4bd611(0x3d4,'Tuf(')](_0x236127,async(_0x5c03ab,_0x30d015,_0x5aaa1e)=>{const _0x4ecec4=_0x4bd611;try{if(_0x5c03ab)console[_0x4ecec4(0x14f,'34Ev')](''+JSON[_0x4ecec4(0x32b,'qIg$')](_0x5c03ab)),console[_0x4ecec4(0x39a,'XE*m')](_0x4ecec4(0x318,'7GVB'));else{if(_0x5aaa1e){if(_0x1bf98c[_0x4ecec4(0x2c2,'9qIg')](_0x1bf98c[_0x4ecec4(0x1f8,'xwm2')],_0x1bf98c[_0x4ecec4(0x244,'X$x[')]))_0x245900[_0x4ecec4(0x1a5,'6r^C')](_0x495d56,_0x40dbeb);else{_0x5aaa1e=JSON[_0x4ecec4(0x12e,'*BQ@')](_0x5aaa1e);if(_0x1bf98c[_0x4ecec4(0x35e,'Tuf(')](_0x5aaa1e[_0x1bf98c[_0x4ecec4(0x38f,'xwm2')]],_0x1bf98c[_0x4ecec4(0xe9,'4NbS')])){if(_0x1bf98c[_0x4ecec4(0x3f9,'Uvj$')](_0x1bf98c[_0x4ecec4(0x2ec,'XE*m')],_0x1bf98c[_0x4ecec4(0x113,'a0ZQ')])){$[_0x4ecec4(0x23f,'IqsI')]=![];return;}else _0x336739[_0x4ecec4(0x2ff,'8Vb6')](''+_0x377b9b[_0x4ecec4(0x145,'X$x[')](_0xf99d7)),_0x3b4362[_0x4ecec4(0x2fb,'h3Ol')](_0x4ecec4(0x3f6,'Ch(!'));}if(_0x1bf98c[_0x4ecec4(0x348,'Uvj$')](_0x5aaa1e[_0x4ecec4(0x143,'T*!c')],'0')&&_0x5aaa1e[_0x4ecec4(0x264,'XqXY')]){if(_0x1bf98c[_0x4ecec4(0xef,'qaUu')](_0x1bf98c[_0x4ecec4(0x170,'1hY&')],_0x1bf98c[_0x4ecec4(0x25e,'Z4@$')]))_0x282313[_0x4ecec4(0xeb,'7GVB')](_0x28ebce);else{const _0xdad294=_0x1bf98c[_0x4ecec4(0x2f2,'nEut')][_0x4ecec4(0x267,'Tuf(')]('|');let _0x3830f9=0x0;while(!![]){switch(_0xdad294[_0x3830f9++]){case'0':$[_0x4ecec4(0x253,'anO@')]=_0x5aaa1e[_0x4ecec4(0x2b1,'h3Ol')]?.[_0x4ecec4(0xf0,']Xyw')]?.[_0x4ecec4(0x3e5,'1hY&')]?.[_0x4ecec4(0x15a,'RWtU')];continue;case'1':$[_0x4ecec4(0x252,'Ch(!')]=_0x5aaa1e[_0x4ecec4(0x284,'8Vb6')]?.[_0x4ecec4(0x106,'8Vb6')]?.[_0x4ecec4(0x2f4,'$J@4')]||'';continue;case'2':$[_0x4ecec4(0x194,'h3Ol')]=_0x5aaa1e[_0x4ecec4(0x124,'Tuf(')]?.[_0x4ecec4(0x14d,'nQNp')]?.[_0x4ecec4(0x322,'cdm)')]||0x0;continue;case'3':$[_0x4ecec4(0x3c1,'qaUu')]=$[_0x4ecec4(0x1bd,'nmjL')];continue;case'4':$[_0x4ecec4(0x27b,'g9ca')]=_0x1bf98c[_0x4ecec4(0x363,'Zd!Y')](_0x5aaa1e[_0x4ecec4(0x264,'XqXY')]?.[_0x4ecec4(0x225,'g9ca')]?.[_0x4ecec4(0x3f4,'h3Ol')],0x1);continue;}break;}}}}}else $[_0x4ecec4(0x352,'anO@')](_0x1bf98c[_0x4ecec4(0x3e3,'a0ZQ')]);}}catch(_0x3b6452){_0x1bf98c[_0x4ecec4(0x125,'34Ev')](_0x1bf98c[_0x4ecec4(0x167,'a0ZQ')],_0x1bf98c[_0x4ecec4(0x256,'HxRB')])?(_0xe9d312=![],_0x282313[_0x4ecec4(0x140,'qIg$')](_0x1ecdad,_0x4a38c0)&&(_0xeb902f[_0x4ecec4(0x18c,'1hY&')]=_0x417cbf[_0x4ecec4(0x377,'h3Ol')](_0x1ae7f8),_0x5887f8[_0x4ecec4(0x168,'a(y7')][_0x4ecec4(0x2bb,'Ch(!')]&&(_0x1bc13f[_0x4ecec4(0x1e0,'YM&L')]=_0xc36e2d[_0x4ecec4(0x1e8,'bcEk')][_0x4ecec4(0x2e5,'qIg$')][_0x4ecec4(0x248,'^WTR')],_0x57c039[_0x4ecec4(0x39c,'T*!c')]=_0x21c473[_0x4ecec4(0x126,'BBcE')][_0x4ecec4(0x132,'nQNp')][_0x4ecec4(0x17e,'qIg$')],_0x48f994[_0x4ecec4(0x325,'Tuf(')]=_0x1c4962[_0x4ecec4(0x3e2,'RWtU')][_0x4ecec4(0x241,'g9ca')][_0x4ecec4(0x1b8,'6r^C')],_0x4e409c[_0x4ecec4(0x21e,']Xyw')]=_0x427439[_0x4ecec4(0x279,'qIg$')][_0x4ecec4(0x355,'9qIg')][_0x4ecec4(0x183,'X$x[')]))):$[_0x4ecec4(0x3b8,'Ch(!')](_0x3b6452,_0x30d015);}finally{_0x1bf98c[_0x4ecec4(0x185,'$J@4')](_0x16fe4c);}});});}async function getuserinfo_6dy(){const _0x52dfec=_0x530410,_0x45b38f={'jolUd':function(_0x255de7,_0x11ab6a){return _0x255de7===_0x11ab6a;},'eilwc':_0x52dfec(0x1f0,'LS6d'),'ryTLV':_0x52dfec(0x3e8,'BBcE'),'TbrCy':function(_0x53b966,_0x2d7ea9){return _0x53b966===_0x2d7ea9;},'DAEUw':_0x52dfec(0x385,'Hx41'),'hGeYG':_0x52dfec(0x255,'7GVB'),'xSXKQ':_0x52dfec(0x22f,'YM&L'),'XcfBo':function(_0x2fc10a,_0x40159b){return _0x2fc10a==_0x40159b;},'KrHBT':_0x52dfec(0x249,'bcEk'),'bzhBw':function(_0x511b38){return _0x511b38();},'AAAkh':function(_0x25b13a){return _0x25b13a();},'VtRfp':_0x52dfec(0x137,'HxRB'),'Zlcrp':_0x52dfec(0x19f,'1#Fg'),'eBwFy':_0x52dfec(0x3cc,'7GVB'),'DYmhb':_0x52dfec(0x182,'a0ZQ'),'mFDdS':_0x52dfec(0x2a8,'^WTR'),'CDapS':_0x52dfec(0x190,'N@Ws'),'mxOhd':_0x52dfec(0x29b,'4NbS'),'mqxwO':_0x52dfec(0x104,'cdm)'),'MPOVl':_0x52dfec(0x13f,'g9ca'),'AHVLb':_0x52dfec(0x387,'nEut'),'HuQAC':_0x52dfec(0x338,'Ch(!'),'YQzYD':_0x52dfec(0x1da,'Sxvo'),'bBkCy':_0x52dfec(0x265,'RWtU'),'NnTIC':_0x52dfec(0x186,'34Ev'),'TGkLf':_0x52dfec(0x153,'Z4@$'),'avQxf':_0x52dfec(0x402,'0D)F'),'KUaxf':_0x52dfec(0x20d,'Tuf(')};let _0x431b16={'orgFlag':_0x45b38f[_0x52dfec(0x3be,'g9ca')],'callSource':_0x45b38f[_0x52dfec(0x3fe,'X6vt')],'channel':0x1,'isHomewhite':0x1,'bizModelCode':'6','externalLoginType':'1','bizModeClientType':_0x45b38f[_0x52dfec(0x360,'nQNp')],'appId':_0x45b38f[_0x52dfec(0x37f,'LS6d')],'token':_0x45b38f[_0x52dfec(0x3a5,']Xyw')],'tenantCode':_0x45b38f[_0x52dfec(0x326,']ykf')],'uuid':'','client':_0x45b38f[_0x52dfec(0x152,'qaUu')],'sourceType':_0x45b38f[_0x52dfec(0x3d2,'Zd!Y')]},_0x576e66={'appId':_0x45b38f[_0x52dfec(0x166,'bcEk')],'fn':_0x45b38f[_0x52dfec(0x3b0,'Sxvo')],'body':_0x431b16,'apid':_0x45b38f[_0x52dfec(0x280,'BBcE')],'client':_0x45b38f[_0x52dfec(0x390,'*BQ@')],'user':$[_0x52dfec(0x330,'anO@')],'code':0x1,'ua':$['UA']};_0x431b16=await _0x2585f1[_0x52dfec(0x10c,'HxRB')](_0x576e66);let _0xfe1e1={'url':_0x52dfec(0x1ef,'J[U*')+_0x431b16+_0x52dfec(0x257,'X6vt'),'headers':{'Accept':_0x45b38f[_0x52dfec(0x1a4,']ykf')],'accept-encoding':_0x45b38f[_0x52dfec(0x28c,'Z4@$')],'content-type':_0x45b38f[_0x52dfec(0x2f1,'Uvj$')],'referer':_0x45b38f[_0x52dfec(0x179,'nEut')],'Cookie':cookie,'User-Agent':$['UA']},'ciphers':_0x45b38f[_0x52dfec(0x342,'6r^C')]};return new Promise(_0x53c0a2=>{const _0x116c8a=_0x52dfec,_0x187026={'xhPNU':function(_0x291ea4){const _0x529559=_0x2c03;return _0x45b38f[_0x529559(0x29f,'N7*Y')](_0x291ea4);}};$[_0x116c8a(0x14a,'IqsI')](_0xfe1e1,async(_0x3e35a4,_0x1114a3,_0x101527)=>{const _0x1e13eb=_0x116c8a;try{if(_0x3e35a4)console[_0x1e13eb(0x32d,'$J@4')](''+JSON[_0x1e13eb(0x3ae,'Uvj$')](_0x3e35a4)),console[_0x1e13eb(0x119,'Tuf(')](_0x1e13eb(0x1e6,'g9ca'));else{if(_0x101527){if(_0x45b38f[_0x1e13eb(0x2dc,']ykf')](_0x45b38f[_0x1e13eb(0x23a,'Uvj$')],_0x45b38f[_0x1e13eb(0x38c,'g9ca')]))_0x187026[_0x1e13eb(0x2e9,'Ch(!')](_0x54f776);else{_0x101527=JSON[_0x1e13eb(0x178,'IqsI')](_0x101527);if(_0x45b38f[_0x1e13eb(0x24b,'$J@4')](_0x101527[_0x45b38f[_0x1e13eb(0x26c,'Uvj$')]],_0x45b38f[_0x1e13eb(0x3ff,'BBcE')])){$[_0x1e13eb(0x23f,'IqsI')]=![];return;}if(_0x45b38f[_0x1e13eb(0x3af,'g9ca')](_0x101527[_0x1e13eb(0x3a3,'RWtU')],'0')&&_0x101527[_0x1e13eb(0x246,'J[U*')]){const _0x4cc465=_0x45b38f[_0x1e13eb(0x1cf,'XE*m')][_0x1e13eb(0x24f,'a0ZQ')]('|');let _0x37599b=0x0;while(!![]){switch(_0x4cc465[_0x37599b++]){case'0':$[_0x1e13eb(0x2c7,'nmjL')]=_0x45b38f[_0x1e13eb(0x11f,'nmjL')](_0x101527[_0x1e13eb(0x1b5,'HxRB')]?.[_0x1e13eb(0x189,'nQNp')]?.[_0x1e13eb(0x17b,'7GVB')],0x1);continue;case'1':$[_0x1e13eb(0x2aa,'Zd!Y')]=_0x101527[_0x1e13eb(0x1ac,'*BQ@')]?.[_0x1e13eb(0x2b4,'bcEk')]?.[_0x1e13eb(0x13c,'G(w[')]||'';continue;case'2':$[_0x1e13eb(0x2b2,'nQNp')]=_0x101527[_0x1e13eb(0x3bc,'N@Ws')]?.[_0x1e13eb(0x31e,']ykf')]?.[_0x1e13eb(0x381,'XqXY')]?.[_0x1e13eb(0xfa,'Z4@$')];continue;case'3':$[_0x1e13eb(0x204,'anO@')]=_0x101527[_0x1e13eb(0x162,'Sxvo')]?.[_0x1e13eb(0x1f4,'N@Ws')]?.[_0x1e13eb(0x116,'N@Ws')]||0x0;continue;case'4':$[_0x1e13eb(0x235,'Uvj$')]=$[_0x1e13eb(0x2de,'*BQ@')];continue;}break;}}}}else $[_0x1e13eb(0x3e6,'7GVB')](_0x45b38f[_0x1e13eb(0x3b6,'a(y7')]);}}catch(_0x55377b){$[_0x1e13eb(0x21a,'G(w[')](_0x55377b,_0x1114a3);}finally{_0x45b38f[_0x1e13eb(0x27c,'X6vt')](_0x53c0a2);}});});}async function _0x384409(){const _0xf0b8d0=_0x530410,_0x2d93d4={'xWTUh':function(_0xf047cd,_0x59bbe4){return _0xf047cd(_0x59bbe4);},'FcMTD':function(_0x504983,_0x322398){return _0x504983!==_0x322398;},'zcqdc':_0xf0b8d0(0x276,'*BQ@'),'tMLGK':_0xf0b8d0(0x2d3,'BBcE'),'ArZtU':function(_0x1bb7ce,_0x5aa1b2){return _0x1bb7ce===_0x5aa1b2;},'kmSBA':_0xf0b8d0(0x2ea,'h3Ol'),'eABSj':_0xf0b8d0(0x201,'Hx41'),'ZvfMx':_0xf0b8d0(0x3e0,'g9ca'),'LUtYN':_0xf0b8d0(0x19c,'8Vb6'),'luvdR':_0xf0b8d0(0x1a2,'*BQ@'),'kOWSO':_0xf0b8d0(0x294,'N@Ws'),'pOHXN':function(_0x5df051){return _0x5df051();},'SXrDI':_0xf0b8d0(0x23c,'xwm2'),'pBtjr':_0xf0b8d0(0x323,'nmjL')};let _0x3be73a={'url':_0xf0b8d0(0x135,'1hY&'),'body':_0xf0b8d0(0x13d,'X6vt')+Date[_0xf0b8d0(0x105,'Tuf(')]()+_0xf0b8d0(0x33e,'$J@4'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Origin':_0x2d93d4[_0xf0b8d0(0x1f3,'8Vb6')],'Referer':_0x2d93d4[_0xf0b8d0(0x3c4,'8Vb6')]}};return new Promise(_0x207225=>{const _0x17cfe6=_0xf0b8d0,_0x5537ef={'RjiEQ':function(_0x1451ac,_0x46ae75){const _0x631a06=_0x2c03;return _0x2d93d4[_0x631a06(0x2a4,'HxRB')](_0x1451ac,_0x46ae75);},'CRWdT':function(_0xbf1900,_0x322732){const _0x14980d=_0x2c03;return _0x2d93d4[_0x14980d(0x245,'g9ca')](_0xbf1900,_0x322732);},'xFKZt':_0x2d93d4[_0x17cfe6(0x200,'1hY&')],'peiJi':_0x2d93d4[_0x17cfe6(0x16f,'nEut')],'yQhOr':function(_0x2a8a39,_0x5398e2){const _0x597f12=_0x17cfe6;return _0x2d93d4[_0x597f12(0x36e,'X$x[')](_0x2a8a39,_0x5398e2);},'PtRRQ':_0x2d93d4[_0x17cfe6(0x1b1,'$J@4')],'CxYvB':_0x2d93d4[_0x17cfe6(0x2b5,'XE*m')],'jXUqu':_0x2d93d4[_0x17cfe6(0x1fd,'X$x[')],'QfuAF':_0x2d93d4[_0x17cfe6(0x375,'N7*Y')],'rMUSR':_0x2d93d4[_0x17cfe6(0x234,'Sxvo')],'QyUZZ':_0x2d93d4[_0x17cfe6(0x133,'6r^C')],'ywkKh':function(_0x5ad911){const _0x4a09f0=_0x17cfe6;return _0x2d93d4[_0x4a09f0(0x3bf,'Uvj$')](_0x5ad911);}};$[_0x17cfe6(0x2ca,'4NbS')](_0x3be73a,async(_0x34f5db,_0x3a4c2d,_0x58e622)=>{const _0x5e7504=_0x17cfe6;if(_0x5537ef[_0x5e7504(0xf4,'nQNp')](_0x5537ef[_0x5e7504(0x239,'0D)F')],_0x5537ef[_0x5e7504(0x131,'Hx41')]))try{if(_0x34f5db)console[_0x5e7504(0x160,'N7*Y')](''+JSON[_0x5e7504(0x3d9,'bcEk')](_0x34f5db)),console[_0x5e7504(0x350,'*BQ@')](_0x5e7504(0xea,'$J@4'));else{if(_0x5537ef[_0x5e7504(0x3c2,'IqsI')](_0x5537ef[_0x5e7504(0x1a8,'xwm2')],_0x5537ef[_0x5e7504(0x382,'Hx41')])){const _0x104bf2=_0x5be849[_0x5e7504(0x28f,'X6vt')](_0x31bf85,arguments);return _0x2332f8=null,_0x104bf2;}else $[_0x5e7504(0x366,'1hY&')]=_0x58e622[_0x5e7504(0x2d7,'Uvj$')](/"score":(\d+)/)?_0x58e622[_0x5e7504(0x282,'bcEk')](/"score":(\d+)/)[0x1]:0x0,$[_0x5e7504(0x39b,'7GVB')]=_0x58e622[_0x5e7504(0x3e1,'Zd!Y')](/"currentBeanNum":(\d+)/)?_0x58e622[_0x5e7504(0x13e,'X6vt')](/"currentBeanNum":(\d+)/)[0x1]:0x0,$[_0x5e7504(0xe8,'4NbS')]=_0x58e622[_0x5e7504(0x1a7,'a(y7')](/"showName":"(.*?)"/)?_0x58e622[_0x5e7504(0x139,'G(w[')](/"showName":"(.*?)"/)[0x1]:$[_0x5e7504(0x3a4,'T*!c')];}}catch(_0x31ae7a){_0x5537ef[_0x5e7504(0x1a9,'N@Ws')](_0x5537ef[_0x5e7504(0x134,'XqXY')],_0x5537ef[_0x5e7504(0x2eb,'*BQ@')])?(_0x1f1303[_0x5e7504(0x278,'g9ca')]=_0x1273e2[_0x5e7504(0x126,'BBcE')][_0x5e7504(0x281,'Uvj$')][_0x5e7504(0x12a,'Z4@$')],_0xce6279[_0x5e7504(0x19e,'Hx41')]=_0x5d7fa7[_0x5e7504(0x218,'X$x[')][_0x5e7504(0x26d,'4NbS')][_0x5e7504(0x31b,'$J@4')],_0x460f17[_0x5e7504(0x202,'BBcE')]=_0x532b9e[_0x5e7504(0x37d,'Hx41')][_0x5e7504(0x1ab,'nmjL')][_0x5e7504(0x3b9,'X6vt')],_0x17256e[_0x5e7504(0x2c5,'YM&L')]=_0x2799aa[_0x5e7504(0x392,'nmjL')][_0x5e7504(0x3bb,'a(y7')][_0x5e7504(0x3ef,'BBcE')]):$[_0x5e7504(0x2d0,'nEut')](_0x31ae7a,_0x3a4c2d);}finally{_0x5537ef[_0x5e7504(0x20a,'bawD')](_0x5537ef[_0x5e7504(0x301,'J[U*')],_0x5537ef[_0x5e7504(0x1ec,'nmjL')])?_0x235c5d[_0x5e7504(0x159,'0D)F')](_0x3c949a,_0x118d99):_0x5537ef[_0x5e7504(0x285,'g9ca')](_0x207225);}else _0x5537ef[_0x5e7504(0x271,'Z4@$')](_0x478e79,_0x2f3b18);});});}async function queryScores(){const _0x32a297=_0x530410,_0x16d588={'tAYDO':function(_0x30494b,_0x336787){return _0x30494b!==_0x336787;},'HVJqV':_0x32a297(0x386,'Z4@$'),'lUZip':_0x32a297(0x1d7,'qaUu'),'wSNHA':_0x32a297(0x3f8,'nQNp'),'oVCfh':_0x32a297(0x2cf,'qIg$'),'VVtlh':function(_0x1212f6,_0x1f914a){return _0x1212f6==_0x1f914a;},'xZwlv':function(_0x4343af,_0x66e943){return _0x4343af!==_0x66e943;},'NrHIG':_0x32a297(0x369,']ykf'),'DJbmP':_0x32a297(0x2a7,'$J@4'),'DmchN':function(_0x47047e){return _0x47047e();},'moOse':function(_0x215a48,_0x23916d){return _0x215a48!==_0x23916d;},'bToyH':_0x32a297(0x376,'Z4@$'),'bfVeG':_0x32a297(0x2f5,'N7*Y'),'fOrXH':_0x32a297(0x155,'N@Ws'),'fvktr':_0x32a297(0x20e,'anO@'),'qyfJR':_0x32a297(0x147,'XE*m'),'wEMvc':_0x32a297(0x214,'4NbS')};let _0x5468cf='',_0x5d70b2={'appId':_0x16d588[_0x32a297(0x19b,'qIg$')],'functionId':_0x16d588[_0x32a297(0x193,'Tuf(')],'body':{},'appid':_0x16d588[_0x32a297(0x3cb,'^WTR')],'user':$[_0x32a297(0x127,']ykf')],'code':0x0,'ua':$['UA']};body=await _0x2fed9c[_0x32a297(0x269,'qaUu')](_0x5d70b2);let _0x330ba0={'url':_0x32a297(0x30b,'nmjL')+body+_0x32a297(0x242,'RWtU'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Referer':_0x16d588[_0x32a297(0x37c,'anO@')]}};return new Promise(_0x45c42a=>{const _0x5143c6=_0x32a297,_0x3ce551={'GGINN':function(_0x4e60ce,_0x396973){const _0x57c8ee=_0x2c03;return _0x16d588[_0x57c8ee(0x24c,'J[U*')](_0x4e60ce,_0x396973);},'bcLmd':_0x16d588[_0x5143c6(0xf9,'7GVB')],'gMsxF':_0x16d588[_0x5143c6(0x388,'h3Ol')],'gRXHk':_0x16d588[_0x5143c6(0x3ee,'qIg$')],'TPTnU':_0x16d588[_0x5143c6(0x195,'7GVB')],'HWvYv':function(_0x40a16f,_0x2f2206){const _0x2633f8=_0x5143c6;return _0x16d588[_0x2633f8(0x1b2,'a0ZQ')](_0x40a16f,_0x2f2206);},'HfeOH':function(_0x555c6c,_0x527e20){const _0x4d390a=_0x5143c6;return _0x16d588[_0x4d390a(0x2bc,'nQNp')](_0x555c6c,_0x527e20);},'CJFnj':_0x16d588[_0x5143c6(0x34c,'J[U*')],'NYWXR':_0x16d588[_0x5143c6(0x174,'X6vt')],'Nxxyo':function(_0x41bcec){const _0x4dab49=_0x5143c6;return _0x16d588[_0x4dab49(0x209,'X6vt')](_0x41bcec);}};if(_0x16d588[_0x5143c6(0x163,'^WTR')](_0x16d588[_0x5143c6(0x1c3,'YM&L')],_0x16d588[_0x5143c6(0x1cd,'XE*m')]))$[_0x5143c6(0x3da,'IqsI')](_0x330ba0,async(_0x5e917d,_0x5560a4,_0x10b645)=>{const _0x4644ee=_0x5143c6;if(_0x3ce551[_0x4644ee(0x22e,'nQNp')](_0x3ce551[_0x4644ee(0x33c,'9qIg')],_0x3ce551[_0x4644ee(0x2b0,'9qIg')]))try{if(_0x3ce551[_0x4644ee(0x329,'cdm)')](_0x3ce551[_0x4644ee(0x236,'34Ev')],_0x3ce551[_0x4644ee(0x129,'$J@4')])){const _0x325d1d=JSON[_0x4644ee(0x21d,'X6vt')](_0x10b645);_0x3ce551[_0x4644ee(0x2e0,'$J@4')](_0x325d1d[_0x4644ee(0x28a,'Ch(!')],0x3e8)&&($[_0x4644ee(0x359,'g9ca')]=_0x325d1d['rs'][_0x4644ee(0x404,'anO@')][_0x4644ee(0x3e4,'XE*m')]);}else _0x98b19e[_0x4644ee(0x1d2,'qIg$')](_0x4644ee(0x11a,'anO@')),_0x273f50[_0x4644ee(0x211,'a0ZQ')](_0x385b11);}catch(_0x277c08){_0x3ce551[_0x4644ee(0x27a,'Uvj$')](_0x3ce551[_0x4644ee(0x3c7,'a(y7')],_0x3ce551[_0x4644ee(0x2e7,'0D)F')])?$[_0x4644ee(0x21b,'YM&L')](_0x277c08,_0x5560a4):(_0x5d6715[_0x4644ee(0x2a3,'X$x[')]=_0x908635[_0x4644ee(0x30e,'bawD')](/"score":(\d+)/)?_0x301091[_0x4644ee(0x282,'bcEk')](/"score":(\d+)/)[0x1]:0x0,_0x469ba8[_0x4644ee(0x3f0,'g9ca')]=_0x3d67cf[_0x4644ee(0x3c9,'Hx41')](/"currentBeanNum":(\d+)/)?_0x7007e4[_0x4644ee(0x1f9,'X$x[')](/"currentBeanNum":(\d+)/)[0x1]:0x0,_0x5ea33f[_0x4644ee(0x3c1,'qaUu')]=_0x1b31ec[_0x4644ee(0x18b,'BBcE')](/"showName":"(.*?)"/)?_0x5de2df[_0x4644ee(0x1fb,'$J@4')](/"showName":"(.*?)"/)[0x1]:_0x2096ae[_0x4644ee(0x2d9,'bawD')]);}finally{_0x3ce551[_0x4644ee(0x2fd,'7GVB')](_0x45c42a);}else _0x6dc194[_0x4644ee(0x3e9,'HxRB')]=_0x3e6e89[_0x4644ee(0x3bc,'N@Ws')][_0x4644ee(0x250,'^WTR')][_0x4644ee(0x372,'Uvj$')][0x0][_0x4644ee(0x150,'9qIg')]||0x0,_0x2fd1a6[_0x4644ee(0x259,'X6vt')]=_0x3da4ce[_0x4644ee(0x1b5,'HxRB')][_0x4644ee(0x118,'bcEk')][_0x4644ee(0x22c,'bawD')][0x0][_0x4644ee(0x33a,'1#Fg')]||0x0;});else{if(_0x441d03){const _0x1346b4=_0x46197e[_0x5143c6(0x184,'6r^C')](_0x2b473e,arguments);return _0x3aee94=null,_0x1346b4;}}});}async function fruitinfo(){const _0x2621c1=_0x530410,_0x5d3ce7={'SGHDk':function(_0x1a7382,_0x495b81){return _0x1a7382==_0x495b81;},'EARmO':function(_0xd71b15,_0x2c014f){return _0xd71b15>_0x2c014f;},'zlBOY':_0x2621c1(0x274,'34Ev'),'MzhgF':_0x2621c1(0xfb,'h3Ol'),'UfaYC':function(_0x5ece6c,_0x84a784){return _0x5ece6c(_0x84a784);},'SoXeF':function(_0x5efe04,_0x156a20){return _0x5efe04!==_0x156a20;},'YQOcV':_0x2621c1(0x2d4,'4NbS'),'igBhl':_0x2621c1(0x400,'*BQ@'),'qtnDM':_0x2621c1(0x266,'N7*Y'),'zlXjM':_0x2621c1(0x16d,'Z4@$'),'IMrEs':function(_0x2bf7fd,_0x3ba99f){return _0x2bf7fd===_0x3ba99f;},'XxogV':_0x2621c1(0x2b8,'a0ZQ'),'FMntt':_0x2621c1(0x29a,'Tuf('),'RvQlJ':function(_0x1f2891){return _0x1f2891();},'vefEX':function(_0x38aa79,_0x30461c){return _0x38aa79(_0x30461c);},'NCJuW':_0x2621c1(0x10f,'nmjL'),'fbebs':_0x2621c1(0x21f,'1#Fg'),'TqoEw':_0x2621c1(0x1af,'XqXY'),'QWivj':_0x2621c1(0x1eb,'Tuf('),'avNPb':_0x2621c1(0x1b0,'qIg$'),'CFxYa':_0x2621c1(0x358,'bcEk')};return new Promise(_0xb0ba7d=>{const _0x11748b=_0x2621c1,_0x35c7ec={'url':_0x11748b(0x32e,'Hx41'),'body':_0x11748b(0x221,'^WTR')+_0x5d3ce7[_0x11748b(0x1c5,'BBcE')](encodeURIComponent,JSON[_0x11748b(0x187,'4NbS')]({'version':0x18,'channel':0x1,'babelChannel':_0x5d3ce7[_0x11748b(0x10a,'h3Ol')],'lat':'0','lng':'0'}))+_0x11748b(0x384,'Sxvo'),'headers':{'accept':_0x5d3ce7[_0x11748b(0x1d8,'anO@')],'accept-encoding':_0x5d3ce7[_0x11748b(0x142,'0D)F')],'accept-language':_0x5d3ce7[_0x11748b(0x30f,']ykf')],'cookie':cookie,'origin':_0x5d3ce7[_0x11748b(0x1cc,'IqsI')],'referer':_0x5d3ce7[_0x11748b(0x2fe,'a(y7')],'User-Agent':$['UA'],'Content-Type':_0x5d3ce7[_0x11748b(0x36d,'N@Ws')]},'timeout':0x2710};$[_0x11748b(0x393,'a(y7')](_0x35c7ec,(_0x340f4c,_0xfa0964,_0x2cba30)=>{const _0x1d8d54=_0x11748b,_0x243936={'mHYWg':function(_0x271d3e,_0x1dd9ea){const _0x219176=_0x2c03;return _0x5d3ce7[_0x219176(0x222,'cdm)')](_0x271d3e,_0x1dd9ea);},'eLeeR':function(_0x1e7129,_0x5405b8){const _0x1ecbb1=_0x2c03;return _0x5d3ce7[_0x1ecbb1(0x380,'LS6d')](_0x1e7129,_0x5405b8);},'IPibc':_0x5d3ce7[_0x1d8d54(0x365,'34Ev')]};try{if(_0x340f4c)!llgeterror&&(console[_0x1d8d54(0x1f6,'N@Ws')](_0x5d3ce7[_0x1d8d54(0x14e,'cdm)')]),console[_0x1d8d54(0x10b,'cdm)')](JSON[_0x1d8d54(0x217,'T*!c')](_0x340f4c))),llgeterror=!![];else{llgeterror=![];if(_0x5d3ce7[_0x1d8d54(0x18f,'anO@')](safeGet,_0x2cba30)){$[_0x1d8d54(0x27e,'$J@4')]=JSON[_0x1d8d54(0x3ac,'qIg$')](_0x2cba30);if($[_0x1d8d54(0x22a,'N7*Y')][_0x1d8d54(0x277,'XqXY')]){if(_0x5d3ce7[_0x1d8d54(0x1ea,'Ch(!')](_0x5d3ce7[_0x1d8d54(0x3c6,'1#Fg')],_0x5d3ce7[_0x1d8d54(0x10d,'nEut')]))$[_0x1d8d54(0x278,'g9ca')]=$[_0x1d8d54(0x2f3,'YM&L')][_0x1d8d54(0x2cb,'6r^C')][_0x1d8d54(0x23e,'XqXY')],$[_0x1d8d54(0x2c8,'Z4@$')]=$[_0x1d8d54(0x3dc,'nEut')][_0x1d8d54(0x1e2,'cdm)')][_0x1d8d54(0x289,'nmjL')],$[_0x1d8d54(0x15c,'a0ZQ')]=$[_0x1d8d54(0x27f,'X6vt')][_0x1d8d54(0x1ab,'nmjL')][_0x1d8d54(0x2a5,'0D)F')],$[_0x1d8d54(0x25c,'1hY&')]=$[_0x1d8d54(0x173,'g9ca')][_0x1d8d54(0x347,'xwm2')][_0x1d8d54(0x11b,'IqsI')];else{_0x21b5c9=_0x2c5a2c[_0x1d8d54(0x212,'XE*m')](_0x28c672);if(_0x243936[_0x1d8d54(0x20f,'a0ZQ')](_0x39ca3d[_0x1d8d54(0x370,'6r^C')],0x0))_0x2d5d30[_0x1d8d54(0x35d,'a(y7')]=_0x5ad6dc[_0x1d8d54(0x1aa,'Ch(!')][_0x1d8d54(0x31a,'HxRB')]+'个',_0x243936[_0x1d8d54(0x2f7,'qaUu')](_0x10e538[_0x1d8d54(0x38a,']Xyw')][_0x1d8d54(0x36c,'cdm)')],0x7530)&&(_0x5de882[_0x1d8d54(0x39d,'Ch(!')]+=_0x1d8d54(0x1f2,'Zd!Y'));else{}}}}}}catch(_0x4c5229){_0x5d3ce7[_0x1d8d54(0x320,'LS6d')](_0x5d3ce7[_0x1d8d54(0x3f1,'N@Ws')],_0x5d3ce7[_0x1d8d54(0x283,'h3Ol')])?$[_0x1d8d54(0x3c5,'bcEk')](_0x4c5229,_0xfa0964):_0x3051cd[_0x1d8d54(0x262,'a0ZQ')]=_0x4aa8e3['rs'][_0x1d8d54(0x3b7,'qaUu')][_0x1d8d54(0x361,'^WTR')];}finally{_0x5d3ce7[_0x1d8d54(0xf2,'^WTR')](_0x5d3ce7[_0x1d8d54(0x110,'xwm2')],_0x5d3ce7[_0x1d8d54(0x2ad,'bawD')])?_0x5bbdcc?(_0x57e759=_0xafd62[_0x1d8d54(0x3eb,'9qIg')](_0x558b06),_0x35f2ff[_0x1d8d54(0x300,'^WTR')]&&(_0x5ee43b[_0x1d8d54(0x324,'nQNp')]=_0x3ecbec[_0x1d8d54(0x111,'T*!c')][_0x1d8d54(0x3f5,'qIg$')]||0x0)):_0xab7a65[_0x1d8d54(0x119,'Tuf(')](_0x243936[_0x1d8d54(0x275,'4NbS')]):_0x5d3ce7[_0x1d8d54(0x1f5,'^WTR')](_0xb0ba7d);}});});}async function fruitnew(_0x5c880b=0x1f4){const _0x68735b=_0x530410,_0x5a3c7f={'WaqvQ':function(_0x30806e){return _0x30806e();},'FMKpp':function(_0x4acb25){return _0x4acb25();},'jkfgp':function(_0x1f6e69,_0x65a964){return _0x1f6e69!==_0x65a964;},'XIdbx':_0x68735b(0x313,'XE*m'),'JOQgM':_0x68735b(0x3a9,'X$x['),'LAjmY':_0x68735b(0x2da,'1hY&'),'GrWLL':function(_0x2a9d95,_0x5ec225){return _0x2a9d95===_0x5ec225;},'lQfEx':_0x68735b(0x270,'T*!c'),'dcnYV':_0x68735b(0x25d,'$J@4'),'dpgix':_0x68735b(0x2c4,']Xyw'),'GqQsr':function(_0x58c5c6,_0x33a58f){return _0x58c5c6(_0x33a58f);},'DrLDB':function(_0x2e725a,_0x41d7bb){return _0x2e725a===_0x41d7bb;},'LSQbH':_0x68735b(0x36b,'qIg$'),'hvMvx':_0x68735b(0x356,'IqsI'),'tHKxi':_0x68735b(0x18d,'G(w['),'HpvIV':function(_0x5e0856,_0x43eb46,_0x373cbe){return _0x5e0856(_0x43eb46,_0x373cbe);},'EEKzk':_0x68735b(0x2f9,'^WTR'),'dbgWD':_0x68735b(0x335,'X6vt'),'XaTeY':_0x68735b(0x3df,'xwm2'),'SSVAr':_0x68735b(0x1bf,'nEut'),'tewjP':_0x68735b(0x3cd,'XqXY'),'WBmZt':_0x68735b(0x2ab,'LS6d'),'EVlHj':_0x68735b(0x123,'Sxvo'),'LJlNy':_0x68735b(0xf8,'IqsI'),'KZQWi':_0x68735b(0x2a1,'8Vb6'),'EoRpX':_0x68735b(0x19a,'a0ZQ')};let _0x1ecc42={'version':0x1},_0x8c2b16={'appId':_0x5a3c7f[_0x68735b(0x315,'N7*Y')],'fn':_0x5a3c7f[_0x68735b(0x24a,'IqsI')],'body':_0x1ecc42,'apid':_0x5a3c7f[_0x68735b(0x32f,'J[U*')],'ver':$['UA'][_0x68735b(0x268,'nmjL')](';')[0x2],'cl':_0x5a3c7f[_0x68735b(0x2ae,'1#Fg')],'user':$[_0x68735b(0x286,'a(y7')],'code':0x1,'ua':$['UA']};_0x1ecc42=await _0x2585f1[_0x68735b(0x1a0,'^WTR')](_0x8c2b16);let _0x1ef9aa={'url':JD_API_HOST+'?'+_0x1ecc42,'headers':{'Host':_0x5a3c7f[_0x68735b(0x37b,'qaUu')],'Accept':_0x5a3c7f[_0x68735b(0x1f1,'anO@')],'Origin':_0x5a3c7f[_0x68735b(0x311,'G(w[')],'Accept-Encoding':_0x5a3c7f[_0x68735b(0x394,'Hx41')],'User-Agent':$['UA'],'Accept-Language':_0x5a3c7f[_0x68735b(0x38e,'1hY&')],'Referer':_0x5a3c7f[_0x68735b(0x391,'Zd!Y')],'Cookie':cookie},'timeout':0x7530};return new Promise(_0x4f6a06=>{const _0x3f5cbb=_0x68735b;_0x5a3c7f[_0x3f5cbb(0x373,'Tuf(')](_0x5a3c7f[_0x3f5cbb(0x141,'nQNp')],_0x5a3c7f[_0x3f5cbb(0x303,'cdm)')])?_0x5a3c7f[_0x3f5cbb(0x3a1,'g9ca')](setTimeout,()=>{const _0x55d878=_0x3f5cbb,_0x2f8d3d={'Ttaxh':function(_0x5d4bb6){const _0x5be243=_0x2c03;return _0x5a3c7f[_0x5be243(0x2df,'34Ev')](_0x5d4bb6);},'mBBsW':function(_0x141db7){const _0x25bba2=_0x2c03;return _0x5a3c7f[_0x25bba2(0x297,']Xyw')](_0x141db7);},'EhVra':function(_0x42b0d2,_0x11d540){const _0x9955dc=_0x2c03;return _0x5a3c7f[_0x9955dc(0x17c,'N@Ws')](_0x42b0d2,_0x11d540);},'rDttK':_0x5a3c7f[_0x55d878(0x11d,'qIg$')],'MpjZa':_0x5a3c7f[_0x55d878(0x37a,'XE*m')],'dauSF':_0x5a3c7f[_0x55d878(0x1ad,'XqXY')],'zBelk':function(_0x3126ca,_0x2fb7d3){const _0x17dcc5=_0x55d878;return _0x5a3c7f[_0x17dcc5(0x17a,'0D)F')](_0x3126ca,_0x2fb7d3);},'rNvHt':_0x5a3c7f[_0x55d878(0x25b,'a(y7')],'EeOMu':_0x5a3c7f[_0x55d878(0x243,'a0ZQ')],'Yijhj':_0x5a3c7f[_0x55d878(0x1e9,'anO@')],'nKEwZ':function(_0x495044,_0x384f33){const _0x84afce=_0x55d878;return _0x5a3c7f[_0x84afce(0x165,'bcEk')](_0x495044,_0x384f33);}};_0x5a3c7f[_0x55d878(0x258,'9qIg')](_0x5a3c7f[_0x55d878(0x210,'X6vt')],_0x5a3c7f[_0x55d878(0x28d,'G(w[')])?$[_0x55d878(0xf3,'XqXY')](_0x1ef9aa,(_0x6be015,_0x3b4341,_0x3b30f5)=>{const _0xf43a80=_0x55d878,_0x19b962={'KENib':function(_0x658874){const _0x402794=_0x2c03;return _0x2f8d3d[_0x402794(0x28e,'XqXY')](_0x658874);}};if(_0x2f8d3d[_0xf43a80(0x251,'8Vb6')](_0x2f8d3d[_0xf43a80(0x109,'^WTR')],_0x2f8d3d[_0xf43a80(0x389,'qaUu')]))_0x19b962[_0xf43a80(0x103,'nmjL')](_0x5dbbbf);else try{_0x2f8d3d[_0xf43a80(0x1fc,'34Ev')](_0x2f8d3d[_0xf43a80(0x2e8,'7GVB')],_0x2f8d3d[_0xf43a80(0x208,'HxRB')])?_0x6be015?_0x2f8d3d[_0xf43a80(0x1c4,'LS6d')](_0x2f8d3d[_0xf43a80(0x2cd,'RWtU')],_0x2f8d3d[_0xf43a80(0x24d,'J[U*')])?_0x2f8d3d[_0xf43a80(0x367,'Zd!Y')](_0x559152):(console[_0xf43a80(0x39f,'6r^C')](_0xf43a80(0x32a,'^WTR')),$[_0xf43a80(0x1a5,'6r^C')](_0x6be015)):(_0x3b30f5=JSON[_0xf43a80(0x2e4,'nEut')](_0x3b30f5),$[_0xf43a80(0x2c1,'Zd!Y')]=_0x3b30f5[_0xf43a80(0x2ce,'G(w[')]?.[_0xf43a80(0x3f3,'N7*Y')]||''):_0x36c439[_0xf43a80(0x395,'BBcE')](_0x3b2e5e,_0x37c70b);}catch(_0x4accd6){_0x2f8d3d[_0xf43a80(0x1d4,'X6vt')](_0x2f8d3d[_0xf43a80(0x1bb,'qaUu')],_0x2f8d3d[_0xf43a80(0x26a,'anO@')])?_0x524e5d[_0xf43a80(0x3b8,'Ch(!')](_0x1b080d,_0x172aa5):$[_0xf43a80(0x3c8,'LS6d')](_0x4accd6,_0x3b4341);}finally{_0x2f8d3d[_0xf43a80(0x11c,'6r^C')](_0x4f6a06,_0x3b30f5);}}):(_0x351a68[_0x55d878(0x3d5,'^WTR')]=_0x169464[_0x55d878(0x1d9,'HxRB')](_0x2e3236),_0x59101e[_0x55d878(0x1df,'*BQ@')][_0x55d878(0x355,'9qIg')]&&(_0x2a9ac3[_0x55d878(0x3d7,'Zd!Y')]=_0x505b8d[_0x55d878(0x22a,'N7*Y')][_0x55d878(0x316,'X$x[')][_0x55d878(0x2ef,'6r^C')],_0x5b9a46[_0x55d878(0x1e5,'XqXY')]=_0x46011b[_0x55d878(0x2c0,'Tuf(')][_0x55d878(0x355,'9qIg')][_0x55d878(0x3db,'X$x[')],_0x20a96c[_0x55d878(0x27d,'X6vt')]=_0x8e9e2f[_0x55d878(0x158,'Sxvo')][_0x55d878(0x112,'bawD')][_0x55d878(0x22d,'8Vb6')],_0x417011[_0x55d878(0x3fa,'XqXY')]=_0x2fb11f[_0x55d878(0x3d5,'^WTR')][_0x55d878(0x332,'0D)F')][_0x55d878(0x3bd,'nEut')]));},_0x5c880b):_0x586b24[_0x3f5cbb(0x30a,'Z4@$')](_0x16eff9,_0x1e8ef2);});}async function checkplus(){const _0x593db4=_0x530410,_0x3ca057={'fHjwD':_0x593db4(0x379,'qaUu'),'fcXgw':function(_0x41a031,_0x200aee){return _0x41a031===_0x200aee;},'vZJqk':_0x593db4(0x263,'RWtU'),'peCzj':function(_0x523796,_0x4865e3){return _0x523796==_0x4865e3;},'FwnVW':function(_0x19e667,_0x4a015d){return _0x19e667!==_0x4a015d;},'SVJJi':_0x593db4(0x107,'X$x['),'KXTaE':function(_0x5ca2b1,_0x1144d8){return _0x5ca2b1!==_0x1144d8;},'XSYNL':_0x593db4(0x2d6,'xwm2'),'lHotM':_0x593db4(0x25f,'a0ZQ'),'nXqIM':function(_0x1de3aa){return _0x1de3aa();},'GYTao':_0x593db4(0x3b4,'qIg$'),'zeJNy':_0x593db4(0x2d2,'g9ca'),'FtNuk':_0x593db4(0x29c,'a0ZQ'),'jjyzA':_0x593db4(0x15d,'Ch(!'),'uBWia':_0x593db4(0x2dd,'RWtU'),'ggBVH':_0x593db4(0x288,'Z4@$'),'emUwi':_0x593db4(0x147,'XE*m'),'IkzCS':_0x593db4(0x1ae,'qaUu'),'wEBgi':_0x593db4(0x1d0,'bcEk')};let _0x2fe319={'contentType':_0x3ca057[_0x593db4(0x31c,'cdm)')],'qids':_0x3ca057[_0x593db4(0x227,'YM&L')],'checkLevel':0x1},_0x33fe5e={'appId':_0x3ca057[_0x593db4(0x2b9,'qIg$')],'functionId':_0x3ca057[_0x593db4(0x1e3,'7GVB')],'body':_0x2fe319,'appid':_0x3ca057[_0x593db4(0x3ad,'YM&L')],'user':$[_0x593db4(0x286,'a(y7')],'code':0x1,'ua':$['UA']};_0x2fe319=await _0x2fed9c[_0x593db4(0x1b9,'Zd!Y')](_0x33fe5e);let _0x407903={'url':_0x593db4(0x224,'X6vt'),'body':_0x2fe319,'headers':{'User-Agent':$['UA'],'Cookie':cookie,'Origin':_0x3ca057[_0x593db4(0x23d,'1#Fg')],'Referer':_0x3ca057[_0x593db4(0x1ce,'cdm)')]}};return new Promise(async _0x1ea4e8=>{const _0x3cb7e7=_0x593db4,_0x59f5b2={'xUbko':_0x3ca057[_0x3cb7e7(0x3ca,'YM&L')],'daufD':function(_0x4163b7,_0xb67350){const _0x2721d9=_0x3cb7e7;return _0x3ca057[_0x2721d9(0x34b,'Ch(!')](_0x4163b7,_0xb67350);},'WVggP':_0x3ca057[_0x3cb7e7(0x114,'J[U*')]};$[_0x3cb7e7(0x15e,'qaUu')](_0x407903,async(_0xe92c75,_0x53d2b5,_0x294bb9)=>{const _0x2840bd=_0x3cb7e7,_0x59ccb6={'CJkwn':_0x3ca057[_0x2840bd(0x1c7,'BBcE')]};try{if(_0xe92c75)_0x3ca057[_0x2840bd(0x164,'1#Fg')](_0x3ca057[_0x2840bd(0x128,'4NbS')],_0x3ca057[_0x2840bd(0x3d0,'Z4@$')])?(console[_0x2840bd(0x2fb,'h3Ol')](''+JSON[_0x2840bd(0x33b,'7GVB')](_0xe92c75)),console[_0x2840bd(0xf6,'a0ZQ')](_0x2840bd(0x31d,'T*!c'))):_0x168609[_0x2840bd(0x14c,'bcEk')](_0x59ccb6[_0x2840bd(0xfe,'X$x[')]);else{_0x294bb9=JSON[_0x2840bd(0x12e,'*BQ@')](_0x294bb9);if(_0x3ca057[_0x2840bd(0x13b,'9qIg')](_0x294bb9[_0x2840bd(0x32c,'IqsI')],0x1a1b98))$[_0x2840bd(0x3dd,'6r^C')]=_0x294bb9['rs'][_0x2840bd(0x17f,'a0ZQ')][_0x2840bd(0x29e,'Hx41')]?!![]:![];else{}}}catch(_0x31f2c6){if(_0x3ca057[_0x2840bd(0x191,'XqXY')](_0x3ca057[_0x2840bd(0x26b,'6r^C')],_0x3ca057[_0x2840bd(0x2db,'1#Fg')])){const _0x44b5e2=_0x59f5b2[_0x2840bd(0x138,'YM&L')][_0x2840bd(0x10e,'Zd!Y')]('|');let _0x4cc7c1=0x0;while(!![]){switch(_0x44b5e2[_0x4cc7c1++]){case'0':_0x319777[_0x2840bd(0x220,'Z4@$')]=_0x35231b[_0x2840bd(0x2a6,'0D)F')];continue;case'1':_0x425343[_0x2840bd(0x240,'LS6d')]=_0x13d120[_0x2840bd(0x171,'YM&L')]?.[_0x2840bd(0x307,'0D)F')]?.[_0x2840bd(0x302,'9qIg')]||'';continue;case'2':_0x339838[_0x2840bd(0x226,'Sxvo')]=_0x5e517c[_0x2840bd(0x345,']ykf')]?.[_0x2840bd(0x2fc,'a(y7')]?.[_0x2840bd(0x1c6,'bcEk')]?.[_0x2840bd(0x36a,'IqsI')];continue;case'3':_0x4b8de4[_0x2840bd(0x2ed,'Z4@$')]=_0x59f5b2[_0x2840bd(0x156,'RWtU')](_0x1b23fe[_0x2840bd(0x374,'0D)F')]?.[_0x2840bd(0x396,'34Ev')]?.[_0x2840bd(0x2c9,'anO@')],0x1);continue;case'4':_0x1939e5[_0x2840bd(0x12f,'YM&L')]=_0x15b166[_0x2840bd(0x284,'8Vb6')]?.[_0x2840bd(0x309,'LS6d')]?.[_0x2840bd(0x371,'qaUu')]||0x0;continue;}break;}}else $[_0x2840bd(0x1db,'bawD')](_0x31f2c6,_0x53d2b5);}finally{_0x3ca057[_0x2840bd(0x2f0,'qaUu')](_0x3ca057[_0x2840bd(0x19d,'X$x[')],_0x3ca057[_0x2840bd(0x172,'J[U*')])?_0x3ca057[_0x2840bd(0x39e,'anO@')](_0x1ea4e8):_0x2f5cd4[_0x2840bd(0x10b,'cdm)')](_0x59f5b2[_0x2840bd(0x383,'cdm)')]);}});});}function wb_info(){const _0xac0645=_0x530410,_0x4bdce0={'yDaPw':function(_0x3ea18d,_0x5d49b8){return _0x3ea18d===_0x5d49b8;},'Selya':_0xac0645(0x2a2,'h3Ol'),'mfdun':_0xac0645(0x1d5,'bawD'),'KjeDj':function(_0x374f72,_0x143ce1){return _0x374f72===_0x143ce1;},'ZXevu':_0xac0645(0x1b4,'1#Fg'),'LQTIZ':_0xac0645(0x1e1,'a(y7'),'UhOER':function(_0x3d15be){return _0x3d15be();},'nLqBK':_0xac0645(0x1b6,'Zd!Y'),'xQyjE':_0xac0645(0x16b,']Xyw')};return new Promise(async _0x2cfa70=>{const _0x1f8d0d=_0xac0645,_0x3dc900={'CcGHK':_0x4bdce0[_0x1f8d0d(0x207,'34Ev')]},_0x16a2ed={'url':_0x1f8d0d(0x146,'bcEk'),'body':_0x1f8d0d(0x31f,'XqXY')+Date[_0x1f8d0d(0x2e1,'nmjL')](),'headers':{'Cookie':cookie,'content-type':_0x1f8d0d(0x1a1,'Z4@$'),'Origin':_0x1f8d0d(0x1dc,'9qIg'),'Referer':_0x1f8d0d(0x2be,'Ch(!'),'User-Agent':$['UA']},'ciphers':_0x4bdce0[_0x1f8d0d(0x2d1,'a(y7')],'timeout':0x7530};$[_0x1f8d0d(0x3b3,'nmjL')](_0x16a2ed,(_0x8a4c0f,_0x354435,_0x19a607)=>{const _0x3fa3f7=_0x1f8d0d;try{if(_0x8a4c0f)$[_0x3fa3f7(0x3c3,'xwm2')](_0x8a4c0f);else{if(_0x19a607){_0x19a607=$[_0x3fa3f7(0x1b3,']Xyw')](_0x19a607);if(_0x19a607[_0x3fa3f7(0x1c9,'g9ca')])try{if(_0x4bdce0[_0x3fa3f7(0x328,'J[U*')](_0x4bdce0[_0x3fa3f7(0x3ce,'9qIg')],_0x4bdce0[_0x3fa3f7(0x2b3,'Tuf(')])){_0x5f5969[_0x3fa3f7(0x344,'G(w[')]=![];return;}else $[_0x3fa3f7(0x108,'h3Ol')]=_0x19a607[_0x3fa3f7(0x3ea,'nmjL')][_0x3fa3f7(0x35f,'LS6d')][_0x3fa3f7(0x273,']Xyw')][0x0][_0x3fa3f7(0xec,'$J@4')]||0x0,$[_0x3fa3f7(0x1ed,'8Vb6')]=_0x19a607[_0x3fa3f7(0x20c,'a0ZQ')][_0x3fa3f7(0x2e3,'nQNp')][_0x3fa3f7(0x3b2,'qaUu')][0x0][_0x3fa3f7(0x3ba,'*BQ@')]||0x0;}catch{}}else _0x4bdce0[_0x3fa3f7(0x34f,'Z4@$')](_0x4bdce0[_0x3fa3f7(0x3a0,'N7*Y')],_0x4bdce0[_0x3fa3f7(0xfd,'X$x[')])?$[_0x3fa3f7(0x351,'T*!c')](_0x4bdce0[_0x3fa3f7(0x340,'XqXY')]):(!_0x526642&&(_0x33f597[_0x3fa3f7(0x362,'0D)F')](_0x3dc900[_0x3fa3f7(0x336,'LS6d')]),_0x132eb7[_0x3fa3f7(0x3c0,'XqXY')](_0x2b6b43[_0x3fa3f7(0x176,'8Vb6')](_0x1e26fb))),_0x2bffc0=!![]);}}catch(_0x582c76){$[_0x3fa3f7(0x144,'8Vb6')](_0x582c76);}finally{_0x4bdce0[_0x3fa3f7(0x3d3,'G(w[')](_0x2cfa70);}});});}async function sqb(){const _0x3ebf2f=_0x530410,_0x57b8ad={'pcMrL':function(_0x3d2dee,_0x57d9ed){return _0x3d2dee===_0x57d9ed;},'CFwuy':_0x3ebf2f(0x34a,'Sxvo'),'tCXUL':function(_0x28199a,_0x2de6fb){return _0x28199a===_0x2de6fb;},'rRcdH':_0x3ebf2f(0x306,'qIg$'),'ZqCMR':function(_0x233e40,_0x371ce3){return _0x233e40==_0x371ce3;},'zlClY':function(_0x477609,_0x5558b2){return _0x477609>_0x5558b2;},'cgWEs':_0x3ebf2f(0x30d,'*BQ@'),'BwlFV':function(_0x2b246b){return _0x2b246b();},'kZzIJ':_0x3ebf2f(0x3a2,'*BQ@'),'sIlPT':_0x3ebf2f(0x397,'J[U*'),'qiJZo':_0x3ebf2f(0x357,'8Vb6'),'MihOs':_0x3ebf2f(0x101,'Zd!Y'),'ivwDv':_0x3ebf2f(0x157,'BBcE'),'aLATW':_0x3ebf2f(0x206,'*BQ@'),'CrFgT':_0x3ebf2f(0x3cf,'J[U*'),'bCfcB':_0x3ebf2f(0x299,'qIg$'),'SyWbk':_0x3ebf2f(0x215,'nQNp'),'BVQdu':_0x3ebf2f(0x3d1,'4NbS'),'LeyhH':_0x3ebf2f(0x1d3,'$J@4'),'DHmre':_0x3ebf2f(0x1fe,'Ch(!'),'oLTkt':_0x3ebf2f(0xee,'Uvj$'),'ymzfP':_0x3ebf2f(0x337,'LS6d'),'VPYNa':_0x3ebf2f(0xf7,'*BQ@')};let _0x20af66=_0x57b8ad[_0x3ebf2f(0x148,'^WTR')],_0x1f860b={'source':_0x57b8ad[_0x3ebf2f(0x298,'XE*m')]},_0x4e3202={'appId':_0x57b8ad[_0x3ebf2f(0x2a9,'$J@4')],'fn':_0x20af66,'body':_0x1f860b,'apid':_0x57b8ad[_0x3ebf2f(0x291,']ykf')],'ver':_0x57b8ad[_0x3ebf2f(0x312,'bawD')],'cl':_0x57b8ad[_0x3ebf2f(0x1e4,'qIg$')],'user':$[_0x3ebf2f(0x18e,'1#Fg')],'code':0x1,'ua':$['UA']};_0x1f860b=await _0x556d1a[_0x3ebf2f(0x177,'bcEk')](_0x4e3202);if(!_0x1f860b)return;return new Promise(async _0x55312b=>{const _0x51ede=_0x3ebf2f,_0x3efa0b={'url':_0x51ede(0x2ac,'*BQ@'),'body':_0x51ede(0x399,'$J@4')+_0x1f860b,'headers':{'Host':_0x57b8ad[_0x51ede(0x247,'J[U*')],'Referer':_0x57b8ad[_0x51ede(0x354,'7GVB')],'User-Agent':$['UA'],'cookie':cookie,'wqreferer':_0x57b8ad[_0x51ede(0xf1,'34Ev')],'x-rp-client':_0x57b8ad[_0x51ede(0x1c0,'anO@')],'accept-language':_0x57b8ad[_0x51ede(0x341,'bawD')],'Accept-Encoding':_0x57b8ad[_0x51ede(0x321,'9qIg')],'x-referer-page':_0x57b8ad[_0x51ede(0x2c3,'anO@')],'x-referer-package':_0x57b8ad[_0x51ede(0x2af,'Uvj$')],'accept':_0x57b8ad[_0x51ede(0x18a,'BBcE')]}};$[_0x51ede(0x23b,'34Ev')](_0x3efa0b,(_0x398b35,_0x3fe3d7,_0x4cd439)=>{const _0x1d7d96=_0x51ede;if(_0x57b8ad[_0x1d7d96(0x260,'a0ZQ')](_0x57b8ad[_0x1d7d96(0x2bf,'nQNp')],_0x57b8ad[_0x1d7d96(0x11e,'nEut')]))try{if(_0x57b8ad[_0x1d7d96(0x15f,'bawD')](_0x57b8ad[_0x1d7d96(0x121,'xwm2')],_0x57b8ad[_0x1d7d96(0x364,'h3Ol')])){if(_0x398b35)$[_0x1d7d96(0x395,'BBcE')](_0x398b35),console[_0x1d7d96(0x213,'G(w[')](_0x1d7d96(0x22b,'T*!c'));else{_0x4cd439=JSON[_0x1d7d96(0x3ac,'qIg$')](_0x4cd439);if(_0x57b8ad[_0x1d7d96(0x1d1,'IqsI')](_0x4cd439[_0x1d7d96(0x398,'nmjL')],0x0))$[_0x1d7d96(0xfc,'9qIg')]=_0x4cd439[_0x1d7d96(0x1ac,'*BQ@')][_0x1d7d96(0x2d8,'bawD')]+'个',_0x57b8ad[_0x1d7d96(0x2cc,'RWtU')](_0x4cd439[_0x1d7d96(0x30c,'IqsI')][_0x1d7d96(0x304,'BBcE')],0x7530)&&($[_0x1d7d96(0x1ba,'Z4@$')]+=_0x1d7d96(0x2f6,'N@Ws'));else{}}}else _0x1c2dc4[_0x1d7d96(0x223,'^WTR')]=_0x50f077['rs'][_0x1d7d96(0x169,'^WTR')][_0x1d7d96(0x1f7,'1#Fg')]?!![]:![];}catch(_0xbbc3b3){_0x57b8ad[_0x1d7d96(0x314,'h3Ol')](_0x57b8ad[_0x1d7d96(0x1e7,'IqsI')],_0x57b8ad[_0x1d7d96(0xed,'1hY&')])?$[_0x1d7d96(0x197,'XqXY')](_0xbbc3b3):_0x23d15d[_0x1d7d96(0x233,'^WTR')](_0x61b7a8);}finally{_0x57b8ad[_0x1d7d96(0x35b,'h3Ol')](_0x55312b);}else _0xda0a52[_0x1d7d96(0x1a3,'h3Ol')](_0xa5ce91);});});}var version_ = 'jsjiami.com.v7';
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