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

2、修改青龙config.sh配置，差不多在17行（特别注意，没有修改此配置，任务拉不全，一键部署忽略此处）

RepoFileExtensions="js py"修改为 RepoFileExtensions="js py sh ts" 保存

3、新建拉库任务，并执行，刷新浏览器即可看到添加的任务。

4、添加CK环境变量，多CK不要写在一起，每个都新建JD_COOKIE变量；



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

7、如果通知文件发现和库里的不一致，那是被青龙自带的覆盖了，手动拷贝一份到deps目录下。

8、建议调整任务运行超时时间，青龙默认1小时有些脚本跑不完就被强制kill，config.sh里配置。CommandTimeoutTime="3h"  即改为3小时，根据自己的号数量调整。
</code></pre>
</details>

# maiark 使用方式

docker pull kissyouhunter/maiark

docker run -dit --name maiark -p 8082:8082 --restart always kissyouhunter/maiark

docker exec -it maiark /bin/bash

vi arkconfig.json #<修改maiark里面的青龙面版地址>

vi arktemplates/index.html #修改网页源码 能看懂中文直接修改替换上去即可

网页图片文件基本都在 static/ 文件夹下
