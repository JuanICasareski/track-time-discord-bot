import { UserActions } from './types';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration)


export const get_epoch_time = () => new Date().getTime();

export const get_time_since_action = (time_of: number, old_action: UserActions, new_action: UserActions): number => {
    if ([old_action, new_action].includes("connected")) 
        return get_epoch_time() - time_of;

    return 0;
}

export const epoch_time_to_text = (time: number): string => {
    const duration = dayjs.duration(time)

    return `${duration.days()}d ${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`
}
