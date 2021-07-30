# 每3天的23:50分清理一次日志(互助码不清理，proc_file.sh对该文件进行了去重)
50 23 */3 * * find /scripts/logs -name '*.log' | grep -v 'sharecodeCollection' | xargs rm -rf
#收集助力码
30 * * * * sh +x /scripts/docker/auto_help.sh collect |ts >> /scripts/logs/auto_help_collect.log 2>&1

##############短期活动##############
#京东极速版红包(活动时间：2021-5-5至2021-5-31)
45 0,23 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_speed_redpocke.js |ts >> /scripts/logs/jd_speed_redpocke.log 2>&1

#超级直播间红包雨(活动时间不定期，出现异常提示请忽略。红包雨期间会正常)
1,31 0-23/1 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_live_redrain.js |ts >> /scripts/logs/jd_live_redrain.log 2>&1

#每日抽奖(活动时间：2021-05-01至2021-05-31)
13 1,22,23 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_daily_lottery.js |ts >> /scripts/logs/jd_daily_lottery.log 2>&1

#金榜创造营 活动时间：2021-05-21至2021-12-31
0 1,22 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_gold_creator.js |ts >> /scripts/logs/jd_gold_creator.log 2>&1
#5G超级盲盒(活动时间：2021-06-2到2021-07-31)
0 0-23/4 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_mohe.js |ts >> /scripts/logs/jd_mohe.log 2>&1
#明星小店(星店长，2021-06-10)
0 1,21 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_star_shop.js |ts >> /scripts/logs/jd_star_shop.log 2>&1
#京喜领88元红包(6.31到期)
30 1,6,12,21 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_jxlhb.js |ts >> /scripts/logs/jd_jxlhb.log 2>&1
#省钱大赢家之翻翻乐
10,40 * * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_big_winner.js |ts >> /scripts/logs/jd_big_winner.log 2>&1
##############长期活动##############
# 签到
7 0,17 * * * cd /scripts &&  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  jd_bean_sign.js |ts >> /scripts/logs/jd_bean_sign.log 2>&1
# 东东超市兑换奖品
0,30 0 * * *  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_blueCoin.js |ts >> /scripts/logs/jd_blueCoin.log 2>&1
# 摇京豆
6 0,23 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_club_lottery.js |ts >> /scripts/logs/jd_club_lottery.log 2>&1
# 东东农场
15 6-18/6 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_fruit.js |ts >> /scripts/logs/jd_fruit.log 2>&1
# 宠汪汪
45 */2,23 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_joy.js |ts >> /scripts/logs/jd_joy.log 2>&1
# 宠汪汪积分兑换京豆
0 0-16/8 * * *  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_joy_reward.js |ts >> /scripts/logs/jd_joy_reward.log 2>&1
# 宠汪汪喂食
35 */1 * * *  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_joy_feedPets.js |ts >> /scripts/logs/jd_joy_feedPets.log 2>&1
# 宠汪汪邀请助力
10 13-20/1 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_joy_run.js |ts >> /scripts/logs/jd_joy_run.log 2>&1
# 摇钱树
23 */2 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_moneyTree.js |ts >> /scripts/logs/jd_moneyTree.log 2>&1
# 东东萌宠
35 6-18/6 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_pet.js |ts >> /scripts/logs/jd_pet.log 2>&1
# 京东种豆得豆
10 7-22/1 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_plantBean.js |ts >> /scripts/logs/jd_plantBean.log 2>&1
# 京东全民开红包
12 0-23/4 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_redPacket.js |ts >> /scripts/logs/jd_redPacket.log 2>&1
# 进店领豆
6 0 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_shop.js |ts >> /scripts/logs/jd_shop.log 2>&1
# 东东超市
31 0,1-23/2 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_superMarket.js |ts >> /scripts/logs/jd_superMarket.log 2>&1
# 取关京东店铺商品
45 23 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_unsubscribe.js |ts >> /scripts/logs/jd_unsubscribe.log 2>&1
# 京豆月资产变动通知
20 9 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_bean_month_change.js |ts >> /scripts/logs/jd_bean_month_change.log 2>&1
# 京豆日资产变动通知
20 8 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_bean_day_change.js |ts >> /scripts/logs/jd_bean_day_change.log 2>&1
# 京东抽奖机
0 0,12,23 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_lotteryMachine.js |ts >> /scripts/logs/jd_lotteryMachine.log 2>&1
# 京东排行榜
21 9 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_rankingList.js |ts >> /scripts/logs/jd_rankingList.log 2>&1
# 天天提鹅
28 * * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_daily_egg.js |ts >> /scripts/logs/jd_daily_egg.log 2>&1
# 金融养猪
32 0-23/6 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_pigPet.js |ts >> /scripts/logs/jd_pigPet.log 2>&1
# 京喜工厂
50 * * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_dreamFactory.js |ts >> /scripts/logs/jd_dreamFactory.log 2>&1
# 东东小窝
46 6,23 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_small_home.js |ts >> /scripts/logs/jd_small_home.log 2>&1
# 东东工厂
26 * * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_jdfactory.js |ts >> /scripts/logs/jd_jdfactory.log 2>&1
# 赚京豆(微信小程序)
12 * * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_syj.js |ts >> /scripts/logs/jd_syj.log 2>&1
# 京东快递签到
47 1 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_kd.js |ts >> /scripts/logs/jd_kd.log 2>&1
# 京东汽车(签到满500赛点可兑换500京豆)
0 0 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_car.js |ts >> /scripts/logs/jd_car.log 2>&1
# 领京豆额外奖励(每日可获得3京豆)
23 1,12,22 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_bean_home.js |ts >> /scripts/logs/jd_bean_home.log 2>&1
# 微信小程序京东赚赚
6 0-5/1,11 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_jdzz.js |ts >> /scripts/logs/jd_jdzz.log 2>&1
# crazyJoy自动每日任务
30 7,23 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_crazy_joy.js |ts >> /scripts/logs/jd_crazy_joy.log 2>&1
# 京东汽车旅程赛点兑换金豆
0 0 * * *  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_car_exchange.js |ts >> /scripts/logs/jd_car_exchange.log 2>&1
# 导到所有互助码
23 7 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_get_share_code.js |ts >> /scripts/logs/jd_get_share_code.log 2>&1
# 口袋书店
38 8,12,18 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_bookshop.js |ts >> /scripts/logs/jd_bookshop.log 2>&1
# 京喜农场
30 9,12,18 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_jxnc.js |ts >> /scripts/logs/jd_jxnc.log 2>&1
# 签到领现金
10 */4 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_cash.js |ts >> /scripts/logs/jd_cash.log 2>&1
# 闪购盲盒
47 8,22 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_sgmh.js |ts >> /scripts/logs/jd_sgmh.log 2>&1
# 京东秒秒币
10 6,21 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_ms.js |ts >> /scripts/logs/jd_ms.log 2>&1
#美丽研究院
41 7,12,19 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_beauty.js |ts >> /scripts/logs/jd_beauty.log 2>&1
#京东保价
#41 0,23 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_price.js |ts >> /scripts/logs/jd_price.log 2>&1
#京东极速版签到+赚现金任务
21 1,6 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_speed_sign.js |ts >> /scripts/logs/jd_speed_sign.log 2>&1
#监控crazyJoy分红
10 12 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_crazy_joy_bonus.js |ts >> /scripts/logs/jd_crazy_joy_bonus.log 2>&1
#京喜财富岛
5 7,12,18 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_cfd.js |ts >> /scripts/logs/jd_cfd.log 2>&1
# 删除优惠券(默认注释，如需要自己开启，如有误删，已删除的券可以在回收站中还原，慎用)
#20 9 * * 6 sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_delCoupon.js |ts >> /scripts/logs/jd_delCoupon.log 2>&1
#家庭号
10 6,7 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_family.js |ts >> /scripts/logs/jd_family.log 2>&1
#京东直播（又回来了）
30-50/5 12,23 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_live.js |ts >> /scripts/logs/jd_live.log 2>&1
#京东健康社区
13 1,6,22 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_health.js |ts >> /scripts/logs/jd_health.log 2>&1
#京东健康社区收集健康能量
5-45/20 * * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_health_collect.js |ts >> /scripts/logs/jd_health_collect.log 2>&1
# 幸运大转盘
10 10,23 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_market_lottery.js |ts >> /scripts/logs/jd_market_lottery.log 2>&1
# 领金贴
5 0 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_jin_tie.js |ts >> /scripts/logs/jd_jin_tie.log 2>&1
#京喜牧场
15 0,12,22 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_jxmc.js |ts >> /scripts/logs/jd_jxmc.log 2>&1
#赚金币
0 5 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_zjb.js |ts >> /scripts/logs/jd_zjb.log 2>&1
#是兄弟就砍我2
0 5 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_kanjia2.js |ts >> /scripts/logs/jd_kanjia2.log 2>&1
#0元砍价
0 6 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_kanjia3.js |ts >> /scripts/logs/jd_kanjia3.log 2>&1
#惊喜工厂抢茅台
0 6 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_jxgc.js |ts >> /scripts/logs/jd_jxgc.log 2>&1
#推一推
0 0 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_tyt.js |ts >> /scripts/logs/jd_tyt.log 2>&1
#邀请有礼
0 0 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_yqyl.js |ts >> /scripts/logs/jd_yqyl.log 2>&1
#全民挖现金
0 6 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_qmwxj.js |ts >> /scripts/logs/jd_qmwxj.log 2>&1
#品牌狂欢日
0 6 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_ppkhr.js |ts >> /scripts/logs/jd_ppkhr.log 2>&1
#泡泡大战
1 0 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_ppdz.js |ts >> /scripts/logs/jd_ppdz.log 2>&1
#我是大老板农场
5 0-23/6 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_wsdlb.js |ts >> /scripts/logs/jd_wsdlb.log 2>&1
#省钱大赢家获取邀请码
0 6 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_sq.js |ts >> /scripts/logs/jd_sq.log 2>&1
#省钱大赢家
0,2 0 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_sqdyj.js |ts >> /scripts/logs/jd_sqdyj.log 2>&1
#是兄弟就砍我
0 0 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_kanjia.js |ts >> /scripts/logs/jd_kanjia.log 2>&1
#合肥旗舰店开业
0 6 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_Supershophf.js |ts >> /scripts/logs/jd_Supershophf.log 2>&1
#京东试用
30 10 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_try.js |ts >> /scripts/logs/jd_try.log 2>&1
#东东电竞经理
15 10 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_zooElecsport.js |ts >> /scripts/logs/jd_zooElecsport.log 2>&1
#QQ星系牧场
30 7 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_qqxing.js |ts >> /scripts/logs/jd_qqxing.log 2>&1
#京享值PK
15 0,6,13,19,21 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_jxzpk.js |ts >> /scripts/logs/jd_jxzpk.log 2>&1
#柠檬众筹好物上新
20 12,14 * * * * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_hwsx.js |ts >> /scripts/logs/jd_hwsx.log 2>&1
#点点券
10 0,20 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_necklace.js |ts >> /scripts/logs/jd_necklace.log 2>&1
#狂欢欧洲杯
15 8,12 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_europeancup.js |ts >> /scripts/logs/jd_europeancup.log 2>&1
#柠檬京东零食街
0 11 * * * sleep $((RANDOM % $RANDOM_DELAY_MAX));  . /scripts/docker/auto_help.sh export > /scripts/logs/auto_help_export.log && node  /scripts/jd_lsj.js |ts >> /scripts/logs/jd_lsj.log 2>&1
# 必须要的默认定时任务请勿删除
59 11 * * * docker_entrypoint.sh |ts >> /scripts/logs/default_task.log 2>&1
