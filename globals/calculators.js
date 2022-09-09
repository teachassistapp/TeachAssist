export function calculateAverage(marks, markWeights, weight) {
  if (!marks.some((a) => a !== " ") && !markWeights.some((a) => a !== 0)) {
    return "N/A";
  } //teacher hasn't inputted marks yet
  //recalculate marks based on course weighting
  if (String(weight) === "null") {
    weight = {
      O: { CW: 0, W: 0 },
      F: { CW: 30, W: 0 },
      T: { CW: 25, W: 17.5 },
      KU: { CW: 25, W: 17.5 },
      A: { CW: 25, W: 17.5 },
      C: { CW: 25, W: 17.5 },
    };
  }
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
      if (!!markWeights[i]) {
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
  } catch {}
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

  const sum = Math.round(w.KU.W + w.T.W + w.C.W + w.A.W + w.F.W + w.O.W);

  k /= (kw / Math.round(w.KU.CW * sum * 10)) * 10;
  t /= (tw / Math.round(w.T.CW * sum * 10)) * 10;
  c /= (cw / Math.round(w.C.CW * sum * 10)) * 10;
  a /= (aw / Math.round(w.A.CW * sum * 10)) * 10;
  f /= (fw / Math.round(w.F.CW * sum * 10)) * 10;
  o /= (ow / Math.round(w.O.CW * sum * 10)) * 10;

  let weights = 0;
  if (k != 0 && !isNaN(k)) {
    weights += w.KU.CW;
  }
  if (t != 0 && !isNaN(t)) {
    weights += w.T.CW;
  }
  if (c != 0 && !isNaN(c)) {
    weights += w.C.CW;
  }
  if (a != 0 && !isNaN(a)) {
    weights += w.A.CW;
  }
  if (f != 0 && !isNaN(f)) {
    weights += w.F.CW;
  } else {
    f = 0;
  }
  if (o != 0 && !isNaN(o)) {
    weights += w.O.CW;
  } else {
    o = 0;
  }
  return Math.round((k + t + c + a + f + o) / weights / 10) / 10;
}
