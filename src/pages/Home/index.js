import Users from "../../components/Users";

export default function Home() {
  return (
    <section className="flex min-h-screen  flex-col items-center justify-center">
      <div className="rounded bg-neutral-100 p-5 shadow-md">
        <h1>Home</h1>
        <Users />
      </div>
    </section>
  );
}
