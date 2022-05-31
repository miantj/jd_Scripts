/* 
1 1 1 1 * jd_share.js
注意控制ck数量
车头数量OWN_COOKIE_NUM，默认为1
*/
const $ = new Env("分享有礼");
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
const notify = $.isNode() ? require('./sendNotify') : '';
let cookiesArr = [], cookie = '', message = '';
let authorCodeList = [];
let ownCookieNum = 1;
let isGetAuthorCodeList = true
let activityId = ''
let activityShopId = ''

if (process.env.OWN_COOKIE_NUM && process.env.OWN_COOKIE_NUM != 4) {
    ownCookieNum = process.env.OWN_COOKIE_NUM;
}
if (process.env.SHARE_ACTIVITY_ID && process.env.SHARE_ACTIVITY_ID != "") {
    activityId = process.env.SHARE_ACTIVITY_ID;
}

if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
    let cookiesData = $.getdata('CookiesJD') || "[]";
    cookiesData = JSON.parse(cookiesData);
    cookiesArr = cookiesData.map(item => item.cookie);
    cookiesArr.reverse();
    cookiesArr.push(...[$.getdata('CookieJD2'), $.getdata('CookieJD')]);
    cookiesArr.reverse();
    cookiesArr = cookiesArr.filter(item => !!item);
}

!(async () => {
    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
        return;
    }
    isGetAuthorCodeList = true;
    for (let i = 0; i < ownCookieNum; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i]
            originCookie = cookiesArr[i]
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            await checkCookie();
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
                // if ($.isNode()) {
                //     await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                // }
                continue
            }
            
            $.bean = 0;
            $.ADID = getUUID('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 1);
            $.UUID = getUUID('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
            $.authorCode = authorCodeList[random(0, authorCodeList.length)]
            $.authorNum = `${random(1000000, 9999999)}`
            $.activityId = activityId
            $.activityShopId = ''
            $.activityUrl = `https://lzkjdz-isv.isvjcloud.com/wxShareActivity/activity/${$.authorNum}?activityId=${$.activityId}&friendUuid=${encodeURIComponent($.authorCode)}&shareuserid4minipg=null&shopid=${$.activityShopId}`
            await share();
			await $.wait(1000)
            activityShopId = $.venderId;
        }
    }
    isGetAuthorCodeList = false;
    console.log('需要助力的助力码')
    console.log(authorCodeList)
    for (let i = 0; i < cookiesArr.length; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i]
            originCookie = cookiesArr[i]
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
            $.index = i + 1;
            $.isLogin = true;
            $.nickName = '';
            $.errorMessage = ''
            await checkCookie();
            console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
            if (!$.isLogin) {
                $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
                // if ($.isNode()) {
                //     await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
                // }
                continue
            }
            
            $.bean = 0;
            $.ADID = getUUID('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 1);
            $.UUID = getUUID('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
            $.authorCode = authorCodeList[random(0, authorCodeList.length)]
            $.authorNum = `${random(1000000, 9999999)}`
            $.activityId = activityId
            $.activityShopId = activityShopId
            // $.activityUrl = `https://lzkjdz-isv.isvjcloud.com/wxShareActivity/activity/${$.authorNum}?activityId=${$.activityId}&friendUuid=${encodeURIComponent($.authorCode)}&shareuserid4minipg=null&shopid=${$.activityShopId}`
            $.activityUrl = `https://lzkjdz-isv.isvjcloud.com/wxShareActivity/activity/${$.activityId}?activityId=${$.activityId}&adsource=tg_xuanFuTuBiao`
            for(let i in authorCodeList){
                $.authorCode = authorCodeList[i]
                console.log('去助力: '+$.authorCode)
                
                await share();
				await $.wait(1000)
                if ($.errorMessage === '活动太火爆，还是去买买买吧') {
                    break
                }
                //await $.wait(2000)
            }
        }
        //await $.wait(2000)
    }
    for (let i = 0; i < ownCookieNum; i++) {
        if (cookiesArr[i]) {
            cookie = cookiesArr[i]
            originCookie = cookiesArr[i]
            $.UserName = decodeURIComponent(cookie.match(/pt_pin=(.+?);/) && cookie.match(/pt_pin=(.+?);/)[1])
            $.isLogin = true;
            $.nickName = '';
            await checkCookie();
            console.log(`\n*开始【京东账号】${$.nickName || $.UserName} 领取*\n`);
            $.authorCode = authorCodeList[0]
            $.activityId = activityId
            $.activityShopId = activityShopId
            await getPrize();
			await $.wait(2000)
        }
    }
})()
    .catch((e) => {
        $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
    })
    .finally(() => {
        $.done();
    })

