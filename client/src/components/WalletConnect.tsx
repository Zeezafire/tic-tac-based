import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useConnect } from "wagmi";
import { useEffect } from "react";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
import { sdk } from "@farcaster/miniapp-sdk";

export default function WalletConnect() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();

  // Auto-connect for Farcaster/Base App users
  useEffect(() => {
    const attemptFarcasterConnect = async () => {
      try {
        // Check if we're in Farcaster Mini App context
        const context = await sdk.context;
        if (context && !isConnected) {
          // Attempt to connect with Farcaster connector
          connect({ connector: farcasterMiniApp() });
        }
      } catch (error) {
        // Not in Farcaster context, silently ignore
      }
    };
    
    attemptFarcasterConnect();
  }, [connect, isConnected]);

  return (
    <div className="flex justify-center mb-4">
      <div className={`wallet-glow-box ${isConnected ? 'connected' : 'disconnected'}`}>
        <ConnectButton 
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
          chainStatus="icon"
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}
        />
      </div>
    </div>
  );
}
