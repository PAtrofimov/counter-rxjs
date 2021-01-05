export function getCounterTime(seconds) {
  const hh = Math.floor(seconds / 3600);
  const mm = Math.floor((seconds - hh * 3600) / 60);
  const ss = seconds % 60;

  return formatTime(hh) + ":" + formatTime(mm) + ":" + formatTime(ss);
}

function formatTime(tt) {
  return String(tt).length === 1 ? "0" + tt : tt;
}
