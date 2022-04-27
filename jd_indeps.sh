#!/usr/bin/env bash
#依赖安装，运行一次就好
#0 8 27 4 * jd_indeps.sh
#const $ = new Env('依赖安装');
#
echo -e "安装脚本所需依赖，首次拉库运行一次即可，有更新在运行/n"
echo -e "开始安装............\n"
pnpm config set registry https://registry.npm.taobao.org
pnpm install -g
pnpm install -g pnpm
pnpm install -g png-js
pnpm install -g date-fns
pnpm install -g axios
pnpm install -g crypto-js
pnpm install -g ts-md5
pnpm install -g tslib
pnpm install -g @types/node
pnpm install -g request
pnpm install -g jsdom
pnpm install -g moment
pnpm install -g tough-cookie
pip install jieba

echo -e "\n恭喜，所需依赖已全部安装!"