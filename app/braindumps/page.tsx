import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import UserContent from "./_components/UserContent";

export default async function Braindumps() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <>
      <h1>Hello!</h1>

      <UserContent supabase={supabase} session={session} />

      <form action="/auth/signout" method="post">
        <button
          type="submit"
          className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-black/90 active:bg-black/80"
        >
          Sign Out
        </button>
      </form>
    </>
  );
}
