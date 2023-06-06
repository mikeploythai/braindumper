"use client";

import { DumpData } from "@/lib/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import Modal from "./Modal";

dayjs.extend(relativeTime);

export default function Dump({ data }: { data: DumpData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <article
        className="flex flex-col gap-4 rounded-md bg-slate-900 p-4 text-slate-100 hover:cursor-pointer hover:bg-slate-900/90 active:bg-slate-900/80"
        onClick={() => setIsOpen(true)}
      >
        <div>
          <h1 className="line-clamp-1 text-lg font-semibold">{data.title}</h1>
          <p className="line-clamp-3 whitespace-pre-wrap text-base">
            {data.dump}
          </p>
        </div>
        <small className="mt-auto text-xs font-extralight">
          Last updated {dayjs(data.updated_at).fromNow()}
        </small>
      </article>

      <Modal isOpen={isOpen} setIsOpen={setIsOpen} data={data} />
    </>
  );
}
