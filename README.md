### 注意ck安全，谨慎执行不明来历的js、app、exe、插件等！

# 此库所有内容仅用于测试学习,自用娱乐，出事概不负责，测试完后请自行删除！！！

## 拉库订阅
```
名称：jd_Scripts
类型：公开库
链接：ql repo https://github.com/miantj/jd_Scripts.git "jd_|jx_|jddj_" "backUp" "^jd[^_]|USER|JD|function|sendNotify|utils"
定时：crontab
定时规则：0 12,23 * * *
```

美团脚本需要自行捉包token填到变量 meituanCookie 中, 多账号换行或&或@隔开
export meituanCookie="AgGZIgsYHyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx#UUID(如需运行小团币)"

 - meituanV3: 美团领劵大额和一些领钱任务[大佬的库](https://raw.githubusercontent.com/leafTheFish/DeathNote/main/meituanV3.js)

## 简要流程

1、部署青龙并登陆，版本不用追新，稳定才好，推荐whyour/qinglong:2.17.9镜像部署。

2、到订阅管理创建订阅并运行；正确配置[参考](https://github.com/6dylan6/jdpro/issues/22)

3、订阅执行完，到定时任务搜索依赖安装（jd_indeps.sh)任务执行；

3、到订阅管理创建订阅并运行；正确配置[参考](https://github.com/6dylan6/jdpro/issues/22)

4、订阅运行完毕，到定时任务搜索依赖安装任务执行；

4、到环境变量，创建变量，名称: JD_COOKIE,值：抓的CK（要安全就手抓），多个每行建一个，不要全写在一个；

5，配置通知，通知的key填写到配置管理config.sh文件；

6、sendnotify.js文件用库里的到青龙deps目录下，否则会被青龙自带覆盖

<details>
<summary>进阶</summary>
<pre><code>

1、任务并发和分组

并发配置方法：

在任务后面加conc JD_COOKIE

如 task XXXXX.js conc JD_COOKIE

任务分组运行方法：

在任务后面加desi JD_COOKIE 需要运行的ck序号

如 task XXXX.js desi JD_COOKIE 1-10  前10个一组运行，2 8 9就是第2/8/9序号的ck执行，以此类推。

2、通知支持一对一推送和显示备注（需用本库sendnotify文件），还有分组通知等用法参考[notify.md](./notify.md)

备注显示变量如下

export NOTIFY_SHOWNAMETYPE="1"    不做任何变动

export NOTIFY_SHOWNAMETYPE="2"    效果是 :  账号名称：别名(备注)	

export NOTIFY_SHOWNAMETYPE="3"    效果是 :  账号名称：pin(备注)

export NOTIFY_SHOWNAMETYPE="4"    效果是 :  账号名称：备注

3、因为青龙有随机延时（可以在配置文件设置为0，默认300秒），所以涉及准点运行的任务，最后加now，如果是desi或conc不用加也会准时跑。

4、青龙系统通知（新增删除任务、登录等通知），需把通知变量写到config.sh文件，在环境变量里只发脚本运行通知哈。

5、如果通知文件发现和库里的不一致，那是被青龙自带的覆盖了，手动拷贝一份到deps目录下。

6、建议调整任务运行超时时间，青龙默认1小时有些跑不完就被强制结束，config.sh里配置。CommandTimeoutTime="3h"  即改为3小时，根据自己ck数量调整。
</code></pre>
</details>

## 互助模式使用说明

5、建议调整任务运行超时时间，青龙默认1小时有些跑不完就被强制结束，config.sh里配置。CommandTimeoutTime="3h"  即改为3小时，根据自己ck数量调整。

6、如需禁止某些CK参加所有活动或某些活动功能，实现重组CK顺序功能，包括随机、优先、轮换、组队、分段等功能，把[task_before](./docker/task_before.sh)文件内容复制到配置管理task_before.sh保存

常用变量举例：

Recombin_CK_Mode="1"  全部顺序随机

Recombin_CK_Mode="2" Recombin_CK_ARG1="15" 假设有100个CK，前15个CK按正常顺序靠前，其余CK随机乱序

Recombin_CK_Mode="3" Recombin_CK_ARG1="5" Recombin_CK_ARG2="5"  假设有100个CK，希望前5个账号始终保持在前部，剩余95个账号按照轮换模式每天轮换5个

其他用法具体参考[文档](https://docs.qq.com/doc/DTXh6QUVjRXJ1TFdN)
</code></pre>
</details>


## 通用变量

自定义sign  export SIGN_URL='url'

代理API export DY_PROXY='url'（部分js支持）

DY_PROXY='URL1#URL2' 多个#分割

代理池 export DP_POOL='url'（全部js支持）

代理池白名单（js文件名关键字如fruit），如fruit export PERMIT_JS='fruit'


## 支持的通知方式

server酱，go-cqhttp，pushdeer，Bark App，tg bot，钉钉bot，企业微信bot，企业微信应用消息，飞书，iGot，push plus，WxPusher，gotify

请在配置管理config文件里写变量

<!-- # maiark 使用方式

docker pull kissyouhunter/maiark

docker run -dit --name maiark -p 8082:8082 --restart always kissyouhunter/maiark

docker exec -it maiark /bin/bash

vi arkconfig.json #<修改maiark里面的青龙面版地址>

vi arktemplates/index.html #修改网页源码 能看懂中文直接修改替换上去即可 -->

网页图片文件基本都在 static/ 文件夹下



