type CourseFlowType = "am2" | "standard";

type CourseFlowSignals = {
  bookingFlow?: CourseFlowType;
  flowType?: string;
  courseType?: string;
  slug?: string;
  title?: string;
};

function normalizeValue(value?: string) {
  return (value ?? "").trim().toLowerCase();
}

function isAm2FlowValue(value?: string) {
  const normalizedValue = normalizeValue(value);

  return normalizedValue === "am2";
}

function isAm2AssessmentSlug(value?: string) {
  const normalizedValue = normalizeValue(value);

  return (
    normalizedValue === "am2-assessment-preparation" ||
    normalizedValue === "am2-assessment" ||
    normalizedValue.startsWith("am2-assessment-")
  );
}

function isAm2AssessmentTitle(value?: string) {
  const normalizedValue = normalizeValue(value).replace(/\s+/g, " ");

  return (
    normalizedValue === "am2 assessment preparation" ||
    normalizedValue === "am2 assessment"
  );
}

export function isAm2Course(signals: CourseFlowSignals) {
  if (signals.bookingFlow === "am2") {
    return true;
  }

  if (isAm2FlowValue(signals.flowType) || isAm2FlowValue(signals.courseType)) {
    return true;
  }

  if (isAm2AssessmentSlug(signals.slug)) {
    return true;
  }

  return isAm2AssessmentTitle(signals.title);
}

export function getCourseBookingFlow(signals: CourseFlowSignals): CourseFlowType {
  return isAm2Course(signals) ? "am2" : "standard";
}
