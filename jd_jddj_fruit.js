let isNotify = true;//是否通知,仅限nodejs
let ckPath = './jdCookie.js';//ck路径,环境变量:JDDJ_CKPATH
const $ = new API("jd_jddj_fruit");
let thiscookie = '', deviceid = '', sid = '', nickname = '';
let lat = '30.' + Math.round(Math.random() * (99999 - 10000) + 10000);
let lng = '114.' + Math.round(Math.random() * (99999 - 10000) + 10000);
let cityid = Math.round(Math.random() * (1500 - 1000) + 1000);
let cookies = [], notify = '';
waterNum = 0, waterTimes = 0, shareCode = '', hzstr = '', msgStr = '';
!(async() => {
    if (cookies.length == 0) {
        if ($.env.isNode) {
            if (process.env.JDDJ_CKPATH) ckPath = process.env.JDDJ_CKPATH;
            delete require.cache[ckPath];
            let jdcookies = require(ckPath);
            for (let key in jdcookies) if ( !! jdcookies[key]) cookies.push(jdcookies[key])
        } else {
            let ckstr = $.read('#jddj_cookies');
            if ( !! ckstr) {
                if (ckstr.indexOf(',') < 0) cookies.push(ckstr);
                else cookies = ckstr.split(',')
            }
        }
    }
    if (cookies.length == 0) {
        console.log('\r\n请先填写cookie');
        return
    }
    if (!$.env.isNode) isNotify = $.read('#jddj_isNotify');
    else notify = require('./sendNotify');
    let accountNum = cookies.length > Math.sqrt(400) ? Math.sqrt(400) : cookies.length;
    for (let i = 0; i < accountNum; i++) {
        console.log('\r\n★★★★★开始执行第' + (i + 1) + '个账号,共' + cookies.length + '个账号★★★★★');
        thiscookie = cookies[i];
        if (!thiscookie) continue;
        waterNum = 0, waterTimes = 0;
        deviceid = _uuid();
        let option = taskLoginUrl(deviceid, thiscookie);
        await $.http.get(option).then(response => {
            let data = JSON.parse(response.body);
            if (data.code == 0) {
                thiscookie = 'deviceid_pdj_jd=' + deviceid + '; PDJ_H5_PIN=' + data.result.PDJ_H5_PIN + '; o2o_m_h5_sid=' + data.result.o2o_m_h5_sid + ';';
                sid = data.result.o2o_m_h5_sid
            } else thiscookie = 'aabbcc'
        });
        let userdata = await userinfo();
        if (userdata.type == 1) {
            $.notify('第' + (i + 1) + '个账号cookie过期', '请访问\nhttps://bean.m.jd.com/bean/signIndex.action\n抓取cookie', {
                url: 'https://bean.m.jd.com/bean/signIndex.action'
            });
            if ($.env.isNode && '' + isNotify + '' == 'true') {
                await notify.sendNotify('第' + (i + 1) + '个账号cookie过期', '请访问\nhttps://bean.m.jd.com/bean/signIndex.action\n抓取cookie')
            }
            continue
        }
        await $.wait(1000);
        await treeInfo(0);
        await $.wait(1000);
        let tslist = await taskList();
        await waterBottle();
        await $.wait(1000);
        await runTask(tslist);
        await $.wait(1000);
        await zhuLi();
        await $.wait(1000);
        await water();
        await $.wait(1000);
        hzstr = '';
        tslist = await taskList();
        for (let index = 0; index < tslist.result.taskInfoList.length; index++) {
            let element = tslist.result.taskInfoList[index];
            if (element.taskId == '23eee1c043c01bc') {
                shareCode += '@' + element.uniqueId + ',';
                console.log('\n好友互助码:' + shareCode);
                hzstr = ',助力' + element.finishNum + '/' + element.totalNum + ',助力你的好友:';
                if (element.fissionUserInfoList && element.fissionUserInfoList.length > 0) {
                    element.fissionUserInfoList.forEach(item => {
                        hzstr += item.nickName + ','
                    });
                    hzstr = hzstr.substr(0, hzstr.length - 1)
                }
                break
            }
        }
        await treeInfo(2);
        await $.wait(1000)
    }
    if ((new Date().getUTCHours() + 8) % 24 < 8) {
        $.notify('京东到家果园互助码:', '', shareCode);
        if ($.env.isNode) {
            notify.sendNotify('京东到家果园互助码:', shareCode)
        }
    }
    if ($.env.isNode) await notify.sendNotify('京东到家果园信息', msgStr);
    if (!($.env.isNode && process.env.SCF_NAMESPACE)) $.write(shareCode, 'shareCodes')
})().catch((e) => {
    console.log('', '?失败! 原因:' + e + '!', '');
    if ($.env.isNode && '' + isNotify + '' == 'true') {
        notify.sendNotify('京东到家果园', '?失败! 原因:' + e + '!')
    }
}).finally(() => {
$.done();
})
async function userinfo() {
    return new Promise(async resolve => {
        try {
            let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&platCode=H5&appName=paidaojia&channel=&appVersion=8.7.6&jdDevice=&functionId=mine%2FgetUserAccountInfo&body=%7B%22refPageSource%22:%22%22,%22fromSource%22:2,%22pageSource%22:%22myinfo%22,%22ref%22:%22%22,%22ctp%22:%22myinfo%22%7D&jda=&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');
            $.http.get(option).then(response => {
                let data = JSON.parse(response.body);
                if (data.code == 0) {
                    try {
                        nickname = data.result.userInfo.userBaseInfo.nickName;
                        console.log("●●●" + nickname + "●●●")
                    } catch (error) {
                        nickname = '昵称获取失败'
                    }
                }
                resolve(data)
            })
        } catch (error) {
            console.log('\n【个人信息】:' + error);
            resolve({
                type: 1
            })
        }
    })
}
async function taskList() {
    return new Promise(async resolve => {
        try {
            let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=task%2Flist&isNeedDealError=true&body=%7B%22modelId%22%3A%22M10007%22%2C%22plateCode%22%3A1%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');
            $.http.get(option).then(response => {
                let data = JSON.parse(response.body);
                resolve(data)
            })
        } catch (error) {
            console.log('\n【任务列表】:' + error);
            resolve({})
        }
    })
}
async function water() {
    return new Promise(async resolve => {
        try {
            let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()), 'functionId=fruit%2Fwatering&isNeedDealError=true&method=POST&body=%7B%22waterTime%22%3A1%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + '&deviceToken=' + deviceid + '&deviceId=' + deviceid);
            let waterStatus = 1, waterCount = 0;
            do {
                waterCount++;
                console.log('\n**********开始执行第' + waterCount + '次浇水**********');
                $.http.post(option).then(response => {
                    let data = JSON.parse(response.body);
                    console.log('\n【浇水】:' + data.msg);
                    waterStatus = data.code;
                    if (data.code == 0) waterTimes++
                });
                await $.wait(1000)
            } while (waterStatus == 0);
            resolve()
        } catch (error) {
            console.log('\n【浇水】:' + error);
            resolve()
        }
    })
}
async function sign() {
    return new Promise(async resolve => {
        try {
            let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=signin%2FuserSigninNew&isNeedDealError=true&body=%7B%22channel%22%3A%22daojiaguoyuan%22%2C%22cityId%22%3A' + cityid + '%2C%22longitude%22%3A' + lng + '%2C%22latitude%22%3A' + lat + '%2C%22ifCic%22%3A0%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');
            $.http.get(option).then(response => {
                let data = JSON.parse(response.body);
                console.log('\n【到家签到】:' + data.msg);
                resolve()
            })
        } catch (error) {
            console.log('\n【到家签到领水滴】:' + error);
            resolve()
        }
    })
}
async function waterBottle() {
    return new Promise(async resolve => {
        try {
            let receiveStatus;
            let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=fruit%2FgetWaterBottleInfo&isNeedDealError=true&body=%7B%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');
            await $.http.get(option).then(response => {
                const data = JSON.parse(response.body);
                if (data.code == 0) {
                    receiveStatus = data.result.receiveStatus;
                    console.log('\n【收玻璃瓶水滴】:水瓶中有:' + data.result.yesterdayAccumulate + '水滴')
                } else {
                    console.log('\n【收玻璃瓶水滴】:水瓶信息错误')
                }
            });
            if (receiveStatus == 0) {
                option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=fruit%2FreceiveWaterBottle&isNeedDealError=true&body=%7B%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');
                await $.http.get(option).then(response => {
                    const data = JSON.parse(response.body);
                    if (data.code == 0) {
                        console.log('\n【收玻璃瓶水滴】:水瓶收取成功')
                    } else {
                        console.log('\n【收玻璃瓶水滴】:水瓶收取错误')
                    }
                })
            } else if (receiveStatus == 1) {
                console.log('\n【收玻璃瓶水滴】:水瓶已经收取过')
            } else if (receiveStatus == -2) {
                console.log('\n【收玻璃瓶水滴】:收取时间未到')
            } else {
                console.log('\n【收玻璃瓶水滴】:水瓶状态错误或暂不可收取:')
            }
            resolve()
        } catch (error) {
            console.log('\n【收玻璃瓶水滴】:' + error);
            resolve()
        }
    })
}
async function zhuLi() {
    return new Promise(async resolve => {
        try {
            let scodes = [], codestr = '';
         
                if ($.read('shareCodes')) 
                codestr += $.read('shareCodes')
            
            
            codestr = codestr.replace(/ /g, '').replace(/\n/g, '');
            if ( !! codestr) {
                codestr = codestr.substr(0, codestr.length - 1);
                scodes = codestr.split(',')
            }
            for (let index = 0; index < scodes.length; index++) {
                let option = urlTask('https://daojia.jd.com/client?lat=' + lat + '&lng=' + lng + '&lat_pos=' + lat + '&lng_pos=' + lng + '&city_id=' + cityid + '&deviceToken=' + deviceid + '&deviceId=' + deviceid + '&channel=wx_xcx&mpChannel=wx_xcx&platform=5.0.0&platCode=mini&appVersion=5.0.0&appName=paidaojia&deviceModel=appmodel&xcxVersion=9.2.0&isNeedDealError=true&business=djgyzhuli&functionId=task%2Ffinished&body=%7B%22modelId%22%3A%22M10007%22%2C%22taskType%22%3A1201%2C%22taskId%22%3A%2223eee1c043c01bc%22%2C%22plateCode%22%3A5%2C%22assistTargetPin%22%3A%22' + scodes[index].split('@')[0] + '%22%2C%22uniqueId%22%3A%22' + scodes[index].split('@')[1] + '%22%7D', '');
                await $.http.get(option).then(response => {
                    let data = JSON.parse(response.body);
                    console.log('\n【助力】:' + data.msg)
                });
                await $.wait(1000)
            }
            resolve()
        } catch (error) {
            console.log('\n【助力】:' + error);
            resolve()
        }
    })
}

