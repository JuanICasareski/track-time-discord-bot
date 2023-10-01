import fs from 'fs';
import { get_user } from './discord';
import { UserLogFile, UserActions, UserState } from './types';
import { get_epoch_time, get_time_since_action, epoch_time_to_text } from './time';
import { LOG_FILE } from './constants'


const write_user_state = (guild_id: string, user_id: string, action: UserActions) => {
    fs.readFile(LOG_FILE, async (err, data) => {
        if (err) {
            console.log(err);
            return;
        }

        const raw_data = data.toString();
        const json_data: UserLogFile = JSON.parse(raw_data) || {};

        const guild_state = json_data[guild_id];
        if (guild_state) {
            let user_state = guild_state.users_state[user_id];
            const user = await get_user(guild_id, user_id);

            if (user_state) {
                user_state = {
                    ...user_state,
                    action,
                    nickname: user.nickname || user.displayName,
                    time_of: get_epoch_time(),
                    total_time: user_state.total_time + get_time_since_action(user_state.time_of, user_state.action, action)
                };
            }

            else {
                user_state = {
                    nickname: user.nickname || user.displayName,
                    action,
                    time_of: get_epoch_time(),
                    total_time: 0
                };
            }

            guild_state.users_state[user_id] = user_state;
            json_data[guild_id] = guild_state;
        }
        else {
            const user = await get_user(guild_id, user_id);

            json_data[guild_id] = {
                users_state: {
                    ...json_data[guild_id]?.users_state,
                    [user_id]: {
                        action,
                        nickname: user.nickname || user.displayName,
                        time_of: get_epoch_time(),
                        total_time: 0
                    }                    
                }
            };
        }

        fs.writeFile(LOG_FILE, JSON.stringify(json_data), (err) => {
            if (err) {
                console.log(err);
                return;
            }
        })
    })
}

type FormattedUserState = Partial<UserState> 
    & { user_id?: string, formatted_total_time: string }

const get_users_state = (guild_id: string): Promise<FormattedUserState[]> => {
    return new Promise((resolve, reject) => {
        fs.readFile(LOG_FILE, async (err, data) => {
            if (err) {
                console.log(err);
                return;
            }
    
            const raw_data = data.toString();
            const json_data: UserLogFile = JSON.parse(raw_data);
    
            const guild_state = json_data[guild_id];
    
            if (guild_state) {
                const users = Object.entries(guild_state.users_state).map(([user_id, user_state]) => ({
                    ...user_state,
                    user_id,
                }));
    
                users.sort((a, b) => Number(b.total_time) - Number(a.total_time));
                
                resolve(users.map((u) => ({
                    ...u,
                    formatted_total_time: epoch_time_to_text(u.total_time || 0)
                })))
            }

            resolve([])
        })  
    })
}


export {
    write_user_state,
    get_users_state
};
