import { useRef, useState } from 'react'
import { DAYS, EX_BY_ID, HOW, SETS, TARGET_REPS, type Exercise } from './data'
import {
  blankSets, finishDay, hitTarget, initialState, isEmpty, progressFor, useAppState,
  type SetEntry, type State,
} from './store'

type View = 'log' | 'history' | 'backup'

export default function App() {
  const [state, setState] = useAppState()
  const [view, setView] = useState<View>('log')
  const [progressId, setProgressId] = useState<string | null>(null)

  return (
    <>
      <main className="wrap">
        {view === 'log' && <LogView state={state} setState={setState} onProgress={setProgressId} />}
        {view === 'history' && <HistoryView state={state} setState={setState} />}
        {view === 'backup' && <BackupView state={state} setState={setState} />}
      </main>
      <nav className="nav">
        {(['log', 'history', 'backup'] as View[]).map(v => (
          <button key={v} type="button" aria-current={view === v} onClick={() => setView(v)}>
            {v === 'log' ? 'Workout' : v === 'history' ? 'History' : 'Backup'}
          </button>
        ))}
      </nav>
      {progressId && <ProgressSheet state={state} exId={progressId} onClose={() => setProgressId(null)} />}
    </>
  )
}

/* ---------- Workout ---------- */

type SetState = React.Dispatch<React.SetStateAction<State>>

function LogView({ state, setState, onProgress }: { state: State; setState: SetState; onProgress: (id: string) => void }) {
  const day = DAYS[state.day]
  const [msg, setMsg] = useState('')
  const [confirming, setConfirming] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const finish = () => {
    if (!confirming) {
      setConfirming(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setConfirming(false), 4000)
      return
    }
    setConfirming(false)
    const { next, logged } = finishDay(state)
    if (!logged) { setMsg('Nothing logged on this day yet.'); return }
    setState(next)
    window.scrollTo({ top: 0 })
    setMsg(`Saved ${logged} exercise${logged > 1 ? 's' : ''}. Up next: Day ${next.day + 1}, ${DAYS[next.day].title}.`)
  }

  return (
    <>
      <header>
        <h1>Five-Day Split</h1>
        <p className="sub">Every exercise: {SETS} sets × {TARGET_REPS} reps.</p>
      </header>
      <div className="tabs" role="tablist">
        {DAYS.map((d, i) => (
          <button key={i} type="button" role="tab" className="tab" aria-selected={i === state.day}
            onClick={() => { setMsg(''); setState(s => ({ ...s, day: i })) }}>
            Day {i + 1}<small>{d.short}</small>
          </button>
        ))}
      </div>
      <h2>Day {state.day + 1} · {day.title}</h2>
      <div className="list">
        {day.ex.map((ex, i) => (
          <ExerciseCard key={ex.id} n={i + 1} ex={ex} state={state} setState={setState} onProgress={() => onProgress(ex.id)} />
        ))}
      </div>
      <button type="button" className={'finish' + (confirming ? ' confirm' : '')} onClick={finish}>
        {confirming ? 'Tap again to save and clear' : 'Finish workout'}
      </button>
      <p className="status" role="status">{msg}</p>
      <p className="note">Finish workout saves the session to History, makes your heaviest set the new Previous, clears the sets and moves you to the next day.</p>
    </>
  )
}

