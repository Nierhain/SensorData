import Head from "next/head";
import { useEffect, useState } from "react";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";

export default function Home() {
  // const dioxide = api.data.dioxide.useQuery({});
  const sniffy = api.sniffy.sniffy.useQuery();
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    console.log(socket?.readyState)
  }, [socket])

  return (
    <>
      <Head>
        <title>Sniffy Dashboard</title>
        <meta name="description" content="Sniffy Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          <button onClick={() => setSocket(sniffy.data)}>Connect to Sniffy</button>
        </div>
        <div>
          <button onClick={() => socket?.send("forwards")}>Vorwärts</button>
          <button onClick={() => socket?.send("left")}>Links</button>
          <button onClick={() => socket?.send("right")}>Rechts</button>
          <button onClick={() => socket?.send("back")}>Rückwärts</button>
        </div>
      </main>
    </>
  );
}
