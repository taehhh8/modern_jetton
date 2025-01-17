import {
    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
    toNano,
<<<<<<< HEAD
=======
    OpenedContract,
>>>>>>> 130ef51659534b09f6f76d677d34dc796121f5a7
} from 'ton-core';

export type JettonMinterContent = {
    type: 0 | 1;
    uri: string;
};
export type JettonMinterConfig = { admin: Address; content: Cell; wallet_code: Cell };

export function jettonMinterConfigToCell(config: JettonMinterConfig): Cell {
    return beginCell()
        .storeCoins(0)
        .storeAddress(config.admin)
        .storeRef(config.content)
        .storeRef(config.wallet_code)
        .endCell();
}

export function jettonContentToCell(content: JettonMinterContent) {
    return beginCell()
        .storeUint(content.type, 8)
        .storeStringTail(content.uri) //Snake logic under the hood
        .endCell();
}

export class JettonMinter implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new JettonMinter(address);
    }

    static createFromConfig(config: JettonMinterConfig, code: Cell, workchain = 0) {
        const data = jettonMinterConfigToCell(config);
        const init = { code, data };
        return new JettonMinter(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    static mintMessage(to: Address, jetton_amount: bigint, forward_ton_amount: bigint, total_ton_amount: bigint) {
        return beginCell()
            .storeUint(0x1674b0a0, 32)
            .storeUint(0, 64) // op, queryId
            .storeAddress(to)
            .storeCoins(jetton_amount)
            .storeCoins(forward_ton_amount)
            .storeCoins(total_ton_amount)
            .endCell();
    }
    async sendMint(
        provider: ContractProvider,
        via: Sender,
        to: Address,
        jetton_amount: bigint,
        forward_ton_amount: bigint,
        total_ton_amount: bigint
    ) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonMinter.mintMessage(to, jetton_amount, forward_ton_amount, total_ton_amount),
            value: total_ton_amount + toNano('0.1'),
        });
    }

    /* provide_wallet_address#2c76b973 query_id:uint64 owner_address:MsgAddress include_address:Bool = InternalMsgBody;
     */
    static discoveryMessage(owner: Address, include_address: boolean) {
        return beginCell()
            .storeUint(0x2c76b973, 32)
            .storeUint(0, 64) // op, queryId
            .storeAddress(owner)
            .storeBit(include_address)
            .endCell();
    }

    async sendDiscovery(
        provider: ContractProvider,
        via: Sender,
        owner: Address,
        include_address: boolean,
        value: bigint = toNano('0.1')
    ) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonMinter.discoveryMessage(owner, include_address),
            value: value,
        });
    }

    static changeAdminMessage(newOwner: Address) {
        return beginCell()
            .storeUint(0x4840664f, 32)
            .storeUint(0, 64) // op, queryId
            .storeAddress(newOwner)
            .endCell();
    }

    async sendChangeAdmin(provider: ContractProvider, via: Sender, newOwner: Address) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonMinter.changeAdminMessage(newOwner),
            value: toNano('0.1'),
        });
    }
    static changeContentMessage(content: Cell) {
        return beginCell()
            .storeUint(0x5773d1f5, 32)
            .storeUint(0, 64) // op, queryId
            .storeRef(content)
            .endCell();
    }

    async sendChangeContent(provider: ContractProvider, via: Sender, content: Cell) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonMinter.changeContentMessage(content),
            value: toNano('0.1'),
        });
    }
    async getWalletAddress(provider: ContractProvider, owner: Address): Promise<Address> {
        const res = await provider.get('get_wallet_address', [
            { type: 'slice', cell: beginCell().storeAddress(owner).endCell() },
        ]);
        return res.stack.readAddress();
    }

    async getJettonData(provider: ContractProvider) {
        let res = await provider.get('get_jetton_data', []);
        let totalSupply = res.stack.readBigNumber();
        let mintable = res.stack.readBoolean();
        let adminAddress = res.stack.readAddress();
        let content = res.stack.readCell();
        let walletCode = res.stack.readCell();
        return {
            totalSupply,
            mintable,
            adminAddress,
            content,
            walletCode,
        };
    }

    async getTotalSupply(provider: ContractProvider) {
        let res = await this.getJettonData(provider);
        return res.totalSupply;
    }
    async getAdminAddress(provider: ContractProvider) {
        let res = await this.getJettonData(provider);
        return res.adminAddress;
    }
    async getContent(provider: ContractProvider) {
        let res = await this.getJettonData(provider);
        return res.content;
    }
    // 게임 보상 청구 메시지 생성
    static claimRewardMessage(player: Address, amount: bigint) {
        return beginCell()
            .storeUint(0x1674b0a0, 32) // mint operation
            .storeUint(0, 64) // query id
            .storeAddress(player)
            .storeCoins(amount)
            .storeCoins(toNano('0.02')) // forward amount
            .storeCoins(toNano('0.05')) // total amount
            .endCell();
    }

    // 보상 청구 메서드
    async claimReward(provider: ContractProvider, via: Sender, amount: bigint) {
        await provider.internal(via, {
            value: toNano('0.05'),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: JettonMinter.claimRewardMessage(via.address!, amount),
        });
    }
}

export class GameJettonMinter extends JettonMinter {
    // 기존 JettonMinter 코드 상속

    static createFromConfig(config: JettonMinterConfig & { gameMaster: Address }, code: Cell, workchain = 0) {
        const data = beginCell()
            .storeCoins(0)
            .storeAddress(config.admin)
            .storeAddress(config.gameMaster)
            .storeRef(config.content)
            .storeRef(config.wallet_code)
            .endCell();
        const init = { code, data };
        return new GameJettonMinter(contractAddress(workchain, init), init);
    }

    // 보상 청구 메시지 생성
    static claimRewardMessage(to: Address, amount: bigint) {
        return beginCell()
            .storeUint(0x1674b0a0, 32)
            .storeUint(0, 64) // query_id
            .storeAddress(to)
            .storeCoins(amount)
            .endCell();
    }

    // 보상 청구 함수
    async sendClaimReward(provider: ContractProvider, via: Sender, to: Address, amount: bigint) {
        await provider.internal(via, {
            value: toNano('0.05'),
            body: GameJettonMinter.claimRewardMessage(to, amount),
            sendMode: SendMode.PAY_GAS_SEPARATELY,
        });
    }

    // 게임 마스터 주소 조회
    async getGameMaster(provider: ContractProvider): Promise<Address> {
        const { stack } = await provider.get('get_game_master', []);
        return stack.readAddress();
    }
}
