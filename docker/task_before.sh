#!/usr/bin/env bash
#6dylan6

env_name=(
  FRUITSHARECODES
  PETSHARECODES
  PLANT_BEAN_SHARECODES
  DREAM_FACTORY_SHARE_CODES
#  DDFACTORY_SHARECODES
  JDZZ_SHARECODES
#  JDJOY_SHARECODES
#  JXNC_SHARECODES
  BOOKSHOP_SHARECODES
  JD_CASH_SHARECODES
  JDSGMH_SHARECODES
#  JDCFD_SHARECODES
  JDHEALTH_SHARECODES
)
var_name=(
  ForOtherFruit
  ForOtherPet
  ForOtherBean
  ForOtherDreamFactory
  #ForOtherJdFactory
  ForOtherJdzz
#  ForOtherJoy
#  ForOtherJxnc
  ForOtherBookShop
  ForOtherCash
  ForOtherSgmh
#  ForOtherCfd
  ForOtherHealth
)

combine_sub() {
    local what_combine=$1
    local combined_all=""
    local tmp1 tmp2
    local envs=$(eval echo "\$JD_COOKIE")
    local array=($(echo $envs | sed 's/&/ /g'))
    local user_sum=${#array[*]}
    for ((i = 1; i <= $user_sum; i++)); do
        local tmp1=$what_combine$i
        local tmp2=${!tmp1}
        combined_all="$combined_all&$tmp2"
    done
    echo $combined_all | perl -pe "{s|^&||; s|^@+||; s|&@|&|g; s|@+&|&|g; s|@+|@|g; s|@+$||}"
}

## 正常依次运行时，组合所有账号的Cookie与互助码
combine_all() {
    for ((i = 0; i < ${#env_name[*]}; i++)); do
        result=$(combine_sub ${var_name[i]})
        if [[ $result ]]; then
            export ${env_name[i]}="$result"
        fi
    done
}

if [[ $(ls $dir_code) ]]; then
    latest_log=$(ls -r $dir_code | head -1)
    . $dir_code/$latest_log
    combine_all
fi