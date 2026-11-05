type Chapter =
  "introduction" | "experience" | "skills" | "work" | "education" | "contact";

/* Original editorial studies of Negar's software work, plus her approved cat-person
   detail. Conceptual drawings, not diagrams of a particular employer's system.
   No IDs, filters or animation: safe in inert turning-leaf copies. */
function DeveloperDesk() {
  return (
    <>
      <g strokeWidth="1.25">
        <path d="m106 39 229 24q7 1 7 8v126l-237-22V46q0-7 7-6M115 51l216 23v109l-216-20ZM105 175l237 22-51 53-240-31Zm-54 44v5l240 31 51-53v-5M291 250v5" />
        <path d="m111 185 203 20-28 29-205-25ZM172 218l56 6-10 11-56-6Z" />
      </g>
      <g strokeWidth=".65">
        <path d="m115 76 216 23M139 79v86M151 103l5 4-5 3m11-1 45 5m-55 8 8 1m7 1 65 6m-80 4 13 2m7 0 37 4m-57 4 8 1m7 1 83 9m-98 1 55 6M116 185l-28 26m48-24-28 26m48-24-28 26m48-24-28 26m48-24-28 26m48-24-28 26m48-24-28 26m48-24-28 26m48-24-28 26M102 194l202 21M94 202l202 21" />
        <path
          d="m232 121-8 7 8 9m18-14 8 9-8 7m-9-18-4 19M285 113l33 4m-33 5 25 3m-25 6 30 3m-30 6 19 2M68 223l216 28"
          opacity=".65"
        />
        <circle cx="121" cy="65" r="1.4" />
        <circle cx="128" cy="66" r="1.4" />
        <circle cx="135" cy="67" r="1.4" />
      </g>
      {/* A sleeping cat, kept small beside the developer's tools. */}
      <g strokeWidth="1.15">
        <path d="M35 223q-1-24 24-28 35-7 50 21 13 24-16 31-25 6-51-3M34 239q-20 2-21-16l1-18 12 9 13-10 7 18q5 20-12 17ZM46 241q44 8 50-8 6-17-16-22-15-3-23 8" />
        <path
          d="m17 225 6 2m8 0 6-2M25 231l3 2 3-2m-3 2v4m-9-3-11-2m11 5-10 2m28-5 10-2m-10 5 11 2"
          strokeWidth=".6"
        />
        <path
          d="m53 203 3 8m5-10 3 8m6-8 3 8m7-5 2 7m-28 21 7 3m-5 0 8 3m-3 0 8 3M17 210l3 8m15-8-2 8"
          strokeWidth=".55"
          opacity=".65"
        />
      </g>
      <g stroke="#B59A64" strokeWidth=".8">
        <path d="M352 235h26m-13-13v26M165 58l41 4M23 260q56 9 105 3" />
      </g>
      <path d="M14 270h332" strokeWidth=".5" opacity=".35" />
    </>
  );
}

function BackendStudy() {
  return (
    <>
      <g strokeWidth=".55" opacity=".35">
        <path d="M20 257h363M46 45v225M188 30v244M341 70v200" />
        <path strokeDasharray="3 6" d="M23 140h354M23 201h354" />
      </g>
      {/* Source records feeding parallel processing lanes and a data store. */}
      <g strokeWidth="1.2">
        <path d="M29 58h61v67H29ZM35 52h61v67M41 46h61v67M29 74h61M39 85h35m-35 9h42m-42 9h27M90 100h29v71h22M119 171v61h22M119 171v-61h22" />
        <path d="M141 90h109v40H141ZM141 151h109v40H141ZM141 212h109v40H141ZM150 99h91m-91 61h91m-91 61h91" />
        <path d="M250 110h29v61h30M250 171h59M250 232h29v-61M304 171l5-4m-5 4 5 4M135 110l6-4m-6 4 6 4M135 171l6-4m-6 4 6 4M135 232l6-4m-6 4 6 4" />
        <ellipse cx="341" cy="159" rx="31" ry="11" />
        <path d="M310 159v64c0 15 62 15 62 0v-64M310 180c0 15 62 15 62 0M310 201c0 15 62 15 62 0" />
      </g>
      <g strokeWidth=".65">
        <path
          d="M154 111h31m-31 7h62M154 172h44m-44 7h67M154 233h27m-27 7h58M316 168v9m0 12v9m0 12v10M322 171v9m0 12v9m0 12v9M97 65l3 3m-3 4 3 3m-3 4 3 3M257 116l14 0m-14 6h14M257 177h46m-46 6h46M257 238h14m-14 6h14"
          opacity=".65"
        />
        <path d="M183 59h41m-5-4 5 4-5 4M205 49l6 6m-6-6-6 6M205 49v23m-6-6 6 6 6-6" />
      </g>
      <g stroke="#B59A64" strokeWidth=".85">
        <circle cx="119" cy="171" r="3" />
        <circle cx="279" cy="171" r="3" />
        <path d="M135 270h120m-120-4v8m120-8v8M188 34v7" />
      </g>
    </>
  );
}

