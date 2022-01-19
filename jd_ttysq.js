/*
#天天压岁钱
45 0,16 * * * jd_ttysq.js
 */
const $ = new Env('京喜天天压岁钱');
//Node.js用户请在jdCookie.js处填写京东ck;
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
//IOS等用户直接用NobyDa的jd cookie
let cookiesArr = [],
    cookie = '',
    secretp = '',
    joyToken = "",
    UA = `jdpingou;iPhone;4.13.0;14.4.2;${randomString(40)};network/wifi;model/iPhone10,2;appBuild/100609;supportApplePay/1;hasUPPay/0;pushNoticeIsOpen/1;hasOCPay/0;supportBestPay/0;session/${Math.random * 98 + 1};pap/JA2019_3111789;brand/apple;supportJDSHWK/1;Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148`
$.shareCoseList = []
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {};
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

const JD_API_HOST = `https://m.jingxi.com`;
!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        return;
    }
    //await getToken();
    cookiesArr = cookiesArr.map(ck => ck + `joyytoken=50084${joyToken};`)
    $.CryptoJS = $.isNode() ? require('crypto-js') : CryptoJS
    //做任务
    //console.log(`\n优先内部，剩余助力作者！！\n`)
    for (let i = 0; i < cookiesArr.length; i++) {
        cookie = cookiesArr[i];
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
                continue
            }
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            //做任务
            await main()
            if (i != cookiesArr.length - 1) {
                await $.wait(3000)
            }
        }
    }
    //let res = await getAuthorShareCode('https://cdn.jsdelivr.net/gh/6dylan6/updateTeam@main/shareCodes/ttysq.json')
    //if (res) {
    //    authorCode = res.sort(() => 0.5 - Math.random())
    //    if (authorCode.length > 3) {
    //        authorCode = authorCode.splice(0, 3)
    //    }
    //    authorCode = authorCode.map(entity => {
    //        return {
    //            "user": "author",
    //            "code": entity.code,
    //            "redId": entity.rpids[Math.floor((Math.random() * entity.rpids.length))],
    //            "beHelp": 0,
    //            "helpId": $.taskId
    //        }
    //    })
    //    $.shareCoseList = [...$.shareCoseList, ...authorCode]
    //}
    console.log(`要助力的助理码${JSON.stringify($.shareCoseList.length)}个\n`)
    //助力任务
    for (let i = 0; i < cookiesArr.length; i++) {
        $.canHelp = true
        cookie = cookiesArr[i];
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
                continue
            }
            if ($.shareCoseList.length >= 1) {
                for (let y = 0; y < $.shareCoseList.length; y++) {
                    if ($.shareCoseList[y].user === $.UserName) {
                        console.log(`不能助力自己，跳过\n`)
                    } else if ($.shareCoseList[y].beHelp === false) {
                        //console.log(`助力已满，跳过\n`)
                    } else {
                        console.log(`\n京东账号${$.index} ${$.nickName || $.UserName}去助力${$.shareCoseList[y].user}助力码${$.shareCoseList[y].code}`)
                        console.log(`助力任务`)
                        await task(`jxnhj/DoTask`, `taskId=${$.taskId}&strShareId=${$.shareCoseList[y].code}&bizCode=jxnhj_task&configExtra=`);
                        if ($.max === true){$.shareCoseList[y].beHelp = false}
                        await $.wait(3000);
                        if ($.canHelp === false) { break }
                    }
                }
            }
        }
    };
    //助力红包
    for (let i = 0; i < cookiesArr.length; i++) {
        $.doHelpTimes = 0
        $.canHelp = true
        cookie = cookiesArr[i];
        if (cookie) {
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
                continue
            }
            if ($.shareCoseList.length >= 1) {
                for (let y = 0; y < $.shareCoseList.length && $.doHelpTimes < 7; y++) {
                    //$.goHelp = false
                    if ($.shareCoseList[y].user === $.UserName) {
                        console.log(`不能助力自己，跳过\n`)
                    } else if ($.shareCoseList[y].beHelp === 7) {
                        //console.log(`助力已满，跳过\n`)
                    } else {
                        console.log(`\n京东账号${$.index} ${$.nickName || $.UserName}去助力${$.shareCoseList[y].user}助力码${$.shareCoseList[y].code}`)
                        console.log(`助力红包，Id: ${$.shareCoseList[y].redId}`)
                        await task(`jxnhj/BestWishes`, `shareId=${$.shareCoseList[y].code}&id=${$.shareCoseList[y].redId}`);
                        if ($.goHelp === true) {
                            await $.wait(1000)
                            await task(`jxnhj/WishHelp`, `id=${$.shareCoseList[y].redId}&shareId=${$.shareCoseList[y].code}`);
                            $.doHelpTimes += 1;
                            $.shareCoseList[y].beHelp += 1;
                        }
                        if ($.canHelp === false) { break }
                        await $.wait(3000);
                    }
                }
            }
        }
    };
    if ($.message) await notify.sendNotify(`${$.name}`, `${message}\n`);
})()
.catch((e) => $.logErr(e))
.finally(() => $.done())

