export type Exercise = { id: string; name: string; hint: string }
export type Day = { short: string; title: string; ex: Exercise[] }
export type How = { muscles: string; steps: string[]; tip: string }

export const SETS = 3
export const TARGET_REPS = 12

const e = (id: string, name: string, hint = ''): Exercise => ({ id, name, hint })

export const DAYS: Day[] = [
  { short: 'Sh/Arm', title: 'Shoulders & Arms', ex: [
    e('d1-shoulder-press', 'Shoulder press', 'Machine or dumbbell'),
    e('d1-lat-raise', 'Cable lateral raises'),
    e('d1-front-raise', 'Cable front raises'),
    e('d1-incline-curl', 'Incline dumbbell curl', 'Biceps long head'),
    e('d1-dips', 'Dips', 'Weighted or assisted machine'),
    e('d1-reverse-curl', 'Reverse-grip EZ bar curl', 'Biceps, brachialis, forearms'),
  ]},
  { short: 'Ch/Tri', title: 'Chest & Triceps', ex: [
    e('d2-db-bench', 'Dumbbell bench press'),
    e('d2-fly', 'Chest fly', 'Machine or cable'),
    e('d2-incline-smith', 'Incline Smith machine press', 'Upper chest'),
    e('d2-pushdown', 'Triceps pushdown', 'Lateral head'),
    e('d2-overhead-ext', 'Overhead triceps extension', 'Long head'),
    e('d2-reverse-pushdown', 'Reverse-grip single-arm pushdown', 'Medial head'),
  ]},
  { short: 'Bk/Bi', title: 'Back & Biceps', ex: [
    e('d3-cable-row', 'Cable rows'),
    e('d3-pulldown', 'Lat pulldowns'),
    e('d3-reverse-pec', 'Reverse pec deck fly', 'Rear delts'),
    e('d3-z-curl', 'Cable curl, Z bar'),
    e('d3-rope-hammer', 'Rope hammer curls'),
    e('d3-bayesian', 'Face-away curls', 'Bayesian'),
  ]},
  { short: 'Ch/Bk', title: 'Chest & Back', ex: [
    e('d4-incline-db', 'Incline dumbbell bench'),
    e('d4-fly', 'Chest fly'),
    e('d4-machine-press', 'Machine chest press', 'Flat, heavy'),
    e('d4-straight-arm', 'Straight-arm cable pulldown', 'Lats'),
    e('d4-shrugs', 'Dumbbell shrugs', 'Upper traps'),
    e('d4-back-ext', '45° back extension', 'Lower back, glutes'),
  ]},
  { short: 'Legs', title: 'Legs', ex: [
    e('d5-leg-press', 'Leg press'),
    e('d5-leg-curl', 'Seated leg curl'),
    e('d5-calf', 'Horizontal calf raise'),
    e('d5-adduction', 'Hip adduction'),
    e('d5-abduction', 'Hip abduction'),
    e('d5-leg-ext', 'Leg extension'),
  ]},
]

export const EX_BY_ID: Record<string, Exercise> = Object.fromEntries(
  DAYS.flatMap(d => d.ex).map(x => [x.id, x]),
)

const h = (muscles: string, steps: string[], tip: string): How => ({ muscles, steps, tip })

