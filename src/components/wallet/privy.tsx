'use client'
import { useWallets, usePrivy, useDelegatedActions } from '@privy-io/react-auth'
import { useToken } from '@privy-io/react-auth'
import { useConnectWallet } from '@privy-io/react-auth'
import { useEffect } from 'react'
import axios from 'axios'

function PrivyWalletButton() {
  const { ready, authenticated, login, logout, user, signMessage, sendTransaction } = usePrivy()
  // Disable login when Privy is not ready or the user is already authenticated
  const disableLogin = !ready || (ready && authenticated)

  console.log('ready:', ready, 'authenticated:', authenticated)
  console.log('user:', user)
  const wallets = useWallets()
  console.log('wallets:', wallets)

  useEffect(() => {
    if (wallets.ready) {
      wallets.wallets.forEach((w) => {
        if (
          w.connectorType === 'embedded' &&
          w.type === 'ethereum' &&
          w.walletClientType === 'privy' &&
          w.chainId !== 'eip155:8453'
        ) {
          w.switchChain(8453)
        }
      })
    }
  }, [wallets])

  const { getAccessToken } = useToken()
  const { delegateWallet } = useDelegatedActions()

  //     {
  //     onAccessTokenGranted: ({accessToken}) => {
  //       // Any logic you'd like to execute after Privy has granted a user an app
  //       // access token or has refreshed their existing token
  //       console.log('accessToken:', accessToken)
  //     },
  //     onAccessTokenRemoved: () => {
  //       // Any logic you'd like to execute when Privy revokes a user's app access token
  //       // and removes it from cookies or local storage
  //     },
  //   });

  const { connectWallet } = useConnectWallet({
    onSuccess: ({ wallet }) => {
      console.log(wallet)
      // Any logic you'd like to execute after a user successfully connects their wallet
    },
    onError: (error) => {
      console.log(error)
      // Any logic you'd like to execute after a user exits the connection flow or there is an error
    },
  })

  const onDelegateWallet = () => {
    delegateWallet({ address: '0xC718346E63E11Cca782290cB0a040741AC172AD3', chainType: 'ethereum' })
  }
  const message = 'Hello world'
  const uiOptions = {
    title: 'Sample title text',
    description: 'Sample description text',
    buttonText: 'Sample button text',
  }

  const postToken = async () => {
    const token = await getAccessToken()
    console.log('token:', token)
    axios.post('http://localhost:7892/api/v0/auth/wallet/linked', {accessToken: token})
  }

  return (
    <>
      <button disabled={disableLogin} onClick={login} className="w-12 mr-4">
        Login
      </button>
      {/* <button onClick={connectWallet} className="w-12 mr-4">
        Connect
      </button> */}
      <button onClick={logout} className="w-12 mr-4">
        Logout
      </button>
      <button
        onClick={postToken}
        className="w-12 mr-4"
      >
        Token
      </button>

      <button onClick={onDelegateWallet} className="w-12 mr-4">
        Delegate
      </button>

      {/* <button
        onClick={async () => {
          // Use `signature` below however you'd like
          const { signature } = await signMessage({ message }, { uiOptions })
          console.log('signature:', signature)
        }}
        className="w-12 mr-4"
      >
        Sign
      </button> */}

      <button
        onClick={async () => {
          // Use `signature` below however you'd like
          const { hash } = await sendTransaction({
            to: '0x8bcC47f3a32BF8171F2D8b10fc815C71DE331d0b',
            value: 100000000000000,
            chainId: 8453,
          })
          console.log('hash:', hash)
        }}
        className="w-12 mr-4"
      >
        Tx
      </button>
    </>
  )
}

export { PrivyWalletButton }
