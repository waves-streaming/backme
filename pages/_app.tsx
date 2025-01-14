import type { AppProps } from "next/app";
import Head from "next/head";
import { ThirdwebProvider, useSDK, useSigner } from "@thirdweb-dev/react";
import { CHAIN, IS_DEV_ENV } from "../const/chains";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
import {
  LensProvider,
  RequiredSigner,
  development,
  production,
} from "@lens-protocol/react-web";
import { JsonRpcProvider } from "@ethersproject/providers";
// core styles are required for all packages
import '@mantine/core/styles.css';
import NetworkSwitchModal from "@/components/NetworkSwitchModal";
import { Toaster } from "@/components/ui/toaster";
import { useTypedDataSignerWrapper } from "@/lib/typedDataSigner";
import { useRouter } from "next/router";
import { ActionIcon, AppShell, Container, Group, MantineProvider, Tooltip } from '@mantine/core';
import { RiArrowRightDoubleLine, RiArrowLeftDoubleLine } from 'react-icons/ri';
import { useDisclosure } from '@mantine/hooks';
import { MantineHeader } from '@/components/MantineAppShell/MantineHeader/MantineHeader';
import {
  LivepeerConfig,
  createReactClient,
  studioProvider,
} from "@livepeer/react";

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: "20d9bc8b-a32b-4259-ba84-2608f5c41721",
  }),
});
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

function LensThirdwebProvider({ children }: { children: React.ReactNode }) {
  const sdk = useSDK();
  const signer = useSigner();
  const router = useRouter();
  const signerWrapped = useTypedDataSignerWrapper(signer, sdk);

  if (!signer && router.pathname !== "/") {
    return (
      <>
        <NetworkSwitchModal />
      </>
    );
  }

  return (
    <LensProvider
      config={{
        environment: IS_DEV_ENV ? development : development,
        bindings: {
          getSigner: async () => signerWrapped as RequiredSigner,
          getProvider: async () =>
            IS_DEV_ENV
              ? new JsonRpcProvider("https://mumbai.rpc.thirdweb.com")
              : new JsonRpcProvider("https://mumbai.rpc.thirdweb.com"),
        },
        // @ts-ignore: TODO
        appId: "waves",
      }}
    >
      {children}
    </LensProvider>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  return (
    <>
      <Head>
        <title>Waves</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <LivepeerConfig client={livepeerClient}>
            <MantineProvider>
              <ThirdwebProvider
          activeChain={CHAIN}
          authConfig={{
            domain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || "evmkit.com",
            authUrl: "/api/auth",
          }}
          clientId={process.env.NEXT_PUBLIC_THIRDWEB_API_KEY || ""}
        >
          <LensThirdwebProvider>
              <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
      aside={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
    >
      <AppShell.Header>

        <MantineHeader/>
      </AppShell.Header>
      <AppShell.Navbar>
        {desktopOpened ? (
        <>
         <Tooltip position="right-start" label="Close Sidebars">
      <ActionIcon onClick={toggleDesktop} visibleFrom="sm"  >
       <RiArrowLeftDoubleLine/>
     </ActionIcon>
     </Tooltip>
     </>
   
    ) : 
   null}
    
    </AppShell.Navbar>
    <AppShell.Aside>
  
 </AppShell.Aside>
 
      <AppShell.Main >
      {!desktopOpened ? (
          <Tooltip position="right-start" label="Open Sidebars">
  <div style={{ position: 'fixed' }}>
    <ActionIcon onClick={toggleDesktop} visibleFrom="sm">
      <RiArrowRightDoubleLine />
    </ActionIcon>
  </div>
</Tooltip>

    ) : null}
   
  
            <NetworkSwitchModal />
            <Component {...pageProps} />
            <Toaster />
           
        </AppShell.Main>
   </AppShell>
</LensThirdwebProvider>
        </ThirdwebProvider>
            </MantineProvider>
      </LivepeerConfig>    
      </main>
    </>
  );
}

export default MyApp;
