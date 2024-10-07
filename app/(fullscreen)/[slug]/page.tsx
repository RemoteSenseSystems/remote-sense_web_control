import { getData } from "@/data/getToken";
import Script from "next/script";
import dynamic from "next/dynamic";

const Videocall = dynamic<{ slug: string; JWT: string }>(
    () => import("@/components/Videocall"),
    { ssr: false },
  );

export default async function Page({ params }: { params: { slug: string } }) {
  const jwt = await getData(params.slug);
  return (
    <main>
      <Videocall slug={params.slug} JWT={jwt} />
      <Script src="/coi-serviceworker.js" strategy="beforeInteractive" />
    </main>
  );
}