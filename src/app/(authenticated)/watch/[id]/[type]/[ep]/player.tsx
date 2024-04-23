"use client";
import secondsToHms from "@/utils/seconds-to-hms";
import { Icon } from "@iconify/react/dist/iconify.js";
import Hls, { Events, Level, LevelsUpdatedData } from "hls.js";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { MouseEventHandler, useEffect, useRef, useState } from "react";
import { twJoin, twMerge } from "tailwind-merge";

type Props = {
  url: string;
  isDubbed: boolean;
};

const Player = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(NaN);
  const [progress, setProgress] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<number>(NaN);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!document) return;
    const handleChange: (ev: Event) => any = (ev) =>
      setIsFullscreen(document.fullscreenElement !== null);
    document.addEventListener("fullscreenchange", handleChange);

    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  useEffect(() => {
    if (!hlsRef.current) {
      hlsRef.current = new Hls();
    }
    const hls = hlsRef.current;

    const onLevelLoaded = (_: any, { levels }: any) => setLevels(levels);
    const onLevelChanged = (_: any, { level }: any) => setCurrentLevel(level);

    if (Hls.isSupported()) {
      hls.loadSource(props.url);
      hls.attachMedia(videoRef.current!!);
      hls.once(Events.MANIFEST_PARSED, onLevelLoaded);
      hls.on(Events.LEVEL_SWITCHED, onLevelChanged);
    } else if (videoRef.current?.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = props.url;
    }

    return () => {
      hlsRef.current?.off(Events.MANIFEST_PARSED, onLevelLoaded);
      hlsRef.current?.off(Events.LEVEL_SWITCHED, onLevelChanged);
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [props.url]);

  const handleChangeLevel = (level: number) => {
    hlsRef.current!.currentLevel = level;
  };

  const handleFullScreen = () => {
    if (document.fullscreenElement !== null) {
      document.exitFullscreen();
    } else {
      videoContainerRef.current?.requestFullscreen();
    }
  };

  const togglePlaying = () => {
    if (videoRef.current?.paused || videoRef.current?.ended) {
      videoRef.current.play();
    } else {
      videoRef.current?.pause();
    }
  };

  const progressClickHandler: MouseEventHandler<HTMLProgressElement> = (ev) => {
    const rect = ev.currentTarget.getBoundingClientRect();
    const pos = (ev.pageX - rect.left) / ev.currentTarget.offsetWidth;
    const video = videoRef.current!!;
    video.currentTime = pos * video.duration;
  };

  const playStatusIcon = isPlaying
    ? "tabler:player-pause-filled"
    : "tabler:player-play-filled";

  return (
    <div ref={videoContainerRef} className="relative aspect-video w-full">
      <video
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(ev) => setProgress(ev.currentTarget.currentTime)}
        onDurationChange={(ev) => setDuration(ev.currentTarget.duration)}
        className="w-full object-contain h-full bg-black"
        disablePictureInPicture={false}
        ref={videoRef}
        autoPlay={
          typeof localStorage != "undefined" &&
          localStorage.getItem("autoplay") == "1"
        }
      />
      <div className="overflow-hidden absolute flex items-center bottom-2 h-12 left-2 right-2 rounded-lg bg-black bg-opacity-50 backdrop-blur-sm">
        <button
          className="py-2 px-3 hover:bg-black hover:bg-opacity-50 transition-colors self-stretch flex items-center justify-center"
          onClick={togglePlaying}
        >
          <span
            className={twJoin(
              "text-2xl",
              isPlaying
                ? "i-tabler-player-pause-filled"
                : "i-tabler-player-play-filled"
            )}
          />
        </button>
        <progress
          className="flex-1 h-2 rounded text-white overflow-hidden progress-bar:bg-purple-500"
          value={progress}
          max={duration}
          onClick={progressClickHandler}
        />
        <span className="text-sm px-2">
          {secondsToHms(progress)}
          <span className="opacity-50"> / {secondsToHms(duration)}</span>
        </span>
        <button
          onClick={() => setSettingsOpen((open) => !open)}
          className="py-2 px-3 hover:bg-black hover:bg-opacity-50 transition-colors h-full flex items-center justify-center"
        >
          <span className="i-tabler-adjustments text-2xl" />
        </button>
        <button
          className="py-2 px-3 hover:bg-black hover:bg-opacity-50 transition-colors self-stretch flex items-center justify-center"
          onClick={handleFullScreen}
        >
          <span
            className={twJoin(
              "text-2xl",
              isFullscreen && "i-tabler-arrows-minimize",
              !isFullscreen && "i-tabler-border-corners"
            )}
          />
        </button>
      </div>
      {settingsOpen && (
        <Settings
          levels={levels}
          currentLevel={levels[currentLevel]}
          onClose={() => setSettingsOpen(false)}
          onChangeLevel={handleChangeLevel}
          isDubbed={props.isDubbed}
        />
      )}
    </div>
  );
};

