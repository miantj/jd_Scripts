/*
头文字J 
活动快捷入口： 19:/参与头文字J，集能量兑换京豆！P5loICDei3！⇥Jℹ️ng◼倲
日常任务，助力，游戏
第一个账号助力作者 其他依次助力CK1
默认不做加购任务，如需要设置变量erport car_addsku='true'
只跑前5个CK
定时随机，一起冲会炸
*/

const $ = new Env("头文字JJJ");
const jdCookieNode=$.isNode()?require('./jdCookie.js'):'';
const notify=$.isNode()?require('./sendNotify'):'';
const dy = require('./function/dylanx.js');
let cookiesArr=[],cookie='';
if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => { cookiesArr.push(jdCookieNode[item])})
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => { };
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || "[]").map(item => item.cookie)].filter(item => !!item);
}
allMessage='';
message='';
$.hotFlag=false;
$.outFlag=false;
let shareUuidArr=['B2s863iFzsHJxGtOlrCXxsjNhNaYFy2HteErE6izlhTf9nrGY7gBkCdGU4C6z/xD','WoDXSUOIZFZbWchg5qcDb14tLNYA4seuA67MOIYQxEk3Vl9+AVo4NF+tgyeIc6A6kdK3rLBQpEQH9V4tdrrh0w==','3KtP4oQOaF9hH0uFesDKL14tLNYA4seuA67MOIYQxEk3Vl9+AVo4NF+tgyeIc6A6kdK3rLBQpEQH9V4tdrrh0w==','OsiH6Sic/uTxioPBG6hh5K9AMkY4oJ31vhy6nI5LWbOiIw7XUQOP/Btn03/M1TYH','8AIkpPYAb4jMiUQb+YijkcjNhNaYFy2HteErE6izlhTf9nrGY7gBkCdGU4C6z/xD'];
let n=0;
n=Math.floor(Math.random()*shareUuidArr.length);
let shareUuid=shareUuidArr[n]||'';
!(async()=>{
	console.log('活动快捷入口： 19:/参与头文字J，集能量兑换京豆！P5loICDei3！⇥Jℹ️ng◼倲');
    if (!cookiesArr[0]) {
      $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
        "open-url": "https://bean.m.jd.com/"
      });
      return;
    }
	$.userId='10299171';
	$.actId='1760007';
	$.inviteNick=shareUuid;
	for(let o=0; o < 5; o++){
		cookie=cookiesArr[o];
		if(cookie){
			$.UserName=decodeURIComponent(cookie.match(/pt_pin=([^; ]+)(?=;?)/)&&cookie.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
			$.index=o+1;
			message='';
			$.bean=0;
            $.hotFlag = false
			$.nickName=false;
			$.nickName='';
			console.log(`\n\n******开始【京东账号${$.index}】${$.nickName || $.UserName}*********\n`);
			await getUA();
			await run();
			if($.outFlag)break;
		}
	}if($.outFlag){
		let msg='此ip已被限制，请过10分钟后再执行脚本';
		$.msg($.name,'',''+msg);
		if ($.isNode()) await notify.sendNotify(`${$.name}`, `${msg}`);
	}
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())
async function run(){
	try{
		$.hasEnd=true;
		$.Token='';
		$.Pin='';
		$.MixNick='';
		if($.outFlag){
			console.log('此ip已被限制，请过10分钟后再执行脚本');
			return;
		}
		await takePostRequest('isvObfuscator');
		if($.Token==''){
			console.log('获取token失败！');
			return;
		}
		await takePostRequest('activity_load');
		if($.nickName)return;
		if($.MixNick==''){
			console.log('获取mixnick失败');
			return;
		}
        console.log(`助力码：${$.MixNick}\n`);
        if($.hotFlag) return
		await takePostRequest('taskList');
		console.log('开始日常任务。。。');
        for (let i = 0; i < $.taskLists.length; i++){
            $.missionType  = $.taskLists[i].type
            if (!$.taskLists[i].isComplete){
            switch($.missionType){
                case 'bingCar':
                case 'openCard':
                case 'shareAct':   
                case 'viewChannelCommodity':   				
                    break;
                case 'viewCommodity':
                case 'viewThemeConference':
                    for(let i=0;i<3;i++){
                        await takePostRequest('doTask');
                        await $.wait(parseInt(Math.random()*1000+1000,10));
                    }
                    break;
                case 'collectShop':
                    for(let i=0;i<3;i++){
                        await takePostRequest('getCusShop');
                        await takePostRequest('followShop');
                        await $.wait(parseInt(Math.random()*1000+1000,10));
                    }
                    break;
                case 'addCart':
                    if (process.env.car_addsku && process.env.car_addsku === 'true'){
                    for(let i=0;i<3;i++){
                        await takePostRequest('getCusShopProduct');
                        await takePostRequest('addCart');
                        await $.wait(parseInt(Math.random()*1000+1000,10));
                    }
                    } else {console.log(`默认不加购,请设置变量export car_addsku='true'做加购任务`)}
                    break;
                default:
                    await takePostRequest('doTask');
                    await $.wait(1000);  
            }
            }
        }
        if ($.remainChance){
		    console.log('\n开始游戏。。。');
            await takePostRequest('getCarInfo');
		    for(let i = 0;i < $.remainChance; i++){
		    	await takePostRequest('playGame');
		    	await $.wait(parseInt(Math.random()*2000+5000));
		    	await takePostRequest('sendGameAward');
		    	await $.wait(parseInt(Math.random()*2000+1000));
		    }
        }else{console.log('\n开始游戏：没有游戏币了，明天再来！')}
		await takePostRequest('activity_load');
        await $.wait(1000);
		console.log(`当前剩余能量：${$.remainPoint}\n`);
		await $.wait(1000);
		//console.log('开始兑换5豆。。。');
		//await takePostRequest('exchange');
		//await $.wait(500);
		await takePostRequest('missionInviteList');
        await $.wait(1000);
        console.log(`去助力：${$.inviteNick}`);
		await takePostRequest('助力'); 
		if($.index==1){
			$.inviteNick=$.MixNick;
			console.log(`后面的都会助力：${$.inviteNick}`);
		}
		await $.wait(parseInt(Math.random()*1000+2000,10));
	}catch(e){
		console.log(e);
	}
}
async function takePostRequest(type){
	if($.outFlag)return;
	let domain='https://mpdz-car-dz.isvjcloud.com';
	let body='';
	let method='POST';
	let admJson='';
	switch(type){
		case 'isvObfuscator':
            let sign = await dy.getbody('isvObfuscator', { "id": "", "url": "https://mpdz-car-dz.isvjcloud.com" })
			url='https://api.m.jd.com/client.action?functionId=isvObfuscator';
			body=sign;
            break;
		case 'activity_load':
			url=`${domain}/dm/front/jdCardRunning/activity/load?open_id=&mix_nick=${$.MixNick}&push_way=3&user_id=`;
			admJson={'jdToken':$.Token,'inviteNick':$.inviteNick};
			body=_0x5338bf('/jdCardRunning/activity/load',admJson);
			break;
		case 'taskList':
			url=`${domain}/dm/front/jdCardRunning/mission/completeState?open_id=&mix_nick=${$.MixNick}`;
			admJson={};
			body=_0x5338bf('/jdCardRunning/mission/completeState',admJson);
			break;
		case'绑定':
			url=`${domain}/dm/front/jdCardRunning/mission/completeMission?open_id=&mix_nick=${$.MixNick}`;
			admJson={'missionType':'shareAct','inviterNick':$.inviteNick||''};
			body=_0x5338bf('/jdCardRunning/mission/completeState',admJson);
			break;
		case'助力':
			url=`${domain}/dm/front/jdCardRunning/mission/completeMission?open_id=&mix_nick=${$.MixNick}`;
			admJson={'missionType':'shareAct','inviterNick':$.inviteNick||'','userId':10299171};
			body=_0x5338bf('/jdCardRunning/mission/completeMission',admJson);
			break;
		case'followShop':
			url=`${domain}/dm/front/jdCardRunning/mission/completeMission?open_id=&mix_nick=${$.MixNick}`;
			admJson={'missionType':$.missionType,'userId':10299171,'shopId':$.userIds,'buyerNick':$.inviteNick};
			body=_0x5338bf('/jdCardRunning/mission/completeMission',admJson);
			break;
		case'addCart':
			url=`${domain}/dm/front/jdCardRunning/mission/completeMission?open_id=&mix_nick=${$.MixNick}`;
			admJson={'missionType':$.missionType,'userId':10299171,'goodsNumId':$.goodsNumId,'buyerNick':$.inviteNick};
			body=_0x5338bf('/jdCardRunning/mission/completeMission',admJson);
			break;
		case 'getCusShop':
			url=`${domain}/dm/front/jdCardRunning/cusShop/getCusShop?open_id=&mix_nick=${$.MixNick}`;
			admJson={};
			body=_0x5338bf('/jdCardRunning/cusShop/getCusShop',admJson);
			break;
		case 'getCusShopProduct':
			url=`${domain}/dm/front/jdCardRunning/cusShop/getCusShopProduct?open_id=&mix_nick=${$.MixNick}`;
			admJson={};
			body=_0x5338bf('/jdCardRunning/cusShop/getCusShop',admJson);
			break;
		case 'doTask':
			url=`${domain}/dm/front/jdCardRunning/mission/completeMission?open_id=&mix_nick=${$.MixNick}`;
			admJson={'actId':$.actId,'missionType':$.missionType};
			body=_0x5338bf('/jdCardRunning/mission/completeMission',admJson);
			break;
		case 'playGame':
			url=`${domain}/dm/front/jdCardRunning/game/playGame?open_id=&mix_nick=${$.MixNick}`;
			admJson={'actId':$.actId,'carId':$.usecar.id,'carName':$.usecar.carName,'userId':10299171,'buyerNick':$.inviteNick};
			body=_0x5338bf('/jdCardRunning/game/playGame',admJson);
			break;
		case 'sendGameAward':
			url=`${domain}/dm/front/jdCardRunning/game/sendGameAward?open_id=&mix_nick=${$.MixNick}`;
			admJson={'actId':$.actId,'point':$.point.point||300,'gameLogId':$.gameLogId,'userId':10299171,'buyerNick':$.inviteNick};
			body=_0x5338bf('/jdCardRunning/game/sendGameAward',admJson);
			break;
		case 'missionInviteList':
			url=`${domain}/dm/front/jdCardRunning/customer/inviteList?open_id=&mix_nick=${$.MixNick}`;
			admJson={'actId':$.actId,'userId':10299171,'missionType':'shareAct','inviteNum':1,'buyerNick':$.MixNick};
			body=_0x5338bf('/jdCardRunning/customer/inviteList',admJson);
			break;
		case 'getCarInfo':
		    url=`${domain}/dm/front/jdCardRunning/carInfo/getCarInfo?open_id=&mix_nick=${$.MixNick}`;
			body=_0x5338bf('/jdCardRunning/cusShop/getCusShop',{});
            break;
		case 'exchange':
		    url=`${domain}/dm/front/jdCardRunning/exchange/exchangeJdMarket?open_id=&mix_nick=${$.MixNick}`;
			admJson={"awardId": "10082bd15b4703","userId": 10299171,"actId": 1760007,"buyerNick": $.inviteNick}
			body=_0x5338bf('/jdCardRunning/exchange/exchangeJdMarket',admJson);
            break;			
		default:
			console.log('错误'+type);
	}
	let myRequest=getPostRequest(url,body,method);
	return new Promise(async resolve=>{
		$.post(myRequest,(err,resp,data)=>{
			try{
				if(err){
					if(resp&&resp.statusCode&&resp.statusCode==493){
						console.log('此ip已被限制，请过10分钟后再执行脚本');
						$.outFlag=true;
					}
					console.log(`${$.toStr(err,err)}`)
					console.log(' API请求失败，请检查网路重试');
				}else{
					dealReturn(type,data);
				}
			}catch(e){
				console.log(e,resp);
			}
			finally{
				resolve();
			}
		});
	});
}
async function dealReturn(type,data){
	let res='';
	try{
		if(type!='accessLogWithAD'||type!='drawContent'){
			if(data){
				res=JSON.parse(data);
			}
		}
	}catch(e){
		console.log(`${type} 执行任务异常`);
		console.log(data);
		$.runFalag=false;
	}
    try{
		switch(type){
			case 'isvObfuscator':
				if(typeof res == 'object'){
					if (res.errcode == 0){
					if (typeof res.token!='undefined') $.Token=res.token;
				} else if (res.message){
					console.log(`isvObfuscator ${res.message}`)
				} else {
					console.log(data);
				}
				} else {
					console.log(data);
				}
				break;
			case 'getCusShop':
				if ( typeof res=='object' ){
					if (res.success && res.success===true && res.data){
					if (res.data.status&&res.data.status==200){
						$.userIds=res.data.data.cusShop.userId;
					}
				} else if (res.message){
					console.log(`${type} ${res.message}`)
				} else {
					console.log(data);
				}
				} else {
					console.log(data);
				}
				break;
			case 'getCusShopProduct':
				if(typeof res=='object'){
					if(res.success&&res.success===true&&res.data){
					if(res.data.status&&res.data.status==200){
						$.goodsNumId=res.data.data.cusShopProduct.numId;
					}
				}else if(res.message){
					console.log(`${type} ${res.message}`)
				}else{
					console.log(data);
				}
				}else{
					console.log(data);
				}
				break;
			case 'taskList':
				if(typeof res=='object'){
					if(res.success&&res.success===true&&res.data){
					if(res.data.status&&res.data.status==200){
						$.taskLists=res.data.data||[];
					}
				}else if(res.message){
					console.log(`${type} ${res.message}`)
				}else{
					console.log(data);
				}
				}else{
					console.log(data);
				}
				break;
			case 'getCarInfo':
				if(typeof res=='object'){
					if(res.success&&res.success===true&&res.data){
					if(res.data.status&&res.data.status==200){
						$.carlist=res.data.data||[];
						$.usecar = $.carlist.reverse().find(item => item.isUnlock === true)
                        console.log(`使用我最牛X的${$.usecar.carName}进行游戏！`)
                        let pointArr = [{id:1,point:100},{id:2,point:150},{id:3,point:200},{id:4,point:300}]
                        $.point = pointArr.find(a => a.id === $.usecar.id)
					}
				}else if(res.message){
					console.log(`${type} ${res.message}`)
				}else{
					console.log(data);
				}
				}else{
					console.log(data);
				}
				break;			
			case 'playGame':
				if(typeof res=='object'){
				    	if(res.success&&res.success===true&&res.data){
				    	    if(res.data.status&&res.data.status==200){
				    	    	$.gameLogId=res.data.data.gameLogId;
				    	    	console.log(`游戏ID： ${$.gameLogId}`);
				    	    }
				        }else if(res.message){  
				    	    console.log(`${type} ${res.message}`)
				        }else{  
				            console.log(data);
				        }
				}else{
					console.log(data);
				}
				break;
			case 'sendGameAward':
				if(typeof res=='object'){
				    if(res.success&&res.data){
				        console.log(`游戏完成，获得${$.point.point}能量!`);
				       }else if(res.message){
				            console.log(`${type} ${res.message}`)
				       }else{
				            console.log(data);
				       }
				}else{
					console.log(data);
				}
				break;
			case 'exchange':
				if(typeof res=='object'){
				    if(res.success&&res.data){
				        console.log(res.data.msg);
				       }else if(res.message){
				            console.log(`${type} ${res.message}`)
				       }else{
				            console.log(data);
				       }
				}else{
					console.log(data);
				}
				break;				
			case 'accessLogWithAD':
			case 'drawContent':
				break;
            case 'specialSign':
			case 'activity_load':
			case 'setMixNick':
			case 'followShop':
			case 'doTask':
			case 'addCart':
			case 'missionInviteList':
			case'绑定':
			case'助力':
                let title=''
				if(type=='followShop')title='关注';
				if(type=='addCart')title='加购';
                if(type=='specialSign')title='签到';
				if(typeof res=='object'){
					if(res.success&&res.success===true&&res.data){
					if(res.data.status&&res.data.status==200){
						res=res.data;
						if(type!='setMixNick'&&(res.msg||res.data.remark)){
                        console.log((title&&title+':'||'')+(res.msg||res.data.isOpenCard||res.data.remark||''));
                        }
						if(type=='activity_load'){
							if(res.data){
								$.MixNick = res.data.missionCustomer.buyerNick || '';
								$.hasCollectShop = res.data.missionCustomer.hasCollectShop || 0;
								$.totalPoint = res.data.missionCustomer.totalPoint || 0;
								$.remainPoint = res.data.missionCustomer.remainPoint || 0;
								$.remainChance = res.data.missionCustomer.remainChance|| 0;
							}
						}else if(type=='missionInviteList'){
							console.log(`本月已邀请助力(${res.data.total})`);
						}
					}else if(res.data.msg){
						console.log(res.data.msg);
					}else if(res.errorMessage){
						console.log(`${type} ${res.errorMessage}`)
					}else{
						console.log(data);
					}
				}else if(res.errorMessage){
					console.log(`${type} ${res.errorMessage}`)
				}else{
					console.log(data);
				}
				}else{
					console.log(data);
				}
				break;
			default:
				console.log(data);
		}
        if(typeof res=='object'){
			if(res.errorMessage){
				if(res.errorMessage.indexOf('火爆')>-1){$.hotFlag = true}
			}
		}
	}catch(e){
		console.log(e);
	}
}
function getPostRequest(url,body,method='POST'){
	let headers={
		'Accept':'application/json',
		'Accept-Encoding':'gzip, deflate, br',
		'Accept-Language':'zh-cn','Connection':'keep-alive',
		'Content-Type':'application/x-www-form-urlencoded',
		'Cookie':cookie,
		'User-Agent':$['UA'],
		'X-Requested-With':'XMLHttpRequest'
	};
	if(url.indexOf('https://mpdz-car-dz.isvjcloud.com')>-1){
		headers['Origin']='https://mpdz-car-dz.isvjcloud.com';
		headers['Content-Type']='application/json; charset=utf-8';
		delete headers.Cookie;
	}
	return{'url':url,'method':method,'headers':headers,'body':body,'timeout':30000};
}

