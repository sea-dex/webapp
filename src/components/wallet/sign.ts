import { PrivyClient } from '@privy-io/react-auth'
import canonicalize from 'canonicalize' // Support JSON canonicalization
import crypto from 'crypto' // Support P-256 signing

// Replace this with your private key from the Dashboard

const appID = 'cm5nm8pjw00t9cp8m1buobjq1'
// 4u1GcEaoQE9BrNPKLDb6ey89xkuKoBRCBWuZVNPxZvpX5MQP1HiihchSjJJcbFYmU44HKQ71RjSomWBtsMRrSfQo
const secretKey =
  '4H1Z15h6mVjjh92XNsJMkB814JVACbiqUeKPzZJh8r9Vu9FgDmrD4LnJziP25YZJW2etnUvfj8b3MdzY7YUBWrjC' //nolint
const verificationKey = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE+tyOS7QNisp1lLM7FYWerwcb4Q230Dd0fULBfwk5iNkhNyvNXAoLOpdfoSsB8/NPkfSq2qgW5E99tBdVfQ0kJA==
-----END PUBLIC KEY-----`
const PRIVY_AUTHORIZATION_KEY = `wallet-auth:MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgAjtyDhG012RYl4zYgzSK9x5WHDPJ4Czmo8WX4MV2q3uhRANCAAQU0AvdYV6IZ1hiyyFTWPWznSJBRUQgarP3pASCAZERN+UkacRC21h4mZJ8GBs1VYEIsJLBxwNBgmHqczjeDgH+`

function getAuthorizationSignature({ url, body }: { url: string; body: object }) {
  const payload = {
    version: 1,
    method: 'POST',
    url,
    body,
    headers: {
      'privy-app-id': appID,
      // If your request includes an idempotency key, include that header here as well
    },
  }

  // JSON-canonicalize the payload and convert it to a buffer
  const serializedPayload = canonicalize(payload) as string
  console.log('serialized payload:', serializedPayload)
  const serializedPayloadBuffer = Buffer.from(serializedPayload)

  // Replace this with your app's authorization key. We remove the 'wallet-auth:' prefix
  // from the key before using it to sign requests
  const privateKeyAsString = PRIVY_AUTHORIZATION_KEY.replace('wallet-auth:', '')

  // Convert your private key to PEM format, and instantiate a node crypto KeyObject for it
  const privateKeyAsPem = `-----BEGIN PRIVATE KEY-----\n${privateKeyAsString}\n-----END PRIVATE KEY-----`
  const privateKey = crypto.createPrivateKey({
    key: privateKeyAsPem,
    format: 'pem',
  })

  console.log('private key:', privateKey.symmetricKeySize, privateKey.type)

  // Sign the payload buffer with your private key and serialize the signature to a base64 string
  const signatureBuffer = crypto.sign('sha256', serializedPayloadBuffer, privateKey)
  console.log(signatureBuffer.length)
  const signature = signatureBuffer.toString('base64')
  console.log('signature:', signature)

  const verifyResult = verifySignature(url, body, signature) // crypto.verify('sha256', serializedPayloadBuffer, privateKey, signatureBuffer)
  console.log('verify result:', verifyResult)
  return signature
}

function verifySignature(url: string, body: object, s: string): boolean {
  const signatureBuffer = Buffer.from(s, 'base64')
  // Replace this with your app's authorization key. We remove the 'wallet-auth:' prefix
  // from the key before using it to sign requests
  const privateKeyAsString = PRIVY_AUTHORIZATION_KEY.replace('wallet-auth:', '')

  // Convert your private key to PEM format, and instantiate a node crypto KeyObject for it
  const privateKeyAsPem = `-----BEGIN PRIVATE KEY-----\n${privateKeyAsString}\n-----END PRIVATE KEY-----`
  const privateKey = crypto.createPrivateKey({
    key: privateKeyAsPem,
    format: 'pem',
  })
  const payload = {
    version: 1,
    method: 'POST',
    url,
    body,
    headers: {
      'privy-app-id': appID,
      // If your request includes an idempotency key, include that header here as well
    },
  }

  // JSON-canonicalize the payload and convert it to a buffer
  const serializedPayload = canonicalize(payload) as string
  console.log('verifySignature serialized payload:', serializedPayload)
  const serializedPayloadBuffer = Buffer.from(serializedPayload)

  return crypto.verify('sha256', serializedPayloadBuffer, privateKey, signatureBuffer)
}

// MEYCIQD9DPKWAs5Qo7mjlkqc125foAtCvPEoO3kRKgYvjSKCuwIhAOZobqONjl4HubB9nI4MkVD/t25GIIYudbKSwKQ0EE1Q
const authorizationSignature = getAuthorizationSignature({
  // Replace with your desired path, e.g. '/v1/wallets/<wallet_id>/rpc'
  url: 'https://auth.privy.io/api/v1/wallets',
  // Replace with your desired body
  body: {
    chain_type: 'ethereum',
    // chain: 'ethereum',
  },
})

console.log(authorizationSignature)

const result =
  verifySignature(
    'https://auth.privy.io/api/v1/wallets',
    {
      chain_type: 'ethereum',
    },
    'MEUCIQD7ZW4xlXFRfIyCnCFI0kCrodSp1P1BknH/F2fv2+mB5gIgKXViHfY+uiVGoKijm+hz6DJmslw/Jd2tDxgcGZg2MGE='
    // 'MEUCICKzMZtvL1iUSe7CUbrwNBMxdLl3HX9mQky7qvcOElSKAiEAyf6zEMcjj1NGvS0Dz/YCOcd4tyv5x2o5zHttLJFq/OM='
    //'po2Hpm1gLUwXzymgI/AoI/wcuu3jHm7o112bnHausGRTB4r1dTdZD5TDH8dK5Pl+X+w0hqD5QCcgWHKMwkGLDQ=='
  )
console.log('verify result:', result)

// O9gbOwmQ3YKwL398t8vegDJFGL84gSa47R+zhVsgj0EgAeOo/qilYk+i3enfckygmZMXwcKNcBWQb8gX6XvggQ==
// MEUCIHa/9wPjyO7oDMdZdSXsiRFpxbMiNR6HbH8pph29NM2bAiEAzu04QxVB60f2imvFfyBSQcTkRTN6foJetGjHgQ21azA=
