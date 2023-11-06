import { changeGamificationMode } from "./api/gamification_mode"

var gamified = true
var initial = true
var user_id = undefined

export const set_gamified_mode = async (mode) => {
    changeGamificationMode(user_id, mode)
    gamified = mode
}

export const gamified_mode = (initial_user_setting) => {
    console.log("ini", initial)
    console.log("iniuser", initial_user_setting)
    if (initial && initial_user_setting){
        gamified = initial_user_setting.gamification_mode
        user_id = initial_user_setting.pk
        initial = false
    }
    console.log("current gamified mode: ", gamified)
    return gamified
}
