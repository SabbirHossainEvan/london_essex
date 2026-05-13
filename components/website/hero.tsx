"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Search, Star, Award, Users, Clock } from "lucide-react";

const stats = [
  { label: "Students Trained", value: 20, suffix: "K+", decimals: 0, icon: Users },
  { label: "Star Rating", value: 4.9, suffix: "", decimals: 1, icon: Star },
  { label: "Pass Rate", value: 98, suffix: "%", decimals: 0, icon: Award },
  { label: "Years Experience", value: 18, suffix: "+", decimals: 0, icon: Clock },
];

const fallbackSearchUi = {
  placeholder: "Find a course...",
  actionLabel: "Find Courses",
  popular: [
    { label: "Gas Engineer", query: "Gas Engineer" },
    { label: "Electrical", query: "Electrical" },
    { label: "Plumbing", query: "Plumbing" },
    { label: "Renewables", query: "Renewables" },
  ],
};

const searchEndpointBase =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ?? "/api";

type SearchCourseResult = {
  id?: string;
  slug?: string;
  title?: string;
  category?: string;
  schedule?: string;
  shortDescription?: string;
  description?: string;
  status?: string;
  duration?: string;
  price?: number;
  currency?: string;
  url?: string;
  image?: {
    url?: string;
    alt?: string;
  };
  actions?: {
    primary?: {
      url?: string;
    };
  };
};

type SearchApiPayload = {
  success?: boolean;
  message?: string;
  data?: {
    search?: {
      query?: string;
      placeholder?: string;
      actionLabel?: string;
      popular?: Array<{
        label: string;
        query: string;
      }>;
    };
    filters?: {
      search?: string;
      status?: string | null;
    };
    courses?: SearchCourseResult[];
    pagination?: {
      page?: number;
      limit?: number;
      total?: number;
      totalPages?: number;
    };
  };
};

function resolveCourseHref(course: SearchCourseResult) {
  const directUrl = course.actions?.primary?.url ?? course.url;

  if (typeof directUrl === "string" && directUrl.startsWith("/")) {
    return directUrl;
  }

  if (typeof course.slug === "string" && course.slug.length > 0) {
    return `/courses/${course.slug}`;
  }

  return "/courses";
}

