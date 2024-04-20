"use client";
import secondsToHms from "@/app/(authenticated)/lib/utils/secondsToHms";
import { Icon } from "@iconify/react/dist/iconify.js";
import Hls, { Events, Level, LevelsUpdatedData } from "hls.js";
import React, { MouseEventHandler, useEffect, useRef, useState } from "react";

type Props = {
  url: string;
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
      />
      <div className="absolute flex items-center bottom-0 bg-black bg-opacity-50 w-full">
        <button
          className="py-2 px-3 hover:bg-black hover:bg-opacity-50 transition-colors"
          onClick={togglePlaying}
        >
          <Icon icon={playStatusIcon} />
        </button>
        <span className="text-sm">{secondsToHms(progress)}</span>
        <progress
          className="flex-1 mx-4 h-2 rounded text-white overflow-hidden progress-bar:bg-purple-500"
          value={progress}
          max={duration}
          onClick={progressClickHandler}
        />
        <span className="text-sm">{secondsToHms(duration)}</span>
        <LevelSelector
          current={currentLevel}
          levels={levels}
          onChange={handleChangeLevel}
        />
        <button onClick={handleFullScreen} className="px-3 self-stretch">
          <Icon
            icon={
              isFullscreen ? "tabler:arrows-minimize" : "tabler:arrows-maximize"
            }
          />
        </button>
      </div>
    </div>
  );
};

interface LevelSelectorProps {
  current: number;
  levels: Level[];
  onChange: (level: number) => void;
}

const LevelSelector = ({ current, levels, onChange }: LevelSelectorProps) => {
  const [collapsed, setCollapsed] = useState(true);

  const handleChange = (level: number) => {
    setCollapsed(true);
    onChange(level);
  };

  return (
    <div className="relative self-stretch">
      {!collapsed && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 -translate-y-full flex flex-col-reverse">
          {levels.map(({ name }, index) => (
            <button
              key={name}
              className="text-center px-3 py-2 text-sm disabled:opacity-50"
              disabled={current == index}
              onClick={() => handleChange(index)}
            >
              {name}
            </button>
          ))}
        </div>
      )}
      <button
        className="px-3 h-full text-sm"
        onClick={() => setCollapsed(!collapsed)}
      >
        {levels[current]?.name}
      </button>
    </div>
  );
};

export default Player;
