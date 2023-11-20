import Head from "next/head";
import { api } from "~/utils/api";

export default function Home() {
  const dioxide = api.data.dioxide.useQuery({});
  return (
    <>
      <Head>
        <title>Sniffy Dashboard</title>
        <meta name="description" content="Sniffy Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
        <main>Hello World</main>
    </>
  );
}
