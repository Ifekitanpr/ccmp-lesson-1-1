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
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useLessonAudio } from "../../shared/useLessonAudio";
import { lesson } from "./lesson-data";
import everydayChange from "./assets/illustrations/everyday-change.webp";
import humanTransition from "./assets/illustrations/human-transition.webp";
import supportingChange from "./assets/illustrations/supporting-change.webp";
import leadingChange from "./assets/illustrations/leading-change.webp";
import "./styles.css";

const transition = { duration: 0.34, ease: [0.22, 1, 0.36, 1] };

function Header({ current, completed, soundOn, onSound, onOutline }) {
  return (
    <header className="topbar">
      <button className="course-button" type="button" onClick={onOutline}>
        <BookOpen />
        <span>Certified Change Management Professional</span>
      </button>
      <div className="progress-dots" aria-label={`Section ${current + 1} of ${lesson.tabs.length}`}>
        {lesson.tabs.map((tab, index) => (
          <span key={tab} className={`progress-dot ${index === current ? "active" : ""} ${completed[index] ? "done" : ""}`}>
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

function OpeningScreen({ complete, onComplete }) {
  const [example, setExample] = useState(0);
  const [revealed, setRevealed] = useState(complete);
  const atLast = example === lesson.opening.examples.length - 1;

  const advance = () => {
    if (!atLast) setExample((value) => value + 1);
    else {
      setRevealed(true);
      onComplete();
    }
  };

  return (
    <div className="opening-layout">
      <div className="opening-copy">
        <h1>{lesson.opening.heading}</h1>
        <p className="lead">{lesson.opening.subheading}</p>
        <AnimatePresence mode="wait">
          <motion.div className="example-focus" key={example} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} transition={transition}>
            <span>{example + 1} of {lesson.opening.examples.length}</span>
            <strong>{lesson.opening.examples[example]}</strong>
          </motion.div>
        </AnimatePresence>
        {!revealed ? (
          <button className="primary-cta" type="button" onClick={advance}>
            {atLast ? "See what happened" : "Another example"}<ArrowRight />
          </button>
        ) : (
          <motion.div className="opening-reveal" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
            <div className="experience-sequence">
              {lesson.opening.sequence.map((line) => <p key={line}>{line}</p>)}
            </div>
            <div className="opening-conclusion">
              <p>{lesson.opening.conclusion[0]}</p>
              <strong>{lesson.opening.conclusion[1]}</strong>
            </div>
          </motion.div>
        )}
      </div>
      <motion.img src={everydayChange} alt="A learner thinking through changes to an app, school system, workplace process, and team role" initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={transition} />
    </div>
  );
}

function ExperienceScreen({ complete, onComplete }) {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(complete);
  const stage = lesson.experience.stages[active];
  const atLast = active === lesson.experience.stages.length - 1;

  const advance = () => {
    if (!atLast) setActive((value) => value + 1);
    else {
      setRevealed(true);
      onComplete();
    }
  };

  return (
    <div className="experience-screen">
      <div className="section-intro">
        <div>
          <h1>{lesson.experience.heading}</h1>
          <p>{lesson.experience.intro}</p>
        </div>
        <img src={humanTransition} alt="One person moving from awareness and reaction through adjustment to adoption" />
      </div>
      <div className="stage-explorer">
        <div className="stage-rail" role="tablist" aria-label="Invisible elements of change">
          {lesson.experience.stages.map((item, index) => (
            <button key={item.title} type="button" role="tab" aria-selected={active === index} className={`${active === index ? "active" : ""} ${index < active || revealed ? "seen" : ""}`} onClick={() => setActive(index)}>
              <span>{index + 1}</span><strong>{item.title}</strong>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div className="stage-focus" key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={transition}>
            <span>{stage.title}</span>
            <strong>{stage.body}</strong>
          </motion.div>
        </AnimatePresence>
        {!revealed ? (
          <button className="primary-cta" type="button" onClick={advance}>{atLast ? "See the real question" : "Next"}<ArrowRight /></button>
        ) : (
          <motion.div className="experience-question" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
            <div>{lesson.experience.bridge.map((line) => <p key={line}>{line}</p>)}</div>
            <div>
              {lesson.experience.question.slice(0, 3).map((line) => <p key={line}>{line}</p>)}
              <strong>{lesson.experience.question[3]}</strong>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ShiftScreen({ complete, onComplete }) {
  const [phase, setPhase] = useState(complete ? 2 : 0);

  const advance = () => {
    const next = Math.min(phase + 1, 2);
    setPhase(next);
    if (next === 2) onComplete();
  };

  return (
    <div className="shift-screen">
      <div className="shift-head">
        <div><h1>{lesson.shift.heading}</h1></div>
        <img src={supportingChange} alt="A change leader listening and supporting a colleague from uncertainty to confidence" />
      </div>
      <div className="shift-body">
        <div className={`shift-column ${phase === 0 ? "active" : ""}`}>
          <p>{lesson.shift.conventionalIntro}</p>
          <div className="compact-list">{lesson.shift.conventional.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
        {phase >= 1 && (
          <motion.div className={`shift-column ${phase === 1 ? "active" : ""}`} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={transition}>
            <p>{lesson.shift.deeperIntro}</p>
            <div className="deep-list">{lesson.shift.deeper.map((item) => <strong key={item}><Check />{item}</strong>)}</div>
          </motion.div>
        )}
      </div>
      {phase < 2 ? (
        <button className="primary-cta" type="button" onClick={advance}>{phase === 0 ? "Look deeper" : "Why it matters"}<ArrowRight /></button>
      ) : (
        <motion.div className="shift-proof" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
          <div className="transition-answer">
            <h2>{lesson.shift.question}</h2>
            {lesson.shift.answer.map((line) => <p key={line}>{line}</p>)}
          </div>
          <div>
            <p className="case-intro">{lesson.shift.caseStudyIntro}</p>
            <div className="case-grid">{lesson.shift.caseStudy.map((item) => <span key={item}><Check />{item}</span>)}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MindsetScreen({ complete, onComplete }) {
  const [visited, setVisited] = useState(complete ? lesson.mindset.principles.map((_, index) => index) : []);
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(complete);
  const visitedSet = useMemo(() => new Set(visited), [visited]);
  const allVisited = visited.length === lesson.mindset.principles.length;

  const choose = (index) => {
    setActive(index);
    setVisited((items) => [...new Set([...items, index])]);
  };

  const reveal = () => {
    setRevealed(true);
    onComplete();
  };

  return (
    <div className="mindset-screen">
      <div className="mindset-intro">
        <div>
          <h1>{lesson.mindset.heading}</h1>
          <p>{lesson.mindset.intro}</p>
        </div>
        <img src={leadingChange} alt="A change leader guiding an inclusive group forward with confidence and feedback" />
      </div>
      <div className="mindset-grid">
        {lesson.mindset.principles.map((principle, index) => (
          <button key={principle} type="button" className={`${active === index ? "active" : ""} ${visitedSet.has(index) ? "seen" : ""}`} onClick={() => choose(index)}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{principle}</strong>
            {visitedSet.has(index) ? <Check /> : <ChevronRight />}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div className="mindset-focus" key={active} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={transition}>
          <strong>{lesson.mindset.principles[active]}</strong>
        </motion.div>
      </AnimatePresence>
      {!revealed && allVisited && <button className="primary-cta" type="button" onClick={reveal}>Continue <ArrowRight /></button>}
      {revealed && (
        <motion.div className="final-thought" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={transition}>
          {lesson.mindset.conclusion.map((line, index) => index === lesson.mindset.conclusion.length - 1 ? <strong key={line}>{line}</strong> : <p key={line}>{line}</p>)}
        </motion.div>
      )}
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
  const [lessonComplete, setLessonComplete] = useState(false);
  useLessonAudio(soundOn);

  const markComplete = (index = current) => setCompleted((items) => items.map((item, itemIndex) => itemIndex === index ? true : item));
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
              {current === 0 && <OpeningScreen complete={completed[0]} onComplete={() => markComplete(0)} />}
              {current === 1 && <ExperienceScreen complete={completed[1]} onComplete={() => markComplete(1)} />}
              {current === 2 && <ShiftScreen complete={completed[2]} onComplete={() => markComplete(2)} />}
              {current === 3 && <MindsetScreen complete={completed[3]} onComplete={() => markComplete(3)} />}
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
