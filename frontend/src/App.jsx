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

function cleanDescription(description = '') {
  return description
    .replace(/application details will be announced soon\.?/gi, '')
    .trim();
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
            ● {online ? 'API connected' : 'API offline'}
          </span>
        </header>

        <section>{children}</section>

        <footer>
          © 2026 Internlytic Technologies
          <span>Built for transparent career discovery</span>
          <a href="https://github.com/" target="_blank" rel="noreferrer">
            GitHub <Github size={14} />
          </a>
        </footer>
      </main>
    </div>
  );
}

function Home() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    api.get('/api/catalogue')
      .then(response => setCount(response.data.length))
      .catch(() => {});
  }, []);

  const tracks = [
    { icon: '✳', name: 'Artificial Intelligence', detail: 'Machine learning & intelligent systems' },
    { icon: '⌘', name: 'Web Development', detail: 'Frontend & backend engineering' },
    { icon: '▥', name: 'Data & Analytics', detail: 'Insights, Python & visualisation' },
    { icon: '◇', name: 'UI / UX Design', detail: 'Design thinking & user experience' },
    { icon: '⌁', name: 'Cybersecurity', detail: 'Security & digital protection' },
    { icon: '✧', name: 'Deep Learning & NLP', detail: 'Advanced AI technologies' }
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
            Your skills have potential. Let intelligent
            matching help you discover opportunities,
            understand your strengths and plan your next step.
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
              <b>Strong potential</b>
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
          <b>{count}</b>
          <p>Available in your local catalogue</p>
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
        {tracks.map((track, index) => (
          <NavLink
            to="/catalogue"
            className="track-card"
            key={track.name}
          >
            <span className="track-number">0{index + 1}</span>
            <span className="track-symbol">{track.icon}</span>
            <h3>{track.name}</h3>
            <p>{track.detail}</p>
            <span className="track-arrow">↗</span>
          </NavLink>
        ))}
      </div>

      <div className="journey-panel">
        <div className="journey-intro">
          <small className="eyebrow">A CLEARER WAY FORWARD</small>
          <h2>From potential to progress.</h2>
          <p>
            A simple journey designed to help you understand
            where you stand and what to improve next.
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
  const [file, setFile] = useState(null);
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function runMatcher() {
    setBusy(true);
    setError('');
    setItems([]);

    try {
      let selectedSkills = skills
        .split(',')
        .map(x => x.trim())
        .filter(Boolean);

      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        const parsed = await api.post('/api/parse-cv', formData);

        selectedSkills = [
          ...new Set([...selectedSkills, ...parsed.data.skills])
        ];

        setSkills(selectedSkills.join(', '));
      }

      const response = await api.post('/api/matches', {
        skills: selectedSkills,
        interests: interests.split(',').map(x => x.trim()).filter(Boolean),
        education
      });

      setItems(response.data.matches || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        'Unable to generate matches. Please check the backend.'
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <h2>Find your best-fit opportunities</h2>
      <p className="sub">
        Upload a CV or enter skills manually. Your CV is processed temporarily and not saved.
      </p>

      <div className="columns">
        <div className="panel">
          <h3>Profile inputs</h3>

          <label className="upload">
            <FileUp />
            <b>{file ? file.name : 'Choose CV (PDF, DOCX, TXT)'}</b>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={e => setFile(e.target.files[0] || null)}
            />
          </label>

          <label>
            Skills
            <textarea
              rows="3"
              value={skills}
              onChange={e => setSkills(e.target.value)}
            />
          </label>

          <label>
            Career interests
            <input
              value={interests}
              onChange={e => setInterests(e.target.value)}
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

          <button className="btn" disabled={busy} onClick={runMatcher}>
            {busy ? 'Analysing…' : 'Generate matches'}
            <Sparkles />
          </button>

          {error && <p className="error">{error}</p>}
        </div>

        <div>
          <div className="panel">
            <small>YOUR RESULTS</small>
            <h3>Recommendations, explained.</h3>
            <p className="sub">
              Scores are based on skill coverage and interest overlap.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="empty">
              <Sparkles />
              <h3>Your matches will appear here</h3>
              <p>Add skills and run the matcher.</p>
            </div>
          ) : (
            items.map(program => (
              <article className="panel match" key={program.id}>
                <div className="match-head">
                  <div>
                    <small>{program.track}</small>
                    <h3>{program.title}</h3>
                    <p>
                      {program.organization} · {program.work_mode} · {program.duration}
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
                  {program.match.matched_skills.map(skill => (
                    <i className="good" key={skill}>{skill}</i>
                  ))}
                </div>

                <b>Skills to strengthen</b>
                <div>
                  {program.match.missing_skills.map(skill => (
                    <i className="gap" key={skill}>{skill}</i>
                  ))}
                </div>

                <p>
                  Eligibility: {program.match.education_eligible
                    ? 'Meets stated education rule'
                    : 'Review education rule'}
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

function Profile() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    education: '',
    experience: '',
    skills: 'Python, HTML, CSS',
    interests: 'AI, web development'
  });

  const [message, setMessage] = useState('');

  function updateField(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function saveProfile(e) {
    e.preventDefault();

    try {
      const response = await api.post('/api/profiles', {
        ...form,
        skills: form.skills.split(',').map(x => x.trim()).filter(Boolean),
        interests: form.interests.split(',').map(x => x.trim()).filter(Boolean)
      });

      setMessage('Profile saved. ID: ' + response.data.id);
    } catch {
      setMessage('Backend connection error.');
    }
  }

  return (
    <div className="panel profile">
      <h2>Build your student profile</h2>
      <p className="sub">
        Save profile data to the local SQLite database.
      </p>

      <form onSubmit={saveProfile}>
        {[
          ['name', 'Full name'],
          ['email', 'Email'],
          ['education', 'Education'],
          ['experience', 'Experience / projects'],
          ['skills', 'Skills (comma separated)'],
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

        <button className="btn">Save profile</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

function Catalogue() {
  const [programs, setPrograms] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/api/catalogue')
      .then(response => setPrograms(response.data))
      .catch(() => {});
  }, []);

  const filtered = programs.filter(program =>
    (program.title + ' ' + program.track)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <h2>Internship catalogue</h2>
      <p className="sub">
        Browse programme records loaded in this app.
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
            <small>
              {program.track} · {program.verified ? 'VERIFIED' : 'PROGRAMME PREVIEW'}
            </small>

            <h3>{program.title}</h3>
            <p>{cleanDescription(program.description)}</p>
            <p>{program.location} · {program.duration}</p>

            <div>
              {program.required_skills.map(skill => (
                <i className="chip" key={skill}>{skill}</i>
              ))}
            </div>

            <div className="application-status">
              <b>Application Coming Soon</b>
            </div>
          </article>
        ))}
      </div>

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