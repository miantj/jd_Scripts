

# Tips

>搜集全网大佬，亲测运行，整理移除重复和失效，屏蔽助力池，去除内置助力，日常更新，一键自动配置内部互助,自动安装所需依赖（需青龙2.8+）;
 
>细水长流，低调使用，在精不在多，许多重复或失效的容易黑！

## 青龙[INSTALL](https://github.com/6dylan6/jdpro/tree/main/docker)

## 青龙拉库指令

在青龙面板添加拉库任务 ，定时随意，集中在白天更新库。
```
ql repo https://github.com/6dylan6/jdpro.git "jd_|jx_|jddj_" "backUp" "^jd[^_]|USER|JD|function|sendNotify"
```

## 依赖安装

拉库后，执行'依赖安装'任务即可完成所需依赖安装，脚本名jd_indeps，首次拉库执行一次即可，有新依赖再次执行。


## 互助指南

1、修改青龙config.sh配置（特别注意，没有修改此配置，互助无法配置）

RepoFileExtensions="js py"修改为

RepoFileExtensions="js py sh"

右上角保存

建议任务运行时间调大，默认1小时有些脚本跑不完就被结束。

CommandTimeoutTime="3h"  即改为3小时。

2、执行拉库任务。

3、青龙执行'获取互助码'任务即可快速自动完成互助配置（脚本名jd_sharecode),互助码获取情况可查看任务运行日志（首次使用此库需等待所有其他脚本运行后产生日志才会获取到互助码，一般第二天会获取全部互助码）

## 一些提示
1、涉及兑换的可以配置任务并发，不然后面的别想兑换到了!

并发配置方法：

在任务后面加conc JD_COOKIE

如 task XXXXX.js conc JD_COOKIE

任务分组运行方法：

在任务后面加desi JD_COOKIE 需要运行的ck序号

如 task XXXX.js desi JD_COOKIE 1-10  前10个一组运行，2 8 9就是第2/8/9序号的ck执行，以此类推。

2、极速版签到也开并发，不然任务跑不完，一个号要40分钟。。

task 6dylan6_jdpro_jd_speed_sign.js conc JD_COOKIE

3、京东保价也建议并发，测试前几个号正常跑，后面就开始报频繁！

task 6dylan6_jdpro_jd_price.js conc JD_COOKIE

4、财富岛默认助力赚金币，如需要助力合成珍珠，请修改jd_cfd_mooncake.js任务定时，排在jd_cfd.js前面执行即可。


