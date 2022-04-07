
import got from 'got';

export const getSession = async (): Promise<string> => {
    const value = await got('https://localhost:5000/v1/api/tickle', {
        headers: {
            'User-Agent': 'Console'
        }
    }).json();

    return (value as any).session;
};

export interface Accounts {
    accountId: string; 
}

export const getAccounts = async (): Promise<Accounts[]> => {
    const accounts = await got('https://localhost:5000/v1/api/portfolio/accounts', {
        headers: {
            'User-Agent': 'Console'
        }
    }).json() as any;

    return accounts as Accounts[];
};

export interface Positions {
    accountId: string; 
}

export const getPositions = async (accountId: string): Promise<Positions[]> => {
    const positions = await got(`https://localhost:5000/v1/api/portfolio/${accountId}/positions/0`, {
        headers: {
            'User-Agent': 'Console'
        }
    }).json() as any;

    return positions as Positions[];
};


export interface Validate
{
    LOGIN_TYPE: number;
    USER_NAME: string;
    USER_ID: number;
    expire: number;
    RESULT: boolean;
    AUTH_TIME: number;
}

export const ping = async (): Promise<Validate> => {
    const result = await got('https://localhost:5000/v1/api/sso/validate', {
        headers: {
            'User-Agent': 'Console'
        }
    }).json();

    return result as Validate;
};





