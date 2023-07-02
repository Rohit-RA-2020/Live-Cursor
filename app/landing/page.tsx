"use client";
import Body from "./landing";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("userInfo") === null) {
      return router.push("/login");
    }
  });

  return (
    <div>
      <Body />
    </div>
  );
}