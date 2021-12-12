import type { AppProps } from 'next/app';
import { GeistProvider, CssBaseline } from '@geist-ui/react';
import 'inter-ui/inter.css';

import Header from '../components/header/header';

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <GeistProvider>
      <CssBaseline />
      <Header />
      <Component {...pageProps} />
    </GeistProvider>
  );
};

export default App;
