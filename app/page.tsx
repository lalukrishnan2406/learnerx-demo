'use client';
import React, { useEffect, useMemo, useState } from "react";

const templates = {
  sales: {
    title: "Enterprise Sales Simulation",
    category: "Sales Enablement",
    level: "Intermediate",
    learnerGoal: "Discover needs, handle objections, and position business value.",
    avatarName: "Priya Menon",
    avatarRole: "Skeptical Head of L&D",
    opening: "I already have an LMS. Why should I spend budget on another learning platform?",
    directAnswer: "Acknowledge the current LMS, ask about measurable business outcomes, then connect the solution to skill visibility, manager reporting, and performance impact.",
    socraticHint: "Before pitching, what question would help you uncover the buyer's real business problem?",
    sampleContext: `Product: LearnPro Enterprise is an AI-enabled corporate learning platform.
Ideal buyer: Head of L&D in a 5,000+ employee organization.
Core value: Improve completion, engagement, skill visibility, and business impact reporting.
Common objection: We already have an LMS.
Guidance: Do not attack the existing LMS. Ask about measurement gaps, personalization, skills data, and manager visibility.`
  },
  interview: {
    title: "Interview Practice Simulation",
    category: "Career Readiness",
    level: "Beginner",
    learnerGoal: "Answer behavioral questions with structure, clarity, and evidence.",
    avatarName: "David Lee",
    avatarRole: "VP Customer Success",
    opening: "Tell me about a time you handled an unhappy enterprise client.",
    directAnswer: "Use STAR: situation, task, action, result. Include stakeholder management and measurable impact.",
    socraticHint: "Which part of STAR is weakest in your answer: situation, task, action, or result?",
    sampleContext: `Role: Senior Customer Success Manager.
Key competencies: executive communication, retention strategy, escalation management, product adoption, commercial awareness.
Strong answer includes customer context, severity, stakeholders, action plan, measurable result, and learning.`
  },
  sop: {
    title: "Manufacturing SOP Simulation",
    category: "Operations Training",
    level: "Advanced",
    learnerGoal: "Apply SOP steps correctly during an operational incident.",
    avatarName: "Anita Rao",
    avatarRole: "Plant Quality Lead",
    opening: "A batch has failed visual inspection. What is your immediate next step?",
    directAnswer: "Quarantine the batch, stop movement, document the issue, notify quality, and follow escalation rules.",
    socraticHint: "What must happen before root-cause analysis: containment, documentation, or escalation?",
    sampleContext: `SOP: Visual inspection failure response.
Step 1: Stop further movement of the affected batch.
Step 2: Quarantine and label the batch as Hold for QA Review.
Step 3: Record batch number, timestamp, line operator, and visible defect type.
Step 4: Notify Quality Lead and Production Supervisor.`
  }
};

const customTemplate = {
  title: "Custom Simulation",
  category: "Custom",
  level: "Draft",
  learnerGoal: "Define what the learner should practice or demonstrate.",
  avatarName: "AI Persona",
  avatarRole: "Role defined by trainer",
  opening: "Write the first message the AI character should say to the learner.",
  directAnswer: "The tutor will give a direct answer based on the uploaded or pasted context.",
  socraticHint: "The tutor will ask guiding questions based on the learner goal and context.",
  sampleContext: "Paste your training content, SOP, product information, policy, course notes, rubric, or scenario background here."
};

const feedback = [
  { label: "Discovery", score: 84, note: "You opened with a useful question before pitching." },
  { label: "Context Use", score: 78, note: "Good alignment, but add one specific business outcome." },
  { label: "Communication", score: 91, note: "Clear, professional, and learner-friendly." },
  { label: "Next Step", score: 73, note: "Close with a stronger commitment or follow-up action." }
];

