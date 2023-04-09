### 注意ck安全，谨慎执行不明来历的js、app、exe、插件等，过期ck都能复活（还有其他不为人知的手段。。。），别想着过期就没事了，后果不限于花光你账号豆子红包优惠券下单，提现等。。！
# 使用背景

解放双手，自动玩耍京东的各种游戏，主要有：各种签到、东东农场、种豆得豆、天天加速、摇钱树、宠汪汪、东东萌宠、京小超，获取各种小羊毛
# 自用娱乐，出事概不负责

## <a href="http://www.123uq.com:8082">京东签到自助上车</a>

#### 注意：代挂登录成功请关闭小额免密登录,以免产生经济纠纷

由于某东不可抗力，部分用户会登录失败，如有能力建议自己搭建


## 拉库
```
ql repo https://github.com/miantj/jd_Scripts.git "jd_|jx_|jddj_|ql|gua_|getJDCookie|wskey" "activity|backUp" "^jd[^_]|USER|utils|function|sign|sendNotify|ql|JDJR"
```

## 使用流程

1、青龙部署。

2、修改青龙config.sh配置，差不多在17行（特别注意，没有修改此配置，任务拉不全，一键部署可忽略此处）；

RepoFileExtensions="js py"修改为 RepoFileExtensions="js py sh ts" 保存；

3、新建拉库任务或订阅，并执行，刷新浏览器即可看到添加的任务；

4、添加CK环境变量，多CK不要写在一起，每个都新建JD_COOKIE变量；

5，通知key变量请添加到配置管理config.sh文件，否则收不到通知；



<details>
<summary>使用技巧与问题解答</summary>
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

# maiark 使用方式

docker pull kissyouhunter/maiark

docker run -dit --name maiark -p 8082:8082 --restart always kissyouhunter/maiark

docker exec -it maiark /bin/bash

vi arkconfig.json #<修改maiark里面的青龙面版地址>

vi arktemplates/index.html #修改网页源码 能看懂中文直接修改替换上去即可

网页图片文件基本都在 static/ 文件夹下
