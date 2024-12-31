import { Address, toNano } from 'ton-core';
import { JettonMinter } from '../wrappers/JettonMinter';
import { NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const sender = provider.sender();

    // deployJettonMinter에서 받은 주소를 여기에 입력
    const minterAddress = Address.parse('EQA...'); // 실제 배포된 주소로 교체
    const minter = JettonMinter.createFromAddress(minterAddress);

    try {
        // 테스트 보상 지급
        await minter.claimReward(
            provider,
            sender,
            toNano('10') // 10 토큰 보상
        );

        ui.write(`Reward claimed successfully!`);

        // 잔액 확인
        const walletAddress = await minter.getWalletAddress(provider, sender.address!);
        ui.write(`Your Jetton wallet address: ${walletAddress}`);
    } catch (e) {
        ui.write('Error claiming reward: ' + e);
    }
}