function Button({ children, onClick, variant = "dark", className = "", type = "button" }) {
  const styles = {
    dark: "bg-zinc-950 text-white hover:bg-zinc-800 shadow-lg shadow-zinc-950/10",
    violet: "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-600/20",
    glass: "bg-white/75 text-zinc-900 border border-white/70 hover:bg-white shadow-sm backdrop-blur",
    ghost: "bg-transparent text-zinc-600 hover:bg-zinc-100",
    soft: "bg-violet-50 text-violet-700 hover:bg-violet-100"
  };
  return <button type={type} onClick={onClick} className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 ${styles[variant]} ${className}`}>{children}</button>;
}

function Card({ children, className = "" }) {
  return <section className={`rounded-[2rem] border border-white/70 bg-white/80 shadow-xl shadow-zinc-950/[0.04] backdrop-blur-xl ${className}`}>{children}</section>;
}

function Badge({ children, tone = "neutral" }) {
  const tones = {
    neutral: "bg-zinc-100 text-zinc-600",
    dark: "bg-zinc-950 text-white",
    violet: "bg-violet-100 text-violet-700",
    green: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700"
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${tones[tone]}`}>{children}</span>;
}

function Field({ label, value = "", type = "text", placeholder = "" }) {
  return (
    <div>
      <label className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">{label}</label>
      <input type={type} defaultValue={value} placeholder={placeholder} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
    </div>
  );
}

function Editable({ label, value, onChange }) {
  return (
    <div>
      <label className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100" />
    </div>
  );
}

function ThinkingDots() {
  return <div className="flex gap-1"><span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400" /><span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:120ms]" /><span className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:240ms]" /></div>;
}

function AuthScreen({ setUser }) {
  const [role, setRole] = useState("trainer");

  const enter = () => {
    setUser({
      name: role === "trainer" ? "New Trainer" : "New Learner",
      email: role === "trainer" ? "trainer@company.com" : "learner@company.com",
      role,
      org: "Demo Workspace"
    });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f3ff] text-zinc-950">
      <div className="absolute left-[-10rem] top-[-10rem] h-80 w-80 rounded-full bg-violet-300/50 blur-3xl" />
      <div className="absolute bottom-[-12rem] right-[-8rem] h-96 w-96 rounded-full bg-fuchsia-300/40 blur-3xl" />
      <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-8 px-4 py-8 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
        <div className="order-2 lg:order-1">
          <Badge tone="violet">AI simulation studio</Badge>
          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.95] tracking-[-0.05em] md:text-7xl">Practice skills in realistic AI conversations.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600">Sign in with your organization or continue with email. No separate registration step needed.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {["Trainer", "Learner", "AI Coach"].map((title) => (
              <div key={title} className="rounded-3xl border border-white/70 bg-white/65 p-5 shadow-sm backdrop-blur-xl">
                <div className="text-sm font-black text-zinc-950">{title}</div>
                <div className="mt-1 text-xs font-semibold text-zinc-500">{title === "Trainer" ? "Build simulations" : title === "Learner" ? "Practice or get help" : "Feedback + scoring"}</div>
              </div>
            ))}
          </div>
        </div>

        <Card className="order-1 overflow-hidden lg:order-2">
          <div className="border-b border-zinc-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-sm font-black text-white">LX</div>
                <div><div className="font-black tracking-tight">LearnerX</div><div className="text-xs font-semibold text-zinc-500">SSO or email</div></div>
              </div>
              <Badge tone="green">Live demo</Badge>
            </div>
          </div>

          <div className="space-y-5 p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <Button variant="glass" className="w-full">Continue with Google</Button>
              <Button variant="glass" className="w-full">Continue with Microsoft</Button>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold text-zinc-400"><div className="h-px flex-1 bg-zinc-200" /> OR <div className="h-px flex-1 bg-zinc-200" /></div>

            <Field label="Email" placeholder="name@company.com" />
            <Field label="Password" type="password" placeholder="Enter password" />

            <div>
              <label className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">Continue as</label>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <RoleChoice title="Trainer" text="Create and publish simulations" active={role === "trainer"} onClick={() => setRole("trainer")} />
                <RoleChoice title="Learner" text="Practice simulations and get help" active={role === "learner"} onClick={() => setRole("learner")} />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500"><label className="flex items-center gap-2"><input type="checkbox" /> Remember me</label><span>Forgot password?</span></div>

            <Button onClick={enter} variant="violet" className="w-full py-3">Continue as {role === "trainer" ? "Trainer" : "Learner"}</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function RoleChoice({ title, text, active, onClick }) {
  return <button onClick={onClick} className={`rounded-3xl border p-4 text-left transition ${active ? "border-violet-400 bg-violet-50 shadow-lg shadow-violet-600/10" : "border-zinc-200 bg-white/70 hover:bg-white"}`}><div className="font-black">{title}</div><div className="mt-1 text-xs font-semibold text-zinc-500">{text}</div></button>;
}