function DeveloperTools() {
  return (
    <>
      {/* Overlapping API-contract and test sheets, with a mechanical pencil. */}
      <g strokeWidth="1.2">
        <path d="m58 57 159-19 18 178-159 20ZM66 66l142-17 3 27L69 93ZM73 104l142-17 13 116-142 17ZM73 129l142-17M78 158l141-17M82 187l140-17M115 99l14 116" />
        <path d="m175 91 145 17-17 157-145-17ZM185 103l123 15M183 118l124 14M179 157l124 14M175 195l124 14M172 233l123 14M239 125l-13 114" />
        <path d="m331 52 13 6-69 153-14 13 1-20ZM262 204l13 7m-10-8 66-147m-70 168 9-5M331 52l4-9 13 6-4 9M333 63l7 3M273 212l-7 5" />
      </g>
      <g strokeWidth=".65">
        <path d="m79 76 50-6m-49 12 74-9M85 116l17-2m-14 31 17-2m-14 31 17-2m-14 31 17-2M128 111l58-7m-57 14 69-8m-66 30 51-6m-50 13 67-8m-65 30 42-5m-41 12 67-8m-64 29 54-6m-53 13 66-8" />
        <path d="m187 137 6 7 10-10m-20 41 6 7 10-10m-20 41 6 7 10-10M246 141l41 5m-42 2 31 4m-35 27 39 4m-40 4 28 3m-31 27 40 5m-41 2 31 4" />
        <path d="M47 245q34 13 86 7M48 252q41 13 85 7" opacity=".45" />
      </g>
      <g stroke="#B59A64" strokeWidth=".8">
        <path d="m79 58 8-1 3 25-5-3-3 4ZM335 43l13 6M317 242h37m-18-18v36" />
        <circle cx="336" cy="242" r="5" />
      </g>
    </>
  );
}

function RepositoryStudy() {
  return (
    <>
      {/* A working repository: issue notes, review branch and a merge into main. */}
      <g strokeWidth="1.2">
        <path d="M48 95h76l15 15h155v137H48ZM48 128h268l-22 119H48M56 95V68h196v42M63 68v-8h196v50M70 60v-7h196v57" />
        <path d="M129 147v70M196 147v24q0 20-22 20h-25q-20 0-20 21M196 171q0 20 24 20h48M129 147V88q0-22 22-22h45" />
        <circle cx="129" cy="151" r="5" />
        <circle cx="129" cy="180" r="5" />
        <circle cx="129" cy="217" r="5" />
        <circle cx="196" cy="151" r="5" />
        <circle cx="196" cy="171" r="5" />
        <circle cx="268" cy="191" r="5" />
        <path d="M217 33h110v50H217ZM217 48h110M280 107h70v48h-70ZM280 119h70M327 58h19v49M303 155v36h-30M274 188l-6 3 6 3" />
      </g>
      <g strokeWidth=".6">
        <path d="M228 58h36m-36 8h78M290 131h21m-21 8h46M81 79h94M81 86h61M60 137h44m-44 7h30M57 238h228M66 233h220M129 231h23m8 0h12m7 0h35" />
        <path d="m299 224 7-9m-8 15 8-10m-9 16 8-10m-9 16 8-10" opacity=".6" />
        <path strokeDasharray="3 6" d="M26 264h333M35 34v225" opacity=".35" />
      </g>
      <g stroke="#B59A64" strokeWidth=".85">
        <circle cx="129" cy="217" r="9" />
        <path d="M196 94v45m-4-5 4 5 4-5M330 231h31m-15-15v31" />
      </g>
    </>
  );
}