async function share() {
    $.token = null;
    $.secretPin = null;
    $.openCardActivityId = null
    await getFirstLZCK()
    await getToken();
    await task('customer/getSimpleActInfoVo', `activityId=${$.activityId}`, 1)
    if ($.token) {
        await getMyPing();
        if ($.secretPin) {
			await $.wait(2000)
            await task('common/accessLogWithAD', `venderId=${$.activityShopId}&code=25&pin=${encodeURIComponent($.secretPin)}&activityId=${$.activityId}&pageUrl=${$.activityUrl}&subType=app&adSource=null`, 1);
            await task('activityContent', `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}&friendUuid=${encodeURIComponent($.authorCode)}`)
        } else {
            $.log("没有成功获取到用户信息")
        }
    } else {
        $.log("没有成功获取到用户鉴权信息")
    }
}

async function getPrize() {
    $.log('那就开始吧。')
    $.token = null;
    $.secretPin = null;
    $.openCardActivityId = null
    await getFirstLZCK()
    await getToken();
    await task('customer/getSimpleActInfoVo', `activityId=${$.activityId}`, 1)
    if ($.token) {
        await getMyPing();
        if ($.secretPin) {
            await task('activityContent', `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}&friendUuid=${encodeURIComponent($.authorCode)}`)
            for(let d in $.drawContentVOs){
                await task('getPrize', `activityId=${$.activityId}&pin=${encodeURIComponent($.secretPin)}&drawInfoId=${$.drawContentVOs[d]['drawInfoId']}`)
            }
        } else {
            $.log("没有成功获取到用户信息")
        }
    } else {
        $.log("没有成功获取到用户鉴权信息")
    }
}

