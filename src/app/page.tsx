import { TradeTicket } from "@/components/trade-ticket";

export default function Home() {
  return (
    <main className="flex min-h-screen items-top justify-center bg-base-100 p-4 pt-8">
      <div className="h-fit">
        <TradeTicket />
      </div>
    </main>
  );
}
