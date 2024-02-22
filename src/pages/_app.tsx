import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Poppins } from 'next/font/google'
import { RecoilRoot } from 'recoil'

const inter = Poppins({ subsets: ['latin'], weight: ["400"] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <Head >
        <title >Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={inter.className}>
        <Component {...pageProps} />
      </div>
    </RecoilRoot>
  )
}
