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
      {/*Will check session every 60 secs, and keeps alive 5 mins*/}
      <AuthProvider session={pageProps.session} options={{ clientMaxAge: 60, keepAlive: 5 * 60 }}>
        <Component {...pageProps} />
      </AuthProvider>
    </StoreProvider>
  )
}

export default MyApp