5、通知支持一对一推送和显示备注，用法请参考[@ccwav](https://github.com/ccwav/QLScript2)

6、青龙系统通知（新增删除任务、登录等通知），需把pushkey变量写入到config.sh文件，直接建环境变量只发脚本运行通知。

7、本库没有开卡，如需开卡入会请拉瓜佬库[@smiek2221](https://github.com/smiek2221/scripts.git)


##### 控制脚本功能环境变量


|             Name             |             归属             |  属性  | 说明                                                         |
| :--------------------------: | :--------------------------: | :----: | ------------------------------------------------------------ |
|     `PET_NOTIFY_CONTROL`     |     东东萌宠<br>推送开关     | 非必须 | 控制京东萌宠是否静默运行,<br>`false`为否(发送推送通知消息),`true`为是(即：不发送推送通知消息) |
|    `FRUIT_NOTIFY_CONTROL`    |     东东农场<br>推送开关     | 非必须 | 控制京东农场是否静默运行,<br>`false`为否(发送推送通知消息),`true`为是(即：不发送推送通知消息) |
|    `JD_JOY_REWARD_NOTIFY`    |  宠汪汪<br>兑换京豆推送开关  | 非必须 | 控制`jd_joy_reward.js`脚本是否静默运行,<br>`false`为否(发送推送通知消息),`true`为是(即：不发送推送通知消息) |
|       `JOY_FEED_COUNT`       |        宠汪汪喂食数量        | 非必须 | 控制`jd_joy_feedPets.js`脚本喂食数量,可以填的数字10,20,40,80,其他数字不可. |
|       `JOY_HELP_FEED`        |       宠汪汪帮好友喂食       | 非必须 | 控制`jd_joy_steal.js`脚本是否给好友喂食,`false`为否默认,`true`为是(给好友喂食) |
|        `JOY_RUN_FLAG`        |        宠汪汪是否赛跑        | 非必须 | 控制`jd_joy.js`脚本是否参加赛跑(默认参加双人赛跑),<br>`false`为否,`true`为是，脚本默认是`true` |
|       `JOY_TEAM_LEVEL`       | 宠汪汪<br>参加什么级别的赛跑 | 非必须 | 控制`jd_joy.js`脚本参加几人的赛跑,可选数字为`2`,`10`,`50`，<br>其中2代表参加双人PK赛，10代表参加10人突围赛，<br>50代表参加50人挑战赛(注：此项功能在`JOY_RUN_FLAG`为true的时候才生效)，<br>如若想设置不同账号参加不同类别的比赛则用&区分即可(如下三个账号：`2&10&50`) |
|       `JOY_RUN_NOTIFY`       | 宠汪汪<br>宠汪汪赛跑获胜后是否推送通知 | 非必须 | 控制`jd_joy.js`脚本宠汪汪赛跑获胜后是否推送通知，<br>`false`为否(不推送通知消息),`true`为是(即：发送推送通知消息)<br> |
|     `JD_JOY_REWARD_NAME`     |  宠汪汪<br>积分兑换多少京豆  | 非必须 | 目前可填值为`20`或者`500`,脚本默认`20`,`0`表示不兑换京豆     |
|    `MARKET_COIN_TO_BEANS`    |    东东超市<br>兑换京豆数量    | 非必须 | 控制`jd_blueCoin.js`兑换京豆数量,<br>可输入值为`20`或者`1000`的数字或者其他商品的名称,例如`碧浪洗衣凝珠` |
|    `MARKET_REWARD_NOTIFY`    |  东东超市<br>兑换奖品推送开关  | 非必须 | 控制`jd_blueCoin.js`兑换奖品成功后是否静默运行,<br>`false`为否(发送推送通知消息),`true`为是(即：不发送推送通知消息) |
|    `SUPERMARKET_LOTTERY`     |          东东超市抽奖          | 非必须 | 每天运行脚本是否使用金币去抽奖,`true`表示抽奖,`false`表示不抽奖，默认抽奖 |
|      `FRUIT_BEAN_CARD`       |    农场<br>使用水滴换豆卡    | 非必须 | 农场使用水滴换豆卡(如果出现限时活动时100g水换20豆,此时比浇水划算,推荐换豆),<br>`true`表示换豆(不浇水),`false`表示不换豆(继续浇水),脚本默认是浇水 |
|       `JD_UNSUB`             |      批量取消商品与店铺关注开关      | 非必须 | 控制jd_unsubscribe.js运行，默认为true取关，false不取关 |
|       `JD_CART_REMOVE`       |      清空购物车      | 非必须 | 控制jd_clean_car.js运行 ，默认false不清空，true清空 |
|   `MONEY_TREE_SELL_FRUIT`    |    摇钱树<br>是否卖出金果    | 非必须 | 控制摇钱树脚本是否自动卖出金果兑换成金币，`true`卖出，`false`不卖出，默认卖出 |
|   `exjxbeans`                |     临期京豆换喜豆     | 非必须 | 默认为false不换，设置true换喜豆 |
| `JXMC_HB`|    京喜牧场<br>控制助力方向     | 非必须 | 设置为false助力金币，默认助力红包 |
| `ddwVirHb`|    财富岛珍珠兑换<br>控制兑换过滤    | 非必须 | 默认兑换>=元，变量设置为0兑换1元，0.2元和随机，兑换一元建议设置变量等于0.5 |

##### 脚本环境变量
###### 京东试用

|            Name             |        归属        |  属性  | 说明                                                         |
| :-------------------------: | :----------------: | :----: | ------------------------------------------------------------ |
|      `JD_TRY`               |   京东试用运行开关 | 非必须   |  true为开启，默认false不运行 |
|      `JD_TRY_TITLEFILTERS`  |   京东试用<br>商品名过滤 | 非必须 |  比如不申请教程@软件@手机卡， `@`分割 |
|      `JD_TRY_PRICE`         |   京东试用<br>价格过滤   | 非必须 |  默认20 |
|      `JD_TRY_TRIALPRICE `      |   京东试用<br>试用价格   | 非必须 |  试用价格(中了要花多少钱)，高于这个价格都不会试用，小于等于才会试用，默认0元 |
|      `JD_TRY_APPLYNUMFILTER`      |   京东试用<br>人数过滤   | 非必须 |  已申请人数大于设置人数不申请，默认10000 |
|      `JD_TRY_PLOG`      |   京东试用<br>日志配置   | 非必须 |  是否输出详细日志true为开，false为关，默认为false，输出简单日志 |

