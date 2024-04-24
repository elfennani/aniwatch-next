/* eslint-disable @next/next/no-img-element */
"use client";
import secondsToHms from "@/utils/seconds-to-hms";
import Hls, { Events, Level } from "hls.js";
import { useParams } from "next/navigation";
import {
  KeyboardEvent,
  MouseEventHandler,
  Suspense,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { twJoin, twMerge } from "tailwind-merge";
import Settings from "./player-settings";
import Link from "next/link";
import { Episode } from "@/interfaces/Episode";

type Props = {
  url: string;
  isDubbed: boolean;
  watched: boolean;
  nextEpisode?: Episode;
};

type Params = {
  type: "sub" | "dub";
  ep: string;
  id: string;
};

const Player = (props: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(NaN);
  const [progress, setProgress] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<number>(NaN);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [updatedEntry, setUpdatedEntry] = useState(false);
  const [hiddenControls, setHiddenControls] = useState(false);
  const [controlsFocused, setControlsFocused] = useState(false);
  const params = useParams<Params>();

  useEffect(() => {
    showControls();
    if (!document) return;
    const handleChange: (ev: Event) => any = (ev) =>
      setIsFullscreen(document.fullscreenElement !== null);
    document.addEventListener("fullscreenchange", handleChange);

    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  useEffect(() => {
    if (progress / duration > 0.8 && !props.watched && !updatedEntry) {
      fetch("/api/watched", {
        method: "POST",
        body: JSON.stringify({
          show: Number(params.id),
          episode: Number(params.ep),
        }),
      });
      setUpdatedEntry(true);
    }
  }, [progress, duration, params, updatedEntry, props.watched]);

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
    showControls();
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

  function showControls() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHiddenControls(false);
    timeoutRef.current = setTimeout(() => setHiddenControls(true), 3000);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLVideoElement>) {
    if (event.key.toLowerCase() == "f") {
      handleFullScreen();
    }
    if (event.key == " ") {
      togglePlaying();
    }
  }

  const shouldControlsShowUp =
    !hiddenControls || settingsOpen || !isPlaying || controlsFocused;

  function handleTouchEnd(event: TouchEvent<HTMLVideoElement>) {
    event.preventDefault();
    if (shouldControlsShowUp) {
      togglePlaying();
    } else {
      showControls();
    }
  }

  return (
    <div
      ref={videoContainerRef}
      className="relative aspect-video w-full overflow-hidden md:rounded-xl md:mt-4"
    >
      <video
        autoFocus
        onClick={togglePlaying}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleFullScreen}
        onKeyDown={handleKeyDown}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(ev) => setProgress(ev.currentTarget.currentTime)}
        onDurationChange={(ev) => setDuration(ev.currentTarget.duration)}
        className="w-full object-contain h-full bg-black"
        disablePictureInPicture={false}
        onMouseMove={showControls}
        ref={videoRef}
        autoPlay={
          typeof localStorage != "undefined" &&
          localStorage.getItem("autoplay") == "1"
        }
      />

      <div
        onMouseEnter={() => setControlsFocused(true)}
        onMouseLeave={() => setControlsFocused(false)}
        onClick={() => videoRef.current?.focus()}
        className={twMerge(
          "overflow-hidden absolute flex items-center -bottom-14 h-12 left-2 right-2 rounded-lg bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300",
          shouldControlsShowUp && "bottom-2"
        )}
      >
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

      {!!props.nextEpisode && (
        <Link
          href={`/watch/${params.id}/${params.type}/${Number(params.ep) + 1}`}
          className={twMerge(
            "flex items-center gap-4 w-72 absolute -top-20 right-2 rounded-lg p-2 bg-zinc-800 backdrop-blur bg-opacity-80 z-10 transition-all duration-300",
            shouldControlsShowUp && duration - progress < 120 && "top-2"
          )}
        >
          <img
            src={props.nextEpisode.thumbnail}
            alt=""
            className="h-14 rounded"
          />
          <div>
            <p className="text-xs font-bold uppercase text-purple-500 flex items-center gap-1">
              <span className="i-tabler-player-track-next-filled" /> Up Next
            </p>
            <h2 className="font-semibold line-clamp-1">
              Episode {props.nextEpisode.number}
            </h2>
          </div>
        </Link>
      )}

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

export default Player;
