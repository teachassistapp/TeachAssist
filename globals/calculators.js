export function calculateAverage(marks, markWeights, weight) {
  if (
    (!marks.some((a) => a !== " ") && !markWeights.some((a) => a !== 0)) ||
    weight === null
  ) {
    return "N/A";
  } //teacher hasn't inputted marks yet
  //recalculate marks based on course weighting
  const cats = ["KU", "T", "C", "A", "F", "O"];
  try {
    for (let i = 0; i < 6; i++) {
      marks[i] = markWeights[i]
        ? marks[i] * weight[cats[i]].CW * markWeights[i]
        : null;
    }
    let weights = [
      weight.KU.CW,
      weight.T.CW,
      weight.C.CW,
      weight.A.CW,
      weight.F.CW,
      weight.O.CW,
    ];
    let total = 0;
    for (let i = 0; i < 6; i++) {
      if (markWeights[i]) {
        total += weights[i] * markWeights[i];
      } else {
        continue;
      }
    }
    marks = marks.filter((value) => {
      return typeof value === "number";
    });
    let marksSum = 0;
    marks.forEach((value) => (marksSum += value));
    marksSum /= total;
    const avg = Math.round(marksSum * 10) / 10;
    return isNaN(avg) ? 0 : avg;
  } catch (e) {
    console.log("error:", e);
  }
}

export function calculateCourseAverage(assignments) {
  let [k, kw, t, tw, c, cw, a, aw, f, fw, o, ow] = Array(12).fill(0);
  for (let i = 0; i < assignments.length; i++) {
    k += assignments[i].k * assignments[i].kWeight;
    kw += assignments[i].kWeight;
    t += assignments[i].t * assignments[i].tWeight;
    tw += assignments[i].tWeight;
    c += assignments[i].c * assignments[i].cWeight;
    cw += assignments[i].cWeight;
    a += assignments[i].a * assignments[i].aWeight;
    aw += assignments[i].aWeight;
    f += assignments[i].f * assignments[i].fWeight;
    fw += assignments[i].fWeight;
    o += assignments[i].o * assignments[i].oWeight;
    ow += assignments[i].oWeight;
  }

  const w = assignments[0].weight_table;

  k /= kw / 100 / w.KU.W;
  t /= tw / 100 / w.T.W;
  c /= cw / 100 / w.C.W;
  a /= aw / 100 / w.A.W;
  f /= fw / 100 / w.F.W;
  o /= ow / 100 / w.O.W;

  let weights = 0;

  if (k != 0 && !isNaN(k)) {
    weights += w.KU.W;
  }
  if (t != 0 && !isNaN(t)) {
    weights += w.T.W;
  }
  if (c != 0 && !isNaN(c)) {
    weights += w.C.W;
  }
  if (a != 0 && !isNaN(a)) {
    weights += w.A.W;
  }
  if (f != 0 && !isNaN(f)) {
    weights += w.F.W;
  } else {
    f = 0;
  }
  if (o != 0 && !isNaN(o)) {
    weights += w.O.W;
  } else {
    o = 0;
  }
  let avg = Math.round((k + t + c + a + f + o) / weights / 10) / 10;
  return avg;
}