function ProgrammingBooks() {
  return (
    <>
      <g strokeWidth="1.3">
        <path d="m44 232 202-14 86 28-206 18-82-25Zm0 7v15l83 27 205-20v-15M52 244v9l75 22 196-18M127 264v17M59 214l185-12 70 23-189 16-66-21Zm0 6v13l65 22 190-17v-13M69 225v7l55 17 180-15M124 241v14" />
        <path d="M67 156q54-16 111 20 53-37 115-29l20 61q-65-9-130 23-55-29-123-18Zm111 20 5 55M67 156l7-7q54-12 104 21 49-33 112-29l3 6M60 213l2 7q66-8 121 18 65-29 130-23v-7M183 231v7" />
        <path d="m214 140 66-100 9 6-65 100-15 9Zm-5 15 5-15 10 6M280 40l5-8 9 6-5 8M218 142l66-99" />
      </g>
      <g strokeWidth=".6" opacity=".75">
        <path d="M78 164q45-7 88 16M77 172q47-7 90 16M75 180q48-7 93 16M73 188q51-6 96 16M72 196q51-5 98 16M194 179q43-24 90-24M195 187q44-24 92-24M197 195q44-24 92-24M199 203q45-23 93-24M201 211q45-22 93-24M67 215q63-4 113 19M188 233q61-27 119-22M134 267l187-17M134 271l187-17M134 275l187-17M132 244l170-14M132 248l170-14" />
        <path d="m51 246 68 22m-68-18 68 22m-51-45 49 16m-49-12 49 16M112 102h42v22h-42ZM133 124v18m-5-5 5 5 5-5M97 98l-8-8m6 14H81M159 98l10-7M133 97V84" />
        <path
          d="M102 59q25-8 50 0M103 66q25-8 49 0M104 73q24-8 47 0"
          opacity=".5"
        />
      </g>
      <path
        stroke="#B59A64"
        strokeWidth=".85"
        d="m91 239 10-1v25l-6-5-5 4ZM285 32l9 6M180 85h24m-12-12v24"
      />
    </>
  );
}

function Correspondence() {
  return (
    <>
      {/* Layered stationery and a fountain pen, not an interface mail icon. */}
      <g strokeWidth="1.2">
        <path d="m65 114 213-25 33 137-218 31ZM65 114l127 61 86-86M93 257l78-92m140 61-99-61M83 118l-9-55 160-21 14 53M83 62l-1-8 158-20 16 60" />
        <path d="m241 225 83-144 15 9-82 144-17 14Zm16 9-16-9m3 7-4 16 14-7M324 81l10-18 15 9-10 18M330 81l-5-3 7-13M326 97l8 5m-85 129 78-137M240 248l-4 7" />
      </g>
      <g strokeWidth=".65">
        <path d="m97 83 31-4m-30 11 50-6M98 104l72-9m-22 13 62-8M114 204l35-41m-31 43 36-42M104 243l137-19M103 248l136-20M93 129l40 19m-39-13 39 18" />
        <path d="M139 76q5-10 9-4t8-2q4-8 8-3t13-6M188 65q8-11 12-5t8-2M148 84q6-9 9-5t7-2q3-5 6-3m3-1 17-3" />
        <path
          d="m320 116 4 2m-7 3 4 2m-7 3 4 2m-7 3 4 2m-7 3 4 2m-7 3 4 2"
          opacity=".55"
        />
      </g>
      <g stroke="#B59A64" strokeWidth=".85">
        <path d="m334 63 15 9M241 225l16 9M270 251h39m-19-14v28" />
        <circle cx="290" cy="251" r="5" />
      </g>
      <path d="M45 276h307" strokeWidth=".5" opacity=".35" />
    </>
  );
}

const drawings = {
  introduction: DeveloperDesk,
  experience: BackendStudy,
  skills: DeveloperTools,
  work: RepositoryStudy,
  education: ProgrammingBooks,
  contact: Correspondence,
};

export function ChapterIllustration({
  chapter,
  placement = "reading",
}: {
  chapter: Chapter;
  placement?: "reading" | "opening";
}) {
  const Drawing = drawings[chapter];
  return (
    <svg
      className={`chapter-illustration illustration-${chapter} illustration-${placement}`}
      data-illustration={chapter}
      viewBox="0 0 400 300"
      fill="none"
      stroke="#355747"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <Drawing />
    </svg>
  );
}
