'use client';

import { useMemo, useState } from 'react';

type Task = {
  id: string;
  title: string;
  agent: string;
  risk: 'GREEN' | 'YELLOW' | 'RED';
  status: 'QUEUED' | 'RUNNING' | 'WAITING_APPROVAL' | 'COMPLETED';
};

type MediaItem = {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
};

const seeded: Task[] = [
  { id: '1', title: 'Audit WeatherOnCue search opportunities', agent: 'SEO Agent', risk: 'GREEN', status: 'COMPLETED' },
  { id: '2', title: 'Draft book promotion campaign', agent: 'Content Agent', risk: 'GREEN', status: 'RUNNING' },
  { id: '3', title: 'Publish approved MOWVRA social post', agent: 'Media Publisher', risk: 'YELLOW', status: 'WAITING_APPROVAL' },
];

export default function Home() {
  const [autopilot, setAutopilot] = useState(true);
  const [overnight, setOvernight] = useState(false);
  const [command, setCommand] = useState('');
  const [tasks, setTasks] = useState<Task[]>(seeded);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);

  const waiting = useMemo(() => tasks.filter((t) => t.status === 'WAITING_APPROVAL').length, [tasks]);
  const completed = useMemo(() => tasks.filter((t) => t.status === 'COMPLETED').length, [tasks]);
  const active = useMemo(() => tasks.filter((t) => t.status === 'RUNNING' || t.status === 'QUEUED').length, [tasks]);

  async function runCommand() {
    if (!command.trim()) return;
    setBusy(true);
    try {
      const response = await fetch('/api/command', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ goal: command, autopilot }),
      });
      const data = await response.json();
      if (Array.isArray(data.tasks)) setTasks((old) => [...data.tasks, ...old]);
      setCommand('');
    } finally {
      setBusy(false);
    }
  }

  function handleUpload(files: FileList | null) {
    if (!files) return;
    const next = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      type: file.type.startsWith('video/') ? ('video' as const) : ('image' as const),
      url: URL.createObjectURL(file),
    }));
    setMedia((old) => [...next, ...old]);
  }

  function promote(item: MediaItem) {
    const platforms = ['Instagram', 'TikTok', 'Facebook', 'X', 'YouTube'];
    const drafts: Task[] = platforms.map((platform) => ({
      id: crypto.randomUUID(),
      title: `Prepare ${platform} draft for ${item.name}`,
      agent: 'Media Publisher',
      risk: 'GREEN',
      status: 'COMPLETED',
    }));
    const publish: Task = {
      id: crypto.randomUUID(),
      title: `Publish ${item.name} across approved platforms`,
      agent: 'Media Publisher',
      risk: 'YELLOW',
      status: 'WAITING_APPROVAL',
    };
    setTasks((old) => [publish, ...drafts, ...old]);
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brandMark">JJ</div>
        <div>
          <div className="eyebrow">AUTONOMOUS OS</div>
          <h1>CODE JJ</h1>
        </div>
        <nav>
          {['Command Center', 'Goals', 'Agents', 'Tasks', 'Approvals', 'Connections', 'Media', 'Activity', 'Memory', 'Safety'].map((item, i) => (
            <button className={i === 0 ? 'navActive' : ''} key={item}>{item}</button>
          ))}
        </nav>
        <button className="stop">STOP ALL AGENTS</button>
      </aside>

      <section className="content">
        <header>
          <div>
            <div className="eyebrow">YOUR LIFE AND BUSINESS KEEP MOVING.</div>
            <h2>Command Center</h2>
          </div>
          <div className="modeRow">
            <label className="toggleLabel"><input type="checkbox" checked={autopilot} onChange={(e) => setAutopilot(e.target.checked)} /> AUTOPILOT</label>
            <label className="toggleLabel"><input type="checkbox" checked={overnight} onChange={(e) => setOvernight(e.target.checked)} /> OVERNIGHT</label>
          </div>
        </header>

        <div className="stats">
          <Stat label="Agents Working" value={String(active)} />
          <Stat label="Tasks Completed" value={String(completed)} />
          <Stat label="Waiting Approval" value={String(waiting)} highlight />
          <Stat label="AI Cost Today" value="$0.00" />
        </div>

        <section className="commandCard panel">
          <div className="eyebrow">EXECUTIVE AGENT</div>
          <textarea value={command} onChange={(e) => setCommand(e.target.value)} placeholder="What do you want accomplished?" />
          <div className="commandActions">
            <span className="demoBadge">SIMULATION MODE</span>
            <button className="primary" onClick={runCommand} disabled={busy}>{busy ? 'Planning…' : 'Run Goal'}</button>
          </div>
        </section>

        <div className="gridTwo">
          <section className="panel">
            <div className="sectionTitle"><div><span className="eyebrow">LIVE QUEUE</span><h3>Agent Work</h3></div><span>{tasks.length} tasks</span></div>
            <div className="taskList">
              {tasks.slice(0, 8).map((task) => (
                <article className="task" key={task.id}>
                  <div>
                    <strong>{task.title}</strong>
                    <small>{task.agent}</small>
                  </div>
                  <div className="chips"><span className={`risk ${task.risk.toLowerCase()}`}>{task.risk}</span><span className="status">{task.status.replace('_', ' ')}</span></div>
                </article>
              ))}
            </div>
          </section>

          <section className="panel">
            <div className="sectionTitle"><div><span className="eyebrow">MEDIA PUBLISHER</span><h3>Upload Once. Use Everywhere.</h3></div></div>
            <label className="dropzone">
              <input type="file" accept="image/*,video/*" multiple onChange={(e) => handleUpload(e.target.files)} />
              <strong>Upload images or video</strong>
              <span>Local preview only for this prototype</span>
            </label>
            <div className="mediaGrid">
              {media.map((item) => (
                <article className="mediaCard" key={item.id}>
                  {item.type === 'image' ? <img src={item.url} alt={item.name} /> : <video src={item.url} muted />}
                  <div><strong>{item.name}</strong><button onClick={() => promote(item)}>Promote Everywhere</button></div>
                </article>
              ))}
              {!media.length && <div className="empty">No uploads yet. Add a poster, image, or video to test the Media Publisher.</div>}
            </div>
          </section>
        </div>

        <section className="panel morning">
          <div><span className="eyebrow">MORNING BRIEFING</span><h3>{overnight ? 'Overnight Mode armed' : 'Overnight Mode is off'}</h3></div>
          <p>{overnight ? 'CODE JJ will only execute permitted GREEN actions. YELLOW and RED actions wait for your approval.' : 'Turn on Overnight Mode when you want CODE JJ to keep permitted work moving while you are away.'}</p>
        </section>
      </section>
    </main>
  );
}

function Stat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return <div className={`stat panel ${highlight ? 'highlight' : ''}`}><span>{label}</span><strong>{value}</strong></div>;
}
