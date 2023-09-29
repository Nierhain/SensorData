import { App, ConfigProvider, theme } from "antd";
import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";
const { darkAlgorithm } = theme;
export default function Home() {
  const dioxide = api.data.dioxide.useQuery({});
  return (
    <>
      <Head>
        <title>Sniffy Dashboard</title>
        <meta name="description" content="Sniffy Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfigProvider theme={{algorithm: darkAlgorithm}}>
        <main>Hello World</main>
      </ConfigProvider>
    </>
  );
}
