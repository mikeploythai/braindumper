import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import UserContent from "./_components/UserContent";

export default async function Braindumps() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    revalidatePath("/braindumps");
    return;
  }

  const user = session.user;
  const { data } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  return (
    <section className="mx-auto flex w-full max-w-screen-md flex-1 flex-col justify-center gap-8">
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-semibold">{`${data?.full_name}'s Braindumps`}</h1>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="rounded-full bg-black px-4 py-2 text-sm text-white hover:bg-red-500 active:bg-red-600"
          >
            Sign Out
          </button>
        </form>
      </header>

      <UserContent supabase={supabase} user={user} />
    </section>
  );
}