async function _runTask(tslist) {
    return new Promise(async resolve => {
        try {
            for (let index = 0; index < tslist.result.taskInfoList.length; index++) {
                const item = tslist.result.taskInfoList[index];
                if (item.taskType == 307 || item.taskType == 901) {
                    let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=task%2Freceived&isNeedDealError=true&body=%7B%22modelId%22%3A%22' + item.modelId + '%22%2C%22taskId%22%3A%22' + encodeURIComponent(item.taskId) + '%22%2C%22taskType%22%3A' + item.taskType + '%2C%22plateCode%22%3A1%2C%22subNode%22%3Anull%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');
                    await $.http.get(option).then(response => {
                        var data = JSON.parse(response.body),
                            msg = '';
                        if (data.code == 0) {
                            msg = data.msg + ',奖励:' + data.result.awardValue
                        } else {
                            msg = data.msg
                        }
                        console.log('\n领取任务【' + item.taskTitle + '】:' + msg)
                    })
                }
                if (item.browseTime > -1) {
                    for (let t = 0; t < parseInt(item.browseTime); t++) {
                        await $.wait(1000);
                        console.log('计时:' + (t + 1) + '秒...')
                    }
                };
                option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=task%2Ffinished&isNeedDealError=true&body=%7B%22modelId%22%3A%22' + item.modelId + '%22%2C%22taskId%22%3A%22' + encodeURIComponent(item.taskId) + '%22%2C%22taskType%22%3A' + item.taskType + '%2C%22plateCode%22%3A1%2C%22subNode%22%3Anull%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');
                await $.http.get(option).then(response => {
                    var data = JSON.parse(response.body),
                        msg = '';
                    if (data.code == 0) {
                        msg = data.msg + ',奖励:' + data.result.awardValue
                    } else {
                        msg = data.msg
                    }
                    console.log('\n任务完成【' + item.taskTitle + '】:' + msg)
                });
                option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=task%2FsendPrize&isNeedDealError=true&body=%7B%22modelId%22%3A%22' + item.modelId + '%22%2C%22taskId%22%3A%22' + encodeURIComponent(item.taskId) + '%22%2C%22taskType%22%3A' + item.taskType + '%2C%22plateCode%22%3A1%2C%22subNode%22%3Anull%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');
                await $.http.get(option).then(response => {
                    var data = JSON.parse(response.body),
                        msg = '';
                    if (data.code == 0) {
                        msg = data.msg + ',奖励:' + data.result.awardValue
                    } else {
                        msg = data.msg
                    }
                    console.log('\n领取奖励【' + item.taskTitle + '】:' + msg)
                })
            }
            resolve()
        } catch (error) {
            console.log('\n【执行任务】:' + error);
            resolve()
        }
    })
}
const do_tasks = [307, 901, 1102, 1105, 1103, 0, 1101];
async function runTask(tslist) {
    return new Promise(async resolve => {
        try {
            for (let index = 0; index < tslist.result.taskInfoList.length; index++) {
                const item = tslist.result.taskInfoList[index];
                if (item.status == 3 || item.status == 2) {
                    console.log('\n【' + item.taskTitle + '】: 任务已完成,跳过做任务')
                } else if (item.taskType == 502) {
                    await sign()
                } else if (do_tasks.includes(item.taskType)) {
                    if (item.status == 0) {
                        let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=task%2Freceived&isNeedDealError=true&body=%7B%22modelId%22%3A%22' + item.modelId + '%22%2C%22taskId%22%3A%22' + encodeURIComponent(item.taskId) + '%22%2C%22taskType%22%3A' + item.taskType + '%2C%22plateCode%22%3A1%2C%22subNode%22%3Anull%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');
                        await $.http.get(option).then(response => {
                            let data = JSON.parse(response.body), msg = '';
                            if (data.code == 0) {
                                msg = data.msg + ',奖励:' + data.result.awardValue
                            } else {
                                msg = data.msg
                            }
                            console.log('\n领取任务【' + item.taskTitle + '】:' + msg)
                        });
                        if (item.browseTime > -1) {
                            for (let t = 0; t < parseInt(item.browseTime); t++) {
                                await $.wait(1000);
                                console.log('计时:' + (t + 1) + '秒...')
                            }
                        }
                    } else {
                        console.log('\n【' + item.taskTitle + '】: 任务已领取或不需要领取')
                    };
                    if (item.taskType != 0) {
                        option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=task%2Ffinished&isNeedDealError=true&body=%7B%22modelId%22%3A%22' + item.modelId + '%22%2C%22taskId%22%3A%22' + encodeURIComponent(item.taskId) + '%22%2C%22taskType%22%3A' + item.taskType + '%2C%22plateCode%22%3A1%2C%22subNode%22%3Anull%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');
                        await $.http.get(option).then(response => {
                            let data = JSON.parse(response.body), msg = '';
                            if (data.code == 0) {
                                msg = data.msg + ',奖励:' + data.result.awardValue;
                                item.status = 2
                            } else {
                                msg = data.msg
                            }
                            console.log('\n任务完成【' + item.taskTitle + '】:' + msg)
                        })
                    }
                } else {
                    console.log('\n【' + item.taskTitle + '】: 脚本无法执行此任务或任务不需要主动完成')
                }
                if (item.status == 2 || item.taskTypes == 1102) {
                    option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=task%2FsendPrize&isNeedDealError=true&body=%7B%22modelId%22%3A%22' + item.modelId + '%22%2C%22taskId%22%3A%22' + encodeURIComponent(item.taskId) + '%22%2C%22taskType%22%3A' + item.taskType + '%2C%22plateCode%22%3A1%2C%22subNode%22%3Anull%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');
                    await $.http.get(option).then(response => {
                        let data = JSON.parse(response.body), msg = '';
                        if (data.code == 0) {
                            msg = data.msg + ',奖励:' + data.result.awardValue
                        } else {
                            msg = data.msg
                        }
                        console.log('\n领取奖励【' + item.taskTitle + '】:' + msg)
                    })
                } else if (item.status == 3) {
                    console.log('\n【' + item.taskTitle + '】: 奖励已领取,跳过领奖励')
                } else {
                    console.log('\n【' + item.taskTitle + '】: 任务未完成,跳过领奖励')
                }
            }
            resolve()
        } catch (error) {
            console.log('\n【执行任务】:' + error);
            resolve()
        }
    })
}
async function runTask2(tslist) {
    return new Promise(async resolve => {
        try {
            for (let index = 0; index < tslist.result.taskInfoList.length; index++) {
                const item = tslist.result.taskInfoList[index];
                if (item.taskTitle.indexOf('限时') > -1) {
                    let option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=task%2Freceived&isNeedDealError=true&body=%7B%22modelId%22%3A%22' + item.modelId + '%22%2C%22taskId%22%3A%22' + encodeURIComponent(item.taskId) + '%22%2C%22taskType%22%3A' + item.taskType + '%2C%22plateCode%22%3A1%2C%22subNode%22%3Anull%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');
                    await $.http.get(option).then(response => {
                        var data = JSON.parse(response.body),
                            msg = '';
                        if (data.code == 0) {
                            msg = data.msg + ',奖励:' + data.result.awardValue
                        } else {
                            msg = data.msg
                        }
                        console.log('\n领取任务【' + item.taskTitle + '】:' + msg)
                    });
                    if (item.browseTime > -1) {
                        for (let t = 0; t < parseInt(item.browseTime); t++) {
                            await $.wait(1000);
                            console.log('计时:' + (t + 1) + '秒...')
                        }
                    };
                    option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=task%2Ffinished&isNeedDealError=true&body=%7B%22modelId%22%3A%22' + item.modelId + '%22%2C%22taskId%22%3A%22' + encodeURIComponent(item.taskId) + '%22%2C%22taskType%22%3A' + item.taskType + '%2C%22plateCode%22%3A1%2C%22subNode%22%3Anull%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');
                    await $.http.get(option).then(response => {
                        var data = JSON.parse(response.body),
                            msg = '';
                        if (data.code == 0) {
                            msg = data.msg + ',奖励:' + data.result.awardValue
                        } else {
                            msg = data.msg
                        }
                        console.log('\n任务完成【' + item.taskTitle + '】:' + msg)
                    });
                    option = urlTask('https://daojia.jd.com/client?_jdrandom=' + Math.round(new Date()) + '&functionId=task%2FsendPrize&isNeedDealError=true&body=%7B%22modelId%22%3A%22' + item.modelId + '%22%2C%22taskId%22%3A%22' + encodeURIComponent(item.taskId) + '%22%2C%22taskType%22%3A' + item.taskType + '%2C%22plateCode%22%3A1%2C%22subNode%22%3Anull%7D&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid, '');
                    await $.http.get(option).then(response => {
                        var data = JSON.parse(response.body),
                            msg = '';
                        if (data.code == 0) {
                            msg = data.msg + ',奖励:' + data.result.awardValue
                        } else {
                            msg = data.msg
                        }
                        console.log('\n领取奖励【' + item.taskTitle + '】:' + msg)
                    })
                }
            }
            resolve()
        } catch (error) {
            console.log('\n【执行任务】:' + error);
            resolve()
        }
    })
}
async function treeInfo(step) {
    return new Promise(async resolve => {
        try {
            let option = urlTask('https://daojia.jd.com:443/client?_jdrandom=' + Math.round(new Date()), 'functionId=fruit%2FinitFruit&isNeedDealError=true&method=POST&body=%7B%22cityId%22%3A' + cityid + '%2C%22longitude%22%3A' + lng + '%2C%22latitude%22%3A' + lat + '%7D&lat=' + lat + '&lng=' + lng + '&lat_pos=' + lat + '&lng_pos=' + lng + '&city_id=' + cityid + '&channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&traceId=' + deviceid + Math.round(new Date()) + '&deviceToken=' + deviceid + '&deviceId=' + deviceid);
            await $.http.post(option).then(async response => {
                let data = JSON.parse(response.body);
                if (data.code == 0) {
                    if (step == 0) {
                        waterNum = data.result.userResponse.waterBalance;
                        shareCode += data.result.activityInfoResponse.userPin
                    }
                    if (step == 2) {
                        waterNum = (waterTimes * 10) + data.result.userResponse.waterBalance - waterNum;
                        if (waterNum < 0) waterNum = 0;
                        if (data.result.activityInfoResponse.curStageLeftProcess == 0) {
                            console.log('\n京东到家果园【' + nickname + '】:' + data.result.activityInfoResponse.fruitName + '已成熟,快去收取!');
                            $.notify('京东到家果园', '【' + nickname + '】', '京东到家果园' + data.result.activityInfoResponse.fruitName + '已成熟,快去收取!');
                            if ($.env.isNode && '' + isNotify + '' == 'true') {
                                msgStr += '\r\n【' + nickname + '】\r\n京东到家果园' + data.result.activityInfoResponse.fruitName + '已成熟,快去收取!'
                            }
                        }
                        if (data.result.activityInfoResponse.curStageLeftProcess > 0) {
                            let unit = '次';
                            if (data.result.activityInfoResponse.growingStage == 5) unit = '%';
                            console.log('\n京东到家果园【' + nickname + '】:' + data.result.activityInfoResponse.fruitName + ',本次领取' + waterNum + '滴水,浇水' + waterTimes + '次,还需浇水' + data.result.activityInfoResponse.curStageLeftProcess + unit + data.result.activityInfoResponse.stageName + ',还剩' + data.result.userResponse.waterBalance + '滴水' + hzstr);
                            $.notify('京东到家果园', '【' + nickname + '】', '【果树信息】:' + data.result.activityInfoResponse.fruitName + ',本次领取' + waterNum + '滴水,浇水' + waterTimes + '次,还需浇水' + data.result.activityInfoResponse.curStageLeftProcess + unit + data.result.activityInfoResponse.stageName + ',还剩' + data.result.userResponse.waterBalance + '滴水' + hzstr);
                            if ($.env.isNode && '' + isNotify + '' == 'true') {
                                msgStr += '\r\n【' + nickname + '】\r\n【果树信息】:' + data.result.activityInfoResponse.fruitName + ',本次领取' + waterNum + '滴水,浇水' + waterTimes + '次,还需浇水' + data.result.activityInfoResponse.curStageLeftProcess + unit + data.result.activityInfoResponse.stageName + ',还剩' + data.result.userResponse.waterBalance + '滴水' + hzstr
                            }
                        }
                    }
                }
                resolve()
            })
        } catch (error) {
            console.log('\n【果树信息】:' + error);
            resolve()
        } finally {
            treeInfoTimes = true
        }
    })
}
function urlTask(url, body) {
    let option = {
        url: url,
        headers: {
            'Host': 'daojia.jd.com',
            'Content-Type': 'application/x-www-form-urlencoded;',
            'Origin': 'https://daojia.jd.com',
            'Cookie': thiscookie,
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148________appName=jdLocal&platform=iOS&commonParams={"sharePackageVersion":"2"}&djAppVersion=8.7.5&supportDJSHWK',
            'Accept-Language': 'zh-cn'
        },
        body: body
    };
    return option
}
function taskLoginUrl(deviceid, thiscookie) {
    return {
        url: 'https://daojia.jd.com/client?_jdRandom=' + (+new Date()) + '&functionId=xapp/loginByPtKeyNew&body=' + escape(JSON.stringify({
            "fromSource": 5,
            "businessChannel": 150,
            "subChannel": "",
            "regChannel": ""
        })) + 'channel=ios&platform=6.6.0&platCode=h5&appVersion=6.6.0&appName=paidaojia&deviceModel=appmodel&code=011UYn000apwmL1nWB000aGiv74UYn03&deviceId=' + deviceid + '&deviceToken=' + deviceid + '&deviceModel=appmodel',
        headers: {
            "Cookie": 'deviceid_pdj_jd=' + deviceid + ';' + thiscookie + ';',
            "Host": "daojia.jd.com",
            "referer": "https://daojia.jd.com/taroh5/h5dist/",
            'Content-Type': 'application/x-www-form-urlencoded',
            "User-Agent": 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148________appName=jdLocal&platform=iOS&commonParams={"sharePackageVersion":"2"}&djAppVersion=8.7.5&supportDJSHWK'
        }
    }
}
function _uuid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}
function ENV() { const e = "undefined" != typeof $task, t = "undefined" != typeof $loon, s = "undefined" != typeof $httpClient && !t, i = "function" == typeof require && "undefined" != typeof $jsbox; return { isQX: e, isLoon: t, isSurge: s, isNode: "function" == typeof require && !i, isJSBox: i, isRequest: "undefined" != typeof $request, isScriptable: "undefined" != typeof importModule } } function HTTP(e = { baseURL: "" }) { const { isQX: t, isLoon: s, isSurge: i, isScriptable: n, isNode: o } = ENV(), r = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/; const u = {}; return ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH"].forEach(l => u[l.toLowerCase()] = (u => (function (u, l) { l = "string" == typeof l ? { url: l } : l; const h = e.baseURL; h && !r.test(l.url || "") && (l.url = h ? h + l.url : l.url); const a = (l = { ...e, ...l }).timeout, c = { onRequest: () => { }, onResponse: e => e, onTimeout: () => { }, ...l.events }; let f, d; if (c.onRequest(u, l), t) f = $task.fetch({ method: u, ...l }); else if (s || i || o) f = new Promise((e, t) => { (o ? require("request") : $httpClient)[u.toLowerCase()](l, (s, i, n) => { s ? t(s) : e({ statusCode: i.status || i.statusCode, headers: i.headers, body: n }) }) }); else if (n) { const e = new Request(l.url); e.method = u, e.headers = l.headers, e.body = l.body, f = new Promise((t, s) => { e.loadString().then(s => { t({ statusCode: e.response.statusCode, headers: e.response.headers, body: s }) }).catch(e => s(e)) }) } const p = a ? new Promise((e, t) => { d = setTimeout(() => (c.onTimeout(), t(`${u} URL: ${l.url} exceeds the timeout ${a} ms`)), a) }) : null; return (p ? Promise.race([p, f]).then(e => (clearTimeout(d), e)) : f).then(e => c.onResponse(e)) })(l, u))), u } function API(e = "untitled", t = !1) { const { isQX: s, isLoon: i, isSurge: n, isNode: o, isJSBox: r, isScriptable: u } = ENV(); return new class { constructor(e, t) { this.name = e, this.debug = t, this.http = HTTP(), this.env = ENV(), this.node = (() => { if (o) { return { fs: require("fs") } } return null })(), this.initCache(); Promise.prototype.delay = function (e) { return this.then(function (t) { return ((e, t) => new Promise(function (s) { setTimeout(s.bind(null, t), e) }))(e, t) }) } } initCache() { if (s && (this.cache = JSON.parse($prefs.valueForKey(this.name) || "{}")), (i || n) && (this.cache = JSON.parse($persistentStore.read(this.name) || "{}")), o) { let e = "root.json"; this.node.fs.existsSync(e) || this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.root = {}, e = `${this.name}.json`, this.node.fs.existsSync(e) ? this.cache = JSON.parse(this.node.fs.readFileSync(`${this.name}.json`)) : (this.node.fs.writeFileSync(e, JSON.stringify({}), { flag: "wx" }, e => console.log(e)), this.cache = {}) } } persistCache() { const e = JSON.stringify(this.cache, null, 2); s && $prefs.setValueForKey(e, this.name), (i || n) && $persistentStore.write(e, this.name), o && (this.node.fs.writeFileSync(`${this.name}.json`, e, { flag: "w" }, e => console.log(e)), this.node.fs.writeFileSync("root.json", JSON.stringify(this.root, null, 2), { flag: "w" }, e => console.log(e))) } write(e, t) { if (this.log(`SET ${t}`), -1 !== t.indexOf("#")) { if (t = t.substr(1), n || i) return $persistentStore.write(e, t); if (s) return $prefs.setValueForKey(e, t); o && (this.root[t] = e) } else this.cache[t] = e; this.persistCache() } read(e) { return this.log(`READ ${e}`), -1 === e.indexOf("#") ? this.cache[e] : (e = e.substr(1), n || i ? $persistentStore.read(e) : s ? $prefs.valueForKey(e) : o ? this.root[e] : void 0) } delete(e) { if (this.log(`DELETE ${e}`), -1 !== e.indexOf("#")) { if (e = e.substr(1), n || i) return $persistentStore.write(null, e); if (s) return $prefs.removeValueForKey(e); o && delete this.root[e] } else delete this.cache[e]; this.persistCache() } notify(e, t = "", l = "", h = {}) { const a = h["open-url"], c = h["media-url"]; if (s && $notify(e, t, l, h), n && $notification.post(e, t, l + `${c ? "\n多媒体:" + c : ""}`, { url: a }), i) { let s = {}; a && (s.openUrl = a), c && (s.mediaUrl = c), "{}" === JSON.stringify(s) ? $notification.post(e, t, l) : $notification.post(e, t, l, s) } if (o || u) { const s = l + (a ? `\n点击跳转: ${a}` : "") + (c ? `\n多媒体: ${c}` : ""); if (r) { require("push").schedule({ title: e, body: (t ? t + "\n" : "") + s }) } else console.log(`${e}\n${t}\n${s}\n\n`) } } log(e) { this.debug && console.log(`[${this.name}] LOG: ${this.stringify(e)}`) } info(e) { console.log(`[${this.name}] INFO: ${this.stringify(e)}`) } error(e) { console.log(`[${this.name}] ERROR: ${this.stringify(e)}`) } wait(e) { return new Promise(t => setTimeout(t, e)) } done(e = {}) { console.log('done!'); s || i || n ? $done(e) : o && !r && "undefined" != typeof $context && ($context.headers = e.headers, $context.statusCode = e.statusCode, $context.body = e.body) } stringify(e) { if ("string" == typeof e || e instanceof String) return e; try { return JSON.stringify(e, null, 2) } catch (e) { return "[object Object]" } } }(e, t) }
