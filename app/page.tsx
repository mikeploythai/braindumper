import AuthForm from "./_components/AuthForm";

export default function Home() {
  return (
    <section className="mx-auto flex w-full max-w-screen-sm flex-1 flex-col justify-center gap-4 p-4">
      <hgroup className="flex flex-col gap-2 text-center">
        <h1 className="text-4xl font-semibold">Mike&apos;s Braindumper</h1>
        <p>An extremely minimal braindumping experience.</p>
      </hgroup>

      <AuthForm />
    </section>
  );
}
