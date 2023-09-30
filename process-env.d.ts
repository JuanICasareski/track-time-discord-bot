declare namespace NodeJS {
    export interface ProcessEnv {
        [key: string]: string | undefined;
        DISCORD_TOKEN: string;
        GUILD_ID: string;
        CLIENT_ID: string;
    }
}