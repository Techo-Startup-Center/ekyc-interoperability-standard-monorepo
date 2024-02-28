import { ReactNode } from "react";

export default function NavLayout({ children }: { children: ReactNode }) {
  return (
    <main className="bg-base-200 h-screen">
      <div className="navbar bg-base-100">
        <a className="btn btn-ghost text-xl">Insurance Portal</a>
      </div>
      <div className="mt-4 container px-4 mx-auto">{children}</div>
    </main>
  );
}
