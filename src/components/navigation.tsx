"use client";
import React, { createContext, useContext, useState } from "react";
import Icon from "./iconify";
import Link from "next/link";

type Props = {};

const CloseContext = createContext(() => {});

const Navigation = (props: Props) => {
  const [closed, setClosed] = useState(true);

  return (
    <CloseContext.Provider value={() => setClosed(true)}>
      <nav className="fixed bottom-8 right-8">
        <button
          className="w-16 h-16 rounded-lg flex text-zinc-200 items-center shadow-lg justify-center bg-zinc-700"
          onClick={() => setClosed((c) => !c)}
        >
          {closed && <span className="i-tabler-menu text-3xl"></span>}
          {!closed && <span className="i-tabler-x text-3xl"></span>}
        </button>
        {!closed && (
          <div className="absolute top-0 right-0 -translate-y-full py-2">
            <div className="p-2 bg-zinc-700 rounded-lg">
              <LinkOption href="/" label="Home" className="i-tabler-home" />
              <LinkOption
                href="/search"
                label="Search"
                className="i-tabler-search"
              />
            </div>
          </div>
        )}
      </nav>
    </CloseContext.Provider>
  );
};

interface LinkOptionProps {
  /** For icon span */
  className: string;
  label: string;
  href: string;
}

const LinkOption = ({ href, className, label }: LinkOptionProps) => {
  const close = useContext(CloseContext);
  return (
    <Link
      onClick={close}
      href={href}
      className="flex items-center gap-2 px-3 py-2 rounded hover:bg-zinc-600 transition-colors min-w-40"
    >
      <span className={className} /> {label}
    </Link>
  );
};

export default Navigation;
