import { Address, toNano } from 'ton-core';
import { GameJettonMinter, jettonContentToCell } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton-community/blueprint';
import { promptAddress, promptUrl } from '../wrappers/ui-utils';

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const sender = provider.sender();

    // 관리자 주소 입력
    const admin = await promptAddress('Enter admin address:', ui);

    // 게임 마스터 주소 입력
    const gameMaster = await promptAddress('Enter game master address:', ui);

    // 메타데이터 URL 입력
    const contentUrl = await promptUrl('Enter metadata URL:', ui);

    // 메타데이터 생성
    const content = jettonContentToCell({
        type: 1,
        uri: contentUrl,
    });

    // 지갑 코드 컴파일
    const walletCode = await compile('JettonWallet');

    // 컨트랙트 인스턴스 생성
    const minter = GameJettonMinter.createFromConfig(
        {
            admin,
            gameMaster,
            content,
            wallet_code: walletCode,
        },
        await compile('JettonMinter')
    );

    // 배포 여부 확인
    const isDeployed = await provider.isContractDeployed(minter.address);
    if (isDeployed) {
        ui.write('Contract already deployed');
        return;
    }

    // 컨트랙트 배포
    await provider.deploy(minter, toNano('0.1'));
    ui.write(`Deployed at: ${minter.address}`);
}
