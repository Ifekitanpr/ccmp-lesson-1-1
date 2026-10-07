import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  Menu,
  MessageCircle,
  Quote,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useLessonAudio } from "../../shared/useLessonAudio";
import { lesson } from "./lesson-data";
import hrisLaunch from "./assets/illustrations/hris-launch.webp";
import realityHits from "./assets/illustrations/reality-hits.webp";
import turningPoint from "./assets/illustrations/turning-point.webp";
import listeningSession from "./assets/illustrations/listening-session.webp";
import targetedEnablement from "./assets/illustrations/targeted-enablement.webp";
import threeMonthOutcome from "./assets/illustrations/three-month-outcome.webp";
import "./styles.css";

const images = {
  "listening-session": listeningSession,
  "targeted-enablement": targetedEnablement,
  "three-month-outcome": threeMonthOutcome,
};

const transition = { duration: 0.38, ease: [0.22, 1, 0.36, 1] };

function Header({ current, completed, soundOn, onSound, onOutline }) {
  return (
    <header className="topbar">
      <button className="course-button" type="button" onClick={onOutline}>
        <BookOpen />
        <span>Certified Change Management Professional</span>
      </button>
      <div className="progress-dots" aria-label={`Section ${current + 1} of ${lesson.tabs.length}`}>
        {lesson.tabs.map((tab, index) => (
          <span
            key={tab}
            className={`progress-dot ${index === current ? "active" : ""} ${completed[index] ? "done" : ""}`}
          >
            {completed[index] ? <Check /> : null}
          </span>
        ))}
      </div>
      <div className="top-actions">
        <button type="button" onClick={onSound}>
          {soundOn ? <Volume2 /> : <VolumeX />}
          <span>Sound {soundOn ? "on" : "off"}</span>
        </button>
        <button type="button"><X /><span>Quit</span></button>
      </div>
    </header>
  );
}

function Outline({ open, current, completed, onToggle, onSelect }) {
  if (!open) {
    return <button className="outline-trigger" type="button" onClick={onToggle} aria-label="Open lesson outline"><Menu /></button>;
  }

  return (
    <aside className="outline-panel">
      <div className="outline-head">
        <div><span>Lesson {lesson.number}</span><strong>{lesson.title}</strong></div>
        <button type="button" onClick={onToggle} aria-label="Close lesson outline"><X /></button>
      </div>
      <div className="outline-list">
        {lesson.tabs.map((tab, index) => (
          <button
            type="button"
            key={tab}
            className={index === current ? "current" : ""}
            disabled={index > 0 && !completed[index - 1]}
            onClick={() => onSelect(index)}
          >
            <span>{completed[index] ? <Check /> : index + 1}</span>
            <strong>{tab}</strong>
          </button>
        ))}
      </div>
    </aside>
  );
}

