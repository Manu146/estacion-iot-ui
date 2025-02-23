import Segment from "./Segment";

function Digit({ digit }) {
  console.log(digit);
  return (
    <div className="flex flex-col justify-center">
      <Segment segment={"a"} />
      <div className="h-24 relative">
        <Segment segment={"b"} />
        <Segment segment={"f"} />
      </div>
      <Segment segment={"g"} />
      <div className="h-24 relative">
        <Segment segment={"c"} />
        <Segment segment={"e"} />
      </div>
      <Segment segment={"d"} />
    </div>
  );
}

export default function Display({ number, size }) {
  //const hasDot = number.toString().indexOf(".") !== -1;
  //const nDigits = number.toString().length - hasDot ? 1 : 0;
  const digits = number.toString().split("");
  const bcd = parseInt(number.toString(10), 16);
  const sevenSeg = console.log(digits);

  return (
    <>
      {digits.map((digit) => {
        if (digit === ".") return <></>;
        return <Digit digit={digit} />;
      })}
    </>
  );
}
