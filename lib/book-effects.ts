// Native scroll distance for a complete physical sheet turn.
export const TURN_TRAVEL = 0.85;
// Frame-rate-independent response: ~95% settled in 96ms, no velocity/overshoot.
export const TURN_RESPONSE_MS = 32;
// Deliberate input pacing, independent of event frequency or fling velocity.
export const INPUT_TURN_MS = 850;
export const PHONE_DRAG_VIEWPORTS = 0.95;
export const WHEEL_INPUT_GAIN = 0.75;
