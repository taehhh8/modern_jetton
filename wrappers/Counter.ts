import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type CounterConfig = {
    initialCounter: number;
};

export class Counter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromConfig(config: CounterConfig, code: Cell) {
        const data = beginCell().storeUint(config.initialCounter, 32).endCell();
        const init = { code, data };
        return new Counter(contractAddress(0, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: '0.01', // 0.01 TON
            bounce: false,
        });
    }

    async getCounter(provider: ContractProvider) {
        const result = await provider.get('get_counter', []);
        return result.stack.readNumber();
    }

    async sendIncrement(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: '0.01', // 0.01 TON
            bounce: false,
            body: beginCell().storeUint(1, 32).endCell(),
        });
    }
}
