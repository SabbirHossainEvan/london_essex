"use client";

import React from "react";
import { CheckCircle2, Download, PenTool, RefreshCw, Upload, UserRound } from "lucide-react";
import PanelCard from "@/components/dashboard/panel-card";
import {
  useGetProviderSignaturePageQuery,
  useSubmitProviderSignatureMutation,
} from "@/lib/redux/features/bookings/booking-api";

type ProviderSignatureUploadPageProps = {
  token: string;
};

type SignatureMode = "draw" | "upload";

function resolveApiErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data !== null &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  return fallback;
}

function formatSignedDate(value?: string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SignatureCanvas({
  disabled,
  onChange,
}: {
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  const drawingRef = React.useRef(false);

  const syncCanvasSize = React.useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) {
      return;
    }

    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(Math.floor(wrapper.clientWidth), 280);
    const height = 180;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.scale(ratio, ratio);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 2.5;
    context.strokeStyle = "#2d4c82";
  }, []);

  React.useEffect(() => {
    syncCanvasSize();
    window.addEventListener("resize", syncCanvasSize);

    return () => window.removeEventListener("resize", syncCanvasSize);
  }, [syncCanvasSize]);

  const getPoint = React.useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }, []);

  const startDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled) {
      return;
    }

    const context = canvasRef.current?.getContext("2d");

    if (!context) {
      return;
    }

    const point = getPoint(event);
    drawingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || disabled) {
      return;
    }

    const context = canvasRef.current?.getContext("2d");

    if (!context) {
      return;
    }

    const point = getPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
    onChange(canvasRef.current?.toDataURL("image/png") || "");
  };

  const stopDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) {
      return;
    }

    drawingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
    onChange(canvasRef.current?.toDataURL("image/png") || "");
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    syncCanvasSize();
    onChange("");
  };

  return (
    <div className="space-y-3">
      <div
        ref={wrapperRef}
        className="overflow-hidden rounded-2xl border border-[#d9e4f2] bg-white shadow-inner"
      >
        <canvas
          ref={canvasRef}
          className={`block touch-none ${disabled ? "cursor-not-allowed opacity-60" : "cursor-crosshair"}`}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
        />
      </div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-[#75839d]">
          Draw your signature inside the box.
        </p>
        <button
          type="button"
          onClick={clear}
          disabled={disabled}
          className="rounded-full border border-[#c9d7e7] px-3 py-1.5 text-xs font-medium text-[#44618e] transition hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default function ProviderSignatureUploadPage({
  token,
}: ProviderSignatureUploadPageProps) {
  const [mode, setMode] = React.useState<SignatureMode>("draw");
  const [drawnSignature, setDrawnSignature] = React.useState("");
  const [uploadedFile, setUploadedFile] = React.useState<File | null>(null);
  const [submitMessage, setSubmitMessage] = React.useState("");
  const [submitError, setSubmitError] = React.useState("");
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProviderSignaturePageQuery(token, {
    skip: token.trim() === "",
  });
  const [submitProviderSignature, { isLoading: isSubmitting }] =
    useSubmitProviderSignatureMutation();

  const screen = data?.data.screen;
  const submitEnabled = screen?.actions?.submit?.enabled ?? true;
  const isSigned =
    screen?.signature.status === "signed" || submitEnabled === false;
  const canSubmit =
    !isSigned &&
    (mode === "draw" ? drawnSignature.trim() !== "" : uploadedFile !== null);

  const handleSubmit = async () => {
    if (!screen || !canSubmit) {
      return;
    }

    try {
      setSubmitError("");
      setSubmitMessage("");

      if (mode === "upload" && !uploadedFile) {
        setSubmitError("Please provide a signature before submitting.");
        return;
      }

      const response = await submitProviderSignature({
        token,
        signatureType: mode,
        signature: mode === "upload" ? uploadedFile ?? undefined : undefined,
        signatureData: mode === "draw" ? drawnSignature : undefined,
        fileName:
          mode === "draw"
            ? "training-provider-signature.png"
            : uploadedFile?.name,
        signerName: screen.provider.name,
        signerEmail: screen.provider.email,
      }).unwrap();

      setSubmitMessage(
        response.message || "Training provider signature submitted successfully."
      );
      setUploadedFile(null);
      setDrawnSignature("");
      await refetch();
    } catch (requestError) {
      setSubmitError(
        resolveApiErrorMessage(
          requestError,
          "We could not submit the training provider signature right now."
        )
      );
    }
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f4f8fc_0%,#e8f1f8_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#5b7ca8]">
            London & Essex Electrical Training
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#233b69]">
            {screen?.title || "Training Provider Signature"}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[#61738f]">
            {screen?.subtitle ||
              "Review the candidate booking details and submit the training provider signature to complete this request."}
          </p>
        </div>

        {isLoading ? (
          <PanelCard className="space-y-4">
            <div className="h-8 w-56 animate-pulse rounded bg-[#e6edf5]" />
            <div className="h-24 animate-pulse rounded bg-[#eef4fa]" />
            <div className="h-56 animate-pulse rounded bg-[#eef4fa]" />
          </PanelCard>
        ) : null}

        {!isLoading && isError ? (
          <PanelCard>
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#fecaca] bg-[#fff5f5] px-4 py-3 text-sm text-[#dc2626]">
                {resolveApiErrorMessage(
                  error,
                  "We could not load the training provider signature screen right now."
                )}
              </div>
              <button
                type="button"
                onClick={() => void refetch()}
                className="inline-flex items-center gap-2 rounded-full bg-[#1ea6df] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1892c6]"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
            </div>
          </PanelCard>
        ) : null}

        {!isLoading && !isError && screen ? (
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <PanelCard className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#dce8f3] bg-[#f7fbff] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#33548b]">
                    <UserRound className="h-4 w-4" />
                    Provider
                  </div>
                  <dl className="space-y-2 text-sm text-[#5c6f8e]">
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-[#87a0c0]">
                        Name
                      </dt>
                      <dd className="mt-1 font-medium text-[#223d6b]">
                        {screen.provider.name || "Training Provider"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-[#87a0c0]">
                        Email
                      </dt>
                      <dd className="mt-1 break-all font-medium text-[#223d6b]">
                        {screen.provider.email}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-2xl border border-[#dce8f3] bg-[#f7fbff] p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#33548b]">
                    <Download className="h-4 w-4" />
                    Booking
                  </div>
                  <dl className="space-y-2 text-sm text-[#5c6f8e]">
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-[#87a0c0]">
                        Booking Ref
                      </dt>
                      <dd className="mt-1 font-medium text-[#223d6b]">
                        {screen.booking.bookingNumber}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-[#87a0c0]">
                        Candidate
                      </dt>
                      <dd className="mt-1 font-medium text-[#223d6b]">
                        {screen.booking.candidateName || "Candidate"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-[#87a0c0]">
                        Course
                      </dt>
                      <dd className="mt-1 font-medium text-[#223d6b]">
                        {screen.booking.courseTitle || "Course"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="rounded-2xl border border-[#dce8f3] bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#28467b]">
                      Signature status
                    </p>
                    <p className="mt-1 text-sm text-[#6c7e9b]">
                      {isSigned
                        ? "This training provider request has already been signed."
                        : "This request is waiting for the training provider signature."}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                      isSigned
                        ? "bg-[#ecfdf3] text-[#15803d]"
                        : "bg-[#eef6ff] text-[#25589a]"
                    }`}
                  >
                    {screen.signature.status}
                  </span>
                </div>
                {screen.signature.signedAt ? (
                  <p className="mt-3 text-sm text-[#5f7495]">
                    Signed on {formatSignedDate(screen.signature.signedAt)}
                  </p>
                ) : null}
                {screen.signature.fileName ? (
                  <p className="mt-1 text-sm text-[#5f7495]">
                    File: {screen.signature.fileName}
                  </p>
                ) : null}
                {screen.signature.available && screen.signature.previewUrl ? (
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#dce8f3] bg-[#f8fbff] p-3">
                    <img
                      src={screen.signature.previewUrl}
                      alt="Submitted training provider signature preview"
                      className="max-h-48 w-full rounded-xl object-contain"
                    />
                  </div>
                ) : null}
              </div>
            </PanelCard>

            <PanelCard className="space-y-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-[#233b69]">
                    Submit Signature
                  </h2>
                  <p className="mt-1 text-sm text-[#697c99]">
                    Choose whether to draw your signature or upload an image file.
                  </p>
                </div>
                {isSigned ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#ecfdf3] px-3 py-1.5 text-sm font-medium text-[#15803d]">
                    <CheckCircle2 className="h-4 w-4" />
                    Signed
                  </div>
                ) : null}
              </div>

              {submitMessage ? (
                <div className="rounded-2xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-sm text-[#15803d]">
                  {submitMessage}
                </div>
              ) : null}

              {submitError ? (
                <div className="rounded-2xl border border-[#fecaca] bg-[#fff5f5] px-4 py-3 text-sm text-[#dc2626]">
                  {submitError}
                </div>
              ) : null}

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMode("draw")}
                  disabled={isSubmitting || isSigned}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    mode === "draw"
                      ? "border-[#1ea6df] bg-[#eef8ff] text-[#1d4f87]"
                      : "border-[#d7e4f1] bg-white text-[#6b7d99]"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <PenTool className="mb-2 h-4 w-4" />
                  <p className="text-sm font-semibold">Draw signature</p>
                </button>
                <button
                  type="button"
                  onClick={() => setMode("upload")}
                  disabled={isSubmitting || isSigned}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    mode === "upload"
                      ? "border-[#1ea6df] bg-[#eef8ff] text-[#1d4f87]"
                      : "border-[#d7e4f1] bg-white text-[#6b7d99]"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  <Upload className="mb-2 h-4 w-4" />
                  <p className="text-sm font-semibold">Upload image</p>
                </button>
              </div>

              {mode === "draw" ? (
                <SignatureCanvas
                  disabled={isSubmitting || isSigned}
                  onChange={setDrawnSignature}
                />
              ) : (
                <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#cad8e7] bg-[#f9fbfd] px-6 py-8 text-center transition hover:bg-[#f3f8fc]">
                  <Upload className="h-7 w-7 text-[#5f7fa8]" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#28467b]">
                      {uploadedFile ? uploadedFile.name : "Choose a signature image"}
                    </p>
                    <p className="text-xs text-[#7386a2]">
                      PNG, JPG, or other image files supported by the API.
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={isSubmitting || isSigned}
                    className="hidden"
                    onChange={(event) => {
                      setUploadedFile(event.target.files?.[0] ?? null);
                      setSubmitError("");
                      setSubmitMessage("");
                    }}
                  />
                </label>
              )}

              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={!canSubmit || isSubmitting || isSigned}
                className={`w-full rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${
                  !canSubmit || isSubmitting || isSigned
                    ? "cursor-not-allowed bg-[#c5d1df]"
                    : "bg-[linear-gradient(135deg,#6ad7ff_0%,#1eb8f2_45%,#0ea5e9_100%)] shadow-[0_16px_30px_rgba(30,166,223,0.22)]"
                }`}
              >
                {isSubmitting
                  ? "Submitting signature..."
                  : screen.actions?.submit?.label || "Submit Signature"}
              </button>
            </PanelCard>
          </div>
        ) : null}
      </div>
    </main>
  );
}
