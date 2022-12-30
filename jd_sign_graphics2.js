/* 
2 2,16 * * * jd_sign_graphics2.js
只支持nodejs环境
需要安装依赖 
npm i png-js 或者 npm i png-js -S
*/

const $ = new Env('京东服饰与拍拍二手签到');
const jdCookieNode = $.isNode() ? require('./jdCookie.js') : '';
let cookiesArr = [], cookie = '';
if ($.isNode()) {
  Object.keys(jdCookieNode).forEach((item) => {
    cookiesArr.push(jdCookieNode[item])
  })
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
  cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}

!(async () => {
  if (!cookiesArr[0]) {
      $.msg($.name, '【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/bean/signIndex.action', { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
      return;
  }
  await $.wait(1000);
  for (let o = 0; o < cookiesArr.length; o++) {
      cookie = cookiesArr[o];
      UA = require('./USER_AGENTS').UARAM();
      if (cookie) {
          $.UserName = decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/) && cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1])
          $.index = o + 1;
          $.isLogin = true;
          $.nickName = '';
          console.log(`\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
          if (!$.isLogin) {
              $.msg($.name, `【提示】cookie已失效`, `京东账号${$.index} ${$.nickName || $.UserName}\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action`, { "open-url": "https://bean.m.jd.com/bean/signIndex.action" });
              if ($.isNode()) {
                  await notify.sendNotify(`${$.name}cookie已失效 - ${$.UserName}`, `京东账号${$.index} ${$.UserName}\n请重新登录获取cookie`);
              }
              return
          }

          await sign()
      }
  }



})()
  .catch((e) => {
      $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
      $.done();
  })
// 多合一签到
async function sign() {
  await JDSecClothes() // 京东服饰签到
  await $.wait(1000);
  await JDSecSecondHand(); // 拍拍二手签到
  await $.wait(1000);
}

// 拍拍二手签到
async function JDSecSecondHand() {
  return new Promise(async (resolve) => {
      $.post({
          url: `https://api.m.jd.com/client.action?functionId=doInteractiveAssignment`,
          body: `appid=babelh5&body=%7B%22sourceCode%22%3A%22acetttsign%22%2C%22encryptProjectId%22%3A%223gYLt1cSySz2pNTent5iUAhPEXXG%22%2C%22encryptAssignmentId%22%3A%22QXkQNxdoqMcPnhKYcUwYfWwcACx%22%2C%22completionFlag%22%3Atrue%2C%22itemId%22%3A%221%22%2C%22extParam%22%3A%7B%22forceBot%22%3A%221%22%2C%22businessData%22%3A%7B%22random%22%3A%22pkyvcA8j%22%7D%2C%22signStr%22%3A%221671848567321~1UAabdWX785MDFWV1F3dDk5MQ%3D%3D.Z2FmRkxib2REQWJgZQlABRQkQwBjD2MBCmd7Z1tFemYvRQpnKTkPQhE%2FZgAFBD1oGT4XGTtGQgcDEw0DKCk%3D.7e01256a~1%2C1~7604E09812E62F1E949CDC321084A2098D05A68E~0roko2g~C~TRNHWhoNbRNXARUPfx1yDxRyen8fVhRDFB0RUw4aDnQfdmkbc3wHG1kbQhMfFVwBGwlxG3oOGnR%2BfBRWGkURGxpTABwLDxR1eR12eQsbVx1HFRQVUgceDw4bdQcfcnZ%2BGlAfQxpqGhNHWVUVDGoRUwkaA38ffwobeAFhG00bQhMfFVwCGwgAGwpnGn5jDxRWGkURGxpTARwKBBQFZh18Zn0bVx1HFWUbFFZBWRoNBx0RREsVDBMCAQ8GDgULAgsCBAgCAAwGBhMfFU9SUhMJFUxDQkVHUU1RFB0RQF1WFAsRUV5DQkVHQlkVGhNDU1YVDGoABRQEBwgfBgwbDx0CGw1qGhNZXRoNBx0RVEsVDBNWAlkPVQkCAAoDBAZXDglWUFcGDgkEDgFQBAhWDwUDBRobFF9DFQIVX2FbWFZSFB0RQxoNBwcEBgADDgQFAAsFBx0RXVMVDBMCVA8DBgUAVQ1VAgcGAF5VAAZWAQAPUAMCBwwEUwkAVQAGU1cEVV0GFB0RUUhVFAsRX0ABcVkEQEllXAhdfXl5XAAFZmx1TEYRGxpZQBMJFXlHRl1WF3tYW0FGQ11FGhF6WVsZFB0RWVlBFAsRBg4PAgACFRQVRVJBFQJsDgUHGwsOBmwfFUpYFAtoFVFnXl5dUgkEGgMRGxpeeWIRGxoGAB8DGQoVGhMCBhYDGAERGxoGAAkHBgkVGhMCVA8DBgUAVQ1VAgcGAF5VAAZWAQAPUAMCBwwEUwkAVQAGU1cEVV0GFB0RVhpqGhNaWFkVDBNVUV5RUFdHQxobFFBZFQIVQxMfFVteFAsRQAsZAx8BFRQVVVdsQRoNFAgKFRQVVFURDRpFV19XWFUKRlpKQVt2DlsRGxpaXBMJbA8bBQMfBQBqGhNRW1dQFAsRBg4ABwkHDw0GAAEFAUYGWVJHUnFZcgdBenVzfF1Qf35gbEtyTnZ2CwwdYX1tcWsCDmpkc3NbYglxd2JgX29zBnN5VVJtYHtmcVNwZH9QdAtHeGJmcmhudF1mc19bXGFLbnl%2FfloKcVQOV1NEelFnXWRdc1B%2BfnZKbkpndEZibn4CbnJ1WFtzTwR1fnl6ZHwDXHt%2FUWBDfGx%2BZnpiT3BkcnRUYnlmWXdgdml%2FX3h8Yk95cXhnB2thZAVEf3sPZGBEYU1id0YHclB6eHxxZkp6YEFqc18PCx8CAQ4CBgVVD0ZOGgBNSUZ1SGJheWpgTnR8cn5%2Benlybmt%2FTmticl8DZ2Zhdl1yYF1wck9QZ3RhUGllZF56cV9ucnBUYmtwdHNnYX8GcHdUUGx2UXBhcHp1cnZUUG9yXglkYFN%2BYXJxfnt%2FUXx2dl9yZ3lbcW5yd0JScn1cC08DXV1TU1ABFRQVW0JUFQIVFEw%3D~1wq4wrm%22%2C%22sceneid%22%3A%22babel_3S28janPLYmtFxypu37AYAGgivfp%22%7D%2C%22activity_id%22%3A%223S28janPLYmtFxypu37AYAGgivfp%22%2C%22template_id%22%3A%2200019605%22%2C%22floor_id%22%3A%2287721625%22%2C%22enc%22%3A%22C1B9C77BFE2A5FBE7E63802784C8CEA840A5D2C95D0FDED1306B529C41E10CA17ABA17FD93C72165D989BA3D722E37085D399E7B99076828EE93F29538F229B7%22%7D&sign=11`,
          headers: {
              "Host": "api.m.jd.com",
              "Content-Type": "application/x-www-form-urlencoded",
              'Origin': 'https://prodev.m.jd.com',
              'User-Agent': UA,
              'Cookie': cookie
          }
      }, async (err, resp, data) => {
          try {
              if (err) {
                  console.log(`${JSON.stringify(err)}`)
                  console.log(` API请求失败，请检查网路重试`)
              } else {
                  data = JSON.parse(data)
                  if (data.subCode == 0) {
                      console.log(`\n拍拍二手签到-${data.msg}: ${JSON.stringify(data.rewardsInfo?.successRewards)}`);

                  } else {
                      console.log(`\n拍拍二手签到-${data.msg}`);
                  }
              }
          } catch (e) {
              $.logErr(e, resp)
          } finally {
              resolve()
          }
      })
  })
}