function Shell({ user, setUser, children }) {
  return (
    <div className="min-h-screen bg-[#f7f5ff] text-zinc-950">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-950 text-xs font-black text-white">LX</div><div><div className="text-sm font-black">LearnerX</div><div className="hidden text-xs font-semibold text-zinc-500 sm:block">{user.role === "trainer" ? "Trainer workspace" : "Learner workspace"}</div></div></div>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><div className="text-xs font-black">{user.name}</div><div className="text-xs font-semibold text-zinc-500">{user.role}</div></div><Button variant="glass" onClick={() => setUser(null)}>Logout</Button></div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">{children}</main>
    </div>
  );
}

function TrainerDashboard({ selectedTemplate, setSelectedTemplate, scenarioName, setScenarioName, setScreen, customScenario, setCustomScenario, onPublish }) {
  const current = selectedTemplate === "custom" ? customScenario : templates[selectedTemplate];
  return (
    <div className="space-y-6">
      <Hero eyebrow="Trainer workspace" title="Design a simulation in minutes." text="Upload or paste context, shape the AI persona, define the learner task, and publish a polished practice experience." />
      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <Card className="p-5 md:p-7">
          <div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-2xl font-black tracking-tight">Simulation builder</h2><p className="mt-1 text-sm font-medium text-zinc-500">A trainer-side workflow, not visible to learners.</p></div><Badge tone="amber">Draft</Badge></div>
          <div className="grid gap-4 md:grid-cols-2">
            <BuilderStep n="1" title="Choose use case">
              {Object.entries(templates).map(([key, item]) => <button key={key} onClick={() => { setSelectedTemplate(key); setScenarioName(item.title); }} className={`mt-3 block w-full rounded-3xl border p-4 text-left transition ${selectedTemplate === key ? "border-violet-400 bg-white shadow-lg shadow-violet-600/10" : "border-zinc-200 bg-white/60 hover:bg-white"}`}><div className="flex items-center justify-between gap-2"><div className="font-black">{item.title}</div><Badge>{item.level}</Badge></div><p className="mt-1 text-xs font-semibold text-zinc-500">{item.learnerGoal}</p></button>)}
              <button onClick={() => { setSelectedTemplate("custom"); setScenarioName(customScenario.title); }} className={`mt-3 block w-full rounded-3xl border p-4 text-left transition ${selectedTemplate === "custom" ? "border-violet-400 bg-white shadow-lg shadow-violet-600/10" : "border-dashed border-violet-300 bg-violet-50/70 hover:bg-violet-50"}`}>
                <div className="flex items-center justify-between gap-2"><div className="font-black">Create your own scenario</div><Badge tone="violet">Custom</Badge></div>
                <p className="mt-1 text-xs font-semibold text-zinc-500">Start with a blank scenario, paste context, and define your own AI roleplay.</p>
              </button>
            </BuilderStep>
            <BuilderStep n="2" title="Add context">
              <div className="mt-3 rounded-3xl border-2 border-dashed border-violet-200 bg-white/70 p-4 text-center text-xs font-bold text-zinc-500">Upload document placeholder: PDF, DOCX, PPTX, SOP, policy, or product sheet</div>
              <textarea value={current.sampleContext} readOnly={selectedTemplate !== "custom"} onChange={(e) => setCustomScenario({ ...customScenario, sampleContext: e.target.value })} className="mt-3 min-h-[250px] w-full resize-none rounded-3xl border border-zinc-200 bg-white/80 p-4 text-xs leading-5 text-zinc-700 outline-none focus:ring-4 focus:ring-violet-100" />
            </BuilderStep>
            <BuilderStep n="3" title="Configure persona">
              {selectedTemplate === "custom" ? (
                <div className="mt-3 space-y-3">
                  <Editable label="Simulation name" value={customScenario.title} onChange={(value) => { setCustomScenario({ ...customScenario, title: value }); setScenarioName(value); }} />
                  <Editable label="Learner goal" value={customScenario.learnerGoal} onChange={(value) => setCustomScenario({ ...customScenario, learnerGoal: value })} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Editable label="AI persona" value={customScenario.avatarName} onChange={(value) => setCustomScenario({ ...customScenario, avatarName: value })} />
                    <Editable label="AI role" value={customScenario.avatarRole} onChange={(value) => setCustomScenario({ ...customScenario, avatarRole: value })} />
                  </div>
                  <Editable label="Opening prompt" value={customScenario.opening} onChange={(value) => setCustomScenario({ ...customScenario, opening: value })} />
                </div>
              ) : (
                <>
                  <Field label="Simulation name" value={scenarioName} />
                  <div className="mt-3 grid gap-3 sm:grid-cols-2"><Mini label="AI persona" value={current.avatarName} /><Mini label="Role" value={current.avatarRole} /></div>
                  <div className="mt-3 rounded-3xl bg-white/80 p-4 text-sm text-zinc-700">“{current.opening}”</div>
                </>
              )}
            </BuilderStep>
            <BuilderStep n="4" title="Scoring rubric">{feedback.map((item) => <div key={item.label} className="mt-3 flex items-center justify-between rounded-2xl bg-white/80 p-3"><span className="text-sm font-black">{item.label}</span><Badge tone="violet">Enabled</Badge></div>)}</BuilderStep>
          </div>
        </Card>
        <Card className="overflow-hidden"><div className="bg-zinc-950 p-6 text-white"><Badge tone="violet">Learner preview</Badge><h3 className="mt-4 text-2xl font-black">{scenarioName}</h3><p className="mt-2 text-sm text-zinc-300">{current.learnerGoal}</p></div><div className="space-y-3 p-5"><Button variant="violet" className="w-full" onClick={onPublish}>Publish simulation</Button><Button variant="glass" className="w-full" onClick={() => setScreen("learnerHub")}>Preview learner hub</Button></div></Card>
      </div>
    </div>
  );
}

