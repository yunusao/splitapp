import { useEffect, useState } from 'react'
import { DAYS, SETS, TARGET_REPS } from './data'

export type SetEntry = { w: string; r: string }
export type Session = {
  id: string
  date: string // ISO
  day: number
  entries: { exId: string; sets: SetEntry[] }[]
}
export type State = {
  version: 1
  day: number
  prev: Record<string, string>
  moveUp: Record<string, boolean>
  sets: Record<string, SetEntry[]>
  history: Session[]
}

const KEY = 'five-day-split:v1'

export const blankSets = (): SetEntry[] => Array.from({ length: SETS }, () => ({ w: '', r: '' }))
export const initialState = (): State => ({ version: 1, day: 0, prev: {}, moveUp: {}, sets: {}, history: [] })

export function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initialState()
    return { ...initialState(), ...JSON.parse(raw) }
  } catch {
    return initialState()
  }
}

export function useAppState() {
  const [state, setState] = useState<State>(load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage full or blocked */ }
  }, [state])
  return [state, setState] as const
}

export const num = (v: string) => {
  const n = parseFloat(v)
  return Number.isFinite(n) ? n : null
}

export const hitTarget = (sets: SetEntry[]) =>
  sets.length === SETS && sets.every(s => (parseInt(s.r, 10) || 0) >= TARGET_REPS)

export const isEmpty = (sets: SetEntry[] | undefined) => !sets || sets.every(s => !s.w && !s.r)

export const topWeight = (sets: SetEntry[]) => {
  const ws = sets.map(s => num(s.w)).filter((x): x is number => x !== null)
  return ws.length ? Math.max(...ws) : null
}

/** Finish the current day: record a session, roll top weights into Previous, clear sets. */
export function finishDay(state: State, now = new Date()): { next: State; logged: number } {
  const day = DAYS[state.day]
  const entries: Session['entries'] = []
  const prev = { ...state.prev }
  const moveUp = { ...state.moveUp }
  const sets = { ...state.sets }
  for (const ex of day.ex) {
    const s = state.sets[ex.id]
    if (isEmpty(s)) continue
    entries.push({ exId: ex.id, sets: s!.map(x => ({ ...x })) })
    const top = topWeight(s!)
    if (top !== null) prev[ex.id] = String(top)
    moveUp[ex.id] = hitTarget(s!)
    sets[ex.id] = blankSets()
  }
  if (!entries.length) return { next: state, logged: 0 }
  const session: Session = { id: String(now.getTime()), date: now.toISOString(), day: state.day, entries }
  return {
    next: { ...state, prev, moveUp, sets, history: [session, ...state.history], day: (state.day + 1) % DAYS.length },
    logged: entries.length,
  }
}

/** Top weight per session for one exercise, oldest first. */
export function progressFor(history: Session[], exId: string) {
  return history
    .map(s => {
      const e = s.entries.find(x => x.exId === exId)
      if (!e) return null
      const top = topWeight(e.sets)
      return top === null ? null : { date: s.date, top, sets: e.sets }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .reverse()
}
