import { useEffect, useState } from 'react';
import { NavLink, Routes, Route } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  UserRound,
  Database,
  FileUp,
  ShieldCheck,
  ArrowUpRight,
  Github
} from 'lucide-react';

import api from './api';
import internships from './data/internships';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import mammoth from 'mammoth/mammoth.browser';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PROFILE_KEY = 'internlytic_student_profile';

function cleanDescription(value = '') {
  return value
    .replace(/application details will be announced soon\.?/gi, '')
    .trim();
}

function splitValues(value = '') {
  return value.split(',').map(x => x.trim()).filter(Boolean);
}

function normalizeSkill(value = '') {
  const key = String(value).toLowerCase().replace(/[^a-z0-9+#]/g, '');

  const aliases = {
    js: 'javascript',
    py: 'python',
    python3: 'python',
    ml: 'machinelearning',
    machinelearning: 'machinelearning',
    dl: 'deeplearning',
    deeplearning: 'deeplearning',
    reactjs: 'react',
    html5: 'html',
    css3: 'css',
    naturalanguageprocessing: 'nlp'
  };

  return aliases[key] || key;
}

const EXTRA_SKILLS = [
  'Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#',
  'HTML', 'CSS', 'React', 'Node.js', 'FastAPI', 'Django',
  'Flask', 'SQL', 'MongoDB', 'MySQL', 'PostgreSQL',
  'Machine Learning', 'Deep Learning', 'NLP', 'Data Analysis',
  'Data Science', 'Excel', 'Power BI', 'TensorFlow', 'PyTorch',
  'Pandas', 'NumPy', 'Artificial Intelligence', 'Neural Networks',
  'Figma', 'Wireframing', 'UI Design', 'UX Design',
  'Networking', 'Cybersecurity', 'Security Fundamentals',
  'Git', 'GitHub', 'REST API', 'Communication',
  'Problem Solving', 'Teamwork'
];

function extractSkills(text) {
  const vocabulary = [
    ...new Set([
      ...EXTRA_SKILLS,
      ...internships.flatMap(p => p.required_skills || [])
    ])
  ];

  const found = [];

  for (const skill of vocabulary) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(^|[^a-z0-9])${escaped.toLowerCase()}([^a-z0-9]|$)`,
      'i'
    );

    if (
      regex.test(text.toLowerCase()) &&
      !found.some(x => normalizeSkill(x) === normalizeSkill(skill))
    ) {
      found.push(skill);
    }
  }

  return found;
}

async function readCV(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  const buffer = await file.arrayBuffer();

  if (ext === 'pdf') {
    const pdf = await pdfjsLib.getDocument({
      data: new Uint8Array(buffer)
    }).promise;

    let text = '';

    for (let n = 1; n <= pdf.numPages; n++) {
      const page = await pdf.getPage(n);
      const content = await page.getTextContent();

      text += content.items
        .map(item => item.str || '')
        .join(' ') + ' ';
    }

    return text;
  }

  if (ext === 'docx') {
    const result = await mammoth.extractRawText({
      arrayBuffer: buffer
    });

    return result.value;
  }

  throw new Error('Please choose a PDF or DOCX file.');
}

function calculateMatches(skills, interests) {
  const skillSet = new Set(skills.map(normalizeSkill));
  const interestList = interests.map(x => x.toLowerCase());

  return internships.map(program => {
    const required = program.required_skills || [];

    const matched = required.filter(
      x => skillSet.has(normalizeSkill(x))
    );

    const missing = required.filter(
      x => !skillSet.has(normalizeSkill(x))
    );

    const skillScore = required.length
      ? matched.length / required.length * 80
      : 0;

    const searchable = [
      program.title,
      program.track,
      program.description
    ].join(' ').toLowerCase();

    const interestMatches = interestList.filter(
      x => searchable.includes(x)
    );

    const interestScore = interestList.length
      ? interestMatches.length / interestList.length * 20
      : 0;

    return {
      ...program,
      match: {
        score: Math.min(
          100,
          Math.round(skillScore + interestScore)
        ),
        matched_skills: matched,
        missing_skills: missing,
        education_eligible: null
      }
    };
  }).sort((a, b) => b.match.score - a.match.score);
}

function Layout({ children }) {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    api.get('/api/health')
      .then(() => setOnline(true))
      .catch(() => setOnline(false));
  }, []);

  return (
    <div className="shell">
      <aside>
        <div className="brand">
          <b className="logo">I</b>
          <div>
            <b>Internlytic Technologies</b>
            <small>AI &amp; CAREER INTELLIGENCE</small>
          </div>
        </div>

        <label>WORKSPACE</label>

        <nav>
          <NavLink end to="/">
            <LayoutDashboard /> Overview
          </NavLink>
          <NavLink to="/matcher">
            <Sparkles /> Find matches
          </NavLink>
          <NavLink to="/profile">
            <UserRound /> My profile
          </NavLink>
          <NavLink to="/catalogue">
            <Database /> Catalogue
          </NavLink>
        </nav>

        <div className="side-note">
          <ShieldCheck />
          <b>Transparent by design</b>
          <p>
            Every match explains the skills and criteria behind its score.
          </p>
        </div>
      </aside>

      <main>
        <header>
          <div>
            <small>YOUR CAREER, WITH CLARITY</small>
            <h1>AI Internship Matcher</h1>
          </div>

          <span className={online ? 'online' : 'offline'}>
            ● {online ? 'API connected' : 'Frontend Preview'}
          </span>
        </header>

        <section>{children}</section>

        <footer>
          © 2026 Internlytic Technologies
          <span>Built for transparent career discovery</span>
          <a
            href="https://github.com/wearrivon-cyber/AI-Internship-Matcher"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <Github size={14} />
          </a>
        </footer>
      </main>
    </div>
  );
}

function Home() {
  const tracks = [
    ['✳', 'Artificial Intelligence', 'Machine learning & intelligent systems'],
    ['⌘', 'Web Development', 'Frontend & backend engineering'],
    ['▥', 'Data & Analytics', 'Insights, Python & visualisation'],
    ['◇', 'UI / UX Design', 'Design thinking & user experience'],
    ['⌁', 'Cybersecurity', 'Security & digital protection'],
    ['✧', 'Deep Learning & NLP', 'Advanced AI technologies']
  ];

  return (
    <>
      <div className="hero hero-premium">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <Sparkles size={15} />
            INTELLIGENCE FOR YOUR NEXT MOVE
          </div>

          <h2>
            Discover your
            <br />
            <em>next big opportunity.</em>
          </h2>

          <p>
            Your skills have potential. Let intelligent matching help
            you discover opportunities, understand your strengths and
            plan your next step.
          </p>

          <div className="hero-actions">
            <NavLink className="btn" to="/matcher">
              Explore my matches <ArrowUpRight size={17} />
            </NavLink>
            <NavLink className="secondary-btn" to="/catalogue">
              Explore programmes
            </NavLink>
          </div>

          <div className="hero-trust">
            <span>✦ Explainable matching</span>
            <span>✦ Skill-gap insights</span>
            <span>✦ Career discovery</span>
          </div>
        </div>

        <div className="ai-art">
          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>

          <div className="ai-core">
            <div className="ai-core-inner">
              <Sparkles size={43} />
              <b>AI</b>
              <small>CAREER INTELLIGENCE</small>
            </div>
          </div>

          <div className="floating-card floating-top">
            <span className="floating-icon">✦</span>
            <div>
              <small>SMART MATCHING</small>
              <b>Skills aligned</b>
            </div>
          </div>

          <div className="floating-card floating-bottom">
            <div className="mini-ring">78%</div>
            <div>
              <small>PROFILE INSIGHT</small>
              <b>Illustrative score</b>
            </div>
          </div>

          <div className="art-dot dot-one"></div>
          <div className="art-dot dot-two"></div>
          <div className="art-dot dot-three"></div>
        </div>
      </div>

      <div className="trust-strip">
        <div><b>01</b><span>Build your profile</span></div>
        <div><b>02</b><span>Discover your matches</span></div>
        <div><b>03</b><span>Grow your skills</span></div>
      </div>

      <div className="section-heading">
        <div>
          <small className="eyebrow">YOUR CAREER DASHBOARD</small>
          <h2>Your workspace</h2>
          <p>Everything you need to move forward.</p>
        </div>
        <NavLink to="/profile" className="text-link">
          Complete profile <ArrowUpRight size={15} />
        </NavLink>
      </div>

      <div className="stats stats-premium">
        <article className="stat-card">
          <div className="stat-icon">▤</div>
          <small>PROGRAMME RECORDS</small>
          <b>{internships.length}</b>
          <p>Programme previews in this catalogue</p>
        </article>

        <article className="stat-card">
          <div className="stat-icon">✧</div>
          <small>MATCHING ENGINE</small>
          <b>Ready</b>
          <p>Explainable, rule-based scoring</p>
        </article>

        <article className="stat-card">
          <div className="stat-icon">↗</div>
          <small>YOUR CAREER JOURNEY</small>
          <b>3 stages</b>
          <p>Profile · Match · Improve</p>
        </article>
      </div>

      <div className="section-heading">
        <div>
          <small className="eyebrow">EXPLORE YOUR INTERESTS</small>
          <h2>Find your direction.</h2>
          <p>Explore technology and creative career tracks.</p>
        </div>
      </div>

      <div className="track-grid">
        {tracks.map(([icon, name, detail], index) => (
          <NavLink
            to="/catalogue"
            className="track-card"
            key={name}
          >
            <span className="track-number">0{index + 1}</span>
            <span className="track-symbol">{icon}</span>
            <h3>{name}</h3>
            <p>{detail}</p>
            <span className="track-arrow">↗</span>
          </NavLink>
        ))}
      </div>

      <div className="journey-panel">
        <div className="journey-intro">
          <small className="eyebrow">A CLEARER WAY FORWARD</small>
          <h2>From potential to progress.</h2>
          <p>
            A simple journey designed to help you understand where
            you stand and what to improve next.
          </p>
          <NavLink className="btn" to="/matcher">
            Start your journey <ArrowUpRight size={17} />
          </NavLink>
        </div>

        <div className="journey-steps">
          <div className="journey-step">
            <span>01</span>
            <div>
              <b>Build your profile</b>
              <p>Add your skills, education and interests.</p>
            </div>
          </div>
          <div className="journey-step">
            <span>02</span>
            <div>
              <b>Discover your matches</b>
              <p>Compare your profile with programme requirements.</p>
            </div>
          </div>
          <div className="journey-step">
            <span>03</span>
            <div>
              <b>Understand your skill gaps</b>
              <p>See what you already know and what to strengthen.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="closing-banner">
        <div>
          <small>YOUR NEXT CHAPTER STARTS HERE</small>
          <h2>Ready to discover what you can do?</h2>
          <p>Let your skills lead the way.</p>
        </div>
        <NavLink to="/matcher" className="light-btn">
          Find my matches <ArrowUpRight size={17} />
        </NavLink>
      </div>
    </>
  );
}

function Matcher() {
  const [skills, setSkills] = useState('Python, HTML, CSS, JavaScript');
  const [interests, setInterests] = useState('frontend, web development');
  const [education, setEducation] = useState('');
  const [fileName, setFileName] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleCVUpload(file) {
    setError('');
    setStatus('');
    setItems([]);

    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();

    if (!['pdf', 'docx'].includes(ext)) {
      setError('Please choose a PDF or DOCX CV file.');
      return;
    }

    setFileName(file.name);
    setBusy(true);
    setStatus('Reading your CV and extracting skills...');

    try {
      const text = await readCV(file);

      if (!text.trim()) {
        throw new Error(
          'No readable text found. Scanned PDFs may need manual skill entry.'
        );
      }

      const extracted = extractSkills(text);

      if (!extracted.length) {
        setStatus(
          'CV read, but no recognised skills were found. Please add skills manually.'
        );
      } else {
        const combined = [...splitValues(skills), ...extracted];

        const unique = [
          ...new Map(
            combined.map(x => [normalizeSkill(x), x])
          ).values()
        ];

        setSkills(unique.join(', '));
        setStatus(`${extracted.length} skills extracted. Review them below.`);
      }
    } catch (err) {
      setError(err.message || 'Unable to read this CV. Please try another file.');
      setStatus('');
    } finally {
      setBusy(false);
    }
  }

  function runMatcher() {
    setError('');
    setItems([]);

    const selected = splitValues(skills);

    if (!selected.length) {
      setError('Please enter at least one skill.');
      return;
    }

    setItems(calculateMatches(selected, splitValues(interests)));
  }

  return (
    <>
      <h2>Find your best-fit opportunities</h2>
      <p className="sub">
        Upload your CV or enter your skills manually to discover programme
        matches and understand your skill gaps.
      </p>

      <div className="columns">
        <div className="panel">
          <h3>Profile inputs</h3>

          <label className="upload">
            <FileUp />
            <b>{fileName || 'Choose CV (PDF or DOCX)'}</b>
            <p className="sub">
              Your CV is read locally in this browser. It is not uploaded
              to a server.
            </p>
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={e => handleCVUpload(e.target.files?.[0])}
              disabled={busy}
            />
          </label>

          {busy && <p className="sub">{status}</p>}
          {!busy && status && <p className="success">{status}</p>}
          {error && <p className="error">{error}</p>}

          <label>
            Skills
            <textarea
              rows="3"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="Python, HTML, CSS, JavaScript"
            />
          </label>

          <label>
            Career interests
            <input
              value={interests}
              onChange={e => setInterests(e.target.value)}
              placeholder="frontend, web development"
            />
          </label>

          <label>
            Education / qualification
            <input
              value={education}
              onChange={e => setEducation(e.target.value)}
              placeholder="e.g. BS Computer Science"
            />
          </label>

          <button className="btn" onClick={runMatcher} disabled={busy}>
            {busy ? 'Reading CV...' : 'Generate matches'} <Sparkles />
          </button>

          <p className="sub">
            Scoring: 80% skill coverage and 20% interest overlap.
            Education eligibility is not configured in this catalogue.
          </p>
        </div>

        <div>
          <div className="panel">
            <small>YOUR RESULTS</small>
            <h3>Recommendations, explained.</h3>
            <p className="sub">Higher-scoring programmes appear first.</p>
          </div>

          {items.length === 0 ? (
            <div className="empty">
              <Sparkles />
              <h3>Your matches will appear here</h3>
              <p>Add skills or upload your CV, then generate matches.</p>
            </div>
          ) : (
            items.map(program => (
              <article className="panel match" key={program.id}>
                <div className="match-head">
                  <div>
                    <small>{program.track}</small>
                    <h3>{program.title}</h3>
                    <p>
                      {program.organization} · {program.location} · {program.duration}
                    </p>
                  </div>

                  <div className="match-score">
                    <strong>{program.match.score}%</strong>
                    <small>MATCH SCORE</small>
                    <div className="match-progress">
                      <div
                        className="match-progress-fill"
                        style={{ width: `${program.match.score}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p>{cleanDescription(program.description)}</p>

                <b>Matching skills</b>
                <div>
                  {program.match.matched_skills.length
                    ? program.match.matched_skills.map(skill => (
                        <i className="good" key={skill}>{skill}</i>
                      ))
                    : <p className="sub">No required skills matched yet.</p>}
                </div>

                <b>Skills to strengthen</b>
                <div>
                  {program.match.missing_skills.length
                    ? program.match.missing_skills.map(skill => (
                        <i className="gap" key={skill}>{skill}</i>
                      ))
                    : <p className="sub">All listed required skills are covered.</p>}
                </div>

                <p>
                  Education eligibility: Not assessed in this programme preview.
                </p>

                <div className="application-status">
                  <b>Application Coming Soon</b>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </>
  );
}

const defaultProfile = {
  name: '',
  email: '',
  education: '',
  experience: '',
  skills: 'Python, HTML, CSS',
  interests: 'AI, web development'
};

function loadProfile() {
  try {
    const saved = localStorage.getItem(PROFILE_KEY);
    return saved
      ? { ...defaultProfile, ...JSON.parse(saved) }
      : { ...defaultProfile };
  } catch {
    return { ...defaultProfile };
  }
}

function Profile() {
  const [form, setForm] = useState(loadProfile);
  const [message, setMessage] = useState('');

  function updateField(key, value) {
    setForm(previous => ({ ...previous, [key]: value }));
    setMessage('');
  }

  function saveProfile(e) {
    e.preventDefault();

    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(form));
      setMessage('Profile saved successfully in this browser.');
    } catch {
      setMessage('Unable to save profile. Please check browser storage settings.');
    }
  }

  return (
    <div className="panel profile">
      <h2>Build your student profile</h2>
      <p className="sub">
        Your profile is saved in this browser on this device.
        It is not uploaded to a server.
      </p>

      <form onSubmit={saveProfile}>
        {[
          ['name', 'Full name'],
          ['email', 'Email'],
          ['education', 'Education'],
          ['experience', 'Experience / projects'],['skills', 'Skills (comma separated)'],
          ['interests', 'Interests (comma separated)']
        ].map(([key, label]) => (
          <label key={key}>
            {label}
            <input
              value={form[key]}
              onChange={e => updateField(key, e.target.value)}
            />
          </label>
        ))}

        <button className="btn" type="submit">
          Save profile
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

function Catalogue() {
  const [search, setSearch] = useState('');

  const filtered = internships.filter(program =>
    `${program.title} ${program.track}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <h2>Internship catalogue</h2>
      <p className="sub">
        Explore programme previews across different career tracks.
      </p>

      <input
        className="search"
        placeholder="Search title or track"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="catalogue">
        {filtered.map(program => (
          <article className="panel" key={program.id}>
            <small>{program.track} · PROGRAMME PREVIEW</small>
            <h3>{program.title}</h3>
            <p>{cleanDescription(program.description)}</p>
            <p>
              {program.organization} · {program.location} · {program.duration}
            </p>

            <div>
              {(program.required_skills || []).map(skill => (
                <i className="chip" key={skill}>{skill}</i>
              ))}
            </div>

            <div className="application-status">
              <b>Application Coming Soon</b>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="notice">No programmes match your search.</p>
      )}

      <p className="notice">
        These are programme previews, not confirmed live vacancies.
        Application information will be provided when available.
      </p>
    </>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matcher" element={<Matcher />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/catalogue" element={<Catalogue />} />
      </Routes>
    </Layout>
  );
}