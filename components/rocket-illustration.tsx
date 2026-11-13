/* Original pen study. Slightly asymmetric contours and broken hatching keep the
   mechanical drawing light on the paper. Static and ID-free for turning leaves. */
export function RocketIllustration() {
  return (
    <svg
      className="rocket-illustration"
      viewBox="0 0 400 400"
      fill="none"
      stroke="#355747"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* SVG's downward y-axis makes a positive rotation point an upright nose
          toward the upper right. Exhaust follows the same lower-left axis. */}
      <g transform="translate(244 150) rotate(43)">
        <g strokeWidth=".55" opacity=".32">
          <path
            strokeDasharray="4 6"
            d="M0-150v26M0 92v27M-39-85h78M-37 58h74"
          />
          <path d="M-33-98q33-13 66 0M-40-92v14m80-14v14M-35 52v12m70-12v12" />
        </g>

        {/* Turned nose, long cylindrical hull, swept fins and engine bell. */}
        <g strokeWidth="1.25">
          <path d="M0-132C-12-120-23-102-26-85c-2 45-1 96 2 143q24 9 48 0c3-45 4-99 2-143C22-103 12-121 0-132Z" />
          <path d="M-26-85q26 7 52 0M-25 49q25 7 50 0M-24 58l7 12q17 5 34 0l7-12M-12 72q0 9-7 18 19 7 38 0-7-10-7-18" />
          <path d="M-26 7c-13 15-25 35-32 63l-2 13 36-25M26 9c15 17 27 39 32 64l1 10-35-25" />
          <path d="M-3 26q-5 26 0 56l4 10 3-10q4-30-1-56Z" />
          <circle cx="0" cy="-50" r="18" />
          <circle cx="0" cy="-50" r="13.5" strokeWidth=".8" />
        </g>

        {/* Panel seams, window fasteners and sparse engraved shading. */}
        <g strokeWidth=".65">
          <path d="M-19-79q-2 41 0 81m0 8 1 31M19-79q3 37 1 65m0 9-1 46M-25-13q25 5 51 0M-25-8q25 5 50 0M-17 70q17 5 34 0M-16 84q16 5 32 0" />
          <path d="M-8-57q5-5 11-4M-9-52q2-3 5-4M-24 17q-15 20-27 52m8-6 19-14M26 20q15 19 24 45m-9-3-16-13" />
          <path
            d="M-2-124q12 17 17 35M1-119l5-1m-2 7 6-1m-3 7 6-1m-4 7 7-1m-5 7 8-1"
            opacity=".65"
          />
          <path
            d="m20-76 6-3m-6 9 6-3m-6 9 6-3m-6 9 6-3m-6 9 6-3m-6 9 6-3m-6 9 6-3m-6 16 6-3m-6 9 6-3m-6 9 6-3m-6 9 6-3m-7 9 6-3m-6 9 6-3m-6 9 6-3m-6 9 6-3"
            opacity=".6"
          />
          <path
            d="m-33 33 6 1m-9 4 7 1m-10 4 8 1m-10 4 7 1m-10 4 8 1m-10 4 7 1m-10 4 8 1M34 35l4-1m-2 6 5-1m-2 6 4-1m-2 6 5-1m-2 6 4-1m-2 6 4-1M8 76l5 1m-4 3 6 1m-5 3 7 1"
            opacity=".65"
          />
          <circle cx="0" cy="-65.8" r=".8" />
          <circle cx="15.8" cy="-50" r=".8" />
          <circle cx="0" cy="-34.2" r=".8" />
          <circle cx="-15.8" cy="-50" r=".8" />
          <path d="M-10 14h6v9h-6ZM8 30h5v7H8M-15-2v2M15-2v2M-14 54v3M14 54v3" />
        </g>

        <g stroke="#B59A64" strokeWidth=".8">
          <path d="M-25-81q25 6 50 0M-24 45q24 7 49 0M-17 91q17 5 34 0" />
          <path d="M-11-61a15.6 15.6 0 0 1 22 0" />
        </g>

        {/* Open, tapering pen trails, without a filled flame or smoke shapes. */}
        <g strokeWidth=".85" opacity=".8">
          <path d="M-13 99c-9 23-2 37-10 60s-7 39-20 65M-6 102c-4 25 4 39-2 64s-1 60-11 90M3 103c6 25-4 44 1 69s-3 47 3 69M12 99c12 22 4 44 14 68s6 43 17 66" />
        </g>
        <g strokeWidth=".5" opacity=".45">
          <path d="M-21 113c-12 28-8 44-19 64s-11 42-24 64M21 113c14 23 10 46 22 64s15 35 21 56M-2 124c4 23-5 41-2 62m1 12-3 25M-27 193q-2 22-10 36m64-42q3 14 8 24" />
        </g>
        <path
          d="M-16 126q-5 17-5 31M17 139q0 20 7 32M-13 211q0 18-4 31"
          stroke="#B59A64"
          strokeWidth=".65"
          opacity=".6"
        />
      </g>
    </svg>
  );
}
