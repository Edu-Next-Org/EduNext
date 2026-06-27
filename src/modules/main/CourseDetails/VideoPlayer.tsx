"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Play,
  Lock,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
  CheckCircle2,
} from "lucide-react";
import { CourseDetailData } from "@/core/services/api/get/getCourseByID";
import { UpdateUserVideoProgress } from "@/core/services/api/post/UpdateUserVideoProgress";
import { ExamModal } from "./ExamModal";
import { GetUserVideoProgress } from "@/core/services/api/get/getUserVideoProgress";

interface VideoPlayerProps {
  courseId: string;
  courseData: CourseDetailData;
  className?: string;
}

const getCleanUrl = (url?: string) => {
  if (!url) return "";
  return url;
};

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  courseId,
  courseData,
  className,
}) => {
  const [hasPassed, setHasPassed] = useState<boolean>(
    courseData?.certificate?.issued || false,
  );
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const src = getCleanUrl(courseData?.courseVideo);
  const poster = getCleanUrl(courseData?.courseImage);
  const queryClient = useQueryClient();

  const { data: progressData, refetch } = useQuery({
    queryKey: ["user-progress", courseId],
    queryFn: () => GetUserVideoProgress(courseId),
    staleTime: 0,
    enabled: !!courseData?.isPurchased,
    refetchOnMount: "always",
  });

  const updateProgressMutation = useMutation({
    mutationFn: UpdateUserVideoProgress,
  });

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
  const [hasSetInitialTime, setHasSetInitialTime] = useState(false);

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
    if (!v || !progressData || hasSetInitialTime) return;

    const attemptSeek = () => {
      if (progressData.data?.watchedSeconds) {
        v.currentTime = progressData.data.watchedSeconds;
        setCurrentTime(progressData.data.watchedSeconds);
      }
      setHasSetInitialTime(true);
    };

    if (v.readyState >= 1) {
      attemptSeek();
    } else {
      v.addEventListener("loadedmetadata", attemptSeek, { once: true });
    }
  }, [progressData, hasSetInitialTime]);

  const currentTimeRef = useRef(currentTime);
  useEffect(() => {
    currentTimeRef.current = currentTime;
  }, [currentTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && duration > 0) {
      interval = setInterval(() => {
        const watchedSeconds = Math.floor(currentTimeRef.current);
        const totalSeconds = Math.floor(duration);

        updateProgressMutation.mutate({
          courseId,
          watchedSeconds,
          totalSeconds,
        });

        console.log("Progress saved:", watchedSeconds, "/", totalSeconds);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isPlaying, duration, courseId]);

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
    if (!isPlaying || !canHover) {
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

  return (
    <>
      <div
        ref={containerRef}
        className={`relative w-full h-[700%] aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ${
          className ?? ""
        }`}
        onClick={courseData?.isPurchased ? togglePlay : undefined}
        onMouseEnter={courseData?.isPurchased ? onMouseEnter : undefined}
        onMouseLeave={courseData?.isPurchased ? onMouseLeave : undefined}
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

        {!courseData?.isPurchased && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-black/40 via-black/60 to-black/80 backdrop-blur-lg p-4 sm:p-6">
            <div className="relative w-full max-w-[90vw]  sm:max-w-md overflow-hidden rounded-2xl sm:rounded-3xl border border-white/20 bg-white/10 px-5 py-6 sm:px-8 sm:py-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div className="absolute -top-16 left-1/2 h-24 w-24 sm:h-32 sm:w-32 -translate-x-1/2 rounded-full bg-primary/30 blur-3xl" />

              <div className="relative mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border border-white/20 bg-white/10">
                <Lock size={23} className="text-white sm:hidden" />
                <Lock size={36} className="hidden text-white sm:block" />
              </div>

              <div className="mb-3 sm:mb-4 inline-flex items-center rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-violet-200">
                Premium Content
              </div>

              <h3 className="mb-2 sm:mb-3 text-xl sm:text-2xl font-bold text-white">
                Video Locked
              </h3>

              <p className="text-xs sm:text-sm md:text-base leading-relaxed text-white/75">
                Purchase this course to unlock the video and get full access to
                the premium content.
              </p>

              <div className="mx-auto mt-4 sm:mt-6 h-px w-20 sm:w-24 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </div>
          </div>
        )}

        {courseData?.isPurchased && (
          <>
            {showInitialCover && poster && !isPlaying && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  const v = videoRef.current;
                  if (v) v.play().catch(() => {});
                  setShowInitialCover(false);
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
                <div className="  absolute inset-0 flex items-center justify-center bg-black/25">
                  <div className="w-13 h-13 sm:w-20 sm:h-20  bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-lg">
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
                className="  absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
              >
                <div className=" w-13 h-13 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                  <Play size={28} className="text-[#644DB3]" />
                </div>
              </div>
            )}

            <button
              onClick={skip(-10)}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className={`  absolute left-16 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white rounded-full w-11 h-11 sm:w-15 sm:h-15 cursor-pointer flex items-center justify-center transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <SkipBack size={18} className="text-[#644DB3]" />
            </button>

            <button
              onClick={skip(10)}
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className={`absolute right-16 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/50 text-white rounded-full w-11 h-11 sm:w-15 sm:h-15 cursor-pointer flex items-center justify-center transition-opacity duration-300 ${
                showControls ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <SkipForward size={18} className="text-[#644DB3]" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-300 ease-out transform ${
                showControls
                  ? "opacity-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 translate-y-4 pointer-events-none"
              }`}
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
                  <div className="text-[11px] sm:text-sm">
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
          </>
        )}
      </div>

      <div
        className="mr-3 mb-5 mt-4 flex flex-wrap items-center gap-3"
        dir="rtl"
      >
        {courseData.categories?.map((cat) => (
          <div
            key={cat._id}
            className="bg-white/10 backdrop-blur-md text-[#898989] px-5 py-2 rounded-xl text-center border border-white/20 transition-all flex items-center justify-center min-w-[100px]"
          >
            {cat.name}
          </div>
        ))}

        {progressData?.data?.isCompleted &&
          (hasPassed ? (
            <div
              dir="ltr"
              className="bg-green-500/10 backdrop-blur-md text-green-600 dark:text-green-400 px-6 py-2 rounded-xl border border-green-500/30 flex items-center gap-2 font-bold tracking-wide "
            >
              <CheckCircle2 size={20} className="text-green-500" />
              You have passed this course
            </div>
          ) : (
            <button
              onClick={() => setIsExamModalOpen(true)}
              className="bg-[#644DB3]/80 backdrop-blur-md text-white px-6 py-2 rounded-xl text-center border border-[#644DB3]/50 hover:bg-[#644DB3] transition-all  font-bold tracking-wide"
            >
              Start Exam
            </button>
          ))}
      </div>
      <ExamModal
        courseId={courseId}
        isOpen={isExamModalOpen}
        onClose={() => setIsExamModalOpen(false)}
        onSuccessPass={() => setHasPassed(true)}
      />
    </>
  );
};
