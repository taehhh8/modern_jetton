import { toNano } from 'ton-core';
import { compile, NetworkProvider } from '@ton-community/blueprint';
import { Counter } from '../wrappers/Counter';

export async function run(provider: NetworkProvider) {
    const counter = Counter.createFromConfig(
        {
            initialCounter: 0,
        },
        await compile('Counter')
    );

    await provider.deploy(counter, toNano('0.01'));
}
