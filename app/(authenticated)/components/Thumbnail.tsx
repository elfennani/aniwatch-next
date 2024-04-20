"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

type Props = {
  showId: string;
  ep: string;
} & React.DetailedHTMLProps<
  React.ImgHTMLAttributes<HTMLImageElement>,
  HTMLImageElement
>;

const Thumbnail = ({ showId, ep, ...props }: Props) => {
  const dub = `https://wp.youtube-anime.com/aln.youtube-anime.com/data2/ep_tbs/${showId}/${ep}_dub.jpg?w=380`;
  const sub = `https://wp.youtube-anime.com/aln.youtube-anime.com/data2/ep_tbs/${showId}/${ep}_sub.jpg?w=380`;
  const [src, setSrc] = useState(sub);
  return (
    <img {...props} alt={`Ep.${ep}`} src={src} onError={() => setSrc(dub)} />
  );
};

export default Thumbnail;
