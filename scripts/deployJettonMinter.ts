import { Address, toNano, ContractProvider } from 'ton-core';
import { JettonMinter, jettonContentToCell } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const sender = provider.sender();

    if (!sender.address) {
        throw new Error('Sender address must be provided');
    }
    const admin: Address = sender.address;

    const jettonMetadata = {
        name: 'THanChain',
        description: 'Token for testing game rewards',
        symbol: 'THAN',
        decimals: 9,
        image: 'https://raw.githubusercontent.com/hanchain-paykhan/hanchain/a45c5010b515f3d7f472c9a75e4703ee6a1b582f/logo/logo.svg',
    };

    const content = jettonContentToCell({
        type: 1,
        uri: 'data:application/json,' + JSON.stringify(jettonMetadata),
    });

    const minterCode = await compile('JettonMinter');
    const walletCode = await compile('JettonWallet');

    const minter = JettonMinter.createFromConfig(
        {
            admin,
            content,
            wallet_code: walletCode,
        },
        minterCode
    );

    try {
        await provider.deploy(minter, toNano('0.5'));

        ui.write('Jetton Minter deployed successfully!');
        ui.write('Address: ' + minter.address.toString());
        ui.write('Admin: ' + admin.toString());
        ui.write('\nSave this minter address for use in claimGameReward.ts!');

        const contractProvider = provider.open(minter) as unknown as ContractProvider;

        await minter.sendMint(
            contractProvider,
            sender,
            admin,
            toNano('1000'), // jetton_amount
            toNano('0.02'), // forward_ton_amount
            toNano('0.05') // total_ton_amount
        );
        ui.write('Initial tokens minted successfully!');
    } catch (e) {
        ui.write('Error deploying contract: ' + e);
    }
}
