declare namespace NodeJS {
    export interface ProcessEnv {
        [key: string]: string | undefined;
        readonly DISCORD_TOKEN?: string;
        readonly GUILD_ID?: string;
        readonly CLIENT_ID?: string;
    }
}