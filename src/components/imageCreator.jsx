import { useState, useEffect } from "react";
import { Intro } from "./imageCreator_sentence";
import MakeImage from "./imageCreator_MakeImage";

export default function ImageCreator() {
  const [imagePhase, setImagePhase] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setImagePhase(1);
    }, 3000);
  }, []);

  return (
    <div className="image-wrapper">
      {imagePhase === 0 ? <Intro /> : null}
      {imagePhase === 1 ? <MakeImage /> : null}
    </div>
  );
}