function BuilderStep({ n, title, children }) {
  return <div className="rounded-[1.75rem] border border-zinc-200 bg-zinc-50/80 p-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-zinc-950 text-xs font-black text-white">{n}</div><h3 className="font-black">{title}</h3></div>{children}</div>;
}

function Mini({ label, value }) {
  return <div className="rounded-2xl bg-white/80 p-3"><div className="text-xs font-bold text-zinc-500">{label}</div><div className="font-black">{value}</div></div>;
}

function Published({ selectedTemplate, setScreen, scenarioLibrary }) {
  const current = scenarioLibrary[selectedTemplate];
  return <div className="grid gap-5 lg:grid-cols-[1fr_360px]"><Card className="p-8"><div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-100 text-3xl">✓</div><h1 className="mt-6 text-4xl font-black tracking-tight">Simulation published</h1><p className="mt-3 max-w-2xl text-zinc-600">This creates a learner assignment link and places the experience in the learner dashboard.</p><div className="mt-6 rounded-3xl bg-zinc-50 p-4 text-sm font-black text-violet-700">https://learnerx.ai/simulations/{selectedTemplate}-demo</div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button variant="glass" onClick={() => setScreen("trainer")}>Back to builder</Button><Button variant="violet" onClick={() => setScreen("learnerHub")}>Preview learner</Button></div></Card><Card className="p-6"><Badge tone="green">Live</Badge><h3 className="mt-4 text-2xl font-black">{current.title}</h3><p className="mt-2 text-sm text-zinc-500">{current.learnerGoal}</p></Card></div>;
}

