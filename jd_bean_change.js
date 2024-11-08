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

var _0xodV='jsjiami.com.v7';const _0x4d7d2b=_0x1aec;(function(_0x1c3ddf,_0xfd2fd4,_0x4dfd11,_0x455b04,_0x164a4d,_0x2bf265,_0x186003){return _0x1c3ddf=_0x1c3ddf>>0x3,_0x2bf265='hs',_0x186003='hs',function(_0x12cfc1,_0x3c2ff1,_0xa4963f,_0x51196f,_0x5b9b3a){const _0x1cc08a=_0x1aec;_0x51196f='tfi',_0x2bf265=_0x51196f+_0x2bf265,_0x5b9b3a='up',_0x186003+=_0x5b9b3a,_0x2bf265=_0xa4963f(_0x2bf265),_0x186003=_0xa4963f(_0x186003),_0xa4963f=0x0;const _0x5229f9=_0x12cfc1();while(!![]&&--_0x455b04+_0x3c2ff1){try{_0x51196f=-parseInt(_0x1cc08a(0x3ce,'fhDv'))/0x1*(-parseInt(_0x1cc08a(0x136,'@8@#'))/0x2)+-parseInt(_0x1cc08a(0x183,'wW4]'))/0x3*(parseInt(_0x1cc08a(0x23e,'TSl*'))/0x4)+parseInt(_0x1cc08a(0x336,'%yei'))/0x5+-parseInt(_0x1cc08a(0x356,'Uj*!'))/0x6+parseInt(_0x1cc08a(0x138,']H&!'))/0x7*(-parseInt(_0x1cc08a(0x280,'MFDc'))/0x8)+-parseInt(_0x1cc08a(0x35a,'2Ks]'))/0x9+-parseInt(_0x1cc08a(0x293,'FOZy'))/0xa*(-parseInt(_0x1cc08a(0x3ba,'f7Kx'))/0xb);}catch(_0x5cd615){_0x51196f=_0xa4963f;}finally{_0x5b9b3a=_0x5229f9[_0x2bf265]();if(_0x1c3ddf<=_0x455b04)_0xa4963f?_0x164a4d?_0x51196f=_0x5b9b3a:_0x164a4d=_0x5b9b3a:_0xa4963f=_0x5b9b3a;else{if(_0xa4963f==_0x164a4d['replace'](/[lJAqRGQuDwBbxOUfkSpYy=]/g,'')){if(_0x51196f===_0x3c2ff1){_0x5229f9['un'+_0x2bf265](_0x5b9b3a);break;}_0x5229f9[_0x186003](_0x5b9b3a);}}}}}(_0x4dfd11,_0xfd2fd4,function(_0xe930e7,_0x12000d,_0x359c50,_0x13b645,_0x44f51e,_0x5739ce,_0x1e8341){return _0x12000d='\x73\x70\x6c\x69\x74',_0xe930e7=arguments[0x0],_0xe930e7=_0xe930e7[_0x12000d](''),_0x359c50=`\x72\x65\x76\x65\x72\x73\x65`,_0xe930e7=_0xe930e7[_0x359c50]('\x76'),_0x13b645=`\x6a\x6f\x69\x6e`,(0x18b0ce,_0xe930e7[_0x13b645](''));});}(0x648,0x6b909,_0x117d,0xcb),_0x117d)&&(_0xodV=`\xcd7`);function _0x117d(){const _0x44489c=(function(){return[...[_0xodV,'YkOwjlUsJfjwiapbqmSiUQ.xcDoqyAmG.Bqvu7BR==','W6vQW4RcTCoMDCkE','WRpcLKJcGCo8WPmkWRZcL8oHfmopB1K1WQCivSkNWRuXhmoGe8o/tCo6WRxdSCk3BGvuqSo8W7HAbhxcGmoBkbeLWRhcQSo4re9VW60LW4j1zxZdRSomW6ZcKCo8aSk2gG','W6BdKcnY6kYk5RcU5AsJ6ls377+T6kYl5Qkn5P+757+x6lwh6yAZ6k+f','W6e0W4VdI8oq','u8ovW4b4W6JcHG','q8kDW7VdM0q','W6RcVq7cRSk8W7yrW4ZdKCoBumoMpMvPWO9CbmkqW6v3','5PYX5yQ65zI76l+S5zMd56UH5Pwb5O+P','WRdcR1T5WRHAm3WC','WRyOW5pdUui','W6pdRXNcUSo+','WRv9W5dcPSoaW6eyoq','WPpdUJLWWPi','W6tcRK8','W6NcSvH4WPVcRmoyAvFcLSoEWRNcR8oEW6xdS8kxWQK8W5vJW7FcUWDGDmoTp8kUWRmgWOxcPq','tmoOWORdVY0Rrcf+W4e','xmo7WPVdUW','kSoWWQ/dKq','CSo+WPVdQa0Gzd18W4P4WRW','W6ZOG6RLHAlMJjqnW67LH5pNUP3LJ5S0','eKJdUs0nW7apWPtdKq','W6JcVHvoWPmpzNVcJSksyNRdV8oef3i','afmLW4lcRmoH','ACoQz8kMbG','za3dUcpdUa','WPJcQSoaWQOo','WRNcJmkIrYu','WOXSB8kFWQy','WRZdNCoXW5tdUa','j8oIWONdLCkBW53cSalcMCk+tgfpqG','W6hcSNH4WOFcVmoVDe4','WQzKiGFcKxJdHIZdPJvMWRf0W5i','ESkzs8osl0zdFsJdNsZcPhtdUbZORB7MSOJLPi7OT4hVVzJORkJMO63MN53NV5NOTQpPHBRORPy','WQ7cJL3cPmof','WRxdJmkOWPDzqmoajmoqW6H2ASoWWRSTDSoNq8kZxMCNW4TvW5S','rNlcNt9s','jH4IaHvSW7VdOvywWQ/cVSorW51WfmowW4G','xN4YvSoEW7reW6NcUa','Fa3dRsVdKW','WQpdLSk1WPzUzSoanSon','W7ddPCkWxeO','W7BdQSklrKG','xSoUeCkdngSxWRq','iSo+WRW','c8o3W7Kht8k7W78','jbv+qtGWWQRdQG','EaRdQWBdUa','BSkcbhhcGG','W4BcJLXBWRy','WQJcVCoeWQmUWR1dW4VdNq','WQbFFSkFWQKcFJ4','W7vibsKcWOhcQq','W5PTWO3cV8kaWPtdVf0','W7idoM3dKW','dmk4vCoDlM0HWPZcRGO','WQVdUb1sWQKnyxNcVSkul13dRSojeh4kWQ/dQqxdRSow','Awq3WPxcUW','beG2W7FcRCkPW5VcVSk1W4VdGw3dU8kQxstcNSk+b8kTacfIW7ZcVba6qdGjxSkWW7JcV8op','W7ThWPlcLCkA','WQ/cH0VcQmog','vmo1WOG','WRRdK8omW5T/W4f5dW','WRORp8o7WPumWR3cQG','nttdNSodWQW','W7tdTalcUCk3WQNcG0tdSJHlycCEsmoAAG','W7mJa0BdPuNcLSoQ','f00vW4/dNW','W4ldGCo5iM1dW6JdGSowW5SmeSol','vmkxW6VdIvS','rmkii2NcMq','vSoeESkWnCoGWPRdPIRcTr0KWOCrWR9wWR9iaSovj8kdWOVcU2lcVCotFGFdOmkJWO8/oHJcSCkfoSo3t2qeE8obemoUWOmiW4agWP5XW53cL8kIWOnhW6W8WPK+jv42ySkhj8oYu8ohWPanW4RdGW','B10hWRtcHG','W5GYiNhcMbqXW5NcMSkrsX3dU8ozeCkyeqjrvSoM','W5CJiNtcMeTSWP/cHmkfs2ZcOmktaUISI+AXVEwLKoI0M++8T+ISVUAGO+AEHEE+QoI0ToMhQEITNW','mmk4gCoDrSkwWQhdL1tdHMKH','WQldSaDA','BSodWRVdNqm','WRxcVmoXWQOiWRP0W5BdIa','pCoKWRJdK8kFW4lcJq','WQddSafwWRqcDh0','W77cO2ftWPW','tmo/WPJdGYe','W63cTubrWPK','W6a1W6pdP8otWPFdJd7dQSkFzxTOgCk3c8oRW7XZW4pdUZVcOSobqCk9f0zavepcGuBdSmkjj8oHD1tcImkBlmoiW6xcQCo3WQSoj3WLW7XllxVdLLxdH3u7WRu4cvBdUmkUd31qW7Dqi8kZA8keW5RdTYyCWRtcTCoYwSoPWPhcM8oWWR1jASowWOxcHN3dLmkbs8oUWO/dTxK/E8kpcrJdJqtcISo5W7ZcK8kToLFcKCopF1a0nSoSmSkorCojW5eVW5yKW6BcGJldS8o3WQyDW7xdN8oylCkbluOCWQxcTHiBWOpcV8k3W7C','W7j+W53cTW','W4CKcwtcK153WOtcJW','nXNdV8oqWPLPnXxcVutcIH8IWOdcNd5lWP18WPS6cfu','beG2W7FcRCkPW5VcVSkNW57dMJxdV8oNuJFdLCk+amkHw2XTW7RcTfe5fMbBtSoRWQdcTCksWRngW5yWE8owW7K8W7PYfCkJWP3cVsHPWP99hs0uwxbGuSocWQroeW','l8o3WRJdGCkE','WP3dU8oVrmoK','WRWRW6pdLLa','WQnnFSkFWPqLDJCP','yCoNr8kCamoxWRZdMMZdR1K','s8o+aCkXfgSxWRq','wG3dLLBcQIjXA8kw','W6vzW4dcUSo5','WORcHCoZWQmn','W4ivW7ZdRSoY','WOxdHSojCCoZ','sCodW61LW6ZcH3e','W4OcWPxdV8k/','WQ/dL8oaW6DIW4zWdSo7zN9aW7vwimoYWPBcIJRcQxVdKmkDWP57W4tcVSkiW47cOCkGoSkMWR9CfSoQW74VW7PGWPzAWQJdP1RcLCkjWR/cPSoGWOCcWOJcRNtcKSo+mdFcLW','WPmlW5NdQGBcTglcLSoNW4P4W4P1imkEW7VdUutdHCoDWRhcVCoqW7f2WPvKW47dTSosfeZcNmoyrmosB8oIarHvWRVcGq9AWPPDWQ/cTSoFf0FcMCoBW73dMmobgCkze8kQW5rFoSo5tmkrFCk5WP/dSN1vWPNcKXTZBSoOqCkUtCoGAcaNB8kduCoXs8k9W5JcSgvkW44OAfbynYtdVCoBxaFdLXBdGCklW64sAHRcJuqFhva+kSosy2JcGcf9WQmeWRzoW7/cKCoKog7dLCkviqbxzf3dUmosW4P2WR/cGb7dNCk5mYpdP8kAWRrqW7lcQIaQBCowirVdRmotW7pcGLigft7dNKNdPmkfW61dW6PeWRDHWOmcpmoBWO3dQSoYh8o+jNpcU8kFW4OaW75bW5m/qGumW5lcOa/cVerGemo9W5tcLSk3W58cthjgW53cVePJFSoKwtTHBCotW53cNSkogmoCWPOhxgJcN1tdMSoiDJFcUcahW4XNW6BcVYBcIg1oFCk5WP9AWOdcJbjgWPZdTG/cQmkeW4yOW5eJW6z8WO3cKGhcHmk3WOaeWRr6BsddTCoylKHkyIi/gqdcQSoiWP7dG8oMsfSvhs5zB8kdW7FcN8oOW7ddRmk+WPtdKaVcPSommmo1W57cSsvyCCowo8k0qZu3WRbNzdK6WQTNWOBcJgTKs8o6BSouWOBcPb0zWP/cTd4','WOSdaCoSWO0','smo7WP3dQq0','owurW4hcLa','5lUC5lMG5P6g5yI75zQ16l+O5zQA56Ik5PA/5O2J','W7aCWOddUsJcJsNdJSoo','WQddHmk1WPztqCoipW','WQXJrWzgW6tcVXdcRM/dJ8kJW4dcPSkFW7rjW57dJ0u','wSoSfmkSjq','WO/dG8o1sCoN','WQ96FHbb','cf02W6y','zvryWOtcRuNcNmkFWOBdTw0EW5FcMq','WRpcLKJcGCo8WPmkWRZcHCo0d8kxAXq6WRrdvSkGWRLQx8oQeSo7nSoSWR7cO8ozyLuGtSo/W7abwcdcTmoCkum','WRdcTCknsJe','WRb4yajhWRFdVLG','WQDJbblcGY7cP2ldPJukWQvWW5pdLSoFWPpcMN8NrwpcKWfPEmoBWP1TumkrW7ajs1iFWPlcPrddMMjRWRdcK8oDWQ/cTCkRWR7cGXxdIY3cPW','vKFcQJnsW6K','bCo9W78SC8k8','u8oSFmkDfG','zWFdKYVdTG','W7ilcNBdJW','jq/dRSoOWPnDkru','tSooqSkgiq','WRCXW6NdQK7cUqaHWRe','swG2sSouW7vxW6G','WQZcRSotWRuy','WQrmEmktWPqcFsyVW6rxW70','W4vmW77cGmoO','W5i9WRlcKsG','W7v0W7RcH8o5','smo1WPZdRG','WQFdI8onW69yW45Ybq','W7/dOqZcJmoPW7S','uNO+xq','ECkDs8og','tSozW4jHW4xcJ3lcVW','WRDnAmkiWRmvDIuUW69cW7TxW7VcNM3dM0pdSa','AmoEWRNdVr0','W6FcJCoiW7f4W4XRcCoDBg1uW6TLiSo0WOe','WOBdGSoR','AhCEWPlcJW','r1xcVZa','WRpdOSoEtmoS','W47dJCkkshm','WP/cK8k6CdG6WR/dQSoq','WPZdImoKB8op','WRvsBSkVWQe','aSkPCSkLnG','WOX3W4ddOhZdUsBdHSkvWQtdL8kv','lCo+WRxdG8koW4pcIWdcGmk0FW','WQddQqa6W5NdPSksnbxdKmkBWRi','eCoJW4NdUmo/lCoRlLq','k8oPWP3dVmkd','W5SQWR3dOqm','Cv0yWQi','WQ3cN8kNFHddNmkDwJu','W63cG3tcGmo4W6Pa','WRPqDCkVWPa','W74MqGZcILVdJGhdNa','DWNdQcG','rmonECk2gW','W7HNWP/cKSk9WPBdVKOq','jhK5WPyXW6pdMW','W4ZcHKfzWRy','W6e6W6tdTmklW57dHZxdHCkxoxT4r8o5iCo4','W6KNd2RdKG','yWNdRJRdUq','WQdcIgrmWOa','WOhcK8k/yqCxWRhdTCoq','xSo7WP3dTYeRrZW','W6vRW5VcV8oTyCkeW4xdKa','dueuW4RdOW','WOhcTmknvYS','W7dcH2vxWPa','W73cSKL2WP7cQG','WOtcTCkTvcy','5P+r5yMU5zUj6lYs5zQJ56QZ5Pws5O+r','nSkkqSkmeq','WPZdQSonE8oH','W74eWPVdPINdS2FcLCoFWPekASoWW41qxxvjWRtcJCoeW4W','W7DRaGOfWQlcOKpdQG','W7K3ow7cOG','W5Sxg0ldUa','W5GgW4ldRGC','WRxcI1/cMSobW4HiW7y','mg0VWQS3W6NdHaO','W6eXWOddJCkI','bvyJWPSj','t1VcRbrmW74','W7itaKNdMG','qSkgWPjSW60','B1mCWQNcLW','wWFdUWtdVG','W6GYWPBdTG','WPNcGqSKBG','WQu1W6VdR0NcVqGZWQhcVJ5QWRv/WOdcQYtcRSolWP7dHmoqBSk5FmkfW4KBDCo7W47dUCoB','WPtcSuTVWP9bjMKvW5r7nCk2ka','zSoPxCko','E14wtmom','W7pdV8klvrRcNmoKWQ/dM31lW4XPW7VcQSkeyWueWOddMCoWWPZcLfC6jHlcMhj2WQDb','W6ZdTryYW4ahEsfsWQ4ZFG','W78eWORdUYK','eqZdU8o2WRrFjqtcPMlcILyNWQBcNtKFWPbsWPu6mxryWQH0cCkdWOSV','WR/cVCklrWC','W5K3WONcUJi','vmoGbmkRd3C','W6Gah1tcKq','WQddKaT+WQC','ACk4f1ZcOW','F8oPWOldMZ0','WQtcMmoYWOGF','WOlKU53KUltLHOJLN4JdTCkzxg7cSoADLEITToISOoAYSEwMO+I2OCoa4Ok477Mv4Okg77IE','l3mQWReSW7u','W78LheldGK7cG8oG','WRa+omoUW6znW7tcSSosnmk+A8kxWOX3W4pcK8kSkWW7W5zoW4hdNmoOx8klWOqff8kiAL1SjSo6smojbgtdRmong8oHsx1YcMBdO0OPl8kv','WQPkECkkWPnwn34NW7PyWRXaWRdcP2RcMLldUSo3W4lcKXWqW4xcSCkHW6rmWOTSFCkNW5tcL8k3cmocxCo8WP3dJCkTxbf7W7K2txpcSMhdUJaW','WQhcM2HYWOC','WRqKW6NdSeu','WR3cOq3cVmo1W6RcK0JdUZOfCdTEcCowDW','CSoPw8kCeq','WQT2bam','WQtcQ8oYWQ8j','WRBcUeP/WOrknW','WQxdLtjmWPq','DSkcgudcLu82c8oeFCoe','W4xdGvC','WR3dO8ozW7/dHHWk','W5mZWQ7cNYa','W4RdOSk4tgu','othdUSoFWPy','WRpcOSk+AIa','sWpdPKRcUWLIEG','WPdcOmkKtstdQSkyBhCav8oEW4qmWRb2AmkmvK/cS8oG','wqPZW5lcLCoJWR3dGSk8','W5qcWR/dHI8','W6tcRK9rWOdcVq','vSoQW6HGW4C','WOVdUCohumoa','xrhdIvxcVq','W4S2WPVcIslcPq7dKa','WO7cJCkMvqO','fmoQW57dTmoj','sSkFW7JdHfy6qCksW6a+','WQtcMSoVWPuK','W57dU8kwqgq','Emkah2JcVq'],...(function(){return[...['W5f1W77cO8ow','DmkpB8olkvbNFty','h1KKW7dcQW','W6L/WPRcOmkBWOBdTeOLW45c','W6aUWQpcKZ0','WQlcJCkfFYZdGCkTxa','wNOHvCoiW6HuW7xcNmoDWO4','W7SRWR3dVSkaWQrnE1m3WRldNmk2rG7cKmogt8o+W7j5jNe','W6RdRWhcH8o4','WRRcJfJcG8oGW4bb','W7mpp8kuWPOJxH0r','W6iHneFcNW','WPldMmkS','wSkuhMJcNG','WQHYbbFcG3hdUItdPtziWPS2W57cGEITGUAYTEwMHEI0UE+9HoIVN+AIJoACG+E8O+I3O+MhH+ITKq','WQ/cU8otWQ8tWQ5lW5NdGq','aGT4xHS','u8o7CmkJgG','WQD4vXm','WQCkW4ldJ0G','B8kVa1tcTW','W7BdIbZcISo+','W640W7NdTmouW4tcJh/dK8kxlxWZbSo3kCoUWQjGW5xdNG','WQL2aG/cPwFdRt/dMYji','WQBdOmobW5Dc','WQnYrXrAWRRdQq','W5CcW5FdOYZcTupcGCoJ','WQpdTCkiWOzO','tmo1WRZdRHOStZq','i8oZW4KUBG','W5yNjgZcTezXWPVcJW','p8kkqSko','WQ/cQSoaWRqEWQe','WQRdKCkYWOnPfCkbF8odW7DZg8oSW6aIymkWC8k/xcOKW6fnWOLUdaWvgGpcVs3dOSkmW6bfzCoXW43dS8kNBthdKfBdHCoKWPldU8o/WOpcPW','v8oiW5f4W6tcIw3cU8oF','iqDPqbq','W6NcSvH4WPVcRmoyAvFcLSoEWRNcVCkaW73dQSoBW6CYW5TJW6NdSWyVtCoCf8oGW6q','W4GLp0ZdVa','WQVcLmkDW6jW','WOZcMCooWPmW','W60qb0xdOq','W6VdPmkmuq','hmoDWPJdUSkq','WQ/dPSolW5ddGbSoAmkpmt/dN2hdVvldMmoDpCoFucFdLSoyW7iYeSkaxa','tmoFW4zJW6xcUMBcQSoxW67dRJ3cKbtcHSogW67cHWHeqxTBlJRcRCkHBCoJ','afmL','FKWfWQVcIGBcH8kdW5tdQZ4bWOhcJs9/bCo7WQNcOISxyG1pCJVcGmkCkqhdUWy','B8kJW6/dKeq','ih8uW6ZcMq','WPiUomoSWRKhWO/cQSoxE8k4sSoxWOPQW4NdHq','WRXIW5NcSCo6WONcOurh','WOdcHSkGFca','j8oIWOVdNmkpW4lcQaRcHa','WQH0xH4','WQ7dRmooxmol','W75RW53cPSoWpmocWOZdGxRcI8kkWRCJWRrzW68oEYz2wHGHWO4','W53dVmkwAvC','WPtcK8k4DZSqWQC','W6/cPfX2WP3cQ8oa','BmkvC8owmG','WQ7dHmk6WPddPLPlvW','r8kNiuBcTa','frldR8oEWRXfnW','WQRdT8opW50','W7/dQSklra','BSoNtG','WOZcNG45sW','WOyvW5hdHgi','u8oaW41JW78','cSkFWOS','sbpdNfZcJaLKFSkBamoggSkRW75O','W5uYpKtcGa','zCo1W7HnW5K','WRddQSouW45a','WRm9WQlcSKtdRf4JWQRcT2v8W6zOWONcOZ/cUG','W5BdHXVcOCoX','v8oGWQNdSaa','vmoGba','mgG/WP0WW6ddIWmq','gqJdRSo3WQ4','W57cNCk+eCkZW4rAW6rAWPLZW4dcOq','tCoPWORdQceRrZW','W7ldOmohWRmtWQPwW5BdL8kdW6xdKmkYWRZcSSkWWO8','WRNdVmoHW6RdQW','W5GYiNhcMbqXW5NcI8kttr3dU8ozeCkyeqjrvSoMWOiqWPa','wcddVIJdNG','W7TXWRVcUCk8WPZdV18','5PEn5yAY5z2h5P2b6k215Ash6lEA','DCoXxSkWb8ogWQBdI30','n8oVW5hdUSolcSoRlvy','t8oxjmkVcW','W7T+W53cTCoR','W6NcUhHXWP8','WRFcJvS','WOdcG8kUvJSqWRS','tCkZASowoq','WQ1FESk1WQy','W7FdPmky','W4z6WOBcUCk4','W48xW4hdOJy','rcZdMJZdVG','orjVqWjKW6pcQLWfW7pdVSkDW5H4xmkmW5jyvfVcKXTj','cwGzW5ZdUG','WQ3dG8oAW6u','n8oxW7VdS8oP','WOJdSSovW4xdMq','t28HuCoZW7XyW6hcTq','tK8SWOVcJq','WQ7dISkHWRzOxq','WOFdJmogW4ny','WQJcSLLzWPLC','WRaGW6ZdMMK','W4XSW57cR8oP','W5ldOH7cMmoO','WOJcUmovWQKL','WQJdKCoDW6fIW6zXbSoD','AGpdMX7dPG','WPRcPsu+BW','WOv+hGxcQh3dQspdRa','W6LZDCkNWRGhW63cPSobE8oJomkbWOKQWPVdMSoPALP5WPydWOhdN8oTxmopW40otSky','W75RW53cPSoWpmocWOZdIM7cKmkbWRTSWRDzW6HepYe3vfG','W5OqWQVdK8kS','WQhdNdHiWRW','WOBcNs8Owd89W7ZcPurCW4f4WPm','chuuWOqS','FWFdUWZdRSkH','euuaWROi','gMqaW5xcHG','W6pdOrJcVq','hHpdVa','W6m2WQddObW','waddJvG','xSknv8o0dW','WQFdJCoz','WO3cSMrXWP0','dueoW5a','jSoLWQ/dGmkjWOVdKuZcHmkPyJPwbmkQW5zrWOmHFIq','W7W8WPhdOW','ELe9v8ok','WOpdLcP8WQ8','nM8OWOynW77dJbebWQG9W6VdUqO3jmoFAmoa','5PYE5yUj5zU06l6D5zMc56QP5PsW5OYl','W6aHW7/dQCoUWPddHt8','uCoPWR3dVWKPBZj0W51EWRdcVCoP','gSo8W5BdRCk/q8oUjLDZvaJcVWdcMt8l','W5yNjgZcOKb4WPK','DmoEWOldOcK','WQBcIHm5tW','iKWdWOeS','eCkpqSkDhmkYW4JcUmkIW5ZdUCow','5lQX5lUG5PYY5yIg5zI06l+35zUV56MU5Ps25O+v','nSo/WQpdPCkk','WQH4va','WRv/xshcVJJdSIxcSceAW7qUWOm','WR1WiGJcNG','W7TXWPZcRmkIWQBdSLChW5K','D3iksmoV','W7HvWOpcMmkI','E8kosSooke1uyY/dLsxcLa','WRddGmk1WODjtmobiSoh','WPjvF8kOWQy','W5y2WQZdOCkb','WRlcJu8','mCoVW77dV8oa','W6qNW77dL8od','hKKBW4dcQW','v1VcHdnu','uWtdKw3cIq','hmoKW5hdV8os','W7OHqtFcU2tdGr7dOW','W54MWOVcUWlcPq7dKa','Aha/WOlcLG','g2aFW4BdVG','W5mZW6JdTSoPWP/dJJu','smk1WO3cQCodf8oTb0vl','m3mKWPOQ','fvOjW5tdPaZdKfzibItcS8o2emkLW7xcJ8kvAq','WQhdTaC','WR0VW5NdVSo+WRddGMSSW4zL','WP3dLSkTWO/dOvvaxq','WRNdOmk2WPtdGW','umorW5n5W64','WOJcMvnMWQO','W7ewWOVcVJO','W4iqWQVcTsO','W4KDWQZcPd4','uh4LxCoXW5vqW6RcQq','BL3cPtHQW61iWOpcVMZcPmk3WPC0W5VcOhGulJNdQ+ISKoAWHUwMMEI3NU+/TUIVTEAGGEAFP+E+HUI2UEMeR+ITQG','paHEqbK','W6WFWOZcJY8','W7FdPdpcUSo0','x3q3xq','bbv+qt8/WQhdOa','WPzWmHFcLa','WO7cKvNcG8obW4HiW7y','WRflBSkzWOuFAW','W6tdHXhcVCoi','W7dcIKXKWOC','W79YWP3cVSkrWPFdPeSCW5jiwCk6','CmoQxCk5oW','W7SFW6pdHZ4','WQpdT8opW5/dGq','ySoDWO3dRdG','W73dQSknsgNdNCkTWQe','WORcOCk7EJe','gmolW5JdMCoL','W7ldOmohWRmtWQPwW5BdL8kdW6xdKmkYWRZcSSkWWOS','WP/dK8oHW51G','amoWW7O9Aq','v8k4ymo3nu12EZpdPa3cNJu','WPFdLSkJWOfutSodnq','vCoemCk7nW','WQNdUJzIWOG','W65MWPJcUCkA','qmo8aSkddW','WPBdVSkyWO3dRa','W4mdWORdPbtcQcxdNW','FJldJftcQW','W7ddOq/cRa','dCoNW43dRSo2','WOFdGSoxW7VdVq','r8ovW5u','tSo8W6jEW4G','khu8WRS4','WQP+ub17WR/dVvO','qEIbR+whIEAmIZNdVUwhKEE5V+wnKSk4','vqZdSJddRa','WRdcVe13','W4uiW4xdUq','WRhcMCkEybm','n8keuq','W4hdHSo8j2zhWRBdQCo5W7O3aW','sCkAW6RdMwyTE8kxW4PQWO1tWQVcONzy','W7quWRFdLs4','5lQu5lQt5P2U5yMp5zIv6l+r5zQV56QH5PAC5OY2','beG2W7FcRCkPW5VcVSkKW5FdNtdcUmoPgsRdLmoZc8kVqM18W7ZcVHy6hxyDq8k3W7pcKSkFWRShWP1MCW','vCodW4r4W4lcGhNcTq','W63cThL5WRu','iqxdJSopWPK','WOxdN8ouw8oZ','j1JcPx/cQ8oHdHZcVJHTW6G','uGtdGuK','mHVdJmoUWPO','uCo8m8kcchyNWRlcNa','W7hcHK1aWPu','W74IWRtdTSk3','WPWpdSohWR4','W53cJ1HwWQG','orjVqWjKW6pcQKqcW7xcQCkfWPD8fSopWP9Dxq','WQL/WPJcVCkNWPhcRe8DWOK','dsTJcq'],...(function(){return['5P6c5yQ/5zQa6lYz5zIq56Qp5PEH5O2w','W4JcGCoPW5VcNWmwDu3cGcdcHCoD','WORdQmoNW65Z','WONcGCorWOqN','xNasWPhcQa','zhijFCoR','W5jfW53cOSoj','WRdcNSksDZBdM8kQrYa','WQNcUSoofHddTSkyWP3dSM4T','cHtcPSozWPmqpHJdOKxcHrC+W67cG2OuW50d','ba7dRSo/WOLtmbhcO0JcIHW/WRlcIW','WPFdMmk4WQFdMKK','5P+d5yI35zUt6l2O5zM356Ic5PsF5O2Y','BSoNtSkQbSox','lmorW4/dS8oE','W47dUmkAv27dKSkMWQS','tgS0sSoh','WO4MgmoeWQu','WPBcHhnsWR0','pCoLWQNdMCkuW5BcLWxcJq','WPZcJgXVWOq','g3G6W6ddVq','5PEZ5yAa5z235PYr6k685AA26lAh','g8o4W4G9rG','fH3dUCo3WOHpiqlcN3/cIW','WPzwESkyWQ8','W4xcHhH1WOu','uwSqWQlcMW','DGxdV1JcQGTaBCkyiCoMhSk0W7W','ixKSWPODW6JdLWSD','WPFdMmk4','nqDVuG','WPBcUCkkEcC','WQpdPSobqCoa','d8oKWOhdVSkq','WRNdKmkyWPBdRW','w8ktW77dHhaXA8klW7W','W5lcO2PaWQS','WP/cGCoaWOOh','WRFdO8owW7BdVW','WORdKmk0WPHF','W4aPp2/cNW','hf4nW4JdVLxcNG1jxgtdSCkYcCkUWRxdGmoACaRdSevFcmoWhCotCG','W7lcPKuiWQ4eqLxcO8kU','WQddKCo+W6HJW5XjcCoc','tCo8bSkCngSxWRq','jg8jWRio','5lU35lU35PY75yMo5zIr6lYd5zMt56QS5PA35O+a','W4hdUCkPs3C','W5RdNd3cHCoj','W4yCWPRdPs7cPJZdM8odWQ4CDSkSW4u','h8kAW7ddJvOWsSkCW7HUW4meW4tcOh9qivtcN3OIWOv1zW','FKWfWQVcMG','qdddLr7dUW','W6FOG6RLHkhMJiddIctLH4VNU6/LJO55','WPhdUSkiWO7dOW','W5FdImkPtMC','sSoOmCkeeW','WQL2rXvD','WOS1W4JdPfu','WQ/dNCoLtCoc','DCoQDSkkdmovWQddI30','WRBcRN1OWPi','WQDqDmkBWOe','meumW6VdSq','WQJdUbbqWRmnF3C','xw8TW63ORAdMSBtLP47OTzZVVkZOR4tMO4RMNlVNVONOTPxPHiZORi4','CmkDs8oena','WRJcMeNcHCol','WOnDrCkkWRi','WRBdTmk1WOBdOW','BtVdIxZcQW','WQNdKSoYW4/dNG','WQBdQ8oNqCot','WQpdLCkVW513aCoenmkmW6r1wa','WPddKJP/WR8','WQNdV8oiCmoP','W7ePWOhcPJS','WQbYaqdcVW','t1hcVtrsW4jAWOxcHa','EComWQ3dRq4','WRpOGBBLHQ7MJyCyWOpLHOJNUAZLJQ49','W7vfW5JdSgW','W5WuW6tdQa7cTNJcJSo6W4OeWO0Nja','WQtdG8oAW6D+','W5ycggVcMq','WO3cJmoIWQqs','W7uMW6ddS8ow','WP/cGGG+zJegW67cOu94W4D/','WRqFomouWQK','AeubWP3cIa','FsldTxBcIG','WQdcJCkdCW','W6quW6/dGqe','WQJcSLK','qCoaW5fJW6/dK3xcVSkFWQdcQwVcLGRdGSooW6hcGtDyrtGalcZcR8kLDmkQWOjQWPXqWPRcPrdcM8kwW4XNfIJcJvNdPh1br0NcR3aBWQX2eWWtxCk8W7FcSCoHwmoeB8o+WQ7cUKHDW7SxW77cJSkLW5RcRCobW5rUACo1dwuOCwtdH8oxEbzshstdK8kPFSkIomkbAmkbvCoNWRJdPXu0W5hcVCkhW6GpkZlcQeGVW6mzBHNdLdSNrSkEA0rBBxJdRmo+kv0gWPRcHvZcLmk7WOjYoWzZrSkvW7RcJJiGoN5CW6RdL8ofACkzWORcUSkYW4OZW4qSdCk2W5m5wWvSW5ZcMCkcW5hcISkShSooWPxcOCkxwmkXW4hdPJrrkCoVW7r8W5FdG8oTsCo7WRP1W4ldILjuW5FdHCoRWRddItiVs8kwg8kQW6SiWR7cPmo2BtOLxdhcOmojdctcQCovW7VdNq','tCoJBmkSma','W7SXWR3dPmknWR9ABa','iqPUqcqTWQNdT3yrW6NdOSkHW5DWhq','FGNdQcRdTa','wSoRo8kTcq','W6VdPmkws1q','W7tdUI3cHSoS','WQlcQZqJwa','kmoWWQNdNCkVW4lcMXhcPmkPyG','uhq0FCoVW6K','W6hcTu15WOe','m30/WOC7','W4ytW4tdPahcVv/cICoU','fSkUF8kbga','WRe2W77dSwNcSa8O','W61XWOZcTmoZ','eYBdNSo/WR4','WPhcN8ksycVdJSkMvG','WRddGmkYWPb1s8ol','W4xcMevmWQq','v8o2W7fgW50','cCoVW4BdKmoN','WPhdK8kYWOVdHLilruldTqhcUmo0WRGRCG','eHNdQSo0WPnjkq','Emkmh3lcO1qYf8o6ASoh','eCoPW5G','WRdcJ29yWPm','W7i7WP7dMbu','WRhcRLTUWQjangC','W7ddSdTkWOOVDW','WO3dVCkRWOLG','uhq0','beG2W7FcRCkPW5VcVSk1W4VdGw3dU8kQxstcNSk+b8kTacn+W7ZdPHG7adOEq8k2W7NcMmkuW6GhWPP7CCo4W757WR4KASo6W4xdTW','W5qOWP7cKZNcUq','nYnErba','WQxcRu5WWOjnm3WqW6H2DCk8yc3dPSkIW5moW57cISkAW7vxWQvoW648W4ThE8oqza','WQO/aSoDWOW','WRZcMq0hvq','WONcGHiIsXCsW6NcQq','WPldIavTWPW','mhKSWOy9W68','W6hdQX/cQSo0W63cGG','W78sWO3dGJi','WR3dKmolW6ffW5T+fmox','WRFcOZSgua','BItdJvpcSW','gLquW5tcUXBcMXXgx2VcQSk9vSoHWRNcNG','W74HgK3dPetcNa','W5xcKCktys1jWRldTmktW5SQlCorW6VdHSkWW4qBms/cP8oSyW','WO7cLG05Bq','WP/dNSoPwSopWPieW7W','WQzRv8kQWOS','iqb6vcK','WONdQmoBASoI','eNyWW77dNq','W5e4W4ddRCojWPFdSYldJmkCkM5W','WR57oaVcLW','m3m+WOa','nSkBz8kmnG','dL8FW7VdVLJcMry','WQ7dISkH','bCo9W78','W57cI3PXWOi','WP/cMCkR','W6OWheBdPuFcJmoPWP4','BSomkSkQpW','C8kea3BcQrv5vCkeka','WRH9hIFcUa','v8kyECoglK5HzINdNW3cMI/dUq','WOVcJWKS','WRzmAmkFWQucFsmHW7m','vwGFv8o6W7jF','W7KGWOFdPCkNWR5ozG','t1VcRa','k18VW67cNa','laPdW77dLf3dLSkWW4RdNaj2WRe','aWfjrsu','WO7cNG0Hqa','WRyGW6JdTKZcQG','WQn4fYFcGMy','vKFcRInHW6TEWPZcTfZcQCkKWRa0W5JcO3CdEW','uatdJ1ZcTcHXCSks','gSoIW7qaDq','WQiKW6NdRNxcRqW1WPJcOZ8','W5ldJsFcHSoj','tmoIW6PKW4u','W6tcK2LbWOO','dCkPW53cRJGXrHDTW6W','WR3cG07cNmoAW5PaW6hcTmo2cq','kqWrW7hdKG','jH9SBai9WQpdT1e','dmo8W7WTymk3W6e','ia9SqIS','WRC0W7NdNeNcSa8O','W7OFWOJdKYJcUW','WOpcOgxcL8oT','WQFdH8owW7q','W7SlWQxdLSky','W7W3gxFcNa','BeGhWQ7cJqlcJ8krW4q','WQL1qmkzWOK','W5TZWPVcOmkz','WRaQW6/dOKZcJqOOWRRcTa','W7b+W5VcU8owDCkiW5hdUx3cJq','W6rZW5NcOmoQ','W4JKURNKU5RLHA/LNkavWO4rW7ldJUAFV+IVL+ITTUAYJowLUEI0OCk+4OcS77UF4Ocn77IA','W603W5pcOmoF','l8oAwcJdJXbHimojF8orW4tcNG','vvGbWRxcHGdcSSkyW4NdPtXRWPFdHsPVcW','WRhcUNr4WP0','WQFdOrOvWPbcEhBdJ8kFiNm','WRSUW5RdTmo7W43cQu8eW4zQtmky','W5tdH8k+WOxdJuGjx1VcQHNcUmoHWQmMFqFdJmodWPy8WQmKvSk8W5byhSoCWPrRWPVdPa','cCoPW7ddV8o5','gSowWQldHSk1','W6iFWRZdOIJcOcBdNq','yfqQ','WRJcRSovWQC','WQiFW5BdIe8','A8oXWOddQJ0','pCkhwCkac8ktW6ZcOSkM','W7uHgeRdP27cHmoIWOi','WQpdLmouE8oh','W4OIWO3cTstcRW0','xGtdMfFcMWLLCCkd','d8oZW6OesmkGW7tcSG','WQGQW7ZdHLlcRa','WO3cKKz5WO0','W4LiWQVcJ8kS','ESkzsW','pIVdRSo/WQu','WQVdLSkuWPz7q8oGmCopW6jBqmo1WQy','W6qhWPldMSkd','WQOVp8oRWRaw','W5ddVWpcMSoi','xSoUeCkdkhyuWQNcVcOw','F8kzxSojeLzC','uqddJvRcSa','uaFdNfpcIW','lSkyv8knfCkY','pqL8','kCoRWRldGmowWPhcMGBcKSk3BgbEbSoGW5an','W6qNWPBdP8kDW6OhjM0PWRRcHmkYdWxcGmkhxSooW7iVlwxcGCoO','FWFdUW','W74wlLpcMG','C8oXW7LfW4K','WPRdJmo+w8oJ','WQWXW6/dS1pdPezOWQddPh4OW7fMWOVdQ2VdOCosW5q','qvdcRJXV','xmoUf8kp','pqL8DGmS','j8oLWR7dNCkj','WO/dTmoTW4z0'];}())];}())];}());_0x117d=function(){return _0x44489c;};return _0x117d();};const _0x4a50e2=(function(){const _0x319aeb=_0x1aec,_0x2e6d76={'JznRq':_0x319aeb(0x21d,'MFDc'),'wlcUA':function(_0xdaecf5,_0x22abce){return _0xdaecf5===_0x22abce;},'XiZEv':_0x319aeb(0x28d,'VeAr')};let _0xe337e0=!![];return function(_0x1c123b,_0x44d558){const _0x5bb53c=_0x319aeb,_0x13a1ca={'pfagX':_0x2e6d76[_0x5bb53c(0x39e,'7py5')]};if(_0x2e6d76[_0x5bb53c(0x12c,'Z@Iq')](_0x2e6d76[_0x5bb53c(0x194,'U0]2')],_0x2e6d76[_0x5bb53c(0x290,'ocQK')])){const _0x5b2e12=_0xe337e0?function(){const _0x2ced98=_0x5bb53c;if(_0x44d558){const _0xfd4c13=_0x44d558[_0x2ced98(0x2bf,'%yei')](_0x1c123b,arguments);return _0x44d558=null,_0xfd4c13;}}:function(){};return _0xe337e0=![],_0x5b2e12;}else _0x10aac2[_0x5bb53c(0x228,')0XC')](_0x13a1ca[_0x5bb53c(0x31f,'enZS')]);};}()),_0x20ef98=_0x4a50e2(this,function(){const _0x2f8832=_0x1aec,_0x582c77={'gtFOw':_0x2f8832(0x162,'SI!R')};return _0x20ef98[_0x2f8832(0x3f9,')0XC')]()[_0x2f8832(0x388,'IEiV')](_0x582c77[_0x2f8832(0x2f1,'M#n3')])[_0x2f8832(0x1e6,'2Ks]')]()[_0x2f8832(0x3e0,'fhDv')](_0x20ef98)[_0x2f8832(0x313,'#i#A')](_0x582c77[_0x2f8832(0x387,'(GdC')]);});_0x20ef98();const _0x58634d=require(_0x4d7d2b(0x1e2,']F3Q')),_0x273dce=require(_0x4d7d2b(0x124,'VeAr')),_0x4073f3=require(_0x4d7d2b(0x174,'M#n3')),_0x4c48fa=require(_0x4d7d2b(0x25e,']F3Q')),_0x4a2984=require(_0x4d7d2b(0x399,'buq1'));function wanyiwan(){const _0x52945a=_0x4d7d2b,_0x552722={'ayPem':function(_0x546222,_0x5e04ec){return _0x546222==_0x5e04ec;},'ozFjh':_0x52945a(0x398,']Hcu'),'UYSFJ':function(_0x5b061e){return _0x5b061e();},'uuirv':function(_0x2c5747,_0x4769fb){return _0x2c5747==_0x4769fb;},'yWwoe':function(_0x314504,_0x357465){return _0x314504===_0x357465;},'rgRjn':_0x52945a(0x238,'TSl*'),'EEYGR':function(_0x4e1cff,_0x34b3a4){return _0x4e1cff===_0x34b3a4;},'fNbbi':_0x52945a(0x2d7,'Ec1s'),'knOyj':_0x52945a(0x39b,'fhDv'),'rsCty':_0x52945a(0x160,'ocQK'),'XFIUz':_0x52945a(0x2c0,'MFDc'),'bdemQ':function(_0xd8a5c,_0x3d50f8){return _0xd8a5c!==_0x3d50f8;},'BSums':_0x52945a(0x198,'M#n3'),'JaQGo':function(_0x1ae14d,_0xb7c279){return _0x1ae14d!==_0xb7c279;},'vXBRX':_0x52945a(0x2fe,'sJJh'),'pcaEY':_0x52945a(0x297,'k@yV'),'kOdYD':function(_0x27b354){return _0x27b354();},'RYMNV':_0x52945a(0x19b,'@HV!')};return new Promise(async _0x20595d=>{const _0x53bd27=_0x52945a;if(_0x552722[_0x53bd27(0x1ad,'ZP$#')](_0x552722[_0x53bd27(0x20e,'#i#A')],_0x552722[_0x53bd27(0x29d,'SI!R')]))_0x43d35a[_0x53bd27(0x345,'enZS')]=_0x5f3d15[_0x53bd27(0x15b,'vQYO')][_0x53bd27(0x3fb,']Hcu')]||0x0;else{const _0x7e7323={'url':_0x53bd27(0x30b,'wW4]'),'body':_0x53bd27(0x3d7,'(GdC'),'headers':{'Cookie':cookie,'content-type':_0x53bd27(0x1be,'%yei'),'Origin':_0x53bd27(0x288,'enZS'),'Referer':_0x53bd27(0x218,'!MwW'),'User-Agent':$['UA']},'timeout':0x7530};$[_0x53bd27(0x274,'!W&X')](_0x7e7323,(_0xea8f0f,_0x4903b1,_0x3c1b5c)=>{const _0x4bfc19=_0x53bd27,_0x2ea386={'NWeex':function(_0x25b393,_0x368a41){const _0x22d072=_0x1aec;return _0x552722[_0x22d072(0x1ec,'sJJh')](_0x25b393,_0x368a41);},'NRbeF':_0x552722[_0x4bfc19(0x1dc,'925D')],'OpSgu':function(_0x54bee8){const _0x5c3cd9=_0x4bfc19;return _0x552722[_0x5c3cd9(0x3ed,'wW4]')](_0x54bee8);},'kmMft':function(_0x1e1eb8,_0x242b0d){const _0xebef62=_0x4bfc19;return _0x552722[_0xebef62(0x275,'eNvX')](_0x1e1eb8,_0x242b0d);}};if(_0x552722[_0x4bfc19(0x25c,'7py5')](_0x552722[_0x4bfc19(0x2c4,'f7Kx')],_0x552722[_0x4bfc19(0x22a,']H&!')]))try{if(_0x552722[_0x4bfc19(0x1d8,'IEiV')](_0x552722[_0x4bfc19(0x23c,'mH5C')],_0x552722[_0x4bfc19(0x3ac,'FOZy')])){const _0x3dacd8=_0x1f77e7[_0x4bfc19(0x404,']F3Q')](_0x3546ad);_0x2ea386[_0x4bfc19(0x2a6,'%yei')](_0x3dacd8[_0x4bfc19(0x1a2,')0XC')],0x3e8)&&(_0x37981a[_0x4bfc19(0x2bd,'4lwP')]=_0x3dacd8['rs'][_0x4bfc19(0x122,'Z@Iq')][_0x4bfc19(0x351,'@BXE')]);}else{if(_0xea8f0f)_0x552722[_0x4bfc19(0x21b,'buq1')](_0x552722[_0x4bfc19(0x2c9,'SI!R')],_0x552722[_0x4bfc19(0x168,'@HV!')])?_0x1fed05[_0x4bfc19(0x33a,']H&!')](_0x3638d6):$[_0x4bfc19(0x16e,'#i#A')](_0xea8f0f);else{if(_0x3c1b5c){if(_0x552722[_0x4bfc19(0x37f,']Hcu')](_0x552722[_0x4bfc19(0x269,'$]Ws')],_0x552722[_0x4bfc19(0x150,'8]WM')])){const _0x47a1cd=_0x2ea386[_0x4bfc19(0x39f,'Z@Iq')][_0x4bfc19(0x33d,'ZP$#')]('|');let _0x28fe2c=0x0;while(!![]){switch(_0x47a1cd[_0x28fe2c++]){case'0':_0x147fd8[_0x4bfc19(0x3a9,'ocQK')]=_0x4b66de[_0x4bfc19(0x3f5,'wW4]')]?.[_0x4bfc19(0x3df,'Z@Iq')]?.[_0x4bfc19(0x302,'ydF&')]||0x0;continue;case'1':_0x1dfb15[_0x4bfc19(0x12a,'7py5')]=_0x588c1e[_0x4bfc19(0x15b,'vQYO')]?.[_0x4bfc19(0x27c,'IEiV')]?.[_0x4bfc19(0x3c2,'dnS(')]?.[_0x4bfc19(0x131,'TSl*')];continue;case'2':_0x214e13[_0x4bfc19(0x2b7,'VeAr')]=_0x2ea386[_0x4bfc19(0x36d,'ydF&')](_0x74c34d[_0x4bfc19(0x380,'f7Kx')]?.[_0x4bfc19(0x2f9,'@BXE')]?.[_0x4bfc19(0x3a2,'sJJh')],0x1);continue;case'3':_0x3fc189[_0x4bfc19(0x152,'@8@#')]=_0x5b91a8[_0x4bfc19(0x29a,'FOZy')];continue;case'4':_0x48e184[_0x4bfc19(0x3a1,'!MwW')]=_0x314833[_0x4bfc19(0x1cf,'k@yV')]?.[_0x4bfc19(0x333,'vQYO')]?.[_0x4bfc19(0x2de,'!W&X')]||'';continue;}break;}}else _0x3c1b5c=$[_0x4bfc19(0x35c,'TSl*')](_0x3c1b5c),_0x3c1b5c[_0x4bfc19(0x3d2,'!MwW')]&&(_0x552722[_0x4bfc19(0x18a,'eNvX')](_0x552722[_0x4bfc19(0x20f,'wW4]')],_0x552722[_0x4bfc19(0x3bc,'%yei')])?_0x2ea386[_0x4bfc19(0x2c6,'@BXE')](_0x3fd857):$[_0x4bfc19(0x13b,'2Ks]')]=_0x3c1b5c[_0x4bfc19(0x127,']Hcu')][_0x4bfc19(0x376,'%lRS')]||0x0);}else $[_0x4bfc19(0x32a,'7py5')](_0x552722[_0x4bfc19(0x13f,'8]WM')]);}}}catch(_0x2eaac6){$[_0x4bfc19(0x349,'4lwP')](_0x2eaac6);}finally{_0x552722[_0x4bfc19(0x3ff,'8]WM')](_0x20595d);}else{_0x4e4fa2=_0x3487c7[_0x4bfc19(0x3cb,'%yei')](_0x16df65);if(_0x2ea386[_0x4bfc19(0x3f4,')0XC')](_0x20a6f4[_0x4bfc19(0x26a,'M#n3')],0x1a1b98))_0x582706[_0x4bfc19(0x283,'f7Kx')]=_0x13a407['rs'][_0x4bfc19(0x2ed,'enZS')][_0x4bfc19(0x346,'ZP$#')]?!![]:![];else{}}});}});}async function getuserinfo_6dy_bak(){const _0x27d25d=_0x4d7d2b,_0x1c6018={'IMqEK':function(_0x43447b,_0x1d3b15){return _0x43447b===_0x1d3b15;},'vehGI':_0x27d25d(0x314,'M#n3'),'AVBwf':_0x27d25d(0x28a,'ocQK'),'TGyvO':function(_0x458d91,_0x1c442f){return _0x458d91===_0x1c442f;},'OkECD':function(_0x59e699,_0x292120){return _0x59e699!==_0x292120;},'axptT':_0x27d25d(0x361,'@BXE'),'tiyMt':_0x27d25d(0x1c2,'2Ks]'),'sefwu':function(_0x131d15,_0x317a62){return _0x131d15==_0x317a62;},'ulaUJ':_0x27d25d(0x226,'Fj3R'),'sFilz':function(_0x35796e){return _0x35796e();},'VUpzw':_0x27d25d(0x3fa,']H&!'),'oehTQ':_0x27d25d(0x1bb,'k@yV'),'Dyswh':_0x27d25d(0x13e,'(GdC'),'LKGRS':_0x27d25d(0x1b4,'sJJh')};let _0x75953d={'url':_0x1c6018[_0x27d25d(0x1bf,'^lT%')],'headers':{'Accept':_0x1c6018[_0x27d25d(0x237,'$]Ws')],'accept-encoding':_0x1c6018[_0x27d25d(0x19d,'Uj*!')],'content-type':_0x1c6018[_0x27d25d(0x165,'7py5')],'Cookie':cookie,'User-Agent':$['UA']}};return new Promise(_0x5dc8af=>{const _0x4cb144=_0x27d25d;$[_0x4cb144(0x241,'buq1')](_0x75953d,async(_0x5de071,_0x48c486,_0x15cd2c)=>{const _0xf14699=_0x4cb144;try{if(_0x5de071)console[_0xf14699(0x1d1,'fhDv')](''+JSON[_0xf14699(0x144,'QiPy')](_0x5de071)),console[_0xf14699(0x2e9,'SI!R')](_0xf14699(0x19e,']H&!'));else{if(_0x15cd2c){_0x15cd2c=JSON[_0xf14699(0x37d,'Ec1s')](_0x15cd2c);if(_0x1c6018[_0xf14699(0x17f,'ydF&')](_0x15cd2c[_0x1c6018[_0xf14699(0x12b,'Ec1s')]],_0x1c6018[_0xf14699(0x2db,'925D')])){$[_0xf14699(0x332,'ocQK')]=![];return;}if(_0x1c6018[_0xf14699(0x35d,'!MwW')](_0x15cd2c[_0xf14699(0x2fd,'5@tD')],'0')&&_0x15cd2c[_0xf14699(0x176,']H&!')]){if(_0x1c6018[_0xf14699(0x2eb,'fhDv')](_0x1c6018[_0xf14699(0x31c,'XjyN')],_0x1c6018[_0xf14699(0x265,'2Ks]')]))_0x3c6fe9[_0xf14699(0x348,'@BXE')]+=_0xf14699(0x2dc,'FOZy');else{const _0x15a0fd=_0x1c6018[_0xf14699(0x300,'TSl*')][_0xf14699(0x1d4,'IEiV')]('|');let _0x43c3a6=0x0;while(!![]){switch(_0x15a0fd[_0x43c3a6++]){case'0':$[_0xf14699(0x36e,'5@tD')]=_0x15cd2c[_0xf14699(0x120,'Fj3R')]?.[_0xf14699(0x1e1,'925D')]?.[_0xf14699(0x21f,'925D')]||'';continue;case'1':$[_0xf14699(0x283,'f7Kx')]=_0x1c6018[_0xf14699(0x192,'wW4]')](_0x15cd2c[_0xf14699(0x395,'!MwW')]?.[_0xf14699(0x3b1,'enZS')]?.[_0xf14699(0x191,'Fj3R')],0x1);continue;case'2':$[_0xf14699(0x1aa,'!W&X')]=_0x15cd2c[_0xf14699(0x15f,'fhDv')]?.[_0xf14699(0x3ab,'5@tD')]?.[_0xf14699(0x373,'Fj3R')]||0x0;continue;case'3':$[_0xf14699(0x33c,'$]Ws')]=_0x15cd2c[_0xf14699(0x1cf,'k@yV')]?.[_0xf14699(0x2b8,'f7Kx')]?.[_0xf14699(0x3b6,'Z@Iq')]?.[_0xf14699(0x364,'8]WM')];continue;case'4':$[_0xf14699(0x11d,'VeAr')]=$[_0xf14699(0x262,'5@tD')];continue;}break;}}}}else $[_0xf14699(0x1dd,'f7Kx')](_0x1c6018[_0xf14699(0x3a5,'@8@#')]);}}catch(_0x17dda5){$[_0xf14699(0x11e,'M#n3')](_0x17dda5,_0x48c486);}finally{_0x1c6018[_0xf14699(0x3e3,'QiPy')](_0x5dc8af);}});});}async function getuserinfo_6dy(){const _0x429664=_0x4d7d2b,_0x40e88e={'QsYLn':function(_0x503447,_0x146b00){return _0x503447!==_0x146b00;},'Fdnyp':_0x429664(0x1f4,'MFDc'),'tewYI':function(_0x4cb24c,_0x1ed660){return _0x4cb24c===_0x1ed660;},'VJRep':_0x429664(0x2a2,'ZP$#'),'Deals':_0x429664(0x366,'U0]2'),'TwtoX':_0x429664(0x1c5,'8]WM'),'Smcmj':_0x429664(0x14e,')0XC'),'aTKxF':function(_0x41f704,_0x11c9ef){return _0x41f704==_0x11c9ef;},'IRVLR':function(_0x531cf7,_0x38fd67){return _0x531cf7===_0x38fd67;},'UFumS':_0x429664(0x147,'sJJh'),'rqVaY':_0x429664(0x128,'Ec1s'),'jzKGc':_0x429664(0x2ba,'%lRS'),'ACLOR':_0x429664(0x16a,'Uj*!'),'enyaa':function(_0x477b7f){return _0x477b7f();},'IKMiF':function(_0x4606dc){return _0x4606dc();},'lfejS':_0x429664(0x248,'U0]2'),'yHzJV':_0x429664(0x2d8,'U0]2'),'ThwbO':_0x429664(0x261,'Fj3R'),'XQRso':_0x429664(0x1b2,'IEiV'),'ZrVnW':_0x429664(0x322,'(GdC'),'BPJGB':_0x429664(0x1da,'@BXE'),'wjZVB':_0x429664(0x207,'dnS('),'kiqOf':_0x429664(0x3c5,'8]WM'),'KHbaB':_0x429664(0x199,'@8@#'),'IoZmv':_0x429664(0x197,'vQYO'),'QyEUD':_0x429664(0x355,'vQYO'),'eOFms':_0x429664(0x3da,'ydF&'),'EIphj':_0x429664(0x301,'s8Ix'),'DZttJ':_0x429664(0x232,'@8@#'),'NPxRq':_0x429664(0x2b5,'mH5C'),'GcmiB':_0x429664(0x3c4,'M#n3'),'xsamr':_0x429664(0x164,'ydF&'),'rmHzb':_0x429664(0x385,'@8@#'),'DABtM':_0x429664(0x182,'eNvX')};let _0x1154d7={'orgFlag':_0x40e88e[_0x429664(0x2a4,'Z@Iq')],'callSource':_0x40e88e[_0x429664(0x29f,'SI!R')],'channel':0x1,'isHomewhite':0x1,'bizModelCode':'6','externalLoginType':'1','bizModeClientType':_0x40e88e[_0x429664(0x2bb,'FOZy')],'appId':_0x40e88e[_0x429664(0x1d3,'@BXE')],'token':_0x40e88e[_0x429664(0x1e3,'k@yV')],'tenantCode':_0x40e88e[_0x429664(0x26f,'#i#A')],'uuid':'','client':_0x40e88e[_0x429664(0x1e5,'MFDc')],'sourceType':_0x40e88e[_0x429664(0x216,'SI!R')]},_0x51ebed={'appId':_0x40e88e[_0x429664(0x27e,'ydF&')],'fn':_0x40e88e[_0x429664(0x2ab,'7py5')],'body':_0x1154d7,'apid':_0x40e88e[_0x429664(0x1db,'M#n3')],'client':_0x40e88e[_0x429664(0x291,'QiPy')],'user':$[_0x429664(0x1cc,'s8Ix')],'code':0x1,'ua':$['UA']};_0x1154d7=await _0x273dce[_0x429664(0x13c,'#i#A')](_0x51ebed);let _0x543d64={'url':_0x429664(0x3bd,'wW4]')+_0x1154d7+_0x429664(0x31b,'7py5'),'headers':{'Accept':_0x40e88e[_0x429664(0x37b,'@HV!')],'accept-encoding':_0x40e88e[_0x429664(0x335,'wW4]')],'content-type':_0x40e88e[_0x429664(0x266,'f7Kx')],'referer':_0x40e88e[_0x429664(0x38d,'@BXE')],'Cookie':cookie,'User-Agent':$['UA']},'ciphers':_0x40e88e[_0x429664(0x1c6,'Ec1s')]};return new Promise(_0x253ece=>{const _0x1f1c45=_0x429664,_0x1e8784={'CNaLz':function(_0x474316){const _0x5b13e3=_0x1aec;return _0x40e88e[_0x5b13e3(0x2ca,'Z@Iq')](_0x474316);},'sfmwq':function(_0xd6c2f1){const _0x1b1bd6=_0x1aec;return _0x40e88e[_0x1b1bd6(0x2ac,'Ec1s')](_0xd6c2f1);}};_0x40e88e[_0x1f1c45(0x1a1,'fhDv')](_0x40e88e[_0x1f1c45(0x375,'$]Ws')],_0x40e88e[_0x1f1c45(0x1d9,'VeAr')])?$[_0x1f1c45(0x26d,'IEiV')](_0x543d64,async(_0x38771e,_0x4757af,_0x5cb568)=>{const _0x30080a=_0x1f1c45;try{if(_0x40e88e[_0x30080a(0x2e8,'!W&X')](_0x40e88e[_0x30080a(0x1f9,'k@yV')],_0x40e88e[_0x30080a(0x272,'MFDc')]))_0x1e8784[_0x30080a(0x2b1,']F3Q')](_0x23e88d);else{if(_0x38771e)_0x40e88e[_0x30080a(0x3bf,'@8@#')](_0x40e88e[_0x30080a(0x3e4,']F3Q')],_0x40e88e[_0x30080a(0x329,'sJJh')])?(console[_0x30080a(0x2a9,'s8Ix')](''+JSON[_0x30080a(0x34e,'%yei')](_0x38771e)),console[_0x30080a(0x328,'ZP$#')](_0x30080a(0x19e,']H&!'))):_0x1e8784[_0x30080a(0x2e2,'(GdC')](_0x3fa60f);else{if(_0x5cb568){_0x5cb568=JSON[_0x30080a(0x26b,'TSl*')](_0x5cb568);if(_0x40e88e[_0x30080a(0x1ff,'@BXE')](_0x5cb568[_0x40e88e[_0x30080a(0x39d,']F3Q')]],_0x40e88e[_0x30080a(0x202,']F3Q')])){$[_0x30080a(0x3e7,'IEiV')]=![];return;}if(_0x40e88e[_0x30080a(0x3d5,'925D')](_0x5cb568[_0x30080a(0x178,'SI!R')],'0')&&_0x5cb568[_0x30080a(0x360,']F3Q')]){const _0x173764=_0x40e88e[_0x30080a(0x1a0,'enZS')][_0x30080a(0x1c3,'7py5')]('|');let _0x421182=0x0;while(!![]){switch(_0x173764[_0x421182++]){case'0':$[_0x30080a(0x2cc,'buq1')]=$[_0x30080a(0x252,'@8@#')];continue;case'1':$[_0x30080a(0x135,'eNvX')]=_0x40e88e[_0x30080a(0x187,'Ec1s')](_0x5cb568[_0x30080a(0x380,'f7Kx')]?.[_0x30080a(0x307,'SI!R')]?.[_0x30080a(0x3d1,']F3Q')],0x1);continue;case'2':$[_0x30080a(0x3a3,']H&!')]=_0x5cb568[_0x30080a(0x15f,'fhDv')]?.[_0x30080a(0x403,'ocQK')]?.[_0x30080a(0x20b,'XjyN')]||'';continue;case'3':$[_0x30080a(0x2da,']Hcu')]=_0x5cb568[_0x30080a(0x1f7,'VeAr')]?.[_0x30080a(0x31d,'Ec1s')]?.[_0x30080a(0x3f0,'5@tD')]?.[_0x30080a(0x24a,'ocQK')];continue;case'4':$[_0x30080a(0x2af,'^lT%')]=_0x5cb568[_0x30080a(0x3d8,'QiPy')]?.[_0x30080a(0x203,'VeAr')]?.[_0x30080a(0x3b0,'ZP$#')]||0x0;continue;}break;}}}else _0x40e88e[_0x30080a(0x2bc,'M#n3')](_0x40e88e[_0x30080a(0x129,'FOZy')],_0x40e88e[_0x30080a(0x285,'vQYO')])?(_0x12a750[_0x30080a(0x181,'$]Ws')]=_0x1a90ac[_0x30080a(0x394,'925D')][_0x30080a(0x3e2,'$]Ws')][_0x30080a(0x2f5,'sJJh')][0x0][_0x30080a(0x142,'7py5')]||0x0,_0x2b23e9[_0x30080a(0x3d9,'@HV!')]=_0x99f692[_0x30080a(0x15b,'vQYO')][_0x30080a(0x3ef,'4lwP')][_0x30080a(0x1df,'ydF&')][0x0][_0x30080a(0x281,'$]Ws')]||0x0):$[_0x30080a(0x391,'sJJh')](_0x40e88e[_0x30080a(0x407,'U0]2')]);}}}catch(_0x4fa79a){_0x40e88e[_0x30080a(0x1fb,'%yei')](_0x40e88e[_0x30080a(0x33f,'M#n3')],_0x40e88e[_0x30080a(0x2e6,'$]Ws')])?_0x6435f0[_0x30080a(0x296,'s8Ix')](_0x5aa407):$[_0x30080a(0x30c,'U0]2')](_0x4fa79a,_0x4757af);}finally{_0x40e88e[_0x30080a(0x3f3,'Ec1s')](_0x253ece);}}):(_0x2de534[_0x1f1c45(0x206,']H&!')]=_0x3ec577[_0x1f1c45(0x3c8,'^lT%')](/"score":(\d+)/)?_0x14f514[_0x1f1c45(0x3ad,'FOZy')](/"score":(\d+)/)[0x1]:0x0,_0x4f619a[_0x1f1c45(0x367,'$]Ws')]=_0xb65b94[_0x1f1c45(0x2df,'VeAr')](/"currentBeanNum":(\d+)/)?_0x4c3d13[_0x1f1c45(0x14b,'%lRS')](/"currentBeanNum":(\d+)/)[0x1]:0x0,_0x12c2ee[_0x1f1c45(0x270,')0XC')]=_0x3b5e2e[_0x1f1c45(0x259,'k@yV')](/"showName":"(.*?)"/)?_0x53b0d3[_0x1f1c45(0x151,'!W&X')](/"showName":"(.*?)"/)[0x1]:_0x550879[_0x1f1c45(0x400,'ydF&')]);});}async function _0x2a1985(){const _0x401f4f=_0x4d7d2b,_0x508793={'yGeTg':_0x401f4f(0x27a,'f7Kx'),'ykGWz':_0x401f4f(0x16d,'sJJh'),'wIztS':function(_0x66d585,_0x55b39a){return _0x66d585!==_0x55b39a;},'wedjd':_0x401f4f(0x305,'SI!R'),'BgGtG':function(_0x3e1a58,_0x28440c){return _0x3e1a58===_0x28440c;},'PDVgu':_0x401f4f(0x2ad,'!MwW'),'NnhGN':_0x401f4f(0x353,'QiPy'),'JQDnz':_0x401f4f(0x27f,'Ec1s'),'PkrRF':_0x401f4f(0x23b,'%yei'),'wNIxE':_0x401f4f(0x29c,'dnS('),'wCaAr':function(_0x1a237d){return _0x1a237d();},'aPNur':_0x401f4f(0x3fd,'fhDv'),'xUNSY':_0x401f4f(0x1f5,'enZS'),'xKdpu':_0x401f4f(0x1c7,'QiPy')};let _0x5c1060={'url':_0x401f4f(0x161,'FOZy'),'body':_0x401f4f(0x3e9,'VeAr')+Date[_0x401f4f(0x215,'VeAr')]()+_0x401f4f(0x3ea,'!W&X'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Origin':_0x508793[_0x401f4f(0x18d,']F3Q')],'Referer':_0x508793[_0x401f4f(0x255,'sJJh')]}};return new Promise(_0x3f6925=>{const _0x24d787=_0x401f4f,_0x3a5be6={'exFLy':_0x508793[_0x24d787(0x204,'MFDc')],'VCIDB':function(_0x318b50,_0x420909){const _0x32877a=_0x24d787;return _0x508793[_0x32877a(0x254,'M#n3')](_0x318b50,_0x420909);},'tYzXT':_0x508793[_0x24d787(0x39c,'MFDc')],'qBnKA':function(_0x3985e2,_0xec07ea){const _0x9a7643=_0x24d787;return _0x508793[_0x9a7643(0x2ae,'s8Ix')](_0x3985e2,_0xec07ea);},'UkJKo':_0x508793[_0x24d787(0x123,'925D')],'cEWBd':_0x508793[_0x24d787(0x1fd,'VeAr')],'eFVnl':_0x508793[_0x24d787(0x1f8,'TSl*')],'eMgDv':_0x508793[_0x24d787(0x230,'Z@Iq')],'IOxef':_0x508793[_0x24d787(0x180,'eNvX')],'RgRvT':function(_0xcd176e){const _0x39592e=_0x24d787;return _0x508793[_0x39592e(0x149,'7py5')](_0xcd176e);}};_0x508793[_0x24d787(0x282,'ydF&')](_0x508793[_0x24d787(0x224,'#i#A')],_0x508793[_0x24d787(0x1ab,'5@tD')])?$[_0x24d787(0x219,'vQYO')](_0x5c1060,async(_0x423ab4,_0x2ba733,_0x34b770)=>{const _0x530e95=_0x24d787;if(_0x3a5be6[_0x530e95(0x32c,'f7Kx')](_0x3a5be6[_0x530e95(0x3be,'2Ks]')],_0x3a5be6[_0x530e95(0x3f8,'eNvX')]))_0x3428f7[_0x530e95(0x276,'%lRS')](''+_0x3b8ca5[_0x530e95(0x29e,'!MwW')](_0x356253)),_0x3d8093[_0x530e95(0x1ed,'@8@#')](_0x530e95(0x19e,']H&!'));else try{_0x3a5be6[_0x530e95(0x1a4,'Uj*!')](_0x3a5be6[_0x530e95(0x390,'buq1')],_0x3a5be6[_0x530e95(0x320,'Ec1s')])?(_0x395987[_0x530e95(0x2e9,'SI!R')](_0x3a5be6[_0x530e95(0x132,'!MwW')]),_0x232ffd[_0x530e95(0x1bd,'wW4]')](_0x11e7e0[_0x530e95(0x1de,'#i#A')](_0x5dcf01))):_0x423ab4?_0x3a5be6[_0x530e95(0x2d6,'buq1')](_0x3a5be6[_0x530e95(0x172,'SI!R')],_0x3a5be6[_0x530e95(0x3a7,']Hcu')])?(_0x3b8bc9[_0x530e95(0x327,'5@tD')](''+_0x557d75[_0x530e95(0x1fa,'ocQK')](_0x25e788)),_0x48461d[_0x530e95(0x37a,'MFDc')](_0x530e95(0x3cd,'@HV!'))):(console[_0x530e95(0x228,')0XC')](''+JSON[_0x530e95(0x19f,']F3Q')](_0x423ab4)),console[_0x530e95(0x304,'TSl*')](_0x530e95(0x3a4,'Fj3R'))):($[_0x530e95(0x1e9,'TSl*')]=_0x34b770[_0x530e95(0x374,'$]Ws')](/"score":(\d+)/)?_0x34b770[_0x530e95(0x2ee,'MFDc')](/"score":(\d+)/)[0x1]:0x0,$[_0x530e95(0x2a8,'#i#A')]=_0x34b770[_0x530e95(0x2ce,'Fj3R')](/"currentBeanNum":(\d+)/)?_0x34b770[_0x530e95(0x1eb,'QiPy')](/"currentBeanNum":(\d+)/)[0x1]:0x0,$[_0x530e95(0x121,'IEiV')]=_0x34b770[_0x530e95(0x3ad,'FOZy')](/"showName":"(.*?)"/)?_0x34b770[_0x530e95(0x2c5,')0XC')](/"showName":"(.*?)"/)[0x1]:$[_0x530e95(0x268,'4lwP')]);}catch(_0x16b5f0){$[_0x530e95(0x156,']Hcu')](_0x16b5f0,_0x2ba733);}finally{if(_0x3a5be6[_0x530e95(0x209,'vQYO')](_0x3a5be6[_0x530e95(0x25d,'TSl*')],_0x3a5be6[_0x530e95(0x36a,'SI!R')]))_0x3a5be6[_0x530e95(0x337,'enZS')](_0x3f6925);else{const _0x1e534b=_0x2c5f1c?function(){const _0x1970ea=_0x530e95;if(_0x45a42f){const _0x32da74=_0x5ec802[_0x1970ea(0x338,'XjyN')](_0x562c35,arguments);return _0x502f1b=null,_0x32da74;}}:function(){};return _0x450b64=![],_0x1e534b;}}}):_0x3fc79d[_0x24d787(0x3af,'!MwW')](_0x508793[_0x24d787(0x284,'sJJh')]);});}async function queryScores(){const _0x5f41e5=_0x4d7d2b,_0x148f8e={'wVclb':_0x5f41e5(0x38b,'ocQK'),'FVCBb':function(_0x264b57,_0x18331e){return _0x264b57===_0x18331e;},'rbtVO':_0x5f41e5(0x2e0,'@HV!'),'fAxEZ':_0x5f41e5(0x1ef,'Fj3R'),'VqOYv':function(_0x163020,_0x4e1571){return _0x163020==_0x4e1571;},'ibbTh':_0x5f41e5(0x2e4,'dnS('),'MkqOf':function(_0x2b3b65){return _0x2b3b65();},'IqooI':function(_0x4d3c15,_0x4537dc){return _0x4d3c15!==_0x4537dc;},'EpieD':_0x5f41e5(0x2b3,'5@tD'),'Zswyj':_0x5f41e5(0x1b6,'VeAr'),'kKMci':_0x5f41e5(0x3a6,'5@tD'),'mbbZL':_0x5f41e5(0x2e3,'XjyN'),'ckSQz':_0x5f41e5(0x27b,'wW4]')};let _0x51da70='',_0x5ac523={'appId':_0x148f8e[_0x5f41e5(0x200,'QiPy')],'functionId':_0x148f8e[_0x5f41e5(0x34f,'Z@Iq')],'body':{},'appid':_0x148f8e[_0x5f41e5(0x154,'vQYO')],'user':$[_0x5f41e5(0x2fc,'eNvX')],'code':0x0,'ua':$['UA']};body=await _0x4c48fa[_0x5f41e5(0x1a9,')0XC')](_0x5ac523);let _0x2523b8={'url':_0x5f41e5(0x379,'vQYO')+body+_0x5f41e5(0x2be,'^lT%'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Referer':_0x148f8e[_0x5f41e5(0x408,'QiPy')]}};return new Promise(_0x19e259=>{const _0x44bd32=_0x5f41e5;_0x148f8e[_0x44bd32(0x14f,'@HV!')](_0x148f8e[_0x44bd32(0x2c7,'Ec1s')],_0x148f8e[_0x44bd32(0x18e,'FOZy')])?_0x462dfc?(_0xd93a00=_0x1018bd[_0x44bd32(0x3fe,'MFDc')](_0x2bb5c7),_0x5b6bdd[_0x44bd32(0x384,'QiPy')]&&(_0x2d9147[_0x44bd32(0x1e8,'fhDv')]=_0x380883[_0x44bd32(0x2e7,'eNvX')][_0x44bd32(0x148,'sJJh')]||0x0)):_0x1730fa[_0x44bd32(0x334,']Hcu')](_0x148f8e[_0x44bd32(0x3dd,'Ec1s')]):$[_0x44bd32(0x409,'925D')](_0x2523b8,async(_0x38c66c,_0x3d38c1,_0x4202e8)=>{const _0x3c7df0=_0x44bd32;try{if(_0x148f8e[_0x3c7df0(0x383,'VeAr')](_0x148f8e[_0x3c7df0(0x257,'fhDv')],_0x148f8e[_0x3c7df0(0x169,'buq1')]))_0x116338[_0x3c7df0(0x1fc,'5@tD')](_0x21fa16);else{const _0x1a9f60=JSON[_0x3c7df0(0x3ec,'925D')](_0x4202e8);_0x148f8e[_0x3c7df0(0x25f,'VeAr')](_0x1a9f60[_0x3c7df0(0x1a2,')0XC')],0x3e8)&&($[_0x3c7df0(0x15e,'SI!R')]=_0x1a9f60['rs'][_0x3c7df0(0x21c,'#i#A')][_0x3c7df0(0x22b,'2Ks]')]);}}catch(_0x11f7c5){_0x148f8e[_0x3c7df0(0x36b,'2Ks]')](_0x148f8e[_0x3c7df0(0x260,'ZP$#')],_0x148f8e[_0x3c7df0(0x315,'4lwP')])?$[_0x3c7df0(0x381,'enZS')](_0x11f7c5,_0x3d38c1):(_0x2dcdfa=_0x1910e7[_0x3c7df0(0x1b3,'enZS')](_0x202d00),_0xd97e27[_0x3c7df0(0x22e,'Fj3R')]=_0x51de69[_0x3c7df0(0x139,'MFDc')]?.[_0x3c7df0(0x370,'dnS(')]||'');}finally{_0x148f8e[_0x3c7df0(0x2cb,'mH5C')](_0x19e259);}});});}async function fruitinfo(){const _0x458bf0=_0x4d7d2b,_0x539b7d={'ruYGu':_0x458bf0(0x130,'sJJh'),'fVGDj':function(_0x2ab12c,_0x429d10){return _0x2ab12c===_0x429d10;},'fmrwK':_0x458bf0(0x16c,']F3Q'),'NxUJQ':_0x458bf0(0x1f6,'mH5C'),'vZIjL':_0x458bf0(0x354,'5@tD'),'PVoUM':_0x458bf0(0x157,'8]WM'),'CqhSS':function(_0x158152,_0x5499f2){return _0x158152(_0x5499f2);},'cZUec':_0x458bf0(0x389,'^lT%'),'IyXSA':function(_0x2d588f){return _0x2d588f();},'DUqjU':_0x458bf0(0x35f,'enZS'),'oXMZJ':_0x458bf0(0x1d5,'IEiV'),'VYTGk':_0x458bf0(0x378,'!MwW'),'uFOvF':_0x458bf0(0x229,']H&!'),'ZeNvo':_0x458bf0(0x208,'QiPy'),'czutD':_0x458bf0(0x30e,'SI!R')};return new Promise(_0x55debc=>{const _0x40ac81=_0x458bf0,_0x59da68={'ALgVK':_0x539b7d[_0x40ac81(0x235,'wW4]')],'xnxUp':function(_0x323b82,_0x236c74){const _0x51b3d7=_0x40ac81;return _0x539b7d[_0x51b3d7(0x2a0,'mH5C')](_0x323b82,_0x236c74);},'bcwBX':_0x539b7d[_0x40ac81(0x18f,'Uj*!')],'ppgrZ':_0x539b7d[_0x40ac81(0x258,'!W&X')],'hTpMm':_0x539b7d[_0x40ac81(0x186,'IEiV')],'MEIna':_0x539b7d[_0x40ac81(0x1b7,']F3Q')],'TmsmW':function(_0x212e5e,_0x20c188){const _0xe10e60=_0x40ac81;return _0x539b7d[_0xe10e60(0x371,'M#n3')](_0x212e5e,_0x20c188);},'oeqbO':_0x539b7d[_0x40ac81(0x2fb,'ydF&')],'voviW':function(_0x3fc724){const _0x440b4f=_0x40ac81;return _0x539b7d[_0x440b4f(0x365,'Ec1s')](_0x3fc724);}},_0x32deaf={'url':_0x40ac81(0x1b1,'5@tD'),'body':_0x40ac81(0x2fa,'2Ks]')+_0x539b7d[_0x40ac81(0x214,'Fj3R')](encodeURIComponent,JSON[_0x40ac81(0x402,'@BXE')]({'version':0x18,'channel':0x1,'babelChannel':_0x539b7d[_0x40ac81(0x3e5,'(GdC')],'lat':'0','lng':'0'}))+_0x40ac81(0x289,'2Ks]'),'headers':{'accept':_0x539b7d[_0x40ac81(0x321,'mH5C')],'accept-encoding':_0x539b7d[_0x40ac81(0x3d0,'925D')],'accept-language':_0x539b7d[_0x40ac81(0x212,'4lwP')],'cookie':cookie,'origin':_0x539b7d[_0x40ac81(0x231,'vQYO')],'referer':_0x539b7d[_0x40ac81(0x3c9,'Uj*!')],'User-Agent':$['UA'],'Content-Type':_0x539b7d[_0x40ac81(0x2cf,'@8@#')]},'timeout':0x2710};$[_0x40ac81(0x324,'#i#A')](_0x32deaf,(_0x611ed5,_0x3abbf3,_0x47eb0f)=>{const _0x52d9b5=_0x40ac81,_0x2882fd={'bdXCt':_0x59da68[_0x52d9b5(0x28f,'%yei')]};if(_0x59da68[_0x52d9b5(0x137,'Z@Iq')](_0x59da68[_0x52d9b5(0x3f2,'f7Kx')],_0x59da68[_0x52d9b5(0x29b,'ocQK')]))return _0x30405f[_0x52d9b5(0x35e,'4lwP')]()[_0x52d9b5(0x1b0,']F3Q')](EzTmLA[_0x52d9b5(0x279,'4lwP')])[_0x52d9b5(0x1ac,'925D')]()[_0x52d9b5(0x12f,'!MwW')](_0x18bca7)[_0x52d9b5(0x313,'#i#A')](EzTmLA[_0x52d9b5(0x2ef,'f7Kx')]);else try{_0x611ed5?(!llgeterror&&(console[_0x52d9b5(0x377,'enZS')](_0x59da68[_0x52d9b5(0x36f,'vQYO')]),console[_0x52d9b5(0x1f1,'FOZy')](JSON[_0x52d9b5(0x402,'@BXE')](_0x611ed5))),llgeterror=!![]):_0x59da68[_0x52d9b5(0x227,'!MwW')](_0x59da68[_0x52d9b5(0x2f8,'%lRS')],_0x59da68[_0x52d9b5(0x2f2,'XjyN')])?(llgeterror=![],_0x59da68[_0x52d9b5(0x350,'2Ks]')](safeGet,_0x47eb0f)&&($[_0x52d9b5(0x16f,'8]WM')]=JSON[_0x52d9b5(0x245,'IEiV')](_0x47eb0f),$[_0x52d9b5(0x21e,'(GdC')][_0x52d9b5(0x2a3,'ydF&')]&&($[_0x52d9b5(0x2a7,'$]Ws')]=$[_0x52d9b5(0x368,'ZP$#')][_0x52d9b5(0x2f3,'!MwW')][_0x52d9b5(0x134,'%yei')],$[_0x52d9b5(0x225,'%lRS')]=$[_0x52d9b5(0x243,'s8Ix')][_0x52d9b5(0x372,'f7Kx')][_0x52d9b5(0x331,'Z@Iq')],$[_0x52d9b5(0x357,'%yei')]=$[_0x52d9b5(0x25b,'FOZy')][_0x52d9b5(0x343,'@8@#')][_0x52d9b5(0x295,'ydF&')],$[_0x52d9b5(0x3b5,']F3Q')]=$[_0x52d9b5(0x3d3,'buq1')][_0x52d9b5(0x352,'QiPy')][_0x52d9b5(0x292,'eNvX')]))):(_0x965cd9[_0x52d9b5(0x3af,'!MwW')](''+_0x2c828d[_0x52d9b5(0x2f7,'!W&X')](_0x2d9054)),_0x603d6c[_0x52d9b5(0x3c0,'925D')](_0x52d9b5(0x2cd,'mH5C')));}catch(_0x1609f3){if(_0x59da68[_0x52d9b5(0x3de,'@BXE')](_0x59da68[_0x52d9b5(0x2d9,']H&!')],_0x59da68[_0x52d9b5(0x3aa,'MFDc')]))$[_0x52d9b5(0x39a,'wW4]')](_0x1609f3,_0x3abbf3);else{if(_0x3ffbe1){const _0x265b08=_0x81e53c[_0x52d9b5(0x166,'U0]2')](_0x246b89,arguments);return _0x19f24a=null,_0x265b08;}}}finally{_0x59da68[_0x52d9b5(0x15c,'XjyN')](_0x55debc);}});});}async function fruitnew(_0x4cd961=0x1f4){const _0x532f32=_0x4d7d2b,_0x419a21={'afcqd':function(_0x441baa,_0x26d7f8){return _0x441baa!==_0x26d7f8;},'lRAUx':_0x532f32(0x3e8,'vQYO'),'nLCTC':function(_0x3120eb,_0x3ebe15){return _0x3120eb(_0x3ebe15);},'oawOF':function(_0x1737d3,_0x5042c3,_0xe49f1c){return _0x1737d3(_0x5042c3,_0xe49f1c);},'oBoST':_0x532f32(0x2dd,'4lwP'),'REtjk':_0x532f32(0x1ae,'@HV!'),'GjWuU':_0x532f32(0x18c,'^lT%'),'FEPYo':_0x532f32(0x19c,'s8Ix'),'qiLqn':_0x532f32(0x359,'buq1'),'mIGoD':_0x532f32(0x17b,'XjyN'),'dKqNO':_0x532f32(0x240,'mH5C'),'ZGbvP':_0x532f32(0x319,'mH5C'),'gsDFP':_0x532f32(0x294,'ydF&'),'uKXsV':_0x532f32(0x37e,'@BXE')};let _0x269332={'version':0x1},_0x47629a={'appId':_0x419a21[_0x532f32(0x1a8,'VeAr')],'fn':_0x419a21[_0x532f32(0x318,'$]Ws')],'body':_0x269332,'apid':_0x419a21[_0x532f32(0x190,'QiPy')],'ver':$['UA'][_0x532f32(0x33d,'ZP$#')](';')[0x2],'cl':_0x419a21[_0x532f32(0x13a,'fhDv')],'user':$[_0x532f32(0x250,'enZS')],'code':0x1,'ua':$['UA']};_0x269332=await _0x273dce[_0x532f32(0x1c9,'7py5')](_0x47629a);let _0x1742fb={'url':JD_API_HOST+'?'+_0x269332,'headers':{'Host':_0x419a21[_0x532f32(0x1cb,'Fj3R')],'Accept':_0x419a21[_0x532f32(0x267,'s8Ix')],'Origin':_0x419a21[_0x532f32(0x306,'4lwP')],'Accept-Encoding':_0x419a21[_0x532f32(0x25a,'925D')],'User-Agent':$['UA'],'Accept-Language':_0x419a21[_0x532f32(0x2b9,'#i#A')],'Referer':_0x419a21[_0x532f32(0x205,'XjyN')],'Cookie':cookie},'timeout':0x7530,'ciphers':_0x4a2984[_0x532f32(0x1d2,'XjyN')]};return new Promise(_0x1df4c0=>{const _0xec60ce=_0x532f32;_0x419a21[_0xec60ce(0x1f0,'Z@Iq')](setTimeout,()=>{const _0xc0c7f9=_0xec60ce,_0x17a1bc={'IQrhq':function(_0x49ee1b,_0x5e7390){const _0x531938=_0x1aec;return _0x419a21[_0x531938(0x3dc,'!MwW')](_0x49ee1b,_0x5e7390);},'wKkUl':_0x419a21[_0xc0c7f9(0x341,'sJJh')],'kGTBX':function(_0x21c8da,_0x237fa9){const _0x1a8f1c=_0xc0c7f9;return _0x419a21[_0x1a8f1c(0x26e,'IEiV')](_0x21c8da,_0x237fa9);}};$[_0xc0c7f9(0x36c,'Fj3R')](_0x1742fb,(_0x559724,_0x3ac3d4,_0x1df4e3)=>{const _0x558269=_0xc0c7f9;if(_0x17a1bc[_0x558269(0x247,'U0]2')](_0x17a1bc[_0x558269(0x22d,'2Ks]')],_0x17a1bc[_0x558269(0x126,'%yei')]))_0x1c2f7c[_0x558269(0x3ae,'f7Kx')]=_0x41729c[_0x558269(0x38e,'M#n3')](_0x2ed4fd),_0x15fc2a[_0x558269(0x195,'eNvX')][_0x558269(0x33e,'@BXE')]&&(_0x578169[_0x558269(0x32f,'Fj3R')]=_0x523bb3[_0x558269(0x143,'925D')][_0x558269(0x196,'ocQK')][_0x558269(0x11f,'ocQK')],_0x5166f7[_0x558269(0x396,'925D')]=_0x3d3bbc[_0x558269(0x16f,'8]WM')][_0x558269(0x303,'Uj*!')][_0x558269(0x393,'925D')],_0x49a8d9[_0x558269(0x1c1,'dnS(')]=_0x19c001[_0x558269(0x221,'@HV!')][_0x558269(0x193,'2Ks]')][_0x558269(0x1d6,'$]Ws')],_0x411714[_0x558269(0x316,'VeAr')]=_0xbfaac6[_0x558269(0x23a,'U0]2')][_0x558269(0x1a7,']H&!')][_0x558269(0x38c,'SI!R')]);else try{_0x559724?(console[_0x558269(0x30a,'ocQK')](_0x558269(0x2a1,'#i#A')),$[_0x558269(0x156,']Hcu')](_0x559724)):(_0x1df4e3=JSON[_0x558269(0x2f6,'#i#A')](_0x1df4e3),$[_0x558269(0x405,'Z@Iq')]=_0x1df4e3[_0x558269(0x3cf,'buq1')]?.[_0x558269(0x339,'@BXE')]||'');}catch(_0x171150){$[_0x558269(0x1fe,'SI!R')](_0x171150,_0x3ac3d4);}finally{_0x17a1bc[_0x558269(0x3b9,'8]WM')](_0x1df4c0,_0x1df4e3);}});},_0x4cd961);});}function _0x1aec(_0x31ad03,_0x44d96c){const _0x15d508=_0x117d();return _0x1aec=function(_0x883d35,_0x258804){_0x883d35=_0x883d35-0x11d;let _0x117dc4=_0x15d508[_0x883d35];if(_0x1aec['phGMEt']===undefined){var _0x1aecc3=function(_0x2cc823){const _0x38f247='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x4cb744='',_0x594501='',_0x58d9b8=_0x4cb744+_0x1aecc3;for(let _0x4fb378=0x0,_0x14c48b,_0x313255,_0x2c5f1c=0x0;_0x313255=_0x2cc823['charAt'](_0x2c5f1c++);~_0x313255&&(_0x14c48b=_0x4fb378%0x4?_0x14c48b*0x40+_0x313255:_0x313255,_0x4fb378++%0x4)?_0x4cb744+=_0x58d9b8['charCodeAt'](_0x2c5f1c+0xa)-0xa!==0x0?String['fromCharCode'](0xff&_0x14c48b>>(-0x2*_0x4fb378&0x6)):_0x4fb378:0x0){_0x313255=_0x38f247['indexOf'](_0x313255);}for(let _0x477739=0x0,_0x1ba152=_0x4cb744['length'];_0x477739<_0x1ba152;_0x477739++){_0x594501+='%'+('00'+_0x4cb744['charCodeAt'](_0x477739)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x594501);};const _0x26728b=function(_0x4e00d9,_0x1e3fc3){let _0x450b64=[],_0x45a42f=0x0,_0x35910c,_0xe8ec71='';_0x4e00d9=_0x1aecc3(_0x4e00d9);let _0x3bbf7c;for(_0x3bbf7c=0x0;_0x3bbf7c<0x100;_0x3bbf7c++){_0x450b64[_0x3bbf7c]=_0x3bbf7c;}for(_0x3bbf7c=0x0;_0x3bbf7c<0x100;_0x3bbf7c++){_0x45a42f=(_0x45a42f+_0x450b64[_0x3bbf7c]+_0x1e3fc3['charCodeAt'](_0x3bbf7c%_0x1e3fc3['length']))%0x100,_0x35910c=_0x450b64[_0x3bbf7c],_0x450b64[_0x3bbf7c]=_0x450b64[_0x45a42f],_0x450b64[_0x45a42f]=_0x35910c;}_0x3bbf7c=0x0,_0x45a42f=0x0;for(let _0x5ec802=0x0;_0x5ec802<_0x4e00d9['length'];_0x5ec802++){_0x3bbf7c=(_0x3bbf7c+0x1)%0x100,_0x45a42f=(_0x45a42f+_0x450b64[_0x3bbf7c])%0x100,_0x35910c=_0x450b64[_0x3bbf7c],_0x450b64[_0x3bbf7c]=_0x450b64[_0x45a42f],_0x450b64[_0x45a42f]=_0x35910c,_0xe8ec71+=String['fromCharCode'](_0x4e00d9['charCodeAt'](_0x5ec802)^_0x450b64[(_0x450b64[_0x3bbf7c]+_0x450b64[_0x45a42f])%0x100]);}return _0xe8ec71;};_0x1aec['CwnhlW']=_0x26728b,_0x31ad03=arguments,_0x1aec['phGMEt']=!![];}const _0x2b433c=_0x15d508[0x0],_0x2af558=_0x883d35+_0x2b433c,_0x294c85=_0x31ad03[_0x2af558];if(!_0x294c85){if(_0x1aec['ImwbhT']===undefined){const _0x562c35=function(_0x502f1b){this['qXzRSe']=_0x502f1b,this['VbSQRE']=[0x1,0x0,0x0],this['lKcKhb']=function(){return'newState';},this['kNAUmQ']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['pEUFHh']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x562c35['prototype']['WbvUVb']=function(){const _0x36f6a1=new RegExp(this['kNAUmQ']+this['pEUFHh']),_0x33d407=_0x36f6a1['test'](this['lKcKhb']['toString']())?--this['VbSQRE'][0x1]:--this['VbSQRE'][0x0];return this['mkSYIc'](_0x33d407);},_0x562c35['prototype']['mkSYIc']=function(_0x1af648){if(!Boolean(~_0x1af648))return _0x1af648;return this['BmJeoB'](this['qXzRSe']);},_0x562c35['prototype']['BmJeoB']=function(_0x19107e){for(let _0x284333=0x0,_0x255a6e=this['VbSQRE']['length'];_0x284333<_0x255a6e;_0x284333++){this['VbSQRE']['push'](Math['round'](Math['random']())),_0x255a6e=this['VbSQRE']['length'];}return _0x19107e(this['VbSQRE'][0x0]);},new _0x562c35(_0x1aec)['WbvUVb'](),_0x1aec['ImwbhT']=!![];}_0x117dc4=_0x1aec['CwnhlW'](_0x117dc4,_0x258804),_0x31ad03[_0x2af558]=_0x117dc4;}else _0x117dc4=_0x294c85;return _0x117dc4;},_0x1aec(_0x31ad03,_0x44d96c);}async function checkplus(){const _0x5f1a8e=_0x4d7d2b,_0x159d5b={'lRKnN':_0x5f1a8e(0x28b,'2Ks]'),'okEYu':function(_0x15d05a,_0x3ec8a5){return _0x15d05a>_0x3ec8a5;},'FwiLw':function(_0x16da57,_0x552b2e){return _0x16da57===_0x552b2e;},'TYvVa':_0x5f1a8e(0x325,'%lRS'),'MEPaw':_0x5f1a8e(0x2e1,']F3Q'),'wXGAv':function(_0x2a2f87,_0x2c5c78){return _0x2a2f87===_0x2c5c78;},'ethEk':_0x5f1a8e(0x1a3,'@BXE'),'FJnoW':function(_0x164815,_0x1f6432){return _0x164815!==_0x1f6432;},'QaQcw':_0x5f1a8e(0x17e,'FOZy'),'euQmG':_0x5f1a8e(0x323,']H&!'),'LDmzA':_0x5f1a8e(0x12d,'%lRS'),'LFkiU':function(_0x3fe6aa,_0x88da77){return _0x3fe6aa==_0x88da77;},'Idntv':_0x5f1a8e(0x13d,'sJJh'),'QWpnM':function(_0x2c692a){return _0x2c692a();},'EXzEN':_0x5f1a8e(0x3ee,'ydF&'),'NOtOD':_0x5f1a8e(0x38a,'@8@#'),'ugJdv':_0x5f1a8e(0x3b7,')0XC'),'QZpEs':_0x5f1a8e(0x158,'IEiV'),'qiwqZ':_0x5f1a8e(0x33b,']Hcu'),'AcHpR':_0x5f1a8e(0x256,'2Ks]'),'wFPLV':_0x5f1a8e(0x1a6,'(GdC'),'LqOvw':_0x5f1a8e(0x14d,'4lwP')};let _0x345b3e={'contentType':_0x159d5b[_0x5f1a8e(0x3b4,'sJJh')],'qids':_0x159d5b[_0x5f1a8e(0x358,'SI!R')],'checkLevel':0x1},_0x4971e7={'appId':_0x159d5b[_0x5f1a8e(0x2d2,'$]Ws')],'functionId':_0x159d5b[_0x5f1a8e(0x347,'enZS')],'body':_0x345b3e,'appid':_0x159d5b[_0x5f1a8e(0x2d0,'Z@Iq')],'user':$[_0x5f1a8e(0x23d,'(GdC')],'code':0x1,'ua':$['UA']};_0x345b3e=await _0x4c48fa[_0x5f1a8e(0x31a,'8]WM')](_0x4971e7);let _0x5a1bf7={'url':_0x5f1a8e(0x171,'Z@Iq'),'body':_0x345b3e,'headers':{'User-Agent':$['UA'],'Cookie':cookie,'Origin':_0x159d5b[_0x5f1a8e(0x2ff,'IEiV')],'Referer':_0x159d5b[_0x5f1a8e(0x34d,'@HV!')]}};return new Promise(async _0x4bed29=>{const _0x1ea5c0=_0x5f1a8e,_0x1c693c={'SSWVk':function(_0x544039,_0x9994a3){const _0x3c9f01=_0x1aec;return _0x159d5b[_0x3c9f01(0x401,'fhDv')](_0x544039,_0x9994a3);},'kbwOd':function(_0x57c188,_0x5f1a07){const _0x19deaf=_0x1aec;return _0x159d5b[_0x19deaf(0x3e6,'Ec1s')](_0x57c188,_0x5f1a07);},'cDAwi':_0x159d5b[_0x1ea5c0(0x146,'eNvX')]};$[_0x1ea5c0(0x1b9,'FOZy')](_0x5a1bf7,async(_0x5189b6,_0xffbb69,_0x1127a1)=>{const _0x52752d=_0x1ea5c0,_0xd17e21={'bgsSd':_0x159d5b[_0x52752d(0x340,'IEiV')],'GsmAU':function(_0x464543,_0x6abe21){const _0x5e5efb=_0x52752d;return _0x159d5b[_0x5e5efb(0x264,'buq1')](_0x464543,_0x6abe21);}};if(_0x159d5b[_0x52752d(0x1c8,'FOZy')](_0x159d5b[_0x52752d(0x312,'buq1')],_0x159d5b[_0x52752d(0x2a5,'sJJh')]))_0x4902aa[_0x52752d(0x39a,'wW4]')](_0x524864,_0x34ca49);else try{if(_0x159d5b[_0x52752d(0x34c,'vQYO')](_0x159d5b[_0x52752d(0x1d7,'@HV!')],_0x159d5b[_0x52752d(0x3d6,'sJJh')])){if(_0x5189b6){if(_0x159d5b[_0x52752d(0x21a,'ocQK')](_0x159d5b[_0x52752d(0x1b5,'8]WM')],_0x159d5b[_0x52752d(0x27d,'sJJh')]))console[_0x52752d(0x37a,'MFDc')](''+JSON[_0x52752d(0x32b,'8]WM')](_0x5189b6)),console[_0x52752d(0x125,'Ec1s')](_0x52752d(0x386,'buq1'));else{_0x4a1c68=_0xb69718[_0x52752d(0x140,'MFDc')](_0x2b1cf6);if(_0x1c693c[_0x52752d(0x406,'QiPy')](_0x3eeffc[_0x52752d(0x1ee,'7py5')],0x0))_0x47e062[_0x52752d(0x189,'U0]2')]=_0x332966[_0x52752d(0x2aa,'enZS')][_0x52752d(0x2f0,'FOZy')]+'个',_0x1c693c[_0x52752d(0x3b2,'MFDc')](_0x3f0c73[_0x52752d(0x330,'XjyN')][_0x52752d(0x2b4,'@HV!')],0x7530)&&(_0x4aa652[_0x52752d(0x3e1,'f7Kx')]+=_0x52752d(0x2c1,']H&!'));else{}}}else{if(_0x159d5b[_0x52752d(0x1ea,'f7Kx')](_0x159d5b[_0x52752d(0x246,'SI!R')],_0x159d5b[_0x52752d(0x222,'925D')])){_0x1127a1=JSON[_0x52752d(0x173,'@BXE')](_0x1127a1);if(_0x159d5b[_0x52752d(0x2d4,'Ec1s')](_0x1127a1[_0x52752d(0x24f,'ocQK')],0x1a1b98))_0x159d5b[_0x52752d(0x155,'#i#A')](_0x159d5b[_0x52752d(0x223,'XjyN')],_0x159d5b[_0x52752d(0x1f2,'2Ks]')])?_0x284ed4[_0x52752d(0x276,'%lRS')](_0xd17e21[_0x52752d(0x234,'(GdC')]):$[_0x52752d(0x1c4,'!MwW')]=_0x1127a1['rs'][_0x52752d(0x278,'^lT%')][_0x52752d(0x1ce,'ydF&')]?!![]:![];else{}}else _0x22e9b7[_0x52752d(0x1d1,'fhDv')](_0x1c693c[_0x52752d(0x179,'buq1')]);}}else _0x4e8682[_0x52752d(0x348,'@BXE')]=_0x2af8e4[_0x52752d(0x2aa,'enZS')][_0x52752d(0x3b3,'Uj*!')]+'个',_0xd17e21[_0x52752d(0x16b,'925D')](_0x55dc47[_0x52752d(0x1f7,'VeAr')][_0x52752d(0x145,'mH5C')],0x7530)&&(_0x902b19[_0x52752d(0x153,'#i#A')]+=_0x52752d(0x271,'ZP$#'));}catch(_0x519fed){$[_0x52752d(0x185,'sJJh')](_0x519fed,_0xffbb69);}finally{_0x159d5b[_0x52752d(0x299,'TSl*')](_0x4bed29);}});});}function wb_info(){const _0x1d2f68=_0x4d7d2b,_0xd0eb5a={'yumJV':function(_0x545b2a,_0x49b75c){return _0x545b2a!==_0x49b75c;},'dUZPk':_0x1d2f68(0x3c3,'ydF&'),'TXuYd':function(_0x252178,_0x4206c1){return _0x252178===_0x4206c1;},'gMKsA':_0x1d2f68(0x3a0,'k@yV'),'HogMb':_0x1d2f68(0x26c,'k@yV'),'DEBYb':function(_0x1b3bad,_0x3c19d5){return _0x1b3bad!==_0x3c19d5;},'RLCJj':_0x1d2f68(0x32e,']H&!'),'mnEsh':_0x1d2f68(0x1a5,'M#n3'),'SAXOB':_0x1d2f68(0x14a,']F3Q'),'qZUru':function(_0x23b95b){return _0x23b95b();},'LiAbS':_0x1d2f68(0x3ca,'fhDv')};return new Promise(async _0x3fefc7=>{const _0x2a7aca=_0x1d2f68,_0x56ef6d={'url':_0x2a7aca(0x1e4,'@HV!'),'body':_0x2a7aca(0x2ea,'IEiV')+Date[_0x2a7aca(0x211,'ydF&')](),'headers':{'Cookie':cookie,'content-type':_0x2a7aca(0x392,'sJJh'),'Origin':_0x2a7aca(0x3f1,')0XC'),'Referer':_0x2a7aca(0x3cc,'@HV!'),'User-Agent':$['UA']},'ciphers':_0xd0eb5a[_0x2a7aca(0x233,'TSl*')],'timeout':0x7530};$[_0x2a7aca(0x217,'mH5C')](_0x56ef6d,(_0x279227,_0xcfd74c,_0x415a3e)=>{const _0x4c7d04=_0x2a7aca;try{if(_0xd0eb5a[_0x4c7d04(0x2b2,'k@yV')](_0xd0eb5a[_0x4c7d04(0x141,'SI!R')],_0xd0eb5a[_0x4c7d04(0x31e,'Z@Iq')]))_0x554b89[_0x4c7d04(0x2f4,'ocQK')](_0x5e57b4,_0x15124e);else{if(_0x279227)$[_0x4c7d04(0x298,'fhDv')](_0x279227);else{if(_0xd0eb5a[_0x4c7d04(0x24d,'U0]2')](_0xd0eb5a[_0x4c7d04(0x20a,'buq1')],_0xd0eb5a[_0x4c7d04(0x15a,'MFDc')]))_0x39dc68[_0x4c7d04(0x125,'Ec1s')](_0x4c7d04(0x1e7,'mH5C')),_0x54f1bd[_0x4c7d04(0x3fc,'ZP$#')](_0x5eae92);else{if(_0x415a3e){_0x415a3e=$[_0x4c7d04(0x236,']Hcu')](_0x415a3e);if(_0x415a3e[_0x4c7d04(0x253,'Z@Iq')])try{_0xd0eb5a[_0x4c7d04(0x286,'dnS(')](_0xd0eb5a[_0x4c7d04(0x1ba,'!MwW')],_0xd0eb5a[_0x4c7d04(0x24c,'enZS')])?($[_0x4c7d04(0x2ec,'vQYO')]=_0x415a3e[_0x4c7d04(0x1d0,'FOZy')][_0x4c7d04(0x311,'XjyN')][_0x4c7d04(0x382,'!MwW')][0x0][_0x4c7d04(0x22f,'5@tD')]||0x0,$[_0x4c7d04(0x2c8,'fhDv')]=_0x415a3e[_0x4c7d04(0x15f,'fhDv')][_0x4c7d04(0x363,'%lRS')][_0x4c7d04(0x163,'4lwP')][0x0][_0x4c7d04(0x34b,'VeAr')]||0x0):_0x535a50[_0x4c7d04(0x167,'f7Kx')](_0xa8ee68,_0x550da4);}catch{}}else $[_0x4c7d04(0x2e9,'SI!R')](_0xd0eb5a[_0x4c7d04(0x37c,'IEiV')]);}}}}catch(_0x6e594c){$[_0x4c7d04(0x381,'enZS')](_0x6e594c);}finally{_0xd0eb5a[_0x4c7d04(0x249,'U0]2')](_0x3fefc7);}});});}async function sqb(){const _0x994797=_0x4d7d2b,_0x28be38={'ilaiZ':function(_0x2c3381,_0x5d20c7){return _0x2c3381(_0x5d20c7);},'djXso':function(_0x39405a,_0x7f4d46){return _0x39405a===_0x7f4d46;},'ktWIk':_0x994797(0x184,'4lwP'),'YJLYB':function(_0x3708c9,_0x3f4029){return _0x3708c9==_0x3f4029;},'vbIGn':_0x994797(0x1f3,'!W&X'),'ZbBTY':function(_0x3fd3fe,_0xe2a444){return _0x3fd3fe>_0xe2a444;},'BWivk':function(_0x58032a){return _0x58032a();},'tTijj':_0x994797(0x2d5,'5@tD'),'MCjdK':_0x994797(0x3db,'wW4]'),'YgBud':_0x994797(0x170,'dnS('),'gDIsw':_0x994797(0x32d,'Uj*!'),'SkopU':_0x994797(0x3f6,'%yei'),'XBYfb':_0x994797(0x220,'TSl*'),'OXmzz':_0x994797(0x35b,'s8Ix'),'SIMrQ':_0x994797(0x3a8,'enZS'),'fEEwa':_0x994797(0x15d,'@BXE'),'xdSit':_0x994797(0x3bb,'buq1'),'jMWlK':_0x994797(0x273,'SI!R'),'SwpJl':_0x994797(0x344,'%yei'),'wytZk':_0x994797(0x17a,'Uj*!'),'AluQs':_0x994797(0x38f,'vQYO'),'MZRwY':_0x994797(0x188,'$]Ws')};let _0x30e34c=_0x28be38[_0x994797(0x177,']F3Q')],_0x351fcf={'source':_0x28be38[_0x994797(0x2c2,'s8Ix')]},_0x43edda={'appId':_0x28be38[_0x994797(0x310,'XjyN')],'fn':_0x30e34c,'body':_0x351fcf,'apid':_0x28be38[_0x994797(0x2e5,'%yei')],'ver':_0x28be38[_0x994797(0x201,'M#n3')],'cl':_0x28be38[_0x994797(0x133,'4lwP')],'user':$[_0x994797(0x3b8,'2Ks]')],'code':0x1,'ua':$['UA']};_0x351fcf=await _0x4073f3[_0x994797(0x1ca,'sJJh')](_0x43edda);if(!_0x351fcf)return;return new Promise(async _0x516435=>{const _0x2775cc=_0x994797,_0x95eede={'ruNCP':function(_0x4d742b,_0x417268){const _0x54149e=_0x1aec;return _0x28be38[_0x54149e(0x18b,'TSl*')](_0x4d742b,_0x417268);},'LCVkG':function(_0x13efa4,_0x2de190){const _0xb3cce4=_0x1aec;return _0x28be38[_0xb3cce4(0x24e,'M#n3')](_0x13efa4,_0x2de190);},'UNpBZ':_0x28be38[_0x2775cc(0x17d,'U0]2')],'XMFKi':function(_0x4edc3c,_0x2a3abd){const _0x29f784=_0x2775cc;return _0x28be38[_0x29f784(0x1cd,'Uj*!')](_0x4edc3c,_0x2a3abd);},'KiYpr':_0x28be38[_0x2775cc(0x3d4,'sJJh')],'jchkH':function(_0x1e37d1,_0x179703){const _0x2ef144=_0x2775cc;return _0x28be38[_0x2ef144(0x2b0,'sJJh')](_0x1e37d1,_0x179703);},'mKRUJ':function(_0x476987){const _0x350adc=_0x2775cc;return _0x28be38[_0x350adc(0x244,'s8Ix')](_0x476987);}},_0x2d2be1={'url':_0x2775cc(0x3f7,'@8@#'),'body':_0x2775cc(0x1bc,'IEiV')+_0x351fcf,'headers':{'Host':_0x28be38[_0x2775cc(0x1b8,'8]WM')],'Referer':_0x28be38[_0x2775cc(0x2d1,'s8Ix')],'User-Agent':$['UA'],'cookie':cookie,'wqreferer':_0x28be38[_0x2775cc(0x251,']H&!')],'x-rp-client':_0x28be38[_0x2775cc(0x2d3,'k@yV')],'accept-language':_0x28be38[_0x2775cc(0x362,'925D')],'Accept-Encoding':_0x28be38[_0x2775cc(0x34a,'@8@#')],'x-referer-page':_0x28be38[_0x2775cc(0x309,'5@tD')],'x-referer-package':_0x28be38[_0x2775cc(0x3eb,'dnS(')],'accept':_0x28be38[_0x2775cc(0x30d,'enZS')]}};$[_0x2775cc(0x210,'M#n3')](_0x2d2be1,(_0x21f995,_0x54da4b,_0xcfdb2a)=>{const _0x4797d9=_0x2775cc,_0x3e1e6b={'vGASg':function(_0x12bb89,_0x16b2cb){const _0x5d4eab=_0x1aec;return _0x95eede[_0x5d4eab(0x30f,'dnS(')](_0x12bb89,_0x16b2cb);}};try{if(_0x21f995)_0x95eede[_0x4797d9(0x2c3,'FOZy')](_0x95eede[_0x4797d9(0x287,'sJJh')],_0x95eede[_0x4797d9(0x28e,']F3Q')])?($[_0x4797d9(0x20d,'MFDc')](_0x21f995),console[_0x4797d9(0x37a,'MFDc')](_0x4797d9(0x24b,']Hcu'))):_0x3e1e6b[_0x4797d9(0x14c,'Ec1s')](_0x215d98,_0x1ef0ae);else{_0xcfdb2a=JSON[_0x4797d9(0x175,'fhDv')](_0xcfdb2a);if(_0x95eede[_0x4797d9(0x317,'XjyN')](_0xcfdb2a[_0x4797d9(0x17c,'k@yV')],0x0))_0x95eede[_0x4797d9(0x1c0,'wW4]')](_0x95eede[_0x4797d9(0x22c,'ocQK')],_0x95eede[_0x4797d9(0x20c,'#i#A')])?($[_0x4797d9(0x326,'mH5C')]=_0xcfdb2a[_0x4797d9(0x1af,'%lRS')][_0x4797d9(0x159,'%yei')]+'个',_0x95eede[_0x4797d9(0x3c6,'mH5C')](_0xcfdb2a[_0x4797d9(0x213,'$]Ws')][_0x4797d9(0x23f,'#i#A')],0x7530)&&($[_0x4797d9(0x3c1,'VeAr')]+=_0x4797d9(0x397,')0XC'))):_0x416dda[_0x4797d9(0x296,'s8Ix')](_0xc7baf9,_0x8ca431);else{}}}catch(_0x2d936c){$[_0x4797d9(0x369,'@BXE')](_0x2d936c);}finally{_0x95eede[_0x4797d9(0x263,'f7Kx')](_0x516435);}});});}var version_ = 'jsjiami.com.v7';
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