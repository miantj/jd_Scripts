

# Tips

>个人搜集全网库，优化，屏蔽助力池，屏蔽开卡入会，自用库，日常更新,自动配置内部互助;
 
>细水长流，低调使用，在精不在多，许多重复或失效的容易黑！

## 青龙[INSTALL](https://github.com/6dylan6/jdpro/tree/main/docker)

## 依赖安装
编辑青龙extra.sh配置文件,新增下面内容，重启容器会自动完成依赖安装，也可手动进容器安装
```
pnpm install -g png-js
pnpm install -g date-fns
pnpm install -g axios
pnpm install -g crypto-js
pnpm install -g ts-md5
pnpm install -g tslib
pnpm install -g @types/node
pnpm install -g requests
pnpm install -g jsdom
```

## 青龙拉库指令
在青龙面板添加任务 ，定时建议一天两次，当然手动也可以。
```
ql repo https://github.com/6dylan6/jdpro.git "jd_|jx_|jddj_" "backUp" "^jd[^_]|USER|JD|function|sendNotify"
```
## 互助指南

1、修改青龙config.sh配置
找到RepoFileExtensions="js py"修改为
RepoFileExtensions="js py sh"
保存

2、执行拉库

3、青龙执行互助码提取即可快速自动完成互助配置（首次使用此库需等待所有其他脚本运行后才会获取到互助码，一般第二天会获取全部互助码）