function LearnerHub({ selectedTemplate, setSelectedTemplate, setScreen, learnerMode, setLearnerMode, scenarioLibrary, isPreview = false }) {
  return (
    <div className="space-y-6">
      <Hero eyebrow={isPreview ? "Learner preview" : "Learner workspace"} title={isPreview ? "Preview the learner experience." : "Choose how you want to learn."} text={isPreview ? "You are viewing this as a trainer preview. Learners will only see simulations that have been published or assigned to them." : "Use Simulation Mode when you want to practice or be assessed. Use AI Tutor Mode when you need help, explanation, or guided coaching."} />
      {isPreview && (
        <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4 text-sm font-semibold text-violet-800">
          Preview mode: this is not the trainer workspace. Use this only to check what learners will experience.
        </div>
      )}
      <Card className="p-3"><div className="grid gap-3 md:grid-cols-2"><ModeTile active={learnerMode === "simulation"} title="Simulation Mode" text="Practice roleplays, conversations, and assessments." cta="Practice" onClick={() => setLearnerMode("simulation")} /><ModeTile active={learnerMode === "tutor"} title="AI Tutor Mode" text="Ask questions, get Socratic guidance, or receive direct help." cta="Get help" onClick={() => setLearnerMode("tutor")} /></div></Card>
      <div className="grid gap-4 md:grid-cols-3">{Object.entries(scenarioLibrary).map(([key, item]) => <Card key={key} className="flex flex-col p-5"><div className="flex items-center justify-between"><Badge tone={key === selectedTemplate ? "violet" : "neutral"}>{item.category}</Badge><span className="text-xs font-black text-zinc-400">{item.level}</span></div><h3 className="mt-5 text-xl font-black">{item.title}</h3><p className="mt-2 flex-1 text-sm font-medium leading-6 text-zinc-500">{item.learnerGoal}</p><Button variant="violet" className="mt-5 w-full" onClick={() => { setSelectedTemplate(key); setScreen(learnerMode === "simulation" ? "simulation" : "tutor"); }}>Open in {learnerMode === "simulation" ? "Simulation" : "AI Tutor"}</Button></Card>)}</div>
    </div>
  );
}

function ModeTile({ active, title, text, cta, onClick }) {
  return <button onClick={onClick} className={`rounded-[1.75rem] p-5 text-left transition ${active ? "bg-zinc-950 text-white shadow-xl shadow-zinc-950/15" : "bg-zinc-50 text-zinc-950 hover:bg-white"}`}><div className="text-2xl font-black">{title}</div><p className={`mt-2 text-sm font-semibold ${active ? "text-zinc-300" : "text-zinc-500"}`}>{text}</p><div className="mt-5 text-xs font-black uppercase tracking-widest">{cta}</div></button>;
}

function SimulationMode({ selectedTemplate, setScreen, scenarioLibrary }) {
  const current = scenarioLibrary[selectedTemplate];
  const [input, setInput] = useState("I would like to understand what is not working well with your current LMS before suggesting anything.");
  const [submitted, setSubmitted] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [reply, setReply] = useState(false);
  useEffect(() => { if (!thinking) return; const timer = setTimeout(() => { setThinking(false); setReply(true); }, 1200); return () => clearTimeout(timer); }, [thinking]);
  const submit = () => { setSubmitted(true); setReply(false); setThinking(true); };
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <Card className="overflow-hidden"><div className="bg-zinc-950 p-6 text-white"><div className="flex items-center justify-between gap-4"><div><Badge tone="violet">Simulation Mode</Badge><h1 className="mt-4 text-3xl font-black">{current.title}</h1><p className="mt-2 text-sm text-zinc-300">AI Avatar: {current.avatarName}, {current.avatarRole}</p></div><div className="hidden h-20 w-20 items-center justify-center rounded-[2rem] bg-white/10 text-2xl font-black md:flex">AI</div></div></div><div className="space-y-4 p-5 md:p-7"><Bubble who={current.avatarName} text={current.opening} />{submitted && <Bubble who="You" text={input} me />}{thinking && <div className="inline-flex rounded-3xl border bg-white p-4"><ThinkingDots /></div>}{reply && <Bubble who={current.avatarName} text="That is a fair approach. Now connect your answer to the business outcome and propose the next best action." />}<div className="rounded-3xl border border-zinc-200 bg-white p-4"><label className="text-sm font-black">Your response</label><textarea value={input} onChange={(e) => setInput(e.target.value)} className="mt-2 min-h-[130px] w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm outline-none focus:ring-4 focus:ring-violet-100" /><div className="mt-3 flex flex-col gap-3 sm:flex-row"><Button variant="violet" className="flex-1" onClick={submit}>Submit response</Button><Button variant="glass" className="flex-1" onClick={() => { setSubmitted(false); setThinking(false); setReply(false); }}>Reset</Button><Button variant="ghost" className="flex-1" onClick={() => setScreen("learnerHub")}>Back</Button></div></div></div></Card>
      <div className="space-y-4"><Card className="p-5"><h3 className="font-black">Assessment</h3><p className="mt-2 text-sm text-zinc-500">This mode is for practice, roleplay, and testing. Tutor help is intentionally separate.</p></Card>{submitted && reply && <><Confidence /><SuggestedResponse /><Feedback /></>}</div>
    </div>
  );
}

