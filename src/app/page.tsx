"use server";

import { redirect } from "next/navigation";

export default async function Home() {
  redirect("/category/top_story");
}
