import React from "react";
import getBackgroundColor from "../util/getBackgroundColor";
import Card from "./Card";

function ConfidenceGradient() {
  return (
    <Card className="border  p-5 bg-white w-fit gap-10 rounded-lg flex justify-between flex-row">
      <div className="max-w-96 flex flex-col gap-2">
        <h2>Confidence Score</h2>
        <p className="text-sm">A higher confidence score means that Textract is more certain about its extraction, whereas a lower score suggests less certainty.</p>
      </div>
      <div className="flex justify-center gap-3">
        {Array.from({ length: 10 }, (_, index) => {
          const confidence = (index + 1) * 10;
          const backgroundColor = getBackgroundColor(confidence);
          return (
            <div
              className="flex flex-col items-center"
              key={index}
            >
              <p>{confidence}%</p>
              <div
                style={{
                  backgroundColor: backgroundColor,
                  height: "45px",
                  width: "45px",
                  borderRadius: "var(--border-radius-sm)",
                }}
              ></div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default ConfidenceGradient;
