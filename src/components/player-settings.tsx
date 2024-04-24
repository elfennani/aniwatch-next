import { Level } from "hls.js";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { twJoin, twMerge } from "tailwind-merge";

interface SettingsProps {
  levels: Level[];
  currentLevel: Level;
  onClose: () => void;
  onChangeLevel: (level: number) => void;
  isDubbed: boolean;
}

type Params = {
  type: "sub" | "dub";
  ep: string;
  id: string;
};

type Page = "start" | "level-selection";

const Settings = ({
  currentLevel,
  levels,
  onClose,
  onChangeLevel,
  isDubbed,
}: SettingsProps) => {
  const [page, setPage] = useState<Page>("start");
  const [autoplay, setAutoplay] = useState(
    typeof localStorage != "undefined" &&
      localStorage.getItem("autoplay") == "1"
  );
  const { type, id, ep } = useParams<Params>();

  return (
    <div className="absolute flex flex-col max-h-56 h-[calc(100%-4.5rem)] top-auto right-2 bottom-16 w-40 bg-zinc-800 text-zinc-200 rounded-lg">
      <SettingsHeader onClose={onClose} setPage={setPage} page={page} />
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
        <LevelPage
          currentLevel={currentLevel}
          levels={levels}
          onChangeLevel={onChangeLevel}
          onBack={() => setPage("start")}
        />
      )}
    </div>
  );
};

interface LevelPageProps {
  levels: Level[];
  currentLevel: Level;
  onChangeLevel: (index: number) => void;
  onBack: () => void;
}

const LevelPage = ({
  levels,
  onBack,
  onChangeLevel,
  currentLevel,
}: LevelPageProps) => {
  return (
    <div className="overflow-y-auto flex-1">
      {levels
        .map((level, index) => {
          return (
            <button
              key={level.name}
              onClick={() => {
                onChangeLevel(index);
                onBack();
              }}
              disabled={currentLevel.name == level.name}
              className="py-3 px-4 flex gap-2 items-center enabled:hover:bg-black hover:bg-opacity-25 w-full transition-colors"
            >
              <span
                className={twJoin(
                  level.height >= 720
                    ? "i-tabler-badge-hd-filled text-lg"
                    : "i-tabler-badge-sd-filled text-lg",
                  currentLevel.name == level.name && "text-purple-500"
                )}
              />
              <span
                className={twJoin(
                  "flex-1 text-left text-sm",
                  currentLevel.name == level.name && "font-bold text-purple-500"
                )}
              >
                {level.name}
              </span>
            </button>
          );
        })
        .toReversed()}
    </div>
  );
};

interface SettingsHeaderProps {
  page: Page;
  setPage: (page: Page) => void;
  onClose: () => void;
}

const SettingsHeader = ({ page, setPage, onClose }: SettingsHeaderProps) => (
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
);
export default Settings;
