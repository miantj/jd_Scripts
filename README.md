

# Tips

>搜集全网大佬优化，屏蔽助力池，去除内置助力码，屏蔽开卡入会，不定期更新，一键自动配置内部互助,自动安装所需依赖（需青龙2.8+）;
 
>细水长流，低调使用，在精不在多，许多重复或失效的容易黑！

## 青龙[INSTALL](https://github.com/6dylan6/jdpro/tree/main/docker)

## 依赖安装
拉库后，执行'依赖安装'任务即可完成所需依赖安装，脚本名jd_indeps，首次拉库运行一次即可。


## 青龙拉库指令
在青龙面板添加任务 ，定时建议一天两次，当然手动拉取也可。
```
ql repo https://github.com/6dylan6/jdpro.git "jd_|jx_|jddj_" "backUp" "^jd[^_]|USER|JD|function|sendNotify"
```
## 互助指南

1、修改青龙config.sh配置

RepoFileExtensions="js py"修改为

RepoFileExtensions="js py sh"

保存

2、执行拉库

3、青龙执行'获取互助码'任务即可快速自动完成互助配置（脚本名jd_sharecode),互助码获取情况可查看任务运行日志（首次使用此库需等待所有其他脚本运行后产生日志才会获取到互助码，一般第二天会获取全部互助码）