export const HOW: Record<string, How> = {
  'd1-shoulder-press': h('Front & side delts, triceps', ['Sit with your back flat against the pad, handles or dumbbells at shoulder height.', 'Press straight up until your arms are almost locked.', 'Lower slowly until your hands are back at ear-to-chin level.'], "Keep your ribs down. Don't arch your lower back to finish the rep."),
  'd1-lat-raise': h('Side delts', ['Stand side-on to a low cable, handle in the far hand, cable crossing in front of your body.', 'With a slight bend in the elbow, raise your arm out to the side to shoulder height.', 'Lower slowly under control.'], 'Lead with the elbow, not the hand. Stop at shoulder height.'),
  'd1-front-raise': h('Front delts', ['Face away from a low cable with the handle between your legs, or face it with a rope.', 'Keeping arms nearly straight, raise the handle in front of you to shoulder height.', 'Lower slowly.'], 'No swinging. If your torso rocks, the weight is too heavy.'),
  'd1-incline-curl': h('Biceps (long head)', ['Set a bench to about 45–60° and sit back with dumbbells hanging straight down behind your torso.', 'Keep your upper arms still and curl the weights up, palms facing up.', 'Lower all the way until your arms are fully straight.'], "The stretch at the bottom is the point. Don't let your elbows drift forward."),
  'd1-dips': h('Triceps, lower chest, front delts', ['Grip the bars (or kneel on the assisted machine pad) with arms locked.', 'Stay fairly upright and lower until your upper arms are about parallel to the floor.', 'Press back up to lockout.'], 'Upright torso = more triceps. Leaning forward shifts it to chest.'),
  'd1-reverse-curl': h('Brachialis, brachioradialis, biceps', ['Hold an EZ bar with an overhand grip, hands shoulder-width apart.', 'Keep your elbows pinned at your sides and curl the bar up toward your shoulders.', 'Lower slowly to full extension.'], 'Keep your wrists straight, not bent back. Use lighter weight than normal curls.'),
  'd2-db-bench': h('Chest, front delts, triceps', ['Lie flat with dumbbells over your chest, shoulder blades squeezed together.', 'Lower the dumbbells to the sides of your chest, elbows at about 45° from your body.', 'Press back up and slightly in until your arms are straight.'], 'Feet planted, shoulders pinned back the whole set.'),
  'd2-fly': h('Chest', ['Sit on the pec deck (or stand between cables) with a slight bend in your elbows.', 'Bring your hands together in a wide hugging arc in front of your chest.', 'Open back up slowly until you feel a stretch across your chest.'], "Keep the elbow bend fixed. It's a hug, not a press."),
  'd2-incline-smith': h('Upper chest, front delts, triceps', ['Set a bench to about 30° under the Smith bar so it lines up with your upper chest.', 'Unrack, then lower the bar to your upper chest just below the collarbone.', 'Press back up to lockout.'], 'Keep the incline low. Steeper than 30–45° turns it into a shoulder press.'),
  'd2-pushdown': h('Triceps (lateral head)', ['Stand at a high cable with a bar or rope, elbows tucked at your sides.', 'Push down until your arms are fully straight.', 'Let the handle rise back to about chest height without moving your elbows.'], 'Only your forearms move. Elbows stay glued to your sides.'),
  'd2-overhead-ext': h('Triceps (long head)', ['Face away from a cable (or hold a dumbbell) with your hands behind your head and elbows pointing up.', 'Extend your arms overhead until straight.', 'Lower back behind your head for a deep stretch.'], 'Keep your elbows pointing forward, not flaring out.'),
  'd2-reverse-pushdown': h('Triceps (medial head)', ['Stand at a high cable with a single D-handle, palm facing up.', 'Elbow tucked at your side, push the handle down until your arm is straight.', 'Return slowly to about chest height.'], 'Go lighter than regular pushdowns. Do all reps on one arm, then switch.'),
  'd3-cable-row': h('Mid-back, lats, rear delts', ['Sit tall with feet on the platform and knees slightly bent.', 'Pull the handle to your lower stomach, driving your elbows back and squeezing your shoulder blades.', 'Let your arms extend fully forward and your shoulders reach.'], "Chest up. Don't lean way back to move the weight."),
  'd3-pulldown': h('Lats, biceps', ['Grip the bar a bit wider than shoulder-width and sit with thighs under the pads.', 'Pull the bar down to your upper chest, driving your elbows down and back.', 'Let the bar rise until your arms are fully straight.'], 'Lean back only slightly. Think elbows to hips.'),
  'd3-reverse-pec': h('Rear delts, upper back', ['Sit facing the pec deck pad with the handles set to the rear position.', 'Arms straight in front, sweep them out and back until they line up with your body.', 'Return slowly.'], "Don't squeeze the shoulder blades hard. Let the rear delts do the work."),
  'd3-z-curl': h('Biceps', ['Attach a Z bar to a low cable and grip it on the angled parts, palms up.', 'Keep your elbows at your sides and curl the bar to your chest.', 'Lower until your arms are straight.'], 'Stand close enough that the cable pulls straight up, not away from you.'),
  'd3-rope-hammer': h('Brachialis, brachioradialis, biceps', ['Attach a rope to a low cable and hold the ends with palms facing each other.', 'Keep your elbows pinned and curl the rope up toward your shoulders.', 'Lower under control to full extension.'], 'Keep your thumbs pointing up the whole rep.'),
  'd3-bayesian': h('Biceps (long head)', ['Stand facing away from a low cable, handle in one hand, arm slightly behind your body.', 'Keep your upper arm back and curl the handle forward and up.', 'Lower until your arm is straight and stretched behind you.'], "Stagger your stance for balance. Don't let the elbow drift forward."),
  'd4-incline-db': h('Upper chest, front delts, triceps', ['Set a bench to about 30° and start with dumbbells over your upper chest.', 'Lower them to the sides of your upper chest, elbows at about 45°.', 'Press back up and slightly together.'], 'Keep the shoulder blades pulled back and down.'),
  'd4-machine-press': h('Chest, front delts, triceps', ['Set the seat so the handles line up with mid-chest.', 'Press forward until your arms are almost locked.', 'Return slowly until you feel a stretch in your chest.'], 'Keep your back flat on the pad the whole set.'),
  'd4-straight-arm': h('Lats', ['Stand facing a high cable with a bar or rope and hinge forward slightly.', 'Keep your arms nearly straight and pull the handle down in an arc to your thighs.', 'Let it rise back to about head height.'], "Arms stay straight. It's a sweep from the shoulder, not a pushdown."),
  'd4-shrugs': h('Upper traps', ['Stand holding heavy dumbbells at your sides.', 'Lift your shoulders straight up toward your ears and pause for a second.', 'Lower all the way down.'], "Straight up and down. Don't roll the shoulders."),
  'd4-back-ext': h('Lower back, glutes, hamstrings', ['Set the pad just below your hip bones on the 45° bench, feet locked in.', 'Lower your torso by bending at the hips until you feel a hamstring stretch.', 'Raise back up until your body forms a straight line.'], "Stop at a straight line. Don't overarch at the top."),
  'd5-leg-press': h('Quads, glutes, adductors', ['Sit with your back flat and feet shoulder-width in the middle of the platform.', 'Lower the sled until your knees reach about 90° or a bit deeper.', 'Press back up without locking your knees.'], 'Keep your lower back on the pad. Stop before it starts to lift.'),
  'd5-leg-curl': h('Hamstrings', ['Sit with the pad on your lower calves, just above your ankles, and the thigh pad locked down.', 'Curl your heels down and back as far as you can.', 'Return slowly to fully straight legs.'], 'Lean your torso slightly forward for a better hamstring stretch.'),
  'd5-calf': h('Calves', ['Sit in the horizontal calf machine (or leg press) with the balls of your feet on the edge of the platform.', 'Let your heels drop for a deep stretch.', 'Push up onto your toes as high as you can and pause.'], 'Pause at the bottom stretch for a second. No bouncing.'),
  'd5-adduction': h('Inner thighs', ['Sit in the machine with pads on the inside of your knees, legs spread.', 'Squeeze your legs together until the pads meet.', 'Open back up slowly.'], 'Sit upright and control the stretch on the way out.'),
  'd5-abduction': h('Glute medius, outer hips', ['Sit in the machine with pads on the outside of your knees.', 'Push your knees out as far as you can.', 'Return slowly.'], 'Leaning slightly forward hits the glutes harder.'),
  'd5-leg-ext': h('Quads', ['Sit with the pad on your lower shins and knees lined up with the machine\'s pivot.', 'Extend your legs until straight and squeeze your quads.', 'Lower slowly.'], 'Hold the handles and keep your hips down on the seat.'),
}
HOW['d4-fly'] = HOW['d2-fly']
