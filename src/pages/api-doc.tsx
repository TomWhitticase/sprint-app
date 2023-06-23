import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useSession } from "next-auth/react";
import { createSwaggerSpec } from "next-swagger-doc";
import dynamic from "next/dynamic";
import Head from "next/head";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic<{
  spec: any;
}>(import("swagger-ui-react") as any, { ssr: false });

function ApiDoc({ spec }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>API Documentation</title>
        <meta name="description" content="API Documentation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="flex flex-col items-start justify-start w-full h-screen overflow-y-auto">
        <div className="w-full">
          <SwaggerUI spec={spec} />
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const spec: Record<string, any> = createSwaggerSpec({
    definition: {
      openapi: "3.0.0",
    },
    apiFolder: "src/pages/api",
  });

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
