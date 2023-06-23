//import head from 'next/head' as NextHead
import NextHead from "next/head";
import React from "react";

interface HeadProps {
  title: string;
}
export default function Head({ title }: HeadProps) {
  return (
    <NextHead>
      <title>Sprint | {title}</title>
      <meta name="description" content="Sprint" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </NextHead>
  );
}
