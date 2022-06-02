
## DY

>全网可用，加密代码审查，测运行无重复，定期移除失效，默认无加购，一键配置内部互助(可选模式),自动安装运行依赖（需青龙2.8+）;

 
>欢迎大家issue、pr，会一一回复！


## 请注意安全，不用不明js，app，exe！被偷回到解放前！！！

## 防走失[TG频道](https://t.me/dylan_jdpro)

## 青龙面板[INSTALL](https://github.com/6dylan6/jdpro/tree/main/docker)

## 拉库指令

【注意】2.11.1前版本青龙config.sh配置把GithubProxyUrl="https://ghproxy.com/ （差不在多19行）" 修改为GithubProxyUrl=""，否则拉取失败，以上版本无需配置。

国内机用下面指令（带代理，不要太频繁请求，会ban）：

```
ql repo https://js.dayplus.xyz/https://github.com/6dylan6/jdpro.git "jd_|jx_|jddj_" "backUp" "^jd[^_]|USER|JD|function|sendNotify"

```
国外机用下面指令：

```
ql repo https://github.com/6dylan6/jdpro.git "jd_|jx_|jddj_" "backUp" "^jd[^_]|USER|JD|function|sendNotify"

```

怎么都拉不下来就用gitee版吧，用下面指令！(更新会慢点）

```
ql repo https://gitee.com/dylanote/jdpro.git "jd_|jx_|jddj_" "backUp" "^jd[^_]|USER|JD|function|sendNotify"

```

任务定时建议 50 7-23/2 * * *  

## 依赖安装

拉库后，执行'依赖安装'任务安装此库脚本所需依赖，脚本名jd_indeps，首次拉库执行一次即可，有新依赖再次执行。


## 互助指南

1、修改青龙config.sh配置，差不多在17行（特别注意，没有修改此配置，会少依赖安装任务和获取互助任务）

RepoFileExtensions="js py"修改为

RepoFileExtensions="js py sh ts"

保存


2、执行拉库任务。

3、执行'获取互助码'任务即可自动完成互助配置（脚本名jd_sharecode),互助码获取情况可查看任务运行日志（首次使用此库需等待任务运行一遍后产生日志才会获取到互助码，可以看jd_sharecode日志获取情况）



<details>
<summary>使用技巧与问题解答</summary>
<pre><code>

1、涉及兑换或需要抢的可以配置任务并发，就是全部一起跑。

并发配置方法：

在任务后面加conc JD_COOKIE

如 task XXXXX.js conc JD_COOKIE

任务分组运行方法：

在任务后面加desi JD_COOKIE 需要运行的ck序号

如 task XXXX.js desi JD_COOKIE 1-10  前10个一组运行，2 8 9就是第2/8/9序号的ck执行，以此类推。

2、极速版签到建议并发，号多跑很久的，一个号要30多分钟。。

task 6dylan6_jdpro_jd_speed_sign.js conc JD_COOKIE （具体任务路径不同版本不一样，按自己的写）

3、保价建议并发，否则可能前几个号正常跑，后面会报频繁！

task 6dylan6_jdpro_jd_price.js conc JD_COOKIE

4、通知支持一对一推送和显示备注，还有分组通知等用法参考[notify.md](./notify.md)

备注显示变量如下

export NOTIFY_SHOWNAMETYPE="1"    不做任何变动

export NOTIFY_SHOWNAMETYPE="2"    效果是 :  账号名称：别名(备注)	

export NOTIFY_SHOWNAMETYPE="3"    效果是 :  账号名称：pin(备注)

export NOTIFY_SHOWNAMETYPE="4"    效果是 :  账号名称：备注

5、因为青龙有随机延时（可以在配置文件设置为0，默认300秒），所以涉及准点运行的任务，最后加now，如果是desi或conc不用加也会准时跑。

6、青龙系统通知（新增删除任务、登录等通知），需把通知变量写到config.sh文件，在环境变量里只发脚本运行通知哈。

7、本库开卡任务默认不执行，如需运行请设置变量export DY_OPENALL="true"，所有开卡任务通用。

8、如果通知文件发现和库里的不一致，那是青龙自带的覆盖了，正常库里会自动覆盖掉青龙的通知文件，如果没有自动那就手动拷贝一份到deps目录下吧，或者直接删掉deps目录下的sendnotify.js

9、建议调整任务运行超时时间，青龙默认1小时有些脚本跑不完就被强制kill，config.sh里配置。CommandTimeoutTime="3h"  即改为3小时，根据自己的号数量调整。
</code></pre>
</details>

