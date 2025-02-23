const verticalDivStyles =
  "h-24 w-0 border-b-[0.75rem] border-t-[0.75rem] border-r-[0.75rem] border-transparent border-r-black";
const verticalSpanStyles =
  "h-24 block absolute left-3 border-t-[0.75rem] border-b-[0.75rem] border-l-[0.75rem] border-transparent border-l-black -mt-3";

const horizontalDivStyles =
  "w-24 border-b-[0.75rem] border-l-[0.75rem] border-r-[0.75rem] border-transparent border-b-black";
const horizontalSpanStyles =
  "w-24 block absolute top-3 -left-3 border-t-[0.75rem] border-l-[0.75rem] border-r-[0.75rem] border-transparent border-t-black";

const aSegment = " relative";
const bSegment = " absolute left-[85px] top-[2px]";
const cSegment = " absolute left-[85px] top-[3px]";
const dSegment = " relative -mt-[6px]";
const eSegment = " absolute left-[-13px] top-[3px]";
const fSegment = " absolute left-[-13px] top-[2px]";
const gSegment = " relative -mt-[7px]";

const segmentsStyles = {
  a: {
    div: horizontalDivStyles + aSegment,
    span: horizontalSpanStyles,
  },
  b: {
    div: verticalDivStyles + bSegment,
    span: verticalSpanStyles,
  },
  c: {
    div: verticalDivStyles + cSegment,
    span: verticalSpanStyles,
  },
  d: {
    div: horizontalDivStyles + dSegment,
    span: horizontalSpanStyles,
  },
  e: {
    div: verticalDivStyles + eSegment,
    span: verticalSpanStyles,
  },
  f: {
    div: verticalDivStyles + fSegment,
    span: verticalSpanStyles,
  },
  g: {
    div: horizontalDivStyles + gSegment,
    span: horizontalSpanStyles,
  },
};

export default function Segment({ on, segment }) {
  return (
    <div className={segmentsStyles[segment].div}>
      <span className={segmentsStyles[segment].span}></span>
    </div>
  );
}

/*export default function Segment({ on, orientation }) {
  const vertical = orientation === "vertical";
  return (
    <div
      className={`flex ${vertical ? "flex-row" : "flex-col"} ${
        vertical ? "-ml-4" : ""
      }`}
    >
      <div
        className={`${vertical ? "w-2 h-24 " : "w-24 h-2"} 
        ${
          vertical
            ? "after:border-t-2 after:border-white before:border-b-2 before:border-white"
            : "after:border-l-2 after:border-white before:border-r-2 before:border-white"
        }
        ${
          vertical
            ? "after:skew-y-[-45deg] before:skew-y-[45deg] after:-top-1 after:left-0 before:-bottom-1 before:right-0"
            : "after:skew-x-[-45deg] before:skew-x-[45deg] after:top-0 after:-left-1 before:top-0 before:-right-1"
        }
        ${
          on ? "bg-gray-600" : "bg-gray-300"
        } relative after:content-[''] after:w-2 after:h-2 after:bg-inherit after:absolute  before:content-[''] before:w-2 before:h-2 before:bg-inherit before:absolute`}
      ></div>
      <div
        className={`${vertical ? "w-2 h-24 " : "w-24 h-2"}
                ${
                  vertical
                    ? "after:border-t-2 after:border-white before:border-b-2 before:border-white"
                    : "after:border-l-2 after:border-white before:border-r-2 before:border-white"
                } 
        ${
          vertical
            ? "after:skew-y-[45deg] before:skew-y-[-45deg] after:-top-1 after:left-0 before:-bottom-1 before:right-0"
            : "after:skew-x-[45deg] before:skew-x-[-45deg] after:top-0 after:-left-1 before:top-0 before:-right-1"
        }
        ${
          on ? "bg-gray-600" : "bg-gray-300"
        } relative after:content-[''] after:w-2 after:h-2 after:bg-inherit after:absolute  before:content-[''] before:w-2 before:h-2 before:bg-inherit before:absolute`}
      ></div>
    </div>
  );
}*/
