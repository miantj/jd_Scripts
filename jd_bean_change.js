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

var _0xod7='jsjiami.com.v7';const _0x5544f7=_0x55d7;(function(_0x403a3b,_0x1443b1,_0x34747a,_0x24113a,_0x36e24a,_0x4f0580,_0x194e4b){return _0x403a3b=_0x403a3b>>0x5,_0x4f0580='hs',_0x194e4b='hs',function(_0x2fc1ea,_0x1ccd6b,_0x3af41f,_0x16ded4,_0x22519d){const _0x39df3e=_0x55d7;_0x16ded4='tfi',_0x4f0580=_0x16ded4+_0x4f0580,_0x22519d='up',_0x194e4b+=_0x22519d,_0x4f0580=_0x3af41f(_0x4f0580),_0x194e4b=_0x3af41f(_0x194e4b),_0x3af41f=0x0;const _0x48032b=_0x2fc1ea();while(!![]&&--_0x24113a+_0x1ccd6b){try{_0x16ded4=-parseInt(_0x39df3e(0x37d,'K5xH'))/0x1*(parseInt(_0x39df3e(0x1fe,'tr7*'))/0x2)+-parseInt(_0x39df3e(0x357,'e85a'))/0x3+-parseInt(_0x39df3e(0x3c1,'1q(M'))/0x4*(-parseInt(_0x39df3e(0x422,'fZqO'))/0x5)+parseInt(_0x39df3e(0x415,'EjdX'))/0x6+-parseInt(_0x39df3e(0x335,'3kz^'))/0x7*(parseInt(_0x39df3e(0x301,'24b['))/0x8)+-parseInt(_0x39df3e(0x30e,'7V%d'))/0x9*(parseInt(_0x39df3e(0x1d3,'1ClJ'))/0xa)+parseInt(_0x39df3e(0x3b8,'isAf'))/0xb*(parseInt(_0x39df3e(0x3fc,'isAf'))/0xc);}catch(_0x2d2835){_0x16ded4=_0x3af41f;}finally{_0x22519d=_0x48032b[_0x4f0580]();if(_0x403a3b<=_0x24113a)_0x3af41f?_0x36e24a?_0x16ded4=_0x22519d:_0x36e24a=_0x22519d:_0x3af41f=_0x22519d;else{if(_0x3af41f==_0x36e24a['replace'](/[FHpeEAdUqXCbgMOlB=]/g,'')){if(_0x16ded4===_0x1ccd6b){_0x48032b['un'+_0x4f0580](_0x22519d);break;}_0x48032b[_0x194e4b](_0x22519d);}}}}}(_0x34747a,_0x1443b1,function(_0x544293,_0x177de1,_0x1ac4c,_0x2129f6,_0x41df8b,_0x5b49b9,_0xbc70c1){return _0x177de1='\x73\x70\x6c\x69\x74',_0x544293=arguments[0x0],_0x544293=_0x544293[_0x177de1](''),_0x1ac4c=`\x72\x65\x76\x65\x72\x73\x65`,_0x544293=_0x544293[_0x1ac4c]('\x76'),_0x2129f6=`\x6a\x6f\x69\x6e`,(0x185c90,_0x544293[_0x2129f6](''));});}(0x18e0,0xc97c5,_0x4ec5,0xc9),_0x4ec5)&&(_0xod7=_0x4ec5);const _0x4a59fc=(function(){const _0x41dc02=_0x55d7,_0x48690d={'Rmfrm':function(_0x216f38,_0x406e10){return _0x216f38!==_0x406e10;},'DOVzt':_0x41dc02(0x26d,'WkdZ'),'ENicO':_0x41dc02(0x3b5,'7V%d')};let _0x25428b=!![];return function(_0x3ee0c6,_0x390ae9){const _0x3b1bad=_0x41dc02,_0x23fe3e={'oyguu':function(_0x44e360,_0x492ffd){const _0xccd1f3=_0x55d7;return _0x48690d[_0xccd1f3(0x3eb,'WkdZ')](_0x44e360,_0x492ffd);},'EIzhZ':_0x48690d[_0x3b1bad(0x3d8,'C]mw')],'hAHan':_0x48690d[_0x3b1bad(0x289,'eB*j')]},_0x478f91=_0x25428b?function(){const _0x3a413f=_0x3b1bad;if(_0x390ae9){if(_0x23fe3e[_0x3a413f(0x2f3,'dh%]')](_0x23fe3e[_0x3a413f(0x3dc,'isAf')],_0x23fe3e[_0x3a413f(0x24b,'#Rdh')])){const _0x1365fe=_0x390ae9[_0x3a413f(0x352,'cTo)')](_0x3ee0c6,arguments);return _0x390ae9=null,_0x1365fe;}else{_0x5dc7c4[_0x3a413f(0x2c3,'^(Ip')]=![];return;}}}:function(){};return _0x25428b=![],_0x478f91;};}()),_0x15271e=_0x4a59fc(this,function(){const _0x21d542=_0x55d7,_0x1bea4f={'ySWWm':_0x21d542(0x44d,'24b[')};return _0x15271e[_0x21d542(0x417,'hlq(')]()[_0x21d542(0x3f2,'K5xH')](_0x1bea4f[_0x21d542(0x2d1,'YmHl')])[_0x21d542(0x2f4,'fZqO')]()[_0x21d542(0x2f9,'C]mw')](_0x15271e)[_0x21d542(0x440,'^z%a')](_0x1bea4f[_0x21d542(0x270,'74^m')]);});_0x15271e();const _0x4b3786=require(_0x5544f7(0x1aa,'6&Qd')),_0x4eb8af=require(_0x5544f7(0x388,'isAf')),_0x311148=require(_0x5544f7(0x43f,'Ymzs')),_0x10f0ce=require(_0x5544f7(0x334,'$jni'));async function getuserinfo_6dy_bak(){const _0x2c5fa3=_0x5544f7,_0xfb6ccc={'jxger':_0x2c5fa3(0x32f,'YmHl'),'VsEWX':function(_0x230a5f,_0x1cf371){return _0x230a5f===_0x1cf371;},'cYnwQ':_0x2c5fa3(0x264,'eB*j'),'sOPmA':function(_0x62c51b,_0x1aa501){return _0x62c51b!==_0x1aa501;},'gZQPR':_0x2c5fa3(0x1e9,'24b['),'Fpjtr':function(_0x4ac707,_0x312bb7){return _0x4ac707===_0x312bb7;},'KlrQo':_0x2c5fa3(0x204,'dh%]'),'QOGDo':_0x2c5fa3(0x242,'0UPE'),'DqfXZ':function(_0x510b91,_0x47b163){return _0x510b91===_0x47b163;},'pEynI':_0x2c5fa3(0x173,'WkdZ'),'cyGNa':_0x2c5fa3(0x2f6,'Ts0X'),'QKNMo':function(_0xe3bb2,_0x408e7d){return _0xe3bb2===_0x408e7d;},'oXaNp':_0x2c5fa3(0x219,'^(Ip'),'ZNcLg':_0x2c5fa3(0x202,'Q9Xl'),'RluHJ':_0x2c5fa3(0x1b5,'$hJZ'),'cGsZI':function(_0x46a687,_0x8cb547){return _0x46a687==_0x8cb547;},'wpkkB':_0x2c5fa3(0x1f4,'Xn8f'),'FdSZA':function(_0x1fc742){return _0x1fc742();},'GKUtB':_0x2c5fa3(0x2e7,'$hJZ'),'DCmok':function(_0x273a05,_0x2e8f9e){return _0x273a05==_0x2e8f9e;},'sEHnb':_0x2c5fa3(0x350,'Ymzs'),'UumEg':_0x2c5fa3(0x1b6,'#SLf'),'EWDdq':_0x2c5fa3(0x1cd,'hUaS'),'Ariyq':_0x2c5fa3(0x225,'7V%d'),'WsYkP':_0x2c5fa3(0x367,'$hJZ')};let _0xba4772={'url':_0xfb6ccc[_0x2c5fa3(0x31a,'dh%]')],'headers':{'Accept':_0xfb6ccc[_0x2c5fa3(0x22d,'!TDk')],'accept-encoding':_0xfb6ccc[_0x2c5fa3(0x2a0,'C]mw')],'content-type':_0xfb6ccc[_0x2c5fa3(0x40b,'iDgF')],'Cookie':cookie,'User-Agent':$['UA']}};return new Promise(_0x488f3c=>{const _0x52754f=_0x2c5fa3,_0x44dcff={'wpebn':function(_0x109297,_0x1057b5){const _0x54910e=_0x55d7;return _0xfb6ccc[_0x54910e(0x3a6,'hUaS')](_0x109297,_0x1057b5);},'nXGfb':_0xfb6ccc[_0x52754f(0x21b,'@Oa$')],'daqGC':_0xfb6ccc[_0x52754f(0x1c2,'vWEH')],'SEvbK':_0xfb6ccc[_0x52754f(0x21e,'fZqO')],'xTNiM':function(_0x4b0f44,_0xa6a75d){const _0x549598=_0x52754f;return _0xfb6ccc[_0x549598(0x1ff,'Z6$Z')](_0x4b0f44,_0xa6a75d);}};_0xfb6ccc[_0x52754f(0x3b4,'WkdZ')](_0xfb6ccc[_0x52754f(0x23c,'iDgF')],_0xfb6ccc[_0x52754f(0x237,'!TDk')])?_0x596d5c[_0x52754f(0x44a,'6&Qd')](_0xfb6ccc[_0x52754f(0x213,'fZqO')]):$[_0x52754f(0x2ab,'YmHl')](_0xba4772,async(_0x238570,_0x49a509,_0x4d7ac3)=>{const _0x3bbc2d=_0x52754f,_0x49774b={'qIblS':_0xfb6ccc[_0x3bbc2d(0x28e,'74^m')]};if(_0xfb6ccc[_0x3bbc2d(0x390,'e85a')](_0xfb6ccc[_0x3bbc2d(0x30b,'WkdZ')],_0xfb6ccc[_0x3bbc2d(0x359,'1q(M')]))try{if(_0x238570)console[_0x3bbc2d(0x18d,'92mQ')](''+JSON[_0x3bbc2d(0x44b,'Ymzs')](_0x238570)),console[_0x3bbc2d(0x346,'Ts0X')](_0x3bbc2d(0x222,'tr7*'));else{if(_0xfb6ccc[_0x3bbc2d(0x3b4,'WkdZ')](_0xfb6ccc[_0x3bbc2d(0x19b,'mN5O')],_0xfb6ccc[_0x3bbc2d(0x3ca,'tr7*')]))_0x59c88[_0x3bbc2d(0x363,'@Oa$')](''+_0x5ac31a[_0x3bbc2d(0x36c,'^(Ip')](_0x50b1d8)),_0xd53a25[_0x3bbc2d(0x361,'(#jn')](_0x3bbc2d(0x3d4,'74^m'));else{if(_0x4d7ac3){if(_0xfb6ccc[_0x3bbc2d(0x29e,'Xn8f')](_0xfb6ccc[_0x3bbc2d(0x175,'#SLf')],_0xfb6ccc[_0x3bbc2d(0x3f5,'cTo)')]))_0x4565f7[_0x3bbc2d(0x1d4,'iDgF')](_0x4f2821,_0x4108a2);else{_0x4d7ac3=JSON[_0x3bbc2d(0x3ff,'24b[')](_0x4d7ac3);if(_0xfb6ccc[_0x3bbc2d(0x18e,'Z6$Z')](_0x4d7ac3[_0xfb6ccc[_0x3bbc2d(0x3a5,'#SLf')]],_0xfb6ccc[_0x3bbc2d(0x22a,'q(jj')])){if(_0xfb6ccc[_0x3bbc2d(0x3d6,'G4wp')](_0xfb6ccc[_0x3bbc2d(0x29c,'ggm2')],_0xfb6ccc[_0x3bbc2d(0x32c,'3kz^')]))_0x172057[_0x3bbc2d(0x40c,'vWEH')](_0x49774b[_0x3bbc2d(0x28b,'e85a')]);else{$[_0x3bbc2d(0x3d0,'G4wp')]=![];return;}}if(_0xfb6ccc[_0x3bbc2d(0x3d3,'EjdX')](_0x4d7ac3[_0x3bbc2d(0x394,'fZqO')],'0')&&_0x4d7ac3[_0x3bbc2d(0x3f1,'Wb[u')]){const _0x2ce75d=_0xfb6ccc[_0x3bbc2d(0x411,'Wb[u')][_0x3bbc2d(0x407,'Ts0X')]('|');let _0x2b4f53=0x0;while(!![]){switch(_0x2ce75d[_0x2b4f53++]){case'0':$[_0x3bbc2d(0x423,'hUaS')]=_0x4d7ac3[_0x3bbc2d(0x33f,'vWEH')]?.[_0x3bbc2d(0x1cc,'ynBt')]?.[_0x3bbc2d(0x2d3,'@Oa$')]?.[_0x3bbc2d(0x316,'dh%]')];continue;case'1':$[_0x3bbc2d(0x1d7,'1ClJ')]=_0xfb6ccc[_0x3bbc2d(0x379,'!TDk')](_0x4d7ac3[_0x3bbc2d(0x303,'okvo')]?.[_0x3bbc2d(0x1cc,'ynBt')]?.[_0x3bbc2d(0x1c9,'X$H7')],0x1);continue;case'2':$[_0x3bbc2d(0x2a8,'Xn8f')]=$[_0x3bbc2d(0x265,'92mQ')];continue;case'3':$[_0x3bbc2d(0x1eb,'vyz@')]=_0x4d7ac3[_0x3bbc2d(0x3fd,'mN5O')]?.[_0x3bbc2d(0x3cb,'Wb[u')]?.[_0x3bbc2d(0x3e3,'1q(M')]||'';continue;case'4':$[_0x3bbc2d(0x3e1,'7V%d')]=_0x4d7ac3[_0x3bbc2d(0x1f5,'ggm2')]?.[_0x3bbc2d(0x1db,'R(Mj')]?.[_0x3bbc2d(0x287,'(#jn')]||0x0;continue;}break;}}}}else{if(_0xfb6ccc[_0x3bbc2d(0x449,'1ClJ')](_0xfb6ccc[_0x3bbc2d(0x1bb,'R(Mj')],_0xfb6ccc[_0x3bbc2d(0x1c1,'e85a')])){_0x28c206=_0x42dcb3[_0x3bbc2d(0x405,'eB*j')](_0x9465d1);if(_0x44dcff[_0x3bbc2d(0x3f9,'(#jn')](_0x7ebef9[_0x44dcff[_0x3bbc2d(0x2e8,'K5xH')]],_0x44dcff[_0x3bbc2d(0x19f,'^(Ip')])){_0x75d701[_0x3bbc2d(0x2bf,'Xn8f')]=![];return;}if(_0x44dcff[_0x3bbc2d(0x229,'^(Ip')](_0x365d36[_0x3bbc2d(0x35f,'0UPE')],'0')&&_0x1c35b0[_0x3bbc2d(0x256,'tr7*')]){const _0x4e176b=_0x44dcff[_0x3bbc2d(0x2f5,'6&Qd')][_0x3bbc2d(0x2c1,'R(Mj')]('|');let _0x4c73d7=0x0;while(!![]){switch(_0x4e176b[_0x4c73d7++]){case'0':_0x531006[_0x3bbc2d(0x2f8,'hlq(')]=_0x44dcff[_0x3bbc2d(0x2a2,'!TDk')](_0x36ec76[_0x3bbc2d(0x3f3,'(#jn')]?.[_0x3bbc2d(0x232,'okvo')]?.[_0x3bbc2d(0x21d,'^z%a')],0x1);continue;case'1':_0x304fc4[_0x3bbc2d(0x401,'Ymzs')]=_0x485c11[_0x3bbc2d(0x40f,'X$H7')];continue;case'2':_0x29e844[_0x3bbc2d(0x2cb,'74^m')]=_0xb2a0d1[_0x3bbc2d(0x33c,'$hJZ')]?.[_0x3bbc2d(0x2f7,'3kz^')]?.[_0x3bbc2d(0x1ec,'Ymzs')]?.[_0x3bbc2d(0x437,'fZqO')];continue;case'3':_0x269492[_0x3bbc2d(0x3db,'0UPE')]=_0x7fd504[_0x3bbc2d(0x41f,'K5xH')]?.[_0x3bbc2d(0x333,'6&Qd')]?.[_0x3bbc2d(0x1ba,'cTo)')]||'';continue;case'4':_0x342658[_0x3bbc2d(0x434,'cTo)')]=_0x502f01[_0x3bbc2d(0x1c3,'q(jj')]?.[_0x3bbc2d(0x43e,'hlq(')]?.[_0x3bbc2d(0x196,'WkdZ')]||0x0;continue;}break;}}}else $[_0x3bbc2d(0x397,'R(Mj')](_0xfb6ccc[_0x3bbc2d(0x2a4,'hUaS')]);}}}}catch(_0x3856a9){$[_0x3bbc2d(0x3d9,'$jni')](_0x3856a9,_0x49a509);}finally{_0xfb6ccc[_0x3bbc2d(0x35c,'^z%a')](_0x488f3c);}else _0x59dcc7[_0x3bbc2d(0x2aa,'eB*j')](_0x39461a),_0x4cd4dc[_0x3bbc2d(0x397,'R(Mj')](_0x3bbc2d(0x1c6,'mN5O'));});});}async function getuserinfo_6dy(){const _0x363f1b=_0x5544f7,_0x40dcdf={'ZxZUz':_0x363f1b(0x3fb,'G4wp'),'WHNYx':function(_0x52b699,_0x4c3b22){return _0x52b699==_0x4c3b22;},'vdKnp':function(_0x1751a9,_0x2609be){return _0x1751a9===_0x2609be;},'ULPnh':_0x363f1b(0x28d,'e85a'),'cwKkN':function(_0x2fd325,_0x19202c){return _0x2fd325===_0x19202c;},'gjXZd':_0x363f1b(0x3e2,'G4wp'),'hmDyj':_0x363f1b(0x3c5,'okvo'),'WXivu':function(_0x23252c,_0x4ea820){return _0x23252c===_0x4ea820;},'xTUxT':_0x363f1b(0x2c7,'6&Qd'),'Ylrvq':_0x363f1b(0x300,'^(Ip'),'JTqup':function(_0x555a2e,_0x299973){return _0x555a2e===_0x299973;},'mnxVX':_0x363f1b(0x1af,'Q9Xl'),'QPHZD':function(_0x52168f,_0x38b8b9){return _0x52168f==_0x38b8b9;},'obCuo':_0x363f1b(0x433,'WkdZ'),'jJpuj':function(_0x57c56f,_0x377d14){return _0x57c56f!==_0x377d14;},'KWSdP':_0x363f1b(0x3be,'R(Mj'),'XgjVT':function(_0x2e43df){return _0x2e43df();},'UWJZo':_0x363f1b(0x188,'EjdX'),'EJfSW':_0x363f1b(0x18c,'dh%]'),'qXEDh':_0x363f1b(0x1c8,'ggm2'),'fGExv':_0x363f1b(0x20f,'tr7*'),'lNLQc':_0x363f1b(0x30c,'Ts0X'),'FFzzC':_0x363f1b(0x371,'Xn8f'),'qCHWG':_0x363f1b(0x375,'(#jn'),'jxDSv':_0x363f1b(0x17a,'^z%a'),'vcgpu':_0x363f1b(0x25f,'X$H7'),'IzpOH':_0x363f1b(0x1c0,'Wb[u'),'mNdcS':_0x363f1b(0x1f2,'$hJZ'),'IrJbd':_0x363f1b(0x32b,'e85a'),'ParhD':_0x363f1b(0x38e,'K5xH'),'hjtEp':_0x363f1b(0x35d,'1ClJ'),'RsTWj':_0x363f1b(0x246,'#Rdh'),'wweJk':_0x363f1b(0x26a,'(#jn'),'iTJcs':_0x363f1b(0x339,'q(jj'),'BiSiT':_0x363f1b(0x17b,'Xn8f'),'wGVEh':_0x363f1b(0x28a,'isAf'),'nQUGh':_0x363f1b(0x360,'Xn8f')};let _0x44147b={'orgFlag':_0x40dcdf[_0x363f1b(0x328,'$hJZ')],'callSource':_0x40dcdf[_0x363f1b(0x44c,'ynBt')],'channel':0x1,'isHomewhite':0x1,'bizModelCode':'6','externalLoginType':'1','bizModeClientType':_0x40dcdf[_0x363f1b(0x208,'1ClJ')],'appId':_0x40dcdf[_0x363f1b(0x3f7,'vWEH')],'token':_0x40dcdf[_0x363f1b(0x421,'7V%d')],'tenantCode':_0x40dcdf[_0x363f1b(0x1a1,'okvo')],'uuid':'','client':_0x40dcdf[_0x363f1b(0x373,'tr7*')],'sourceType':_0x40dcdf[_0x363f1b(0x3dd,'#Rdh')]},_0x50f492={'appId':_0x40dcdf[_0x363f1b(0x42c,'mN5O')],'fn':_0x40dcdf[_0x363f1b(0x2db,'okvo')],'body':_0x44147b,'apid':_0x40dcdf[_0x363f1b(0x1f6,'@Oa$')],'client':_0x40dcdf[_0x363f1b(0x292,'Q9Xl')],'user':$[_0x363f1b(0x257,'^z%a')],'code':0x1,'ua':$['UA']};_0x44147b=await _0x4eb8af[_0x363f1b(0x26c,'hlq(')](_0x50f492);let _0x5bde43={'url':_0x363f1b(0x351,'ynBt')+_0x44147b+_0x363f1b(0x3a0,'isAf'),'headers':{'Accept':_0x40dcdf[_0x363f1b(0x183,'#SLf')],'accept-encoding':_0x40dcdf[_0x363f1b(0x198,'okvo')],'content-type':_0x40dcdf[_0x363f1b(0x35a,'3kz^')],'referer':_0x40dcdf[_0x363f1b(0x36b,'24b[')],'Cookie':cookie,'User-Agent':$['UA']},'ciphers':_0x40dcdf[_0x363f1b(0x428,'okvo')]};return new Promise(_0x2ea1dd=>{const _0x14c425=_0x363f1b,_0x4237a0={'nmxRf':_0x40dcdf[_0x14c425(0x369,'Q9Xl')]};_0x40dcdf[_0x14c425(0x2c5,'hUaS')](_0x40dcdf[_0x14c425(0x259,'cTo)')],_0x40dcdf[_0x14c425(0x243,'(#jn')])?$[_0x14c425(0x20e,'#SLf')](_0x5bde43,async(_0x55a950,_0x1f444e,_0x1c2aea)=>{const _0x1c3453=_0x14c425,_0x1abc2f={'YGUsc':_0x40dcdf[_0x1c3453(0x31e,'92mQ')],'MMEsY':function(_0x109132,_0x528c3){const _0x59ef0f=_0x1c3453;return _0x40dcdf[_0x59ef0f(0x3b2,'WkdZ')](_0x109132,_0x528c3);}};if(_0x40dcdf[_0x1c3453(0x182,'hlq(')](_0x40dcdf[_0x1c3453(0x27c,'1ClJ')],_0x40dcdf[_0x1c3453(0x2fb,'(#jn')]))try{if(_0x40dcdf[_0x1c3453(0x36a,'92mQ')](_0x40dcdf[_0x1c3453(0x3ab,'R(Mj')],_0x40dcdf[_0x1c3453(0x2e4,'tr7*')])){const _0x5e24b4=_0x1abc2f[_0x1c3453(0x353,'74^m')][_0x1c3453(0x190,'1ClJ')]('|');let _0xb67053=0x0;while(!![]){switch(_0x5e24b4[_0xb67053++]){case'0':_0x4a3ce9[_0x1c3453(0x39b,'^(Ip')]=_0x46877f[_0x1c3453(0x404,'WkdZ')]?.[_0x1c3453(0x366,'cTo)')]?.[_0x1c3453(0x3a3,'7V%d')]?.[_0x1c3453(0x1a2,'#Rdh')];continue;case'1':_0x1e3c78[_0x1c3453(0x29b,'X$H7')]=_0x37f725[_0x1c3453(0x34a,'^z%a')]?.[_0x1c3453(0x2f7,'3kz^')]?.[_0x1c3453(0x298,'#Rdh')]||'';continue;case'2':_0x1ba3a[_0x1c3453(0x325,'q(jj')]=_0x41b85d[_0x1c3453(0x3f1,'Wb[u')]?.[_0x1c3453(0x43c,'Wb[u')]?.[_0x1c3453(0x2dc,'X$H7')]||0x0;continue;case'3':_0x552e60[_0x1c3453(0x252,'eB*j')]=_0x3afe00[_0x1c3453(0x2e9,'$jni')];continue;case'4':_0x5b3b60[_0x1c3453(0x1c5,'vyz@')]=_0x1abc2f[_0x1c3453(0x29d,'EjdX')](_0x54e28e[_0x1c3453(0x33a,'Xn8f')]?.[_0x1c3453(0x254,'EjdX')]?.[_0x1c3453(0x393,'okvo')],0x1);continue;}break;}}else{if(_0x55a950)console[_0x1c3453(0x342,'ggm2')](''+JSON[_0x1c3453(0x1e5,'C]mw')](_0x55a950)),console[_0x1c3453(0x376,'fZqO')](_0x1c3453(0x3a9,'6&Qd'));else{if(_0x1c2aea){_0x1c2aea=JSON[_0x1c3453(0x337,'$hJZ')](_0x1c2aea);if(_0x40dcdf[_0x1c3453(0x294,'iDgF')](_0x1c2aea[_0x40dcdf[_0x1c3453(0x2a5,'mN5O')]],_0x40dcdf[_0x1c3453(0x27f,'iDgF')])){$[_0x1c3453(0x3e9,'YmHl')]=![];return;}if(_0x40dcdf[_0x1c3453(0x374,'WkdZ')](_0x1c2aea[_0x1c3453(0x297,'X$H7')],'0')&&_0x1c2aea[_0x1c3453(0x2bc,'pu3l')]){const _0x4de2b3=_0x40dcdf[_0x1c3453(0x269,'Z6$Z')][_0x1c3453(0x210,'Wb[u')]('|');let _0x5a0508=0x0;while(!![]){switch(_0x4de2b3[_0x5a0508++]){case'0':$[_0x1c3453(0x33e,'1ClJ')]=_0x1c2aea[_0x1c3453(0x32e,'R(Mj')]?.[_0x1c3453(0x176,'isAf')]?.[_0x1c3453(0x27a,'tr7*')]||0x0;continue;case'1':$[_0x1c3453(0x40d,'cTo)')]=_0x40dcdf[_0x1c3453(0x432,'^z%a')](_0x1c2aea[_0x1c3453(0x41f,'K5xH')]?.[_0x1c3453(0x2af,'Ymzs')]?.[_0x1c3453(0x3a8,'R(Mj')],0x1);continue;case'2':$[_0x1c3453(0x1f7,'WkdZ')]=_0x1c2aea[_0x1c3453(0x303,'okvo')]?.[_0x1c3453(0x276,'dh%]')]?.[_0x1c3453(0x336,'hlq(')]||'';continue;case'3':$[_0x1c3453(0x2a8,'Xn8f')]=$[_0x1c3453(0x23b,'eB*j')];continue;case'4':$[_0x1c3453(0x1a2,'#Rdh')]=_0x1c2aea[_0x1c3453(0x315,'X$H7')]?.[_0x1c3453(0x38b,'#SLf')]?.[_0x1c3453(0x293,'X$H7')]?.[_0x1c3453(0x1b3,'Ts0X')];continue;}break;}}}else $[_0x1c3453(0x2d4,'Xn8f')](_0x40dcdf[_0x1c3453(0x2dd,'Q9Xl')]);}}}catch(_0x479756){$[_0x1c3453(0x34f,'$hJZ')](_0x479756,_0x1f444e);}finally{_0x40dcdf[_0x1c3453(0x17d,'92mQ')](_0x40dcdf[_0x1c3453(0x31b,'q(jj')],_0x40dcdf[_0x1c3453(0x3c6,'Wb[u')])?_0x45ba20[_0x1c3453(0x356,'hUaS')](_0x4237a0[_0x1c3453(0x311,'okvo')]):_0x40dcdf[_0x1c3453(0x171,'mN5O')](_0x2ea1dd);}else _0x44f95e[_0x1c3453(0x1e2,'hUaS')](_0x4d023e,_0x1f7cf8);}):_0x33ca3b?(_0x1ad4b7[_0x14c425(0x180,'eB*j')](''+_0x457a2e[_0x14c425(0x18f,'0UPE')](_0x1bcb3e)),_0x387cfe[_0x14c425(0x420,'G4wp')](_0x14c425(0x19d,'hlq('))):(_0x40d0a9[_0x14c425(0x3f6,'mN5O')]=_0xc0dd89[_0x14c425(0x283,'K5xH')](/"score":(\d+)/)?_0x3f5c0a[_0x14c425(0x1fd,'24b[')](/"score":(\d+)/)[0x1]:0x0,_0x13a946[_0x14c425(0x2c0,'pu3l')]=_0x382fd4[_0x14c425(0x326,'(#jn')](/"currentBeanNum":(\d+)/)?_0x58e901[_0x14c425(0x3aa,'pu3l')](/"currentBeanNum":(\d+)/)[0x1]:0x0,_0x38c44a[_0x14c425(0x22b,'cTo)')]=_0x442e75[_0x14c425(0x1dc,'Xn8f')](/"showName":"(.*?)"/)?_0x26da01[_0x14c425(0x282,'7V%d')](/"showName":"(.*?)"/)[0x1]:_0x17eedf[_0x14c425(0x416,'Ymzs')]);});}async function _0x2dfb6e(){const _0x5346cc=_0x5544f7,_0xd9635b={'OcGjc':function(_0x2d4a23,_0x189147){return _0x2d4a23!==_0x189147;},'sWySd':_0x5346cc(0x387,'tr7*'),'TXJDl':function(_0x177bb7,_0x24f0d4){return _0x177bb7!==_0x24f0d4;},'kNGcw':_0x5346cc(0x1bc,'fZqO'),'iGvQq':function(_0x57f36b){return _0x57f36b();},'QzmuZ':_0x5346cc(0x1ef,'YmHl'),'CtTVn':_0x5346cc(0x448,'1q(M')};let _0x22e2d2={'url':_0x5346cc(0x262,'$hJZ'),'body':_0x5346cc(0x1a5,'(#jn')+Date[_0x5346cc(0x435,'okvo')]()+_0x5346cc(0x410,'iDgF'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Origin':_0xd9635b[_0x5346cc(0x2bd,'R(Mj')],'Referer':_0xd9635b[_0x5346cc(0x2d0,'okvo')]}};return new Promise(_0x3c8363=>{const _0x10d592=_0x5346cc,_0x380931={'zDgrf':function(_0x22d919,_0x23133a){const _0x42785f=_0x55d7;return _0xd9635b[_0x42785f(0x2b2,'R(Mj')](_0x22d919,_0x23133a);},'ibrog':_0xd9635b[_0x10d592(0x2ea,'@Oa$')],'DbGLu':function(_0x1d30f5,_0x200f23){const _0x5b1657=_0x10d592;return _0xd9635b[_0x5b1657(0x3cf,'1ClJ')](_0x1d30f5,_0x200f23);},'opbBM':_0xd9635b[_0x10d592(0x3b3,'Ts0X')],'tpRFz':function(_0x3e5038){const _0x1b86d2=_0x10d592;return _0xd9635b[_0x1b86d2(0x2e3,'Q9Xl')](_0x3e5038);}};$[_0x10d592(0x406,'G4wp')](_0x22e2d2,async(_0x2a35d8,_0x5135e5,_0x4c87c4)=>{const _0xe13917=_0x10d592;if(_0x380931[_0xe13917(0x354,'Ts0X')](_0x380931[_0xe13917(0x3f4,'G4wp')],_0x380931[_0xe13917(0x2b7,'vWEH')]))_0x185880[_0xe13917(0x2f1,'^z%a')]=_0x44ee76[_0xe13917(0x306,'0UPE')][_0xe13917(0x296,'3kz^')][_0xe13917(0x3a4,'okvo')][0x0][_0xe13917(0x263,'92mQ')]||0x0,_0x56001e[_0xe13917(0x3ac,'iDgF')]=_0x103902[_0xe13917(0x34c,'ynBt')][_0xe13917(0x224,'tr7*')][_0xe13917(0x327,'hlq(')][0x0][_0xe13917(0x192,'#Rdh')]||0x0;else try{_0x2a35d8?(console[_0xe13917(0x304,'EjdX')](''+JSON[_0xe13917(0x1e5,'C]mw')](_0x2a35d8)),console[_0xe13917(0x2cd,'YmHl')](_0xe13917(0x273,'eB*j'))):_0x380931[_0xe13917(0x3de,'6&Qd')](_0x380931[_0xe13917(0x33b,'#Rdh')],_0x380931[_0xe13917(0x1b4,'Z6$Z')])?_0x146d25[_0xe13917(0x2d7,'0UPE')]+=_0xe13917(0x400,'fZqO'):($[_0xe13917(0x203,'!TDk')]=_0x4c87c4[_0xe13917(0x284,'92mQ')](/"score":(\d+)/)?_0x4c87c4[_0xe13917(0x340,'eB*j')](/"score":(\d+)/)[0x1]:0x0,$[_0xe13917(0x381,'okvo')]=_0x4c87c4[_0xe13917(0x34b,'#SLf')](/"currentBeanNum":(\d+)/)?_0x4c87c4[_0xe13917(0x349,'WkdZ')](/"currentBeanNum":(\d+)/)[0x1]:0x0,$[_0xe13917(0x201,'$hJZ')]=_0x4c87c4[_0xe13917(0x3ba,'X$H7')](/"showName":"(.*?)"/)?_0x4c87c4[_0xe13917(0x1fd,'24b[')](/"showName":"(.*?)"/)[0x1]:$[_0xe13917(0x257,'^z%a')]);}catch(_0x3cd576){$[_0xe13917(0x2ff,'pu3l')](_0x3cd576,_0x5135e5);}finally{_0x380931[_0xe13917(0x2da,'!TDk')](_0x3c8363);}});});}async function queryScores(){const _0x1b3155=_0x5544f7,_0x3a26ee={'DzVHi':function(_0x52c31e,_0x52f8ca){return _0x52c31e==_0x52f8ca;},'LCeSX':function(_0x544e41,_0x1c7080){return _0x544e41!==_0x1c7080;},'VpPAw':_0x1b3155(0x445,'iDgF'),'KFUfI':function(_0x2d1d54,_0x4b5641){return _0x2d1d54===_0x4b5641;},'hoTMU':_0x1b3155(0x18b,'Ts0X'),'YovZJ':function(_0x4bcc72){return _0x4bcc72();},'nyUem':_0x1b3155(0x426,'hUaS'),'usVPt':_0x1b3155(0x274,'1ClJ'),'sAWpY':_0x1b3155(0x41d,'$hJZ'),'qbLUW':_0x1b3155(0x299,'74^m'),'NiBwO':_0x1b3155(0x174,'^z%a'),'tFxFf':_0x1b3155(0x2f2,'1ClJ')};let _0x33c6d7='',_0x9ccded={'appId':_0x3a26ee[_0x1b3155(0x1de,'cTo)')],'functionId':_0x3a26ee[_0x1b3155(0x1cb,'#Rdh')],'body':{},'appid':_0x3a26ee[_0x1b3155(0x185,'Ts0X')],'user':$[_0x1b3155(0x249,'cTo)')],'code':0x0,'ua':$['UA']};body=await _0x10f0ce[_0x1b3155(0x36d,'ggm2')](_0x9ccded);let _0x28d514={'url':_0x1b3155(0x358,'tr7*')+body+_0x1b3155(0x1e6,'tr7*'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Referer':_0x3a26ee[_0x1b3155(0x1c4,'fZqO')]}};return new Promise(_0x547858=>{const _0x3be6ea=_0x1b3155,_0x3c46f={'RUYQf':function(_0x3fefca,_0x27a401){const _0x3b9e71=_0x55d7;return _0x3a26ee[_0x3b9e71(0x2fe,'Wb[u')](_0x3fefca,_0x27a401);},'eoOrf':function(_0x2ec610,_0x29a03a){const _0x3e0336=_0x55d7;return _0x3a26ee[_0x3e0336(0x23e,'1ClJ')](_0x2ec610,_0x29a03a);},'bHxBj':_0x3a26ee[_0x3be6ea(0x267,'6&Qd')],'IyDmk':function(_0x1da782,_0x17b70b){const _0x31fa5b=_0x3be6ea;return _0x3a26ee[_0x31fa5b(0x2a3,'dh%]')](_0x1da782,_0x17b70b);},'dvSMo':_0x3a26ee[_0x3be6ea(0x199,'^(Ip')],'yYDoz':function(_0x4f7907){const _0x3f1f49=_0x3be6ea;return _0x3a26ee[_0x3f1f49(0x195,'hUaS')](_0x4f7907);}};_0x3a26ee[_0x3be6ea(0x207,'1q(M')](_0x3a26ee[_0x3be6ea(0x3e4,'#Rdh')],_0x3a26ee[_0x3be6ea(0x19e,'hlq(')])?$[_0x3be6ea(0x424,'pu3l')](_0x28d514,async(_0x40c060,_0x4251fa,_0x94c0f6)=>{const _0x5560b2=_0x3be6ea;try{const _0x3014db=JSON[_0x5560b2(0x419,'6&Qd')](_0x94c0f6);if(_0x3c46f[_0x5560b2(0x312,'#Rdh')](_0x3014db[_0x5560b2(0x3a2,'hUaS')],0x3e8)){if(_0x3c46f[_0x5560b2(0x431,'$hJZ')](_0x3c46f[_0x5560b2(0x2ef,'Ymzs')],_0x3c46f[_0x5560b2(0x398,'q(jj')])){if(_0x7a2bac){const _0x3ca76c=_0x388df4[_0x5560b2(0x3ce,'0UPE')](_0x30de81,arguments);return _0x4ea034=null,_0x3ca76c;}}else $[_0x5560b2(0x3da,'$jni')]=_0x3014db['rs'][_0x5560b2(0x205,'hlq(')][_0x5560b2(0x26f,'ynBt')];}}catch(_0x278cb7){$[_0x5560b2(0x228,'e85a')](_0x278cb7,_0x4251fa);}finally{if(_0x3c46f[_0x5560b2(0x1e3,'Q9Xl')](_0x3c46f[_0x5560b2(0x1f9,'74^m')],_0x3c46f[_0x5560b2(0x1fa,'Z6$Z')]))_0x3c46f[_0x5560b2(0x215,'Z6$Z')](_0x547858);else{_0x3d16ef[_0x5560b2(0x197,'24b[')]=![];return;}}}):_0x1a64f8[_0x3be6ea(0x446,'!TDk')]=_0x5c38c3['rs'][_0x3be6ea(0x317,'K5xH')][_0x3be6ea(0x2b6,'hUaS')]?!![]:![];});}function _0x55d7(_0x3d2924,_0x3806cd){const _0x5ed33d=_0x4ec5();return _0x55d7=function(_0x172e59,_0x2f4e36){_0x172e59=_0x172e59-0x16f;let _0x4ec522=_0x5ed33d[_0x172e59];if(_0x55d7['ANcxny']===undefined){var _0x55d73a=function(_0xebb108){const _0xb09cbf='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x13136c='',_0xc9dce1='',_0x5a018e=_0x13136c+_0x55d73a;for(let _0x272168=0x0,_0x32ee1e,_0x56bfe7,_0x2dbd5f=0x0;_0x56bfe7=_0xebb108['charAt'](_0x2dbd5f++);~_0x56bfe7&&(_0x32ee1e=_0x272168%0x4?_0x32ee1e*0x40+_0x56bfe7:_0x56bfe7,_0x272168++%0x4)?_0x13136c+=_0x5a018e['charCodeAt'](_0x2dbd5f+0xa)-0xa!==0x0?String['fromCharCode'](0xff&_0x32ee1e>>(-0x2*_0x272168&0x6)):_0x272168:0x0){_0x56bfe7=_0xb09cbf['indexOf'](_0x56bfe7);}for(let _0x43ad6a=0x0,_0xdfadc2=_0x13136c['length'];_0x43ad6a<_0xdfadc2;_0x43ad6a++){_0xc9dce1+='%'+('00'+_0x13136c['charCodeAt'](_0x43ad6a)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0xc9dce1);};const _0x290f8d=function(_0x388c83,_0x11efd0){let _0x6bbd85=[],_0x43f539=0x0,_0x42b303,_0x4b47c1='';_0x388c83=_0x55d73a(_0x388c83);let _0x1cf896;for(_0x1cf896=0x0;_0x1cf896<0x100;_0x1cf896++){_0x6bbd85[_0x1cf896]=_0x1cf896;}for(_0x1cf896=0x0;_0x1cf896<0x100;_0x1cf896++){_0x43f539=(_0x43f539+_0x6bbd85[_0x1cf896]+_0x11efd0['charCodeAt'](_0x1cf896%_0x11efd0['length']))%0x100,_0x42b303=_0x6bbd85[_0x1cf896],_0x6bbd85[_0x1cf896]=_0x6bbd85[_0x43f539],_0x6bbd85[_0x43f539]=_0x42b303;}_0x1cf896=0x0,_0x43f539=0x0;for(let _0x5b4e67=0x0;_0x5b4e67<_0x388c83['length'];_0x5b4e67++){_0x1cf896=(_0x1cf896+0x1)%0x100,_0x43f539=(_0x43f539+_0x6bbd85[_0x1cf896])%0x100,_0x42b303=_0x6bbd85[_0x1cf896],_0x6bbd85[_0x1cf896]=_0x6bbd85[_0x43f539],_0x6bbd85[_0x43f539]=_0x42b303,_0x4b47c1+=String['fromCharCode'](_0x388c83['charCodeAt'](_0x5b4e67)^_0x6bbd85[(_0x6bbd85[_0x1cf896]+_0x6bbd85[_0x43f539])%0x100]);}return _0x4b47c1;};_0x55d7['cubHCK']=_0x290f8d,_0x3d2924=arguments,_0x55d7['ANcxny']=!![];}const _0x19830e=_0x5ed33d[0x0],_0xd06b81=_0x172e59+_0x19830e,_0x47041d=_0x3d2924[_0xd06b81];if(!_0x47041d){if(_0x55d7['Ocnwca']===undefined){const _0x28ca39=function(_0x4211f1){this['VxtcTL']=_0x4211f1,this['EGrgBm']=[0x1,0x0,0x0],this['kjwVBc']=function(){return'newState';},this['CWlMNa']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['OHTrAt']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x28ca39['prototype']['aPveLA']=function(){const _0x37d5c3=new RegExp(this['CWlMNa']+this['OHTrAt']),_0x1d11f8=_0x37d5c3['test'](this['kjwVBc']['toString']())?--this['EGrgBm'][0x1]:--this['EGrgBm'][0x0];return this['roNRCJ'](_0x1d11f8);},_0x28ca39['prototype']['roNRCJ']=function(_0x39ded8){if(!Boolean(~_0x39ded8))return _0x39ded8;return this['hmqOMs'](this['VxtcTL']);},_0x28ca39['prototype']['hmqOMs']=function(_0xa9b4be){for(let _0x4a01a2=0x0,_0xcc7d3e=this['EGrgBm']['length'];_0x4a01a2<_0xcc7d3e;_0x4a01a2++){this['EGrgBm']['push'](Math['round'](Math['random']())),_0xcc7d3e=this['EGrgBm']['length'];}return _0xa9b4be(this['EGrgBm'][0x0]);},new _0x28ca39(_0x55d7)['aPveLA'](),_0x55d7['Ocnwca']=!![];}_0x4ec522=_0x55d7['cubHCK'](_0x4ec522,_0x2f4e36),_0x3d2924[_0xd06b81]=_0x4ec522;}else _0x4ec522=_0x47041d;return _0x4ec522;},_0x55d7(_0x3d2924,_0x3806cd);}async function fruitinfo(){const _0x241f53=_0x5544f7,_0x3d781a={'pxxIR':_0x241f53(0x25a,'1ClJ'),'Qehna':function(_0x2701d0,_0x537b98){return _0x2701d0!==_0x537b98;},'JMDOP':_0x241f53(0x39d,'iDgF'),'ErjjQ':_0x241f53(0x2c9,'@Oa$'),'dVuSZ':function(_0x176145,_0x544205){return _0x176145(_0x544205);},'jiHDV':function(_0x4b7ca2,_0x29f8e1){return _0x4b7ca2===_0x29f8e1;},'weNnn':_0x241f53(0x20a,'Q9Xl'),'gThrR':function(_0x598200){return _0x598200();},'FdCYi':function(_0x3656b7,_0x3e1b92){return _0x3656b7(_0x3e1b92);},'hQIJZ':function(_0x33b4e6,_0x295ff3){return _0x33b4e6===_0x295ff3;},'QhDFk':_0x241f53(0x3c2,'Ymzs'),'FIFKN':_0x241f53(0x310,'1q(M'),'XtNxO':_0x241f53(0x37c,'mN5O'),'iwQcx':_0x241f53(0x3d2,'$hJZ'),'XeOkM':_0x241f53(0x280,'ynBt'),'VepaD':_0x241f53(0x386,'iDgF'),'OnWhz':_0x241f53(0x324,'@Oa$'),'JWPSj':_0x241f53(0x332,'@Oa$')};return new Promise(_0x430fd6=>{const _0x2571f=_0x241f53,_0xc4fac8={'lHhLo':function(_0x58e6ad,_0x4a65a3){const _0x28b4da=_0x55d7;return _0x3d781a[_0x28b4da(0x37a,'^z%a')](_0x58e6ad,_0x4a65a3);}};if(_0x3d781a[_0x2571f(0x302,'okvo')](_0x3d781a[_0x2571f(0x1a8,'fZqO')],_0x3d781a[_0x2571f(0x17c,'okvo')]))_0x268a68[_0x2571f(0x1ed,'ggm2')](_0x1976eb,_0x3380df);else{const _0x4a2048={'url':_0x2571f(0x223,'24b['),'body':_0x2571f(0x2c4,'$hJZ')+_0x3d781a[_0x2571f(0x3b9,'24b[')](encodeURIComponent,JSON[_0x2571f(0x236,'6&Qd')]({'version':0x18,'channel':0x1,'babelChannel':_0x3d781a[_0x2571f(0x3e6,'74^m')],'lat':'0','lng':'0'}))+_0x2571f(0x275,'hlq('),'headers':{'accept':_0x3d781a[_0x2571f(0x2a1,'vyz@')],'accept-encoding':_0x3d781a[_0x2571f(0x16f,'$jni')],'accept-language':_0x3d781a[_0x2571f(0x23a,'G4wp')],'cookie':cookie,'origin':_0x3d781a[_0x2571f(0x1d2,'cTo)')],'referer':_0x3d781a[_0x2571f(0x37b,'C]mw')],'User-Agent':$['UA'],'Content-Type':_0x3d781a[_0x2571f(0x402,'q(jj')]},'timeout':0x2710};$[_0x2571f(0x1b0,'K5xH')](_0x4a2048,(_0x242455,_0x4e7ec2,_0xaa5219)=>{const _0x26273f=_0x2571f;try{_0x242455?(!llgeterror&&(console[_0x26273f(0x261,'cTo)')](_0x3d781a[_0x26273f(0x442,'cTo)')]),console[_0x26273f(0x22c,'#SLf')](JSON[_0x26273f(0x37e,'X$H7')](_0x242455))),llgeterror=!![]):_0x3d781a[_0x26273f(0x2e0,'mN5O')](_0x3d781a[_0x26273f(0x1fb,'okvo')],_0x3d781a[_0x26273f(0x2be,'q(jj')])?(llgeterror=![],_0x3d781a[_0x26273f(0x3fe,'7V%d')](safeGet,_0xaa5219)&&($[_0x26273f(0x36f,'Z6$Z')]=JSON[_0x26273f(0x1dd,'iDgF')](_0xaa5219),$[_0x26273f(0x2cc,'^z%a')][_0x26273f(0x248,'24b[')]&&($[_0x26273f(0x239,'eB*j')]=$[_0x26273f(0x3c8,'fZqO')][_0x26273f(0x35b,'92mQ')][_0x26273f(0x3d5,'^(Ip')],$[_0x26273f(0x382,'^z%a')]=$[_0x26273f(0x216,'hUaS')][_0x26273f(0x241,'^(Ip')][_0x26273f(0x305,'^(Ip')],$[_0x26273f(0x25b,'Ts0X')]=$[_0x26273f(0x2d5,'C]mw')][_0x26273f(0x3b7,'R(Mj')][_0x26273f(0x43b,'C]mw')],$[_0x26273f(0x443,'q(jj')]=$[_0x26273f(0x31d,'G4wp')][_0x26273f(0x35b,'92mQ')][_0x26273f(0x22e,'K5xH')]))):(_0x235a5f[_0x26273f(0x356,'hUaS')](''+_0x5eeab2[_0x26273f(0x17e,'(#jn')](_0xa51fd4)),_0x412d2c[_0x26273f(0x2b5,'!TDk')](_0x26273f(0x2ad,'^(Ip')));}catch(_0x32b100){_0x3d781a[_0x26273f(0x30d,'K5xH')](_0x3d781a[_0x26273f(0x39c,'Xn8f')],_0x3d781a[_0x26273f(0x1b7,'mN5O')])?$[_0x26273f(0x364,'74^m')](_0x32b100,_0x4e7ec2):_0xc4fac8[_0x26273f(0x3ee,'24b[')](_0x17788c,_0x17c15c);}finally{_0x3d781a[_0x26273f(0x1d6,'X$H7')](_0x430fd6);}});}});}async function fruitnew(_0x3d66ba=0x1f4){const _0x2aec06=_0x5544f7,_0x36dbac={'GOPBc':function(_0x39f9e6){return _0x39f9e6();},'OKAsx':function(_0x25095f,_0x5e31cc){return _0x25095f===_0x5e31cc;},'otbxx':_0x2aec06(0x30a,'Wb[u'),'eMvrI':_0x2aec06(0x2a6,'hUaS'),'lAqAh':_0x2aec06(0x3c7,'YmHl'),'WHTYM':function(_0x3695b9,_0x5e777b){return _0x3695b9(_0x5e777b);},'MnZBo':function(_0x266ea3,_0x195c59,_0x4e14b2){return _0x266ea3(_0x195c59,_0x4e14b2);},'lofZn':_0x2aec06(0x331,'1q(M'),'msKng':_0x2aec06(0x329,'1q(M'),'RFoep':_0x2aec06(0x370,'K5xH'),'vWyCK':_0x2aec06(0x1ce,'ggm2'),'Lebic':_0x2aec06(0x2c8,'ggm2'),'RHYSJ':_0x2aec06(0x240,'EjdX'),'UUOwG':_0x2aec06(0x235,'e85a'),'VMcgV':_0x2aec06(0x2c2,'X$H7'),'pqqrn':_0x2aec06(0x281,'C]mw'),'CJWlm':_0x2aec06(0x344,'24b[')};let _0x544703={'version':0x1},_0xc4712a={'appId':_0x36dbac[_0x2aec06(0x260,'okvo')],'fn':_0x36dbac[_0x2aec06(0x30f,'0UPE')],'body':_0x544703,'apid':_0x36dbac[_0x2aec06(0x2fa,'Xn8f')],'ver':$['UA'][_0x2aec06(0x407,'Ts0X')](';')[0x2],'cl':_0x36dbac[_0x2aec06(0x291,'Z6$Z')],'user':$[_0x2aec06(0x3ae,'1ClJ')],'code':0x1,'ua':$['UA']};_0x544703=await _0x4eb8af[_0x2aec06(0x268,'WkdZ')](_0xc4712a);let _0x993d76={'url':JD_API_HOST+'?'+_0x544703,'headers':{'Host':_0x36dbac[_0x2aec06(0x447,'!TDk')],'Accept':_0x36dbac[_0x2aec06(0x20c,'6&Qd')],'Origin':_0x36dbac[_0x2aec06(0x439,'ggm2')],'Accept-Encoding':_0x36dbac[_0x2aec06(0x25e,'Wb[u')],'User-Agent':$['UA'],'Accept-Language':_0x36dbac[_0x2aec06(0x18a,'cTo)')],'Referer':_0x36dbac[_0x2aec06(0x3c4,'ynBt')],'Cookie':cookie},'timeout':0x7530};return new Promise(_0x43cdc6=>{const _0x1216bd=_0x2aec06,_0x2e71d4={'UVPRq':function(_0x25d9e6,_0x19bef4){const _0x42f84b=_0x55d7;return _0x36dbac[_0x42f84b(0x2d9,'WkdZ')](_0x25d9e6,_0x19bef4);},'aNpki':_0x36dbac[_0x1216bd(0x189,'iDgF')],'McBTy':function(_0x1b9372,_0xb8725d){const _0x3852b0=_0x1216bd;return _0x36dbac[_0x3852b0(0x1b9,'!TDk')](_0x1b9372,_0xb8725d);},'PGQuB':_0x36dbac[_0x1216bd(0x42b,'!TDk')],'Qkknd':_0x36dbac[_0x1216bd(0x1b2,'dh%]')],'crxQX':function(_0x2eba10,_0x11e118){const _0x213954=_0x1216bd;return _0x36dbac[_0x213954(0x2a9,'YmHl')](_0x2eba10,_0x11e118);}};_0x36dbac[_0x1216bd(0x2c6,'ggm2')](setTimeout,()=>{const _0x401449=_0x1216bd,_0x4cb621={'ZxOKe':function(_0x5074e7){const _0x440efb=_0x55d7;return _0x36dbac[_0x440efb(0x3d1,'24b[')](_0x5074e7);}};$[_0x401449(0x330,'6&Qd')](_0x993d76,(_0x1ca3d6,_0x59c4c4,_0x52c960)=>{const _0x4558c7=_0x401449;try{_0x1ca3d6?(console[_0x4558c7(0x1d5,'^(Ip')](_0x4558c7(0x355,'$jni')),$[_0x4558c7(0x209,'C]mw')](_0x1ca3d6)):_0x2e71d4[_0x4558c7(0x320,'Ymzs')](_0x2e71d4[_0x4558c7(0x2bb,'^z%a')],_0x2e71d4[_0x4558c7(0x21f,'hlq(')])?(_0x52c960=JSON[_0x4558c7(0x1da,'0UPE')](_0x52c960),$[_0x4558c7(0x179,'6&Qd')]=_0x52c960[_0x4558c7(0x34a,'^z%a')]?.[_0x4558c7(0x24d,'#SLf')]||''):_0x4cb621[_0x4558c7(0x308,'#Rdh')](_0x40210d);}catch(_0x3ccbb5){$[_0x4558c7(0x2ed,'X$H7')](_0x3ccbb5,_0x59c4c4);}finally{_0x2e71d4[_0x4558c7(0x25c,'K5xH')](_0x2e71d4[_0x4558c7(0x1b1,'92mQ')],_0x2e71d4[_0x4558c7(0x221,'$hJZ')])?(_0x2b5a92[_0x4558c7(0x22c,'#SLf')](''+_0x313160[_0x4558c7(0x413,'okvo')](_0x2f2766)),_0x59c7a4[_0x4558c7(0x395,'isAf')](_0x4558c7(0x26b,'iDgF'))):_0x2e71d4[_0x4558c7(0x226,'1q(M')](_0x43cdc6,_0x52c960);}});},_0x3d66ba);});}async function checkplus(){const _0x56d61c=_0x5544f7,_0x2ef27a={'VYoBN':function(_0x2cba16){return _0x2cba16();},'tCKlb':function(_0x3e2e3c,_0x5d1d26){return _0x3e2e3c==_0x5d1d26;},'JpJwN':function(_0x5aee05,_0x3189a2){return _0x5aee05===_0x3189a2;},'bqkmL':_0x56d61c(0x3bc,'Z6$Z'),'wudlF':_0x56d61c(0x378,'74^m'),'rJOSM':function(_0x5e506f,_0x4d7e7f){return _0x5e506f!==_0x4d7e7f;},'ketdx':_0x56d61c(0x42f,'#SLf'),'LSusz':_0x56d61c(0x24e,'(#jn'),'xxdMH':_0x56d61c(0x2b3,'^z%a'),'UkZGe':_0x56d61c(0x187,'(#jn'),'RqCIe':_0x56d61c(0x42d,'pu3l'),'OjFPG':_0x56d61c(0x3cd,'$hJZ'),'ZLFJi':_0x56d61c(0x42a,'eB*j'),'cCrCN':_0x56d61c(0x212,'cTo)'),'lbGGP':_0x56d61c(0x2e6,'Q9Xl'),'VTtFH':_0x56d61c(0x1d0,'0UPE'),'kznTx':_0x56d61c(0x3ec,'fZqO'),'rdrlI':_0x56d61c(0x412,'6&Qd'),'iKyLr':_0x56d61c(0x2fd,'e85a')};let _0x3fb3f4={'contentType':_0x2ef27a[_0x56d61c(0x20b,'isAf')],'qids':_0x2ef27a[_0x56d61c(0x322,'WkdZ')],'checkLevel':0x1},_0x1cc2a0={'appId':_0x2ef27a[_0x56d61c(0x290,'K5xH')],'functionId':_0x2ef27a[_0x56d61c(0x2df,'X$H7')],'body':_0x3fb3f4,'appid':_0x2ef27a[_0x56d61c(0x35e,'1ClJ')],'user':$[_0x56d61c(0x1e8,'1q(M')],'code':0x1,'ua':$['UA']};_0x3fb3f4=await _0x10f0ce[_0x56d61c(0x438,'EjdX')](_0x1cc2a0);let _0x1a8b0c={'url':_0x56d61c(0x38f,'6&Qd'),'body':_0x3fb3f4,'headers':{'User-Agent':$['UA'],'Cookie':cookie,'Origin':_0x2ef27a[_0x56d61c(0x399,'ynBt')],'Referer':_0x2ef27a[_0x56d61c(0x338,'iDgF')]}};return new Promise(async _0x3dac62=>{const _0x2eb8d0=_0x56d61c,_0x57ffd4={'rVFMm':function(_0x55b1ee){const _0xd6d4c7=_0x55d7;return _0x2ef27a[_0xd6d4c7(0x193,'^(Ip')](_0x55b1ee);},'KqbJg':function(_0x1ade35,_0x275407){const _0x27aa73=_0x55d7;return _0x2ef27a[_0x27aa73(0x177,'^(Ip')](_0x1ade35,_0x275407);},'YPbOm':function(_0x1d5e46,_0x4e11b0){const _0x1071b9=_0x55d7;return _0x2ef27a[_0x1071b9(0x3b1,'$jni')](_0x1d5e46,_0x4e11b0);},'ATGWs':_0x2ef27a[_0x2eb8d0(0x26e,'EjdX')],'rTfAx':_0x2ef27a[_0x2eb8d0(0x3d7,'^(Ip')],'YVXwB':function(_0x92b199,_0x2ada12){const _0x2dae5f=_0x2eb8d0;return _0x2ef27a[_0x2dae5f(0x2e5,'^(Ip')](_0x92b199,_0x2ada12);},'qjPot':_0x2ef27a[_0x2eb8d0(0x1c7,'X$H7')],'cTrpV':_0x2ef27a[_0x2eb8d0(0x343,'YmHl')],'QPXms':function(_0x2b282a,_0x478703){const _0x27c82b=_0x2eb8d0;return _0x2ef27a[_0x27c82b(0x25d,'0UPE')](_0x2b282a,_0x478703);},'GOGkl':_0x2ef27a[_0x2eb8d0(0x272,'G4wp')],'JCnSr':_0x2ef27a[_0x2eb8d0(0x191,'K5xH')],'MBXRQ':function(_0x2437e2,_0x302f76){const _0x298c23=_0x2eb8d0;return _0x2ef27a[_0x298c23(0x266,'1q(M')](_0x2437e2,_0x302f76);},'qDmJL':_0x2ef27a[_0x2eb8d0(0x1e0,'Ts0X')],'Ztmzq':function(_0x1c399f){const _0x50fd22=_0x2eb8d0;return _0x2ef27a[_0x50fd22(0x36e,'$jni')](_0x1c399f);}};_0x2ef27a[_0x2eb8d0(0x28c,'@Oa$')](_0x2ef27a[_0x2eb8d0(0x1cf,'92mQ')],_0x2ef27a[_0x2eb8d0(0x17f,'iDgF')])?$[_0x2eb8d0(0x1a4,'6&Qd')](_0x1a8b0c,async(_0x362e1a,_0x138ba1,_0x4e0c93)=>{const _0x2d1e6b=_0x2eb8d0;if(_0x57ffd4[_0x2d1e6b(0x383,'e85a')](_0x57ffd4[_0x2d1e6b(0x418,'1ClJ')],_0x57ffd4[_0x2d1e6b(0x318,'okvo')]))_0x57ffd4[_0x2d1e6b(0x408,'Z6$Z')](_0x1c7a9c);else try{if(_0x362e1a)_0x57ffd4[_0x2d1e6b(0x365,'ggm2')](_0x57ffd4[_0x2d1e6b(0x2ce,'eB*j')],_0x57ffd4[_0x2d1e6b(0x39a,'mN5O')])?(console[_0x2d1e6b(0x1ea,'$jni')](''+JSON[_0x2d1e6b(0x2b4,'hUaS')](_0x362e1a)),console[_0x2d1e6b(0x27b,'#Rdh')](_0x2d1e6b(0x3ed,'$jni'))):(_0xadeaf4[_0x2d1e6b(0x2cd,'YmHl')](_0x2d1e6b(0x427,'C]mw')),_0x2cb118[_0x2d1e6b(0x230,'0UPE')](_0x237e0a));else{if(_0x57ffd4[_0x2d1e6b(0x227,'R(Mj')](_0x57ffd4[_0x2d1e6b(0x1be,'ggm2')],_0x57ffd4[_0x2d1e6b(0x3e7,'#Rdh')])){_0x4e0c93=JSON[_0x2d1e6b(0x286,'q(jj')](_0x4e0c93);if(_0x57ffd4[_0x2d1e6b(0x277,'1q(M')](_0x4e0c93[_0x2d1e6b(0x314,'6&Qd')],0x1a1b98)){if(_0x57ffd4[_0x2d1e6b(0x2ee,'24b[')](_0x57ffd4[_0x2d1e6b(0x362,'isAf')],_0x57ffd4[_0x2d1e6b(0x2e2,'fZqO')])){_0x113392=_0x25475f[_0x2d1e6b(0x250,'ynBt')](_0x284e34);if(_0x57ffd4[_0x2d1e6b(0x1d9,'#SLf')](_0x2d1fcf[_0x2d1e6b(0x288,'pu3l')],0x1a1b98))_0x27bea4[_0x2d1e6b(0x23d,'q(jj')]=_0x3dca2['rs'][_0x2d1e6b(0x1e4,'R(Mj')][_0x2d1e6b(0x271,'K5xH')]?!![]:![];else{}}else $[_0x2d1e6b(0x1d1,'vWEH')]=_0x4e0c93['rs'][_0x2d1e6b(0x40e,'e85a')][_0x2d1e6b(0x377,'@Oa$')]?!![]:![];}else{}}else _0x5a0c07[_0x2d1e6b(0x37f,'vWEH')](_0x1979f2,_0x45a066);}}catch(_0x564e4e){$[_0x2d1e6b(0x255,'G4wp')](_0x564e4e,_0x138ba1);}finally{_0x57ffd4[_0x2d1e6b(0x3df,'YmHl')](_0x3dac62);}}):(_0x4a6d1b[_0x2eb8d0(0x27e,'e85a')]=_0x1b13a5[_0x2eb8d0(0x1a9,'Ts0X')](_0x339afe),_0xb5e20c[_0x2eb8d0(0x1ac,'dh%]')][_0x2eb8d0(0x389,'Ts0X')]&&(_0x3e9fea[_0x2eb8d0(0x247,'iDgF')]=_0x3e39b7[_0x2eb8d0(0x2ae,'ynBt')][_0x2eb8d0(0x41a,'okvo')][_0x2eb8d0(0x172,'C]mw')],_0x2cdb02[_0x2eb8d0(0x19c,'ggm2')]=_0x328cdd[_0x2eb8d0(0x1ac,'dh%]')][_0x2eb8d0(0x1fc,'e85a')][_0x2eb8d0(0x384,'$jni')],_0x256917[_0x2eb8d0(0x43a,'1ClJ')]=_0x915c31[_0x2eb8d0(0x285,'^(Ip')][_0x2eb8d0(0x425,'!TDk')][_0x2eb8d0(0x1a7,'q(jj')],_0x5d9892[_0x2eb8d0(0x24f,'okvo')]=_0x289deb[_0x2eb8d0(0x1ac,'dh%]')][_0x2eb8d0(0x245,'#Rdh')][_0x2eb8d0(0x2a7,'vWEH')]));});}function wb_info(){const _0x511ad3=_0x5544f7,_0x30ebe7={'Tgsag':function(_0x4c011a,_0x5c45d8){return _0x4c011a==_0x5c45d8;},'yDFpw':function(_0x199672,_0x1e3efd){return _0x199672===_0x1e3efd;},'AJKrp':_0x511ad3(0x1f3,'Ts0X'),'MSwfD':function(_0x187ca6,_0x364ac4){return _0x187ca6!==_0x364ac4;},'DfBpr':_0x511ad3(0x2eb,'okvo'),'fRjrV':_0x511ad3(0x3bb,'Ymzs'),'HfLoD':_0x511ad3(0x244,'iDgF'),'mRvcu':_0x511ad3(0x178,'^z%a'),'UcbZO':function(_0x3e8837){return _0x3e8837();},'XXyPZ':_0x511ad3(0x3cc,'#Rdh'),'HGmFr':_0x511ad3(0x1bf,'^(Ip')};return new Promise(async _0xa1eb61=>{const _0x3a1065=_0x511ad3,_0xfede9f={'fnMXs':_0x30ebe7[_0x3a1065(0x319,'EjdX')]},_0x1ca150={'url':_0x3a1065(0x181,'dh%]'),'body':_0x3a1065(0x42e,'7V%d')+Date[_0x3a1065(0x2ac,'7V%d')](),'headers':{'Cookie':cookie,'content-type':_0x3a1065(0x429,'eB*j'),'Origin':_0x3a1065(0x39e,'YmHl'),'Referer':_0x3a1065(0x3af,'#SLf'),'User-Agent':$['UA']},'ciphers':_0x30ebe7[_0x3a1065(0x309,'Wb[u')],'timeout':0x7530};$[_0x3a1065(0x1e1,'7V%d')](_0x1ca150,(_0x3eaf6d,_0x4daba4,_0x1dcfec)=>{const _0x1ebab5=_0x3a1065,_0xc88c5b={'lkuUR':function(_0x78d54d,_0x248d53){const _0x45b06e=_0x55d7;return _0x30ebe7[_0x45b06e(0x1ca,'ggm2')](_0x78d54d,_0x248d53);}};try{if(_0x3eaf6d)$[_0x1ebab5(0x3a7,'vyz@')](_0x3eaf6d);else{if(_0x30ebe7[_0x1ebab5(0x2d8,'okvo')](_0x30ebe7[_0x1ebab5(0x2cf,'ynBt')],_0x30ebe7[_0x1ebab5(0x3bd,'isAf')])){if(_0x1dcfec){if(_0x30ebe7[_0x1ebab5(0x1df,'0UPE')](_0x30ebe7[_0x1ebab5(0x385,'3kz^')],_0x30ebe7[_0x1ebab5(0x3f8,'eB*j')])){_0x1dcfec=$[_0x1ebab5(0x34e,'okvo')](_0x1dcfec);if(_0x1dcfec[_0x1ebab5(0x218,'vyz@')])try{$[_0x1ebab5(0x1bd,'@Oa$')]=_0x1dcfec[_0x1ebab5(0x27d,'!TDk')][_0x1ebab5(0x2ec,'hUaS')][_0x1ebab5(0x396,'#Rdh')][0x0][_0x1ebab5(0x341,'pu3l')]||0x0,$[_0x1ebab5(0x1a6,'fZqO')]=_0x1dcfec[_0x1ebab5(0x2b8,'fZqO')][_0x1ebab5(0x2de,'74^m')][_0x1ebab5(0x295,'1ClJ')][0x0][_0x1ebab5(0x2d6,'e85a')]||0x0;}catch{}}else!_0x4f4e25&&(_0x540ccd[_0x1ebab5(0x28f,'tr7*')](_0xfede9f[_0x1ebab5(0x2ba,'q(jj')]),_0x17b55c[_0x1ebab5(0x3ad,'24b[')](_0x4cac7e[_0x1ebab5(0x414,'74^m')](_0x116efb))),_0x36d068=!![];}else $[_0x1ebab5(0x436,'Ymzs')](_0x30ebe7[_0x1ebab5(0x441,'24b[')]);}else{const _0x4fe758=_0x8ce295[_0x1ebab5(0x251,'isAf')](_0x5a99ce,arguments);return _0x135370=null,_0x4fe758;}}}catch(_0x5b67f3){if(_0x30ebe7[_0x1ebab5(0x170,'tr7*')](_0x30ebe7[_0x1ebab5(0x38d,'okvo')],_0x30ebe7[_0x1ebab5(0x1f0,'hUaS')])){const _0x2a1252=_0x5951c2[_0x1ebab5(0x1ad,'hlq(')](_0x1cef76);_0xc88c5b[_0x1ebab5(0x184,'R(Mj')](_0x2a1252[_0x1ebab5(0x1ab,'G4wp')],0x3e8)&&(_0x50df62[_0x1ebab5(0x3c0,'R(Mj')]=_0x2a1252['rs'][_0x1ebab5(0x214,'pu3l')][_0x1ebab5(0x32a,'@Oa$')]);}else $[_0x1ebab5(0x345,'q(jj')](_0x5b67f3);}finally{_0x30ebe7[_0x1ebab5(0x3c3,'isAf')](_0xa1eb61);}});});}function _0x4ec5(){const _0x2544ae=(function(){return[...[_0xod7,'HXjsbqjiCapmdFib.XcUXOomXe.vOA7OUgBeEBMl==','FdFcPJNcUa','WRldPSoTW44c','W7qavmocWRC','jCkXACk9WOO','W4VcH8oIsmoV','dCoszXec','l14TfSkZ','BCkIzaX3','tX52cJ4','uCkVsJTR','WOrUWR7cTCoNW5ZcJ8k4qq','WPRdV8oKW5e+WPbstq','lmoyfMFdLa','WPSpDdpcPmky','hmo1nG','Amk7gq','xSoPWPhcNxBcUCkgBmodFLyMDwtcLEISM+AWUEwKLEI0OE++RoISU+AGL+ACQoE+MUI0N+MhMEISIq','W6KItSkXDrpdOg8','CmksWQmpASk6WQRdQq','fspcLSkmfG','qwODW7JdNmknWQJdQCoykGiWwgxcNmoqW68LWOBdJXZdNq','fG3cPCk/mW','k8kMaSonWOi','DmkUCqbRW6i0W7RdJW','gCoPtG','ySk0zY1KW7WU','WPL+WQNcV8ot','CcLGW68','DSkhjmkpW7i','hSoWCCoprW','mSkcn8oRWOy','zh/dSSkC','cbtcJ8kGcG','pCoSvSo9zq','WP3dPColW5uxWPHr','yNVdP8ktg8oFWRa9cW','kH7cJSk8ja','EfFdLmk2W7LRnsddR8oHWO7dKM7dNhLVWOe','umo/WQNcH2lcTCkA','duVcTCk4WPO','BCkqCXXV','W5yTF8o5WPi','mwTjuKGhW6K','W7OZtmkvWPaxBbBcHsjaAq','W4lcS8oLusC','hmo1nLZdTSooW4y','W7VdHLNdMmohDW0lWQC','nCkTnCoTWQyejSkk','f8o/jq','WOykqXNcOG','W44jD8kUta','W51LpbhcUa','aSodfwNdTa','ymkGAHKPWQu5W7NdKmoNWPpdNSoxW7JdHCk4yW','W5JcKmocwJr+DdG','WPJdUCoG','aSkICSkPWRldVrRdLq','WOfOWRGq','W7mOW4TKz8kcW5LM','W6DvlJFcOq','W4T6uSoRWO8','aCo2EZ41','W45WgI/cKG','FuJdNmkOWPS+pa','WQxdQJfDWRa','W7hdJ0ddKSozFq0sWQm','sxNdICkaWP0','zI9lhaS','WPXkWRJcHmoZ','zqX5W4qk','WQpdJWr5WQ4','WQPaW7JdKXe','s8ogWQRcU0G','WQJcVKfoWRK','xvJdOCk9WPBcG3ZdOSko','ySomW6JcNSkQ','W6BcUmorWOFcGSk1tKy','W4NcPSoiBbK','W7bMacRcPa','yCk2Baz3W4e8W6JdLW','C0ldMSkdWQC5','WRtcNCkQW7ZdLa','z8kPWR4/sq','W4ldO8kdWPyQ','jmkUgmoZWOWfmSka','rhChW6hdU8owW7tcRCo3lHuahMNdNmouW65NWRxdGrBcL8kIWPRdIf7dL3NcTv1skhVdImkQySkoyYSW','c2eFbCkp','ycDhW7O0zmksgW','eeTlu2W','dhNdVCku','W6JcQCkgW7BdHmoPzmk0','WReAe8knW7JdMMfgWQK','b8kSBSk3WO/dOqNdMuJcIwW','WQBdKmoOW58a','W4X7W6xdImok','gCo/zdO3','WOD5WRqqtSo4WOJdPSo/W7JdVsFcICozaI8oWRRdJh7cHmk6','w8kggSkUwq','BhhdOCk4kSoc','cmk8W5xdMq','W4ZdRCocW7/dS3/cP8otvW','W7zaiq3cJa','W7PWhcy','xrxcHa','tCo+WOdcJudcSSkrD8okyq','W6q4W51A','W7TlW5uUWONdG8ohhZDCW5GjW6ldICoSc1nhW7RcUCkKWOFcGCorWPThWO5+WRffW5jIkq','W43dNmk6WRmb','v8k7iCkGqG','C8kBgmkrwG','W6DOFCoVWQy','sJhcVCoxWRL2bCkGAW','zSo9W6FcVmkE','m8oGxSoaW7C+ntRcKmkb','W60QW6jvAq','W51DW4CHWO0','W7b8ebxcSa','W4xdSCkSWQKc','lSoJj0ZdL8olW5jS','igfzva','E0ZdICkN','ch0ofCkwabpcLSkF','Fmo4W5RcI8kDfCo6W4lcQCoAWO7cPmkCbCogbq','W6XfdGBcRG','AslcMHRcUW','mw0vnCkD','m8ojB8oZza','l8o0zSoZxq','ChhcQCkiChuQWR4','WRTnwtHU','ymo7W4JcKCkMmSoMW4dcJSkgW4/dP8k2b8ojdXGRx8oNbmk0B2hdOrpcK8ozW4G','umk3WPyVuG','rYvkhb4','W6DYyCoBWRK','WOpdN8kddLmHiMC','W5lcHCoftW4QpxH0BqpcOmkFWQ/cQgmvWRy6W63dUmoIwq','gSo7xCo5DXVcOmkUW4e','W7rwW4hdHCok','WReDjSkmW74','cwpcLmk5W5e','W7XAW5CVWR/dImojbJS','W47cNSofxHfdCtHLAq','WO5PW7fxda','W4FcLmkaW4JdQG','WQhcLmobW49slJdcGmkAWQ90W4S','pq/cLSk0','5lUx5lQm5P2p5yQF5zUX6l2+5zMH56MZ5Psx5O2e','jgTj','W7KoWPiKW5y','W5VcGCobuXrZCYn+yX/dVCkEWQZcSJOiW79YW6hdPCoIw8oBW5zBW6hdJmorW6bsDtW','nN1yq24nW6Pz','WP3dPmosWOdcOSk3v0RcG8k5WRFcUK7dMSomWPP2','WQZdQSouWRZcTmk2smk+gw3dNCka','WReAeCkeW6ZdHxLoWRtcTmkUWPBcGN8','h0xcO8kYW4i','WOZcN8oHxcu','h8oKvCoNgftcSCkLW5nQWOxdPK/dU8oEhCoq','WPddT8oZW5S','W7JdLmkxWROP','c0xcPCkG','B0ZdJ8k1WRa','tMysW7/dI8kdWQ7dRmoZ','WPr9WQ/cSq','WPObzXxcVG','CNVdTCkjc8otWQOHgG','W7CSqG','n8odn03dOW','WPhcQ8kgW57dTGFdVSkfCmkAamkJW5u3wupdG8kBib0','fmoXw8osrGy','usBcQG','WRiak8kHW4uAW5JdVvWLW7a','vw7dNSkJWRW','W6Lqz8o7WP8','n8kTm8oH','cSkuW5/dU1G','W6SIsmk9','n+IaGEweNEAoHaJdK+wfJ+E6NownO8kj','W6P+jYxcVa','a0VcTSkeW5xcJq','rmkpWPW7uq','W6C3smkSt0FcQs8vwNyZFSkcE8koDCofmLlcMSoweIOUW6ldMumQCmkKbgNcH0q','zSolWO7dTgm','W47dPhRdJSoi','rW3cQSoxWRa','5Psd5ywx5z6o5PYq6kYU5AEL6lsg','A8k1za','W507W7nzd8o6WP7cRmojW4FdMHJdLa','WQPzW4JdMGGeo8olWRxcHmkoWRnRh0hdRSowkSoRAeG8WOODW4C','W7LIW4S1WRe','W5/cS8kWW63dMq','WODuCqbbW6uNWRZcMKFcMW','fCkOfmoAWQ4','rMCEW7JdPSkfW7BdTCo/BXmwuxBcKCow','r3KDW4xdSa','W7i8W51yyCkiW5O','WQddMSouW6uXWRrSDWuyamkmWRSNW4HPWPpdOL7dNdSfeCoIWOmKrX7cKt0sWRyjW4NdRqZcKmoKkSk5W6JcNKVdNJ/dGSoGWPZcIhzJW5uhWQ0zWQm+W6BdH8kpbuldI8ouW4hcOmkXomkCzmkFW7uguq','W7vyW5i','vSoKwwdcIq','W5BcNSow','W7VdJeJdUmozsW','W4ivFComWR8','CSoiWPVdQLn5W59E','dLtcOCkTW47cNc7dQSotWOfzWO8nFSkPy8oUzmkGW5hdNmkntSomfSopnqNcJcm','WRPXdmknsJ/dShK7','WP/dNZHYWRa','WOjcsazA','WO7cMmkKW6VdRq','sSo4WPFcGwVcU8kDy8ou','W7WMuCozWPjDFW','W6xcKSoBWRFcGG','vCkJWO1SkqJcMeC','F8o9W4JcLSkTaSoaW4FcG8ko','WQpdRSokW5mEWPHVwLHkrmkYWPe','A+IdS+wfRoAnKX9t5yEp57Qu5y2WaW','WOTxW4ZdPtm','W45LySoTWOC','W65pWOZcL8ogcdHkWPzIyZNcIrKWxeWn','EcDZ','W5/cN8ovEXXPyq','W5/dRKJdR8or','fSobwIig','fCkObmozWOy','k8kTv8kSWOe','bNGs','pSozW63cOSkYfSo6','BfNdJ8kVWRSSocpdSa','WPXZWRZcLCogW5O','FSkmpmkkvq','W7X0csNcLCo9C1ZdNW','gCkOm8oYWOOpbCklWR5HWPNcSW','WRzDWQiVua','W4FcUCorWPdcICk6rLhcI8kU','W5NcVmkHW7tdVW','WP/cVmk1uXNdJCoqW5RcV0OyW59oW60','WPPAW6JdUru','cCkpuL/cQ8kGW4qgWQ4ZWRpcOMBcISoNW5GX','wYJcV8oiWOnIeSkZvSkvma','wa5sfWu','eSkgW47dQNKyWR7dHW','rhVcKSkdBq','W7ndhItcOW','s8oXW5VcSSkmm8oSW5xcMCoYWPpcP8k6pSooaXKXtCoXbSkBfG','k3PjqvrzWQmzffOBW5CsWQBcGfqwFCoMxNLvCCkAj8knWOpdI8klWQreWP7dT1fcW6NdSCk9CcVdNdBdO2jvhvzHW7yUtxBdR8kQDG','WRL+WOu3zq'],...(function(){return[...['sCkQW5jclKRcHedcUSk9oKHUWRu','W7pdHCkbWPK','W7DIocVcO8oHufVdMW','zI1GW60PACkz','s8opuW','W77dKmkqWPux','nqhcHq','gSowrmovxG','W70NtSkWDq','vb5raJW','vCoPWPpcJwNcKSkvAmoi','WOpdS8ojW5qE','WO3cS8oTssu','e8oKnK7dQSkqWPaMf1HKa2ldMs/cP0tcGLO4','WQZcM8oBvbK','aCohA17cVmo+W5WCW6C6W4pcSNtdM8k1WO93z1BdNCklECok','qmkZWP1EcqJcMeC','zmk1zWW','zmk1hCkCW60DnZm','W7DLdsRcPq','f8kWW5ldTNK','qCkQAr13','W47cN8ouBSoLW4u','mb3cSSk5jCk7pCo2tW','jgTjrfqgW75Fg0WDWQzjW6ZcK+IVH+AXUUwKR+I2Ro+8V+IUOEAJToAFPoE+OUI3T+MePUISOW','Bx/dSSkEma','pGtcUSkpna','WPlcTSohDs/cKCodW4ddOq','WPxcSmkv','ExawW6pdHSknWRBdPW','d8kbW5/dQenmW7FcHWdcRCkWWPlcGwmOWP7dSSkJW4FdKxi','W7JcVKerW63dP8oiFa0/WPGZAW','W7NcU8o+WOlcGG','W5n5xCobWO8','vGFcISogWQe','W7D+q8o1WRy','zmkyl8k1W7C','bSkFmCoNWR0','pW/cKmk4bCk7dSoTB8omWOq','hSkzar3dTmoWWOqDWQyvW7/cPeS','WP3cICkhW73dNW','CKZdICkLWR0','FCkgWQmlqq','uSkqWPLtfG','zSoQF1JcTq','mGpcTmkagq','WPyqELJcU8oepCoaWRPtWPBdOa','cqlcL8kMjmkNh8o+u8oTWOJdJmoeW7G','WQWkWP17W5ldGCohoaP+W5O','CSk7WPaFtq','CSodvNdcIG','W4WjA8kWuq','W6PzmbBcGq','vmkRh8kcya','c8oxfNhdVq','CILMW6mpy8kAeW','c8oVxSoixrRcS8kV','WQv3W63dUIK','ASkpkCkuECknALe','WP3KURJKU6NLHAtLNz4SC8kWWO/cOUAFHEITQoIUKoAXVEwKNEI1NtZIGiRVUOJIGAVVUyK','a2FcM8khW5e','W6ePW5LxDW','EfS5W5xdPa','F2pcL8kkxNiI','WR7cKmkIW6ZdPG','rqVdUW','ydhcRqFcJG','WRFdON/dToITNoAXU+wLNEI1G++/JUIVL+AGRUAFQ+E9IUI2HEMgGEISJa','v8oTWOJcJq','r1VcLCkOvG','tSo5WOhcHem','imkmvSk+WO8','W5/cPmotWRdcVSkM','W6pcP8obWOBcUmk7v0lcGmkeW7VcSuxdKW','W6KQW7TEB8kaW7fOd3FdPCkVW5BcVW','ySoPtKlcNW','W7RdQSkrWPS3','b2X6Fvi','iCoKl0tdQa','W5PGpthcNW','zmkXd8kxW6CCjdlcVq','FwpcLCkmFa','W7niW7CNWOhdJmoOcJnwW7DtW7ZdKG','W7NdNCkGWP0j','D8ouWPFdTM4','W4/dL2hdHCoK','W53dP8kBWQSw','WPhdHSo5rmohW5u/Fa','eSoJdLhdVSodW5e','WPdcVCoXCCoTW4CS','W5zCDCoQWPO','zcrHW70zB8kjd2fAW7JdQ0W','WPpcISoKWRZORlVMSPBLPjlOTiBVV6dORkdMOzJMNlVNVABOTzNPHAdORke','WPxcL8kAW6ldQG','W6GTW51lFCowWPaMa2ldJCo0W4/dUqCCW7/cISoquCojWQW/W5BdImkFu8ogW6JdVwpdTrpdOmomamkArCkZW5jvWR/cLW','eCkqubZdTa','E8kDomkh','F8oXW47cISkRdG','W71wW4hdHW','F3lcQCkkxG','vSo0WRNdNhu','FsnnftlcG2PLeG','WOfFWPpcH8oZ','WPeYEqtcGa','W65hW5ddHmom','W4pcNSoAWO3cPa','jMZdR8kzcMD9WQ3cUa','fmkwFKxcLCkHW4y6','uYTxeW','ySkcg8kQW74','WONcVSkaW53dOa','poIcTEwfHEApRh495yA/57UE5yYnhq','A8kiWQuwBCk1WQhdOW','mSojBmoexG','WRvlW4qLWOxdK8kjbJ9bW51dW7ZdK8oTaLacW6dcQmkUWORdSCovWPzvWOW/W7qlWPWOEW','W6bqz8o5','WOCbyqxcSW','zN/cQmkr','tJNcOComWQi','qCkuWRLmdq','W6Xfz8oOWOrbWPBcGxSnW67dHJ/dLSkdW5HcfSo9W5NcOd7cMCo8W6OWWO1nWRTOB8oWteXQWQbSkmkvWRKyhLxdLb7cTSkEW488jSoAWRGzWP/cMxKxWPyYdSk/W6fhtG','WQpcNmomW4LsjgpcICktWQvxW5aF','WRlcP8obEWC','WPXZWRW','BSoiWQ7dTg9KW69yWQu','WP9HWRutAmkXW4lcU8onW7xdUZhdRSoAsIO','sL7dMmk0WPSQpca','W4pcUmo3DZ7cJ8o+W4VdTf4yW51gWRHPmCoOoXRdTIBdSgetW6ZdQMNcKSksW77cNGTXWRFcR2dcTIXDAadcHM/dGxvrmCkOb8keW67cTSkvW6KOWRTmyG3dSCoyW7lcG0NcIuNdK8kxlh3cUmkuxWiNqCoWW7tdOWWEsCoSrqbEDSkoW6NdQMTxWOxcNSomW7VdTrbnh8kDFcudiSomW5XQwIZdG3aSwSkWWOaPW4G4hdXLp04DWRyzl8kxW4xdT8oSCCoJDmkEq2eVx8k+WOVdM8krc2xcGgCKdIhcRuK8pJxdJ8oAW6RcSfXbm2ZcRSonW7HgfJnSxKpcMSoOW5NdUKxdPmoAlCkKW7aczSk8W7pdKcRcTvxcPc1PAuBdMmknamoVudKCW5pdPCoNW5nAW508WRqGjd02u8oXnmkCBSkWcSojEuxdULyEWR/cJaNcImkKjSkzmJdcVtXpdZv4W4hcSSoDWOShftpdTcVdJMj0WPNcRCkmWPjDW7j+WOX2WPJcSCkGkSkoWRftW5SJW4ZcJCkgohyon8old8o4WRbNW53cQSocW4dcVHqvW4DXW7/cOmkHjSkLW6LVySoxw0ahWPtcN8k6fSoOW4vwWPVdUmoBjxxdH8ksjCkuW7GgWO9jAs7dG8ogaKjFC8odW6i4W4yeF8kOimkfWRJdSSoNemkVeqKkamojhmoCW7RdR2JcNG','tCkqoCkUEG','k3PjqvrzWQmzbuyhWOPrW6xdHfPCmmoQxdS','W61LgI7cUmo1B1tdKG','W6tdL13dLmofxGuaWRS','buldMNVdL8ogWR9EW5OQtLiL','umksWQmpBCk1WQhdOW','WQWgemkvW7/dGfLi','BvC0W4BdUW','m29pqKi','W7HWgIRcG8oHy0ddU2i1','W6PAC8ksW4hdI3rlWOK','WOhdKSoSW5CZ','drldOSkNW4e','WOVdHmkfbK1YqW59AGu','Amo1W5VcMq','EN/cVa','BmkSkSkQW5i','jNSKW70kB8k/gfG','A8k/DqXPW4S8W7hdKW','ChhdTCkj','e8oNwXuAW5zsWRldR8ogWRy','ACkQyGzF','5PEu5ywF5zY65PYH6kYz5AAI6lwz','W7bapqdcVG','WPyqyXRcV8kjnSoqW71FWPFcOM7cKSkVW6OLsdfZzmkGW47cLmksxwu2W63cS11+ka','W4y/isNdPCk1y8o7WQfVW4/dKI7dOmoHW4jJvaGTja','emolxWOg','FJHPea4','weRdRmkqaa','z8kKhSkqW4booZJdPmkcisldLaWRq05WpxBdKtBdP8kcWRpdIN4ck8o2WRqkWPf1WOpdUSkKWRddJxRdSmklWRC9WOeuWRtdJMFcImkOWR8wW73cUmojo0HXeNtdSvDygSosWQRdT8oBrmknW49ZqwCUW7pcOHnOomkKWRhcH1bhW67dVmkHWOfsgxhdTmk+DYZcOSkQg8ozWQ7cSLnMe0FdJ8o3cZD2wMBcVmkqW6COzMancmk5gSkkWRr3WOdcL8oHt1baW6zuiSoUW5RdUSowWOxdICkhtwTBhCo2WOpdSY7dUCoxWQ7dMvzZW5aPW7ddPdHotmkPBYNdGcOdW4nCWOpdP8o9hCoMW5FdQ2DQhqCEW5hdMsifW4uadmojWODPFSkRk8o5wmkZW582W5pdSMhdSgxdL8orWOBdQCkXW6pdGcxdGbboWRVdNSkJg0L/W6aLWQzQW6tdPvTxWPJcTvxdSW','nmk6W63dOfq','CgNdJmkJWRO','cKVcNSkZW4e','aSkCd8oAWQS','5lIO5lIT5PYE5yI55zQF6l6V5zMN56Uu5Pw45OYg','zCoEWP/dTLL4W4XFWQe','W7b+hW','ACkoWQe','Ec1IW6SQq8kDew0','vH/cLYJcJSkqW7y','W44wASomWRO','zMChW6pdRCkjWO/dRCoZiWW2xMhcGmozW7m','emkXzCkHWQ/dVaJdM1dcO3dcJKldNX8','FSkpp8kdrmkQyLGj','ACkoWQe4uCkM','WRKAmmkeW7NdOfLjWRy','k8ooWQaitCk3WRJdRXtcVmo5r8o3DCk2h8ov','imkPjSoYWOWc','WRhcUCk+W4hdGq','D8odWOBdKuG','dmoSwCoYzWdcTmk0W5a','WPxcU8oRza','WPBcPSoWyru','hmo1Erq6W5zHWQNdJW','oCoJsXeS','W7jpW5eYWPpcMSkjrdzgW59FW73dM8oTsXjjW6tcUmoYWPddGComW5G','x0WJW7ZdIq','l2fA','DSkvWRqutCkZWQxdOai','W6mnCmknxW','W5hdT8oAWOdcRHtdUSkdm8kgbCoQ','W6VcRSo7WP7cGq','WO9+W4VdJd8','BY1jjd4','cSkIBCkH','W7zuz8o7WPGFW5W','i8kGmSoZWRainCkwWRj9WPVcUwC','lmkzW5NdIv8','rSotr0/cSCkkW54jWQ4','tCopWQ7cHgC','jSk9cSoMWR4','jxXiwfmnW6LbhequWPy','ySo1FSk5WOSpDSkgWRLYW4NdVsZcGsvWfSo7eGLpsWVdVCkPEmk8WPVdMmk5ACkI','WPxdPSo3W5yzWPjExf5cwmo8WPyxW6PyW7VdIxFcJNfctSocW7iItbVdTeq','W5HylGZcMa','WOT/CXH+','W6PdW4FdJ8omxwziWO0','WQRcVSoEqba','WPSpDa','dgWmamkjDf3dLmkBWR1oBXCLWRdcHrXHqfb9imonBW','WQ4ncmkpW70','emkcW47dKLS','nqxcL8kaaG','CYdcJ8osWPK','WQJdRSotWR3dNSokzSk9bh8','W5DgW63dS8ow','5PY85yUB5zQl6l6E5zI/56Qo5PE/5O2i','WORcOmo6Ac8','D8okWO/dQNq','tWRcHSo9WOC','a2KSgmk3','WO1Aza','D8kZWPLzoG','W7mTW5TsymklW5zVgW','x3mFW7JdVa','wCo/W7xcV8kT','W7NdGCknWOG','B8ovWORcQKS','p8kJia','xSk1Dtnp','W6zuCSo2WRKoW5q','WPdcRmk+W4hdOLtcVW','W7DfiItcPq','uCoJWRhcPva','WQxdT8oRW7St','ubbYiJG','W5eNuCojWPHCqXZdJJniFq','WR8mn8kuW77dJevgWRFcT8kaWRZdGhpdG+ITIoAXNowKQUI2RE+/PEIUGoAHQEAFOoE8LEI3U+MeNoISHq','WQ0AfCkXW7K','xCoTWPtcR0y','BfZdN8kzWRWLnYO','W6HYdZFcOW','W7VdGCkdWP0iwdlcNmk6','W6SUxmopWQS','m2forq','W79cW5VdHCowu2baWR1GA3ddLYi1uHPxlNhcKKrfWO7cQSkYb8k4twlcQda2WR/dTCkyW7r2WOKjW7zXEmoRWOldPfFdGmoBW7reWOzEWPddLghcQXewWONcQG','yYPlW6S+FCkvdM0','dmoSwCoYybVcOCkHW5LdWORdT1JcSmkh'],...(function(){return['rsbqW4GT','tsJcV8owWRm','BsfBreKaW7HFgKrDWP0gW6tcI15p','Dx/cV8ka','aNKkhCkZibtcLa','WQGimCksW6G','e8k2uSkmWPy','W77dTenuW6ZcO8odzxS','Fmo7W5ZcJa','WRfYuHHw','cfKjmCks','usZcU8oaWRPFfSkSyW','xmkYWP1dlq','x1JdOmk9WPxcG3ZdOSko','d8kbW5/dQenmW7FcHX3cUSoYW53cNcrSWPdcUmoUW4VdKZbQWPBdISkDESoSvstcNsahsmk1u2dcUmoCWPtdICo/Fvy8f8o/WOdcO8oOBSotpSkEmG','qc9Thaq','dmkSDmkBWPJdUX3dLflcG3i','oSonAaS3','BSoiWQZdVxT7W7DqWRJdQCoQW53dGNe','lH7cICk+eG','FGb7W7G+','W43cK8oUtb5/ydi','W5WmySoqWPe','BCoaWRBcT0tcMCkNwSkFlq8MbepcOCkZkgXfWPpdTmoJW7FcN8k8r8kdASknphGnW5dcI8opWRv9esjWWO5Tv8kyWOpcI8kZWO3cSsWxAgldTYP5W5pcGCkeFtNdMLhcLqJcI8o7jGqAW6qPW6yW','FSkskmkux8kkAa','WPH9WQSlFW','WPnLWPZcNSov','hmo/smo2','ya5SW4GG','W4VcG8oJr8oIW4qFqgS','EInngZ7cI3HGkSkwWP3dP8obW40muJ9fWQFcVmki6k6V5Rg15AwM6lwe772q6kYW5Qot5P6e576f6lw76ywb6kYs','DeJdICkIWQ0','W4igvCocWP4','DL7dRCkQWQa4bYZdUq','W48KvSoAWPO','W6BdHSk5WQ0Z','W7OWwCkUDrpdOg8','zSkQCWvSW6y8W6JdN8oKWPZcHCoyWQFcISk0pCo7psFcOSkeyCoRAwOyW7a','W7iSvG','WQ5Frt1t','W7uQW4XjuCklW5P9n2hdGCkOW6VcUqSxWO7cN8kn','WPLVWOVcVmobW5VcUmkLva','smovWQNdSga','htzhWQJcUmkoWORdM8oTjbq','WONcU8o/vsxcKW','vCoJWOi','EhNdLCk0WOC','rxaJW73dVCkFWO3dQ8o3','uCkMWQKyEG','lmkeW4NdKLC','W7a4W5TiAW','ob3cKCkWjmkbbCo5ua','WPNdT8oZW5Ky','WPxcTCoQyZi','Dmo6WQNdQem','W40kW55DsG','BZJcJSoSWRm','DSk7hCkn','A8k1zcX3W7C','WOpdStzfWRq','kqlcL8kMbCk7dSoTFCoFWPJdHSo/W7m1W5C','f8k3CSkTWPxdTbxdNeu','W6rbW5pdJrjqqmkDWQtcKCoAWQ8GxutdRCkrj8otvcu0WObj','DSkecSkqDa','W49iW4aWWQ7dGColdG','WPRcRSk8W5JdKq','W5/cPmot','W4VcG8oHtSo2W5ShshBdNWVcSNddNG','z8kaWRuyASk6WQRdQq','W7CSqSo+WO9l','WRCUemkwW4C','e8oKnK7dQSkqWPaMd19IvhRcLIVdRqFdJ18XWOFcUa/dLW','ASkiDqPW','lxeHWRL3pSoidM98W77dUMS','gfZcJSkOW4NcIYRdRmoLWObwW5yoASkNECk6DCkxW53dL8kutW','wqhcUCo/WOW','WRddSSo2W50Z','W78IuCoA','W5lcM8ofEG0','W61cqCo9WPyxW7FdJ2unW53dHsldNq','W5dcR8klW7BdNW','W7pdLxZdSmoe','v8k0WQXmdW','W5rClaJcHG','WOLSWRinAmkXW4lcU8oFW6BdPW','WPtcVSkgW43dRq','W7qDWOJcNu0gD8kvWPhcSmkZW5W','D8kbWPjUcW','CCkSv8oiW4bbzJJcQ8kxywVcIbPGsbG2','au3cSSkQW6NcNIldUW','WQtdPtDBWR4','p8oVrX8xW4XwWQ7dMa','jw0+bSkc','WQ0AjSktW57dKfLBWRhcTmkCWORcJhldQCoCCwNdRq','W6LzDmozWRtcMh1kWP3cS8k+WQ8','W5z4W4arWRG','AKujW6VdIW','cmkSz8kbWONdOq','WRZdItXoWRa','FCoSCMdcRa','euzKyM0','W5dcOCoHx8ot','amkqW58','WOHPW6pdUHjqu8klWQhcQ8kPW7HX','Bmkmimkpra','qwODW7JdL8oEW7xcSSkPCG','nSoKW4JdHY1iWOa','FJbZW6S0','Dw3dO8kpc8ojWQSNf8ohWPlcKZlcIN3cO8odlc0','sSkBWRTUgG','yCk7CqrmW6S7W7m','bCoPqby7','W5hcHCoqsmoYW4q6','ACo9WPZcMKW','WObfCWfT','W4RcTmoiutq','W48esSoEWQq','oSk/f8oSWPOzfSkmWQS','uWnbW7Oe','WRKNm8kkW6q','d3uEmSkv','pK/cUSkVW4m','WQviW4JdNWHBzSknWRRcKSkiW4iWvvlORB3MSRRLPBJOTQhVViNORPdMOP3MNj/NVkxOTjFPHkJORRu','WPhcQ8kgW57dTGFdVSkfECoFr8oGWPzZvWNcJSkxiL/dPmk/W77cPCklkM1rWPbxW53dJCk4W4xcUtdcNJiVvCoDWQtcLCk4jmkYWRRdHmo1WR17WRiA','WQrbW5pdHqL6DCkqWRu','yCkUb8kjWOHtntNcR8kDnsBdLfiMtf0','W7LjW50tWRG','cd7cUSk4iW','WOnIWQCLt8kW','tSo8WOdcIMS','g8oNE8ozvq','ACosWP3dS1r2W5ru','c8kAW4W','mmorBrW+','EmoMW4RcNCkBeSo+W4tcJG','W6tdKK3dOSocvWOj','W6W2W45+FmkE','W7W2xSkFuXNdOW','W6TIdtxcN8o8yf0','v8obrLNcOa','a8kuW5/dUq','WOD5WRqqtSo4WOJdPSoNWQhcPJNcICoEsgSjW7VdGG','mhPpweKeW6vqda','bSodyryT','WO3cOmoSyg3dJSkfW4xdTrvpWOToWRDPo8kUiJxdHHtdQtrEW6xdUgxcMmoiW7lcKv94WR3cV3ddPw5ft0VdGc/dJG8xySo+x8oQWQldQSodWR1L','WR0evrFcPmkhb8owW7TuWRFdRhVdMG','qhxcQ8keFq','WQitDGtcMmkloSob','WPBcKCoqFJu','eCoTBmo7qqFcG8kPW4u','yeawW4ldKa','h0VcUmkVW5m','g1xdIq','x8oTWPFcHvdcR8krD8o9ALy','W6u9W7T+za','W6HVW7ddOSok','5P+O5yM15zUW6l+e5zQj56QB5PEA5O+C','W7hdHCkhWPuXztBcG8kpWPLp','W77dI8kg','WQ/cSmoECsxcJmo6W4ddQ19RWO4nWRe','WP/cVSkaW4pdKe7cTmoysmoDqq','uSoiWPVdQLr2W5ru','FbpcJspcTCkvW7XnW4KNuwKZiXvCW6ZcKuhdGedOR6hMSPNLP63OTjBVVARORP/MOjdMNyVNV67OTzxPHkFOR5m','W7/dPCk9WPKk','W7hcTCkeW4hdV8o1','fCkqW5JdRvWc','W75AW5/dISoV','W6PJdslcHCoMz0BdJG','W78ItSkVwq','rSoqreBcVa','WPKjCb3cMmkloSob','BCooWRpcKgS','raNcHJJcQmkAW6Lj','EN/cVmkGs2K','WQzmW4JdIW','bSk/iSoYWQellCka','FCk7rcX2','qSoXWPJdI00','jUs4N+s5R+weJEwESSowW7VdG8oxc+AEHEIUKEIVH+AXHUwNG+I2M8kQ4Og177Uz4Oks77M0','DY3cUCoxWRn0i8kUCSkgm2b/WRDeW7WM','qCo3W63cRmkX','W7itW6zOqW','sCkXl8kbzG','DuRdKmkVWRSIiIa','W7j+dH3cUa','A8ouWPK','b1dcPCkXWP3dKgddV8okWOCzW41jz8kIi8k2AmkLWP/dJCksqSoDrCoUtY7dGM9WWP1T','WPnqCbLhW7uTWRZcRW','WPqhAGtcLW','WRrgzH9AW7CVWQS','W6HXW6OrWQ0','fx5TCfa','W6nuz8o6WPGFW4a','xSkSWODxoa','W7HhW4xdISolww5AWP1Roc/dMG45vfCznhhcHM8AWP/cOCk2mCkY','WOlcSCoSzstcHmoyW5VdQL1kWRbwWRb/6k6H5Rod5AwK6lwO776R6k6t5Qgz5P++572/6lwR6yws6k+v','WR8mn8kdW6ldJu4','W7z6wSopWR4','uWVcIcFcRq','W7SSsmk9uc7dPw8gtW','W67dShJdQSog','ACo6W4VcVmkPh8oS','BMJcV8kOCq','WPafzWpcPCkpjConW7PwWPBdKIddM8kH6k2Q5Rcq5Awu6lwY77Yq6k+H5Qcn5PYg576W6lsp6yE86k+v','tNmIW5ZdQW','W74im8krW6tdJqPyWRhdPa','ewSDaSkZibtcLa','W5fkW4CiWOC','lq/cKCk+','c8oRxSouwXdcSa','WQbiW53dHdvlEq','W7VdI8ks','Eu8JW7/dOa','eCoNxrK','WOLSWRinDmkSW4hcPG','WRZcUmoQzIy','W6G5vCkSef3dOMusrN5PDSkamCkikq','hSkRlCkhWRxcVWBdKHhcRN/cHupcGXDByqOG','A8k1gSkAW4W','yCo1W5VcM8kG','WOXuDW58','x8oTWPFcHuZcSSksAG','cmo/tSoKuq','W7TsW5tdImoSt2i','y3hdOSky','WRiUEHxcMq','t8ouqfRcTSo5WP9aWRi4W67cShBcHCoJW4eImqBcJ8okyCkCWOD0vwBcJHFcNH1KrCo9EmkWCmoLyHNdOaf/iY3dGrGbE8oBjKbEs3WwW7jcWR7cS8kkWPjuW7W','WP5eWQimBG','W7dcGCo7sdm','WOvHWQCrAG','W73dM0JdMmoz','WQ5cW5S','ymo2W6JcV8ky','rCkvWOzckW','WPJdUYz/WRu','FuZdJSkJWPWLnYO','WRlcJmoXzIi','rxCwW7ZdUW','W7VcTSkmW6VdV8ody8kVpa','BuJdICkLWROVna','W77dL8kNWP0fEH3cKmkYWO5HW78tvW','W6ddIKhdMCoOvGisWRbpWOjrAH8PWQVcON8xWPq7W7tcP8kAeq','WPZdOrTgWPK','DL7dR8kJWRqNhYtdPmoOWQ7dK3/cMa','W7qBrmo1WO0'];}())];}())];}());_0x4ec5=function(){return _0x2544ae;};return _0x4ec5();};async function sqb(){const _0x5bb138=_0x5544f7,_0x5ef452={'wuRHm':function(_0x14c96a,_0x3909b7){return _0x14c96a==_0x3909b7;},'oDqeo':function(_0x3d28a2,_0x404f97){return _0x3d28a2>_0x404f97;},'kmfBo':function(_0xc04600,_0x3ff299){return _0xc04600!==_0x3ff299;},'TGoeY':_0x5bb138(0x29a,'Q9Xl'),'JCcei':function(_0x57f350,_0x3c6f2c){return _0x57f350==_0x3c6f2c;},'MuhrR':function(_0x74ca89){return _0x74ca89();},'uDkmC':function(_0x2a83b3,_0x3d2c16){return _0x2a83b3===_0x3d2c16;},'zaGEs':_0x5bb138(0x1ee,'hlq('),'pmytV':_0x5bb138(0x2b9,'7V%d'),'oCqyJ':_0x5bb138(0x3bf,'eB*j'),'UGvnN':_0x5bb138(0x409,'WkdZ'),'ixFvD':_0x5bb138(0x238,'iDgF'),'TBVxn':_0x5bb138(0x211,'1ClJ'),'lyMBx':_0x5bb138(0x391,'Z6$Z'),'pUnxh':_0x5bb138(0x2d2,'hUaS'),'rQRtD':_0x5bb138(0x403,'1q(M'),'QalAc':_0x5bb138(0x200,'7V%d'),'IOCDN':_0x5bb138(0x307,'1q(M'),'WjZdi':_0x5bb138(0x2b1,'1ClJ'),'RkIfT':_0x5bb138(0x278,'R(Mj'),'DqUvI':_0x5bb138(0x3f0,'isAf'),'lVcTG':_0x5bb138(0x1b8,'C]mw'),'LMtYF':_0x5bb138(0x323,'@Oa$'),'USvgR':_0x5bb138(0x380,'Wb[u')};let _0x24064c=_0x5ef452[_0x5bb138(0x31c,'q(jj')],_0x51a718={'source':_0x5ef452[_0x5bb138(0x38c,'G4wp')]},_0x5deaa4={'appId':_0x5ef452[_0x5bb138(0x3e0,'okvo')],'fn':_0x24064c,'body':_0x51a718,'apid':_0x5ef452[_0x5bb138(0x2e1,'vWEH')],'ver':_0x5ef452[_0x5bb138(0x2b0,'R(Mj')],'cl':_0x5ef452[_0x5bb138(0x3b6,'^z%a')],'user':$[_0x5bb138(0x313,'YmHl')],'code':0x1,'ua':$['UA']};_0x51a718=await _0x311148[_0x5bb138(0x2ca,'YmHl')](_0x5deaa4);if(!_0x51a718)return;return new Promise(async _0x49d140=>{const _0x5e9b1e=_0x5bb138;if(_0x5ef452[_0x5e9b1e(0x41c,'Xn8f')](_0x5ef452[_0x5e9b1e(0x258,'hUaS')],_0x5ef452[_0x5e9b1e(0x1a3,'ggm2')])){_0x505659=_0x143600[_0x5e9b1e(0x33d,'X$H7')](_0x57a493);if(_0x5ef452[_0x5e9b1e(0x1ae,'C]mw')](_0x472f90[_0x5e9b1e(0x279,'q(jj')],0x0))_0x3c0979[_0x5e9b1e(0x3c9,'q(jj')]=_0x118c7c[_0x5e9b1e(0x3fd,'mN5O')][_0x5e9b1e(0x321,'mN5O')]+'个',_0x5ef452[_0x5e9b1e(0x430,'X$H7')](_0x6fd420[_0x5e9b1e(0x392,'#Rdh')][_0x5e9b1e(0x23f,'$hJZ')],0x7530)&&(_0xb0fae7[_0x5e9b1e(0x22f,'74^m')]+=_0x5e9b1e(0x372,'6&Qd'));else{}}else{const _0x81ec71={'url':_0x5e9b1e(0x3ef,'0UPE'),'body':_0x5e9b1e(0x31f,'K5xH')+_0x51a718,'headers':{'Host':_0x5ef452[_0x5e9b1e(0x29f,'ggm2')],'Referer':_0x5ef452[_0x5e9b1e(0x2f0,'#Rdh')],'User-Agent':$['UA'],'cookie':cookie,'wqreferer':_0x5ef452[_0x5e9b1e(0x1e7,'Wb[u')],'x-rp-client':_0x5ef452[_0x5e9b1e(0x253,'^(Ip')],'accept-language':_0x5ef452[_0x5e9b1e(0x2fc,'!TDk')],'Accept-Encoding':_0x5ef452[_0x5e9b1e(0x3fa,'$jni')],'x-referer-page':_0x5ef452[_0x5e9b1e(0x20d,'vyz@')],'x-referer-package':_0x5ef452[_0x5e9b1e(0x19a,'Xn8f')],'accept':_0x5ef452[_0x5e9b1e(0x39f,'iDgF')]}};$[_0x5e9b1e(0x444,'iDgF')](_0x81ec71,(_0x17190d,_0x5ee599,_0x42d681)=>{const _0x3b62b9=_0x5e9b1e;try{if(_0x5ef452[_0x3b62b9(0x220,'dh%]')](_0x5ef452[_0x3b62b9(0x21c,'ggm2')],_0x5ef452[_0x3b62b9(0x1d8,'Ymzs')])){const _0x312c15=_0x2dbd5f?function(){const _0x3f2f5=_0x3b62b9;if(_0x43f539){const _0x511367=_0x5b4e67[_0x3f2f5(0x21a,'92mQ')](_0x28ca39,arguments);return _0x4211f1=null,_0x511367;}}:function(){};return _0x6bbd85=![],_0x312c15;}else{if(_0x17190d)$[_0x3b62b9(0x43d,'Ymzs')](_0x17190d),console[_0x3b62b9(0x194,'^z%a')](_0x3b62b9(0x24a,'EjdX'));else{_0x42d681=JSON[_0x3b62b9(0x233,'isAf')](_0x42d681);if(_0x5ef452[_0x3b62b9(0x348,'X$H7')](_0x42d681[_0x3b62b9(0x231,'ynBt')],0x0))$[_0x3b62b9(0x1a0,'X$H7')]=_0x42d681[_0x3b62b9(0x33a,'Xn8f')][_0x3b62b9(0x3e5,'cTo)')]+'个',_0x5ef452[_0x3b62b9(0x38a,'mN5O')](_0x42d681[_0x3b62b9(0x234,'#SLf')][_0x3b62b9(0x217,'!TDk')],0x7530)&&($[_0x3b62b9(0x3a1,'Z6$Z')]+=_0x3b62b9(0x34d,'Wb[u'));else{}}}}catch(_0x4715fe){$[_0x3b62b9(0x24c,'3kz^')](_0x4715fe);}finally{_0x5ef452[_0x3b62b9(0x1f8,'3kz^')](_0x49d140);}});}});}var version_ = 'jsjiami.com.v7';
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