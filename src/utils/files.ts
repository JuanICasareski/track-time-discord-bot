import fs from 'fs';
import { get_user } from './discord';
import { UserLogFile, UserActions } from './types';
import { get_epoch_time, get_time_since_action } from './time';
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

            if (user_state) {
                user_state = {
                    ...user_state,
                    action,
                    time_of: get_epoch_time(),
                    total_time: user_state.total_time + get_time_since_action(user_state.time_of, user_state.action, action)
                };
            }

            else {
                const user = await get_user(guild_id, user_id);

                user_state = {
                    nickname: user.nickname || '',
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
                    ...(json_data[guild_id]?.users_state || {}),
                    [user_id]: {
                        action,
                        nickname: user.nickname || '',
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

export {
    write_user_state
};
