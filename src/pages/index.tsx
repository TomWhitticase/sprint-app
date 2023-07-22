import Head from "@/components/Head";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  //push to dashboard
  //router.push("/dashboard");

  return (
    <>
      <Head title={"Home"} />
      <main></main>
    </>
  );
}
