
type UserActions = 'disconnected' | 'connected';

type UserState = {
    nickname: string;
    action: UserActions;
    time_of: number;
    total_time: number;
};

type UserLogFile = {
    [guild_id: string]: {
        users_state: {
            [member_id: string]: UserState | undefined;
        };
    } | undefined;
};


export {
    UserActions,
    UserState,
    UserLogFile
};