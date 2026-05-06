
export class EnvConfig{
    private static instance: EnvConfig;
    private readonly _baseUrl: string;
    private readonly _email: string;
    private readonly _password: string;
    private constructor(){
        this._baseUrl = 'https://demo.spreecommerce.org/';
        this._email = 'you@example.com';
        this._password = 'example';
    }

    public static getInstance():EnvConfig{
        if (!EnvConfig.instance) {
            EnvConfig.instance = new EnvConfig();
          }
          return EnvConfig.instance;

    }
    public get baseUrl(): string { return this._baseUrl; }
    public get email(): string { return this._email; }
    public get password(): string { return this._password; }
}

export const envConfig = EnvConfig.getInstance();