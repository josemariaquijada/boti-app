import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <main className="App bg-neutral-300">
      <Outlet />
    </main>
  );
}
