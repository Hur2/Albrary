import React, { useState, useEffect } from "react";
import { MakeFront } from "../components/new/make_front";
import { MakeIntroBeforeBase } from "../components/new/make_intro_beforeBase";
import { MakeBase } from "../components/new/make_base";
import { MakeIntroBeforeText } from "../components/new/make_intro_beforeText";
import { MakeText } from "../components/new/make_text";
import { MakeIntroBeforeImage } from "../components/new/make_intro_beforeImage";
import { MakeImage } from "../components/new/make_image";
import { MakeTab } from "../components/new/make_tab";
import { MakeCircle } from "../components/new/make_circle";
import "../styles/MakeNew.css";

function Make() {
  /* 구조
    make_front => 진입 핸들러 발생 시 아래 컴포넌트 렌더링
    ========================
    make_circle
    make_tab
    ========================
    make_intro_beforeBase   / 0
    make_base               / 1
    make_intro_beforeText   / 2
    make_text               / 3
    make_intro_beforeImage  / 4
    make_image              / 5
    
    */

  const [isMaking, setIsMaking] = useState(0); // Make 내로 들어갔는지 확인 (0, 1)
  const [phase, setPhase] = useState(0); // phase
  const [progress, setProgress] = useState(0);

  if (isMaking === 0) {
    return <MakeFront setIsMaking={setIsMaking} />;
  } else {
    if (phase === 0) {
      return (
        <>
          <MakeCircle />
          <MakeTab phase={phase} progress={progress} />
          <MakeIntroBeforeBase setPhase={setPhase} />
        </>
      );
    } else if (phase === 1) {
      return (
        <>
          <MakeCircle />
          <MakeTab phase={phase} progress={progress} />
          <MakeBase setPhase={setPhase} setProgress={setProgress} />
        </>
      );
    } else if (phase === 2) {
      return (
        <>
          <MakeCircle />
          <MakeTab phase={phase} progress={progress} />
          <MakeIntroBeforeText setPhase={setPhase} />
        </>
      );
    } else if (phase === 3) {
      return (
        <>
          <MakeCircle />
          <MakeTab phase={phase} progress={progress} />
          <MakeText setPhase={setPhase} setProgress={setProgress} />
        </>
      );
    } else if (phase === 4) {
      return (
        <>
          <MakeCircle />
          <MakeTab phase={phase} progress={progress} />
          <MakeIntroBeforeImage setPhase={setPhase} setProgress={setProgress} />
        </>
      );
    } else {
      return (
        <>
          <MakeCircle />
          <MakeTab phase={phase} progress={progress} />
          <MakeImage setPhase={setPhase} setProgress={setProgress} />
        </>
      );
    }
  }
}

export default Make;
