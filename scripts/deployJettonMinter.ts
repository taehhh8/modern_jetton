import { Address, toNano } from 'ton-core';
import { JettonMinter, jettonContentToCell } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton-community/blueprint';

// THAN 토큰 메타데이터 설정
const THAN_METADATA = {
    name: 'THanChain',
    description: 'THanChain Token for SPIN Game Rewards',
    symbol: 'THAN',
    decimals: 18,
    image: 'https://raw.githubusercontent.com/hanchain-paykhan/hanchain/main/logo/logo.svg',
};

export async function run(provider: NetworkProvider) {
    try {
        // 관리자 주소 설정 (당신의 테스트넷 지갑 주소)
        const ADMIN_ADDRESS = provider.sender().address!;

        // 컨트랙트 코드 컴파일
        const jettonWalletCode = await compile('JettonWallet');

        // 메타데이터를 Cell로 변환
        const content = jettonContentToCell({
            type: 1, // off-chain 메타데이터
            uri: JSON.stringify(THAN_METADATA),
        });

        // Jetton Minter 생성
        const minter = provider.open(
            await JettonMinter.createFromConfig(
                {
                    admin: ADMIN_ADDRESS,
                    content: content,
                    wallet_code: jettonWalletCode,
                },
                await compile('JettonMinter')
            )
        );

        // 컨트랙트 배포
        await minter.sendDeploy(provider.sender(), toNano('0.05'));

        // 배포 정보 출력
        console.log('=================');
        console.log('DEPLOYMENT INFO:');
        console.log('=================');
        console.log('THAN Token Minter deployed at:', minter.address.toString());
        console.log('Admin address:', ADMIN_ADDRESS.toString());
        console.log('=================');

        return minter.address;
    } catch (error) {
        console.error('Deployment failed:', error);
        throw error;
    }
}
