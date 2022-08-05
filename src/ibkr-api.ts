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
    acctId: string; 
    contractDesc: string;
    conid: number;
    fullName: string;
    strike: string;
    putOrCall: string;
    position: number; //count
    unrealizedPnl: number;
    avgPrice: number;
    baseRealizedPnl: number;
    ticker: string;
}

export const getPositions = async (accountId: string): Promise<Positions[]> => {
    let positions = await got(`https://localhost:5000/v1/api/portfolio/${accountId}/positions/0`, {
        headers: {
            'User-Agent': 'Console'
        }
    }).json() as Positions[];

    positions = positions.filter(value => {
        if(value.fullName  === undefined && value.position == 0) {
            return false;
        }
        return true;
     });

    if(positions.some(value => value.fullName === undefined)) {
        console.error('empty fullname');
        return [];
    }

    return positions;
};

export const ping = async (): Promise<boolean> => {
    const result = await got('https://localhost:5000/v1/api/tickle', {
        headers: {
            'User-Agent': 'Console'
        }
    }).json();

    return (result as any).iserver.authStatus.authenticated;
};

export interface ReAuthenticated
{
    authenticated: boolean;
    connected: boolean;
    competing: boolean;
    fail: string;
    message: string;
}

export const reauthenticate = async (): Promise<ReAuthenticated> => {
    const result = await got('https://localhost:5000/v1/api/iserver/reauthenticate', {
        headers: {
            'User-Agent': 'Console'
        }
    }).json();

    return result as ReAuthenticated;
};

export function comparePosition(a: Positions, b: Positions): boolean {
    if(a.position != b.position) {
        return false;
    }

    if(a.contractDesc.localeCompare(b.contractDesc) != 0) {
        return false;
    }
    return true;
}

export function comparePositions(a: Positions[], b: Positions[]): boolean {
    return (a.length == b.length) && a.every(function(element, index) {
        return comparePosition(element, b[index]); 
    });
}

function processNewPositons(newPositions: Positions[], OldPositons: Positions[]): Positions[] {

    const onlyNewPositions = newPositions.filter( (value) => {
        const found = OldPositons.find( v => v.conid === value.conid);
        if(found !== undefined) {
            return value.position !== found.position;
        }
        return true;
    });

    return onlyNewPositions;
}

export function getNewPositions(newPositions: Positions[], OldPositons: Positions[]): Positions[] {
    return processNewPositons(newPositions,OldPositons);
}