function getAuthorShareCode(url) {
    return new Promise(async resolve => {
        const options = {
            url: `${url}?${new Date()}`,
            "timeout": 10000,
            headers: {
                "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/87.0.4280.88"
            }
        };
        $.get(options, async (err, resp, data) => {
            try {
                resolve(JSON.parse(data))
            } catch (e) {
                // $.logErr(e, resp)
            } finally {
                resolve();
            }
        })
        await $.wait(10000)
        resolve();
    })
}

function randomString(e) {
  e = e || 32;
  let t = "0123456789abcdef", a = t.length, n = "";
  for (let i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}

async function main() {
    try {
        await task(`jxnhj/GetUserInfo`, `strInviteId=&nopopup=0`, show = true)
        await $.wait(1500)
        await task(`jxnhj/BestWishes`)
        await $.wait(1500)
        await task(`jxnhj/GetTaskList`)
        await $.wait(1500)
        if (!$.allTaskList) {
            console.log(`获取任务列表失败`)
        } else {
            for (let i = 0; i < $.allTaskList.length; i++) {
                $.oneTask = $.allTaskList[i];
                if ([2, 14].includes($.oneTask.taskType) && $.oneTask.status === 1 && $.oneTask.awardStatus === 2) {
                    $.taskId = $.oneTask.taskId;
                    $.taskName = $.oneTask.taskName
                    console.log(`去做${$.taskName}`)
                    await task(`jxnhj/DoTask`, `taskId=${$.taskId}&strShareId=&bizCode=jxnhj_task&configExtra=`)
                    console.log(`等待5秒`)
                    await $.wait(5100)
                    await task(`newtasksys/newtasksys_front/Award`, `taskId=${$.taskId}&bizCode=jxnhj_task&source=jxnhj_task`)
                }
                if ([4].includes($.oneTask.taskType)) {
                    $.taskId = $.oneTask.taskId;
                    $.shareCoseList.push({
                        "user": $.UserName,
                        "code": $.shareId,
                        "redId": $.redId,
                        "beHelp": 0,
                        "helpId": $.taskId
                    })
                }
            }
        }
        await task(`jxnhj/GetUserInfo`, `strInviteId=&nopopup=0`, show = false)
        if ($.lotteryNum >= 1) {
            for (let w = 0; w < $.lotteryNum; w++) {
                console.log(`可以抽奖${$.lotteryNum}次 ==>>第${w+1}次抽奖`)
                await task(`jxnhj/GreetUpgrade`)
                await $.wait(1000)
            }
        }
    } catch (e) {
        $.logErr(e)
    }

}


function task(function_name, body, show = false) {
    return new Promise((resolve) => {
        $.get(taskUrl(function_name, body), (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} ${function_name} API请求失败，请检查网路重试`)
                } else {
                    data = JSON.parse(data);
                    if (function_name === "jxnhj/GetUserInfo") {
                        if (data.iRet === 0) {
                            $.goodsNum = data.myInfo.goodsNum; //年货
                            $.level = data.myInfo.level; //等级
                            $.levelCost = data.myInfo.levelCost //每次消耗年货
                            $.luckyNum = data.myInfo.luckyNum //红包份数
                            $.luckyWorth = data.myInfo.luckyWorth //预计分的红包金额
                            $.shareId = data.myInfo.shareId //助力码
                            $.lotteryNum = Math.floor($.goodsNum / $.levelCost) //消耗年货升等级次数
                            if (show === true) {
                                console.log(`现在等级${$.level},年货值有${$.goodsNum},有${$.luckyNum}份红包，预计分的${$.luckyWorth}元,可抽奖次数${$.lotteryNum}`)
                                console.log(`助力码：${$.shareId}\n`)
                            }
                        } else {
                            console.log(`${function_name}：${JSON.stringify(data)}`)
                        }
                    } else if (function_name === "jxnhj/BestWishes") {
                        //console.log(JSON.stringify(data))
                        if (data.iRet === 0 && data.sErrMsg === "ok") {
                            if (data.data.toast.indexOf("助力失败") === -1) {
                                $.goHelp = true;
                            } else {
                                $.goHelp = false
                                $.canHelp = false
                                console.log(`${data.data.toast}\n`)
                            }
                            $.allPagesList = data.data.pages
                            for (let q = $.allPagesList.length - 1; q !== 0; q--) {
                                if ($.allPagesList[q].status === 1) {
                                    $.redId = $.allPagesList[q].id
                                    //console.log($.redId)
                                    break
                                }
                            }
                        } else {
                            console.log(`${function_name}：${JSON.stringify(data)}`)
                        }
                        //任务列表
                    } else if (function_name === "jxnhj/GetTaskList") {
                        //console.log(JSON.stringify(data))
                        if (data.sErrMsg === "ok") {
                            $.allTaskList = data.data.taskList
                        } else {
                            console.log(`${function_name}：${JSON.stringify(data)}`)
                        }
                        //做任务
                    } else if (function_name === "jxnhj/DoTask") {
                        //console.log(JSON.stringify(data))
                        if (data.iRet === 0 && data.data.prizeInfo.length === 0) {
                            console.log(`领取任务`)
                            //console.log(JSON.stringify(data))
                        } else if (data.iRet === 0 && data.data.prizeInfo.length > 0) {
                            console.log(`助力成功获得：${data.data.prizeInfo[0].prizeName}元红包\n`)
                        } else if (data.iRet === 1009) {
                            console.log(`${data.iRet},${data.sErrMsg}\n`)
                            $.max = true
                        } else if (data.iRet === 4001) {
                            console.log(`${data.iRet},${data.sErrMsg}\n`)
                            $.canHelp = false
                        } else if (data.iRet === 4007) {
                            console.log(`${data.iRet},${data.sErrMsg}\n`)
                            $.canHelp = false
                        } else {
                            console.log(`${function_name}：${JSON.stringify(data)}`)
                        }
                        //任务奖励
                    } else if (function_name === "newtasksys/newtasksys_front/Award") {
                        //console.log(JSON.stringify(data))
                        if (data.ret === 0) {
                            console.log(`任务完成${JSON.parse(data.data.prizeInfo).ddwAward}年货\n`)
                        } else {
                            console.log(`${function_name}：${JSON.stringify(data)}`)
                        }
                        //助力红包
                    } else if (function_name === "jxnhj/WishHelp") {
                        //console.log(JSON.stringify(data))
                        if (data.iRet === 0 && data.sErrMsg === "ok") {
                            if (data.data.prizeName.indexOf("元") === -1) {
                                console.log(`助力成功获得空气\n`)
                            } else {
                                console.log(`助力成功获得${data.data.prizeName}红包\n`)
                            }
                        } else {
                            console.log(`${function_name}：${JSON.stringify(data)}`)
                        }
                    } else if (function_name === "jxnhj/GreetUpgrade") {
                        //console.log(JSON.stringify(data))
                        if (data.iRet === 0 && data.sErrMsg === "ok") {
                            console.log(`抽奖获得${data.prizeInfo[0].prizeName}红包\n`)
                        } else if (data.iRet === 4003) {
                            console.log(`${data.popup.title}\n`)
                        } else {
                            console.log(`${function_name}：${JSON.stringify(data)}`)
                        }
                    } else {
                        console.log(`无类型判断${JSON.stringify(data)}\n`);
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



function getToken(timeout = 0) {
    return new Promise((resolve) => {
        setTimeout(() => {
            let url = {
                url: `https://bh.m.jd.com/gettoken`,
                headers: {
                    'Content-Type': `text/plain;charset=UTF-8`
                },
                body: `content={"appname":"50084","whwswswws":"","jdkey":"","body":{"platform":"1"}}`
            }
            $.post(url, async (err, resp, data) => {
                try {
                    data = JSON.parse(data);
                    joyToken = data.joyytoken;
                    console.log(`joyToken = ${data.joyytoken}`)
                } catch (e) {
                    $.logErr(e, resp);
                } finally {
                    resolve()
                }
            })
        }, timeout)
    })
}

