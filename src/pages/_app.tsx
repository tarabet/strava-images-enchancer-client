import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'

import type { AppProps } from 'next/app'

import { Provider } from 'react-redux'
import { useStore } from "../store/store";

function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState)

  return (
    <Provider store={store}>
        <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
