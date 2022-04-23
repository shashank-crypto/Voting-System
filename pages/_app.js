import '../styles/globals.css'
import 'bulma/css/bulma.min.css';
// import { MoralisProvider } from "react-moralis";

function MyApp({ Component, pageProps }) {
  return (
  // <MoralisProvider serverUrl="https://pve8nnk63tvd.usemoralis.com:2053/server" appId="hgCxsIDNCvNSqsl66PYHU2oEEdDXVBHpMUkK2An4">
    <Component {...pageProps} />
  // </MoralisProvider>
  )
}

export default MyApp