function randomString(e) {
    e = e || 32;
    let t = "abcdef0123456789", a = t.length, n = "";
    for (i = 0; i < e; i++)
      n += t.charAt(Math.floor(Math.random() * a));
    return n
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
async function getUA(){
  $.UA = `jdapp;iPhone;10.1.4;13.1.2;${randomString(40)};network/wifi;model/iPhone8,1;addressid/2308460611;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}
var _0xodu='jsjiami.com.v6',_0xodu_=['‮_0xodu'],_0x41f4=[_0xodu,'\x62\x79\x76\x43\x6b\x4d\x4b\x47\x47\x43\x33\x43\x71\x41\x3d\x3d','\x77\x34\x38\x70\x55\x38\x4f\x5a\x52\x51\x3d\x3d','\x77\x34\x7a\x43\x76\x73\x4f\x57\x61\x4d\x4f\x4c\x62\x51\x3d\x3d','\x77\x37\x74\x43\x77\x37\x58\x43\x6f\x38\x4f\x32\x77\x72\x39\x6f','\x77\x71\x37\x44\x6a\x63\x4f\x37\x77\x34\x7a\x44\x73\x77\x3d\x3d','\x64\x46\x41\x2b\x77\x35\x66\x44\x71\x41\x3d\x3d','\x77\x70\x2f\x44\x6e\x4d\x4f\x7a\x77\x35\x41\x4d','\x58\x73\x4f\x62\x77\x6f\x63\x3d','\x59\x63\x4f\x6c\x77\x34\x44\x43\x69\x42\x4c\x44\x6c\x55\x56\x30\x66\x79\x45\x50\x66\x44\x4d\x43\x4c\x73\x4b\x6c\x62\x73\x4b\x58','\x50\x38\x4f\x30\x77\x6f\x64\x32\x45\x48\x76\x43\x76\x73\x4f\x42\x41\x4d\x4b\x4f\x50\x73\x4b\x6b\x53\x63\x4f\x4d\x77\x35\x39\x30\x77\x72\x62\x44\x6b\x68\x41\x6f\x77\x72\x63\x54\x77\x36\x4c\x44\x6e\x38\x4f\x5a\x77\x70\x56\x33\x77\x37\x52\x75\x50\x51\x38\x58','\x77\x6f\x2f\x44\x73\x77\x68\x6f\x77\x71\x55\x62\x77\x70\x51\x3d','\x49\x77\x33\x44\x68\x6c\x50\x43\x71\x67\x3d\x3d','\x61\x73\x4b\x35\x65\x4d\x4b\x57\x77\x71\x76\x43\x6d\x63\x4b\x44','\x77\x36\x7a\x44\x68\x4d\x4b\x4b\x77\x34\x72\x44\x6c\x51\x3d\x3d','\x50\x73\x4f\x52\x42\x4d\x4b\x6b\x57\x41\x3d\x3d','\x77\x72\x54\x43\x68\x51\x54\x43\x6e\x69\x73\x3d','\x63\x6e\x6a\x44\x73\x67\x3d\x3d','\x53\x31\x50\x43\x69\x33\x48\x44\x76\x30\x78\x35\x46\x4d\x4b\x4d\x4e\x4d\x4f\x61','\x77\x36\x70\x31\x55\x32\x55\x2f\x77\x70\x66\x43\x6f\x63\x4b\x70\x77\x37\x67\x3d','\x77\x72\x50\x43\x76\x38\x4b\x57','\x4b\x73\x4f\x36\x77\x6f\x4e\x75\x41\x43\x4c\x43\x76\x73\x4b\x34\x56\x38\x4b\x61\x4d\x73\x4f\x6f\x52\x63\x4f\x6f\x77\x6f\x5a\x2f\x77\x37\x51\x3d','\x77\x34\x6a\x43\x76\x73\x4f\x58\x59\x73\x4f\x32\x63\x57\x54\x43\x74\x4d\x4f\x6b\x77\x36\x72\x44\x74\x77\x3d\x3d','\x54\x7a\x59\x47\x77\x35\x6a\x44\x71\x77\x3d\x3d','\x77\x71\x51\x4d\x77\x70\x54\x44\x6b\x56\x6f\x3d','\x77\x34\x45\x46\x77\x71\x6e\x44\x69\x67\x3d\x3d','\x64\x55\x77\x49\x77\x35\x48\x44\x6b\x33\x34\x3d','\x77\x6f\x44\x44\x71\x73\x4b\x76\x5a\x78\x77\x3d','\x57\x79\x59\x58\x77\x36\x50\x44\x68\x73\x4f\x31','\x6a\x72\x73\x56\x6a\x46\x69\x52\x61\x70\x46\x45\x5a\x6d\x69\x2e\x50\x6c\x77\x63\x6f\x56\x75\x6d\x57\x50\x2e\x76\x36\x3d\x3d'];if(function(_0x228b1c,_0x5a7f3c,_0x4f4eb2){function _0x2bfefd(_0x52acb3,_0x4fd5c6,_0x143505,_0x519166,_0x1cfdce,_0x32b7de){_0x4fd5c6=_0x4fd5c6>>0x8,_0x1cfdce='po';var _0x4f808d='shift',_0x151be3='push',_0x32b7de='‮';if(_0x4fd5c6<_0x52acb3){while(--_0x52acb3){_0x519166=_0x228b1c[_0x4f808d]();if(_0x4fd5c6===_0x52acb3&&_0x32b7de==='‮'&&_0x32b7de['length']===0x1){_0x4fd5c6=_0x519166,_0x143505=_0x228b1c[_0x1cfdce+'p']();}else if(_0x4fd5c6&&_0x143505['replace'](/[rVFRpFEZPlwVuWP=]/g,'')===_0x4fd5c6){_0x228b1c[_0x151be3](_0x519166);}}_0x228b1c[_0x151be3](_0x228b1c[_0x4f808d]());}return 0x12795d;};function _0x1f8bf8(){var _0x3a6d29={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x3ac60b,_0x51a44a,_0x14d7ae,_0x1e60b2){_0x1e60b2=_0x1e60b2||{};var _0x566bf2=_0x51a44a+'='+_0x14d7ae;var _0x46c487=0x0;for(var _0x46c487=0x0,_0x4ce3c8=_0x3ac60b['length'];_0x46c487<_0x4ce3c8;_0x46c487++){var _0xd7a618=_0x3ac60b[_0x46c487];_0x566bf2+=';\x20'+_0xd7a618;var _0x248d63=_0x3ac60b[_0xd7a618];_0x3ac60b['push'](_0x248d63);_0x4ce3c8=_0x3ac60b['length'];if(_0x248d63!==!![]){_0x566bf2+='='+_0x248d63;}}_0x1e60b2['cookie']=_0x566bf2;},'removeCookie':function(){return'dev';},'getCookie':function(_0x38f4d9,_0x374971){_0x38f4d9=_0x38f4d9||function(_0x442d3a){return _0x442d3a;};var _0x4e416f=_0x38f4d9(new RegExp('(?:^|;\x20)'+_0x374971['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x4ae32e=typeof _0xodu=='undefined'?'undefined':_0xodu,_0x3bec85=_0x4ae32e['split'](''),_0x3ed3c5=_0x3bec85['length'],_0x30c94a=_0x3ed3c5-0xe,_0x503fa6;while(_0x503fa6=_0x3bec85['pop']()){_0x3ed3c5&&(_0x30c94a+=_0x503fa6['charCodeAt']());}var _0x4afa82=function(_0x304ba0,_0x456ac0,_0x1476f9){_0x304ba0(++_0x456ac0,_0x1476f9);};_0x30c94a^-_0x3ed3c5===-0x524&&(_0x503fa6=_0x30c94a)&&_0x4afa82(_0x2bfefd,_0x5a7f3c,_0x4f4eb2);return _0x503fa6>>0x2===0x14b&&_0x4e416f?decodeURIComponent(_0x4e416f[0x1]):undefined;}};function _0x323a07(){var _0x4887b9=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x4887b9['test'](_0x3a6d29['removeCookie']['toString']());};_0x3a6d29['updateCookie']=_0x323a07;var _0x2c6f6f='';var _0x1cd426=_0x3a6d29['updateCookie']();if(!_0x1cd426){_0x3a6d29['setCookie'](['*'],'counter',0x1);}else if(_0x1cd426){_0x2c6f6f=_0x3a6d29['getCookie'](null,'counter');}else{_0x3a6d29['removeCookie']();}};_0x1f8bf8();}(_0x41f4,0x66,0x6600),_0x41f4){_0xodu_=_0x41f4['length']^0x66;};function _0x16d6(_0x1eae53,_0x4a68f8){_0x1eae53=~~'0x'['concat'](_0x1eae53['slice'](0x1));var _0x526d12=_0x41f4[_0x1eae53];if(_0x16d6['rGuDrZ']===undefined){(function(){var _0xca7600=function(){var _0x3979e5;try{_0x3979e5=Function('return\x20(function()\x20'+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(_0x1ae6cb){_0x3979e5=window;}return _0x3979e5;};var _0x14ba56=_0xca7600();var _0x2b25f9='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x14ba56['atob']||(_0x14ba56['atob']=function(_0x144f71){var _0x26348a=String(_0x144f71)['replace'](/=+$/,'');for(var _0x48f2cb=0x0,_0x20224e,_0x29b995,_0x3cfcbe=0x0,_0x1715cb='';_0x29b995=_0x26348a['charAt'](_0x3cfcbe++);~_0x29b995&&(_0x20224e=_0x48f2cb%0x4?_0x20224e*0x40+_0x29b995:_0x29b995,_0x48f2cb++%0x4)?_0x1715cb+=String['fromCharCode'](0xff&_0x20224e>>(-0x2*_0x48f2cb&0x6)):0x0){_0x29b995=_0x2b25f9['indexOf'](_0x29b995);}return _0x1715cb;});}());function _0x5cd61b(_0x55da99,_0x4a68f8){var _0x4c3102=[],_0x424db6=0x0,_0x329a0a,_0x79202e='',_0x47a45c='';_0x55da99=atob(_0x55da99);for(var _0x1e23a9=0x0,_0x445160=_0x55da99['length'];_0x1e23a9<_0x445160;_0x1e23a9++){_0x47a45c+='%'+('00'+_0x55da99['charCodeAt'](_0x1e23a9)['toString'](0x10))['slice'](-0x2);}_0x55da99=decodeURIComponent(_0x47a45c);for(var _0x466657=0x0;_0x466657<0x100;_0x466657++){_0x4c3102[_0x466657]=_0x466657;}for(_0x466657=0x0;_0x466657<0x100;_0x466657++){_0x424db6=(_0x424db6+_0x4c3102[_0x466657]+_0x4a68f8['charCodeAt'](_0x466657%_0x4a68f8['length']))%0x100;_0x329a0a=_0x4c3102[_0x466657];_0x4c3102[_0x466657]=_0x4c3102[_0x424db6];_0x4c3102[_0x424db6]=_0x329a0a;}_0x466657=0x0;_0x424db6=0x0;for(var _0x37b22b=0x0;_0x37b22b<_0x55da99['length'];_0x37b22b++){_0x466657=(_0x466657+0x1)%0x100;_0x424db6=(_0x424db6+_0x4c3102[_0x466657])%0x100;_0x329a0a=_0x4c3102[_0x466657];_0x4c3102[_0x466657]=_0x4c3102[_0x424db6];_0x4c3102[_0x424db6]=_0x329a0a;_0x79202e+=String['fromCharCode'](_0x55da99['charCodeAt'](_0x37b22b)^_0x4c3102[(_0x4c3102[_0x466657]+_0x4c3102[_0x424db6])%0x100]);}return _0x79202e;}_0x16d6['mtORvi']=_0x5cd61b;_0x16d6['DOvxBA']={};_0x16d6['rGuDrZ']=!![];}var _0x59399e=_0x16d6['DOvxBA'][_0x1eae53];if(_0x59399e===undefined){if(_0x16d6['IUfwEt']===undefined){var _0x2bcf42=function(_0x38bca8){this['GRQaoN']=_0x38bca8;this['VkXewN']=[0x1,0x0,0x0];this['BCoSsO']=function(){return'newState';};this['BQbbzH']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['ysAMmO']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x2bcf42['prototype']['IDTFJK']=function(){var _0x39d5df=new RegExp(this['BQbbzH']+this['ysAMmO']);var _0x1fb40b=_0x39d5df['test'](this['BCoSsO']['toString']())?--this['VkXewN'][0x1]:--this['VkXewN'][0x0];return this['jcaFNN'](_0x1fb40b);};_0x2bcf42['prototype']['jcaFNN']=function(_0x354203){if(!Boolean(~_0x354203)){return _0x354203;}return this['LdwiCB'](this['GRQaoN']);};_0x2bcf42['prototype']['LdwiCB']=function(_0x3221b6){for(var _0x325dd2=0x0,_0x260351=this['VkXewN']['length'];_0x325dd2<_0x260351;_0x325dd2++){this['VkXewN']['push'](Math['round'](Math['random']()));_0x260351=this['VkXewN']['length'];}return _0x3221b6(this['VkXewN'][0x0]);};new _0x2bcf42(_0x16d6)['IDTFJK']();_0x16d6['IUfwEt']=!![];}_0x526d12=_0x16d6['mtORvi'](_0x526d12,_0x4a68f8);_0x16d6['DOvxBA'][_0x1eae53]=_0x526d12;}else{_0x526d12=_0x59399e;}return _0x526d12;};var _0xaad316=function(_0x12f354){var _0x1c89f2=!![];return function(_0x536886,_0xcf0292){var _0x508e5d='‮';var _0x55e22e=_0x1c89f2?function(){if(_0x508e5d==='‮'&&_0xcf0292){var _0x21af01=_0xcf0292['apply'](_0x536886,arguments);_0xcf0292=null;return _0x21af01;}}:function(_0x12f354){};_0x1c89f2=![];var _0x12f354='‮';return _0x55e22e;};}();var _0x3e6641=_0xaad316(this,function(){var _0x2466d8=function(){return'\x64\x65\x76';},_0x3ea270=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x26ab9b=function(){var _0x21ad5c=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x21ad5c['\x74\x65\x73\x74'](_0x2466d8['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x1fccd1=function(){var _0x809f97=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x809f97['\x74\x65\x73\x74'](_0x3ea270['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x4ecd81=function(_0x140877){var _0x1a8a06=~-0x1>>0x1+0xff%0x0;if(_0x140877['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x1a8a06)){_0x5d425e(_0x140877);}};var _0x5d425e=function(_0x2619ba){var _0x2d864d=~-0x4>>0x1+0xff%0x0;if(_0x2619ba['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x2d864d){_0x4ecd81(_0x2619ba);}};if(!_0x26ab9b()){if(!_0x1fccd1()){_0x4ecd81('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x4ecd81('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x4ecd81('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x3e6641();const _0x802a93=require(_0x16d6('‮0','\x23\x51\x45\x21'));function _0x5338bf(_0x48a3bb,_0x40c479){var _0x268b8c={'\x71\x42\x4c\x42\x74':_0x16d6('‮1','\x2a\x43\x77\x45'),'\x6b\x77\x58\x77\x6d':_0x16d6('‫2','\x45\x34\x77\x5d'),'\x75\x6f\x67\x76\x57':_0x16d6('‮3','\x66\x47\x28\x35')};let _0x362f99={'actId':$[_0x16d6('‫4','\x53\x64\x4d\x45')],..._0x40c479,'method':_0x48a3bb,'userId':$['\x75\x73\x65\x72\x49\x64'],'buyerNick':$['\x4d\x69\x78\x4e\x69\x63\x6b']||''};let _0x168dc9=_0x550691(_0x362f99);const _0x410204={'jsonRpc':_0x268b8c[_0x16d6('‫5','\x77\x5e\x67\x61')],'params':{'commonParameter':{'m':_0x16d6('‫6','\x6f\x52\x51\x54'),..._0x168dc9,'userId':$[_0x16d6('‮7','\x2a\x33\x6a\x67')]},'admJson':{'actId':$[_0x16d6('‫8','\x29\x41\x23\x6d')],..._0x40c479,'method':_0x48a3bb,'userId':$[_0x16d6('‫9','\x53\x64\x4d\x45')],'buyerNick':$[_0x16d6('‫a','\x68\x6e\x36\x64')]||''}}};if(_0x48a3bb['\x69\x6e\x64\x65\x78\x4f\x66'](_0x268b8c[_0x16d6('‫b','\x26\x42\x59\x39')])>-0x1){delete _0x410204[_0x16d6('‫c','\x66\x47\x28\x35')][_0x16d6('‮d','\x7a\x41\x49\x6f')][_0x16d6('‫e','\x25\x36\x7a\x53')];}return $[_0x16d6('‫f','\x2a\x33\x6a\x67')](_0x410204,_0x268b8c[_0x16d6('‫10','\x40\x63\x48\x65')]);}function _0x550691(_0x135459){var _0x2b1001={'\x53\x58\x58\x62\x66':function(_0x2568dd,_0x32c14f){return _0x2568dd(_0x32c14f);},'\x5a\x74\x4f\x6b\x79':_0x16d6('‮11','\x26\x5a\x74\x53'),'\x64\x66\x52\x4a\x6b':'\x25\x37\x45','\x56\x51\x61\x74\x46':function(_0x18185e,_0x2f1424){return _0x18185e+_0x2f1424;},'\x56\x48\x77\x42\x75':function(_0x4fd82e,_0x346bb3){return _0x4fd82e+_0x346bb3;},'\x69\x50\x62\x6b\x67':function(_0x3a5e41,_0xeb1601){return _0x3a5e41+_0xeb1601;},'\x4d\x65\x51\x42\x74':_0x16d6('‫12','\x6e\x63\x69\x50'),'\x71\x79\x50\x6a\x54':_0x16d6('‮13','\x45\x34\x77\x5d')};let _0x1becb7=new Date()[_0x16d6('‮14','\x21\x34\x55\x29')](),_0x25556c=JSON['\x73\x74\x72\x69\x6e\x67\x69\x66\x79'](_0x135459),_0x5cf5ba=new RegExp('\x27','\x67'),_0x21732b=new RegExp('\x7e','\x67'),_0xfa8925=_0x2b1001[_0x16d6('‮15','\x38\x4b\x62\x76')](encodeURIComponent,_0x25556c);_0xfa8925=_0xfa8925['\x72\x65\x70\x6c\x61\x63\x65'](_0x5cf5ba,_0x2b1001['\x5a\x74\x4f\x6b\x79']),_0xfa8925=_0xfa8925[_0x16d6('‫16','\x5a\x52\x55\x25')](_0x21732b,_0x2b1001['\x64\x66\x52\x4a\x6b']);let _0x32df53=_0x2b1001['\x56\x51\x61\x74\x46'](_0x2b1001[_0x16d6('‫17','\x4f\x2a\x6a\x34')](_0x2b1001['\x69\x50\x62\x6b\x67'](_0x2b1001[_0x16d6('‫18','\x4b\x5a\x56\x49')],_0xfa8925),'\x7a')+_0x1becb7,_0x2b1001[_0x16d6('‮19','\x4d\x70\x53\x40')]);return{'sign':_0x802a93[_0x16d6('‫1a','\x45\x39\x6f\x42')](_0x32df53[_0x16d6('‮1b','\x45\x39\x6f\x42')]())['\x74\x6f\x53\x74\x72\x69\x6e\x67'](),'timeStamp':_0x1becb7};};_0xodu='jsjiami.com.v6';
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}