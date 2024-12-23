import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import store from './store/store.ts';
import App from './App.tsx'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {Auth0Provider} from '@auth0/auth0-react'


// const queryClient=new QueryClient()
createRoot(document.getElementById('root')!).render(
    <Auth0Provider
      domain='dev-o4cfv3zrgg7vzl4a.us.auth0.com'
      clientId='oJkdBmA9yHlYSCCOJz8sU3cO6azM492a'
      authorizationParams={{
        redirect_uri:window.location.origin
      }}
    >
      <Provider store={store}>
        <App />
      </Provider>,
    </Auth0Provider>,
)
