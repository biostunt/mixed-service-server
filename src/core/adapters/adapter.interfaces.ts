export interface Adapter {
    start: () => any;
}

export interface TransportAdapter extends Adapter { };

export interface DatabaseAdapter {
    connect: () => any;
    close: () => any;
    execute: <T>(query: string) => Promise<T>;
};