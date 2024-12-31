import { Address, toNano } from 'ton-core';
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
        name: 'Test Game Token',
        description: 'Token for testing game rewards',
        symbol: 'GAME',
        decimals: 9,
        image: 'https://example.com/token-image.png',
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
        // Deploy the contract
        await provider.deploy(minter, toNano('0.5'));

        ui.write('Jetton Minter deployed successfully!');
        ui.write('Address: ' + minter.address.toString());
        ui.write('Admin: ' + admin.toString());
        ui.write('\nSave this minter address for use in claimGameReward.ts!');

        // Get contract provider for the deployed contract
        const contract = provider.open(minter);

        // 초기 토큰 발행
        await minter.sendMint(
            contract, // Here we use the contract provider instead of network provider
            sender,
            admin,
            toNano('1000'),
            toNano('0.02'),
            toNano('0.05')
        );
        ui.write('Initial tokens minted successfully!');
    } catch (e) {
        ui.write('Error deploying contract: ' + e);
    }
}