function TutorMode({ selectedTemplate, setScreen, scenarioLibrary }) {
  const current = scenarioLibrary[selectedTemplate];
  const [style, setStyle] = useState("socratic");
  const [question, setQuestion] = useState("How should I respond to this customer objection?");
  const answer = style === "socratic" ? current.socraticHint : current.directAnswer;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <Card className="overflow-hidden"><div className="bg-white p-6"><Badge tone="violet">AI Tutor Mode</Badge><h1 className="mt-4 text-3xl font-black">Real-time learning help</h1><p className="mt-2 text-sm font-medium text-zinc-500">Use this when you need explanation, coaching, or guidance — separate from formal simulation practice.</p></div><div className="space-y-4 bg-zinc-50/80 p-5 md:p-7"><div className="grid grid-cols-2 rounded-2xl bg-zinc-100 p-1"><button onClick={() => setStyle("socratic")} className={`rounded-xl py-2 text-sm font-black ${style === "socratic" ? "bg-white shadow-sm" : "text-zinc-500"}`}>Socratic</button><button onClick={() => setStyle("direct")} className={`rounded-xl py-2 text-sm font-black ${style === "direct" ? "bg-white shadow-sm" : "text-zinc-500"}`}>Direct</button></div><Bubble who="You" text={question} me /><Bubble who={style === "socratic" ? "AI Socratic Coach" : "AI Direct Tutor"} text={answer} /><div className="rounded-3xl border border-zinc-200 bg-white p-4"><label className="text-sm font-black">Ask a question</label><textarea value={question} onChange={(e) => setQuestion(e.target.value)} className="mt-2 min-h-[120px] w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm outline-none focus:ring-4 focus:ring-violet-100" /><div className="mt-3 flex gap-3"><Button variant="violet" className="flex-1">Ask tutor</Button><Button variant="ghost" onClick={() => setScreen("learnerHub")}>Back</Button></div></div></div></Card>
      <Card className="p-5"><h3 className="font-black">Context-aware help</h3><p className="mt-2 text-sm leading-6 text-zinc-500">The tutor uses the same context as the simulation, but the learner controls whether they want guided questions or direct answers.</p><div className="mt-5 rounded-3xl bg-zinc-50 p-4 text-xs leading-5 text-zinc-600">{current.sampleContext}</div></Card>
    </div>
  );
}

