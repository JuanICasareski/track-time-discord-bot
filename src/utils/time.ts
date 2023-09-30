import { UserActions } from './types';


export const get_epoch_time = () => new Date().getTime();

export const get_time_since_action = (time_of: number, old_action: UserActions, new_action: UserActions): number => {
    if (old_action == 'connected' && new_action == 'disconnected') {
        return get_epoch_time() - time_of
    }    

    // Devuelve 0 si se conectó o si las acciones son las mismas.
    return 0;
}