const AnimatedStat = ({
  value,
  suffix,
  decimals,
}: {
  value: number;
  suffix: string;
  decimals: number;
}) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const duration = 2600;
    const startTime = performance.now();

    let frameId = 0;

    const updateValue = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(value * easedProgress);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(updateValue);
      }
    };

    frameId = window.requestAnimationFrame(updateValue);

    return () => window.cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <span>
      {displayValue.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const Hero = () => {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchCourseResult[]>([]);
  const [searchedTerm, setSearchedTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [placeholder, setPlaceholder] = React.useState(fallbackSearchUi.placeholder);
  const [actionLabel, setActionLabel] = React.useState(fallbackSearchUi.actionLabel);
  const [popularSearches, setPopularSearches] = React.useState(fallbackSearchUi.popular);

  const runSearch = React.useCallback(async (value: string) => {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      setResults([]);
      setSearchedTerm("");
      setError("Enter a course topic to search.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${searchEndpointBase}/courses/search?q=${encodeURIComponent(trimmedValue)}&limit=8`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Search request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as SearchApiPayload;
      const nextResults = payload.data?.courses ?? [];
      const nextSearchConfig = payload.data?.search;

      setResults(nextResults);
      setSearchedTerm(nextSearchConfig?.query ?? trimmedValue);
      setPlaceholder(nextSearchConfig?.placeholder ?? fallbackSearchUi.placeholder);
      setActionLabel(nextSearchConfig?.actionLabel ?? fallbackSearchUi.actionLabel);
      setPopularSearches(nextSearchConfig?.popular ?? fallbackSearchUi.popular);
      setError(nextResults.length === 0 ? `No courses found for "${trimmedValue}".` : "");
    } catch (searchError) {
      console.error("Course search failed", searchError);
      setResults([]);
      setSearchedTerm(trimmedValue);
      setError("We couldn't load course matches right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await runSearch(query);
  };

  const handleCategorySearch = async (category: string) => {
    setQuery(category);
    await runSearch(category);
  };

  const handleViewAllResults = () => {
    const trimmedQuery = query.trim() || searchedTerm.trim();

    router.push(
      trimmedQuery ? `/courses?search=${encodeURIComponent(trimmedQuery)}` : "/courses"
    );
  };

  return (
    <div className="relative overflow-hidden bg-white pt-12 pb-20 sm:pt-15 lg:pt-25 lg:pb-30">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 xl:px-16">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,640px)_minmax(560px,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,700px)_minmax(580px,1fr)]">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-[700px]"
          >
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-[#2D3182] leading-[1.05]">
              Find the right construction training{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-white px-2">course</span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute inset-0 bg-[#00AEEF] rounded-lg -rotate-1 origin-left"
                />
              </span>{" "}
              and book your place today.
            </h1>

            <p className="mt-10 max-w-[640px] text-xl leading-relaxed text-gray-600">
              Professional electrician, gas, and plumbing training delivered by expert instructors in state-of-the-art facilities.
            </p>

            {/* Search Bar */}
            <div className="mt-12 max-w-[520px]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative flex items-center p-1 bg-white rounded-2xl shadow-xl shadow-blue-900/5 border border-gray-100/50">
                  <div className="flex-1 flex items-center px-4">
                    <Search className="text-gray-400 mr-2" size={20} />
                    <input
                      type="text"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={placeholder}
                      className="w-full py-4 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-lg"
                      aria-label="Search for courses"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-4 bg-gradient-to-r from-[#39C5F8] to-[#0193D7] text-white font-bold rounded-xl flex items-center gap-2 hover:shadow-lg transition-shadow whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-80"
                  >
                    <span>{isLoading ? "Searching..." : actionLabel}</span>
                  </button>
                </div>

                {error ? (
                  <p className="text-sm font-medium text-[#d64545]">{error}</p>
                ) : null}

                {results.length > 0 ? (
                  <div className="rounded-[24px] border border-[#d6eaf8] bg-white p-3 shadow-[0_20px_55px_rgba(18,70,120,0.09)]">
                    <div className="flex items-center justify-between gap-4 px-2 pb-3 pt-1">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#19a9de]">
                          Search Results
                        </p>
                        <p className="mt-1 text-sm text-[#5f6b85]">
                          {results.length} matches for &ldquo;{searchedTerm}&rdquo;
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleViewAllResults}
                        className="inline-flex items-center gap-2 rounded-full border border-[#cfe9f8] px-4 py-2 text-sm font-semibold text-[#2D3182] transition-colors hover:bg-[#f3fbff]"
                      >
                        <span>View all</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      {results.map((course, index) => (
                        <Link
                          key={course.id ?? course.slug ?? `${course.title ?? "course"}-${index}`}
                          href={resolveCourseHref(course)}
                          className="block rounded-[18px] border border-transparent px-4 py-3 transition-colors hover:border-[#d7ecfb] hover:bg-[#f7fbff]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="text-base font-semibold text-[#2D3182]">
                                {course.title ?? "Untitled course"}
                              </p>
                              <p className="mt-1 text-sm text-[#5f6b85]">
                                {course.shortDescription ??
                                  course.description ??
                                  course.schedule ??
                                  "View full course details and availability."}
                              </p>
                              {course.schedule || course.price ? (
                                <p className="mt-2 text-xs font-medium uppercase tracking-[0.12em] text-[#7a86a4]">
                                  {[course.schedule, course.price ? `${course.currency ?? "GBP"} ${course.price}` : null]
                                    .filter(Boolean)
                                    .join(" | ")}
                                </p>
                              ) : null}
                            </div>
                            <div className="shrink-0 text-right">
                              {course.status ? (
                                <span className="inline-flex rounded-full bg-[#eef8ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#19a9de]">
                                  {course.status}
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </form>
            </div>

            {/* Categories */}
            <div className="mt-10 flex max-w-[640px] flex-wrap gap-4">
              <span className="text-sm font-bold text-[#2D3182]/50 uppercase tracking-widest mr-2 self-center">
                Popular:
              </span>
              {popularSearches.map((item) => (
                <button
                  key={item.query}
                  type="button"
                  onClick={() => void handleCategorySearch(item.query)}
                  className="px-5 py-2.5 bg-white border border-gray-100 rounded-full text-sm font-semibold text-[#2D3182] hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 text-center sm:mt-20 sm:gap-x-10 sm:gap-y-12 md:mt-24 md:grid-cols-4 md:gap-12 md:text-left">
              {stats.map((stat) => (
                <div key={stat.label} className="flex min-w-0 flex-col items-center md:items-start">
                  <div className="text-[2.25rem] font-black leading-none tracking-tight text-[#2D3182] sm:text-4xl">
                    <AnimatedStat
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                    />
                  </div>
                  <div className="mt-2 max-w-[9rem] text-[0.72rem] font-bold leading-[1.2] uppercase tracking-[0.14em] text-gray-400 sm:text-xs sm:tracking-[0.2em]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Hero Image (Single Image Replication) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative hidden h-[680px] w-full items-center justify-center lg:flex"
          >
            <div className="relative h-full w-full lg:translate-x-4 lg:scale-[1.03] xl:translate-x-8">
              <Image
                src="/hero-collage.png"
                alt="Construction Training Collage"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 700px"
                className="mt-6 h-full w-full object-contain pointer-events-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
