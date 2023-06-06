import { ArrowLeftOnRectangleIcon } from "@heroicons/react/20/solid";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Image from "next/image";
import AddDump from "./_components/AddDump";
import UserContent from "./_components/UserContent";

export async function generateMetadata() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", session?.user.id)
    .single();

  return {
    title: `@${data?.full_name}'s Braindumps`,
  };
}

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
    <>
      <header className="sticky top-0 mx-auto flex w-full max-w-screen-md items-center justify-between gap-2 bg-slate-100 px-4 py-4 md:py-8">
        <div className="flex items-center gap-2 md:gap-4">
          <Image
            src={data?.avatar_url}
            alt={`${data?.full_name}'s profile picture`}
            height={512}
            width={512}
            className="h-10 w-10 rounded-full border-2 border-slate-900 md:h-16 md:w-16"
          />
          <h1 className="text-2xl font-semibold md:text-4xl">{`@${data?.full_name}`}</h1>
        </div>

        <div className="flex gap-2">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="inline-flex rounded-full px-2 py-2 text-sm text-slate-900 hover:bg-red-500 hover:text-slate-100 active:bg-red-600 active:text-slate-100 md:px-4"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            </button>
          </form>
          <AddDump id={user.id} />
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-screen-md flex-1 flex-col justify-start gap-8 p-4">
        <UserContent supabase={supabase} user={user} />
      </section>
    </>
  );
}