function PromiseScreen({ complete, onComplete }) {
  const [revealed, setRevealed] = useState(complete);
  const reveal = () => {
    setRevealed(true);
    onComplete();
  };

  return (
    <div className="split-screen promise-screen">
      <div className="screen-copy">
        <h1>{lesson.background.heading}</h1>
        {lesson.background.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <p className="source-lead">The promise was clear:</p>
        <div className="promise-list">
          {lesson.background.promise.map((item) => <span key={item}><Check />{item}</span>)}
        </div>
        {!revealed ? (
          <button className="primary-cta" type="button" onClick={reveal}>Follow the launch <ArrowRight /></button>
        ) : (
          <motion.div className="delivery-reveal" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
            {lesson.background.delivery.map((line) => <p key={line}>{line}</p>)}
            <strong>{lesson.background.close}</strong>
          </motion.div>
        )}
      </div>
      <motion.img className="screen-art" src={hrisLaunch} alt="Daniella presents the new HR information system to her team" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={transition} />
    </div>
  );
}

function RealityScreen({ complete, onComplete }) {
  const [signal, setSignal] = useState(0);
  const [revealed, setRevealed] = useState(complete);
  const atLastSignal = signal === lesson.reality.signals.length - 1;
  const advance = () => setSignal((value) => Math.min(value + 1, lesson.reality.signals.length - 1));
  const reveal = () => {
    setRevealed(true);
    onComplete();
  };

  return (
    <div className="reality-layout">
      <div className="reality-visual">
        <img src={realityHits} alt="Daniella notices employees avoiding the HR system and an overwhelmed support team" />
        <div className="signal-progress" aria-label={`Signal ${signal + 1} of ${lesson.reality.signals.length}`}>
          {lesson.reality.signals.map((_, index) => <span key={index} className={index <= signal ? "seen" : ""} />)}
        </div>
      </div>
      <div className="screen-copy">
        <h1>The Reality Hits</h1>
        <p>{lesson.reality.intro}</p>
        <AnimatePresence mode="wait">
          <motion.div className="signal-card" key={signal} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={transition}>
            <span>{String(signal + 1).padStart(2, "0")}</span>
            <strong>{lesson.reality.signals[signal]}</strong>
          </motion.div>
        </AnimatePresence>
        {atLastSignal && (
          <motion.div className="hallway-quotes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={transition}>
            {lesson.reality.quotes.map((quote) => <p key={quote}><Quote />{quote}</p>)}
          </motion.div>
        )}
        {!atLastSignal ? (
          <button className="primary-cta" type="button" onClick={advance}>Next signal <ArrowRight /></button>
        ) : !revealed ? (
          <button className="primary-cta" type="button" onClick={reveal}>What Daniella realized <ArrowRight /></button>
        ) : (
          <motion.div className="realization" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
            <span>Daniella realizes something critical:</span>
            <strong>{lesson.reality.realization}</strong>
            <p>{lesson.reality.risk}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function PrincipleDrawer({ principle, onClose, onRead }) {
  useEffect(() => {
    const escape = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", escape);
    return () => window.removeEventListener("keydown", escape);
  }, [onClose]);

  return createPortal(
    <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <motion.aside className="principle-drawer" role="dialog" aria-modal="true" aria-labelledby="principle-title" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={transition}>
        <button className="close-button" type="button" onClick={onClose} aria-label="Close"><X /></button>
        <img src={images[principle.image]} alt="" />
        <h2 id="principle-title">{principle.title}</h2>
        {principle.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        {principle.quote && <blockquote>{principle.quote}</blockquote>}
        {principle.bullets && <ul>{principle.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
        <p className="drawer-close-copy">{principle.close}</p>
        <button className="primary-cta" type="button" onClick={() => { onRead(); onClose(); }}>Done <Check /></button>
      </motion.aside>
    </motion.div>,
    document.body,
  );
}

function ResponseScreen({ visited, onVisit }) {
  const [active, setActive] = useState(null);
  return (
    <div className="response-screen">
      <div className="response-intro">
        <div>
          <h1>Daniella’s Turning Point</h1>
          {lesson.turningPoint.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <blockquote>{lesson.turningPoint.quote}</blockquote>
          <p>{lesson.turningPoint.bridge}</p>
          <p>{lesson.turningPoint.instruction}</p>
        </div>
        <img src={turningPoint} alt="Daniella reframes the HRIS challenge from a system problem to a people transition problem" />
      </div>
      <div className="principle-heading">
        <h2>The Change Management Response</h2>
        <span>{visited.size} of {lesson.principles.length} explored</span>
      </div>
      <div className="principle-grid">
        {lesson.principles.map((principle, index) => (
          <button className={visited.has(index) ? "read" : ""} type="button" key={principle.title} onClick={() => setActive(index)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{principle.title}</strong>
            {visited.has(index) ? <Check /> : <ChevronRight />}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {active !== null && <PrincipleDrawer principle={lesson.principles[active]} onClose={() => setActive(null)} onRead={() => onVisit(active)} />}
      </AnimatePresence>
    </div>
  );
}

function OutcomeScreen({ complete, onComplete }) {
  const [result, setResult] = useState(0);
  const [reflected, setReflected] = useState(complete);
  const atLast = result === lesson.outcome.results.length - 1;
  const revealReflection = () => {
    setReflected(true);
    onComplete();
  };

  return (
    <div className="outcome-screen">
      <div className="outcome-copy">
        <span className="time-chip">3 Months Later</span>
        <h1>{lesson.outcome.heading}</h1>
        <div className="result-window">
          <AnimatePresence mode="wait">
            <motion.div key={result} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={transition}>
              <span>{String(result + 1).padStart(2, "0")}</span>
              <strong>{lesson.outcome.results[result]}</strong>
            </motion.div>
          </AnimatePresence>
          <div className="result-dots">{lesson.outcome.results.map((_, index) => <span key={index} className={index <= result ? "seen" : ""} />)}</div>
        </div>
        {!atLast ? (
          <button className="primary-cta" type="button" onClick={() => setResult((value) => value + 1)}>Next result <ArrowRight /></button>
        ) : !reflected ? (
          <button className="primary-cta" type="button" onClick={revealReflection}>Hear Daniella reflect <ArrowRight /></button>
        ) : (
          <motion.div className="outcome-reflection" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
            <p>And Daniella reflects:</p>
            <blockquote>{lesson.outcome.reflection}</blockquote>
          </motion.div>
        )}
      </div>
      <img src={threeMonthOutcome} alt="Daniella and her team comfortably using the HR system three months later" />
    </div>
  );
}

function InsightScreen({ visited, onVisit }) {
  const [active, setActive] = useState(0);
  return (
    <div className="insight-screen">
      <div className="insight-statement">
        <div>
          <h1>{lesson.insight.heading}</h1>
          <p>{lesson.insight.intro}</p>
          <strong>{lesson.insight.statement}</strong>
        </div>
        <img src={turningPoint} alt="Daniella connects system delivery with people moving forward" />
      </div>
      <div className="discussion-layout">
        <div>
          <h2>{lesson.insight.discussionHeading}</h2>
          <div className="discussion-list">
            {lesson.insight.questions.map((question, index) => (
              <button type="button" key={question} className={`${active === index ? "active" : ""} ${visited.has(index) ? "read" : ""}`} onClick={() => { setActive(index); onVisit(index); }}>
                <span>{index + 1}</span><strong>{question}</strong>{visited.has(index) ? <Check /> : <ChevronRight />}
              </button>
            ))}
          </div>
        </div>
        <motion.div className="discussion-focus" key={active} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={transition}>
          <MessageCircle />
          <p>{lesson.insight.questions[active]}</p>
          <span>{lesson.insight.close}</span>
        </motion.div>
      </div>
    </div>
  );
}

function CompletionModal({ onClose }) {
  return createPortal(
    <motion.div className="completion-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.section className="completion-modal" role="dialog" aria-modal="true" aria-labelledby="complete-title" initial={{ opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={transition}>
        <span className="completion-mark"><Check /></span>
        <h2 id="complete-title">Lesson complete</h2>
        <p>{lesson.title}</p>
        <button className="primary-cta" type="button" onClick={onClose}>Done <Check /></button>
      </motion.section>
    </motion.div>,
    document.body,
  );
}

function App() {
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState(Array(lesson.tabs.length).fill(false));
  const [outlineOpen, setOutlineOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [principlesVisited, setPrinciplesVisited] = useState([]);
  const [questionsVisited, setQuestionsVisited] = useState([]);
  const [lessonComplete, setLessonComplete] = useState(false);
  useLessonAudio(soundOn);

  const principleSet = useMemo(() => new Set(principlesVisited), [principlesVisited]);
  const questionSet = useMemo(() => new Set(questionsVisited), [questionsVisited]);
  const markComplete = (index = current) => setCompleted((items) => items.map((item, itemIndex) => itemIndex === index ? true : item));
  const visitPrinciple = (index) => setPrinciplesVisited((items) => {
    const next = [...new Set([...items, index])];
    if (next.length === lesson.principles.length) markComplete(2);
    return next;
  });
  const visitQuestion = (index) => setQuestionsVisited((items) => {
    const next = [...new Set([...items, index])];
    if (next.length === lesson.insight.questions.length) markComplete(4);
    return next;
  });
  const goTo = (index) => {
    if (index < 0 || index >= lesson.tabs.length) return;
    if (index > 0 && !completed[index - 1]) return;
    setCurrent(index);
    setOutlineOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const next = () => {
    if (!completed[current]) return;
    if (current === lesson.tabs.length - 1) setLessonComplete(true);
    else goTo(current + 1);
  };

  return (
    <div className="app-shell">
      <Header current={current} completed={completed} soundOn={soundOn} onSound={() => setSoundOn((value) => !value)} onOutline={() => setOutlineOpen((value) => !value)} />
      <main className="workspace">
        <div className="lesson-stage">
          <Outline open={outlineOpen} current={current} completed={completed} onToggle={() => setOutlineOpen((value) => !value)} onSelect={goTo} />
          <article className="lesson-card">
            <div className="section-meta"><span>SECTION {current + 1} OF {lesson.tabs.length}</span></div>
            <nav className="section-tabs" aria-label="Lesson sections">
              {lesson.tabs.map((tab, index) => (
                <button type="button" key={tab} className={`${current === index ? "active" : ""} ${completed[index] ? "done" : ""}`} disabled={index > 0 && !completed[index - 1]} onClick={() => goTo(index)}>
                  {completed[index] ? <Check /> : null}<span>{tab}</span>
                </button>
              ))}
            </nav>
            <section className="lesson-content">
              {current === 0 && <PromiseScreen complete={completed[0]} onComplete={() => markComplete(0)} />}
              {current === 1 && <RealityScreen complete={completed[1]} onComplete={() => markComplete(1)} />}
              {current === 2 && <ResponseScreen visited={principleSet} onVisit={visitPrinciple} />}
              {current === 3 && <OutcomeScreen complete={completed[3]} onComplete={() => markComplete(3)} />}
              {current === 4 && <InsightScreen visited={questionSet} onVisit={visitQuestion} />}
            </section>
            <footer className="lesson-footer">
              <button className="secondary-button" type="button" disabled={current === 0} onClick={() => goTo(current - 1)}><ArrowLeft /> Previous</button>
              <div className="footer-status">{completed[current] ? <><Check /> Section explored</> : <span>Complete the interaction to continue</span>}</div>
              <button className="next-button" type="button" disabled={!completed[current]} onClick={next}>{current === lesson.tabs.length - 1 ? "Complete lesson" : "Continue"}<ArrowRight /></button>
            </footer>
          </article>
        </div>
      </main>
      <AnimatePresence>{lessonComplete && <CompletionModal onClose={() => setLessonComplete(false)} />}</AnimatePresence>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