function taskUrl(function_path, body = '', dwEnv = 7) {
    let url = `${JD_API_HOST}/${function_path}?__t=${Date.now()}&dwEnv=${dwEnv}&${body}&_stk=__t%2CbizCode%2CconfigExtra%2CdwEnv%2CstrShareId%2CtaskId&_ste=1`;
    url += `&h5st=${Date.now(), '', '', url}&_=${Date.now() + 2}&sceneval=2&g_login_type=1&g_ty=ajax`;
    return {
        url,
        headers: {
            Cookie: cookie,
            Accept: "application/json",
            Connection: "keep-alive",
            Referer: "https://st.jingxi.com/promote/2022/spring2022/index.html?ptag=139419.6.28&sceneval=2",
            "Accept-Encoding": "gzip, deflate, br",
            "origin": "https://st.jingxi.com",
            "User-Agent": UA,
            "Accept-Language": "zh-cn",
        },
        timeout: 10000
    };
};

function taskPostUrl(functionId, body = {}) {
    return {
        url: `${JD_API_HOST}?functionId=${functionId}`,
        body: `functionId=${functionId}&body=${JSON.stringify(body)}&_t=${Date.now()}&appid=activities_platform&client=wh5&clientVersion=1.0.0`,
        headers: {
            'User-Agent': UA,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Host': 'api.m.jd.com',
            'Cookie': cookie,
            'Origin': 'https://pro.m.jd.com',
            'Referer': 'https://pro.m.jd.com/mall/active/j8U2SMhmw3aKgfWwYQfoRR4idTT/index.html?',
        }
    }
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

function decrypt(time, stk, type, url) {
    stk = stk || (url ? getUrlData(url, '_stk') : '')
    if (stk) {
        const timestamp = new Date(time).Format("yyyyMMddhhmmssSSS");
        let hash1 = '';
        if ($.fingerprint && $.token && $.enCryptMethodJD) {
            hash1 = $.enCryptMethodJD($.token, $.fingerprint.toString(), timestamp.toString(), $.appId.toString(), $.CryptoJS).toString($.CryptoJS.enc.Hex);
        } else {
            const random = '5gkjB6SpmC9s';
            $.token = `tk01wcdf61cb3a8nYUtHcmhSUFFCfddDPRvKvYaMjHkxo6Aj7dhzO+GXGFa9nPXfcgT+mULoF1b1YIS1ghvSlbwhE0Xc`;
            $.fingerprint = 5287160221454703;
            const str = `${$.token}${$.fingerprint}${timestamp}${$.appId}${random}`;
            hash1 = $.CryptoJS.SHA512(str, $.token).toString($.CryptoJS.enc.Hex);
        }
        let st = '';
        stk.split(',').map((item, index) =>{
            st += `${item}:${getUrlData(url, item)}${index === stk.split(',').length -1 ? '' : '&'}`;
        })
        const hash2 = $.CryptoJS.HmacSHA256(st, hash1.toString()).toString($.CryptoJS.enc.Hex);
        // console.log(`\nst:${st}`)
        // console.log(`h5st:${["".concat(timestamp.toString()), "".concat(fingerprint.toString()), "".concat($.appId.toString()), "".concat(token), "".concat(hash2)].join(";")}\n`)
        return encodeURIComponent(["".concat(timestamp.toString()), "".concat($.fingerprint.toString()), "".concat($.appId.toString()), "".concat($.token), "".concat(hash2)].join(";"))
    } else {
        return '20210318144213808;8277529360925161;10001;tk01w952a1b73a8nU0luMGtBanZTHCgj0KFVwDa4n5pJ95T/5bxO/m54p4MtgVEwKNev1u/BUjrpWAUMZPW0Kz2RWP8v;86054c036fe3bf0991bd9a9da1a8d44dd130c6508602215e50bb1e385326779d'
    }
}

function getUrlData(url, name) {
    if (typeof URL !== "undefined") {
        let urls = new URL(url);
        let data = urls.searchParams.get(name);
        return data ? data : '';
    } else {
        const query = url.match(/\?.*/)[0].substring(1)
        const vars = query.split('&')
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=')
            if (pair[0] === name) {
                // return pair[1];
                return vars[i].substr(vars[i].indexOf('=') + 1);
            }
        }
        return ''
    }
}
// prettier-ignore