## 加密脚本清单

<details>
<summary>加密脚本清单，已审查， 不放心可禁用</summary>
<pre><code>
jd_zjd.js (赚京豆，全加密）
jddj_fruit.js（到家果园，全加密）
jd_fans.js （粉丝互动，全加密）
jd_half_redrain.js (半点京豆雨，全加密）
jd_jxmc.js （京喜牧场，算法加密）
jd_cfd.js （京喜财富岛，算法加密）
jd_cfd_loop.js (京喜财富岛捡贝壳，算法加密）
jd_speed_sign.js （极速版签到，算法加密）
jd_speed_signred.js  （极速版红包，算法加密）
开卡系列全部都有算法加密 
</code></pre>
</details>


## 部分脚本环境变量

[Wskey转换环境变量](https://github.com/Zy143L/wskey)

|             Name             |             归属             |  属性  | 说明                                                         |
| :--------------------------: | :--------------------------: | :----: | ------------------------------------------------------------ |
|     `PET_NOTIFY_CONTROL`     |     东东萌宠<br>推送开关     | 非必须 | 控制京东萌宠是否静默运行,<br>`false`为否(发送推送通知消息),`true`为是(即：不发送推送通知消息) |
|    `FRUIT_NOTIFY_CONTROL`    |     东东农场<br>推送开关     | 非必须 | 控制京东农场是否静默运行,<br>`false`为否(发送推送通知消息),`true`为是(即：不发送推送通知消息) |
|    `NOTIFY_AUTOCHECKCK`    |       自动禁用失效CK开关  | 非必须 | 有CK失效自动禁用并通知，true为自动禁用，false不自动禁用，默认false |
|       `JOY_FEED_COUNT`       |        宠汪汪喂食数量        | 非必须 | 控制`jd_joy_feedPets.js`脚本喂食数量,可以填的数字10,20,40,80,其他数字不可. |
|       `NOTIFY_SKIP_LIST`       |        控制关闭某些标题的通知  | 非必须 | 通知标题在此变量里面存在(&隔开),则屏蔽不发送通知.例 : export NOTIFY_SKIP_LIST="临期京豆换喜豆&京东资产统计" |
|      `FRUIT_BEAN_CARD`       |    农场<br>使用水滴换豆卡    | 非必须 | 农场使用水滴换豆卡(如果出现限时活动时100g水换20豆,此时比浇水划算,推荐换豆),<br>`true`表示换豆(不浇水),`false`表示不换豆(继续浇水),脚本默认是浇水 |
|       `JD_UNSUB`             |      批量取消商品与店铺关注开关      | 非必须 | 控制jd_unsubscribe.js运行，默认为true取关，false不取关 |
|       `JD_CART_REMOVE`       |      清空购物车      | 非必须 | 控制jd_clean_car.js运行 ，默认false不清空，true清空 |
|   `MONEY_TREE_SELL_FRUIT`    |    摇钱树<br>是否卖出金果    | 非必须 | 控制摇钱树脚本是否自动卖出金果兑换成金币，`true`卖出，`false`不卖出，默认卖出 |
|   `QCARD`    |    店铺退会链接<br>是否运行    | 非必须 | 按需运行，`true`运行，默认`false`不运行 |
|   `Ev_Start`    |    自动评价<br>是否运行    | 非必须 | 选择运行，`true`运行，默认`false`不运行 |
|   `exjxbeans`                |     临期京豆换喜豆     | 非必须 | 默认为false不换，设置true换7天内过期京豆换喜豆 |
|   `WSKEY_DISCHECK`           |     wskey转换     | 非必须 | 默认为false检查，设置true为不检查直接转换 |
|   ` HelpType`           |     互助模式    | 非必须 | 默认顺序助力，0是全部一样顺序助力，1是均等机会助力，2是随机顺序助力，例： export HelpType=1 |
|   `PandaToken`           |     领现金使用     | 非必须 | Token去[TG机器人](https://t.me/pang_da_bot) 获取，获取一次7天有效期1000次调用，export PandaToken='你获取的token' |
|   `DY_OPENALL`           |     开卡系列     | 非必须 |开卡系列任务默认不执行，设置变量DY_OPENALL='true'执行 |
|   `DY_ZJD`           |     赚京豆     | 非必须 |默认不执行，设置变量DY_ZJD='true'执行 |




