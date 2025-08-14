import { getData } from "@/data/getToken";
import Script from "next/script";
import dynamic from "next/dynamic";

const Videocall = dynamic<{ session_name: string; client_id: string; JWT: string }>(
  () => import("@/components/Videocall"),
  { ssr: false },
);

export default async function Page({ params }: { params: { slug: string[] } }) {
  const getDATETIME_SURFIX = () => {
    const now = new Date();
    const singaporeTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Singapore" }));
    const year = singaporeTime.getFullYear() % 100;
    const month = String(singaporeTime.getMonth() + 1).padStart(2, '0');
    const day = String(singaporeTime.getDate()).padStart(2, '0');
    // const hours = String(singaporeTime.getHours()).padStart(2, '0');
    // const minutes = String(Math.floor(singaporeTime.getMinutes() / 5)).padStart(2, '0');
    return `${year}${month}${day}`; //-${hours}${minutes}`;
  };

  const session_name_prefix = params.slug[0];
  const client_id = params.slug[1];

  const session_name = `${session_name_prefix}_${getDATETIME_SURFIX()}`;
  const jwt = await getData(session_name);
  return (
    <main>
      {/* <Script src="/coi-serviceworker.js" strategy="beforeInteractive" /> */}
      <Videocall session_name={session_name} client_id={client_id} JWT={jwt} />
    </main>
  );
}