function ExerciseCard({ n, ex, state, setState, onProgress }: {
  n: number; ex: Exercise; state: State; setState: SetState; onProgress: () => void
}) {
  const [open, setOpen] = useState(false)
  const how = HOW[ex.id]
  const sets = state.sets[ex.id] ?? blankSets()
  const showUp = hitTarget(sets) || (!!state.moveUp[ex.id] && isEmpty(state.sets[ex.id]))

  const setField = (k: number, key: keyof SetEntry, v: string) =>
    setState(s => {
      const cur = (s.sets[ex.id] ?? blankSets()).map(x => ({ ...x }))
      cur[k][key] = v
      // After logging reps, carry this set's weight down to the next empty set
      if (key === 'r' && v && cur[k + 1] && !cur[k + 1].w && cur[k].w) cur[k + 1].w = cur[k].w
      return { ...s, sets: { ...s.sets, [ex.id]: cur } }
    })

  return (
    <section className="ex">
      <div className="top">
        <div className="num">{n}</div>
        <div className="name">{ex.name}{ex.hint && <span>{ex.hint}</span>}</div>
        <div className="target">{SETS} × {TARGET_REPS}</div>
        <button type="button" className="info" aria-expanded={open} aria-label={`How to do ${ex.name}`} onClick={() => setOpen(o => !o)}>i</button>
      </div>
      {open && how && (
        <div className="how">
          <div className="musc">Works: {how.muscles}</div>
          <ol>{how.steps.map((t, i) => <li key={i}>{t}</li>)}</ol>
          <div className="tip">Tip: {how.tip}</div>
          <div className="links">
            <a href={'https://www.youtube.com/results?search_query=' + encodeURIComponent(ex.name + ' exercise form')} target="_blank" rel="noopener">Watch a demo ↗</a>
          </div>
        </div>
      )}
      <div className="grid prev">
        <div className="lbl">Previous</div>
        <NumField id={`p-${ex.id}`} value={state.prev[ex.id] ?? ''} unit="lb" label={`${ex.name} previous weight`}
          onChange={v => setState(s => ({ ...s, prev: { ...s.prev, [ex.id]: v }, moveUp: { ...s.moveUp, [ex.id]: false } }))} />
        <button type="button" className="linkbtn small" onClick={onProgress}>Progress</button>
      </div>
      <div className="grid">
        <div />
        <div className="lbl c">Weight</div>
        <div className="lbl c">Reps</div>
        {sets.map((st, k) => (
          <SetRow key={k} k={k} st={st} name={ex.name} exId={ex.id} setField={setField} />
        ))}
      </div>
      {showUp && <div className="up">You hit {SETS} × {TARGET_REPS}. Move up in weight next session.</div>}
    </section>
  )
}

function SetRow({ k, st, name, exId, setField }: {
  k: number; st: SetEntry; name: string; exId: string
  setField: (k: number, key: keyof SetEntry, v: string) => void
}) {
  const done = (parseInt(st.r, 10) || 0) >= TARGET_REPS
  return (
    <>
      <div className={'lbl' + (done ? ' done' : '')}>Set {k + 1}</div>
      <NumField id={`w-${exId}-${k}`} value={st.w} unit="lb" label={`${name} set ${k + 1} weight`} onChange={v => setField(k, 'w', v)} />
      <NumField id={`r-${exId}-${k}`} value={st.r} unit="" label={`${name} set ${k + 1} reps`} integer onChange={v => setField(k, 'r', v)} />
    </>
  )
}

function NumField({ id, value, unit, label, onChange, integer }: {
  id: string; value: string; unit: string; label: string; onChange: (v: string) => void; integer?: boolean
}) {
  return (
    <div className="field">
      <input id={id} value={value} inputMode={integer ? 'numeric' : 'decimal'} placeholder="—" aria-label={label}
        onFocus={e => e.currentTarget.select()}
        onChange={e => onChange(e.target.value.replace(integer ? /[^0-9]/g : /[^0-9.]/g, ''))}
        onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur() }} />
      {unit && <i>{unit}</i>}
    </div>
  )
}

/* ---------- History ---------- */

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })

const fmtSets = (sets: SetEntry[]) =>
  sets.filter(s => s.w || s.r).map(s => `${s.w || '–'}×${s.r || '–'}`).join(', ')

