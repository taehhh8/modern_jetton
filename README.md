# Jetton

Implementation of standard jetton with additonal *withdraw_tons* and *withdraw_jettons*.

Also tests via sandbox

```
modern_jetton
├─ .git
│  ├─ config
│  ├─ description
│  ├─ FETCH_HEAD
│  ├─ HEAD
│  ├─ hooks
│  │  ├─ applypatch-msg.sample
│  │  ├─ commit-msg.sample
│  │  ├─ fsmonitor-watchman.sample
│  │  ├─ post-update.sample
│  │  ├─ pre-applypatch.sample
│  │  ├─ pre-commit.sample
│  │  ├─ pre-merge-commit.sample
│  │  ├─ pre-push.sample
│  │  ├─ pre-rebase.sample
│  │  ├─ pre-receive.sample
│  │  ├─ prepare-commit-msg.sample
│  │  ├─ push-to-checkout.sample
│  │  ├─ sendemail-validate.sample
│  │  └─ update.sample
│  ├─ index
│  ├─ info
│  │  └─ exclude
│  ├─ logs
│  │  ├─ HEAD
│  │  └─ refs
│  │     ├─ heads
│  │     │  ├─ master
│  │     │  └─ share-distributor
│  │     └─ remotes
│  │        └─ origin
│  │           └─ HEAD
│  ├─ objects
│  │  ├─ info
│  │  └─ pack
│  │     ├─ pack-f8e10d7269fe7276c39578f8e0c746685d86f9be.idx
│  │     ├─ pack-f8e10d7269fe7276c39578f8e0c746685d86f9be.pack
│  │     └─ pack-f8e10d7269fe7276c39578f8e0c746685d86f9be.rev
│  ├─ packed-refs
│  └─ refs
│     ├─ heads
│     │  ├─ master
│     │  └─ share-distributor
│     └─ remotes
│        └─ origin
│           └─ HEAD
├─ .gitignore
├─ .idea
│  ├─ .gitignore
│  ├─ JettonBase.iml
│  ├─ modules.xml
│  └─ vcs.xml
├─ .prettierrc
├─ contracts
│  ├─ error-codes.func
│  ├─ jetton-minter.func
│  ├─ jetton-utils.func
│  ├─ jetton-wallet.func
│  ├─ messages.func
│  ├─ op-codes.func
│  ├─ params.func
│  └─ stdlib.func
├─ jest.config.js
├─ package-lock.json
├─ package.json
├─ README.md
├─ scripts
│  ├─ deployJettonMinter.ts
│  ├─ deployJettonWallet.ts
│  └─ minterController.ts
├─ tests
│  ├─ JettonWallet.spec.ts
│  └─ utils.ts
├─ tsconfig.json
└─ wrappers
   ├─ JettonMinter.compile.ts
   ├─ JettonMinter.ts
   ├─ JettonWallet.compile.ts
   ├─ JettonWallet.ts
   └─ ui-utils.ts

```