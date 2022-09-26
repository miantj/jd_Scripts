# 使用背景

解放双手，自动玩耍京东的各种游戏，主要有：各种签到、东东农场、种豆得豆、天天加速、摇钱树、宠汪汪、东东萌宠、京小超，获取各种小羊毛
# 自用娱乐，出事概不负责

## <a href="http://1.116.104.127:8082/">京东签到自助上车</a>

需要京东代挂京豆的可自行打开页面登录

#### 注意：代挂的请关闭小额免密登录,以免产生经济纠纷

<!-- ## 访问量 -->

<!-- ![](https://profile-counter.glitch.me/miantj/count.svg) -->


拉库
```
ql repo https://github.com/miantj/jd_Scripts.git "jd_|jx_|jddj_|gua_|getJDCookie|wskey" "activity|backUp"
```

# maiark 使用方式

docker pull kissyouhunter/maiark

docker run -dit --name maiark -p 8082:8082 --restart always kissyouhunter/maiark

docker exec -it maiark /bin/bash

vi arkconfig.json #<修改maiark里面的青龙面版地址>

vi arktemplates/index.html #修改网页源码 能看懂中文直接修改替换上去即可

网页图片文件基本都在 static/ 文件夹下