function task(function_id, body, isCommon = 0) {
    return new Promise(resolve => {
        $.post(taskUrl(function_id, body, isCommon), async (err, resp, data) => {
            try {
                if (err) {
                    $.log(err)
                } else {

                    if (data) {
                        data = JSON.parse(data);
                        if (data.result) {
                            switch (function_id) {
                                case 'customer/getSimpleActInfoVo':
                                    $.venderId = data.data.venderId;
                                    $.activityShopId = data.data.venderId;
                                    break;
                                case 'activityContent':
                                    $.activityContent = data.data;
                                    if(isGetAuthorCodeList){
                                        console.log('将助力码 '+data.data.myUuid+' 加入助力数组');
                                        authorCodeList.push(data.data.myUuid);
                                    }
                                    console.log(data.data.myUuid);
                                    $.drawContentVOs = data.data.drawContentVOs
                                    break;
                                case 'getPrize':
                                    console.log(data.data.name);
                                    break;
                            }
                        } else {
                            $.log(JSON.stringify(data))
                        }
                    }
                }
            } catch (error) {
                $.log(error)
            } finally {
                resolve();
            }
        })
    })
}
function taskUrl(function_id, body, isCommon) {
    return {
        url: isCommon ? `https://lzkjdz-isv.isvjcloud.com/${function_id}` : `https://lzkjdz-isv.isvjcloud.com/wxShareActivity/${function_id}`,
        headers: {
            Host: 'lzkjdz-isv.isvjcloud.com',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept-Language': 'zh-cn',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/x-www-form-urlencoded',
            Origin: 'https://lzkjdz-isv.isvjcloud.comm',
            'User-Agent': `jdapp;iPhone;9.5.4;13.6;${$.UUID};network/wifi;ADID/${$.ADID};model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
            Connection: 'keep-alive',
            Referer: $.activityUrl,
            Cookie: $.cookie
        },
        body: body

    }
}

function getMyPing() {
    let opt = {
        url: `https://lzkjdz-isv.isvjcloud.com/customer/getMyPing`,
        headers: {
            Host: 'lzkjdz-isv.isvjcloud.com',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Accept-Language': 'zh-cn',
            'Accept-Encoding': 'gzip, deflate, br',
            'Content-Type': 'application/x-www-form-urlencoded',
            Origin: 'https://lzkjdz-isv.isvjcloud.com',
            'User-Agent': `jdapp;iPhone;9.5.4;13.6;${$.UUID};network/wifi;ADID/${$.ADID};model/iPhone10,3;addressid/0;appBuild/167668;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`,
            Connection: 'keep-alive',
            Referer: $.activityUrl,
            Cookie: cookie,
        },
        body: `userId=${$.activityShopId}&token=${$.token}&fromType=APP`
    }
    return new Promise(resolve => {
        $.post(opt, (err, resp, data) => {
            try {
                if (err) {
                    $.log(err)
                } else {
                    if (resp['headers']['set-cookie']) {
                        cookie = `${originCookie}`
                        if ($.isNode()) {
                            for (let sk of resp['headers']['set-cookie']) {
                                cookie = `${cookie}${sk.split(";")[0]};`
                            }
                        } else {
                            for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                                cookie = `${cookie}${ck.split(";")[0]};`
                            }
                        }
                    }
                    if (resp['headers']['Set-Cookie']) {
                        cookie = `${originCookie}`
                        if ($.isNode()) {
                            for (let sk of resp['headers']['set-cookie']) {
                                cookie = `${cookie}${sk.split(";")[0]};`
                            }
                        } else {
                            for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                                cookie = `${cookie}${ck.split(";")[0]};`
                            }
                        }
                    }
                    if (data) {
                        data = JSON.parse(data)
                        if (data.result) {
                            $.log(`你好：${data.data.nickname}`)
                            $.pin = data.data.nickname;
                            $.secretPin = data.data.secretPin;
                            cookie = `${cookie};AUTH_C_USER=${data.data.secretPin}`
                        } else {
                            $.errorMessage = data.errorMessage
                            $.log($.errorMessage)
                        }
                    } else {
                        $.log("京东返回了空数据")
                    }
                }
            } catch (error) {
                $.log(error)
            } finally {
                resolve();
            }

        })
    })
}
function getFirstLZCK() {
    return new Promise(resolve => {
        $.get({ url: $.activityUrl ,headers:{"user-agent":$.isNode() ? (process.env.JD_USER_AGENT ? process.env.JD_USER_AGENT : (require('./USER_AGENTS').USER_AGENT)) : ($.getdata('JDUA') ? $.getdata('JDUA') : "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1")}}, (err, resp, data) => {
            try {
                if (err) {
                    console.log(err)
                } else {
                    if (resp['headers']['set-cookie']) {
                        cookie = `${originCookie}`
                        if ($.isNode()) {
                            for (let sk of resp['headers']['set-cookie']) {
                                cookie = `${cookie}${sk.split(";")[0]};`
                            }
                        } else {
                            for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                                cookie = `${cookie}${ck.split(";")[0]};`
                            }
                        }
                    }
                    if (resp['headers']['Set-Cookie']) {
                        cookie = `${originCookie}`
                        if ($.isNode()) {
                            for (let sk of resp['headers']['set-cookie']) {
                                cookie = `${cookie}${sk.split(";")[0]};`
                            }
                        } else {
                            for (let ck of resp['headers']['Set-Cookie'].split(',')) {
                                cookie = `${cookie}${ck.split(";")[0]};`
                            }
                        }
                    }
				$.cookie = cookie
                }
            } catch (error) {
                console.log(error)
            } finally {
                resolve();
            }
        })
    })
}
function getToken() {
    let opt = {
        url: `https://api.m.jd.com/client.action?functionId=isvObfuscator`,
        headers: {
            Host: 'api.m.jd.com',
            'Content-Type': 'application/x-www-form-urlencoded',
            Accept: '*/*',
            Connection: 'keep-alive',
            Cookie: cookie,
            'User-Agent': 'JD4iPhone/167650 (iPhone; iOS 13.7; Scale/3.00)',
            'Accept-Language': 'zh-Hans-CN;q=1',
            'Accept-Encoding': 'gzip, deflate, br',
        },
        body: `body=%7B%22url%22%3A%20%22https%3A//lzdz1-isv.isvjcloud.com%22%2C%20%22id%22%3A%20%22%22%7D&uuid=72124265217d48b7955781024d65bbc4&client=apple&clientVersion=9.4.0&st=1621796702000&sv=120&sign=14f7faa31356c74e9f4289972db4b988`
    }
    return new Promise(resolve => {
        $.post(opt, (err, resp, data) => {
            try {
                if (err) {
                    $.log(err)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data.code === "0") {
                            $.token = data.token
                        }
                    } else {
                        $.log("京东返回了空数据")
                    }
                }
            } catch (error) {
                $.log(error)
            } finally {
                resolve();
            }
        })
    })
}
function random(min, max) {

    return Math.floor(Math.random() * (max - min)) + min;

}
function getUUID(format = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', UpperCase = 0) {
    return format.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        if (UpperCase) {
            uuid = v.toString(36).toUpperCase();
        } else {
            uuid = v.toString(36)
        }
        return uuid;
    });
}
function checkCookie() {
    const options = {
        url: "https://me-api.jd.com/user_new/info/GetJDUserInfoUnion",
        headers: {
            "Host": "me-api.jd.com",
            "Accept": "*/*",
            "Connection": "keep-alive",
            "Cookie": cookie,
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
            "Accept-Language": "zh-cn",
            "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
            "Accept-Encoding": "gzip, deflate, br",
        }
    };
    return new Promise(resolve => {
        $.get(options, (err, resp, data) => {
            try {
                if (err) {
                    $.logErr(err)
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data.retcode === "1001") {
                            $.isLogin = false; //cookie过期
                            return;
                        }
                        if (data.retcode === "0" && data.data.hasOwnProperty("userInfo")) {
                            $.nickName = data.data.userInfo.baseInfo.nickname;
                        }
                    } else {
                        $.log('京东返回了空数据');
                    }
                }
            } catch (e) {
                $.logErr(e)
            } finally {
                resolve();
            }
        })
    })
}
