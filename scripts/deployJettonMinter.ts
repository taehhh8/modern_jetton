import { Address, toNano } from 'ton-core';
<<<<<<< HEAD
import { GameJettonMinter, jettonContentToCell } from '../wrappers/JettonMinter';
import { compile, NetworkProvider } from '@ton-community/blueprint';
import { promptAddress, promptUrl } from '../wrappers/ui-utils';
=======
import {
    JettonMinter,
    JettonMinterContent,
    jettonContentToCell,
    jettonMinterConfigToCell,
} from '../wrappers/JettonMinter';
import { compile, NetworkProvider, UIProvider } from '@ton-community/blueprint';
import { promptAddress, promptBool, promptUrl } from '../wrappers/ui-utils';

const formatUrl =
    'https://github.com/ton-blockchain/TEPs/blob/master/text/0064-token-data-standard.md#jetton-metadata-example-offchain';
const exampleContent = {
    name: 'Sample Jetton',
    description: 'Sample of Jetton',
    symbol: 'JTN',
    decimals: 0,
    image: 'https://www.svgrepo.com/download/483336/coin-vector.svg',
};
const urlPrompt = 'Please specify url pointing to jetton metadata(json):';
>>>>>>> 130ef51659534b09f6f76d677d34dc796121f5a7

export async function run(provider: NetworkProvider) {
    const ui = provider.ui();
    const sender = provider.sender();
<<<<<<< HEAD

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
=======
    const adminPrompt = `Please specify admin address`;
    ui.write(`Jetton deployer\nCurrent deployer onli supports off-chain format:${formatUrl}`);

    let admin = await promptAddress(adminPrompt, ui, sender.address);
    ui.write(`Admin address:${admin}\n`);
    let contentUrl = await promptUrl(urlPrompt, ui);
    ui.write(`Jetton content url:${contentUrl}`);

    let dataCorrect = false;
    do {
        ui.write('Please verify data:\n');
        ui.write(`Admin:${admin}\n\n`);
        ui.write('Metadata url:' + contentUrl);
        dataCorrect = await promptBool('Is everything ok?(y/n)', ['y', 'n'], ui);
        if (!dataCorrect) {
            const upd = await ui.choose('What do you want to update?', ['Admin', 'Url'], (c) => c);

            if (upd == 'Admin') {
                admin = await promptAddress(adminPrompt, ui, sender.address);
            } else {
                contentUrl = await promptUrl(urlPrompt, ui);
            }
        }
    } while (!dataCorrect);

    const content = jettonContentToCell({ type: 1, uri: contentUrl });
>>>>>>> 130ef51659534b09f6f76d677d34dc796121f5a7

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

<<<<<<< HEAD
    // 배포 여부 확인
    const isDeployed = await provider.isContractDeployed(minter.address);
    if (isDeployed) {
        ui.write('Contract already deployed');
        return;
    }
=======
    const minter = JettonMinter.createFromConfig({ admin, content, wallet_code }, await compile('JettonMinter'));
>>>>>>> 130ef51659534b09f6f76d677d34dc796121f5a7

    // 컨트랙트 배포
    await provider.deploy(minter, toNano('0.1'));
    ui.write(`Deployed at: ${minter.address}`);
}
