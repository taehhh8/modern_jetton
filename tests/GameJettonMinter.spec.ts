import { Blockchain, SandboxContract, TreasuryContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { GameJettonMinter } from '../wrappers/JettonMinter';
import { compile } from '@ton-community/blueprint';
import '@ton-community/test-utils';

describe('GameJettonMinter', () => {
    let blockchain: Blockchain;
    let minter: SandboxContract<GameJettonMinter>;
    let deployer: SandboxContract<TreasuryContract>;
    let gameMaster: SandboxContract<TreasuryContract>;
    let user: SandboxContract<TreasuryContract>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury('deployer');
        gameMaster = await blockchain.treasury('gameMaster');
        user = await blockchain.treasury('user');

        // 컨트랙트 배포
        const jettonMinterCode = await compile('JettonMinter');

        minter = blockchain.openContract(
            GameJettonMinter.createFromConfig(
                {
                    admin: deployer.address,
                    gameMaster: gameMaster.address,
                    content: Cell.EMPTY,
                    wallet_code: Cell.EMPTY,
                },
                jettonMinterCode
            )
        );

        await minter.sendDeploy(deployer.getSender(), toNano('0.1'));
    });

    it('should claim reward successfully', async () => {
        const rewardAmount = toNano('10'); // 10 토큰 보상

        // 보상 청구 전 잔액 확인
        const balanceBefore = await minter.getTotalSupply();

        // 게임 마스터가 보상 청구
        await minter.sendClaimReward(gameMaster.getSender(), user.address, rewardAmount);

        // 보상 청구 후 잔액 확인
        const balanceAfter = await minter.getTotalSupply();
        expect(balanceAfter).toEqual(balanceBefore + rewardAmount);

        // 사용자의 지갑 주소 확인
        const userWallet = await minter.getWalletAddress(user.address);
        // 사용자 지갑의 잔액 확인
        // ... 지갑 잔액 확인 로직
    });

    it('should fail when non-game-master tries to claim reward', async () => {
        // 일반 사용자가 보상 청구 시도
        await expect(minter.sendClaimReward(user.getSender(), user.address, toNano('10'))).toThrow();
    });
});
