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

var _0xodf='jsjiami.com.v7';const _0x337609=_0x50ec;(function(_0x3d3b6c,_0x2a2e90,_0x448096,_0x1db216,_0x38ea30,_0x8a3815,_0xb89a49){return _0x3d3b6c=_0x3d3b6c>>0x3,_0x8a3815='hs',_0xb89a49='hs',function(_0x14429d,_0x11448e,_0x50a6d0,_0x343c88,_0x2aed90){const _0x187ec5=_0x50ec;_0x343c88='tfi',_0x8a3815=_0x343c88+_0x8a3815,_0x2aed90='up',_0xb89a49+=_0x2aed90,_0x8a3815=_0x50a6d0(_0x8a3815),_0xb89a49=_0x50a6d0(_0xb89a49),_0x50a6d0=0x0;const _0x50778a=_0x14429d();while(!![]&&--_0x1db216+_0x11448e){try{_0x343c88=-parseInt(_0x187ec5(0x120,'Yi@d'))/0x1+-parseInt(_0x187ec5(0x246,']ygP'))/0x2*(-parseInt(_0x187ec5(0x2a6,'Lq0E'))/0x3)+-parseInt(_0x187ec5(0x349,'bTw%'))/0x4+-parseInt(_0x187ec5(0x3ac,'LT9r'))/0x5*(-parseInt(_0x187ec5(0x256,'UR4M'))/0x6)+parseInt(_0x187ec5(0x13e,'hKFA'))/0x7+-parseInt(_0x187ec5(0x401,'QYcb'))/0x8+parseInt(_0x187ec5(0x7e,'8$%X'))/0x9;}catch(_0xde6bcd){_0x343c88=_0x50a6d0;}finally{_0x2aed90=_0x50778a[_0x8a3815]();if(_0x3d3b6c<=_0x1db216)_0x50a6d0?_0x38ea30?_0x343c88=_0x2aed90:_0x38ea30=_0x2aed90:_0x50a6d0=_0x2aed90;else{if(_0x50a6d0==_0x38ea30['replace'](/[GJHwfUEWNglpTFYnAMtkXD=]/g,'')){if(_0x343c88===_0x11448e){_0x50778a['un'+_0x8a3815](_0x2aed90);break;}_0x50778a[_0xb89a49](_0x2aed90);}}}}}(_0x448096,_0x2a2e90,function(_0x12856a,_0x66e9dc,_0x41f51c,_0x55e981,_0x2dd6d0,_0x2d4d7b,_0x126e78){return _0x66e9dc='\x73\x70\x6c\x69\x74',_0x12856a=arguments[0x0],_0x12856a=_0x12856a[_0x66e9dc](''),_0x41f51c=`\x72\x65\x76\x65\x72\x73\x65`,_0x12856a=_0x12856a[_0x41f51c]('\x76'),_0x55e981=`\x6a\x6f\x69\x6e`,(0x188eff,_0x12856a[_0x55e981](''));});}(0x5f8,0x7fa7c,_0x35c4,0xc1),_0x35c4)&&(_0xodf=`\xc5c`);const _0x4ad236=(function(){const _0x21d68c=_0x50ec,_0xbff979={'MwhgU':function(_0xcb817d,_0x25d25a){return _0xcb817d!==_0x25d25a;},'FDMKU':_0x21d68c(0x291,'66K]')};let _0x39f975=!![];return function(_0x3d2bda,_0x177ac4){const _0x30fec7=_0x21d68c,_0x209eac={'srqNE':function(_0x4b366c,_0x422e50){const _0x5ba326=_0x50ec;return _0xbff979[_0x5ba326(0x140,'UR4M')](_0x4b366c,_0x422e50);},'cAAoJ':_0xbff979[_0x30fec7(0x2ef,'&$Uf')]},_0xb0bf8=_0x39f975?function(){const _0x54f9b9=_0x30fec7;if(_0x177ac4){if(_0x209eac[_0x54f9b9(0x1fd,'LT9r')](_0x209eac[_0x54f9b9(0x3af,']Qq*')],_0x209eac[_0x54f9b9(0x3da,')0p$')])){const _0x36955b=_0x29fa12[_0x54f9b9(0x186,'hKFA')](_0x57f5f2,arguments);return _0x5d3b76=null,_0x36955b;}else{const _0x53eaca=_0x177ac4[_0x54f9b9(0x96,'3FZ*')](_0x3d2bda,arguments);return _0x177ac4=null,_0x53eaca;}}}:function(){};return _0x39f975=![],_0xb0bf8;};}()),_0x5b3d34=_0x4ad236(this,function(){const _0x5a11d5=_0x50ec,_0x327257={'dDdzs':_0x5a11d5(0x305,'AV58')};return _0x5b3d34[_0x5a11d5(0xf1,'NY)W')]()[_0x5a11d5(0xb3,'M4)X')](_0x327257[_0x5a11d5(0x25b,'NY)W')])[_0x5a11d5(0x230,'v]ye')]()[_0x5a11d5(0x2cc,'&$Uf')](_0x5b3d34)[_0x5a11d5(0x2cb,'pz7r')](_0x327257[_0x5a11d5(0x202,'8$%X')]);});_0x5b3d34();const _0x41ad30=require(_0x337609(0x155,']!sC')),_0x24dbe2=require(_0x337609(0x9c,'Gspb')),_0x5bac0d=require(_0x337609(0x292,'pz7r')),_0x86f79a=require(_0x337609(0x309,'bTw%'));function wanyiwan(){const _0x1da8a9=_0x337609,_0x3524d1={'tvBUW':function(_0x37731b,_0x469572){return _0x37731b==_0x469572;},'eQZMh':_0x1da8a9(0xf7,'RUQ#'),'EPGTa':function(_0x3b1b10,_0x2787b2){return _0x3b1b10===_0x2787b2;},'fqaCr':_0x1da8a9(0x2b4,']!sC'),'WSTvb':_0x1da8a9(0x24a,'3D04'),'jwhBM':function(_0x32279b,_0x443680){return _0x32279b!==_0x443680;},'MGiNk':_0x1da8a9(0x37a,'bTw%'),'cwpsr':_0x1da8a9(0x3dc,'0Mgc'),'ANYDs':_0x1da8a9(0x395,'AX(a'),'ppdkt':_0x1da8a9(0x36f,'3FZ*'),'NNHxP':_0x1da8a9(0x108,'YiiC'),'vuXGA':_0x1da8a9(0xba,'dyzd'),'uLtWR':_0x1da8a9(0x35c,'c^vU'),'KGqDS':function(_0x590e11){return _0x590e11();}};return new Promise(async _0x1f1bd4=>{const _0x1a102d=_0x1da8a9,_0xce402d={'url':_0x1a102d(0x1ed,'UR4M'),'body':_0x1a102d(0x33c,'nEN@'),'headers':{'Cookie':cookie,'content-type':_0x1a102d(0x23a,')0p$'),'Origin':_0x1a102d(0x128,'3FZ*'),'Referer':_0x1a102d(0x260,']ygP'),'User-Agent':$['UA']},'timeout':0x7530};$[_0x1a102d(0x38b,'RUQ#')](_0xce402d,(_0x4b1106,_0x23631c,_0x57106a)=>{const _0xa72a16=_0x1a102d,_0x5991a2={'SpuHf':function(_0x16aee6,_0x27fd8f){const _0xbb112a=_0x50ec;return _0x3524d1[_0xbb112a(0x2b5,'Gspb')](_0x16aee6,_0x27fd8f);},'pTosZ':_0x3524d1[_0xa72a16(0x1eb,'zG[D')]};try{if(_0x3524d1[_0xa72a16(0x195,'hKFA')](_0x3524d1[_0xa72a16(0xc7,'AX(a')],_0x3524d1[_0xa72a16(0x1c9,']ygP')]))_0xbae5d4[_0xa72a16(0x1aa,'UR4M')](_0x402c58,_0x1f96c7);else{if(_0x4b1106){if(_0x3524d1[_0xa72a16(0x33b,'UqTs')](_0x3524d1[_0xa72a16(0x16a,'E&Yu')],_0x3524d1[_0xa72a16(0x1f9,'Vl#[')]))$[_0xa72a16(0x22e,'ZOA6')](_0x4b1106);else{const _0x4e9a31=_0x2303ad[_0xa72a16(0x269,'hKFA')](_0xd1b1a0);_0x5991a2[_0xa72a16(0x38e,'AX(a')](_0x4e9a31[_0xa72a16(0x2af,'LT9r')],0x3e8)&&(_0x8b6f7b[_0xa72a16(0x1ce,'zPEi')]=_0x4e9a31['rs'][_0xa72a16(0x273,'Lq0E')][_0xa72a16(0xa9,'LT9r')]);}}else _0x57106a?(_0x57106a=$[_0xa72a16(0x145,'XPN5')](_0x57106a),_0x57106a[_0xa72a16(0xa0,'Y1fP')]&&(_0x3524d1[_0xa72a16(0x209,']Qq*')](_0x3524d1[_0xa72a16(0x39f,'0Mgc')],_0x3524d1[_0xa72a16(0x126,'&$Uf')])?_0x45dcc0[_0xa72a16(0x37e,'&$Uf')](_0x596660):$[_0xa72a16(0x3f1,'nEN@')]=_0x57106a[_0xa72a16(0x351,'66K]')][_0xa72a16(0x304,')0p$')]||0x0)):_0x3524d1[_0xa72a16(0x84,'Yi@d')](_0x3524d1[_0xa72a16(0x3ab,')0p$')],_0x3524d1[_0xa72a16(0x29f,'AV58')])?$[_0xa72a16(0x33f,'hKFA')](_0x3524d1[_0xa72a16(0x3a8,'Lq0E')]):(_0xde0aef[_0xa72a16(0x1ad,'Y1fP')](_0x5991a2[_0xa72a16(0x18a,'*PVh')]),_0x12665f[_0xa72a16(0x161,'dyzd')](_0xe4f98a[_0xa72a16(0x1e0,'*PVh')](_0x7f7f4d)));}}catch(_0x1dd551){$[_0xa72a16(0xa4,'0Mgc')](_0x1dd551);}finally{_0x3524d1[_0xa72a16(0x1b4,'0Mgc')](_0x1f1bd4);}});});}async function getuserinfo_6dy_bak(){const _0x685601=_0x337609,_0x583a86={'jrmJL':function(_0x1c806e,_0x1fa2bc){return _0x1c806e===_0x1fa2bc;},'nygfp':_0x685601(0x15a,'@BwA'),'IWnhP':_0x685601(0x405,'E&Yu'),'MGinu':_0x685601(0x3f5,']ygP'),'dzlzb':function(_0x335661,_0x172f0c){return _0x335661===_0x172f0c;},'HWlDO':function(_0x4b78eb,_0x420c3c){return _0x4b78eb===_0x420c3c;},'GLsOh':_0x685601(0x39a,'QYcb'),'wftXn':_0x685601(0x23b,'nEN@'),'ECZFr':function(_0xd5eaf1,_0x286229){return _0xd5eaf1==_0x286229;},'tqUjT':function(_0x2b2f19,_0x384fa0){return _0x2b2f19===_0x384fa0;},'FWcLu':_0x685601(0x29a,'8$%X'),'tZcFl':_0x685601(0x384,'NY)W'),'bsSog':_0x685601(0x3e9,'k!0k'),'eAMDd':function(_0x392cf2){return _0x392cf2();},'VeFtZ':_0x685601(0x34f,'c^vU'),'jRoEF':function(_0x49b9ef,_0x58d641){return _0x49b9ef==_0x58d641;},'UBoya':_0x685601(0x2fc,'Yi@d'),'tYLna':_0x685601(0x103,'NY)W'),'nnLnE':_0x685601(0x2a1,'dyzd'),'sohbi':_0x685601(0x2e2,'pz7r'),'eCTBe':_0x685601(0x335,'66K]')};let _0x440e1a={'url':_0x583a86[_0x685601(0x2e7,'q2Es')],'headers':{'Accept':_0x583a86[_0x685601(0x259,'v]ye')],'accept-encoding':_0x583a86[_0x685601(0x360,'LT9r')],'content-type':_0x583a86[_0x685601(0x2b6,'v]ye')],'Cookie':cookie,'User-Agent':$['UA']}};return new Promise(_0x4bc8bd=>{const _0x2444b7=_0x685601,_0x1f29c3={'qBYFV':_0x583a86[_0x2444b7(0x3d5,'zPEi')],'sVPyG':function(_0x4e15fd,_0xf2d344){const _0x2f00aa=_0x2444b7;return _0x583a86[_0x2f00aa(0x131,'&$Uf')](_0x4e15fd,_0xf2d344);},'VOgtd':_0x583a86[_0x2444b7(0x3f4,'qfcN')]};$[_0x2444b7(0x1d8,'UR4M')](_0x440e1a,async(_0x3d0bee,_0x586a13,_0x57322d)=>{const _0x9544e9=_0x2444b7;try{if(_0x583a86[_0x9544e9(0x14d,'bSZd')](_0x583a86[_0x9544e9(0x341,'zG[D')],_0x583a86[_0x9544e9(0x3b8,'UqTs')])){if(_0x3d0bee)console[_0x9544e9(0x34a,'AV58')](''+JSON[_0x9544e9(0x258,'YiiC')](_0x3d0bee)),console[_0x9544e9(0x2e4,'bTw%')](_0x9544e9(0x3c8,'qfcN'));else{if(_0x57322d){_0x57322d=JSON[_0x9544e9(0x2c3,'Gspb')](_0x57322d);if(_0x583a86[_0x9544e9(0xf9,'*PVh')](_0x57322d[_0x583a86[_0x9544e9(0x353,'Yi@d')]],_0x583a86[_0x9544e9(0x3cd,'E&Yu')])){$[_0x9544e9(0x1c0,'3D04')]=![];return;}if(_0x583a86[_0x9544e9(0x104,'V8iQ')](_0x57322d[_0x9544e9(0x294,'0Mgc')],'0')&&_0x57322d[_0x9544e9(0x237,']!sC')]){if(_0x583a86[_0x9544e9(0x386,'UqTs')](_0x583a86[_0x9544e9(0x1f8,'LmPB')],_0x583a86[_0x9544e9(0x164,'0Mgc')])){const _0x66f843=_0x583a86[_0x9544e9(0x2ee,'zG[D')][_0x9544e9(0x2fa,'M4)X')]('|');let _0x291313=0x0;while(!![]){switch(_0x66f843[_0x291313++]){case'0':$[_0x9544e9(0x3c2,'UqTs')]=_0x57322d[_0x9544e9(0xc1,'NY)W')]?.[_0x9544e9(0x92,'zPEi')]?.[_0x9544e9(0x115,'^[Wr')]?.[_0x9544e9(0x93,'AJ08')];continue;case'1':$[_0x9544e9(0x347,'Yi@d')]=_0x57322d[_0x9544e9(0x1e6,'3D04')]?.[_0x9544e9(0x37d,']Qq*')]?.[_0x9544e9(0x38a,'66K]')]||'';continue;case'2':$[_0x9544e9(0x10a,'66K]')]=_0x583a86[_0x9544e9(0xd0,'Lq0E')](_0x57322d[_0x9544e9(0x237,']!sC')]?.[_0x9544e9(0x2a9,'v]ye')]?.[_0x9544e9(0x3f3,']ygP')],0x1);continue;case'3':$[_0x9544e9(0x312,'YiiC')]=$[_0x9544e9(0x336,'q2Es')];continue;case'4':$[_0x9544e9(0x1cd,'LT9r')]=_0x57322d[_0x9544e9(0x2e6,'LT9r')]?.[_0x9544e9(0x7f,'3D04')]?.[_0x9544e9(0x2b7,'zPEi')]||0x0;continue;}break;}}else try{_0x3da16e[_0x9544e9(0x98,'3FZ*')]=_0x1ad34d[_0x9544e9(0x1e6,'3D04')][_0x9544e9(0x389,'8$%X')][_0x9544e9(0xfa,'XPN5')][0x0][_0x9544e9(0x3a4,'dyzd')]||0x0,_0x5b7452[_0x9544e9(0x8f,'M4)X')]=_0x1afe2e[_0x9544e9(0x3a0,'RUQ#')][_0x9544e9(0xfd,'v]ye')][_0x9544e9(0x221,'NY)W')][0x0][_0x9544e9(0x32e,'QYcb')]||0x0;}catch{}}}else{if(_0x583a86[_0x9544e9(0x13b,'zG[D')](_0x583a86[_0x9544e9(0x17e,'AV58')],_0x583a86[_0x9544e9(0x193,'*PVh')])){const _0x37ced1=_0x1f29c3[_0x9544e9(0x376,'ZOA6')][_0x9544e9(0x2fa,'M4)X')]('|');let _0x1a1067=0x0;while(!![]){switch(_0x37ced1[_0x1a1067++]){case'0':_0x19366b[_0x9544e9(0x3be,'AX(a')]=_0xb984b2[_0x9544e9(0x170,'AX(a')];continue;case'1':_0x3eeb44[_0x9544e9(0x26e,'Lq0E')]=_0x232f18[_0x9544e9(0x214,'UR4M')]?.[_0x9544e9(0x38f,'*PVh')]?.[_0x9544e9(0x36c,'ZOA6')]||'';continue;case'2':_0x4f64b9[_0x9544e9(0x26d,'AV58')]=_0x52d3af[_0x9544e9(0x214,'UR4M')]?.[_0x9544e9(0x25a,'t@lz')]?.[_0x9544e9(0x178,'zG[D')]||0x0;continue;case'3':_0x374d72[_0x9544e9(0xf2,'AX(a')]=_0x105a9e[_0x9544e9(0x2a7,'zG[D')]?.[_0x9544e9(0x361,'hKFA')]?.[_0x9544e9(0x28e,']!sC')]?.[_0x9544e9(0x3ea,'3FZ*')];continue;case'4':_0xfc2e45[_0x9544e9(0x129,'ZOA6')]=_0x1f29c3[_0x9544e9(0x228,'3D04')](_0x5620a5[_0x9544e9(0x2a7,'zG[D')]?.[_0x9544e9(0x3e2,'bSZd')]?.[_0x9544e9(0x29c,'NY)W')],0x1);continue;}break;}}else $[_0x9544e9(0x33f,'hKFA')](_0x583a86[_0x9544e9(0xe3,'zPEi')]);}}}else _0x3c1c20?(_0xb34efc=_0x138a16[_0x9544e9(0x1a8,'pz7r')](_0x4154ba),_0x3d099c[_0x9544e9(0x35a,'LmPB')]&&(_0x9de9a5[_0x9544e9(0x333,'ZOA6')]=_0x52aa97[_0x9544e9(0x114,'8$%X')][_0x9544e9(0x3f9,'QYcb')]||0x0)):_0x86c934[_0x9544e9(0x1be,'zPEi')](_0x1f29c3[_0x9544e9(0x17d,'NY)W')]);}catch(_0x1ceefc){$[_0x9544e9(0x37e,'&$Uf')](_0x1ceefc,_0x586a13);}finally{_0x583a86[_0x9544e9(0x10e,'y^[Q')](_0x4bc8bd);}});});}async function getuserinfo_6dy(){const _0xeaf059=_0x337609,_0x23f2dd={'ZBBpq':function(_0xf2f8b2,_0x48b496){return _0xf2f8b2===_0x48b496;},'MhRfY':_0xeaf059(0xe8,'zPEi'),'aZwjE':_0xeaf059(0x2b1,'Vl#['),'GLCrI':function(_0x19b27c,_0x4f4430){return _0x19b27c===_0x4f4430;},'IxnXF':_0xeaf059(0x1e9,'V8iQ'),'pdJAj':_0xeaf059(0x197,'AJ08'),'xkRhZ':_0xeaf059(0x95,'@BwA'),'CIzLd':function(_0xe211da,_0x33c9bf){return _0xe211da===_0x33c9bf;},'Fzomt':function(_0x3a6f4f,_0x5338d7){return _0x3a6f4f!==_0x5338d7;},'goFkt':_0xeaf059(0x3fc,'Y1fP'),'QwQxe':_0xeaf059(0x345,'zG[D'),'glcGN':_0xeaf059(0x2fd,'&$Uf'),'qkqYq':function(_0x879e8,_0x3d92bc){return _0x879e8==_0x3d92bc;},'mJrnJ':_0xeaf059(0x3c6,'hKFA'),'spdIK':_0xeaf059(0x28a,'LmPB'),'eAUWu':_0xeaf059(0x2b9,'UR4M'),'agvIs':function(_0x1e31cc){return _0x1e31cc();},'JFSvt':function(_0x1aca1d,_0x24bc27){return _0x1aca1d(_0x24bc27);},'HlvgU':function(_0x58e7e9,_0x389fed){return _0x58e7e9!==_0x389fed;},'KiYvU':_0xeaf059(0x3d0,'^[Wr'),'gvqdp':_0xeaf059(0x23c,'Lq0E'),'CSieq':_0xeaf059(0x352,'hKFA'),'VWJJI':_0xeaf059(0x15f,'Lq0E'),'wXJmX':_0xeaf059(0x29e,'8$%X'),'cJnGS':_0xeaf059(0x2aa,'F40$'),'AKAoE':_0xeaf059(0x32a,'F40$'),'ciGvD':_0xeaf059(0x163,'t@lz'),'SzmVW':_0xeaf059(0x299,'c^vU'),'ooLnM':_0xeaf059(0x218,']ygP'),'MHPht':_0xeaf059(0x311,'V8iQ'),'IqBzA':_0xeaf059(0x22c,'66K]'),'pAbqd':_0xeaf059(0x1b0,'NY)W'),'kBwhl':_0xeaf059(0x22a,']!sC'),'INyud':_0xeaf059(0x165,'66K]'),'vwhXK':_0xeaf059(0x106,'q2Es'),'XxSJu':_0xeaf059(0x19b,'y^[Q'),'lHTGK':_0xeaf059(0x182,'zPEi'),'lbDrV':_0xeaf059(0x39c,'3D04')};let _0x3ae9f0={'orgFlag':_0x23f2dd[_0xeaf059(0x1de,'UqTs')],'callSource':_0x23f2dd[_0xeaf059(0x12e,'y^[Q')],'channel':0x1,'isHomewhite':0x1,'bizModelCode':'6','externalLoginType':'1','bizModeClientType':_0x23f2dd[_0xeaf059(0x21c,'AX(a')],'appId':_0x23f2dd[_0xeaf059(0x3e3,'Vl#[')],'token':_0x23f2dd[_0xeaf059(0x326,'*PVh')],'tenantCode':_0x23f2dd[_0xeaf059(0x298,'y^[Q')],'uuid':'','client':_0x23f2dd[_0xeaf059(0xef,'3D04')],'sourceType':_0x23f2dd[_0xeaf059(0x301,'AX(a')]},_0x1a1427={'appId':_0x23f2dd[_0xeaf059(0x2fb,'qfcN')],'fn':_0x23f2dd[_0xeaf059(0x110,'Lq0E')],'body':_0x3ae9f0,'apid':_0x23f2dd[_0xeaf059(0xc3,'YiiC')],'client':_0x23f2dd[_0xeaf059(0xc0,'AV58')],'user':$[_0xeaf059(0x3f2,'UR4M')],'code':0x1,'ua':$['UA']};_0x3ae9f0=await _0x24dbe2[_0xeaf059(0x322,'ZOA6')](_0x1a1427);let _0x40de2d={'url':_0xeaf059(0x224,'y^[Q')+_0x3ae9f0+_0xeaf059(0x1a5,'bSZd'),'headers':{'Accept':_0x23f2dd[_0xeaf059(0x354,'Yi@d')],'accept-encoding':_0x23f2dd[_0xeaf059(0x13c,'F40$')],'content-type':_0x23f2dd[_0xeaf059(0xb7,'Lq0E')],'referer':_0x23f2dd[_0xeaf059(0x159,'Yi@d')],'Cookie':cookie,'User-Agent':$['UA']},'ciphers':_0x23f2dd[_0xeaf059(0x167,'ZOA6')]};return new Promise(_0x2b62b2=>{const _0x5940a2=_0xeaf059;_0x23f2dd[_0x5940a2(0xa7,'UR4M')](_0x23f2dd[_0x5940a2(0xbe,'Lq0E')],_0x23f2dd[_0x5940a2(0x2cf,'Lq0E')])?$[_0x5940a2(0x1d8,'UR4M')](_0x40de2d,async(_0x1feb3d,_0x228eaf,_0x4a8344)=>{const _0xbb9772=_0x5940a2;try{if(_0x1feb3d)console[_0xbb9772(0x33f,'hKFA')](''+JSON[_0xbb9772(0x2e5,'LmPB')](_0x1feb3d)),console[_0xbb9772(0x33f,'hKFA')](_0xbb9772(0x220,'LmPB'));else{if(_0x23f2dd[_0xbb9772(0x1c6,'y^[Q')](_0x23f2dd[_0xbb9772(0x141,'Gspb')],_0x23f2dd[_0xbb9772(0x2da,'3FZ*')])){if(_0x1ebbf9){const _0x3fa64a=_0x3e61f6[_0xbb9772(0x189,'AV58')](_0x28bf1d,arguments);return _0x1a6807=null,_0x3fa64a;}}else{if(_0x4a8344){_0x4a8344=JSON[_0xbb9772(0xd9,'dyzd')](_0x4a8344);if(_0x23f2dd[_0xbb9772(0x371,'0Mgc')](_0x4a8344[_0x23f2dd[_0xbb9772(0x2ac,'*PVh')]],_0x23f2dd[_0xbb9772(0x227,'RUQ#')])){if(_0x23f2dd[_0xbb9772(0x324,'V8iQ')](_0x23f2dd[_0xbb9772(0x100,'QYcb')],_0x23f2dd[_0xbb9772(0x252,'Lq0E')])){$[_0xbb9772(0x1f7,'AX(a')]=![];return;}else _0xfabc6b=_0x206755[_0xbb9772(0x12b,')0p$')](_0x82adf),_0x3dd75b[_0xbb9772(0x32d,']Qq*')]=_0x3c0357[_0xbb9772(0x18d,'y^[Q')]?.[_0xbb9772(0x289,'RUQ#')]||'';}if(_0x23f2dd[_0xbb9772(0x3e0,'k!0k')](_0x4a8344[_0xbb9772(0x294,'0Mgc')],'0')&&_0x4a8344[_0xbb9772(0x2a7,'zG[D')]){if(_0x23f2dd[_0xbb9772(0x172,'AJ08')](_0x23f2dd[_0xbb9772(0x3bc,'hKFA')],_0x23f2dd[_0xbb9772(0x3dd,'Gspb')])){const _0x58a8f1=_0x23f2dd[_0xbb9772(0x212,'*PVh')][_0xbb9772(0x35d,'3FZ*')]('|');let _0x4193e4=0x0;while(!![]){switch(_0x58a8f1[_0x4193e4++]){case'0':$[_0xbb9772(0x2d1,'LT9r')]=$[_0xbb9772(0x137,')0p$')];continue;case'1':$[_0xbb9772(0x31e,'c^vU')]=_0x23f2dd[_0xbb9772(0x38c,'Vl#[')](_0x4a8344[_0xbb9772(0x29b,'V8iQ')]?.[_0xbb9772(0xb2,'F40$')]?.[_0xbb9772(0x134,'v]ye')],0x1);continue;case'2':$[_0xbb9772(0x288,'nEN@')]=_0x4a8344[_0xbb9772(0x2ca,'LmPB')]?.[_0xbb9772(0x261,']Qq*')]?.[_0xbb9772(0xae,'v]ye')]||0x0;continue;case'3':$[_0xbb9772(0x3c2,'UqTs')]=_0x4a8344[_0xbb9772(0x316,']Qq*')]?.[_0xbb9772(0x3e7,'^[Wr')]?.[_0xbb9772(0x3ed,'Lq0E')]?.[_0xbb9772(0x22f,'YiiC')];continue;case'4':$[_0xbb9772(0x306,']ygP')]=_0x4a8344[_0xbb9772(0x1a4,'3FZ*')]?.[_0xbb9772(0x183,'LT9r')]?.[_0xbb9772(0x123,'qfcN')]||'';continue;}break;}}else _0x22e6c7[_0xbb9772(0x267,'AV58')]=_0x209faa[_0xbb9772(0x316,']Qq*')][_0xbb9772(0xfd,'v]ye')][_0xbb9772(0xcd,'E&Yu')][0x0][_0xbb9772(0x24d,'UqTs')]||0x0,_0x3aa3b5[_0xbb9772(0x1c2,'66K]')]=_0x2066f5[_0xbb9772(0x20f,'AJ08')][_0xbb9772(0x3c9,'F40$')][_0xbb9772(0x2b2,'@BwA')][0x0][_0xbb9772(0x296,'zPEi')]||0x0;}}else _0x23f2dd[_0xbb9772(0xb8,'v]ye')](_0x23f2dd[_0xbb9772(0x36d,'YiiC')],_0x23f2dd[_0xbb9772(0x34c,'NY)W')])?(_0x20b460=_0x1a1d84[_0xbb9772(0x2b3,'t@lz')](_0x1d69f1),_0x2a84c7[_0xbb9772(0x199,'hKFA')]&&(_0x5508c4[_0xbb9772(0x13a,'YiiC')]=_0x3470f1[_0xbb9772(0x37c,'bTw%')][_0xbb9772(0x2c7,']!sC')]||0x0)):$[_0xbb9772(0x1a2,'V8iQ')](_0x23f2dd[_0xbb9772(0xc5,'t@lz')]);}}}catch(_0x1ec4d8){$[_0xbb9772(0x370,'3D04')](_0x1ec4d8,_0x228eaf);}finally{_0x23f2dd[_0xbb9772(0x2d9,'YiiC')](_0x2b62b2);}}):(_0x150ef6=![],_0x23f2dd[_0x5940a2(0x300,'ZOA6')](_0x4639ca,_0x213cac)&&(_0x26fdd7[_0x5940a2(0x2f6,'Y1fP')]=_0x45b8e2[_0x5940a2(0x1f0,'NY)W')](_0x530682),_0x5a4643[_0x5940a2(0x3b4,'^[Wr')][_0x5940a2(0x174,'qfcN')]&&(_0x435b63[_0x5940a2(0x26f,'66K]')]=_0x20bbd4[_0x5940a2(0x239,'bSZd')][_0x5940a2(0x9b,'Gspb')][_0x5940a2(0x247,'RUQ#')],_0x2e29b1[_0x5940a2(0xbc,'Y1fP')]=_0x392b1b[_0x5940a2(0x117,'bTw%')][_0x5940a2(0x2e9,'0Mgc')][_0x5940a2(0x19c,'&$Uf')],_0x435585[_0x5940a2(0x20d,'q2Es')]=_0x5064f0[_0x5940a2(0x1d6,'V8iQ')][_0x5940a2(0x97,']ygP')][_0x5940a2(0x2d8,'v]ye')],_0x16b426[_0x5940a2(0x2f4,'k!0k')]=_0x7242a8[_0x5940a2(0x26b,'dyzd')][_0x5940a2(0x22b,'pz7r')][_0x5940a2(0xe1,'Lq0E')])));});}async function _0x8b7220(){const _0x2ba921=_0x337609,_0x3b48aa={'IaLHf':function(_0x3fec92,_0x5a3a2c){return _0x3fec92!==_0x5a3a2c;},'joFog':_0x2ba921(0x7b,'XPN5'),'SzQhR':_0x2ba921(0x2c0,'8$%X'),'Tjtsk':function(_0x415d9d,_0x3d814b){return _0x415d9d!==_0x3d814b;},'lwJSY':_0x2ba921(0x390,'c^vU'),'Oopzx':_0x2ba921(0x27a,'*PVh'),'gbGqH':function(_0x448335){return _0x448335();},'ZHZhS':_0x2ba921(0x3aa,'8$%X'),'DVBSS':_0x2ba921(0x1bb,'t@lz')};let _0x36cd0f={'url':_0x2ba921(0x18b,'pz7r'),'body':_0x2ba921(0x226,'k!0k')+Date[_0x2ba921(0x12f,'zPEi')]()+_0x2ba921(0x2cd,'AX(a'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Origin':_0x3b48aa[_0x2ba921(0x119,')0p$')],'Referer':_0x3b48aa[_0x2ba921(0xd5,']Qq*')]}};return new Promise(_0x36234f=>{const _0x203cf8=_0x2ba921,_0x467480={'mtvWL':function(_0xcbd213,_0xd20e63){const _0x587428=_0x50ec;return _0x3b48aa[_0x587428(0xf8,'k!0k')](_0xcbd213,_0xd20e63);},'SudVA':_0x3b48aa[_0x203cf8(0x190,'3D04')],'WvThc':_0x3b48aa[_0x203cf8(0xeb,'bTw%')],'DoxrQ':function(_0x785b09,_0x11bda5){const _0x7c18a5=_0x203cf8;return _0x3b48aa[_0x7c18a5(0x3a5,'8$%X')](_0x785b09,_0x11bda5);},'IeKLb':_0x3b48aa[_0x203cf8(0x271,'V8iQ')],'RjWCd':_0x3b48aa[_0x203cf8(0x367,'NY)W')],'RrCsM':function(_0x5915c7){const _0x3a0d45=_0x203cf8;return _0x3b48aa[_0x3a0d45(0x270,'&$Uf')](_0x5915c7);}};$[_0x203cf8(0xec,'LmPB')](_0x36cd0f,async(_0x2ee25d,_0x2587a7,_0x33edc6)=>{const _0x4d759f=_0x203cf8;try{_0x2ee25d?_0x467480[_0x4d759f(0xb4,'E&Yu')](_0x467480[_0x4d759f(0x102,'UqTs')],_0x467480[_0x4d759f(0x204,'zPEi')])?(console[_0x4d759f(0xe6,'8$%X')](''+JSON[_0x4d759f(0x350,'k!0k')](_0x2ee25d)),console[_0x4d759f(0x169,'q2Es')](_0x4d759f(0x28f,'dyzd'))):_0x41b031[_0x4d759f(0x223,']!sC')](_0x24c842):($[_0x4d759f(0x2bd,'ZOA6')]=_0x33edc6[_0x4d759f(0x2f3,'c^vU')](/"score":(\d+)/)?_0x33edc6[_0x4d759f(0x318,'v]ye')](/"score":(\d+)/)[0x1]:0x0,$[_0x4d759f(0x278,'F40$')]=_0x33edc6[_0x4d759f(0xa3,']!sC')](/"currentBeanNum":(\d+)/)?_0x33edc6[_0x4d759f(0x160,'bSZd')](/"currentBeanNum":(\d+)/)[0x1]:0x0,$[_0x4d759f(0x2ba,'pz7r')]=_0x33edc6[_0x4d759f(0x235,'k!0k')](/"showName":"(.*?)"/)?_0x33edc6[_0x4d759f(0x28c,'Gspb')](/"showName":"(.*?)"/)[0x1]:$[_0x4d759f(0xa2,'YiiC')]);}catch(_0x2473af){if(_0x467480[_0x4d759f(0x2b0,'UR4M')](_0x467480[_0x4d759f(0xea,'&$Uf')],_0x467480[_0x4d759f(0x30c,'y^[Q')]))$[_0x4d759f(0x181,'AV58')](_0x2473af,_0x2587a7);else{_0x55d938=_0x3dbf14[_0x4d759f(0x78,'LmPB')](_0xcd6be8);if(_0x588aca[_0x4d759f(0x323,'t@lz')])try{_0xfb027d[_0x4d759f(0xc9,'bSZd')]=_0x51c509[_0x4d759f(0x127,'XPN5')][_0x4d759f(0xa5,']!sC')][_0x4d759f(0xc2,'8$%X')][0x0][_0x4d759f(0x30d,'Lq0E')]||0x0,_0x3205eb[_0x4d759f(0xf0,'pz7r')]=_0x3f5ff1[_0x4d759f(0x114,'8$%X')][_0x4d759f(0x28d,'pz7r')][_0x4d759f(0x221,'NY)W')][0x0][_0x4d759f(0x255,']!sC')]||0x0;}catch{}}}finally{_0x467480[_0x4d759f(0x279,'RUQ#')](_0x36234f);}});});}async function queryScores(){const _0x118994=_0x337609,_0x37c45d={'Bgqjv':_0x118994(0xfc,'zG[D'),'Astmm':function(_0x140777,_0x15c14f){return _0x140777==_0x15c14f;},'nlifG':function(_0x1c1de0,_0x1adc09){return _0x1c1de0==_0x1adc09;},'vNbQs':function(_0x1768d7,_0x5255c0){return _0x1768d7!==_0x5255c0;},'szfVP':_0x118994(0x90,'RUQ#'),'zmfAR':function(_0x287069){return _0x287069();},'XMwFK':function(_0x59d33c,_0x56eb99){return _0x59d33c===_0x56eb99;},'EMkvy':_0x118994(0x2d2,'LT9r'),'innrx':_0x118994(0x355,'AV58'),'JTeue':_0x118994(0x274,'UR4M'),'Btynd':_0x118994(0x122,']Qq*'),'FeSaN':_0x118994(0x13f,'Y1fP'),'Gxbwg':_0x118994(0x23d,'8$%X')};let _0x50af17='',_0x35944c={'appId':_0x37c45d[_0x118994(0x1fc,'zG[D')],'functionId':_0x37c45d[_0x118994(0x378,'dyzd')],'body':{},'appid':_0x37c45d[_0x118994(0x157,'AX(a')],'user':$[_0x118994(0x366,'Vl#[')],'code':0x0,'ua':$['UA']};body=await _0x86f79a[_0x118994(0x3cf,'UqTs')](_0x35944c);let _0x85f81d={'url':_0x118994(0x2f8,'bTw%')+body+_0x118994(0x248,']!sC'),'headers':{'Cookie':cookie,'User-Agent':$['UA'],'Referer':_0x37c45d[_0x118994(0xcc,'Yi@d')]}};return new Promise(_0xdafc5f=>{const _0x29cf50=_0x118994,_0x524bf5={'xSieL':_0x37c45d[_0x29cf50(0xd8,'qfcN')],'YGwva':function(_0x97a2ab,_0x35b0bc){const _0x9c8c57=_0x29cf50;return _0x37c45d[_0x9c8c57(0x407,'^[Wr')](_0x97a2ab,_0x35b0bc);},'TxATH':function(_0x9a8b97,_0x4647b5){const _0x3d134a=_0x29cf50;return _0x37c45d[_0x3d134a(0x168,'UqTs')](_0x9a8b97,_0x4647b5);},'nypfQ':function(_0x104cf6,_0x550aeb){const _0x2114ca=_0x29cf50;return _0x37c45d[_0x2114ca(0x171,'M4)X')](_0x104cf6,_0x550aeb);},'cUjss':_0x37c45d[_0x29cf50(0x2ec,'F40$')],'ljceV':function(_0x5e0c73){const _0x54316c=_0x29cf50;return _0x37c45d[_0x54316c(0x402,'*PVh')](_0x5e0c73);}};if(_0x37c45d[_0x29cf50(0x231,'M4)X')](_0x37c45d[_0x29cf50(0xe2,'v]ye')],_0x37c45d[_0x29cf50(0x2dc,'v]ye')])){const _0x3b28a7=_0x524bf5[_0x29cf50(0xfe,'AV58')][_0x29cf50(0x3b3,'t@lz')]('|');let _0x1a6079=0x0;while(!![]){switch(_0x3b28a7[_0x1a6079++]){case'0':_0x40e951[_0x29cf50(0x16e,'8$%X')]=_0xd9cd2f[_0x29cf50(0x125,'nEN@')]?.[_0x29cf50(0x25a,'t@lz')]?.[_0x29cf50(0x1ff,'t@lz')]||0x0;continue;case'1':_0x4d2a3a[_0x29cf50(0x276,'YiiC')]=_0x2d9192[_0x29cf50(0xe4,'bSZd')]?.[_0x29cf50(0x16c,'&$Uf')]?.[_0x29cf50(0x3ba,'AV58')]||'';continue;case'2':_0x4bcd88[_0x29cf50(0x380,'RUQ#')]=_0x67eca[_0x29cf50(0x1ec,'0Mgc')]?.[_0x29cf50(0x31b,'UR4M')]?.[_0x29cf50(0x3d7,'nEN@')]?.[_0x29cf50(0x368,'Vl#[')];continue;case'3':_0x9a83e9[_0x29cf50(0x31f,']!sC')]=_0x524bf5[_0x29cf50(0xa6,'AX(a')](_0x33e9f8[_0x29cf50(0x2c9,'&$Uf')]?.[_0x29cf50(0x92,'zPEi')]?.[_0x29cf50(0x1c5,'M4)X')],0x1);continue;case'4':_0x5a6dcd[_0x29cf50(0x1b7,'QYcb')]=_0x284625[_0x29cf50(0x105,'k!0k')];continue;}break;}}else $[_0x29cf50(0x150,'AV58')](_0x85f81d,async(_0x4c90ea,_0x45d7b5,_0xb2e113)=>{const _0x275d0a=_0x29cf50;try{const _0x2bacb4=JSON[_0x275d0a(0x11d,'66K]')](_0xb2e113);_0x524bf5[_0x275d0a(0x2f1,'Lq0E')](_0x2bacb4[_0x275d0a(0x24e,'YiiC')],0x3e8)&&($[_0x275d0a(0x216,'3FZ*')]=_0x2bacb4['rs'][_0x275d0a(0x1ac,'Yi@d')][_0x275d0a(0x30f,'Gspb')]);}catch(_0x3f7e20){_0x524bf5[_0x275d0a(0x358,'bSZd')](_0x524bf5[_0x275d0a(0x263,']ygP')],_0x524bf5[_0x275d0a(0x1d3,'bTw%')])?_0x154186[_0x275d0a(0x2c8,'nEN@')]=_0x141cb7['rs'][_0x275d0a(0xf4,'pz7r')][_0x275d0a(0x17f,'UR4M')]?!![]:![]:$[_0x275d0a(0x1bf,'pz7r')](_0x3f7e20,_0x45d7b5);}finally{_0x524bf5[_0x275d0a(0x31c,'bTw%')](_0xdafc5f);}});});}async function fruitinfo(){const _0x1428d6=_0x337609,_0x4e6e26={'bleto':function(_0xa496e,_0x3de388){return _0xa496e===_0x3de388;},'DNgWI':_0x1428d6(0x2ed,'Lq0E'),'EHpdC':_0x1428d6(0x331,'YiiC'),'JYGWk':function(_0x52dfd5,_0x1a49c1){return _0x52dfd5!==_0x1a49c1;},'FxOXv':_0x1428d6(0x3f0,'AV58'),'ICBrk':_0x1428d6(0x9f,'*PVh'),'XFJIi':_0x1428d6(0x1ab,'bTw%'),'UNevr':function(_0x280433,_0x54624b){return _0x280433(_0x54624b);},'Ynejo':function(_0x4290da,_0x369c87){return _0x4290da!==_0x369c87;},'eXDHx':_0x1428d6(0x245,'QYcb'),'mFaVF':function(_0x34fb9b,_0x26b645){return _0x34fb9b===_0x26b645;},'WHoVV':_0x1428d6(0x1d5,'Y1fP'),'ibDHE':function(_0x217c2e,_0xc2d340){return _0x217c2e===_0xc2d340;},'FAnIU':_0x1428d6(0x3f7,'Lq0E'),'gFdef':function(_0x3bd8b1){return _0x3bd8b1();},'wnZup':function(_0x219a57,_0x50ce65){return _0x219a57>_0x50ce65;},'ZVSWA':function(_0x262ec7){return _0x262ec7();},'tzRFb':_0x1428d6(0x1e1,'QYcb'),'vMrQw':_0x1428d6(0x213,'Vl#['),'PwbCM':_0x1428d6(0x23e,'LT9r'),'XVnTe':_0x1428d6(0x344,'bTw%'),'OHzQq':_0x1428d6(0x1a3,'pz7r'),'WjzxT':_0x1428d6(0x32b,']Qq*'),'tzTiL':_0x1428d6(0x1ae,'nEN@')};return new Promise(_0x3ef48b=>{const _0x427c62=_0x1428d6,_0xe1a6df={'gZYeq':function(_0x5aafb9,_0x960863){const _0x59d183=_0x50ec;return _0x4e6e26[_0x59d183(0x88,'NY)W')](_0x5aafb9,_0x960863);},'COSpL':function(_0x585174){const _0x1510a9=_0x50ec;return _0x4e6e26[_0x1510a9(0x2df,'NY)W')](_0x585174);},'qFhMS':_0x4e6e26[_0x427c62(0x30e,'0Mgc')]},_0x4b80df={'url':_0x427c62(0x14a,'bTw%'),'body':_0x427c62(0x12d,'M4)X')+_0x4e6e26[_0x427c62(0x320,'k!0k')](encodeURIComponent,JSON[_0x427c62(0x10c,'nEN@')]({'version':0x18,'channel':0x1,'babelChannel':_0x4e6e26[_0x427c62(0x232,'3D04')],'lat':'0','lng':'0'}))+_0x427c62(0x346,'hKFA'),'headers':{'accept':_0x4e6e26[_0x427c62(0x332,'AV58')],'accept-encoding':_0x4e6e26[_0x427c62(0x14f,'3D04')],'accept-language':_0x4e6e26[_0x427c62(0x330,'XPN5')],'cookie':cookie,'origin':_0x4e6e26[_0x427c62(0x9a,'Yi@d')],'referer':_0x4e6e26[_0x427c62(0xdd,'YiiC')],'User-Agent':$['UA'],'Content-Type':_0x4e6e26[_0x427c62(0x2e8,'LmPB')]},'timeout':0x2710};$[_0x427c62(0x15e,'y^[Q')](_0x4b80df,(_0x4d12c6,_0x2e0506,_0x12294b)=>{const _0xfc47ad=_0x427c62;if(_0x4e6e26[_0xfc47ad(0x39b,'@BwA')](_0x4e6e26[_0xfc47ad(0x206,'AX(a')],_0x4e6e26[_0xfc47ad(0x11a,'v]ye')]))_0x4de248[_0xfc47ad(0xe9,'zG[D')]=_0x4344c5['rs'][_0xfc47ad(0x36b,'Vl#[')][_0xfc47ad(0x33e,'Yi@d')];else try{_0x4d12c6?_0x4e6e26[_0xfc47ad(0x1e3,'AJ08')](_0x4e6e26[_0xfc47ad(0x369,'AX(a')],_0x4e6e26[_0xfc47ad(0x3c0,'AV58')])?(!llgeterror&&(console[_0xfc47ad(0x236,'y^[Q')](_0x4e6e26[_0xfc47ad(0x1c7,'pz7r')]),console[_0xfc47ad(0x169,'q2Es')](JSON[_0xfc47ad(0x3d8,'Yi@d')](_0x4d12c6))),llgeterror=!![]):(_0x28250e[_0xfc47ad(0x2dd,'YiiC')]=_0x223e14[_0xfc47ad(0x114,'8$%X')][_0xfc47ad(0x21a,'*PVh')]+'个',_0xe1a6df[_0xfc47ad(0x3a7,'AJ08')](_0x4635c5[_0xfc47ad(0x2be,'Vl#[')][_0xfc47ad(0x138,'UqTs')],0x7530)&&(_0x3f0bf0[_0xfc47ad(0x264,'nEN@')]+=_0xfc47ad(0x3e1,']Qq*'))):(llgeterror=![],_0x4e6e26[_0xfc47ad(0x240,']ygP')](safeGet,_0x12294b)&&($[_0xfc47ad(0x8a,'Lq0E')]=JSON[_0xfc47ad(0x1a1,'qfcN')](_0x12294b),$[_0xfc47ad(0x2f6,'Y1fP')][_0xfc47ad(0x3bb,')0p$')]&&(_0x4e6e26[_0xfc47ad(0x398,'Vl#[')](_0x4e6e26[_0xfc47ad(0x3c7,'zG[D')],_0x4e6e26[_0xfc47ad(0xb0,'YiiC')])?_0xe1a6df[_0xfc47ad(0x2d0,'UR4M')](_0x1c2e2d):($[_0xfc47ad(0x3fb,'AJ08')]=$[_0xfc47ad(0x286,'q2Es')][_0xfc47ad(0x365,'^[Wr')][_0xfc47ad(0x2c5,'Y1fP')],$[_0xfc47ad(0x229,'t@lz')]=$[_0xfc47ad(0x19e,'LT9r')][_0xfc47ad(0x24f,'AV58')][_0xfc47ad(0x37f,'YiiC')],$[_0xfc47ad(0x24c,'zPEi')]=$[_0xfc47ad(0x379,')0p$')][_0xfc47ad(0x17b,'AJ08')][_0xfc47ad(0x381,'NY)W')],$[_0xfc47ad(0x135,'66K]')]=$[_0xfc47ad(0x29d,'y^[Q')][_0xfc47ad(0x81,'AX(a')][_0xfc47ad(0x124,'Gspb')]))));}catch(_0x465b5a){_0x4e6e26[_0xfc47ad(0x31a,']!sC')](_0x4e6e26[_0xfc47ad(0x14c,'zPEi')],_0x4e6e26[_0xfc47ad(0x200,'t@lz')])?$[_0xfc47ad(0x26c,'dyzd')](_0x465b5a,_0x2e0506):_0x50e5bf[_0xfc47ad(0x297,'^[Wr')](_0xe1a6df[_0xfc47ad(0x21b,'66K]')]);}finally{_0x4e6e26[_0xfc47ad(0x283,'F40$')](_0x4e6e26[_0xfc47ad(0xb1,'@BwA')],_0x4e6e26[_0xfc47ad(0x16b,'M4)X')])?_0x4e6e26[_0xfc47ad(0x2a4,'qfcN')](_0x3ef48b):(_0x29f64a[_0xfc47ad(0x109,'UqTs')](''+_0x188c28[_0xfc47ad(0x3a2,'dyzd')](_0x130cd0)),_0x46e2ef[_0xfc47ad(0x169,'q2Es')](_0xfc47ad(0x2f7,'Gspb')));}});});}async function fruitnew(_0x4c6f8f=0x1f4){const _0x2737a5=_0x337609,_0x22ae6d={'WeMDJ':_0x2737a5(0x35c,'c^vU'),'yTrdo':function(_0x17afb4){return _0x17afb4();},'QRpWI':function(_0x1d7d84,_0x130354){return _0x1d7d84!==_0x130354;},'wfMvI':_0x2737a5(0x277,'AJ08'),'dzaAl':function(_0x1866e1,_0xda4c20){return _0x1866e1===_0xda4c20;},'psubU':_0x2737a5(0x17a,'@BwA'),'CxFtT':_0x2737a5(0x15d,'zPEi'),'cgcMO':_0x2737a5(0x340,']ygP'),'Cnnza':function(_0xda5745,_0x1172f9){return _0xda5745===_0x1172f9;},'MwWqG':_0x2737a5(0x192,'YiiC'),'Emqtd':_0x2737a5(0x3c3,'F40$'),'OocaB':function(_0x2d5ac1,_0x39d262){return _0x2d5ac1===_0x39d262;},'fnjre':_0x2737a5(0x287,'^[Wr'),'KICaS':_0x2737a5(0x39d,']!sC'),'TaaMl':function(_0x4ceae,_0x5995b4){return _0x4ceae(_0x5995b4);},'akBUX':function(_0xe62696,_0x2a4ec7,_0x3454af){return _0xe62696(_0x2a4ec7,_0x3454af);},'KMGmk':_0x2737a5(0x85,'zG[D'),'tbKRo':_0x2737a5(0x308,'66K]'),'klAih':_0x2737a5(0x8c,'pz7r'),'HWpnE':_0x2737a5(0x1ee,'Yi@d'),'PePdE':_0x2737a5(0x1fa,'Vl#['),'vemDU':_0x2737a5(0x23e,'LT9r'),'zhueh':_0x2737a5(0x3eb,'LT9r'),'gegGJ':_0x2737a5(0x106,'q2Es'),'PzSyQ':_0x2737a5(0x34d,'*PVh'),'ZatFc':_0x2737a5(0x325,'^[Wr')};let _0x20b025={'version':0x1},_0x23985f={'appId':_0x22ae6d[_0x2737a5(0x7d,'XPN5')],'fn':_0x22ae6d[_0x2737a5(0xdb,'qfcN')],'body':_0x20b025,'apid':_0x22ae6d[_0x2737a5(0xf3,'c^vU')],'ver':$['UA'][_0x2737a5(0x1db,'8$%X')](';')[0x2],'cl':_0x22ae6d[_0x2737a5(0xe0,'3FZ*')],'user':$[_0x2737a5(0x9d,'3D04')],'code':0x1,'ua':$['UA']};_0x20b025=await _0x24dbe2[_0x2737a5(0x375,'AJ08')](_0x23985f);let _0x3d184e={'url':JD_API_HOST+'?'+_0x20b025,'headers':{'Host':_0x22ae6d[_0x2737a5(0x33d,'V8iQ')],'Accept':_0x22ae6d[_0x2737a5(0xdf,'zG[D')],'Origin':_0x22ae6d[_0x2737a5(0x176,'y^[Q')],'Accept-Encoding':_0x22ae6d[_0x2737a5(0x3d2,'NY)W')],'User-Agent':$['UA'],'Accept-Language':_0x22ae6d[_0x2737a5(0x2a3,'nEN@')],'Referer':_0x22ae6d[_0x2737a5(0x2d3,'LT9r')],'Cookie':cookie},'timeout':0x7530};return new Promise(_0x4f3187=>{const _0x5c0db6=_0x2737a5,_0x32c164={'jSLRC':function(_0xfdcb61,_0x760658){const _0x2d3d4e=_0x50ec;return _0x22ae6d[_0x2d3d4e(0x3e4,'Gspb')](_0xfdcb61,_0x760658);},'zORYS':_0x22ae6d[_0x5c0db6(0x1a0,'YiiC')],'DFrMl':_0x22ae6d[_0x5c0db6(0x76,'8$%X')],'YpfjS':function(_0x4d5a94,_0x7cb036){const _0x1eb54f=_0x5c0db6;return _0x22ae6d[_0x1eb54f(0x2d5,'3D04')](_0x4d5a94,_0x7cb036);},'COqAi':_0x22ae6d[_0x5c0db6(0x3b1,'dyzd')],'hHzaA':function(_0x2ee6f0,_0x5be3e0){const _0x3987a4=_0x5c0db6;return _0x22ae6d[_0x3987a4(0x3ee,']ygP')](_0x2ee6f0,_0x5be3e0);},'QrYlc':_0x22ae6d[_0x5c0db6(0x3b2,'AX(a')],'mEiDs':_0x22ae6d[_0x5c0db6(0xd3,'c^vU')],'MylHJ':function(_0xcd73e8,_0x2d4695){const _0x17895d=_0x5c0db6;return _0x22ae6d[_0x17895d(0x7a,'XPN5')](_0xcd73e8,_0x2d4695);},'ZuSbV':_0x22ae6d[_0x5c0db6(0x2c1,'M4)X')],'PXTIJ':_0x22ae6d[_0x5c0db6(0x12a,'M4)X')],'QjynQ':function(_0x23be7f,_0x4427fa){const _0x48b9af=_0x5c0db6;return _0x22ae6d[_0x48b9af(0x1d7,']!sC')](_0x23be7f,_0x4427fa);}};_0x22ae6d[_0x5c0db6(0xca,'^[Wr')](setTimeout,()=>{const _0x969fd7=_0x5c0db6,_0x1531e8={'PHhTN':_0x22ae6d[_0x969fd7(0x342,'F40$')],'aOYcZ':function(_0x2d5d91){const _0xb660c1=_0x969fd7;return _0x22ae6d[_0xb660c1(0x285,'LmPB')](_0x2d5d91);},'ykfrj':function(_0x1c0ff3){const _0x2fd82b=_0x969fd7;return _0x22ae6d[_0x2fd82b(0x3d1,'LT9r')](_0x1c0ff3);}};_0x22ae6d[_0x969fd7(0x1b3,'*PVh')](_0x22ae6d[_0x969fd7(0x1f6,'AJ08')],_0x22ae6d[_0x969fd7(0xaa,'k!0k')])?_0x2ecd56[_0x969fd7(0xac,'ZOA6')](_0x1531e8[_0x969fd7(0x3b7,'LmPB')]):$[_0x969fd7(0x282,'Vl#[')](_0x3d184e,(_0x11f8f3,_0x357bd2,_0xe99e0f)=>{const _0x476efd=_0x969fd7;try{_0x11f8f3?_0x32c164[_0x476efd(0x3db,'zG[D')](_0x32c164[_0x476efd(0x2ff,'RUQ#')],_0x32c164[_0x476efd(0x80,'QYcb')])?_0x1ac7de?(_0x140549[_0x476efd(0x2e4,'bTw%')](''+_0x219150[_0x476efd(0x11c,'bSZd')](_0x240024)),_0x52e9a8[_0x476efd(0x109,'UqTs')](_0x476efd(0x158,'*PVh'))):(_0x20b27e[_0x476efd(0x217,'UR4M')]=_0x2740cd[_0x476efd(0x235,'k!0k')](/"score":(\d+)/)?_0x29c099[_0x476efd(0x1f1,'y^[Q')](/"score":(\d+)/)[0x1]:0x0,_0x417959[_0x476efd(0x27e,'E&Yu')]=_0x47d893[_0x476efd(0x91,'E&Yu')](/"currentBeanNum":(\d+)/)?_0x259937[_0x476efd(0x35f,']ygP')](/"currentBeanNum":(\d+)/)[0x1]:0x0,_0x22b154[_0x476efd(0xb5,'E&Yu')]=_0x13549b[_0x476efd(0x3bd,'XPN5')](/"showName":"(.*?)"/)?_0x2a502e[_0x476efd(0x3bd,'XPN5')](/"showName":"(.*?)"/)[0x1]:_0x25bfa8[_0x476efd(0x1e8,'t@lz')]):(console[_0x476efd(0x1f5,']ygP')](_0x476efd(0xd2,']ygP')),$[_0x476efd(0x2a5,'Lq0E')](_0x11f8f3)):_0x32c164[_0x476efd(0x21f,'bSZd')](_0x32c164[_0x476efd(0x111,']Qq*')],_0x32c164[_0x476efd(0x111,']Qq*')])?(_0xe99e0f=JSON[_0x476efd(0x148,'&$Uf')](_0xe99e0f),$[_0x476efd(0x162,'0Mgc')]=_0xe99e0f[_0x476efd(0x1f2,'AV58')]?.[_0x476efd(0x149,'V8iQ')]||''):_0x1531e8[_0x476efd(0x154,'V8iQ')](_0x2ea484);}catch(_0x5afc59){_0x32c164[_0x476efd(0x1cb,']Qq*')](_0x32c164[_0x476efd(0x187,'V8iQ')],_0x32c164[_0x476efd(0x25d,'y^[Q')])?(_0x31c4c4[_0x476efd(0x297,'^[Wr')](_0x476efd(0xd1,'&$Uf')),_0xb840ea[_0x476efd(0x25e,'Y1fP')](_0x34b0ef)):$[_0x476efd(0x185,'nEN@')](_0x5afc59,_0x357bd2);}finally{_0x32c164[_0x476efd(0x1fb,'XPN5')](_0x32c164[_0x476efd(0x315,'AX(a')],_0x32c164[_0x476efd(0x33a,'@BwA')])?_0x1531e8[_0x476efd(0x3ec,'nEN@')](_0x482d5a):_0x32c164[_0x476efd(0xff,'y^[Q')](_0x4f3187,_0xe99e0f);}});},_0x4c6f8f);});}function _0x50ec(_0x3aed1d,_0x1030c7){const _0x26c345=_0x35c4();return _0x50ec=function(_0x168c4f,_0x5d5922){_0x168c4f=_0x168c4f-0x75;let _0x35c460=_0x26c345[_0x168c4f];if(_0x50ec['KeETgf']===undefined){var _0x50ec37=function(_0x4d9e98){const _0x4f857d='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x3acf3c='',_0x2ac9a7='',_0x4886e8=_0x3acf3c+_0x50ec37;for(let _0x46d0f6=0x0,_0x54f0b4,_0x1fa549,_0x26fc0a=0x0;_0x1fa549=_0x4d9e98['charAt'](_0x26fc0a++);~_0x1fa549&&(_0x54f0b4=_0x46d0f6%0x4?_0x54f0b4*0x40+_0x1fa549:_0x1fa549,_0x46d0f6++%0x4)?_0x3acf3c+=_0x4886e8['charCodeAt'](_0x26fc0a+0xa)-0xa!==0x0?String['fromCharCode'](0xff&_0x54f0b4>>(-0x2*_0x46d0f6&0x6)):_0x46d0f6:0x0){_0x1fa549=_0x4f857d['indexOf'](_0x1fa549);}for(let _0x17ef3b=0x0,_0x27b2ae=_0x3acf3c['length'];_0x17ef3b<_0x27b2ae;_0x17ef3b++){_0x2ac9a7+='%'+('00'+_0x3acf3c['charCodeAt'](_0x17ef3b)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x2ac9a7);};const _0x58920c=function(_0x216e0b,_0x3ac0b4){let _0xf26438=[],_0x43e8f3=0x0,_0x4d1a5d,_0xa06c35='';_0x216e0b=_0x50ec37(_0x216e0b);let _0x52b551;for(_0x52b551=0x0;_0x52b551<0x100;_0x52b551++){_0xf26438[_0x52b551]=_0x52b551;}for(_0x52b551=0x0;_0x52b551<0x100;_0x52b551++){_0x43e8f3=(_0x43e8f3+_0xf26438[_0x52b551]+_0x3ac0b4['charCodeAt'](_0x52b551%_0x3ac0b4['length']))%0x100,_0x4d1a5d=_0xf26438[_0x52b551],_0xf26438[_0x52b551]=_0xf26438[_0x43e8f3],_0xf26438[_0x43e8f3]=_0x4d1a5d;}_0x52b551=0x0,_0x43e8f3=0x0;for(let _0x501a28=0x0;_0x501a28<_0x216e0b['length'];_0x501a28++){_0x52b551=(_0x52b551+0x1)%0x100,_0x43e8f3=(_0x43e8f3+_0xf26438[_0x52b551])%0x100,_0x4d1a5d=_0xf26438[_0x52b551],_0xf26438[_0x52b551]=_0xf26438[_0x43e8f3],_0xf26438[_0x43e8f3]=_0x4d1a5d,_0xa06c35+=String['fromCharCode'](_0x216e0b['charCodeAt'](_0x501a28)^_0xf26438[(_0xf26438[_0x52b551]+_0xf26438[_0x43e8f3])%0x100]);}return _0xa06c35;};_0x50ec['BgvTQI']=_0x58920c,_0x3aed1d=arguments,_0x50ec['KeETgf']=!![];}const _0x80a3ab=_0x26c345[0x0],_0x4cb552=_0x168c4f+_0x80a3ab,_0x413b23=_0x3aed1d[_0x4cb552];if(!_0x413b23){if(_0x50ec['SXibSY']===undefined){const _0x4d39e9=function(_0x4c451e){this['nhagzM']=_0x4c451e,this['YPdqim']=[0x1,0x0,0x0],this['GhFovd']=function(){return'newState';},this['XcQvXs']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['BqDcED']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x4d39e9['prototype']['miMoOz']=function(){const _0x405fd4=new RegExp(this['XcQvXs']+this['BqDcED']),_0x15a59f=_0x405fd4['test'](this['GhFovd']['toString']())?--this['YPdqim'][0x1]:--this['YPdqim'][0x0];return this['dnQhRY'](_0x15a59f);},_0x4d39e9['prototype']['dnQhRY']=function(_0xce62b6){if(!Boolean(~_0xce62b6))return _0xce62b6;return this['ywtkcP'](this['nhagzM']);},_0x4d39e9['prototype']['ywtkcP']=function(_0x3185c8){for(let _0x3604b1=0x0,_0x5eff22=this['YPdqim']['length'];_0x3604b1<_0x5eff22;_0x3604b1++){this['YPdqim']['push'](Math['round'](Math['random']())),_0x5eff22=this['YPdqim']['length'];}return _0x3185c8(this['YPdqim'][0x0]);},new _0x4d39e9(_0x50ec)['miMoOz'](),_0x50ec['SXibSY']=!![];}_0x35c460=_0x50ec['BgvTQI'](_0x35c460,_0x5d5922),_0x3aed1d[_0x4cb552]=_0x35c460;}else _0x35c460=_0x413b23;return _0x35c460;},_0x50ec(_0x3aed1d,_0x1030c7);}function _0x35c4(){const _0x3f9937=(function(){return[...[_0xodf,'fJTjXpsMjkDiNaEmAiwFG.tcHWoYFmln.vg7JDNU==','pSowWP5ZmubjWRCK','W4ldNvmoW7TBr8oBWRbjxLldS8ounG','WRjFW4WLaSomr8oMW5iCWPNdOXBdVCkzW7FcH38','ymo7WPRdTCok','W7xdM18GW4q','W5jsAJn3','vCoUWOaqya','y8k/W6CtWPq','aCkWWQa','W4ddMmkHW4NcPYlcS8kyW5a','q8oPWPVdSCoHW616xHxcVCkkucxcQa','iSoCWPTI','lshcKgjk','WRpdUvuNWPa','W60QWPFcVGS','ASooWQ8mW6pcUSohW6O','W54uWOblW68','mSkkWRLPWRJcJH/dUgZdRmkG','cmo7cxOgWRXnutpdRmoXWQNdMtJcQ8kOyNapWRVcU+ITUoAXOUwNJEI0SU+/LoIVRoAIKEACLEE+UEI0MoMhToIUIW','m8ozaKek','nCoqcmkZW5G','W4yoWPdcOtq','f8oQifOc','DSkEWO9AlmkqW4mH','bstcHffu','qmknWOdcR8kH','ECkcbmo2WPi','gaJdIreJ','gSoBWQtdUmkZWRKjtCkMWP9fDKZcT8k6uvRdHsVcGMtdP8oSWPVdJZLoW6hcRbOfDSoTWQNdTbVcTmk6da8opCoYW5/dSCkyW50BWPWsWOeZW7jdWOlcLSobWRxcS2RcVSoxfMGcqCkDW7jlWQLNFsLb','WPJdISodW6qf','o8oPdmoUW4hdVszutCoSeCoV','WOz2W4yCDW','nSosWPX3','W5WaWONcHH8','WRdcSCk2wqVdVCoNW70I','CquIACoJWO/dIJC','WRhcOmk3rdBdUCoHW6K+','W7ldNSk6W5xcVG','CYRcQmoDWOy','u17cKM7dPW','WOVcT8k+WR0m','CCkoWPhcT8kfdSocWOm','W47dGmk6W5BcPLZdVCodW5NdLHDvxmo3qSk1WQpcISoqrCkJWRBdU8kb','WPGeW6NdQea','DmkId2eEWP5Twq','WQtcI8kBiSku','WQainx0fW67cUCk/WRtcPhXyxG','W4zkWPJcNx0','WOPbW4Sjya','WQdcOSkNFsO','W7mTWRxcHYO','WQ1uW7FcNCkU','mSooWOddHmowuSkGWO8','W5pdH8kRW5tcNaJcTmkd','FNygW6LSqGVcTSolWRldLSoNz2qEW6y8fSoZ','W5fPW40tW44','C8oaWOSYxW','W7uKWQjCW6S','iCkTWQ3cQSkxcXWKnJmNlSkqW40','WRaRW5pdVuvtyevLoJm','sxflnCkZ','o8krW7FcLWG','W5aZWOhcNspcSmoUWO0','zZaABCoJ','aCkDWR3cVCkD','W5tdUmkxpY/dNq/dPmoh','CCoCWPOXq8kvWPvAga','zSkaW50DWR8','Db/cQCokW5S','p8kdW5pcMbxcUHtcICk6','r3b0hmkL','WPJdT3OAWO8','ySkkWPLWnSkBW5CNW7jtfSk0iCk0WOBOROlMS47LPytOT7ZVVOZOR5BMOl3MN6BNVl/OTzZPHiRORAi','v8kyW589WOZdS8oYW5Ka','WRC6W5hdUxqDB1myoYLyrSkhfwRcLSk8WP7cRxhcLCo3j2nzWOdcQ8oYWRTelSkTW69dW4SeWPtdPW9UW53dPwxdSc1hCSoZW7mMcaa1rXO5Cc9uWO/dJuZdSXGBACkfgbpdJfFdLmk7W73cKqBdMSodWQmAW7JdMmkzdCocW6bUWQhcVYWNDmoFEb1nW4LpWP13pCo7W4L6dJ0SW5DXW51WW4RcGmoZW47cVSk9o8kCjHKFW4FcN1dcRSoyf18vW7GpWPNcQvBcHComEmk+W4VdO8klWPPiW7HlubhdN3TjWQ5Ske/cJSo9cq3cM3dcJsRdIWyaWQtcISo2DKS+q8o+W49CgvFdO0JdTJvzbCkXgtiwWPyarmksWRJcUxazDZ12DqNcRfLeWR0HhXNdSWFcONxdJedcMfBcVWdcVGRcSI/dSmovvINcUYBcNmkxfcBcSmkPpa','jSo8WRZdRSox','iCocWOPjngboWRu','gCkSWQjQWPG','W6vZqaNdOtlcN8oi','ESoCWPG2qmk/WO0','amoRWQFdHmoB','pmogfxC9','W5hdILeSW6u','FNygW6L6sWJcRq','WQznW6NcSCkp','WR3cQK4dW4y','WRarW401W4WwWR7dHq','l8ovW5NdGCkkz2m3','z1xdLmorWPnrW43cSfG','W5jjsJRdQW','WRulW6ddV1O','WPFdVhiaWRq','WQj2W7apAa','vCkkWQxcVCkP','kSowhwuW','W5LZDrFdMIdcPmoelW','FmoHtmkwWRS','WO3OG7BLHOJMJPaplEwfM+E7VEwpKCkB','l8oQamkYW6xcVsPF','pWdcJ3XO','ymkhWPxcHmkG','W6qTWRXqW5G','E21OlmkjW6pdQ8oA','iCoCWPFdM8owuSkGWO8','aCk+WRRdLG','5lQt5lQ05PY75yM75zQ36l6j5zM856Ut5Pwl5O2p','a8k6WQhdLHvpWOSyW44','lCoMe2mHW6CrfqtcMSk3WQxcMtZcQSoQux4f','nmoFW4ZdLSkP','WPZcMSk5WO8xkbBdPG','yaBcK8o6W5W','wCojrmk3WPyZW4tdHG','jCkYWPtcT8kq','oSonW53dU8kWAMOQW6u','W7pdRSkbotldNW3dSW','sHVcRCoSW4HhvIpdRG','umkTWOj8ja','eLJdJCkX','oCogWPZdGmolxCk1WOVcImo1lcNcUtldOeCMWOuHxLTC','WQBcJSkBWPas','F3JdJ8oFWPW','zCk3eSoHWOGX','vmkAW5qwWP/dJSoG','FMdcJwRdPmoLtM3cPunGqsxdRW','WRFcNSkyoCk+','FmkHbCoMWOGAWRjdWPm','gCoBWRVdG8kB','WRbfW7BcKq','hY84A8oZW6JdNSoko8ooW7q','i8oWr8k0W5zGW6TuWOibW68sCG','zCoqWQW/W7G','W4y6WPj3W7W','rgJcVNJdICoQA2ZcO0LluZS','jSkoWR9NWOlcMr8','m8krWQj0W4hdNr7dR1RdSSkUW6WeW51TW6Km','fCoCWOBdHmoY','xCo4WPBdP8oJW65gwG','WQqVW5xdS39eya','wCojWPG+qG','W6xdJmkiW5lcGq','mCk/W5FcRsu','W7voW6OLW6O','mCkrW5VcPYi','gCkFW6dcLsi','hSk0W4tcOcm','WR9IW4/cMmkn','hCk9W4tcMqS','WP/cJmo2WPhdRfpdQSkOW7JdPtTdFa','l8oKWOtdGSkgWRu0Dmo7','vmkcaCooWOG','W5G7WPdcMZJcOSoMWPPaWRLs','WQqiW6pdIv4','yCkdW5GVAZ0AWR0Vh8kmt8k6','FLBdJSo6WRa','WP7cMGK0W4e','ANutW7Dw','W6ddL8kMhXS','W4hdGwWEW58','imkrWPlcHmkA','WPJcMSk4WOCxkbBdPG','aSo9WP1umW','W6PzAIrzWR/dNSkmWPxdLW','xgddT8ozWPe','WQu6W43dUwq','WRjfWQPXhSkogCoWW5u','m8oeWOnLcq','oCkkWR9NWOu','WP7cVg0fW5xcG8kiWQ0','wghcVw7dUSogF3lcRW','xCoeWQimW44','ndldHc4P','dSkVWQFdNWa','rqNcJ8oTW6HhztJdJSo4W7i','gmk9WOJdGbPUWPGq','WO/cUSk+u3NdTCkdCSkUW4Oj','q0VdNmoaWQK','ySkCWOBcQmkze8obWP5vme8','kSosWPlcSmkIa8oqWOvQla9jWRvwvxNcQG','g8oKWPldLCk8WP03DW','W6BcGfazW5CJxmk3W5BdLM0','DSorWOyCW6m','WRlcJSksmSkCW7S+','WQ1tWOfKfCoex8kTW4awW5NcQqhdTmorW7VdLgvcW5BcTCkt','xNygW6L9rapcPW','WOhdJSoNW6yK','WQTxW7GDDSo8','WORdG8o8W6O+b8opW6jB','W6CDWPxcGaW','W67dSCkslcK','rCkRWQ5Xlq','mCo9e3i+WO5Dvr7dIG','smooE8kSWPy','WPxcJCo3WPFdOvBcHSk7W4tdTWHM','Aquw','u2hcV37dPCoTBhBcPefbF37dRSou6kYi5RgK5As46lAe776C6k285QoE5P+U576M6lwm6ys66k6a','W6lcHemAW4WLva','DmokWR4XtSk3WRPwemkwW4hdVSoLWPi','BL0NW5nl','pcxdGIWz','rmkhW5uGWRFdMCo1W4i','WRzcWPrMbCkw','oCkFWR1tWQe','oSkcWQHVWQpcNbFdRW','fCouWOTEjW','WQBcG8kzWQaR','W4pcQfG4W6y','wmoyWOVdJCoo','WOdcISkEvt8','WQLrW7WZsSoVWQGg','WOVcN8kfi8kCW60iW4ZdOCk9W61m','WPZdGfeFWOi','WRxcKSktWPWl','vcJcUSo5WQhdM15MlSoJwGFcMfldLNFcVCo2i8kJWRxcSsnM','i8kCWOJcP8kA','W5ldJKik','W4/dGmkRW4VcPG','E0qbW6Px','WOxcI8kfo8ku','WRTLW47cO8kV','ebtdJCo8WO9imtBcQG','W5GRWOpcTr8','WRJcVSkce8kS','lCo7oSkZW4/cVd5v','nCoeWRddVmoh','WQTEWPjoca','u1NdHmopWPO','pCkFWQ5PWP4','oIVcK1zUWOT9vMVdJxS','W7dcJvChW5CJxmk3W4tdHxfiASoJWPSz','WRVcUmkqWQWS','5PAh5ywG5z+B5P+16k6S5Aw+6lsh','5PAt5yE05z+h5P2L6k2F5Asf6lsL','W5eVWQrkW4G','WPRdHCoHW7eF','W6fDWPVcOwq','imkBWO3cVCkm','W47dGmk6W5BcPLZdVCodW4ldHGXAqmo1sCoSWQVdH8osqmo5W7VdT8kdWPJdOHRdJai4WOlcTCkDWPyTWPuOW7VdH8oQo3VdJCkrqvBdUIj+WPVcIdSiAmkAW6GRW7hdRmowWP/cUG/cPa','r8kiWPXVmW','WRpcPmk2qWa','W6ZdKmk6W5tcSapcL8kcW5tdKrLv','CCknWQzxkG','q8ktWQ5Yja','xg8zW6nN','W4BdUNSAW7C','WOVdILmwWQi','j8kiWQFdNtW','WORcICkVWO8nmHhdVrm','W4xcReKcW7S','WONcVfSyW7S','pSo4eCkH','5P+H5yIo5zU76l2r5zQs56I55PEE5O+4','W4RdM8kP','ubZcJ8oPW5ntAsZdPW','WPhcUfaAW4G','WQ3dG0SHWOnuWPX+W5bXcmk7WRTX','FSkzWQPCla','BYBcN8oHWOa','W7foW5yZ','qJ7dRfav','yWSdCmoyWOJdGJ8','hCoTWPRdSCkL','W65suI9eWQVdQmkjWPG','W4ldGguFW51DxCoD','W5i/WPtcKWhcN8oIWOv1','W78UWPrxW4q','W6LCEdLPWQJdPmkjWR/cG0PsqLDDW68','W7beAcDp','rGxdJuC','wos6R+s7TowgIUwDPZqiWPSro+ACSoIVV+ISU+AWTEwKKoI1R1xIGyJVU7VIGzhVUBe','DSojESksWRK','DCopWQC0W6y','p8keW6BcMrm','zmk2fSoMWRCGWRjAWPm','W4/dKW0UW4nhW5LJWOW','W6BcJu0BW7auwmkXW6C','mmknWPBcQSk6','W6fQxbxdVG','AmkViCoRWR4','W4nWsrldMW','tSomWOGcBG','W57dM0iBW5WohmkvWRfPhvBdSCoAyCkFy8k9W79qmM9YzG7dSmk9dmkVW7VdNIhdLCkQqgldOmkYzmo+bCkKW4xcTSk9W6dcR3NcKmkSl8ozWPiG','uHddKKKN','ASoBu8kOWPe8W4/dJa','WOdcR8kJFdBcVCkgECkMW4meWR7dGw3dL8onWRC','Br4fBCoIW5ZcI3/cL2NdNrhcHqpcISo6WO0OpmkntW','wLiIW7rk','CCowWOS','q8oPWPNdUmo1W7jIvGG','ACowWR8GxCkYWPPq','pSoaW5JdJCkTBMW+W7K','bSkGWPXfWOC','W5vbAd/dIW','yCkoWPLK','WRFcISkiWPaF','W6zeWQJcS14','rCkKWQnNaW','W6ZdKmkiW4FcPWVcGSkEW57dHZbnrmoZ','W4ldLCk6W4C','nSooWOhdJmowuSkGWO8','WOFcISkhcmkZ','wJ3cVmoKWPVcJXCM','qNfQg8k1W7a','WOWcW7VdUem','W4xcQviqW4e','CHRdJ0qR'],...(function(){return[...['kCoTf8kPW4lcTcvwgG','wSo7WRVdP8oL','d8oTW5RdPCku','WRztWOD9cmkzgCoKW4K','jHxcLCkiW4udW6VcRe7dQtNcGa','uwRcR0/dT8oXBq','W5jIWRFcLNrYDIVcPSoDWRzLW6hcN8kXvs5/EK3cSsOHW7Pr','BmkCWR9GjmksW6SVW7fqomkEy8k4','CmkpWPhcOmkFfmofWPHG','kCovW57dHq','r8kmWOv7oG','mSkrW7FcLq','b8kRWQpdGWO7W4vAW5VcTmk2W6ZdLSo3v0pcHg5rW6a','BbKHCCoKWPxdSJNcLW','WO5UWRz1nq','WQyRW5pdO3u','p8oHkSkTW5u','WQDiWPfTwW','W6zxBZhdPG','WOxcOh8','W5XVqJ7dNse','xCkUWO5vca','W7pcLeexW6CJsG','WPBdRMyI6k2y5Rg25Asc6lAF77+q6k+75QoW5P+s57+q6lwC6yAc6kYG','W6NcKNiyW7CJB8kSW7y','xSoOWQZdSCotW7vvsX0','W6RcH1i9W4e','WOm5W4tdOL5bAfi','BCowWOu6wW','j8kyWRZcImkv','FhWuW4rarGhcSmo7','WONdNMS4WQm','r8kdW5GkWRu','k8kXWPVcQG','hsC0B8oZWRldKSoOk8oOW5Du','WRhcL8keiSkMW6O4W5hdRCkHW69gqq','W6VdQSkmlcK','sCkvWQBcO8kv','lCkjW7LoWPldOCoUW79PW6e4W7i','ACoEWQldRSos','W6NcKM4BW6u5vW','iSkFW4ZcLGO','W6lcHemAW4e/tmkRW7i','pSoWa8kgW64','r8kDWPnJkW','ra/dJuyPW4G','vcJcUSo5WQhdM15MlSoJwGFcMfldLNFcVCo2i8kJWQxcTIzHmSoWWQ1fW57cKI9WW7SCFmk5aSk9s0O4WRZcT8kxW7pdOCkJsmkFmCoIW7f9','ACkTuCo3WP7dP3rkf8oyoSokW5G','WRZcH2CHW4O','mmoRcmkkW6a','W53dV34gW7S','fSobWPNdS8kx','omkXWOZcUW','q1BdSSoYWPS','i8oZfx4hWQ5BsdZdNCo2','W6HsW7CIW6e5WQpdHWXAWPBdH8kQzG','vYxdP1aF','W4lcGmo1W7aIimoAW79vWOBcN8kCo2xcJCkOW60','AN1Jp8k3','W7G/WRhcLYm','EmoyWR4lW5NcSCotW6XOW5CVW5RdQqLz6k2J5Roc5AAT6lss772S6k2U5QcO5P2d57Yo6lsh6ysz6k24','EgNdSSo/WRy','ptldLGqN','sc7cQ8oSWOhcLra9kG','W4tdKCkVW4JcMXpcVW','WP/cTKOaW64','W4bVvG8','WONcG8k6WPGXiqldQbS','n8o4eCkJW4q','WQ/cQSkJ','WQfkW6OXCmoGWQauWPxcSmkgW7i','WRrdW7BcNCk0oc/cQG','WOb0W6WxBa','s8oQWRNdUmoPW6jvsXhcT8kLcJVcS2qcd1P1W6pdNduWeMeeWQ/dRq','WQj2WRX3fW','AqG1B8oh','C8ovWOuYAa','WOVcUSkT','gCkSWQjkWOy','WOnMWPTDmW','qSkpWOrIbYfeW7m','dSkSWQtdLG1iWOqtW4q','W4tdKCkVW4JcLGNcP8kcW4u','DSkLaCoUWReNWRzCWQyKW4q','W6SPWOFcHcpcSmoUWO0','WRnPWPDffq','CN7cPgBdOG','C1dcOxJdHW','y8koWP9OemknW4a8W4XhfG','W5/dLNefW7W','W4POub7dHW','z2OeW55bvW','WP/dIL88WRLoWOu','FUIaJEwhKUAoLLJdUEweGEE5GUwpJ8oU','lZ7dIGKT','uMxcUwBdG8o7E23cMLvb','AqyFA8ox','W6ddOfeFW4S','dSkjWPZcG8kd','W4pdS8kadX3dHXm','WO3cRNOAW4NcNSklWRddG8oFhW','jmkXWPJcISkefq','WOpcU3WhW6/dL8obW63dOmoiaSkGoLhdVWiMjYuVW6LRo8oIW4HCdxjeW6fmnuBcNmozwmo1veWGW4tdVfxdQhyszc4VamkoW4tcICk1WQG3mqexW7LpaSkYWRG','mmoHaMeBWRnyvq','amoeWObJ','iCoBW43dOCkXEW','t259mSk+','zXJdP18M','r21DmSkYW7hdKmowlG','kCkUWO/cO8kp','B8oPWQunW7a','W7feEtOgW7tcRSkAWO3cIXDAjvnFWQ7cVCkzW73cISocW4RdP8oicWhcTSoTq8ozB8koW6O','WRn3WPzvmG','W5rHurO','mcxcHLjvWQXHvf7cGIzGWRfHsCkpBmkwbW89uSo3kJjQW4y3WRm','W61oW4i','jmo4WRhdImkv','k8ovW5JdICkkz2m3','AeyvW4LR','A8oNWQK4W4y','WR0tW4JdT3e','A05kcSkM','D8o4WRGmW5a','bttdUZO','vs/cNmoSWRpcJt8OiSo2CLZcGrq','xwTUpCkIW7hdTq','x8kiWPvGpxunWRpdVHBcVJdcNmkzWOpcNSoQidRcS8ozWP7cLmoAyf7dN8ojW73dR8ovpCklsa/cO8kgWOiNW4pcJgnqW7ldHSo+WOJdJ8kBECkzEshcKmkv','W5fWvrFdHJdcK8oznN3cSSksWQT6WRWieMpcUsFcV25tCLOpeCostCoY','q8koWOr1cYfhW67dUb8','CCopCSkiWPy','i8oZfx4BWRnyvq','lSoCWOhdOCoV','E3ywW7LM','DCkoWP92ia','wGxdMq','W6nyiaLYW7FdU8ktW4BcKWqhjqa','c8k+WQpdKG','Fmo+oSk0W5xdRIbdrCoOiCo2W6hdKSkaW7tdQmkdjSoXWPFcHmkW','WONdMSo4W6KG','DSklWQTzjG','W61FqIHw','cGhdJYCf','W4RdSSkddG7dJa','nUs5Gos7KUweLEwFQmoBuqGFW5RMN5BOR4VORilMSl7LPO3OTlBcS+kcQE+5G+kdSU+6Lq','yvldG8okWQ5pW4RcOKNdNdlcNSkaW5NcUmoGW5RcG8kj','WQ3cLmkw','lmoeW5RdImkQAMqSW6NdRsVcISomDrXPWQFcP0abW4O5W7ZdIYdcO31KW4rnleRdQW','pCkyWPLHWOZcKttdQ1hdU8koW60vWPK','W5ZdI1ScW4fDhSonWQqHq1ldOmoblmkD','AmksWPm','wCojrmk3WOOUW4FdM2TtWOG','tSoVWROPW6m','WOX/W64CvW','WQLiWPi','vSkrW4qNWO3dKSoHW4qpW4dcScO4d8kt6k2C5RcT5Ash6lsz77Yr6k+95Qof5P64576w6lsA6yE16k+Y','FSkTemoOWQO1WR5l','WP/cVw0sW5NcG8klWRddTmou','zCk3fSoXWQ06WRvb','vHVcMmoYW7rAzIu','WRzqW6/cHmkPA3pdOb/cMu/dQCkNFblcNMlcJmonW5NcUmkBWQCGWRK','q8ovWOddOCoe','W4hdJwKoW5DewSoiWRK','WOFcOg8','W7vFAG9oWQK','j8oKWRVdImkvWPu0','WObcW4G5sG','xCo4WPBdSCo4W7fDtr0','qvldG8okWRnxW4NcSW','WOlcS8k+Egi','WQXuWQv4e8knjSoRW4a','W6PczWVdNG','W4f2rWnv','W49KWP7cNhy','DdVcQCo2W58','W7j4W5eEW6W','W41dWQpcK3y','WQJcLCkTWPWh','j8o3bN0rWRjlvbG','WRVcO30eW6JcGSkAWQpdV8o+e8k5ivC','nmkvW6lcMI7cVc8','jmooWOddMSo6','k8oIWQvffa','FCoyWQSqW6NcU8ouW6TY','xWNcPmo6WQe','imowWPX1mMPn','WRxcVCkFemkC','uaVdJf4mW5iDua','WRJdJSoYW4GG','W4hdUmkq','WQuDW6DHWP/cRCoiW54zE3NdIXfToSoMWQKFC8ohWQa','pSobW4JdP8kSBwa','W5xdHmkIW4/cOq','W4P/WP7cSva','WQlcR8kyrfK','xSoQWOuXxG','WOtcVCk7WR4r','BmojWRGxW4tcS8oiW6n/','5PYD5yML5zIB6l2x5zI656IU5PAJ5O2a','j8oaWO1KfgboWRu','FL3cJfZdVq','DKddLCoDWRryW4lcUq','kCoaeCkzW4a','kSo2WOpdHG','b8kRWQpdGWO7W4vAW5VcTmk2W6ZdLSo3v0pcHg5rW6bv','WOTxW77cHSkumdhcQG','ra/dILaQW5GE','WO/cRNWw','WPJdVMqFWP8','WQnzW6S5','W47dQCkqoW/cHe/cUCodamoKWRRdKwW9WQKJr0/dGCoTqSkqdCk3E8oiD8k1WQldPbDAdqJdQIVcJcLxt8oLmLOSrNpdKg4','Fu7dLq','WQdcLmkEhmkm','W4BdJKqyW4O','W51HurJdHW','lmk/WOVcRG','pdBdOGm9','W6ZcJKu','tWFcMG','q2lcHN3dNW','W5CPWQ7cMqRcUmoT','W4zTW5yiW6G','pZ3cKuHj','ptRcIbvwW5zYqbxdNhSR','g8kjW6/cVcO','WRFdU1SNWPi','nSoGfL0x','W4z4FtRdPq','WRXbW7RcMSkujde','WOLSW7tcOSkm','xKxdKSokWPHtW6hcUetdIYBcJG','W4ldSmkQW5ZcPG','ymkHemobWQ0','WRZcUvWFW78','xsZcVSoLWRVcGHa9jSo8xqBcNW/dK33cV8k1omkRW6lcPhX/pCoLWQ1eWPZdU2fIWRy','W7OuWOxcOsq','pSo7WOldLmkNWO8/ymowW4SatelcMSkryq','DqSdBSo0','W6bBWP7cPLy','WP47W6ZdUxy','WQxcMSkfma','w8o+WQKVW78','WQ3cSCk+FN/dUmk2C8k0W44jWO/dIItcHCoiWRW','rMP5lSk0WRJcQCkqp8omW4GWpmkcCdmPtGTEdxNdICk6WPldQSo0pwtcNmoRdCkjW6GFW6tdStTsW7lcL8oxwq','ugxcV2O','WRvgWODNaW','W6OwWRhcQsZcLmoqWRCIW74ly1msW6xdUM7dRCk1W7rPWOucurtdGZLmrxe3W6uVmsBcT2HfjLhdIti/mdOZWOaxf8kgW6eKWPuhmtWLWPBcTLZdIstcV8oViZhcTe1tjs3cIqRdJa','EmorWQK5W6q','BxJdKa','W4ldVmkqkG','WOFdQu8gWRG','p8kZWQldGa1UWP4uW4FcLCk6WQ3dICk8','W6ZdTmkklctdLWhdUmof','vbdcOSoPW5naztJdGCoKW7XPWRD9rvtdRNdcQN7cRYn2','D8kpWPhcG8k2','B8osWQmqW54','w8oCWQhdMCot','W4KcWQJcMZu','W71rEsS','nmogWRdcKGy','a8oPa8kQW78','W6zeW5eYW7mWWP/dJW9zWRJdRCoOASkj6k+d5RkB5Aw26lA2772q6k2X5QoS5P+J57+h6lwM6ys86k+h','W5/dM1mgW5W','W5nVsWJdMYhcH8ook33cRG','WOddGmo0W4a+mq','W5H0uqVdNgNdNCkcpMlcTCktWQWNWRKcb2pcVIVdON5ABWi0mCk6aCkPnCoaWQNcLrW','t8klWPL3imkBW7eHW6HufCkUECk1WO0sW7u','wCoDwmk5WQS0W43dH3jfW5RdKaKuW7uoFgZcISkQW67dIG/cN8kEWOVdQmogmK3cGmk1W4/cRbhdM8o3W5HHbbe9W5XsW5qDgNFdPH9dyCk3xxrIlmkTEmk5uq','iSoxWQjxnW','pCobWQFdNSk1','WPraW6/cHSk/nbNcOrlcNKhdQq','WOxdGmoG','W79rFYDPWQJdPmkjWQ3cKfy','BCo/WR3dNSoeW5rhwGRcKCkLqZ7cLwuftbrhW6NdLGTB','WOddGmo0','AquwwmoJWPq','z2avW75FAW/cR8o7','W7tcJNeaW7a5v8kI','WP1QWOjslq','omoAWOxdTSkf','ECoCWRGtW6pcUSohW6O','amo7kLOw','uSojqSk5WRC','W5XVqG','WOJdJSoNW6q','WQLWWOfcnW','pmo4f8kTW6xcVsPF','WRC6W5hdVhLdzenCjZihw8oyt3dcGmoJWPpcP3FdNSk8j39wWPhcRmo+WRPPl8o0','FCoiWPJdMmoWDtqKWRq','WR3cICkOWP4D','W47dGmk6W5BcPLZdVCodW4hdJWTFb8o7aSoXWQRcISoztSoGW7RdPSkfWPlcPrNdHXr+WO/dQCooWReGWP1PWRdcKCoI','B8k9tq','EJhcLmoKW6C','DIBcMmo2W48','pSoaWPVdL8kk','x8kNW6i7WPS','iY1lWRuydexdQ8k1W6JcMmkX','D8kWpCoAWOi','sSkng8oSWQ4','eLNdImk1WOLEwd/dU8o4W4G','pmosWOvZ','W4RdG8o8W6iLlCo6W69kWO3cJCokzgxcG8kHW7pcLmorW75miHXI','W7W2WQfoW5/dImotWQ5CvIdcUKqCACoDWRznq8kB','cmouWP7dICk/','ASkeWPpcN8kI','WQhcQ3WfW7NcImk6WQ3dP8omhmktpvFdQbi6','B8oCWP8GFmk4WPTfga','AgOhW74'],...(function(){return['lSk/WO3cOSkJfdC3cYqj','A8oCWRKv','WQFcPmkWuq','WOBcKmkyWOie','xSkpWRf8oZX0W7xdRW','WRbqW4u3qG','WOldISoRW7u','WPFcQ8otE07cJLJdKCovoCopW5VdQq','WPJcQMKfW7/cHq','EherW7jDqGFcPmoN','W67cJ24AW4C','WR9xW6JcKCkUgdlcQrG','W5ldQ1irW5W','WRhcLmkyp8kn','W51ftd/dNa','WQ3cLmkwfmklW7O','DNhcRL/dSW','sXZcICoWW44ol2xdRSo4W7iXWRm0tKtcR2hcMN7dUq','W4r4WQRcL0nuDJNcUW','h8opWO/dR8kQ','qd3cL8oZW44','pSofW4JdU8kQz2m3','xSoyrSk2WRy+W4pdNvjoWONcJXzMW6erAI/cGSkGW7ddUflcI8klWOldKSommfBcHCo2W4O','E8oyWP45ESkOWPfflCkbW68','p8k8WQdcVmkvccaG','W7yJWQzBW6xcNmkAW64','xN9/lCkI','CmkpWPhcOmkyd8oqWO1Pb05iWR5Dtq','WQxcPmk2xsZdTmoOW7q','WQ/cQSkJDrFdQa','kSk7WP7cOCk1ccCRlW','WPFcImkyWO8/kJ7dQbVcJCkqW4FdHSoF','ymo+WO/dTCoYW6XKtrFcVmkfrdZcPq','umkEWQzHbG','wH3dTgaC','W4/cJeO1W6S','WOVcImkVWPGnpX7dVr7cJCkIW5VdImosW4xcMdrDuW','W4tcQ8oxlrO','W5VdU34MW70','yNyXW75sssdcO8oZWQtdSSoGwMi','Ce3cPvhdMa','u8krW5e8WR3dMmoMW4mv','amobWQTLea','w8o5WP4xW40','zCoyWP7dO8oK','W5HhAdhdOa','tmozvmkfWRyZW4tdHG','nSkoWQPQWQ7cKG/dPeG','DCkDW7qtWPS','W5O7WPBcLW','rqNcJ8oTW7rAzIu','oY/cLq','wmkwW7qAWRS','WR9pW5HxkmoscSoQWOSlWPhdQGhcOa','W7H1W5CJW68','WOhcTmk4yvpdS8keCW','lComWPBdGCoU','l8orW4VdISkazNa2W7q','imowWPTJmxO','W6boW40sW6m','j8kFWRLTWOpcMHpdReu','ACkCWOdcPSkK','W79CyIvoWP/dOmkpWPW','WO7dJSoGW6aflCoiW7K','WQtcOmkWrrBdV8o8W7i1WPeZWQTzqmkU6k+H5Rc45AEx6lsd77+C6k+95Qg35P2M572C6lEk6yEn6k+Q','cmoRm0i2','rSolWPNdPmob','WRCFAZ9sWRJdTCksWPlcJbztCLvAW67cSq','WOrRW6RcRCkz','WRvDW6S7A8oQWQa','t8kIWQLsja','WOxcQNah','omoaWPu','W5nPyG3dQW','W7uSWRfmW4pcM8ky','W6ZdNSkRW6pcMW','uGVdILi','W5/dNgyhW5PhzCotWQW','W5zHvXBdPJ3cLmoc','W7hdJmkdW4/cUW/cGSkEW57dHaXnra','pSkRWQFcImk3','W5XkxWj/','WQlcTCk0xaZdUCoVW68YWPGYW5Sfv8k4EfBdHLlcTxldG8kSFuLHvNm','tWFcMSofW49g','hCooW7NdNCks','ySkPWOLGiW','WPlcLmkTWQ8Sna','W4/dICo5WP0VeXRdGsW','WPNdJKOZ','DJJcUSo7WRFcHcuMo8oYx2ZcMXNdJNtdQG','W7xcKKCgW4S+x8kQ','rSkmWOLJWPRcHCkKW4KdW4ddQKW3d8kmW41yaG','yqSfFa','vSofWQqMW6W','W4RdKCk4W4pcUsJcS8kbW5q','hqhdMaCJl3O','jSo9a3y','W6ldSSkCos0','cJNcK0Xi','eXddIqG/','WQPlW5tcLSkW','WQpdOmofW7i1','CmklWRBcKmkB','W6xcONy2W6C','WONcQMKzW5lcMmkd','D8kkWPLMkSkAW4a','5lIk5lQb5P+P5yUQ5zIu6l2Q5zQ+56US5PEs5OYE','W7DzBIfYWRRdRmkE','tu/cJNRdNW','nmk5W6ZcTsq','tWmFESojWO/dHt7cGa','ocVcLvO','WP1tW7ZcJSk2','W5hdG8kJW4ZcHa','WQnjWP9MaW','nCkTWP9OWRO','DmkCWOBcTSkP','W61yvZX1','WQ/cMSkCna','nfXglCkJW5BcNbFcKeZdQI3dVG','WPNdNmoYW6CGjG','jmohW7RdImk2ELmXW7a','u8kDWPvX','W6vaW5eM','W6PvBdHFWRm','vmktWO9JoJ1xW7/dQWNcPq','WPG2WO3cKqtcV8oxWPfGWQ4adJi9W4FdGLtdI8kJWPytW5HcodddPq92EfeAWOSmBhlcKquVxuRdNtm9C0bsW7PZfSoYW7iSW7n6v01sW7BdLZhdNstdHmkvvKdcIxnYdahdV17cJSodbfqQW6VcKmkbC1VdSSk4dwXsW6/cLMRcIWVcRCk4ouNcKSoYWQKOWQXwWQ/cGLhdPmk7WQunpCoSbSoRy8keWO4mF3rcqe/dHmouW6LqWRanW5FcOKmuyCkNqe3cHCkjbfBcRJ8WCCoccGRcHsbtWPH7WQPzdmoHb8ombCo6W6RcL8oGbSkKBCoAW5pcJCklWQlcPaddGGuwg8k4D0pdNahdJL1nA8oinmonumoEW7H0W78KWQK8WQv5iKaTtfntwmkdvbHjcCkBW7/dQ2vFACodWPH4pxPZlw1QW4BdRH/dVmkfW7iwWQmCsufFW4bhWOpcKWieWQKRaSkvdHJdIxBcO8oYWPBcSCkOqCk+rX5KWRpdLfKNW5qYimketmkVWRddUCo9W5GMWRpcQSowWQVdRmozagVcUCk8WP3dJK19dhRcS8ogWRVdPghdJmoVWPmOCmkWjrZdPrnMD8kjsJysWRyDfZLXj8o4m8oNCCkbEJyazbtdQdTUoSksW5BdOCktWQe3WOpcHCoyW71EiCkKWPBcQSkyCxBdPmoNWP1pssa','W4rYqb7dVcFcK8ozoG','WPNcJCk7WO4U','W6xdKSk3oZa','k8o7bhGCWRXtxW','imorkvGe','h8oZe1uX','wSkvWO95ex0mWQZcSvy','kSoTWPBdPSkE','tCo/WR3dTSoVW6vn','WP3cV0m4W5i','W7tcK0CrW5y/tCkKW6RdOwXiuCoQWOq','AMivW5ja','dSkfWQddMtW','bCozW4xdKSkA','W6NcJ0WgW7O','EhqbW4rAsWJcRq','W5HtqJFdIa','W6ZdUwu8W64','kCo9afyGWQ8','W7OrWOxcGc8','W75kzdOqW7VdPCkEWPVcJLHdBHuBW6lcRa','W6n1ut3dRG','udpcQq','W7jvW5CUW64YWOtdGbG','iCoZe3i','WPpcJmkgyNS','W7vBW7eUW4W','WQfzW601uCo9WQarWQZcRmkp','kCo3exy+WPnFvWK','t3bpoSkU','qSkoW5yeWQ4','WRBcTCkSWOmr','WORdIuOkWPK','CCk4WQXBgW','fGVdIW','WQRcG8klWR4w','W4tdVSk3W5dcRq','W7KJWQfDW4q','s8oAu8k/WOWPW4pdNv4','vqxdMLy','WQFcMSkdpmkWW6yRW40','y8kyWOdcSmk/bCowWOvRje9YW7PEtEIVOoAYNUwMIUI3KE+/S+ISSUAGIUAFIoE8SUI2VEMgUoIUUG','vcJcUSo5WQhdM15MlSoJwGFcMfldLNFcVCo2i8kJWRxcSsnMBG','W4JdI8kUW5XV','WRzxWPL9eG','smkNWR1Tmq','5PYz5yQa5zUo6l2S5zIJ56Mm5PEu5O64','bmkaW5bSFJmwW6dcRq','gmkmWOb3kZWnW7hdVHtcVhVcHCoEWOFcNCoRjJVcQSkeWOBcU8ohpKVdGCkiW7FdTCoyn8kD','kmo8WRPpdG','tYWIA8oL','W5e1WQ7cMca','oSoLWPldGSkHWOG7zSoX','W7qEWPpcNZC','WQm5W4ddSNXf','ymo2W5FdOCoDtNLSCh9nFW','sHVcR8oLW5XytIVdS8oVW5XQWQPY','m8oaWPTZkuDgWRWU','tmo7WRVdUCoFW6LBuH0','eNpcQmo8WRZcGGuGimo9he3cJbddNx3dOa','CeddKSoz','k8oyW4xdI8kXtwqSW6e','W6jQCJJdIW','WOZcNSk5WP4njr/dUXm','WRncW40EzG','CmksWOdcPmkGm8ohWOn3jW','W5/dLSkHoJu','vW7cJWr0','zwWaW7b9rapcPW','WR4+W5xdOcOpkKbezJzmdCkwv2RdMmk5WO3cQxxdG8k+iMXDWPhcSCkYWRHSomo7W6TdW40AWQZcQWjHW4FdUxNdGWzlEmohWQ8Scry1gq','W7lcPNm9W5G','W6qVWRhcLdS','W4fQWQ3cKW','nY7dIdqF','W63cGfyxW6O','WQPwW77cKCkopIJcRHVcQuJdTCkGEGu','WOhdQCoYW5mk','W5pdRSkbotxdKaBdUq','udBcRCoSWOq','WO3dGe0M','W70XWOvsW5NcGCkQW6HC','WOxdNmodW6K5mmo4W79k','ASoMu8kSWQ0','WRRcNNSeW7O','yG8fF8o+WOldNq','WQ1rW7JcL8k/iI8','BcJdVem0','pmoBWOBdMCoSbSoPW4/cV8kOyaFdVZNdQGCGWOyCea','xSo2WOSrW68','W77dRMCkW4m','kmoIW6pdOmkj','pqJdPXac','amonWOLRWPRdKSkLW44dW4FdQei2dCoyWP4jbauQodu/W7FcL1PbW5XYW7qOFq','W41/WQ3cGKqNn3dcT8otWQHiW6NdHmk5ct1in0hcRcjr','WO/cGqrAWOefa8kk','W4n5WQZcM0nZFsJcVCoCWRXv','FSkHc8oZ','ECkVgCotWRW','gCk4W7NcPre','ux0WW4TP','gmkPWP3cJmk7','CHmgqSoIWOxdIYlcGG','tgFdSSovWPK','s8oQWRNdUmoPW6jvsXhcT8kLcJVcS2qcgbLPW6FdLJj6fJaWWPldHCouFG','WRlcPSkVFLtdVmkpEq','W79rFYD1WRxdP8ku','A8otWP4GFa','W4RcPg0HW6y','kJZdUcWg','D8ooWOqwyG','k8obW4tdH8k3ygO2W4NdPNJdKCobkGvwWRhdULyxW7a7WRZdM3tcRxDUW54FmW3dOZrAWOJdHSohW6dcImoAjmosjGX6Fmo3W4lcGmkrWQlcOSkkbmoBFmoWW5rLW4/dVSo4wCkkWOddK8k9zYrfnmkOWOXeevGGmCksht5Ga3JdU8kqWQVdJ8o+WOuMWQpdL1VcM1VdTtS6omkJagnPWRmYW5XlrJTcbHzKqXlcIMSVWQTHnb8UW5pcLGyuDwL6W4lcLGJcMmovySoMWRpdKH4IW6PJW4uhW7BcPGNdMLTo','zG/dRLCa','ye7dKSozWPfLW4FcUvpdNa','qNfQ','sIdcTmobW5a','WPpdLLK0WOC','zSkrW70wWRq','aCkIW5BcKrG','wYBcP8o5W77dGruSkCo/uL3cKfdcNhhdOq','WPJdRg0aWP0','ch99lSkUW6BcU8oinSkj','FvldTmoDWPXAW6RcT0ZdNadcGSkoW5q','WPFcImkgWOu5lX4','d2ZdVSkWW6tdKKmUiCo+ANVcGW','jmkXWPG','WRVdNCoPW4GO','W4xdN1iIW6q','zCovW6C9W6tdUmoBW60RW7KHW6VcRfzrWQNcSmkYdG','amoOk8ktW6G','WQC+W6fcWPZcJSonW70E','tmoCrmkZWRe6W4VdJ0i','tSo7WR3dTq','zfPsdSkUW6ZdGCoqk8oJW697jG','xxBdImoqWQ0','xw/dN8onWPK','dCkYWPJcRCku','WQbkW40zxG','uaBdKvW3W7GAs0i','nmoGfCkMW70','W5BdP8o5E2VdImkivmkA','W7juW4yKW6uMWP4','pYNdRYq+','5P6z5yUJ5zQ96l+Q5zMY56Qi5PAm5O+V','hmkVWRVdMG0','WRtcVSkfWR86','tGNcICoJW5u','nSo9d3e7','w21OlmkoW6ZdOmoq','W5tcQCo4CcVdOCowymoW','DmokWQa7smkYWPO','W7vtW4aIW4u7WOJdLazg','mSooWOddHmokt8kJWPlcH8oViq','ctNcHeL1WPL1qq','W7NdGeyrW5C','mc/cL15xWRz5sv4','W7GIWQ3cRHS','hoIdUEwgMUAnQCkUWRJLHz3NUR3LJ48o','ktNcHeLOWOf2ufpdMMCVWQHOC8kjBCkqnG','BbKJEmoWWORdQJhcIMddQrFdNWy','zK8rW7v5','WPpdIKyI','a8k6WPZdIrC','iSo4WPddOSkaWO4','WOb0W5WQtq','y8oSW55jALer','W5jZBZxdVW','W5hdImkqbXS','u2hcV2NdUCoSzW','DcGOw8oh','W6zMW6CPW6W','WOhcSCk9xGe','WRaRW5pdVvLoy1G','AsBcV8oTWPK','WO3cRNOAW5xcG8kiWQ0','wd3cUSoO','W5b4WRZcGh5ZFJa','w8ktWOzvpd0','F3CgW752sWVcSmo5WRG'];}())];}())];}());_0x35c4=function(){return _0x3f9937;};return _0x35c4();};async function checkplus(){const _0x4b6cbc=_0x337609,_0x378280={'HAQal':function(_0x253d62){return _0x253d62();},'anBdi':function(_0x10980f,_0x3f2cfd){return _0x10980f!==_0x3f2cfd;},'EzRHC':_0x4b6cbc(0x244,'QYcb'),'aFTlW':function(_0x3c8f0f,_0x3c6dfd){return _0x3c8f0f===_0x3c6dfd;},'hErrz':_0x4b6cbc(0x3cb,'^[Wr'),'CDkzR':function(_0x13f015,_0x22993f){return _0x13f015==_0x22993f;},'nygZn':function(_0x1d9180,_0x502b2c){return _0x1d9180===_0x502b2c;},'WRUex':_0x4b6cbc(0x3ad,'Y1fP'),'wUtLg':_0x4b6cbc(0x394,'bSZd'),'rXBwM':_0x4b6cbc(0x1d4,'RUQ#'),'iOIuD':_0x4b6cbc(0x184,'F40$'),'oFCGc':_0x4b6cbc(0x362,'q2Es'),'rGQIZ':function(_0x89455f,_0x586a81){return _0x89455f==_0x586a81;},'SutFA':_0x4b6cbc(0x243,'YiiC'),'pWlpx':_0x4b6cbc(0xc6,']ygP'),'Dcnap':function(_0xc1e31d,_0x1ac05d){return _0xc1e31d!==_0x1ac05d;},'NgDRI':_0x4b6cbc(0x317,'@BwA'),'tTRcP':_0x4b6cbc(0x77,'XPN5'),'jfpIC':_0x4b6cbc(0x1d9,'c^vU'),'OmhAi':_0x4b6cbc(0x372,'RUQ#'),'Dpqwn':_0x4b6cbc(0x21e,'XPN5'),'whZoF':_0x4b6cbc(0x3b6,'YiiC'),'GgcHz':_0x4b6cbc(0x404,'AJ08'),'FqvYJ':_0x4b6cbc(0x107,'ZOA6'),'bsJNP':_0x4b6cbc(0xa1,'M4)X')};let _0x36a21e={'contentType':_0x378280[_0x4b6cbc(0x136,'v]ye')],'qids':_0x378280[_0x4b6cbc(0x272,'v]ye')],'checkLevel':0x1},_0xd4c616={'appId':_0x378280[_0x4b6cbc(0x11b,'V8iQ')],'functionId':_0x378280[_0x4b6cbc(0x254,'0Mgc')],'body':_0x36a21e,'appid':_0x378280[_0x4b6cbc(0xb6,'RUQ#')],'user':$[_0x4b6cbc(0x1c3,'Yi@d')],'code':0x1,'ua':$['UA']};_0x36a21e=await _0x86f79a[_0x4b6cbc(0x2ae,'@BwA')](_0xd4c616);let _0x25fe96={'url':_0x4b6cbc(0x19a,'&$Uf'),'body':_0x36a21e,'headers':{'User-Agent':$['UA'],'Cookie':cookie,'Origin':_0x378280[_0x4b6cbc(0x116,'Y1fP')],'Referer':_0x378280[_0x4b6cbc(0x373,'y^[Q')]}};return new Promise(async _0x34967e=>{const _0x2e1cd4=_0x4b6cbc,_0x2bcc8c={'vjrtS':function(_0x493915,_0xbba4f9){const _0x5cb5a4=_0x50ec;return _0x378280[_0x5cb5a4(0x2c2,'E&Yu')](_0x493915,_0xbba4f9);},'rBBYN':_0x378280[_0x2e1cd4(0x112,'&$Uf')],'aooMu':_0x378280[_0x2e1cd4(0x1bc,'66K]')],'HqMif':_0x378280[_0x2e1cd4(0x139,'AV58')],'pecBI':function(_0x2a2be6,_0xfa0155){const _0x42ca6c=_0x2e1cd4;return _0x378280[_0x42ca6c(0x314,'v]ye')](_0x2a2be6,_0xfa0155);},'sYtYl':_0x378280[_0x2e1cd4(0x2e3,'y^[Q')],'mTHMR':function(_0x38f7a0,_0x440c63){const _0x2a91c9=_0x2e1cd4;return _0x378280[_0x2a91c9(0xcb,'M4)X')](_0x38f7a0,_0x440c63);},'BueTe':_0x378280[_0x2e1cd4(0x241,'3D04')]};if(_0x378280[_0x2e1cd4(0x156,'hKFA')](_0x378280[_0x2e1cd4(0x19d,'k!0k')],_0x378280[_0x2e1cd4(0xed,'V8iQ')]))$[_0x2e1cd4(0xf6,'V8iQ')](_0x25fe96,async(_0x3a3d33,_0x5461e0,_0x4edf25)=>{const _0x3e6af5=_0x2e1cd4,_0x44689f={'EMCAr':function(_0x382807){const _0x53e67a=_0x50ec;return _0x378280[_0x53e67a(0x8d,'Yi@d')](_0x382807);}};if(_0x378280[_0x3e6af5(0x2eb,'hKFA')](_0x378280[_0x3e6af5(0x2a0,'pz7r')],_0x378280[_0x3e6af5(0x1dd,'q2Es')]))_0x44689f[_0x3e6af5(0x35b,'@BwA')](_0x1f299e);else try{if(_0x378280[_0x3e6af5(0x7c,'t@lz')](_0x378280[_0x3e6af5(0xd6,'AV58')],_0x378280[_0x3e6af5(0x196,'*PVh')])){if(_0x3a3d33)console[_0x3e6af5(0x1f4,'v]ye')](''+JSON[_0x3e6af5(0x11f,'M4)X')](_0x3a3d33)),console[_0x3e6af5(0x109,'UqTs')](_0x3e6af5(0x133,'NY)W'));else{_0x4edf25=JSON[_0x3e6af5(0x210,'M4)X')](_0x4edf25);if(_0x378280[_0x3e6af5(0x143,'66K]')](_0x4edf25[_0x3e6af5(0x2f5,'V8iQ')],0x1a1b98))$[_0x3e6af5(0x3df,'y^[Q')]=_0x4edf25['rs'][_0x3e6af5(0xcf,'v]ye')][_0x3e6af5(0x121,'AJ08')]?!![]:![];else{}}}else{_0x53f1df=_0x552193[_0x3e6af5(0x269,'hKFA')](_0x184273);if(_0x2bcc8c[_0x3e6af5(0x338,'UqTs')](_0x39de58[_0x2bcc8c[_0x3e6af5(0x82,')0p$')]],_0x2bcc8c[_0x3e6af5(0x1ef,'Y1fP')])){_0x7e5c0b[_0x3e6af5(0x144,'v]ye')]=![];return;}if(_0x2bcc8c[_0x3e6af5(0xd4,']!sC')](_0x4d73e3[_0x3e6af5(0x2b8,'qfcN')],'0')&&_0x2f3908[_0x3e6af5(0x2ca,'LmPB')]){const _0x428cbe=_0x2bcc8c[_0x3e6af5(0x20a,')0p$')][_0x3e6af5(0x101,'y^[Q')]('|');let _0x17c782=0x0;while(!![]){switch(_0x428cbe[_0x17c782++]){case'0':_0x123ff1[_0x3e6af5(0x1d2,'*PVh')]=_0x4fbd46[_0x3e6af5(0x10f,'qfcN')]?.[_0x3e6af5(0x307,'RUQ#')]?.[_0x3e6af5(0x15c,'8$%X')]||0x0;continue;case'1':_0x333851[_0x3e6af5(0x3be,'AX(a')]=_0x3a1e3a[_0x3e6af5(0x3ce,'y^[Q')];continue;case'2':_0x4e8126[_0x3e6af5(0x3c5,'XPN5')]=_0x2bcc8c[_0x3e6af5(0x203,'QYcb')](_0x408c3e[_0x3e6af5(0x1ea,'zPEi')]?.[_0x3e6af5(0x1ba,']ygP')]?.[_0x3e6af5(0x188,'hKFA')],0x1);continue;case'3':_0x201ffb[_0x3e6af5(0x2ad,'8$%X')]=_0x1c6f02[_0x3e6af5(0x1a4,'3FZ*')]?.[_0x3e6af5(0x3d3,'YiiC')]?.[_0x3e6af5(0x268,'c^vU')]?.[_0x3e6af5(0x3fd,'QYcb')];continue;case'4':_0x157497[_0x3e6af5(0x153,'LmPB')]=_0x37787e[_0x3e6af5(0x30a,'Yi@d')]?.[_0x3e6af5(0x3b5,'8$%X')]?.[_0x3e6af5(0x1af,'E&Yu')]||'';continue;}break;}}}}catch(_0x295149){$[_0x3e6af5(0x130,'y^[Q')](_0x295149,_0x5461e0);}finally{if(_0x378280[_0x3e6af5(0x24b,'Gspb')](_0x378280[_0x3e6af5(0x343,'XPN5')],_0x378280[_0x3e6af5(0x374,'UR4M')]))return _0x33a29b[_0x3e6af5(0x10b,'UqTs')]()[_0x3e6af5(0x257,'zPEi')](WjqUvJ[_0x3e6af5(0x1e5,'bSZd')])[_0x3e6af5(0x3a3,'ZOA6')]()[_0x3e6af5(0x222,'y^[Q')](_0x476f13)[_0x3e6af5(0x257,'zPEi')](WjqUvJ[_0x3e6af5(0x1ca,'LmPB')]);else _0x378280[_0x3e6af5(0x327,'NY)W')](_0x34967e);}});else{_0x222fb0=_0x51c0df[_0x2e1cd4(0x210,'M4)X')](_0xde59b5);if(_0x2bcc8c[_0x2e1cd4(0x275,'NY)W')](_0x80c5e8[_0x2bcc8c[_0x2e1cd4(0xb9,'66K]')]],_0x2bcc8c[_0x2e1cd4(0xbd,'zG[D')])){_0x5a76d2[_0x2e1cd4(0x348,'Lq0E')]=![];return;}if(_0x2bcc8c[_0x2e1cd4(0x275,'NY)W')](_0x1e097e[_0x2e1cd4(0x409,')0p$')],'0')&&_0x3d5a21[_0x2e1cd4(0x251,'dyzd')]){const _0x2fd98e=_0x2bcc8c[_0x2e1cd4(0x25f,'AJ08')][_0x2e1cd4(0x8e,')0p$')]('|');let _0xb9455f=0x0;while(!![]){switch(_0x2fd98e[_0xb9455f++]){case'0':_0x383fd5[_0x2e1cd4(0x253,'&$Uf')]=_0x2bcc8c[_0x2e1cd4(0x1a9,'@BwA')](_0x5169e9[_0x2e1cd4(0x214,'UR4M')]?.[_0x2e1cd4(0x1b9,'QYcb')]?.[_0x2e1cd4(0x253,'&$Uf')],0x1);continue;case'1':_0x439fae[_0x2e1cd4(0x198,'bTw%')]=_0xbff37e[_0x2e1cd4(0x1f2,'AV58')]?.[_0x2e1cd4(0x1e2,'RUQ#')]?.[_0x2e1cd4(0xaf,'UqTs')]||'';continue;case'2':_0x45cb70[_0x2e1cd4(0xbb,'0Mgc')]=_0x141ead[_0x2e1cd4(0x1e8,'t@lz')];continue;case'3':_0x3b9b6f[_0x2e1cd4(0x380,'RUQ#')]=_0xff9c9f[_0x2e1cd4(0x251,'dyzd')]?.[_0x2e1cd4(0x3a9,'Gspb')]?.[_0x2e1cd4(0x1e4,'Yi@d')]?.[_0x2e1cd4(0x2ea,'LT9r')];continue;case'4':_0x3f8028[_0x2e1cd4(0x146,'v]ye')]=_0x309013[_0x2e1cd4(0x2c9,'&$Uf')]?.[_0x2e1cd4(0x16d,'3FZ*')]?.[_0x2e1cd4(0x1cf,'XPN5')]||0x0;continue;}break;}}}});}function wb_info(){const _0x1b0991=_0x337609,_0x28f484={'JEOUd':function(_0x2765c1){return _0x2765c1();},'Dptjm':function(_0x514062,_0x513c35){return _0x514062!==_0x513c35;},'RxGIP':_0x1b0991(0x2d7,'zPEi'),'zFqTO':function(_0x14fbab,_0x3a5eee){return _0x14fbab===_0x3a5eee;},'vxXAJ':_0x1b0991(0x23f,']ygP'),'FRNfq':_0x1b0991(0x1c4,'q2Es'),'kPHmT':_0x1b0991(0x34e,'bSZd'),'vKeRX':_0x1b0991(0x32f,'QYcb'),'llnvF':_0x1b0991(0xe5,']!sC'),'xirEU':_0x1b0991(0x2db,'nEN@'),'XFTmd':_0x1b0991(0x38d,'zG[D'),'WLLdi':function(_0x50de86,_0x2ffee1){return _0x50de86!==_0x2ffee1;},'kYiga':_0x1b0991(0x356,'0Mgc'),'gaXSB':_0x1b0991(0x295,'qfcN'),'AwJIh':_0x1b0991(0x8b,'RUQ#'),'JDqiZ':_0x1b0991(0x211,'AX(a')};return new Promise(async _0x132d8b=>{const _0x161fde=_0x1b0991;if(_0x28f484[_0x161fde(0xc4,'Y1fP')](_0x28f484[_0x161fde(0x79,'XPN5')],_0x28f484[_0x161fde(0x1a7,'&$Uf')])){const _0x471fa0={'url':_0x161fde(0xbf,'bTw%'),'body':_0x161fde(0x3ca,')0p$')+Date[_0x161fde(0x388,'3FZ*')](),'headers':{'Cookie':cookie,'content-type':_0x161fde(0x265,'k!0k'),'Origin':_0x161fde(0x249,'c^vU'),'Referer':_0x161fde(0x1e7,'3FZ*'),'User-Agent':$['UA']},'ciphers':_0x28f484[_0x161fde(0x303,'AX(a')],'timeout':0x7530};$[_0x161fde(0xf6,'V8iQ')](_0x471fa0,(_0x418cbe,_0xde1eb8,_0x56c38c)=>{const _0x1eb0ca=_0x161fde,_0x3f98ad={'DiDAe':function(_0x1f4907){const _0x294b03=_0x50ec;return _0x28f484[_0x294b03(0x35e,'Lq0E')](_0x1f4907);}};if(_0x28f484[_0x1eb0ca(0x399,'Gspb')](_0x28f484[_0x1eb0ca(0x403,'c^vU')],_0x28f484[_0x1eb0ca(0x396,'LT9r')])){_0x13164b[_0x1eb0ca(0x363,'UqTs')]=![];return;}else try{if(_0x418cbe)_0x28f484[_0x1eb0ca(0x1df,'Lq0E')](_0x28f484[_0x1eb0ca(0x1fe,'y^[Q')],_0x28f484[_0x1eb0ca(0x1f3,'@BwA')])?(_0x2cf707[_0x1eb0ca(0x113,'8$%X')]=_0x55b43c[_0x1eb0ca(0x233,'*PVh')][_0x1eb0ca(0xce,'Vl#[')][_0x1eb0ca(0x3ff,'t@lz')],_0x141aee[_0x1eb0ca(0xda,'8$%X')]=_0x4afe1a[_0x1eb0ca(0x19e,'LT9r')][_0x1eb0ca(0x391,'E&Yu')][_0x1eb0ca(0x364,'LmPB')],_0x146b08[_0x1eb0ca(0x225,'qfcN')]=_0x17dca8[_0x1eb0ca(0x191,'nEN@')][_0x1eb0ca(0x180,'zPEi')][_0x1eb0ca(0x26a,'Gspb')],_0x499994[_0x1eb0ca(0x15b,'bTw%')]=_0x325b87[_0x1eb0ca(0x3ef,'k!0k')][_0x1eb0ca(0x9e,'v]ye')][_0x1eb0ca(0xfb,'QYcb')]):$[_0x1eb0ca(0x2a2,']ygP')](_0x418cbe);else{if(_0x56c38c){_0x56c38c=$[_0x1eb0ca(0xdc,'&$Uf')](_0x56c38c);if(_0x56c38c[_0x1eb0ca(0x132,'v]ye')])try{_0x28f484[_0x1eb0ca(0x215,'zG[D')](_0x28f484[_0x1eb0ca(0x14e,'NY)W')],_0x28f484[_0x1eb0ca(0x393,'LT9r')])?(_0x98d416[_0x1eb0ca(0x337,'pz7r')]=_0x252268[_0x1eb0ca(0xd9,'dyzd')](_0x3acc65),_0x1e1740[_0x1eb0ca(0x8a,'Lq0E')][_0x1eb0ca(0x17b,'AJ08')]&&(_0x4159d9[_0x1eb0ca(0x113,'8$%X')]=_0x24ca30[_0x1eb0ca(0x8a,'Lq0E')][_0x1eb0ca(0x152,'LT9r')][_0x1eb0ca(0x3e8,'3FZ*')],_0x618f8e[_0x1eb0ca(0x201,'Yi@d')]=_0x415dc8[_0x1eb0ca(0x281,']ygP')][_0x1eb0ca(0x16f,'QYcb')][_0x1eb0ca(0x1b8,'zPEi')],_0x114ad0[_0x1eb0ca(0x2a8,'bTw%')]=_0x24ef7c[_0x1eb0ca(0xee,'ZOA6')][_0x1eb0ca(0x1b2,'k!0k')][_0x1eb0ca(0x319,'t@lz')],_0x194347[_0x1eb0ca(0x302,'3D04')]=_0x569833[_0x1eb0ca(0x37b,'zPEi')][_0x1eb0ca(0x266,'UqTs')][_0x1eb0ca(0x2ce,'y^[Q')])):($[_0x1eb0ca(0x408,'66K]')]=_0x56c38c[_0x1eb0ca(0x2ab,'ZOA6')][_0x1eb0ca(0x30b,'nEN@')][_0x1eb0ca(0xf5,'pz7r')][0x0][_0x1eb0ca(0x3c1,'UR4M')]||0x0,$[_0x1eb0ca(0x1bd,'NY)W')]=_0x56c38c[_0x1eb0ca(0x20b,'Y1fP')][_0x1eb0ca(0x357,'V8iQ')][_0x1eb0ca(0x221,'NY)W')][0x0][_0x1eb0ca(0x36e,'zG[D')]||0x0);}catch{}}else $[_0x1eb0ca(0x18f,'LmPB')](_0x28f484[_0x1eb0ca(0x17c,'ZOA6')]);}}catch(_0x609d0f){_0x28f484[_0x1eb0ca(0x75,'UqTs')](_0x28f484[_0x1eb0ca(0x3d4,'t@lz')],_0x28f484[_0x1eb0ca(0x334,'Yi@d')])?$[_0x1eb0ca(0x181,'AV58')](_0x609d0f):_0x3f98ad[_0x1eb0ca(0x27f,'F40$')](_0x45d1fc);}finally{_0x28f484[_0x1eb0ca(0x3fe,'3D04')](_0x28f484[_0x1eb0ca(0x194,')0p$')],_0x28f484[_0x1eb0ca(0x3f8,'Yi@d')])?_0x473f3b[_0x1eb0ca(0x118,'hKFA')](_0x4d18e1,_0x3e5169):_0x28f484[_0x1eb0ca(0x339,'v]ye')](_0x132d8b);}});}else _0x1945dc[_0x161fde(0x2f0,'@BwA')](''+_0x4ca8b4[_0x161fde(0x28b,'E&Yu')](_0x3d5d03)),_0x1dc1ff[_0x161fde(0x22d,']!sC')](_0x161fde(0xad,'AJ08'));});}async function sqb(){const _0x38a3b1=_0x337609,_0x206643={'KbgyK':function(_0x495346){return _0x495346();},'GTjsQ':function(_0x5b3a8b,_0x34abbe){return _0x5b3a8b==_0x34abbe;},'rWOac':function(_0x4f2299,_0x4ff8be){return _0x4f2299!==_0x4ff8be;},'afwbG':_0x38a3b1(0xc8,'Y1fP'),'WrzMd':function(_0x10737c,_0x15ac0a){return _0x10737c!==_0x15ac0a;},'gQIcq':_0x38a3b1(0x18c,'M4)X'),'JaSaJ':function(_0x4d9050,_0x1eaf39){return _0x4d9050===_0x1eaf39;},'eukll':_0x38a3b1(0x377,'LmPB'),'otGCg':_0x38a3b1(0x242,'F40$'),'pUMqX':_0x38a3b1(0x238,'M4)X'),'hGMJO':function(_0x328cc5,_0xadf9d1){return _0x328cc5>_0xadf9d1;},'sreFz':_0x38a3b1(0x94,'*PVh'),'zssHp':_0x38a3b1(0x329,'@BwA'),'thZvI':function(_0x174fd8){return _0x174fd8();},'VngvY':_0x38a3b1(0x39e,'bSZd'),'DKgvB':_0x38a3b1(0xd7,'8$%X'),'EiMID':_0x38a3b1(0x313,')0p$'),'exOmy':_0x38a3b1(0x2d4,'&$Uf'),'QXxHX':_0x38a3b1(0x284,'M4)X'),'GzWaN':_0x38a3b1(0x406,'E&Yu'),'oDzvb':_0x38a3b1(0x2fe,'&$Uf'),'eVIDJ':_0x38a3b1(0x382,'M4)X'),'hSgLg':_0x38a3b1(0x205,'bTw%'),'iyGnS':_0x38a3b1(0x3f6,'^[Wr'),'OvfTT':_0x38a3b1(0x250,'*PVh'),'Cwgzl':_0x38a3b1(0x2f9,'Lq0E'),'bJyvx':_0x38a3b1(0x99,'q2Es'),'FJBTg':_0x38a3b1(0x32c,'NY)W'),'joGnA':_0x38a3b1(0x86,'YiiC')};let _0x2fe30e=_0x206643[_0x38a3b1(0x175,'NY)W')],_0x2b633d={'source':_0x206643[_0x38a3b1(0x3a6,'bTw%')]},_0x36b28f={'appId':_0x206643[_0x38a3b1(0x2bf,'t@lz')],'fn':_0x2fe30e,'body':_0x2b633d,'apid':_0x206643[_0x38a3b1(0x2f2,'8$%X')],'ver':_0x206643[_0x38a3b1(0x87,'UR4M')],'cl':_0x206643[_0x38a3b1(0x1c8,']Qq*')],'user':$[_0x38a3b1(0x3e6,'hKFA')],'code':0x1,'ua':$['UA']};_0x2b633d=await _0x5bac0d[_0x38a3b1(0x2d6,'66K]')](_0x36b28f);if(!_0x2b633d)return;return new Promise(async _0x44e66a=>{const _0x441bb6=_0x38a3b1,_0x170f13={'hOmKl':function(_0x1ab030){const _0xb9a322=_0x50ec;return _0x206643[_0xb9a322(0x385,'pz7r')](_0x1ab030);},'MyTQd':function(_0x432a8d,_0x55f1dc){const _0x484bd5=_0x50ec;return _0x206643[_0x484bd5(0x173,'AJ08')](_0x432a8d,_0x55f1dc);},'difFB':function(_0x35f36e,_0x38607d){const _0x234a39=_0x50ec;return _0x206643[_0x234a39(0xa8,'&$Uf')](_0x35f36e,_0x38607d);},'bZkpr':_0x206643[_0x441bb6(0x3b9,'c^vU')],'WwTJf':function(_0x5e591a,_0x538e43){const _0x30cc90=_0x441bb6;return _0x206643[_0x30cc90(0x34b,']!sC')](_0x5e591a,_0x538e43);},'yKEqI':_0x206643[_0x441bb6(0x166,'M4)X')],'RKWAj':function(_0x2fbf95,_0x36267a){const _0x3206fa=_0x441bb6;return _0x206643[_0x3206fa(0x383,'66K]')](_0x2fbf95,_0x36267a);},'bIoAD':_0x206643[_0x441bb6(0x1a6,']!sC')],'OBWwd':_0x206643[_0x441bb6(0x1dc,']Qq*')],'DCcQU':_0x206643[_0x441bb6(0xde,'NY)W')],'yQMSI':function(_0x35b942,_0x5aa83b){const _0x1f149f=_0x441bb6;return _0x206643[_0x1f149f(0x27c,'y^[Q')](_0x35b942,_0x5aa83b);},'ZOqYC':_0x206643[_0x441bb6(0x219,'Gspb')],'QQssf':_0x206643[_0x441bb6(0x19f,'^[Wr')],'BYpAW':function(_0x1b662d){const _0x56ddf2=_0x441bb6;return _0x206643[_0x56ddf2(0x2c4,'pz7r')](_0x1b662d);}},_0x5de359={'url':_0x441bb6(0x20e,'hKFA'),'body':_0x441bb6(0x18e,'Vl#[')+_0x2b633d,'headers':{'Host':_0x206643[_0x441bb6(0x1cc,'Lq0E')],'Referer':_0x206643[_0x441bb6(0x2e1,'AX(a')],'User-Agent':$['UA'],'cookie':cookie,'wqreferer':_0x206643[_0x441bb6(0x234,'LT9r')],'x-rp-client':_0x206643[_0x441bb6(0x12c,'bSZd')],'accept-language':_0x206643[_0x441bb6(0x262,'3D04')],'Accept-Encoding':_0x206643[_0x441bb6(0x1c1,'0Mgc')],'x-referer-page':_0x206643[_0x441bb6(0x3de,'LT9r')],'x-referer-package':_0x206643[_0x441bb6(0x328,'nEN@')],'accept':_0x206643[_0x441bb6(0x2de,'y^[Q')]}};$[_0x441bb6(0x31d,'zG[D')](_0x5de359,(_0x28d54c,_0x47b658,_0x3ade73)=>{const _0x4ead42=_0x441bb6;if(_0x170f13[_0x4ead42(0x147,'bSZd')](_0x170f13[_0x4ead42(0x3bf,'ZOA6')],_0x170f13[_0x4ead42(0x3a1,'AX(a')]))_0x36e626[_0x4ead42(0x2e0,'LT9r')](_0x479717,_0xd85021);else try{if(_0x170f13[_0x4ead42(0x151,'Yi@d')](_0x170f13[_0x4ead42(0x310,'UR4M')],_0x170f13[_0x4ead42(0x2bb,'AJ08')]))_0x371103[_0x4ead42(0x27d,'k!0k')]+=_0x4ead42(0x179,'XPN5');else{if(_0x28d54c)_0x170f13[_0x4ead42(0x10d,'E&Yu')](_0x170f13[_0x4ead42(0x2bc,'XPN5')],_0x170f13[_0x4ead42(0x3d9,'y^[Q')])?($[_0x4ead42(0x130,'y^[Q')](_0x28d54c),console[_0x4ead42(0x1b1,'Gspb')](_0x4ead42(0x392,'LT9r'))):(_0x18ccb1[_0x4ead42(0x1a2,'V8iQ')](''+_0x9129db[_0x4ead42(0xe7,']ygP')](_0x247e1c)),_0x51afe9[_0x4ead42(0x1b5,'M4)X')](_0x4ead42(0x1b6,'F40$')));else{if(_0x170f13[_0x4ead42(0x387,'F40$')](_0x170f13[_0x4ead42(0x27b,'66K]')],_0x170f13[_0x4ead42(0x20c,'*PVh')]))_0x170f13[_0x4ead42(0x89,'AV58')](_0x364cc4);else{_0x3ade73=JSON[_0x4ead42(0x1d0,'^[Wr')](_0x3ade73);if(_0x170f13[_0x4ead42(0x3b0,'0Mgc')](_0x3ade73[_0x4ead42(0x1da,'nEN@')],0x0))$[_0x4ead42(0x3cc,'RUQ#')]=_0x3ade73[_0x4ead42(0x280,'AX(a')][_0x4ead42(0x3e5,'c^vU')]+'个',_0x170f13[_0x4ead42(0x1d1,'RUQ#')](_0x3ade73[_0x4ead42(0x21d,'pz7r')][_0x4ead42(0x25c,'Y1fP')],0x7530)&&($[_0x4ead42(0x397,'qfcN')]+=_0x4ead42(0x36a,'AJ08'));else{}}}}}catch(_0x5ac3ee){if(_0x170f13[_0x4ead42(0x3c4,']ygP')](_0x170f13[_0x4ead42(0x293,'t@lz')],_0x170f13[_0x4ead42(0x321,'zPEi')]))$[_0x4ead42(0x177,'YiiC')](_0x5ac3ee);else{_0x41cf67=_0x3fd8f7[_0x4ead42(0x208,'ZOA6')](_0x12cafa);if(_0x170f13[_0x4ead42(0x290,'LT9r')](_0x6dd589[_0x4ead42(0x13d,'AV58')],0x1a1b98))_0x11f704[_0x4ead42(0x253,'&$Uf')]=_0x2d07dc['rs'][_0x4ead42(0x207,'3D04')][_0x4ead42(0x3fa,'F40$')]?!![]:![];else{}}}finally{_0x170f13[_0x4ead42(0x11e,'nEN@')](_0x44e66a);}});});}var version_ = 'jsjiami.com.v7';
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