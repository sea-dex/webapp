import { ITokenList } from '@/api/tokenList'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Token } from '@/types/Token'
import { useState } from 'react'

function TokenList(props: { quote: string; tokenList: Token[] }) {
  const tokens = props.tokenList.filter((t) => t.symbol !== props.quote)

  return (
    <ul>
      {tokens.map((token) => {
        return <li key={token.address}>{token.symbol}</li>
      })}
      {/* <li></li> */}
    </ul>
  )
}

function PairSelect({tokens}: {tokens: ITokenList}) {
  const [currentQuote, setCurrentQuote] = useState(tokens.quoteList[0].symbol)

  return (
    <>
      <Tabs
        defaultValue={currentQuote}
        className="w-[400px]"
        onValueChange={(v) => setCurrentQuote(v)}
      >
        <TabsList>
          {tokens.quoteList.map((quote) => {
            return (
              <TabsTrigger key={quote.address} value={quote.symbol}>
                {quote.symbol}
              </TabsTrigger>
            )
          })}
          {/* <TabsTrigger value="account">Account</TabsTrigger> */}
          {/* <TabsTrigger value="password">Password</TabsTrigger> */}
        </TabsList>

        <TabsContent value={currentQuote}>
          <TokenList tokenList={tokens.tokenList} quote={currentQuote} />
        </TabsContent>
        {/* <TabsContent value="account">Make changes to your account here.</TabsContent> */}
        {/* <TabsContent value="password">Change your password here.</TabsContent> */}
      </Tabs>
    </>
  )
}

export default PairSelect
