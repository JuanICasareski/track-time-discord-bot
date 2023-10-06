import { QuickDB } from "quick.db";

import { get_user } from './discord';
import { UserActions, UserState } from './types';
import { get_epoch_time, get_time_since_action, epoch_time_to_text } from './time';


const write_user_state = async (guild_id: string, user_id: string, action: UserActions) => {
    const db = new QuickDB<UserState>({ table: `guild_${guild_id}` });

    const user = await db.get(user_id)

    if (user) {
        db.add(
            `${user_id}.total_time`, 
            get_time_since_action(user.time_of, user.action, action)
        );
        db.set(
            `${user_id}.time_of`,
            get_epoch_time()
        );

        return;
    }

    const member = await get_user(guild_id, user_id);

    db.set(user_id, {
        nickname: member.nickname || member.displayName,
        action,
        time_of: get_epoch_time(),
        total_time: 0
    })
}

const get_users_state = async (guild_id: string) => {
    const db = new QuickDB<UserState>({ table: `guild_${guild_id}` })
    const users = await db.all()
    const formatted_user = users.map((u) => ({ 
        ...u.value,
        user_id: u.id,
        formatted_total_time: epoch_time_to_text(u.value.total_time || 0)
    }));

    formatted_user.sort((a, b) => Number(b.total_time) - Number(a.total_time));

    return formatted_user
}


export {
    write_user_state,
    get_users_state
};
