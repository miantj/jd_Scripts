/*
cron "28 8,21 * * *" jd_bean_change.js, tag:资产变化强化版by-ccwav
 */

//详细说明参考 https://github.com/ccwav/QLScript2.

const $ = new Env('京东资产统计');
const notify = $.isNode() ? require('./sendNotify') : '';
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
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

//特价金币
let EnableJdSpeed = true;
DisableIndex = strDisableList.findIndex((item) => item === "极速金币");
if (DisableIndex != -1) {
    console.log("检测到设定关闭特价金币查询");
    EnableJdSpeed = false;
}

//领现金
let EnableCash = true;
DisableIndex = strDisableList.findIndex((item) => item === "领现金");
if (DisableIndex != -1) {
    console.log("检测到设定关闭领现金查询");
    EnableCash = false;
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

//汪汪赛跑
let EnableJoyRun = true;
DisableIndex = strDisableList.findIndex((item) => item === "汪汪赛跑");
if (DisableIndex != -1) {
    console.log("检测到设定关闭汪汪赛跑查询");
    EnableJoyRun = false
}

//京豆收益查询
let EnableCheckBean = true;
DisableIndex = strDisableList.findIndex((item) => item === "京豆收益");
if (DisableIndex != -1) {
    console.log("检测到设定关闭京豆收益查询");
    EnableCheckBean = false
}



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
                cash(), //特价金币
                bean(), //京豆查询
                //jdCash(), //领现金
                //GetJoyRuninginfo(), //汪汪赛跑
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

async function jdCash() {
    if (!EnableCash)
        return;
    let opt = {
        url: `https://api.m.jd.com`,
        body: `functionId=cash_exchange_center&body={"version":"1","channel":"app"}&appid=signed_wh5&client=android&clientVersion=11.8.0&t=${Date.now()}`,
        headers: {
            'Host': 'api.m.jd.com',
            'Origin': 'https://h5.m.jd.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': $.UA,
            'Cookie': cookie
        }
    }
    return new Promise((resolve) => {
        $.post(opt, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`jdCash API请求失败，请检查网路重试`)
                } else {
                    if (safeGet(data)) {
                        data = JSON.parse(data)
                        if (data.code == 0) {
                            if (data.data.bizCode == 0) {
                                $.jdCash = data.data.result.userMoney;
                            } else {
                                //console.log(data.data.bizMsg);
                            }
                        } else {
                            //console.log(data.msg)
                        }
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
                    console.log(`${$.name} API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['retcode'] === 13) {
                            $.isLogin = false; //cookie过期
                            return
                        }
                        if (data['retcode'] === 0) {
                            $.nickName = (data['base'] && data['base'].nickname) || $.UserName;
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
                strsign = await getSignfromNolan('jingBeanDetail', { "pageSize": "20", "page": "1" });

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

function cash() {
    if (!EnableJdSpeed)
        return;
    return new Promise(resolve => {
        $.get(taskcashUrl('MyAssetsService.execute', {
            "method": "userCashRecord",
            "data": {
                "channel": 1,
                "pageNum": 1,
                "pageSize": 20
            }
        }),
            async (err, resp, data) => {
                try {
                    if (err) {
                        console.log(`${JSON.stringify(err)}`)
                        console.log(`cash API请求失败，请检查网路重试`)
                    } else {
                        if (safeGet(data)) {
                            data = JSON.parse(data);
                            if (data.data.goldBalance)
                                $.JDtotalcash = data.data.goldBalance;
                            else
                                console.log(`领现金查询失败，服务器没有返回具体值.`)
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

function GetJoyRuninginfo() {
    if (!EnableJoyRun)
        return;

    const headers = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "Connection": "keep-alive",
        "Content-Length": "376",
        "Content-Type": "application/x-www-form-urlencoded",
        "Cookie": cookie,
        "Host": "api.m.jd.com",
        "Origin": "https://h5platform.jd.com",
        "Referer": "https://h5platform.jd.com/",
        "User-Agent": `jdpingou;iPhone;4.13.0;14.4.2;${randomString(40)};network/wifi;model/iPhone10,2;appBuild/100609;ADID/00000000-0000-0000-0000-000000000000;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/${Math.random * 98 + 1};pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`
    }
    var DateToday = new Date();
    const body = {
        'linkId': 'L-sOanK_5RJCz7I314FpnQ',
        'isFromJoyPark': true,
        'joyLinkId': 'LsQNxL7iWDlXUs6cFl-AAg'
    };
    const options = {
        url: `https://api.m.jd.com/?functionId=runningPageHome&body=${encodeURIComponent(JSON.stringify(body))}&t=${DateToday.getTime()}&appid=activities_platform&client=ios&clientVersion=3.9.2`,
        headers,
    }
    return new Promise(resolve => {
        $.get(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`GetJoyRuninginfo API请求失败，请检查网路重试`)
                } else {
                    if (data) {
                        //console.log(data);
                        data = JSON.parse(data);
                        if (data.data.runningHomeInfo.prizeValue) {
                            $.JoyRunningAmount = data.data.runningHomeInfo.prizeValue * 1;
                        }
                    }
                }
            } catch (e) {
                $.logErr(e, resp)
            }
            finally {
                resolve(data)
            }
        })
    })
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

const fuck_0x24158f=fuck_0x552b,fuck_0x58ced7=(function(){const _0x5447f9=fuck_0x552b,_0x1d0f32={'tHUrB':_0x5447f9('0x0','t5Pz'),'VDzkA':_0x5447f9('0x1','u&v9'),'vyCuB':_0x5447f9('0x2','2NkB'),'GfGWH':function(_0x30e2ed,_0x5c8f7e){return _0x30e2ed+_0x5c8f7e;},'NNjaw':function(_0xc85d64){return _0xc85d64();},'AwlhI':function(_0x146195,_0x32d375){return _0x146195!==_0x32d375;},'ckhYS':_0x5447f9('0x3','LBwX')};let _0x388789=!![];return function(_0x924ca,_0x160f24){const _0x54f42a=fuck_0x552b,_0x2d7fe4={};_0x2d7fe4[_0x54f42a('0x4','NEdR')]=_0x54f42a('0x5','eBQN');const _0x92a278=_0x2d7fe4;if(_0x1d0f32[_0x54f42a('0x6',']K([')](_0x54f42a('0x7','63HU'),_0x1d0f32[_0x54f42a('0x8','I3OV')])){const _0x495479=new _0x924a6b(_0x1d0f32[_0x54f42a('0x9','%tIa')]),_0x13ace4=new _0x52df6e(_0x1d0f32[_0x54f42a('0xa','Iw@g')],'i'),_0x51f8dd=_0x1ad9a6(_0x1d0f32[_0x54f42a('0xb','7D7H')]);!_0x495479[_0x54f42a('0xc','63HU')](_0x51f8dd+_0x54f42a('0xd','Qwiu'))||!_0x13ace4[_0x54f42a('0xe','myaP')](_0x1d0f32[_0x54f42a('0xf','tsWz')](_0x51f8dd,_0x54f42a('0x10','u&v9')))?_0x51f8dd('0'):_0x1d0f32[_0x54f42a('0x11','u&v9')](_0x48c469);}else{const _0x43e792=_0x388789?function(){const _0x5cc202=fuck_0x552b;if(_0x92a278[_0x5cc202('0x12','LBwX')]===_0x5cc202('0x13','u0A6')){if(_0x160f24){const _0x599fe0=_0x160f24[_0x5cc202('0x14','%tIa')](_0x924ca,arguments);return _0x160f24=null,_0x599fe0;}}else _0x340a04[_0x5cc202('0x15','H$*u')](''+_0x4330cf[_0x5cc202('0x16','^ip#')](_0xae7360)),_0xbb534[_0x5cc202('0x17','TT%l')](_0x5cc202('0x18','myaP'));}:function(){};return _0x388789=![],_0x43e792;}};}()),fuck_0xd85ed=fuck_0x58ced7(this,function(){const _0x1a35e3=fuck_0x552b,_0x8d87ac={};_0x8d87ac[_0x1a35e3('0x19','myaP')]=_0x1a35e3('0x1a','RMv3');const _0x57c614=_0x8d87ac;return fuck_0xd85ed[_0x1a35e3('0x1b','NEdR')]()[_0x1a35e3('0x1c','moY1')](_0x1a35e3('0x1d','RLy3'))[_0x1a35e3('0x1e','RLy3')]()[_0x1a35e3('0x1f','zfhx')](fuck_0xd85ed)[_0x1a35e3('0x20','TT%l')](_0x57c614[_0x1a35e3('0x21','zfhx')]);});function fuck_0x552b(_0x4cf36a,_0x56067a){const _0x381680=fuck_0x57f9();return fuck_0x552b=function(_0x31e258,_0xde3c4e){_0x31e258=_0x31e258-(-0x1b12+-0x1*0x97b+0x248d*0x1);let _0x8e522=_0x381680[_0x31e258];if(fuck_0x552b['QoEhAg']===undefined){var _0x2006d5=function(_0x168b71){const _0x130515='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';let _0x2cd104='',_0xcbf3d1='',_0x1d89d8=_0x2cd104+_0x2006d5;for(let _0x5af2fe=0x1eb5+-0x3*-0x1c9+-0x2410,_0x2282d7,_0x31bb6c,_0x5f4be4=0x230c+-0x51*0x7+-0x20d5;_0x31bb6c=_0x168b71['charAt'](_0x5f4be4++);~_0x31bb6c&&(_0x2282d7=_0x5af2fe%(0x24d9*-0x1+-0x1314+0x1*0x37f1)?_0x2282d7*(-0x164d+-0x106*0x26+-0x3d71*-0x1)+_0x31bb6c:_0x31bb6c,_0x5af2fe++%(0xaa5*0x3+-0x1a47*-0x1+-0x3a32))?_0x2cd104+=_0x1d89d8['charCodeAt'](_0x5f4be4+(-0x49f*-0x5+0x25*0xb5+0x1*-0x313a))-(-0x1c77+0x183a+0x447)!==0x36f*0x6+0x1017+0x1*-0x24b1?String['fromCharCode'](0x1*-0x751+0x1ceb+-0x149b&_0x2282d7>>(-(0x3*0x21f+-0x2*0x106d+-0x85*-0x33)*_0x5af2fe&0x1*-0xa0d+-0x1175+0x1*0x1b88)):_0x5af2fe:-0x1*-0x2611+-0x23fc+-0x215){_0x31bb6c=_0x130515['indexOf'](_0x31bb6c);}for(let _0x6b4ba2=0x216+-0x24b3*-0x1+-0x26c9*0x1,_0x52b997=_0x2cd104['length'];_0x6b4ba2<_0x52b997;_0x6b4ba2++){_0xcbf3d1+='%'+('00'+_0x2cd104['charCodeAt'](_0x6b4ba2)['toString'](-0x1fa7+-0x3ca+-0x3d*-0x95))['slice'](-(0xbec+0x2*0x7cd+-0x1b84));}return decodeURIComponent(_0xcbf3d1);};const _0x434cbb=function(_0x1941e9,_0x27e208){let _0x4676d2=[],_0x221321=-0x721*0x2+-0x235c+0x3*0x108a,_0x55af79,_0x5c0f71='';_0x1941e9=_0x2006d5(_0x1941e9);let _0x3f5ea7;for(_0x3f5ea7=-0x1aca+0x1145*-0x2+0x2*0x1eaa;_0x3f5ea7<-0x1f95+0x1cd4+0x1*0x3c1;_0x3f5ea7++){_0x4676d2[_0x3f5ea7]=_0x3f5ea7;}for(_0x3f5ea7=0x6b*0x1d+0x50*0x29+-0x18ef;_0x3f5ea7<0x1*0x1ef8+-0x694*-0x3+-0x31b4;_0x3f5ea7++){_0x221321=(_0x221321+_0x4676d2[_0x3f5ea7]+_0x27e208['charCodeAt'](_0x3f5ea7%_0x27e208['length']))%(0x1*0x20c+0x7*0xdb+0x1*-0x709),_0x55af79=_0x4676d2[_0x3f5ea7],_0x4676d2[_0x3f5ea7]=_0x4676d2[_0x221321],_0x4676d2[_0x221321]=_0x55af79;}_0x3f5ea7=0x3*-0x56e+-0x1261+-0x1*-0x22ab,_0x221321=-0x131*0x8+0x22*0x9+0x856;for(let _0xa5b53c=0x6*-0x2b+0x958+0x42b*-0x2;_0xa5b53c<_0x1941e9['length'];_0xa5b53c++){_0x3f5ea7=(_0x3f5ea7+(0x24ff+0x1d05+0x189*-0x2b))%(-0x1df3+0x1a6d+0x486),_0x221321=(_0x221321+_0x4676d2[_0x3f5ea7])%(0x227c*0x1+0x1*0x1ad1+-0x3c4d),_0x55af79=_0x4676d2[_0x3f5ea7],_0x4676d2[_0x3f5ea7]=_0x4676d2[_0x221321],_0x4676d2[_0x221321]=_0x55af79,_0x5c0f71+=String['fromCharCode'](_0x1941e9['charCodeAt'](_0xa5b53c)^_0x4676d2[(_0x4676d2[_0x3f5ea7]+_0x4676d2[_0x221321])%(0xa*0xe7+0xb76+-0xac*0x1d)]);}return _0x5c0f71;};fuck_0x552b['xYfVvp']=_0x434cbb,_0x4cf36a=arguments,fuck_0x552b['QoEhAg']=!![];}const _0x5c86a5=_0x381680[-0x2530+-0xe5f*-0x1+-0xb*-0x213],_0x19cbbc=_0x31e258+_0x5c86a5,_0x337a9f=_0x4cf36a[_0x19cbbc];if(!_0x337a9f){if(fuck_0x552b['zWzLzS']===undefined){const _0x43df1b=function(_0x4dce07){this['rOiSgv']=_0x4dce07,this['AaaftA']=[0x1b85+0x43f*-0x1+-0x1745,0xe3*-0x2c+0x1*0x7ea+0x1f1a*0x1,0x49*0x35+0x1*0x1f34+-0x47*0xa7],this['smHIHh']=function(){return'newState';},this['ogegRm']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*',this['XnHRnw']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x43df1b['prototype']['QLfgFP']=function(){const _0x4d9dfa=new RegExp(this['ogegRm']+this['XnHRnw']),_0x17f73e=_0x4d9dfa['test'](this['smHIHh']['toString']())?--this['AaaftA'][0x1678+0x1e24+0xc9*-0x43]:--this['AaaftA'][-0x190c+-0x13c*0x15+0x8*0x65f];return this['NMLxTG'](_0x17f73e);},_0x43df1b['prototype']['NMLxTG']=function(_0x28e2e7){if(!Boolean(~_0x28e2e7))return _0x28e2e7;return this['MbRtns'](this['rOiSgv']);},_0x43df1b['prototype']['MbRtns']=function(_0x81c3bb){for(let _0x32564f=0x1c32+-0x1*0x1f91+0x35f,_0x2811b8=this['AaaftA']['length'];_0x32564f<_0x2811b8;_0x32564f++){this['AaaftA']['push'](Math['round'](Math['random']())),_0x2811b8=this['AaaftA']['length'];}return _0x81c3bb(this['AaaftA'][0x3e1+-0xf*0x1c5+0x78e*0x3]);},new _0x43df1b(fuck_0x552b)['QLfgFP'](),fuck_0x552b['zWzLzS']=!![];}_0x8e522=fuck_0x552b['xYfVvp'](_0x8e522,_0xde3c4e),_0x4cf36a[_0x19cbbc]=_0x8e522;}else _0x8e522=_0x337a9f;return _0x8e522;},fuck_0x552b(_0x4cf36a,_0x56067a);}function fuck_0x57f9(){const _0x33db6f=['aIb5WO7dGgxdRmk6o8kiW4JdUMNcUr3cMG','cx/cGu/dMmoGWR/dJSoBWOlcPSotW4VdKhVdH8okhZPkBumyWQ4KWO/dUCo9W7HLiWNcShG','rmkzoYy','ymkQdSoofa','WRxdNSk6W4ZdMG','W5RcTSoGjGa','kCkOWRWvWPy','vCkcWQrBlq','F8orhSoscq','sSkjyMfy','lCoMnSoCW6S','a0JdJ8krfa','rCkeWP9H','W4VcKWnkaa','WPhdMhlcKa','W5xcRdaBbW','pdRcRrhcJa','gXRcTWxcJW','yCkWpmophW','tSozWQ8gDG','x8kXr39J','W6LphW','W7FdLCkVWOPRd8kwEsm','tCkgyG','WOldMhxcKCkXotJcGulcUmk7eNbNyEITU+AZVowLGoI2Jo++MEIVT+AIPEAEJ+E+HEI1VEMgMUIVIq','WONdTepcLSkO','dSoneNNdG8kxW4hdTbzuWPKW','WQtdImktW7FdUWzecq','FZJdQSkqg8kE','p8oLWOJdJSozvr8jWPWMsSoR','y8kIW7pcLmkafvPh','WO4wWPFdRuldUcaim0Dj','uSkmzbFcOCo4','WOeWWRVdRfW','uCoPiKBcGq','smouWPmmFW','rSo/WOG6','ECkzWPrmaq','cWddRmod','WRe4WP7cIJW','WQW9WQ/dK0q','DmkWstxcGq','WQDgvIbg','pJlcJqxcQG','WPPYqbbo','DSk5t0PU','o1LAW71rmq','E8kmzZlcIa','duiXWRFcNa','W77dUYPHy8onoNLyxdK','x8kdW6FcG8kN','rCorbCoXlG','tCkXDbxcGW','jfSIW7a','C8oklSoGnq','W6rqcdT3','eSomjCod','FSkJW5dcLCkg','oSoanSorva','hCoxiSouW57dNJ7cUmoeWPvWz2/cV8ohmW','FCotW4CCWO8lW5/cVSkMkZ9scCkzWPVcIqfKxahcJbPGW7FdKCoCpsZdHK92zCo4WOS','WQtdVmoQWQGM','vmk+nCoddW','edbKWPK','WPbOWR0zAq','WRpdJ8kHW6RdPW','vSo/WPK7','WPKiWRZdIua','E3VcUXhcLSkPW6pcMmkoWRFdQmkAW4JdVtFdS8oI','WQRcJSk7WPzRc8klDJutW4FdO8kDW6FcShG1','W4nwWP/dQ1JdQseckeyulCoRtCk+d8oF','Emo1W4tdPa','W7xdVs5gxa','dmk5WQuKWQy','psdcQrtcI8oWWRJdNSkmWRZdQSkFW4hdUhJdT8oXfqr+mefuWRXSWOFdP8k+W4Dnkd3dTdCJeMlcRdZcScHRBSkOpuxdLCkda0iamCkZDG','WRvnWOuxrbpcJI9aqbLgW7ldMCoHWQtcU0SpW5pcQZNdTSoOWOddIConWRW','og0RWQxdMCoSWQ4xielcP8kDWQxcMSoYWQhcQa','fha8uHCcdCoOouzLW6LZWQNdRdVdTSkhwXpdOcjfWRddR1hcHg3cHmoG','vmkBAq','A8kNmmoylW','ddb2WONdKx7dSa','W7RcRXyOkJHN','vSkUW4pcHCkcca','W7ddLCkFWRTY','tSkawZpcJComWPK','WRhdHmkJW6BdUrShcYGZW4roxConWQ8','WOFdHmk0W6VdPq','DmoFf8oVp8onW50','gmoniSodW4/dMsxdU8kqW4zCkG','l04kWOhcPa','W6xdJ8kGq8oKmmkc','W7xcMSokbbNdHG','BmkSj8oKkwVcRa','sCoje8o5D8o+W4NcNSojiG','qCkatG','fCkLeG','DCksW6exs8kBr2RdQG','jCkQWPm','amkyWP5RW4KQW6q2WQRcICoBWOe8W4tdN+IUUoAWNUwNOoI0HE+/GUITOoAHVoADOoE8UUI2JEMhMEIURq','kLTCW6DB','c8kVaCovq8k9WOm','W6PLfq1n','W5/cHSoPabFdIHm','W6/dStbXEmoBkG','caBdVCoq','E8kOW5BcHCkEmLvnW5i','lCkKWOdcTa','vmkAybFcI8o+W5rK','WOK8WO/cUd/dQ8ooWOK','cdbHWOJdMeldOSk5FG','aCkSWOarWQRcJmkoWRfH','c1asWRlcVa','W6NdI8k1rG','eszYWP/dVwldPCk7','W7VcUsCGoJLciSoU','kvmTW7FcRu3dGSoq','evddUmkf','W7hdKSk4WPfmbSkzCa','pxyXWRdcVmkIWQWD','t8krW7HCW4faWPRdPa','W5hdKSk4WPflcCksEG','FSk+W7lcHCktehPbW5PQimk6W5BdTW','W5lcLmordG','wmkenYdcP8k+WPPc','wmksWR5WfdCfWQeBECkiW7VcH3e','dGldQmoFWRGgAhxdNa','BCo9gmktWOVcR2KgCW','W6/dJ8kGsCopn8kC','WRZdIvNcSSkX','W79lftTF','W4KrDa','5lMC5lIG5PY05yUY5zMF6l+C5zI/56QR5Ps75O+2','cCkRb8ofsq','fL7dQmkb','WOFcRmoaWO1MW7dcJM1RDCkqWO03lW','WPGkWPZdRgxdSZSFl01iimoOrmkmaSoFdr8','CmkMmSoHieRcVmoyyXa','WRZdImkNW4BdUX0','eLvcW6Do','W77cVbnIja','WO7KUR3KU4hLHB/LNl9sW59EcJtMNi3ORAxORjpMS4NLP6dOTlnJ4OkI77US4OgT77Un','xCoHcSkIWRe','pM8HW7NcGa','FCkUwhHZgq','ws7dRSkqvCk3oCk1zaa','wmk/W4NcH8kBeG','zcNdV8ksc8omCCo/yGfKWQddMCk0W5VcV8k3WQtcTIFdSY4axa','Cmo/WOWQDmolyW','WOunWO3dRKxcShPel11smmoNqmkXt8oDuragv8kVWQ1iWQS','sCkmW69hWPuoW5JdOmoSgxasxCkYW5ldVt0VBhxdN1SWW7pcKSosuMddV2q7v8k8','WRjiWPSywrNcGdvGs0OzW7/dTCoTWQldTGuvW5pcVXlcQCo5WOVdJCo7WRztba00xSkKB8odfmkzWR0vW7JcN8kpW6ZcUrv5zmoIW6i1pSkdW6BdHmkBnghdJ8kzrG','WR7dImk3','WOm0rsVcVmoveIWeFmk7t1akbSoPemk5WP5limoqWO7cG0OVESoBW50vWRRdMvTXdcrHWPpdJCkzW5tcN8oMzGBcPd3dJ8o6WQvVW6bAWOhdS0nFW7/dH8o4gSkHede8W7tcTSoxzwaremk6nJ/dN8onW5RcImoxW7nysCoSsCkkW4dcTSo1DefQfmkyW4S2WO/cPsGcFCknwmooeCoTWP/dN0tcUSkQu8kxrCk8c8obqx8IWPugWPddKSo9WOqdWQeEWPKBigb7W79znSkajCoRWRHrnu53W4hcQ8oZdZdcI8oWW4pdRSovhMdcKghcUr7dUaBdImknWQahWO40WQlcSu1Fcc7dHwaUW4KdW7RcLCoxn8kBfJFdLMiUs0zwCmo4DmoMWRXAWOdcKmoFFSk6dvPCvCo1WQZcMIevWPqTw2RdKSoIm8o7iYLpWPnyaWD2iCoLWPb4W4tcOSoQWOxdRmkTW6vXkmk/W4DmW7BdTmk/WP4ouMhcMuldJCoNjIFcK8o+CtxcVN/cKY1bfCo3WO7dTmksCCkXxCoYr8oLo8kkWPTsW69yhIHDFmkAqvRdQf4KCSovDHddNsbnvCkYbmoIWRldJCoAW7T0aGrfzSkEWQdcKxHVWPhcGSkoW49fh8oKpCoqW4CKW6O2W5JdH8kXfgbxn8ozo8ktW7XYhSk4W4bDavvaa8kyEWtcKmkQWPmj','WR9uW6/cMsu','Bmk0urdcPG','W6aXBZ7cSW','W501rCoQDG','ymkoWO1boW','W6hdHCkM','5PEl5ys+5z225P2s6k2i5AAg6lw0','AmkMiCofpMS','W7vpcYm','tmkDW4/dV8kJ','C8k/nSo2iG','WQJdPmkmW6NdHG','u8kCyGRcGq','i8osfmonW44','gv7dQW','D8k9nmoPiN7cTSorAa','nLvj','lSkGWOdcOmooWPNdVmoKW53cQhmKEdNdU+IVKUAXGUwNToI1Ho+8REITR+AGVUAEHoE8JoI2UUMgKoITGG','W68XrcVcJCosjZSt','WRWLW5SRWRS','cSkCWP59W5i','zSkSj8oUd3BcQSozzq','yCoVh8kvWPC','W6ddI8k1rmoP','WR8TW4WJWP0vWO51','W4G5xI/cVq','WRLCWOeyrq','WOJdOmofWQONaSkRW54','kx1g','WO3dTvJcRCkh','ymoHda','hXpdU8oyWPuoDh3dKq','ySkaW7hcGSkM','vmk1W4PvW7S','W77cPrajptG','sSkkxq','W4xcGCoxbH7dHbtcJSkq','W4tcLau','r8k8WRPx6k2n5Rcn5AAN6lw677+i6kYy5Qg05PY7572B6lwp6ywR6k6A','B8kUuYBcPW','pLzkW6nX','sCoWWQaBvq','l8oRa8oZW6C','vCoZWOqRrCobFYmzxLRdG8oOimkwW6JcMSospMfWWQBcPHyI','amkRWQqnWQZdHCo3W7DHWOfZW6xdH8o9fmoSW5DkFCkcWPVcKSkuyConW50qFWBdNmoDWQ9GF8k4W6ZcSSkvW5qw','qmkzDsZcPG','WOLRW4/cUXa','WQFdM1tcS8kU','t8kynIS','WRhdL8kPW6C','uSo2WP88wComzcqcx1pdR8oQ','v8oPWO89','WOfoWPajyXhcGJ4','W6FdJSk5WOy','WOOCWO3dVfNdRIW','WQP8W7hcSWys','cMqNWQFdMmknWQ0xkfO','W7KmW7tdK8oVACk8','lgJdR8k1bW','dmk4gq','WOunWO3dRKxcShPejLHsz8o/d8k1bCkEhbupvSkTWRjmWRS','WQVdHSkUqmoOlmkLWQrzimo+iSkUWPavuCoLmSkqpSkgkCoPWRm','emobnmoZD8o5qW','WOVdOSolWQG7','W7RcMqy8dq','W6FdPt1uqW','W77dKmkKWQvr','W4BcMSowgW','eCkzbmogBG','WRldPSoKWOSB','ku86WPtcVa','hCodpSoAW6pdMtFcUq','uCkiDXBcPW','oxyWWRJcVmkIWQWD','WRhcOCohWPnhW6ZcN35xvmkC','Amo+WQWUDmodqsuevxJdVCo0ma','WOSyWOVdS3/dPdme','AJZdUCkplCkfo8kIwGzI','W4BcMG9g','y8k4W6RdRmkTmgzHW5W0kCkg','r8kzW6LAW6zpWPhdRG','wmkGrx5pdWSZW7RcPGe','W7fshtjlcmkNt07dUW','jGpdVCodWP4msxtdNahdHsBdUsdcMmkPWP4','WRBdHSkYW67dGafmaq','W6ldGmkVWO5qg8kABqOpWOC','WQtdLCkLW6BdNqbEdYOvW4vprSoeWRe','vCkByadcKCoKW5n/DW','qmkesdRcOCoqWOZcSG','ASoVgCkBWQRcLwistdvg','Cmk7i8oLh23cVSodDa','fdrLWP7dKq','WPddI07cKmkP','phGMWRa','CSo2WP88CSobztyhyLxdS8oRma','t8o8f1xcGmkovCkHgSorcSoYWPSIi8kAWPJdNgC','tSoGbKBcV8kKwmk6amor','cdPWWQJdHN4','W7JdPCkRzCo7','W6NdSSkpWQHg','W5tcPmoDgb4','WRLsCJ9Z','ydldRmkNcSke','WP/dR0FcNCkb','W5enDmoaDa','ltRcMJZcMW','ngBdMSkLpG','zSkpemo1ja','WRnQWOWmwW','W7GqW5ZdPCo4','lCkirW','WOXNWPGAwW','WQFcHCoR','Emk/jadcRq','w8o/aKVcUSkuwSkHg8oBf8k0WPLQb8koWOdcG2tcJLhcK8kDh8k3WPNdUCotWRDoEwCa','eczWWQpdOW','zmkGW4ultq','vCkJEN9T','m3DtC8oZqmow','W6FdICk8WO1RdCkt','u8kaWO5WgrGJWQeyCSkSW6i','cunGW4DB','c8kCWP4','fCkKeG','WRaNW4WTWQma','huHmyCoS','bSkEWOL7W4O7WRS6WQRcJmoBWRPJW47dGq','y8kZl8oWydNcU8osDXNdGmkPW7ddV39jDq','BCoTcmktWO/cKIOmFsLoD8keWOddSa','d1NcOCkNgmkmWRG1WQ8WutXYW6m','dWJdPSoAWPim','WRJcSSoCWPL7W7e','vSk1q2nPrKfUW4NcTrWGnICFkvTGW65wWOX8WO0','WQ/dTSogWR0BbSk0','mK5AW6rnzCkdAmotoSoriSoKW6JdNr3dV8kCk8o3W50Ttq','mSkoWO9SWPCoW7e6WQRcMW','ASkZW7ddQSkTo1CIW60/pSkA','ieG6Bd0','W6ZdLCkPWPn2uSoqmdSnWOhcQCkjWQxcU3jTW73cJdZdVCo/AcOWWO3cVSkSeCkHWOGXu27cSCkZxNlcNmoTlSkAW4JcMSoTE8kiW6NcSSk8WOT+aW','W6/dHCkLxSk8','W7jCWOulrbtdKIXbgG','r8kJFZFcMW','W6HLlsvO','dmoxmSozrq','W7xdHmkgF8oI','WQJdICkhW5VdQG','AmkMiq','WQ/KUAlKUi/LHjlLNjKOq8k9WPLK5P+66k2c6kYs5RgX5AAl6lEVBokbM++7OEkdNo+7Ka','WOv8W7K','WQpdK8kYW6RdPWHdcd8','CCkYW6RdNCkp','l8kKWOBcUmo0WPldQmoI','z8kSW5lcK8kx','AJZdUCkpmCkyomk/','hCodpSoAW7/dHdtcPmk0W41d','rJNdJCkdcSkBdSkIzrbdWRJdGCkW','WRjCWOCwzb7cItq','i3ntBCopxmoDWOnPWPFcHa','x8kaWOfW','tmkcW6CmqmkzA2ldTSkvW4nj','ymkhW6etBmkssgm','W40iW6ddM8oiF8kRaCovjmoJ','vCkByadcH8o+W5D5DCk6','WP5zWOejsbxcUZrDtHSSW7BdJ8o8WQ3dRG','WRVdSSosWRuGdCkGW5q','e1ddVSkja8otWQCVW4qZaW','lKHlW7fQmmoyjSoChSonnCoVWQhdIq','vCkkW75sW7XvWPBdTCo5','W40iW6ddM8ouySkOha','W6NdPIf3rmollM5j','WRCYW4qnWOq','WO0RWPFcMce','WOhcH8obWPzh','tSo1WO0','ne48W7xcJuVdHSotkG','aaJdRG','W5hcKmorgGpdHG/cGCkhWPvOmIJcS1JORAVMSAdLPzNOTyZVVPdORkVMOO3MN6ZNVP7OTjpPHPdORP0','WPRdJSkUW6tdKqzlace','xmkaWPH2hq','WP1DttbF','W4KmW7pdMmoEy8k7hCoX','WOJdNhxcH8kQ','tmkiCqBcQG','W4uaW7hdNCotBCkJfG','v8oUbKtcUW','WOy8WOJcVH4','cMqNWQFcU8kTWQCx','W5ZcUmoaoWi','jICwzSkS','W4xcNmocarxdHYlcN8kbW4y','WRGRW5W','DtHO','WOWNWPxcRvRcPComWOpdRwZdOmkYhSkxW5GHWQq','WQSSWOilWP1yWPL4gGFcK8okvtJdVM/cPGSH','EJJdUCkreCkzma','fSktimoZDa','xmoUaeRcJmkFvmk4fW','trddOCkLfG','neOIW7xcLW','DmkOzLXc','WOq3W4O6WP0vWO51','W4WmW6BdLmoYAmk3','eLvDW6a','x8kXxJ13uGqLWOtcTWe/','CmkcWO9Wbs8','dYJdGSosWQe','BSkkW7jqW4zp','lwzvCmoPfCkxW55rW5ddHCkpW6ZdKmo3Cmo3WQDF','WPhdHmkJW6BdUrShkYGZW4roxConWQ8','qmkHtbJcMW','WOq3W4O6W741WOr1wtS','F8kIvhzQcemnW4VcUGKNlM4x','WQdcHmo9WRTR','nJbXWOJdHMNdSq','WR/cTmobWO5HWQxdLsnVe8oDWO9RihzKuCoWqfy','W4FdJSkYWOHSdq','pmk3WPG','uSoQe0pcTSkfsa','vCkaAadcRCoLW4y','CCk4W47cG8kgfvToWPCLpCoNWOlcTw7dIa','W6VdJaLRxq','WRxcOCoBWPzb','fmoqdCoXqa','jmkoWOlcKCor','m8owcCopW4S','baBcTdFcRW','rXtdU8kmfG','kMODW43cRW','eMu4','pmkMWRVcPSo1','gchcVYdcSG','s8oPdmoGfa','q8oVWQmosa','W5ddGaHHxq','n8kfWR9FW68','gw8R','5PEC5yE75z6Z5P2u6kYz5Awy6ls4','fCkLeSoZxSkR','BmoBbmo4pW','W7VdPJf7y8orkM1fxs0X','ymkOmSoH','WOjzsIzBFa','d8kDjmovrq','hcxcPqRcNa','WPNdLSk4W63dRq','WRG3W6mNWRqDWO0','xCkoWOS','5PEV5yAl5z245PYW6kYx5AE96lEV','uSkUufzOdG','W4BcLmoxhbu','iuG7W7xcL0ldISocoNRcP8oD','i1S6W70','W6/dStDNE8ol','rCkZW7NdM8k6jW','hSoZomoaW60','WObQqYbn','t8kvzvH0','eSkEWQvTW7i','u8oHaLlcPW','l8k0WP/cJmoy','jmkpcCk8mSkHgfmWWOioW5VcShXqWOhdUtHomCkOib7dO8onWR5jgCoxx8otw8kxWO4','EmkzW61+W4C','WOiZWPxcQq','mxDsDa','WPnuwdPz','W7NdJ8kYuW','WOBdHSkYW7FdRW','gSowaSoHW5O','ptrHWQtdNa','frFdVSo2WRC','bSknWPPYW4m','WRdcP8oqWOW','W6a9W73dHSoZ','W5xdMmk6WPL1','kCkDo8oaBW','amk+W55krGr/WP9dq8o/W5hdI0BdJtFdG8krzmoZW6u','WPNcPfr8wCkTsa','WO9pW4RdUfa','WP0vWOZdRwNdQcaylKzEoSoH','huxdUmkujCkAW61YW6qTgx9YWRDUW5ueWQ7cKcJdRa','amkRWQqnWQZdHCo3W7DHWOfZW6xdH8o9fmoSW5DkFCkcWPVcKG','W7hcPrK4kIrGh8oNwIC','e1LyW5v9','WPO0WPJcRG','WPyPW7KYWOC','B8oMdSkvWPtcQMiwEsS','Bs3dU8kRha','WRjAytXB','WQlcS8oqWOXnW7JcN3HsvCkwWPamjhqLBCoPhW','W4CrD8o3','jKONW7G','eh1xW4nT','t8o8f1u','W77dUYb3','W4i9xI7cUSoFpW','DmklW75fWOjGWPddPmoYba','k8kWWR8wWRBcMG','DSkZyqVcMW','vmkdW7uBv8kzxa','WQpdGSk5W7ldUW','W53cIq4','mK5AW6rnzCkdAmork8okFSoWW6JdMLFcU8kBASo5WP0HeSkLW79XWRzobx8CW6vgxMddReuAquBcVXiQhcNcLIfDW4OsimkGWP0IW4G','q8kxW79o','sCkDW7PtW4PtWOq','WQldR2/cGSkx','wSkMqN90','W4tdRtvwEW','WR4UW70IWOa','g8oiiCoewa','g2SEBH0','WOCYWPS','uSkmW6LEW4fgWP7dP8oL','vSoGfq','smkEWOa06kYO5Rk95AEP6lE977YD6kYA5Qog5P2Z57646lw/6yE36k2t','g3jcW4bD','WOGYWPJcUa','WPKnWPtdVh0','vJddPCkrea','WOqkWQNdSKpdUqmcnW','WQ3dV8ovWQS8emkJW4KDW57dVaFcMMJdN8ob','W4aqD8okqMSq','jIdcRW3cLSkTW77cL8ky','WRZdImkN','CmkOW5tcLCkbguzjW5LPdSkqWPtdU0VORjBMS77LP7BOTOVVVktORyFMOOBMNAJNV6dOT6/PH6NORQq','gSkLg8ofwmkRWPpdKd3dP8kQ','W4eBCCo7','zSk7AWpcLW','W7pcUGCGnG','c8oqnmoJD8oeuGzVWROB','nLvjW5fmlq','WPxcTmorWODg','pJ5BWOJdKW','lgmWWRZcM8kR','aLNdPCkim8kaW6OPW6y0csv8WQe9','kSkQWOhcU8ojWPNdVa','WODkW6NcOb4','WOeCWPFdUuldOG','a8kyWOHR','iNveCG','W5JcTXHNkW','W4RdUCkYWPLh','WQbqW47cRHK','WRCsWRxdU1e','W5ObW5xdMCou','hmkDnmoazq','WRD6WP8Yxq','qSkxW7veW5TtWOldOSoOhYW','WO45WO/cIYC','jKO+W7dcMG','w8oGWPK7zW','CSkpyfjq','xmkMW7tdJSkE','mColiSoqW7ldNJdcUmkd','qmkwjJhcHG','WRRcOCobWP16','s8k5W7/dSmkloLzHW40','fCofiCo0EG','x8kiWO9+oZOMWQu','aqBdVCosWPm','D8oPWO89smopFdi','Amk7qKLz','W7yqxqxcPG','CSkkW4hcP8kX','x8o3mmotgq','kSkQWPRcPSojWO7dU8oUW4FcOw4','lmkXWQCCWPu','W5WxzI3cLa','wCkMuMe','WO4yWPxdSG','qmkkCqZcRCo+','ox8fWRtcSG','z8kMkmoZogVcQSouzrRdKW','evtdRSkr','f8k2WQzCW44','kmk1WOtcUCoe','ku5pW6bBemoolCovomox','WOHJW67cTby','WObTWQaXsq','g8kUaSotwa','fmolmSosymo5'];fuck_0x57f9=function(){return _0x33db6f;};return fuck_0x57f9();}fuck_0xd85ed();const fuck_0x24656c=(function(){const _0x5cbcb6=fuck_0x552b,_0x148f07={};_0x148f07[_0x5cbcb6('0x22','f]3I')]=function(_0x531c61,_0x44b127){return _0x531c61+_0x44b127;},_0x148f07[_0x5cbcb6('0x23','u0A6')]=_0x5cbcb6('0x24','u0A6'),_0x148f07[_0x5cbcb6('0x25','63HU')]=_0x5cbcb6('0x26','whAt'),_0x148f07[_0x5cbcb6('0x27','PEG$')]=_0x5cbcb6('0x28','zfhx'),_0x148f07[_0x5cbcb6('0x29','RMv3')]=_0x5cbcb6('0x2a','wgf5');const _0x3b01aa=_0x148f07;let _0x2d42b8=!![];return function(_0x45111f,_0x421cf7){const _0x10637c=fuck_0x552b,_0x3adc18={'HNGcU':function(_0x47c2a6,_0x5d1930){const _0x89bdc9=fuck_0x552b;return _0x3b01aa[_0x89bdc9('0x2b','u&v9')](_0x47c2a6,_0x5d1930);},'Ykszt':_0x3b01aa[_0x10637c('0x2c','wgf5')],'lXqpA':_0x3b01aa[_0x10637c('0x2d','%tIa')],'opXko':_0x10637c('0x2e','BZGW')};if(_0x3b01aa[_0x10637c('0x2f','TT%l')]===_0x3b01aa[_0x10637c('0x30','n[jV')])(function(){return!![];}[_0x10637c('0x31','JV%z')](_0x3adc18[_0x10637c('0x32','RLy3')](_0x3adc18[_0x10637c('0x33','I3OV')],_0x3adc18[_0x10637c('0x34','TT%l')]))[_0x10637c('0x35','Ej(N')](_0x3adc18[_0x10637c('0x36','I3OV')]));else{const _0x21e3d3=_0x2d42b8?function(){const _0x2177f5=fuck_0x552b;if(_0x421cf7){const _0x562654=_0x421cf7[_0x2177f5('0x37','H$*u')](_0x45111f,arguments);return _0x421cf7=null,_0x562654;}}:function(){};return _0x2d42b8=![],_0x21e3d3;}};}());(function(){const _0xc33f80=fuck_0x552b,_0x4fcecf={'yoJpO':function(_0x1f5f2a,_0x1c82ba){return _0x1f5f2a(_0x1c82ba);},'PwsCC':_0xc33f80('0x38','Iw@g'),'DUHbD':function(_0xc79008,_0x12eea9){return _0xc79008+_0x12eea9;},'tqEWv':_0xc33f80('0x39','RLy3'),'BdcFF':function(_0x35cf46,_0x10831c,_0xfacbee){return _0x35cf46(_0x10831c,_0xfacbee);}};_0x4fcecf[_0xc33f80('0x3a','AEcY')](fuck_0x24656c,this,function(){const _0x300549=fuck_0x552b,_0x523547=new RegExp(_0x300549('0x3b','Iw@g')),_0x36b0d8=new RegExp(_0x300549('0x3c','bhKB'),'i'),_0x4ffa11=_0x4fcecf[_0x300549('0x3d','0%Z*')](fuck_0x258a51,_0x4fcecf[_0x300549('0x3e','LBwX')]);!_0x523547[_0x300549('0x3f','t5Pz')](_0x4fcecf[_0x300549('0x40','g^((')](_0x4ffa11,_0x300549('0x41','NEdR')))||!_0x36b0d8[_0x300549('0x42','u0A6')](_0x4ffa11+_0x4fcecf[_0x300549('0x43','zfhx')])?_0x4ffa11('0'):fuck_0x258a51();})();}());const fuck_0x223e28=require(fuck_0x24158f('0x44','u&v9')),fuck_0x5ceaab=require(fuck_0x24158f('0x45','^ip#')),fuck_0xcfc431=require(fuck_0x24158f('0x46','zfhx'));async function getuserinfo_6dy(){const _0x1bb278=fuck_0x552b,_0x5b311c={'oEmZC':_0x1bb278('0x47','g#AS'),'TGPgI':function(_0x4e1e04,_0x17fc0a){return _0x4e1e04==_0x17fc0a;},'YtXVs':_0x1bb278('0x48','JV%z'),'zkmlQ':_0x1bb278('0x49',']K(['),'Holsp':function(_0x252212){return _0x252212();},'onvXc':_0x1bb278('0x4a','u&v9'),'ttBXw':_0x1bb278('0x4b','g^(('),'Wcthl':_0x1bb278('0x4c','n[jV'),'pYHTQ':_0x1bb278('0x4d',')Jot')},_0xb7271={};_0xb7271[_0x1bb278('0x4e','TT%l')]=_0x5b311c[_0x1bb278('0x4f','LBwX')],_0xb7271[_0x1bb278('0x5c','LBwX')]={},_0xb7271[_0x1bb278('0x5c','LBwX')][_0x1bb278('0x52','RLy3')]=_0x5b311c[_0x1bb278('0x53','^ip#')],_0xb7271[_0x1bb278('0x5c','LBwX')][_0x1bb278('0x55','NEdR')]=_0x5b311c[_0x1bb278('0x56','NEdR')],_0xb7271[_0x1bb278('0x5c','LBwX')][_0x1bb278('0x58','Iw@g')]=_0x5b311c[_0x1bb278('0x59','n[jV')],_0xb7271[_0x1bb278('0x5c','LBwX')][_0x1bb278('0x5b','eBQN')]=cookie,_0xb7271[_0x1bb278('0x5c','LBwX')][_0x1bb278('0x5d','I3OV')]=$['UA'];let _0x327742=_0xb7271;return new Promise(_0xa3ad3=>{const _0x9483a6=fuck_0x552b;$[_0x9483a6('0x5e','RMv3')](_0x327742,async(_0x274e32,_0x52ae9e,_0x3c06ba)=>{const _0x1d6a66=fuck_0x552b;try{if(_0x274e32)console[_0x1d6a66('0x5f','8c$R')](''+JSON[_0x1d6a66('0x60','s(Jc')](_0x274e32)),console[_0x1d6a66('0x61','g#AS')](_0x1d6a66('0x62','*6Gg'));else{if(_0x3c06ba){_0x3c06ba=JSON[_0x1d6a66('0x63','BZGW')](_0x3c06ba);if(_0x3c06ba[_0x1d6a66('0x64','8c$R')]===_0x5b311c[_0x1d6a66('0x65','H$*u')]){$[_0x1d6a66('0x66','eBQN')]=![];return;}_0x3c06ba[_0x1d6a66('0x67','JV%z')]==='0'&&_0x3c06ba[_0x1d6a66('0x68','whAt')]&&($[_0x1d6a66('0x69','RLy3')]=_0x3c06ba[_0x1d6a66('0x6a','g#AS')]?.[_0x1d6a66('0x6b','TT%l')]?.[_0x1d6a66('0x6c','PEG$')]?.[_0x1d6a66('0x6d','t5Pz')],$[_0x1d6a66('0x6e',']K([')]=_0x5b311c[_0x1d6a66('0x6f','n[jV')](_0x3c06ba[_0x1d6a66('0x70','jcmD')]?.[_0x1d6a66('0x71','t5Pz')]?.[_0x1d6a66('0x72','tsWz')],-0x17*0x17e+-0x2*0x699+0x981*0x5),$[_0x1d6a66('0x73','Ej(N')]=_0x3c06ba[_0x1d6a66('0x74','7D7H')]?.[_0x1d6a66('0x75','^ip#')]?.[_0x1d6a66('0x76','n[jV')]?.[_0x1d6a66('0x77','bhKB')]||$[_0x1d6a66('0x78','^ip#')],$[_0x1d6a66('0x79','RLy3')]=_0x3c06ba[_0x1d6a66('0x7a','eBQN')]?.[_0x1d6a66('0x7b','2NkB')]?.[_0x1d6a66('0x7c','63HU')]||'',$[_0x1d6a66('0x7d','whAt')]=_0x3c06ba[_0x1d6a66('0x68','whAt')]?.[_0x1d6a66('0x7e','doeF')]?.[_0x1d6a66('0x7f','jcmD')]||-0x1b47+0x1e14+-0x2cd);}else{if(_0x5b311c[_0x1d6a66('0x80','myaP')]!==_0x5b311c[_0x1d6a66('0x81','H$*u')])$[_0x1d6a66('0x82','6@5S')](_0x1d6a66('0x83','wgf5'));else{const _0xb604cc=_0x14b485[_0x1d6a66('0x84','8c$R')](_0x44e8e2);_0xb604cc[_0x1d6a66('0x85','7D7H')]==0x2*0x9ef+0xc19*0x3+-0x3441&&(_0x1981a8[_0x1d6a66('0x86','rQsa')]=_0xb604cc['rs'][_0x1d6a66('0x87','zfhx')][_0x1d6a66('0x88','LBwX')]);}}}}catch(_0x34aae8){$[_0x1d6a66('0x89','NEdR')](_0x34aae8,_0x52ae9e);}finally{_0x5b311c[_0x1d6a66('0x8a','BZGW')](_0xa3ad3);}});});}async function fuck_0x338a38(){const _0x135ba6=fuck_0x552b,_0x24f83e={};_0x24f83e[_0x135ba6('0x8b','Qwiu')]=_0x135ba6('0x8c','^ip#'),_0x24f83e[_0x135ba6('0x8d','doeF')]=_0x135ba6('0x8e','Ej(N');const _0x4f7dbc=_0x24f83e,_0x1e9005={};_0x1e9005[_0x135ba6('0x8f','%tIa')]=cookie,_0x1e9005[_0x135ba6('0x90','moY1')]=$['UA'],_0x1e9005[_0x135ba6('0x91','RLy3')]=_0x135ba6('0x92','moY1'),_0x1e9005[_0x135ba6('0x93','u0A6')]=_0x135ba6('0x94','zfhx');let _0x199e5e={'url':_0x135ba6('0x95','bhKB'),'body':_0x135ba6('0x96','g^((')+Date[_0x135ba6('0x97','NEdR')]()+_0x135ba6('0x98','OS&t'),'headers':_0x1e9005};return new Promise(_0x7615ea=>{const _0x4e4801=fuck_0x552b,_0x297725={'hHYIE':_0x4f7dbc[_0x4e4801('0x99','*B[W')],'eAQak':_0x4e4801('0x9a','RMv3'),'xCLjO':function(_0x57e5c9,_0x1c6c43){return _0x57e5c9!==_0x1c6c43;},'XpXzd':_0x4e4801('0x9b','OS&t'),'NGVCe':function(_0x2a29ec){return _0x2a29ec();}};_0x4e4801('0x9c','6@5S')===_0x4f7dbc[_0x4e4801('0x9d','63HU')]?(_0x348140[_0x4e4801('0x9e','jcmD')](_0x4e4801('0x9f','Iw@g')),_0x21c4ac[_0x4e4801('0xa0','LBwX')](_0x573088)):$[_0x4e4801('0xa1','H$*u')](_0x199e5e,async(_0x4008be,_0x238c0b,_0x59d598)=>{const _0x56f788=fuck_0x552b;if(_0x297725[_0x56f788('0xa2','5RXo')]===_0x56f788('0xa3','LBwX'))return!![];else try{_0x297725[_0x56f788('0xa4','NEdR')](_0x56f788('0xa5','TT%l'),_0x297725[_0x56f788('0xa6','Iw@g')])?_0x4008be?(console[_0x56f788('0xa7','7D7H')](''+JSON[_0x56f788('0xa8','LBwX')](_0x4008be)),console[_0x56f788('0xa9','BZGW')](_0x56f788('0xaa','g#AS'))):($[_0x56f788('0xab','OS&t')]=_0x59d598[_0x56f788('0xac','sTN#')](/"score":(\d+)/)?_0x59d598[_0x56f788('0xad','*6Gg')](/"score":(\d+)/)[0x9b2+0x132a+-0x1cdb]:0x1*0x217b+-0x926+-0x1855,$[_0x56f788('0xae','LBwX')]=_0x59d598[_0x56f788('0xaf','doeF')](/"currentBeanNum":(\d+)/)?_0x59d598[_0x56f788('0xb0','jcmD')](/"currentBeanNum":(\d+)/)[-0x158c+-0x1f52+0x34df]:-0x1c8a+0x11*-0x1d2+-0x11a*-0x36,$[_0x56f788('0xb1','sTN#')]=_0x59d598[_0x56f788('0xb2','OS&t')](/"showName":"(.*?)"/)?_0x59d598[_0x56f788('0xb3','g^((')](/"showName":"(.*?)"/)[0x1861+-0x1e5c+0x5fc]:$[_0x56f788('0xb4','0%Z*')]):(_0x2de840[_0x56f788('0xb5','GEsl')](_0x297725[_0x56f788('0xb6','myaP')]),_0x2ece34[_0x56f788('0xb7','doeF')](_0x2ca53e[_0x56f788('0xb8','whAt')](_0x32f32b)));}catch(_0x1f6da8){_0x56f788('0xb9','RLy3')===_0x56f788('0xba','bhKB')?$[_0x56f788('0xbb','tsWz')](_0x1f6da8,_0x238c0b):(_0x52660d[_0x56f788('0xbc','RMv3')](''+_0x55c1d8[_0x56f788('0xbd','eBQN')](_0x27c8c2)),_0x581423[_0x56f788('0xbe','Qwiu')](_0x56f788('0xbf','*6Gg')));}finally{_0x297725[_0x56f788('0xc0','TT%l')](_0x7615ea);}});});}async function queryScores(){const _0x39519c=fuck_0x552b,_0xe82b83={'hSqpB':function(_0x279eb3,_0x3dcf20){return _0x279eb3===_0x3dcf20;},'uvOtk':function(_0x464fff,_0x3bf5d8){return _0x464fff==_0x3bf5d8;},'uOjBz':function(_0x9a71fe,_0x45cbb9){return _0x9a71fe!==_0x45cbb9;},'mSRKC':_0x39519c('0xc1','BZGW'),'bQxwn':_0x39519c('0xc2','u0A6'),'InKlD':function(_0x5b181d){return _0x5b181d();},'VqkpR':function(_0x16d200){return _0x16d200();},'zqyFT':_0x39519c('0xc3','Iw@g'),'BfUWl':_0x39519c('0xc4','u0A6'),'YYcQQ':_0x39519c('0xc5',']K([')};let _0x143cdc='';const _0x21b204={};_0x21b204[_0x39519c('0xc6','TT%l')]=_0x39519c('0xc7','PEG$'),_0x21b204['fn']=_0xe82b83[_0x39519c('0xc8','myaP')],_0x21b204[_0x39519c('0xc9','2NkB')]={},_0x21b204[_0x39519c('0xca','NEdR')]=_0x39519c('0xcb','u0A6'),_0x21b204[_0x39519c('0xcc','u0A6')]=$[_0x39519c('0xcd','g^((')],_0x21b204[_0x39519c('0xce','^ip#')]=0x0,_0x21b204['ua']=$['UA'];let _0x51ac3d=_0x21b204;body=await fuck_0x223e28[_0x39519c('0xcf','zfhx')](_0x51ac3d);const _0x5515a8={};_0x5515a8[_0x39519c('0xd0','*B[W')]=cookie,_0x5515a8[_0x39519c('0xd1','n[jV')]=$['UA'],_0x5515a8[_0x39519c('0xd2','wUHX')]=_0xe82b83[_0x39519c('0xd3','7D7H')];const _0x1f730d={};_0x1f730d[_0x39519c('0xd4','8c$R')]=_0x39519c('0xd5','zfhx')+body+_0x39519c('0xd6','jcmD'),_0x1f730d[_0x39519c('0xd7','AEcY')]=_0x5515a8;let _0x47d7f8=_0x1f730d;return new Promise(_0x560452=>{const _0x53687c=fuck_0x552b,_0x20903b={'zRFyC':function(_0x591a91){const _0x3f581a=fuck_0x552b;return _0xe82b83[_0x3f581a('0xd8','0%Z*')](_0x591a91);}};_0xe82b83[_0x53687c('0xd9','tsWz')](_0xe82b83[_0x53687c('0xda','JV%z')],_0xe82b83[_0x53687c('0xdb','^ip#')])?$[_0x53687c('0xdc','eBQN')](_0x47d7f8,async(_0x4514de,_0xf2e18c,_0x108e8e)=>{const _0x1cddc2=fuck_0x552b;if(_0xe82b83[_0x1cddc2('0xdd','8c$R')](_0x1cddc2('0xde','0%Z*'),_0x1cddc2('0xdf','n[jV')))_0x13f668[_0x1cddc2('0xe0','Iw@g')]=_0x25679b[_0x1cddc2('0xe1','TT%l')](_0x5aa309),_0x496bd0[_0x1cddc2('0xe2','n[jV')][_0x1cddc2('0xe3','rQsa')]&&(_0x4c2a2b[_0x1cddc2('0xe4','u0A6')]=_0x45ecb6[_0x1cddc2('0xe5','zfhx')][_0x1cddc2('0xe6','moY1')][_0x1cddc2('0xe7','Qwiu')],_0x45dc8e[_0x1cddc2('0xe8','5RXo')]=_0x23753d[_0x1cddc2('0xe9','bhKB')][_0x1cddc2('0xea','%tIa')][_0x1cddc2('0xeb','H$*u')],_0x3aa196[_0x1cddc2('0xec','whAt')]=_0x42bf1a[_0x1cddc2('0xed','NEdR')][_0x1cddc2('0xee','^ip#')][_0x1cddc2('0xef','NEdR')],_0x5cafd4[_0x1cddc2('0xf0','TT%l')]=_0x396b3c[_0x1cddc2('0xf1','RMv3')][_0x1cddc2('0xf2','doeF')][_0x1cddc2('0xf3','LBwX')]);else try{const _0x5542e5=JSON[_0x1cddc2('0xf4','t5Pz')](_0x108e8e);_0xe82b83[_0x1cddc2('0xf5','myaP')](_0x5542e5[_0x1cddc2('0xf6','n[jV')],0xb*-0x1b7+-0x14e5+0x2baa)&&($[_0x1cddc2('0xf7','u0A6')]=_0x5542e5['rs'][_0x1cddc2('0xf8','f]3I')][_0x1cddc2('0xf9','f]3I')]);}catch(_0x2f34dc){$[_0x1cddc2('0xfa','t5Pz')](_0x2f34dc,_0xf2e18c);}finally{_0xe82b83[_0x1cddc2('0xfb','jcmD')](_0xe82b83[_0x1cddc2('0xfc','^ip#')],_0xe82b83[_0x1cddc2('0xfd','eBQN')])?_0xe82b83[_0x1cddc2('0xfe','wgf5')](_0x560452):_0x2d2272[_0x1cddc2('0xff','moY1')](_0x4a4a42,_0x2c7216);}}):_0x20903b[_0x53687c('0x100','myaP')](_0x1eb181);});}async function fruitinfo(){const _0x5e4c41=fuck_0x552b,_0x3a70c5={};_0x3a70c5[_0x5e4c41('0x101','6@5S')]=function(_0x310233,_0x2a8cf3){return _0x310233===_0x2a8cf3;},_0x3a70c5[_0x5e4c41('0x102','u&v9')]=_0x5e4c41('0x103','7D7H'),_0x3a70c5[_0x5e4c41('0x104','LBwX')]=_0x5e4c41('0x105','g^(('),_0x3a70c5[_0x5e4c41('0x106','wUHX')]=_0x5e4c41('0x107','I3OV'),_0x3a70c5[_0x5e4c41('0x108','g^((')]=_0x5e4c41('0x109','jcmD'),_0x3a70c5[_0x5e4c41('0x10a','2NkB')]=_0x5e4c41('0x10b','f]3I');const _0x4c8367=_0x3a70c5;return new Promise(_0x17a5e1=>{const _0x564359=fuck_0x552b,_0x1cd72e={'XntCG':function(_0x42011d){return _0x42011d();}};if(_0x4c8367[_0x564359('0x10c','t5Pz')](_0x4c8367[_0x564359('0x10d','s(Jc')],_0x564359('0x10e','%tIa')))return _0x205dff;else{const _0x230330={};_0x230330[_0x564359('0x10f','GEsl')]=0x18,_0x230330[_0x564359('0x110','^ip#')]=0x1,_0x230330[_0x564359('0x111','63HU')]=_0x4c8367[_0x564359('0x112','BZGW')],_0x230330[_0x564359('0x113','*6Gg')]='0',_0x230330[_0x564359('0x114','8c$R')]='0';const _0x8dc76c={};_0x8dc76c[_0x564359('0x115','sTN#')]=_0x4c8367[_0x564359('0x116','GEsl')],_0x8dc76c[_0x564359('0x117','*6Gg')]=_0x564359('0x118','LBwX'),_0x8dc76c[_0x564359('0x119','doeF')]=_0x564359('0x11a','7D7H'),_0x8dc76c[_0x564359('0x11b','whAt')]=cookie,_0x8dc76c[_0x564359('0x11c','rQsa')]=_0x564359('0x11d','%tIa'),_0x8dc76c[_0x564359('0x11e','0%Z*')]=_0x564359('0x11f','BZGW'),_0x8dc76c[_0x564359('0x120','*6Gg')]=$['UA'],_0x8dc76c[_0x564359('0x121','5RXo')]=_0x4c8367[_0x564359('0x122',')Jot')];const _0x43c23d={'url':_0x564359('0x123','^ip#'),'body':_0x564359('0x124','jcmD')+encodeURIComponent(JSON[_0x564359('0x60','s(Jc')](_0x230330))+_0x564359('0x125','g^(('),'headers':_0x8dc76c,'timeout':0x2710};$[_0x564359('0xdc','eBQN')](_0x43c23d,(_0x3cf753,_0xa04c03,_0x474b39)=>{const _0x87cc08=fuck_0x552b,_0x1be844={'VGthU':function(_0x35a023){return _0x35a023();}};if(_0x87cc08('0x126','TT%l')!==_0x87cc08('0x127','H$*u'))try{_0x3cf753?_0x4c8367[_0x87cc08('0x128','AEcY')](_0x4c8367[_0x87cc08('0x129','jcmD')],_0x4c8367[_0x87cc08('0x12a','NEdR')])?(!llgeterror&&(console[_0x87cc08('0x12b','LBwX')](_0x87cc08('0x12c','6@5S')),console[_0x87cc08('0x12d','*B[W')](JSON[_0x87cc08('0x12e','NEdR')](_0x3cf753))),llgeterror=!![]):_0x1cd72e[_0x87cc08('0x12f','5RXo')](_0x5bc300):(llgeterror=![],safeGet(_0x474b39)&&($[_0x87cc08('0x130','g#AS')]=JSON[_0x87cc08('0x131','RLy3')](_0x474b39),$[_0x87cc08('0x132','moY1')][_0x87cc08('0x133','Iw@g')]&&($[_0x87cc08('0x134','moY1')]=$[_0x87cc08('0x135','g^((')][_0x87cc08('0x136','GEsl')][_0x87cc08('0x137','63HU')],$[_0x87cc08('0x138','s(Jc')]=$[_0x87cc08('0x139','s(Jc')][_0x87cc08('0x13a','wUHX')][_0x87cc08('0x13b','TT%l')],$[_0x87cc08('0x13c','g^((')]=$[_0x87cc08('0x13d','0%Z*')][_0x87cc08('0x13e','7D7H')][_0x87cc08('0x13f','BZGW')],$[_0x87cc08('0x140','bhKB')]=$[_0x87cc08('0x141','wUHX')][_0x87cc08('0x13a','wUHX')][_0x87cc08('0x142','JV%z')])));}catch(_0x4341be){$[_0x87cc08('0xff','moY1')](_0x4341be,_0xa04c03);}finally{_0x87cc08('0x143','sTN#')===_0x87cc08('0x144','PEG$')?_0x17a5e1():_0x1be844[_0x87cc08('0x145','rQsa')](_0x46ffe8);}else _0x9295cd?(_0x31e258[_0x87cc08('0x146','u0A6')](''+_0xde3c4e[_0x87cc08('0x147','Ej(N')](_0x8e522)),_0x2006d5[_0x87cc08('0x148','whAt')](_0x87cc08('0x149','eBQN'))):(_0x5c86a5[_0x87cc08('0x14a','NEdR')]=_0x19cbbc[_0x87cc08('0x14b','63HU')](/"score":(\d+)/)?_0x337a9f[_0x87cc08('0x14c','wgf5')](/"score":(\d+)/)[0x11+-0x17ab+0x179b]:0x1a1b+-0x7bb*-0x3+0x5*-0x9dc,_0x434cbb[_0x87cc08('0x14d','wUHX')]=_0x168b71[_0x87cc08('0x14e','myaP')](/"currentBeanNum":(\d+)/)?_0x130515[_0x87cc08('0x14f','TT%l')](/"currentBeanNum":(\d+)/)[-0x8c2+-0x26b2+-0x1*-0x2f75]:-0x1a*-0x11a+0x1e93+0x3b37*-0x1,_0x2cd104[_0x87cc08('0x150','wUHX')]=_0xcbf3d1[_0x87cc08('0x151','f]3I')](/"showName":"(.*?)"/)?_0x1d89d8[_0x87cc08('0x152','PEG$')](/"showName":"(.*?)"/)[-0x1*-0x469+0xc76+-0x10de]:_0x5af2fe[_0x87cc08('0x153','n[jV')]);});}});}async function fruitnew(_0x41a5f9=-0x26d*-0x9+0x5*-0x43b+0x146){const _0x5200df=fuck_0x552b,_0x15c544={'vXMyJ':_0x5200df('0x154','eBQN'),'banhS':function(_0xdb0eb5,_0xb09477){return _0xdb0eb5!==_0xb09477;},'HtExa':function(_0x5b66e7,_0x1ed394){return _0x5b66e7(_0x1ed394);},'QRiSW':function(_0x3d0c2f,_0x5319af){return _0x3d0c2f===_0x5319af;},'oYUEX':_0x5200df('0x155','GEsl'),'AMjGn':_0x5200df('0x156','eBQN'),'JiQOX':_0x5200df('0x157','sTN#'),'cOKcZ':_0x5200df('0x158','n[jV'),'fDvOs':_0x5200df('0x159','PEG$'),'wDHEy':_0x5200df('0x15a','sTN#')},_0x37512d={};_0x37512d[_0x5200df('0x15b','moY1')]=0x1;let _0x32b38c=_0x37512d,_0x4d2f98={'appId':_0x15c544[_0x5200df('0x15c','8c$R')],'fn':_0x5200df('0x15d','f]3I'),'body':_0x32b38c,'apid':_0x15c544[_0x5200df('0x15e','moY1')],'ver':$['UA'][_0x5200df('0x15f','Ej(N')](';')[0x34a*0x1+0x150d*0x1+0x1*-0x1855],'cl':_0x15c544[_0x5200df('0x160','%tIa')],'user':$[_0x5200df('0x161','sTN#')],'code':0x1,'ua':$['UA']};_0x32b38c=await fuck_0x5ceaab[_0x5200df('0x162','wUHX')](_0x4d2f98);const _0x28f923={};_0x28f923[_0x5200df('0x163','BZGW')]=_0x5200df('0x164','%tIa'),_0x28f923[_0x5200df('0x165','63HU')]=_0x15c544[_0x5200df('0x166','whAt')],_0x28f923[_0x5200df('0x167','bhKB')]=_0x5200df('0x168','GEsl'),_0x28f923[_0x5200df('0x169','NEdR')]=_0x15c544[_0x5200df('0x16a','RMv3')],_0x28f923[_0x5200df('0x16b','sTN#')]=$['UA'],_0x28f923[_0x5200df('0x16c','%tIa')]=_0x15c544[_0x5200df('0x16d','rQsa')],_0x28f923[_0x5200df('0x16e','t5Pz')]=_0x5200df('0x16f','rQsa'),_0x28f923[_0x5200df('0x170','^ip#')]=cookie;const _0x4ccc06={};_0x4ccc06[_0x5200df('0x171','g#AS')]=JD_API_HOST+'?'+_0x32b38c,_0x4ccc06[_0x5200df('0x172','f]3I')]=_0x28f923,_0x4ccc06[_0x5200df('0x173','TT%l')]=0x7530;let _0x5082c1=_0x4ccc06;return new Promise(_0x1508f9=>{setTimeout(()=>{const _0x3a0055=fuck_0x552b,_0x188db2={'MubDJ':_0x3a0055('0x174','RLy3'),'WSzkN':_0x15c544[_0x3a0055('0x175','JV%z')],'vWQci':function(_0x439601,_0x1195e1){const _0x278908=fuck_0x552b;return _0x15c544[_0x278908('0x176','rQsa')](_0x439601,_0x1195e1);},'Iqxnd':_0x3a0055('0x177','AEcY'),'eQtwG':function(_0x54143a,_0x12052a){return _0x54143a===_0x12052a;},'qTRKn':_0x3a0055('0x178','g#AS'),'ypwGL':function(_0x1ae407,_0x4ff506){const _0x340105=fuck_0x552b;return _0x15c544[_0x340105('0x179','Iw@g')](_0x1ae407,_0x4ff506);}};_0x15c544[_0x3a0055('0x17a','u&v9')](_0x3a0055('0x17b','moY1'),_0x3a0055('0x17c','Ej(N'))?_0x373c26():$[_0x3a0055('0x17d',')Jot')](_0x5082c1,(_0x4b1116,_0x2bcddf,_0x4ac04b)=>{const _0x55a971=fuck_0x552b,_0x3804fb={};_0x3804fb[_0x55a971('0x17e','g#AS')]=_0x188db2[_0x55a971('0x17f','u&v9')];const _0x552745=_0x3804fb;if(_0x188db2[_0x55a971('0x180','I3OV')]!==_0x55a971('0x181','u0A6'))try{if(_0x55a971('0x182','JV%z')===_0x55a971('0x183','*6Gg'))_0x2adcb9?(_0x399a61[_0x55a971('0x184',')Jot')](_0x55a971('0x185','whAt')),_0x1681b5[_0x55a971('0x186','8c$R')](_0x1c2ea8)):(_0x3980c8=_0x26898a[_0x55a971('0x187','I3OV')](_0x1dcee8),_0x11a8c1[_0x55a971('0x188','JV%z')]=_0x1e8f11[_0x55a971('0x189','LBwX')]?.[_0x55a971('0x18a','wgf5')]||'');else{if(_0x4b1116){if(_0x188db2[_0x55a971('0x18b','8c$R')](_0x188db2[_0x55a971('0x18c','u&v9')],_0x188db2[_0x55a971('0x18d','NEdR')])){_0x5e0193[_0x55a971('0x18e','sTN#')]=![];return;}else console[_0x55a971('0x18f','63HU')](_0x55a971('0x190','n[jV')),$[_0x55a971('0x191','%tIa')](_0x4b1116);}else _0x4ac04b=JSON[_0x55a971('0x192','eBQN')](_0x4ac04b),$[_0x55a971('0x193','Ej(N')]=_0x4ac04b[_0x55a971('0x194','Ej(N')]?.[_0x55a971('0x195','JV%z')]||'';}}catch(_0x171047){$[_0x55a971('0x196','5RXo')](_0x171047,_0x2bcddf);}finally{if(_0x188db2[_0x55a971('0x197','Iw@g')](_0x55a971('0x198','wgf5'),_0x188db2[_0x55a971('0x199','%tIa')])){const _0x1b9f78={'fqkYe':OQkhQc[_0x55a971('0x19a','*6Gg')],'YavIh':function(_0x304f44,_0x1771fb){return _0x304f44(_0x1771fb);},'Vartf':function(_0x2d90c3,_0x43fe50){return _0x2d90c3+_0x43fe50;},'atNVp':_0x55a971('0x19b','f]3I')};_0x4f54be(this,function(){const _0x59ad6a=fuck_0x552b,_0x982b4=new _0x4b69ca(_0x1b9f78[_0x59ad6a('0x19c','g#AS')]),_0x2ebccd=new _0x7cc128(_0x59ad6a('0x19d','AEcY'),'i'),_0xc33f6b=_0x1b9f78[_0x59ad6a('0x19e','bhKB')](_0x24b727,_0x59ad6a('0x19f','PEG$'));!_0x982b4[_0x59ad6a('0x1a0','GEsl')](_0xc33f6b+_0x59ad6a('0x1a1','wgf5'))||!_0x2ebccd[_0x59ad6a('0x1a2','jcmD')](_0x1b9f78[_0x59ad6a('0x1a3','NEdR')](_0xc33f6b,_0x1b9f78[_0x59ad6a('0x1a4','Iw@g')]))?_0x1b9f78[_0x59ad6a('0x1a5','t5Pz')](_0xc33f6b,'0'):_0x384858();})();}else _0x188db2[_0x55a971('0x1a6','whAt')](_0x1508f9,_0x4ac04b);}else{const _0x295c3f=_0x28820f?function(){const _0xa6a45d=fuck_0x552b;if(_0x5cd8b3){const _0x3635e0=_0x236c71[_0xa6a45d('0x1a7','*6Gg')](_0x1a6134,arguments);return _0x463054=null,_0x3635e0;}}:function(){};return _0x3e35fa=![],_0x295c3f;}});},_0x41a5f9);});}async function checkplus(){const _0x52d9d0=fuck_0x552b,_0x25a850={'dguln':_0x52d9d0('0x1a8','rQsa'),'YyqDl':_0x52d9d0('0x1a9','wUHX'),'ojRjS':_0x52d9d0('0x1aa','^ip#'),'AHlTc':function(_0xbcc3e,_0x38a433){return _0xbcc3e==_0x38a433;},'Zmnsh':_0x52d9d0('0x1ab','8c$R'),'BtdyT':function(_0x4c226b){return _0x4c226b();},'IcvAC':_0x52d9d0('0x1ac','63HU'),'GmVzT':_0x52d9d0('0x1ad','Qwiu'),'BfXol':_0x52d9d0('0x1ae','zfhx'),'JGyWS':_0x52d9d0('0x1af','zfhx'),'WZdnY':_0x52d9d0('0x1b0','7D7H'),'seyqr':_0x52d9d0('0x1b1',']K([')},_0x363af0={};_0x363af0[_0x52d9d0('0x1b2','tsWz')]=_0x25a850[_0x52d9d0('0x1b3','BZGW')],_0x363af0[_0x52d9d0('0x1b4','PEG$')]=_0x25a850[_0x52d9d0('0x1b5','sTN#')],_0x363af0[_0x52d9d0('0x1b6','doeF')]=0x1;let _0x4ac8f1=_0x363af0;const _0x1d9d53={};_0x1d9d53[_0x52d9d0('0x1b7','moY1')]=_0x25a850[_0x52d9d0('0x1b8','wgf5')],_0x1d9d53['fn']=_0x52d9d0('0x1b9','rQsa'),_0x1d9d53[_0x52d9d0('0x1ba','6@5S')]=_0x4ac8f1,_0x1d9d53[_0x52d9d0('0x1bb','Ej(N')]=_0x25a850[_0x52d9d0('0x1bc','BZGW')],_0x1d9d53[_0x52d9d0('0x1bd','f]3I')]=$[_0x52d9d0('0x161','sTN#')],_0x1d9d53[_0x52d9d0('0x1be','JV%z')]=0x1,_0x1d9d53['ua']=$['UA'];let _0x281f9b=_0x1d9d53;_0x4ac8f1=await fuck_0xcfc431[_0x52d9d0('0x1bf','OS&t')](_0x281f9b);const _0x598135={};_0x598135[_0x52d9d0('0x1c0','bhKB')]=$['UA'],_0x598135[_0x52d9d0('0x1c1',']K([')]=cookie,_0x598135[_0x52d9d0('0x167','bhKB')]=_0x25a850[_0x52d9d0('0x1c2','TT%l')],_0x598135[_0x52d9d0('0x1c3','s(Jc')]=_0x25a850[_0x52d9d0('0x1c4','NEdR')];const _0x3c7e7a={};_0x3c7e7a[_0x52d9d0('0x1c5','Qwiu')]=_0x52d9d0('0x1c6','BZGW'),_0x3c7e7a[_0x52d9d0('0x1c7','bhKB')]=_0x4ac8f1,_0x3c7e7a[_0x52d9d0('0x1c8','bhKB')]=_0x598135;let _0x32f794=_0x3c7e7a;return new Promise(async _0x35247c=>{const _0x48933e=fuck_0x552b;$[_0x48933e('0xa1','H$*u')](_0x32f794,async(_0x2f6dfc,_0x468873,_0x1c13d3)=>{const _0x5f5a21=fuck_0x552b,_0x14e2f9={};_0x14e2f9[_0x5f5a21('0x1c9','myaP')]=_0x25a850[_0x5f5a21('0x1ca','%tIa')];const _0xd98eeb=_0x14e2f9;if(_0x25a850[_0x5f5a21('0x1cb','JV%z')]!==_0x25a850[_0x5f5a21('0x1cc','sTN#')])try{if(_0x5f5a21('0x1cd','AEcY')!==_0x5f5a21('0x1ce',')Jot')){if(_0x2f6dfc)console[_0x5f5a21('0x1cf','PEG$')](''+JSON[_0x5f5a21('0x1d0','bhKB')](_0x2f6dfc)),console[_0x5f5a21('0x1d1','f]3I')](_0x5f5a21('0x1d2',']K(['));else{_0x1c13d3=JSON[_0x5f5a21('0xf4','t5Pz')](_0x1c13d3);if(_0x25a850[_0x5f5a21('0x1d3','BZGW')](_0x1c13d3[_0x5f5a21('0x1d4','PEG$')],-0x3c699*-0x8+-0x298e9d+0x25756d))_0x5f5a21('0x1d5','zfhx')!==_0x25a850[_0x5f5a21('0x1d6','moY1')]?$[_0x5f5a21('0x1d7','zfhx')]=_0x1c13d3['rs'][_0x5f5a21('0x1d8','0%Z*')][_0x5f5a21('0x1d9','6@5S')]?!![]:![]:(_0x52b997[_0x5f5a21('0x12b','LBwX')](''+_0x1941e9[_0x5f5a21('0x1da','u&v9')](_0x27e208)),_0x4676d2[_0x5f5a21('0x1db','NEdR')](_0x5f5a21('0x1dc','RLy3')));else{}}}else(function(){return![];}[_0x5f5a21('0x1dd','8c$R')](_0x5f5a21('0x1de','6@5S')+MHKhrF[_0x5f5a21('0x1df','TT%l')])[_0x5f5a21('0x1e0','tsWz')](_0x5f5a21('0x1e1','AEcY')));}catch(_0x9b8863){$[_0x5f5a21('0x1e2','BZGW')](_0x9b8863,_0x468873);}finally{_0x25a850[_0x5f5a21('0x1e3','rQsa')](_0x35247c);}else _0x4c5944('0');});});}function fuck_0x258a51(_0x1738ec){const _0x30995a=fuck_0x552b,_0x266c21={'qhGoI':function(_0x15280d){return _0x15280d();},'NXozB':function(_0x2b6d2a,_0x49d493){return _0x2b6d2a!==_0x49d493;},'ICPvv':_0x30995a('0x1e4','t5Pz'),'eWAvI':function(_0x424c31,_0x412a4b){return _0x424c31===_0x412a4b;},'cGjIp':_0x30995a('0x1e5','n[jV'),'edsVQ':_0x30995a('0x1e6','7D7H'),'yzsta':_0x30995a('0x1e7','g#AS'),'LNWAJ':_0x30995a('0x1e8','*B[W'),'VzuZC':function(_0x1a611c,_0x4b44e4){return _0x1a611c+_0x4b44e4;},'SHwIs':function(_0x26663a,_0x2f6a61){return _0x26663a/_0x2f6a61;},'eGaGC':_0x30995a('0x1e9','zfhx'),'CMFXC':function(_0x5a21aa,_0x4588c1){return _0x5a21aa===_0x4588c1;},'DnwaJ':function(_0x23d909,_0x264b81){return _0x23d909+_0x264b81;},'yOLaA':_0x30995a('0x1ea','*6Gg'),'pKLBt':_0x30995a('0x1eb','GEsl'),'bdwet':_0x30995a('0x1ec','Qwiu')};function _0x3f6fc5(_0x30dd40){const _0x303df1=fuck_0x552b;if(_0x266c21[_0x303df1('0x1ed','^ip#')](_0x266c21[_0x303df1('0x1ee','*B[W')],_0x303df1('0x1ef','zfhx')))_0x266c21[_0x303df1('0x1f0','wUHX')](_0x4364c2);else{if(_0x266c21[_0x303df1('0x1f1','8c$R')](typeof _0x30dd40,_0x266c21[_0x303df1('0x1f2','g^((')]))return function(_0x2ea851){}[_0x303df1('0x1f3','bhKB')](_0x266c21[_0x303df1('0x1f4','PEG$')])[_0x303df1('0x1f5','Ej(N')](_0x266c21[_0x303df1('0x1f6','u0A6')]);else{if(_0x266c21[_0x303df1('0x1f7','%tIa')]===_0x303df1('0x1f8','5RXo'))_0x81c3bb[_0x303df1('0x1f9','Iw@g')]=_0x32564f[_0x303df1('0x1fa','2NkB')](/"score":(\d+)/)?_0x2811b8[_0x303df1('0x1fb','rQsa')](/"score":(\d+)/)[-0x85*0x2f+0x3*-0x10f+0x1d7*0xf]:-0x2199+0x36b*0xa+0x1*-0x95,_0x3baf66[_0x303df1('0x1fc','5RXo')]=_0xe6c4ae[_0x303df1('0x1fd','AEcY')](/"currentBeanNum":(\d+)/)?_0x30e39e[_0x303df1('0xb3','g^((')](/"currentBeanNum":(\d+)/)[0x1*-0x238+-0x150b*-0x1+-0x6*0x323]:0x1b2a+0x1bed+0x61f*-0x9,_0x60797d[_0x303df1('0x1fe','63HU')]=_0xb44be[_0x303df1('0x1ff','whAt')](/"showName":"(.*?)"/)?_0x4bcdb6[_0x303df1('0x14b','63HU')](/"showName":"(.*?)"/)[0x1*-0x2538+-0x1079*0x1+-0x1da*-0x1d]:_0x3958a4[_0x303df1('0x200','u0A6')];else{if(_0x266c21[_0x303df1('0x201','%tIa')]('',_0x266c21[_0x303df1('0x202','OS&t')](_0x30dd40,_0x30dd40))[_0x266c21[_0x303df1('0x203','RLy3')]]!==0x7c7+-0x172d+0xf67||_0x266c21[_0x303df1('0x204','I3OV')](_0x30dd40%(-0x1*-0x99b+0x3dd+-0x2*0x6b2),0x1608+-0x7cd+0xe3b*-0x1))(function(){return!![];}[_0x303df1('0x205','g#AS')](_0x266c21[_0x303df1('0x206',']K([')](_0x266c21[_0x303df1('0x207','OS&t')],_0x303df1('0x208','%tIa')))[_0x303df1('0x209','zfhx')](_0x303df1('0x20a','TT%l')));else{if(_0x303df1('0x20b','n[jV')===_0x303df1('0x20b','n[jV'))(function(){return![];}[_0x303df1('0x20c','LBwX')](_0x303df1('0x20d','7D7H')+_0x266c21[_0x303df1('0x20e','*6Gg')])[_0x303df1('0x20f','g#AS')](_0x303df1('0x210','BZGW')));else{if(_0x3d1a57){const _0x558b44=_0x323ba2[_0x303df1('0x211','*B[W')](_0x5c7b65,arguments);return _0x691e12=null,_0x558b44;}}}}}_0x3f6fc5(++_0x30dd40);}}try{if(_0x30995a('0x212','g^((')!==_0x266c21[_0x30995a('0x213','8c$R')]){if(_0x1738ec)return _0x3f6fc5;else _0x3f6fc5(0xbf3+0x5*-0x75+0x1*-0x9aa);}else _0x566513[_0x30995a('0x214','AEcY')](_0x515639,_0x593a69);}catch(_0x66dbd2){}}
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