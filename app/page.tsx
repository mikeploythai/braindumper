import AuthForm from "./_components/AuthForm";

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-screen-sm flex-1 flex-col justify-center">
      <h1 className="text-center text-4xl font-semibold">Welcome to Jerri.</h1>

      <AuthForm />
    </section>
  );
}
