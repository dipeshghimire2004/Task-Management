import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import store from './store/store.ts';
import App from './App.tsx'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'



// const queryClient=new QueryClient()
createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Provider store={store}>
    <App />
  </Provider>,
  </StrictMode>,
)