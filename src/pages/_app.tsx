import '../styles/globals.css'
import 'semantic-ui-css/semantic.min.css'

import type { AppProps } from 'next/app'
import { Provider as AuthProvider } from 'next-auth/client'

import { Provider as StoreProvider} from 'react-redux'
import {useStore} from "../store/store";

function MyApp({ Component, pageProps }: AppProps) {
  const store = useStore(pageProps.initialReduxState)

  return (
    <StoreProvider store={store}>
      <AuthProvider session={pageProps.session}>
        <Component {...pageProps} />
      </AuthProvider>
    </StoreProvider>
  )
}

export default MyApp