interface SettingsProps {
  levels: Level[];
  currentLevel: Level;
  onClose: () => void;
  onChangeLevel: (level: number) => void;
  isDubbed: boolean;
}

const Settings = ({
  currentLevel,
  levels,
  onClose,
  onChangeLevel,
  isDubbed,
}: SettingsProps) => {
  const [page, setPage] = useState<"start" | "level-selection">("start");
  const [autoplay, setAutoplay] = useState(
    typeof localStorage != "undefined" &&
      localStorage.getItem("autoplay") == "1"
  );
  const { type, id, ep } = useParams<{
    type: "sub" | "dub";
    ep: string;
    id: string;
  }>();

  return (
    <div className="absolute flex flex-col top-2 right-2 bottom-16 w-40 bg-zinc-800 text-zinc-200 rounded-lg">
      <header className="relative text-sm font-bold uppercase p-2 text-center">
        {page != "start" && (
          <button
            onClick={() => setPage("start")}
            className="absolute left-0 top-0 h-full p-2 flex items-center justify-center hover:bg-black hover:bg-opacity-25 transition-colors rounded-tl-lg"
          >
            <span className="i-tabler-chevron-left text-lg" />
          </button>
        )}
        {page == "start" && "Settings"}
        {page == "level-selection" && "Quality"}
        <button
          onClick={() => onClose()}
          className="absolute right-0 top-0 h-full p-2 flex items-center justify-center hover:bg-black hover:bg-opacity-25 transition-colors rounded-tr-lg"
        >
          <span className="i-tabler-x text-lg" />
        </button>
      </header>
      {page == "start" && (
        <div className="overflow-y-auto flex-1">
          <button
            onClick={() => setPage("level-selection")}
            className="py-3 px-4 flex gap-2 items-center hover:bg-black hover:bg-opacity-25 w-full transition-colors"
          >
            <span
              className={
                currentLevel.height >= 720
                  ? "i-tabler-badge-hd-filled text-lg"
                  : "i-tabler-badge-sd-filled text-lg"
              }
            />
            <span className="flex-1 text-left text-sm">
              {currentLevel.name}
            </span>
            <span className="i-tabler-chevron-right" />
          </button>
          {isDubbed && (
            <Link
              replace
              href={
                type == "dub"
                  ? `/watch/${id}/sub/${ep}`
                  : `/watch/${id}/dub/${ep}`
              }
              onClick={() => {
                localStorage.setItem(
                  "translation",
                  type == "sub" ? "dub" : "sub"
                );
              }}
              className="py-3 px-4 flex gap-2 items-center hover:bg-black hover:bg-opacity-25 w-full transition-colors"
            >
              <span className="i-tabler-bubble-text text-lg" />
              <span className="flex-1 text-left text-sm text-zinc-500">
                <span
                  className={type == "dub" ? "text-purple-500 font-bold" : ""}
                >
                  DUB
                </span>
                {" | "}
                <span
                  className={type == "sub" ? "text-purple-500 font-bold" : ""}
                >
                  SUB
                </span>
              </span>
            </Link>
          )}
          <button
            onClick={() => {
              setAutoplay((autoplay) => {
                localStorage.setItem("autoplay", autoplay ? "0" : "1");
                return !autoplay;
              });
            }}
            className="py-3 px-4 flex gap-2 items-center hover:bg-black hover:bg-opacity-25 w-full transition-colors"
          >
            <span className="i-tabler-player-play text-lg" />
            <span
              className={twMerge(
                "flex-1 text-left text-sm text-zinc-500 line-clamp-1",
                autoplay && "text-purple-500 font-bold"
              )}
            >
              AutoPlay: {autoplay ? "On" : "Off"}
            </span>
          </button>
        </div>
      )}
      {page == "level-selection" && (
        <div className="overflow-y-auto flex-1">
          {levels
            .map((level, index) => {
              return (
                <button
                  key={level.name}
                  onClick={() => {
                    onChangeLevel(index);
                    setPage("start");
                  }}
                  className="py-3 px-4 flex gap-2 items-center hover:bg-black hover:bg-opacity-25 w-full transition-colors"
                >
                  <span
                    className={
                      level.height >= 720
                        ? "i-tabler-badge-hd-filled text-lg"
                        : "i-tabler-badge-sd-filled text-lg"
                    }
                  />
                  <span className="flex-1 text-left text-sm">{level.name}</span>
                </button>
              );
            })
            .toReversed()}
        </div>
      )}
    </div>
  );
};

export default Player;
