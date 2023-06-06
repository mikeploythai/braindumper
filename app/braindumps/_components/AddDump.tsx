"use client";

import { PencilSquareIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import Modal from "./Modal";

export default function AddDump({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="rounded-full bg-slate-900 px-2 py-2 text-sm text-slate-100 hover:bg-slate-900/90 active:bg-slate-900/80 sm:flex sm:items-center sm:gap-2 md:px-4"
        onClick={() => setIsOpen(true)}
      >
        <p className="hidden md:block">New Braindump</p>
        <PencilSquareIcon className="h-5 w-5" />
      </button>

      <Modal isOpen={isOpen} setIsOpen={setIsOpen} id={id} />
    </>
  );
}
