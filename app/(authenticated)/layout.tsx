import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  if (!cookies().has("token")) return redirect("/auth");

  return children;
}