function HistoryView({ state, setState }: { state: State; setState: SetState }) {
  const [armed, setArmed] = useState<string | null>(null)
  if (!state.history.length) {
    return (
      <>
        <header><h1>History</h1></header>
        <div className="empty">No workouts yet. Log your sets and tap <b>Finish workout</b>, and each session shows up here.</div>
      </>
    )
  }
  return (
    <>
      <header>
        <h1>History</h1>
        <p className="sub">{state.history.length} workout{state.history.length > 1 ? 's' : ''} logged. Weights in lb, shown as weight×reps.</p>
      </header>
      <div className="list">
        {state.history.map(s => (
          <section key={s.id} className="ex">
            <div className="hhead">
              <div>
                <div className="hdate">{fmtDate(s.date)}</div>
                <div className="hday">Day {s.day + 1} · {DAYS[s.day]?.title}</div>
              </div>
              <button type="button" className={'linkbtn small' + (armed === s.id ? ' danger' : '')}
                onClick={() => {
                  if (armed !== s.id) { setArmed(s.id); return }
                  setState(st => ({ ...st, history: st.history.filter(x => x.id !== s.id) }))
                  setArmed(null)
                }}>
                {armed === s.id ? 'Tap to delete' : 'Delete'}
              </button>
            </div>
            <ul className="hlist">
              {s.entries.map(e => (
                <li key={e.exId}>
                  <span>{EX_BY_ID[e.exId]?.name ?? e.exId}</span>
                  <span className="hsets">{fmtSets(e.sets)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}

/* ---------- Progress sheet ---------- */

function ProgressSheet({ state, exId, onClose }: { state: State; exId: string; onClose: () => void }) {
  const ex = EX_BY_ID[exId]
  const pts = progressFor(state.history, exId)
  return (
    <div className="sheetBg" onClick={onClose}>
      <div className="sheet" role="dialog" aria-label={`${ex.name} progress`} onClick={e => e.stopPropagation()}>
        <div className="hhead">
          <h2 style={{ margin: 0 }}>{ex.name}</h2>
          <button type="button" className="linkbtn" onClick={onClose}>Close</button>
        </div>
        {pts.length === 0 ? (
          <p className="empty">No finished sessions for this exercise yet.</p>
        ) : (
          <>
            <p className="sub">Heaviest set per session (lb)</p>
            <Chart values={pts.map(p => p.top)} labels={pts.map(p => fmtDate(p.date))} />
            <ul className="hlist">
              {[...pts].reverse().map((p, i) => (
                <li key={i}><span>{fmtDate(p.date)}</span><span className="hsets">{fmtSets(p.sets)}</span></li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

function Chart({ values, labels }: { values: number[]; labels: string[] }) {
  const W = 320, H = 150, pl = 34, pr = 12, pt = 12, pb = 24
  const lo = Math.min(...values), hi = Math.max(...values)
  const pad = hi === lo ? Math.max(5, hi * 0.1) : (hi - lo) * 0.15
  const min = Math.max(0, lo - pad), max = hi + pad
  const x = (i: number) => values.length === 1 ? (pl + W - pr) / 2 : pl + (i * (W - pl - pr)) / (values.length - 1)
  const y = (v: number) => pt + (1 - (v - min) / (max - min)) * (H - pt - pb)
  const ticks = [min, (min + max) / 2, max]
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ')
  const area = `${line} L${x(values.length - 1)},${H - pb} L${x(0)},${H - pb} Z`
  const last = values.length - 1
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label={`Top weight went from ${values[0]} to ${values[last]} lb`}>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={pl} x2={W - pr} y1={y(t)} y2={y(t)} className="grid-line" />
          <text x={pl - 6} y={y(t) + 4} textAnchor="end" className="axis">{Math.round(t)}</text>
        </g>
      ))}
      <path d={area} className="area" />
      <path d={line} className="line" />
      {values.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r={i === last ? 4.5 : 3} className={i === last ? 'dot last' : 'dot'} />)}
      <text x={x(0)} y={H - 6} textAnchor={values.length === 1 ? 'middle' : 'start'} className="axis">{labels[0]}</text>
      {values.length > 1 && <text x={x(last)} y={H - 6} textAnchor="end" className="axis">{labels[last]}</text>}
    </svg>
  )
}

/* ---------- Backup ---------- */

function BackupView({ state, setState }: { state: State; setState: SetState }) {
  const [msg, setMsg] = useState('')
  const [armed, setArmed] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `split-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(a.href), 1000)
    setMsg('Backup file downloaded.')
  }

  const importData = async (f: File) => {
    try {
      const data = JSON.parse(await f.text())
      if (typeof data !== 'object' || !data || !Array.isArray(data.history)) throw new Error()
      setState({ ...initialState(), ...data })
      setMsg(`Restored ${data.history.length} workouts.`)
    } catch {
      setMsg("That file isn't a Split backup. Pick the .json file you exported.")
    }
  }

  return (
    <>
      <header>
        <h1>Backup</h1>
        <p className="sub">Your data lives on this phone. Export a backup now and then so you never lose your history.</p>
      </header>
      <div className="list">
        <section className="ex">
          <div className="hday">{state.history.length} workouts in History</div>
          <button type="button" className="finish" style={{ marginTop: 0 }} onClick={exportData}>Export backup</button>
          <button type="button" className="finish confirm" style={{ marginTop: 0 }} onClick={() => fileRef.current?.click()}>Restore from backup</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden
            onChange={e => { const f = e.target.files?.[0]; if (f) importData(f); e.target.value = '' }} />
        </section>
        <section className="ex">
          <div className="hday">Start over</div>
          <p className="note" style={{ margin: 0 }}>Erases all weights, sets and history on this phone.</p>
          <button type="button" className={'finish confirm' + (armed ? ' danger' : '')} style={{ marginTop: 0 }}
            onClick={() => {
              if (!armed) { setArmed(true); return }
              setState(initialState()); setArmed(false); setMsg('All data erased.')
            }}>
            {armed ? 'Tap again to erase everything' : 'Erase all data'}
          </button>
        </section>
      </div>
      <p className="status" role="status">{msg}</p>
    </>
  )
}
