/*
头文字J 每月限兑换一次
活动快捷入口： 11:/参与头文字J，集能量兑换京豆，【Jιιngヵ栋】 ￥Z9yfjBqzLWt￥
日常任务，助力，游戏
第一个账号助力作者 其他依次助力CK1
默认不做加购任务，如需要设置变量erport car_addsku='true'
45 8,18 * * * jd_mpdz_car.js 
*/

const $ = new Env("头文字JJJ");
const jdCookieNode=$.isNode()?require('./jdCookie.js'):'';
const notify=$.isNode()?require('./sendNotify'):'';
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
	console.log('活动快捷入口： 11:/参与头文字J，集能量兑换京豆，【Jιιngヵ栋】 ￥Z9yfjBqzLWt￥');
    if (!cookiesArr[0]) {
      $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
        "open-url": "https://bean.m.jd.com/"
      });
      return;
    }
	$.appkey='21699045';
	$.userId='10299171';
	$.actId='1760007';
	$.inviteNick=shareUuid;
	for(let o=0;o<cookiesArr.length;o++){
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
                    break;
                case 'viewCommodity':
                    for(let i=0;i<3;i++){
                        $.missionType='viewCommodity';
                        await takePostRequest('doTask');
                        await $.wait(parseInt(Math.random()*1000+1000,10));
                    }
                    break;
                case 'collectShop':
                    for(let i=0;i<3;i++){
                        await takePostRequest('getCusShop');
                        $.missionType='collectShop';
                        await takePostRequest('followShop');
                        await $.wait(parseInt(Math.random()*1000+1000,10));
                    }
                    break;
                case 'addCart':
                    if (process.env.car_addsku && process.env.car_addsku === 'true'){
                    for(let i=0;i<3;i++){
                        await takePostRequest('getCusShopProduct');
                        $.missionType='addCart';
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
		console.log(`当前能量值：${$.totalPoint}\n`);
		await takePostRequest('missionInviteList');
        await $.wait(1000);
        console.log(`去助力：${$.inviteNick}`);
		await takePostRequest('助力'); 
		if($.index==1){
			$.inviteNick=$.MixNick;
			console.log(`后面的号都会助力：${$.inviteNick}`);
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
			url='https://api.m.jd.com/client.action?functionId=isvObfuscator';
			body='body=%7B%22id%22%3A%22%22%2C%22url%22%3A%22https%3A%2F%2Fmpdz-car-dz.isvjcloud.com%2Fjdbeverage%2Fpages%2Fpaoku%2Fpaoku%3FpushWay%3D2%26collectionId%3D102%26tttparams%3DE1roDCIeyJkTGF0IjowLCJkTG5nIjowLCJnTGF0IjoiMzEuMTM5IiwiZ0xuZyI6IjEyMS40MjM4ODIiLCJncHNfYXJlYSI6IjJfMjgxM182MTEzMF8wIiwibGF0IjozMS4xMzgzOCwibG5nIjoxMjEuNDIzNjM5LCJtb2RlbCI6IkxZQS1BTDAwIiwicHJzdGF0ZSI6IjAiLCJ1bl9hcmVhIjoiMl8yODEzXzYxMTMwXzAifQ7%253D%253D%26sid%3D064681b1f54d7a776f9c0c12c26a2ecw%26un_area%3D2_2813_61130_0%22%7D&clientVersion=11.0.2&client=android&lang=zh_CN&ef=1&ep=%7B%22cipher%22%3A%7B%22uuid%22%3A%22ZwS1ZQC4ZwVrZJZuDzC0ZK%3D%3D%22%2C%22aid%22%3A%22ZwS1ZQC4ZwVrZJZuDzC0ZK%3D%3D%22%7D%2C%22ciphertype%22%3A5%2C%22version%22%3A%221.2.0%22%7D&st=1654963217789&sign=9f925500f3898b80c30ac396d524d5c8&sv=121';
            break;
		case 'activity_load':
			url=`${domain}/dm/front/jdCardRunning/activity/load?open_id=&mix_nick=${$.MixNick}&push_way=3&user_id=`;
			admJson={'jdToken':$.Token,'inviteNick':$.inviteNick};
			body=_0x5211e3('/jdCardRunning/activity/load',admJson);
			break;
		case 'taskList':
			url=`${domain}/dm/front/jdCardRunning/mission/completeState?open_id=&mix_nick=${$.MixNick}`;
			admJson={};
			body=_0x5211e3('/jdCardRunning/mission/completeState',admJson);
			break;
		case'绑定':
			url=`${domain}/dm/front/jdCardRunning/mission/completeMission?open_id=&mix_nick=${$.MixNick}`;
			admJson={'missionType':'shareAct','inviterNick':$.inviteNick||''};
			body=_0x5211e3('/jdCardRunning/mission/completeState',admJson);
			break;
		case'助力':
			url=`${domain}/dm/front/jdCardRunning/mission/completeMission?open_id=&mix_nick=${$.MixNick}`;
			admJson={'missionType':'shareAct','inviterNick':$.inviteNick||'','userId':10299171};
			body=_0x5211e3('/jdCardRunning/mission/completeMission',admJson);
			break;
		case'followShop':
			url=`${domain}/dm/front/jdCardRunning/mission/completeMission?open_id=&mix_nick=${$.MixNick}`;
			admJson={'missionType':$.missionType,'userId':10299171,'shopId':$.userIds,'buyerNick':$.inviteNick};
			body=_0x5211e3('/jdCardRunning/mission/completeMission',admJson);
			break;
		case'addCart':
			url=`${domain}/dm/front/jdCardRunning/mission/completeMission?open_id=&mix_nick=${$.MixNick}`;
			admJson={'missionType':$.missionType,'userId':10299171,'goodsNumId':$.goodsNumId,'buyerNick':$.inviteNick};
			body=_0x5211e3('/jdCardRunning/mission/completeMission',admJson);
			break;
		case 'getCusShop':
			url=`${domain}/dm/front/jdCardRunning/cusShop/getCusShop?open_id=&mix_nick=${$.MixNick}`;
			admJson={};
			body=_0x5211e3('/jdCardRunning/cusShop/getCusShop',admJson);
			break;
		case 'getCusShopProduct':
			url=`${domain}/dm/front/jdCardRunning/cusShop/getCusShopProduct?open_id=&mix_nick=${$.MixNick}`;
			admJson={};
			body=_0x5211e3('/jdCardRunning/cusShop/getCusShop',admJson);
			break;
		case 'doTask':
			url=`${domain}/dm/front/jdCardRunning/mission/completeMission?open_id=&mix_nick=${$.MixNick}`;
			admJson={'actId':$.actId,'missionType':$.missionType};
			body=_0x5211e3('/jdCardRunning/mission/completeMission',admJson);
			break;
		case 'playGame':
			url=`${domain}/dm/front/jdCardRunning/game/playGame?open_id=&mix_nick=${$.MixNick}`;
			admJson={'actId':$.actId,'carId':$.usecar.id,'carName':$.usecar.carName,'userId':10299171,'buyerNick':$.inviteNick};
			body=_0x5211e3('/jdCardRunning/game/playGame',admJson);
			break;
		case 'sendGameAward':
			url=`${domain}/dm/front/jdCardRunning/game/sendGameAward?open_id=&mix_nick=${$.MixNick}`;
			admJson={'actId':$.actId,'point':$.point.point||300,'gameLogId':$.gameLogId,'userId':10299171,'buyerNick':$.inviteNick};
			body=_0x5211e3('/jdCardRunning/game/sendGameAward',admJson);
			break;
		case 'missionInviteList':
			url=`${domain}/dm/front/jdCardRunning/customer/inviteList?open_id=&mix_nick=${$.MixNick}`;
			admJson={'actId':$.actId,'userId':10299171,'missionType':'shareAct','inviteNum':1,'buyerNick':$.MixNick};
			body=_0x5211e3('/jdCardRunning/customer/inviteList',admJson);
			break;
		case 'getCarInfo':
		    url=`${domain}/dm/front/jdCardRunning/carInfo/getCarInfo?open_id=&mix_nick=${$.MixNick}`;
			body=_0x5211e3('/jdCardRunning/cusShop/getCusShop',{});
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
;var encode_version = 'jsjiami.com.v5', bjutk = '__0xe3bae',  __0xe3bae=['HjjDrsOrwrLDjcOrdxTCpMO+w5TCq8OMCRXCgg==','HHsZw5E1P8OUw7wPw53Dkg==','w7p3ZsKowq8=','w6IDS8O1DSs=','woI+w6dOwp/DlxA=','wo7DvcKkOn4=','YDZgSMK5','CsObw7vDmwvCoA==','w5Nde8KKwrg=','wpVpM1MhNQ==','w5tVLjF3','w5TCnsODwqjDnns=','wpJaw63Dp8OBwr98','w7DCkHQiwpY=','wrXCpVjDoVLDgGs=','w6HDux7DqHE=','wpQmw7dCw7EI','XcK8GsKAMMK3dA==','fHfChMOgJg==','wprDhsKzEsKr','w6HCh1QGwrU=','dRzDhMK2AsO7w6DChxbDviHCv8KARcKkRMKDw7Mvw4PCmMK+WgrDqcOlw7bCoMO0wp5sJg==','w4rCvsOU','Z8OHwps=','Ki8wIXTDl2g=','JlzDkcK4UMOm','e8K9Y20IfTpXAw==','cCnDh3jDgg==','NMKRwrITUxQ8','G24Yw5MLN8OOw64j','w4/CvE0dwqg=','Gn8aw5YEM8OC','NcKNLGER','OS4tJ2bDm2M=','TCrDrV3Dig==','wpB0PFQt','woXDrVvDrl8=','C0vDisKMMg==','w5dZQynDnQ==','w7nCvcKIFH8=','w5ZjAjJr','wo7DvMKTOV3DpA==','DEvDkcKdZA==','PHcvw4sx','HsKvFiJSwro=','w5ddU8KjwpM=','JV5f','M0PDrcK8QsO6wqTDsEfCvSA=','YcKeNcKrwrjClklQ','wolxcg==','w418ajzDosK3w5QiEg==','w70DRMOuJSIfw57DqitTOMK7wqw=','w4bCpsK9','54m05p6b5Y2C77ydwp1+5L2t5ay65p2J5b6T56uS77yU6L2J6K2T5pWI5o+X5om+5Lm155uC5bW05L+s','5YiR6Zit54mv5p6b5Yyw776mw6AF5L6U5a2W5p+e5b+f56uY','Dm0ww68L','LS0LOEs=','GwfDicO6wrI=','w7xbQcKywps=','BTPDucOCwpA=','wodVBXI4','FsO/e8OsEA==','w7tdEcKiQw==','w71GCsKSXQ==','I8Odw7fCoH4=','w4lmP8KYbg==','JMOEVcOWPQ==','wqwlw6ZwwoLDm1bDscO9','QcKKwqs=','bMO4w6ZF'];(function(_0x2fbfda,_0x31f190){var _0x39e2bf=function(_0x3b4b24){while(--_0x3b4b24){_0x2fbfda['push'](_0x2fbfda['shift']());}};var _0x5d8f43=function(){var _0x560e8c={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x5f7bc2,_0x3d3ece,_0x52cebf,_0x5e86ee){_0x5e86ee=_0x5e86ee||{};var _0x467af4=_0x3d3ece+'='+_0x52cebf;var _0x560bf1=0x0;for(var _0x560bf1=0x0,_0x35fc11=_0x5f7bc2['length'];_0x560bf1<_0x35fc11;_0x560bf1++){var _0x40f04f=_0x5f7bc2[_0x560bf1];_0x467af4+=';\x20'+_0x40f04f;var _0xcda472=_0x5f7bc2[_0x40f04f];_0x5f7bc2['push'](_0xcda472);_0x35fc11=_0x5f7bc2['length'];if(_0xcda472!==!![]){_0x467af4+='='+_0xcda472;}}_0x5e86ee['cookie']=_0x467af4;},'removeCookie':function(){return'dev';},'getCookie':function(_0x34fe47,_0x149f69){_0x34fe47=_0x34fe47||function(_0x1080fa){return _0x1080fa;};var _0x242a67=_0x34fe47(new RegExp('(?:^|;\x20)'+_0x149f69['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x487cba=function(_0xc88ef7,_0x40a7c1){_0xc88ef7(++_0x40a7c1);};_0x487cba(_0x39e2bf,_0x31f190);return _0x242a67?decodeURIComponent(_0x242a67[0x1]):undefined;}};var _0x5d8a72=function(){var _0x7fa1a0=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x7fa1a0['test'](_0x560e8c['removeCookie']['toString']());};_0x560e8c['updateCookie']=_0x5d8a72;var _0x4b2875='';var _0x4bb795=_0x560e8c['updateCookie']();if(!_0x4bb795){_0x560e8c['setCookie'](['*'],'counter',0x1);}else if(_0x4bb795){_0x4b2875=_0x560e8c['getCookie'](null,'counter');}else{_0x560e8c['removeCookie']();}};_0x5d8f43();}(__0xe3bae,0x1a1));var _0x56ae=function(_0xef1886,_0x1d3e89){_0xef1886=_0xef1886-0x0;var _0x54a30c=__0xe3bae[_0xef1886];if(_0x56ae['initialized']===undefined){(function(){var _0x9c310d=typeof window!=='undefined'?window:typeof process==='object'&&typeof require==='function'&&typeof global==='object'?global:this;var _0x4cfd66='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';_0x9c310d['atob']||(_0x9c310d['atob']=function(_0x37c6eb){var _0x2a05a1=String(_0x37c6eb)['replace'](/=+$/,'');for(var _0x57aed5=0x0,_0x12f61a,_0x298630,_0x278465=0x0,_0x4bb93f='';_0x298630=_0x2a05a1['charAt'](_0x278465++);~_0x298630&&(_0x12f61a=_0x57aed5%0x4?_0x12f61a*0x40+_0x298630:_0x298630,_0x57aed5++%0x4)?_0x4bb93f+=String['fromCharCode'](0xff&_0x12f61a>>(-0x2*_0x57aed5&0x6)):0x0){_0x298630=_0x4cfd66['indexOf'](_0x298630);}return _0x4bb93f;});}());var _0x1597af=function(_0x1761df,_0x1eaa8){var _0x5f7f17=[],_0x2b20b3=0x0,_0x21b1f1,_0x4b9c71='',_0x2444ad='';_0x1761df=atob(_0x1761df);for(var _0x210909=0x0,_0x1f9e1d=_0x1761df['length'];_0x210909<_0x1f9e1d;_0x210909++){_0x2444ad+='%'+('00'+_0x1761df['charCodeAt'](_0x210909)['toString'](0x10))['slice'](-0x2);}_0x1761df=decodeURIComponent(_0x2444ad);for(var _0x53f6c5=0x0;_0x53f6c5<0x100;_0x53f6c5++){_0x5f7f17[_0x53f6c5]=_0x53f6c5;}for(_0x53f6c5=0x0;_0x53f6c5<0x100;_0x53f6c5++){_0x2b20b3=(_0x2b20b3+_0x5f7f17[_0x53f6c5]+_0x1eaa8['charCodeAt'](_0x53f6c5%_0x1eaa8['length']))%0x100;_0x21b1f1=_0x5f7f17[_0x53f6c5];_0x5f7f17[_0x53f6c5]=_0x5f7f17[_0x2b20b3];_0x5f7f17[_0x2b20b3]=_0x21b1f1;}_0x53f6c5=0x0;_0x2b20b3=0x0;for(var _0x57bf23=0x0;_0x57bf23<_0x1761df['length'];_0x57bf23++){_0x53f6c5=(_0x53f6c5+0x1)%0x100;_0x2b20b3=(_0x2b20b3+_0x5f7f17[_0x53f6c5])%0x100;_0x21b1f1=_0x5f7f17[_0x53f6c5];_0x5f7f17[_0x53f6c5]=_0x5f7f17[_0x2b20b3];_0x5f7f17[_0x2b20b3]=_0x21b1f1;_0x4b9c71+=String['fromCharCode'](_0x1761df['charCodeAt'](_0x57bf23)^_0x5f7f17[(_0x5f7f17[_0x53f6c5]+_0x5f7f17[_0x2b20b3])%0x100]);}return _0x4b9c71;};_0x56ae['rc4']=_0x1597af;_0x56ae['data']={};_0x56ae['initialized']=!![];}var _0xdb74b8=_0x56ae['data'][_0xef1886];if(_0xdb74b8===undefined){if(_0x56ae['once']===undefined){var _0x5cdb22=function(_0x4ad0da){this['rc4Bytes']=_0x4ad0da;this['states']=[0x1,0x0,0x0];this['newState']=function(){return'newState';};this['firstState']='\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*';this['secondState']='[\x27|\x22].+[\x27|\x22];?\x20*}';};_0x5cdb22['prototype']['checkState']=function(){var _0x8a7a42=new RegExp(this['firstState']+this['secondState']);return this['runState'](_0x8a7a42['test'](this['newState']['toString']())?--this['states'][0x1]:--this['states'][0x0]);};_0x5cdb22['prototype']['runState']=function(_0x2dcfaf){if(!Boolean(~_0x2dcfaf)){return _0x2dcfaf;}return this['getState'](this['rc4Bytes']);};_0x5cdb22['prototype']['getState']=function(_0x37e448){for(var _0x253018=0x0,_0x48e33d=this['states']['length'];_0x253018<_0x48e33d;_0x253018++){this['states']['push'](Math['round'](Math['random']()));_0x48e33d=this['states']['length'];}return _0x37e448(this['states'][0x0]);};new _0x5cdb22(_0x56ae)['checkState']();_0x56ae['once']=!![];}_0x54a30c=_0x56ae['rc4'](_0x54a30c,_0x1d3e89);_0x56ae['data'][_0xef1886]=_0x54a30c;}else{_0x54a30c=_0xdb74b8;}return _0x54a30c;};const _0x1538a4=require(_0x56ae('0x0','q[hE'));function _0x5211e3(_0x242745,_0x4556c5){var _0x9375fb={'aqGhF':function _0x19c995(_0x186f39,_0xc8c264){return _0x186f39(_0xc8c264);},'UJxsF':_0x56ae('0x1','geeG'),'HIiks':_0x56ae('0x2','sxp('),'XfHkH':function _0x2e89b7(_0x19012b,_0x2bbb86){return _0x19012b>_0x2bbb86;},'nvyym':_0x56ae('0x3','d)pv'),'IqhOk':_0x56ae('0x4','pkmK')};tmp={'actId':$[_0x56ae('0x5','Q)z)')],..._0x4556c5,'method':_0x242745,'userId':$[_0x56ae('0x6','DIP!')],'buyerNick':$[_0x56ae('0x7','q[hE')]||''};let _0x1148a1=_0x9375fb[_0x56ae('0x8','BEkF')](_0x1d442c,tmp);const _0x83f0b2={'jsonRpc':_0x9375fb[_0x56ae('0x9','(K*0')],'params':{'commonParameter':{'appkey':$[_0x56ae('0xa','VRy9')],'m':_0x9375fb[_0x56ae('0xb','Q)z)')],..._0x1148a1,'userId':$[_0x56ae('0xc','JU0#')]},'admJson':{'actId':$[_0x56ae('0xd','^tkb')],..._0x4556c5,'method':_0x242745,'userId':$[_0x56ae('0xe','x$Z[')],'buyerNick':$[_0x56ae('0xf','q*Q2')]||''}}};if(_0x9375fb[_0x56ae('0x10','DgwE')](_0x242745[_0x56ae('0x11','YNS%')](_0x9375fb[_0x56ae('0x12','3KaV')]),-0x1)){delete _0x83f0b2[_0x56ae('0x13','(1ba')][_0x56ae('0x14','v!!o')][_0x56ae('0x15','33g%')];}return $[_0x56ae('0x16','A1*c')](_0x83f0b2,_0x9375fb[_0x56ae('0x17','DgwE')]);}function _0x1d442c(_0x2e9552){var _0x371533={'Mbcwo':_0x56ae('0x18','5wk$'),'gJqTv':function _0x109ccb(_0x3d91db,_0x2d5506){return _0x3d91db(_0x2d5506);},'ABVeV':_0x56ae('0x19','BEkF'),'qaIRg':_0x56ae('0x1a','rYhe'),'pnjuE':function _0x30a4c7(_0xf410e5,_0x332367){return _0xf410e5+_0x332367;},'oKMpY':function _0xdb98ca(_0x40fc56,_0x3df0e3){return _0x40fc56+_0x3df0e3;},'lUXJx':function _0x1a7b03(_0x336dc3,_0xc4c230){return _0x336dc3+_0xc4c230;},'KgpNQ':_0x56ae('0x1b','@3iX'),'TmEqT':_0x56ae('0x1c','5wk$'),'LIABX':_0x56ae('0x1d','4$x%')};AppSecret=_0x371533[_0x56ae('0x1e','r&jy')];time=new Date()[_0x56ae('0x1f','rYhe')]();o=JSON[_0x56ae('0x20','pkmK')](_0x2e9552),s=_0x371533[_0x56ae('0x21','DgwE')](encodeURIComponent,o),c=new RegExp('\x27','g'),A=new RegExp('~','g'),s=s[_0x56ae('0x22','pkmK')](c,_0x371533[_0x56ae('0x23','5a[z')]),s=s[_0x56ae('0x24','@3iX')](A,_0x371533[_0x56ae('0x25','r&jy')]),signBody=_0x371533[_0x56ae('0x26','JU0#')](_0x371533[_0x56ae('0x26','JU0#')](_0x371533[_0x56ae('0x27','Ib0p')](_0x371533[_0x56ae('0x28','k5[[')](_0x371533[_0x56ae('0x29','[6#S')](_0x371533[_0x56ae('0x2a','F7$n')](_0x371533[_0x56ae('0x2b','^tkb')]($[_0x56ae('0x2c','BEkF')],_0x371533[_0x56ae('0x2d','5wk$')]),s),_0x371533[_0x56ae('0x2e','pkmK')]),$[_0x56ae('0x2f','6[u0')]),_0x371533[_0x56ae('0x30','Q)z)')]),time),AppSecret);return{'sign':_0x1538a4[_0x56ae('0x31','pkmK')](signBody[_0x56ae('0x32','5wk$')]())[_0x56ae('0x33','P&aX')](),'timeStamp':time};};;;encode_version = 'jsjiami.com.v5';
function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}