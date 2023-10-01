
import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import SignInWithLensButton from "@/components/SignInWithLensButton";
import { useActiveProfile, useActiveWallet } from "@lens-protocol/react-web";
import { MediaRenderer } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { Center, Container, Paper, Text, Button, ActionIcon, UnstyledButton, Space } from "@mantine/core";

const Login: NextPage = () => {
  const router = useRouter();
  const walletInfo = useActiveWallet();
  const activeProfile = useActiveProfile();

  return (
    <>
     <Container>
    <Paper shadow="xl" radius="xl" withBorder p="xl">
        <Center>
            <Text size="xl" fw={900} fs="italic" variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }}>Waves</Text>
            </Center>
            
           <Space h="md" />
        {/* Wallet connected, but no Lens profile */}
          {walletInfo?.data && !activeProfile?.data && (
            <>
            
              
              <Center>
              <Text c="dimmed" fw={500}>
                Waves requires you to have a Lens Profile NFT.{" "}
                <Link
                  href="https://lens.xyz/"
                  target="_blank"
                  className="underline"
                >
                  Learn more
                </Link>
                .
              </Text>
            </Center>
<Space h="md" />
            <Center>
              <Text c="dimmed" fw={500}>
                You don't have a Lens Profile yet. 😞
              </Text>
              </Center>
            </>
          )}
              <Space h="md" />
            
                {walletInfo?.data && activeProfile?.data ? (
                  <Center>
                  <Button variant="gradient" gradient={{ from: 'blue', to: 'cyan', deg: 90 }} onClick={() => router.push("/feed")}>
                    Continue to Waves
                  </Button>
                  </Center>
                ) : (
                  <Center>
                  <SignInWithLensButton />
                  </Center>
                )}
            
         
        <div className="md:flex md:border-l-2 border-[rbga(0,0,0,0.1)] md:pl-4 h-[85%] w-full">
          {/* Wallet connected, has profile on Lens. */}
          {walletInfo?.data && activeProfile?.data && (
            <div className="flex flex-col w-full justify-start items-center space-y-4">
              <p className="text-2xl font-semibold">Your Lens Profile</p>

              <div className="flex flex-row outline outline-2 outline-[rgba(255,255,255,.1)] rounded-md p-4 w-full gap-4 items-center">
                <MediaRenderer
                  src={
                    // @ts-ignore
                    activeProfile?.data?.picture?.original?.url || "/user.png"
                  }
                  width="128px"
                  height="128px"
                  className="rounded-full h-24 w-24"
                />
                <div className="flex flex-col space-y-2">
                  <p className="text-xl font-semibold">
                    {activeProfile?.data?.handle}
                  </p>
                  <p className="text-md text-muted-foreground">
                    {activeProfile?.data?.stats.totalFollowers} followers
                  </p>
                </div>
              </div>
            </div>
          )}

          
        </div>
      </Paper>
      </Container>
    </>
  );
};

export default Login;
