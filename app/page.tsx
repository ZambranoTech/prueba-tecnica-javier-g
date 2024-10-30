"use client";

import { useStore } from "@/store/store";
import { redirect } from "next/navigation";

export default function Home() {
  const UsersTable = useStore((state) => state.UsersTable);
  redirect("/dashboard");
  return <h1>{UsersTable} around here...</h1>;
}