function Bubble({ who, text, me = false }) {
  return <div className={`flex ${me ? "justify-end" : "justify-start"}`}><div className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm shadow-sm ${me ? "rounded-tr-sm bg-violet-600 text-white" : "rounded-tl-sm border border-zinc-200 bg-white text-zinc-800"}`}><div className={`mb-1 text-xs font-black ${me ? "text-violet-100" : "text-zinc-500"}`}>{who}</div>{text}</div></div>;
}

function Confidence() {
  return <Card className="p-5"><div className="flex justify-between"><span className="font-black">AI confidence</span><span className="font-black text-violet-700">87%</span></div><div className="mt-3 h-2 rounded-full bg-zinc-100"><div className="h-2 w-[87%] rounded-full bg-violet-600" /></div><p className="mt-2 text-xs font-semibold text-zinc-500">Based on context fit and rubric alignment.</p></Card>;
}

function Feedback() {
  return <Card className="p-5"><h3 className="font-black">Coaching feedback</h3><div className="mt-4 space-y-4">{feedback.map((item) => <div key={item.label}><div className="mb-1 flex justify-between text-sm"><span className="font-black">{item.label}</span><span className="font-black">{item.score}%</span></div><div className="h-2 rounded-full bg-zinc-100"><div className="h-2 rounded-full bg-violet-600" style={{ width: `${item.score}%` }} /></div><p className="mt-1 text-xs font-semibold text-zinc-500">{item.note}</p></div>)}</div></Card>;
}

function Hero({ eyebrow, title, text }) {
  return <section><Badge tone="violet">{eyebrow}</Badge><h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight tracking-[-0.04em] md:text-6xl">{title}</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-600">{text}</p></section>;
}

export default function AILearningSimulationShowcase() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("trainer");
  const [selectedTemplate, setSelectedTemplate] = useState("sales");
  const [scenarioName, setScenarioName] = useState(templates.sales.title);
  const [learnerMode, setLearnerMode] = useState("simulation");
  const [customScenario, setCustomScenario] = useState(customTemplate);
  const [publishedKeys, setPublishedKeys] = useState(["sales", "interview", "sop"]);
  const scenarioLibrary = { ...templates, custom: customScenario };
  const publishedLibrary = Object.fromEntries(publishedKeys.map((key) => [key, scenarioLibrary[key]]).filter(([, value]) => Boolean(value)));
  const publishCurrentSimulation = () => {
    setPublishedKeys((keys) => Array.from(new Set([...keys, selectedTemplate])));
    setScreen("published");
  };

  // Role-aware navigation: trainers do not get a learner workspace tab.
  // They can only access learner experience through explicit preview actions.
  const Nav = () => {
    if (user.role === "trainer") {
      return (
        <div className="flex items-center gap-2">
          <Button variant={screen === "trainer" ? "dark" : "ghost"} onClick={() => setScreen("trainer")}>Builder</Button>
          {screen === "published" && <Badge tone="green">Published</Badge>}
          {(screen === "learnerHub" || screen === "simulation" || screen === "tutor") && <Badge tone="violet">Previewing learner experience</Badge>}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Button variant={screen === "learnerHub" ? "dark" : "ghost"} onClick={() => setScreen("learnerHub")}>My learning</Button>
        {screen === "simulation" && <Badge tone="violet">Simulation</Badge>}
        {screen === "tutor" && <Badge tone="violet">AI Tutor</Badge>}
      </div>
    );
  };

  if (!user)
    return (
      <div>
        <AuthScreen
          setUser={(next) => {
            setUser(next);
            setScreen(next.role === "trainer" ? "trainer" : "learnerHub");
          }}
        />
      </div>
    );

  return (
    <Shell user={user} setUser={setUser}>
      {/* Top Navigation (major UX improvement) */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Nav />
        <div className="text-xs font-semibold text-zinc-400">{user.role === "trainer" ? "Trainer workspace" : "Learner workspace"} • Prototype v1</div>
      </div>

      {/* Empty state guidance */}
      {screen === "trainer" && user.role === "trainer" && (
        <div className="mb-6 rounded-3xl border border-dashed border-violet-300 bg-violet-50/60 p-4 text-sm text-zinc-600">
          <strong>Tip:</strong> Start with a template or create your own scenario. This is your control center for designing learning simulations.
        </div>
      )}

      {user.role === "trainer" && screen === "trainer" && (
        <TrainerDashboard
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          scenarioName={scenarioName}
          setScenarioName={setScenarioName}
          setScreen={setScreen}
          customScenario={customScenario}
          setCustomScenario={setCustomScenario}
          onPublish={publishCurrentSimulation}
        />
      )}

      {user.role === "trainer" && screen === "published" && (
        <Published
          selectedTemplate={selectedTemplate}
          setScreen={setScreen}
          scenarioLibrary={scenarioLibrary}
        />
      )}

      {screen === "learnerHub" && (
        <LearnerHub
          selectedTemplate={selectedTemplate}
          setSelectedTemplate={setSelectedTemplate}
          setScreen={setScreen}
          learnerMode={learnerMode}
          setLearnerMode={setLearnerMode}
          scenarioLibrary={user.role === "trainer" ? scenarioLibrary : publishedLibrary}
          isPreview={user.role === "trainer"}
        />
      )}

      {screen === "simulation" && (
        <SimulationMode
          selectedTemplate={selectedTemplate}
          setScreen={setScreen}
          scenarioLibrary={user.role === "trainer" ? scenarioLibrary : publishedLibrary}
        />
      )}

      {screen === "tutor" && (
        <TutorMode
          selectedTemplate={selectedTemplate}
          setScreen={setScreen}
          scenarioLibrary={user.role === "trainer" ? scenarioLibrary : publishedLibrary}
        />
      )}
    </Shell>
  );
}