// 京东服饰签到
async function JDSecClothes() {
  return new Promise(async (resolve) => {
      $.post({
          url: `https://api.m.jd.com/client.action?functionId=doInteractiveAssignment`,
          body: `appid=babelh5&body=%7B%22sourceCode%22%3A%22acetttsign%22%2C%22encryptProjectId%22%3A%2234vT8ftZcQg4RTg5mGrheVTzbNTp%22%2C%22encryptAssignmentId%22%3A%223pBZBAsDCVpGH5YanH5ciTzw5aP%22%2C%22completionFlag%22%3Atrue%2C%22itemId%22%3A%221%22%2C%22extParam%22%3A%7B%22forceBot%22%3A%221%22%2C%22businessData%22%3A%7B%22random%22%3A%22c35NUGDN%22%7D%2C%22signStr%22%3A%221671812766525~1zXaCEf9i8kMDFkWGtubTk5MQ%3D%3D.VW5cX1VValxbWVRtXBAsEWBZW11VOVMvE1V0XUJcSGkVXBNVJgMWWyMwXBkcNjJSACclFgFfWzUMKRQaGiY%3D.538d013c~1%2C1~A9A1D85121156247C6A304F3969FEBAC164E7295~15pz7pt~C~TRNFWxQObWwdFEJaWxMLbRRQAxwJbhoGZx0IZGUYVx1FFBoWUgYcDm4YBGAdD2JwGlAdQhRpGhNWRFgWDAAdFEVHFAsTBwADBwkABAEBBQYIBgUCDgETGhRDU1UTDBRAQkVFQlBBUBMdFEFRVxMLFFBSQkVFQkNVFB0TRlJaFAtqBQQYBwMJGgcHGggdBxoBax0TXFwWDAAdFFVHFAsTUwNVDlIJBwEGAgMGUg8FV1dXAw8FBQkBVQUEVwgFBgQWGhNfRhQOFFhhXllaUxMdFEIWDAAHAQcMBwMGAAABBAQdFFxfFAsTB1UDAgEFBVQBVAUHAwFSVAcGUwAMDlcDBwYABVQJBVQMB1RXAVRRBxMdFFBEVBMLFF5MAHZZAUFFZFsIWHx1eFsAAGdgdEtGFBoWWEcTDBR1RkFdUxZ3WVxBQ0JRRB0Rf1hXGBMdFFhVQBMLFAcCDgUABxQYFEJSRBQObQkFAhoHDwFsGhRGWRMLbRRdZlleWFMFBR0DFBoWX35iFBoWBwcfBhgGFB0TBwcaAh8BFBoWBwcJAgcFFB0TB1UDAgEFBVQBVAUHAwFSVAcGUwAMDlcDBwYABVQJBVQMB1RXAVRRBxMdFFcWax0TX1lVFAsTUFBSUFdXQkIWGhNQXBQOFEQTGhRXXxMLFEEHGAQfBBQYFFJXaUAWDBMIDxQYFFNVFAwWRFBfUllZC1ICA3hhcXV%2FFBoWW1sTDG0FGgEdBmsYFFNdWVEWDBMAAAEFDgADAQIBAAMESAcERHAHd1FdYQUGe3J%2BZWBkTgdgTHBIeHcJCx9oBVIDZHlVXFUHB3dXYXAGUHBCGX18d0VhQWxGdWljfntnZEV%2FWlpYUF9wT2dOcFthTGR1cEh0Tn9iWWd4YQNaYnJCYHIHUXR7X2MGfFZkcnVNBkVgBWxTeWZSGXxMWgF5ZXcBdHlWGWZnQVR2dw5Hd2VFBFJmf3hrTGNieFZWWHpMDkVUTGQHfnMFAG9dDn9hQVVZVVtZeFNwRXt9THdYdEhkYXNafEdhTH8JGAMHBAACAAcASE4YB09PSHRKZVlnbmFcY3V3YGd1cUZ4bmV2ZGN0dw5sbmN0UnBiWnV3Z3ticGMJbmR2UlR3d1VxdEZwYX5MeGRkW052cUYBYHdDVWJ2Y2xxc3BWbmBYQlR5QWd3dwBne2JcWmtkYAdVdF0IU2BMVWt3WkZwcGAFZHRMY3lzQXtyc1ldcWBMd3h3TlJ%2BSAFLA0VdQlcTGhRZRVYTDBQWSw%3D%3D~1133wor%22%2C%22sceneid%22%3A%22babel_4RBT3H9jmgYg1k2kBnHF8NAHm7m8%22%7D%2C%22activity_id%22%3A%224RBT3H9jmgYg1k2kBnHF8NAHm7m8%22%2C%22template_id%22%3A%2200019605%22%2C%22floor_id%22%3A%2270348291%22%2C%22enc%22%3A%220431F5489541F2AEBADF1FCA5FA4DCBEB9804C0FC1BA1229EA2B3AAB43C95DB477D9383788828D24A81F269207C256D3FCEE7E355A2A33644E430F2E21EE5128%22%7D`,
          headers: {
              "Host": "api.m.jd.com",
              "Content-Type": "application/x-www-form-urlencoded",
              'Origin': 'https://prodev.m.jd.com',
              'User-Agent': UA,
              'Cookie': cookie
          }
      }, async (err, resp, data) => {
          try {
              if (err) {
                  console.log(`${JSON.stringify(err)}`)
                  console.log(` API请求失败，请检查网路重试`)
              } else {
                  data = JSON.parse(data);
                  if (data.subCode == 0) {
                      console.log(`\n京东服饰签到-${data.msg}: ${JSON.stringify(data.rewardsInfo?.successRewards)}`);
                  } else {
                      console.log(`\n京东服饰签到-${data.msg}`);
                  }
              }
          } catch (e) {
              $.logErr(e, resp)
          } finally {
              resolve()
          }
      })
  })
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



function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
