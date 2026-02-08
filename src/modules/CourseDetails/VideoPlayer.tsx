"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { GetCourseByID } from "@/core/services/api/get/GetCourseByID";

export type SyllabusItem = {
  id: number;
  instructor: string;
  lessonName: string;
  status: "Watched" | "Locked" | "Pending";
  avatar: string;
};

export type Review = {
  id: number;
  name: string;
  role: string;
  text: string;
  avatar: string;
  rating: string;
  replies?: Review[];
};

export interface CourseDetailData {
  _id: string;
  title: string;
  description: string;
  category: string;
  teacherName: string;
  rating: number;
  price: number;
  courseImage: string;
  teacherImage: string;
  courseVideo: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  syllabus?: SyllabusItem[];
  reviews?: Review[];
}

interface VideoPlayerProps {
  courseId: string;
  initialData?: Partial<CourseDetailData>;
  className?: string;
}

const getCleanUrl = (url?: string) => {
  if (!url) return "";
  return url;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  courseId,
  initialData,
  className,
}) => {
  const { data: courseData } = useQuery({
    queryKey: ["course-detail", courseId],
    queryFn: () => GetCourseByID(courseId),
    initialData: initialData,
    staleTime: 1000 * 60 * 5,
  });

  const src = getCleanUrl(courseData?.courseVideo);
  const poster = getCleanUrl(courseData?.courseImage);
  const category = courseData?.category || "General";

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const [isSeeking, setIsSeeking] = useState(false);

  const isSeekingRef = useRef(isSeeking);

  const [canHover, setCanHover] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(hover: hover)").matches;
  });

  const [isFullscreen, setIsFullscreen] = useState<boolean>(() => {
    if (typeof document === "undefined") return false;
    return Boolean(document.fullscreenElement);
  });

  const storageKey = `videoCoverSeen:${courseId}`;
  const [showInitialCover, setShowInitialCover] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return !Boolean(localStorage.getItem(storageKey));
    } catch {
      return true;
    }
  });

  useEffect(() => {
    isSeekingRef.current = isSeeking;
  }, [isSeeking]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onLoaded = () => {
      setDuration(isFinite(v.duration) ? v.duration : 0);
    };

    const onTime = () => {
      if (!isSeekingRef.current) {
        setCurrentTime(v.currentTime);
      }
    };

    const onPlay = () => {
      setIsPlaying(true);
      setShowControls(true);
      setShowInitialCover(false);
      try {
        localStorage.setItem(storageKey, "1");
      } catch {}
    };

    const onPause = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    const onEnded = () => {
      setIsPlaying(false);
      setShowControls(true);
    };

    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);

    if (v.readyState >= 1) {
      setDuration(v.duration);
    }

    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
    };
  }, [src, storageKey]);

  const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
  const formatTime = (t: number) => {
    if (!isFinite(t) || t <= 0) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover)");
    const handler = (e: MediaQueryListEvent) => setCanHover(Boolean(e.matches));
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const onFsChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    if (!isPlaying || canHover) {
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      return;
    }
    const id = window.setTimeout(() => {
      setShowControls(false);
      hideTimeoutRef.current = null;
    }, 2500);
    hideTimeoutRef.current = id;
    return () => {
      window.clearTimeout(id);
      if (hideTimeoutRef.current === id) hideTimeoutRef.current = null;
    };
  }, [isPlaying, canHover]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused || v.ended) {
      v.play().catch(() => {});
      setShowInitialCover(false);
      try {
        localStorage.setItem(storageKey, "1");
      } catch {}
    } else {
      v.pause();
    }
  };

  useEffect(() => {
    const timeline = timelineRef.current;
    const video = videoRef.current;
    if (!timeline || !video) return;

    let active = false;

    const calcAndSet = (clientX: number) => {
      const rect = timeline.getBoundingClientRect();
      const x = clamp((clientX - rect.left) / rect.width, 0, 1);
      const t = x * (isFinite(duration) ? duration : 0);
      video.currentTime = t;
      setCurrentTime(t);
    };

    const onPointerDown = (ev: PointerEvent) => {
      active = true;
      setIsSeeking(true);
      (ev.target as Element).setPointerCapture?.(ev.pointerId);
      calcAndSet(ev.clientX);
      setShowControls(true);
    };

    const onPointerMove = (ev: PointerEvent) => {
      if (!active) return;
      calcAndSet(ev.clientX);
    };

    const onPointerUp = (ev: PointerEvent) => {
      if (!active) return;
      active = false;
      setIsSeeking(false);
      try {
        (ev.target as Element).releasePointerCapture?.(ev.pointerId);
      } catch {}
      setShowControls(true);
    };

    timeline.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      timeline.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [duration]);

  const handleTimelineClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const timeline = timelineRef.current;
    const video = videoRef.current;
    if (!timeline || !video || !isFinite(duration) || duration === 0) return;
    const rect = timeline.getBoundingClientRect();
    const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const t = x * duration;
    video.currentTime = t;
    setCurrentTime(t);
    setShowControls(true);
  };

  const skip = (seconds: number) => (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const v = videoRef.current;
    if (!v || !isFinite(duration)) return;
    const target = clamp(v.currentTime + seconds, 0, duration);
    v.currentTime = target;
    setCurrentTime(target);
    setShowControls(true);
  };

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = clamp(volume, 0, 1);
    v.muted = isMuted || volume === 0;
  }, [volume, isMuted]);

  const onVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = clamp(Number(e.target.value), 0, 1);
    setVolume(val);
    setIsMuted(val === 0);
    setShowControls(true);
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsMuted((m) => !m);
    setShowControls(true);
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
    setShowControls(true);
  };

  const onMouseEnter = () => {
    if (canHover) {
      setShowControls(true);
      if (hideTimeoutRef.current) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    }
  };
  const onMouseLeave = () => {
    if (canHover) {
      if (isPlaying) {
        setShowControls(false);
      } else {
        setShowControls(true);
      }
    }
  };

  const progressPercent =
    isFinite(duration) && duration > 0 ? (currentTime / duration) * 100 : 0;
  const videoObjectClass = isFullscreen ? "object-contain" : "object-cover";

  console.log("FINAL VIDEO SRC:", src);
  console.log("FINAL POSTER SRC:", poster);

  return (
    <>
      <div
        ref={containerRef}
        className={`relative w-full h-[700%] aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ${className ?? ""}`}
        onClick={togglePlay}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role="region"
        aria-label="video player"
      >
        <video
          key={src}
          ref={videoRef}
          src={src}
          poster={poster}
          preload="metadata"
          playsInline
          className={`w-full h-full ${videoObjectClass} bg-black`}
        />

        {showInitialCover && poster && !isPlaying && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              const v = videoRef.current;
              if (v) v.play().catch(() => {});
              setShowInitialCover(false);
              try {
                localStorage.setItem(storageKey, "1");
              } catch {}
            }}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
          >
            {poster && (
              <div className="relative w-full h-full">
                <Image
                  src={poster}
                  alt="cover"
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/25">
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                <Play size={28} className="text-[#644DB3]" />
              </div>
            </div>
          </div>
        )}

        {!isPlaying && !showInitialCover && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
          >
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-lg">
              <Play size={28} className="text-[#644DB3]" />
            </div>
          </div>
        )}

        <button
          onClick={skip(-10)}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className={`absolute left-16 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white rounded-full w-15 h-15 cursor-pointer flex items-center justify-center transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <SkipBack size={18} className="text-[#644DB3]" />
        </button>

        <button
          onClick={skip(10)}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className={`absolute right-16 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white rounded-full w-15 h-15 cursor-pointer flex items-center justify-center transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <SkipForward size={18} className="text-[#644DB3]" />
        </button>

        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 ease-out transform ${showControls ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}
        >
          <div
            ref={timelineRef}
            onClick={handleTimelineClick}
            className="relative w-full h-2 bg-white/20 rounded-full cursor-pointer mb-3 touch-none"
            style={{ touchAction: "none" }}
          >
            <div
              className="absolute left-0 top-0 h-full bg-[#644DB3] rounded-full"
              style={{
                width: `${progressPercent}%`,
                transition: isSeeking ? "none" : "width 120ms linear",
              }}
            />
            <div
              style={{
                left: `${progressPercent}%`,
                transform: "translate(-50%, -50%)",
                top: "120%",
              }}
              className="absolute w-3 h-3 bg-white rounded-full shadow -translate-y-1/2 pointer-events-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="p-2"
              >
                {isPlaying ? (
                  <Pause size={20} className="text-[#644DB3]" />
                ) : (
                  <Play size={20} className="text-[#644DB3]" />
                )}
              </button>
              <div className="text-xs sm:text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMute();
                }}
                className="p-2"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX size={18} className="text-[#644DB3]" />
                ) : (
                  <Volume2 size={18} className="text-[#644DB3]" />
                )}
              </button>
              <input
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={isMuted ? 0 : volume}
                onChange={onVolumeChange}
                className="w-24 sm:w-32 accent-[#644DB3]"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="p-2"
              >
                {isFullscreen ? (
                  <Minimize2 size={18} className="text-[#644DB3]" />
                ) : (
                  <Maximize2 size={18} className="text-[#644DB3]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mr-3" dir="rtl">
        <div className="bg-white/10 backdrop-blur-md text-[#898989] p-1.5 rounded-xl text-center mb-5 border border-white/20 transition-all w-[60%] sm:w-[40%] md:w-[30%] lg:w-[20%] flex items-center justify-center gap-2">
          {category}
        </div>
      </div>
    </>
  );
};
