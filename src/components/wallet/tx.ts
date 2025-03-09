import { PrivyClient } from '@privy-io/server-auth'

const appID = 'cm5nm8pjw00t9cp8m1buobjq1'
// 4u1GcEaoQE9BrNPKLDb6ey89xkuKoBRCBWuZVNPxZvpX5MQP1HiihchSjJJcbFYmU44HKQ71RjSomWBtsMRrSfQo
const secretKey =
  '4H1Z15h6mVjjh92XNsJMkB814JVACbiqUeKPzZJh8r9Vu9FgDmrD4LnJziP25YZJW2etnUvfj8b3MdzY7YUBWrjC' //nolint
const verificationKey = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE+tyOS7QNisp1lLM7FYWerwcb4Q230Dd0fULBfwk5iNkhNyvNXAoLOpdfoSsB8/NPkfSq2qgW5E99tBdVfQ0kJA==
-----END PUBLIC KEY-----`
const PRIVY_AUTHORIZATION_KEY = `wallet-auth:MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgAjtyDhG012RYl4zYgzSK9x5WHDPJ4Czmo8WX4MV2q3uhRANCAAQU0AvdYV6IZ1hiyyFTWPWznSJBRUQgarP3pASCAZERN+UkacRC21h4mZJ8GBs1VYEIsJLBxwNBgmHqczjeDgH+`
const walletId = '0xC718346E63E11Cca782290cB0a040741AC172AD3' // 'cm5xgdqs500cj6n4ltdi64kt1'

const sendTx = async () => {
  const privy = new PrivyClient(appID, secretKey, {
    walletApi: {
      authorizationPrivateKey: PRIVY_AUTHORIZATION_KEY,
    },
  })
  // console.log(privy)
  // const wallets = await privy.walletApi.getWallet({id:walletId})
  // console.log('wallets:', wallets)
  const data  = await privy.walletApi.ethereum.sendTransaction({
    address: "0xC718346E63E11Cca782290cB0a040741AC172AD3",
    caip2: 'eip155:8453',
    chainType: "ethereum",
    // method: "eth_sendTransaction",
    transaction: {
      to: '0x8bcC47f3a32BF8171F2D8b10fc815C71DE331d0b',
      value: 100000,
      chainId: 8453,
    },
  })

  console.log('data:', data)
}

sendTx()
