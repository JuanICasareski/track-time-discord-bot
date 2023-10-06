
type UserActions = 'disconnected' | 'connected';

type UserState = {
    nickname: string;
    action: UserActions;
    time_of: number;
    total_time: number;
};


export {
    UserActions,
    UserState
};