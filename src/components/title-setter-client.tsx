"use client";

import { useEffect } from "react";

type Props = {
  children: string;
};

const Title = ({ children }: Props) => {
  useEffect(() => {
    if (!!document) {
      document.title = children;
    }
  }, [children]);

  return null;
};

export default Title;
