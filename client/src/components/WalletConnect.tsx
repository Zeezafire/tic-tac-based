import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function WalletConnect() {
  const { isConnected } = useAccount();

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
