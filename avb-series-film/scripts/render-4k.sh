#!/usr/bin/env bash
# Renders both 4K masters at CRF 17 (quality-targeted, no bitrate cap), then
# splits anything over GitHub's file limit by stream copy — never re-encoded.
# Run from avb-series-film/:  bash scripts/render-4k.sh [reel|film|all]
#
# The film is rendered in three frame-range chunks and stream-copy joined, so a
# crash 40 minutes in costs one chunk rather than the whole 9,000-frame render.
set -uo pipefail
export PATH="$HOME/bin:$PATH"
WHAT="${1:-all}"
CONC="${CONCURRENCY:-2}"
mkdir -p out/parts out/qa

node scripts/scan-higgsfield.mjs
node --experimental-strip-types scripts/validate-plan.mjs 2>/dev/null || { echo "shot plan invalid"; exit 1; }

render_reel() {
  echo "═══ REEL 2160x3840 · 2700 frames ═══"
  npx remotion render Reel out/motu-avb-reel-4k.mp4 --concurrency="$CONC" --codec=h264 --crf=17 --pixel-format=yuv420p \
    2>&1 | tr '\r' '\n' | grep --line-buffered -aoE "Rendered [0-9]+/[0-9]+|.*[Ee]rror.*" | awk '{ if (++n % 150 == 0 || /rror/) { print strftime("%H:%M:%S"), $0; fflush() } }'
}

render_film() {
  echo "═══ FILM 3840x2160 · 9000 frames, 3 chunks ═══"
  rm -f out/film-chunk-*.mp4
  for r in "0-2999" "3000-5999" "6000-8999"; do
    echo "--- frames $r"
    npx remotion render Film "out/film-chunk-${r%%-*}.mp4" --frames="$r" --concurrency="$CONC" --codec=h264 --crf=17 --pixel-format=yuv420p \
      2>&1 | tr '\r' '\n' | grep --line-buffered -aoE "Rendered [0-9]+/[0-9]+|.*[Ee]rror.*" | awk '{ if (++n % 150 == 0 || /rror/) { print strftime("%H:%M:%S"), $0; fflush() } }'
    [ -s "out/film-chunk-${r%%-*}.mp4" ] || { echo "chunk $r failed"; return 1; }
  done
  printf "file 'film-chunk-0.mp4'\nfile 'film-chunk-3000.mp4'\nfile 'film-chunk-6000.mp4'\n" > out/film-concat.txt
  (cd out && ffmpeg -v error -y -f concat -safe 0 -i film-concat.txt -c copy motu-avb-film-4k.mp4) && rm -f out/film-chunk-*.mp4 out/film-concat.txt
}

package() {
  local f="$1" base="$2"
  [ -s "$f" ] || return 0
  ffmpeg -hide_banner -i "$f" 2>&1 | grep -E "Duration|Stream #" | sed 's/^/    /'
  local size; size=$(stat -c%s "$f"); local limit=$((95*1024*1024))
  if [ "$size" -gt "$limit" ]; then
    echo "  $((size/1024/1024)) MB exceeds GitHub's limit — splitting on keyframes (no re-encode)"
    rm -f out/parts/${base}-part*.mp4
    local segtime; segtime=$(python3 -c "import math; d=$(ffmpeg -i "$f" 2>&1 | python3 -c "import re,sys; m=re.search(r'Duration: (\d+):(\d+):(\d+\.\d+)', sys.stdin.read()); print(int(m[1])*3600+int(m[2])*60+float(m[3]))"); n=math.ceil($size/(90*1024*1024)); print(max(10, math.floor(d/n)))")
    ffmpeg -v error -y -i "$f" -c copy -map 0 -f segment -segment_time "$segtime" -reset_timestamps 1 "out/parts/${base}-part%d.mp4"
    ls -la out/parts/${base}-part*.mp4
    (cd out/parts && ls ${base}-part*.mp4 | sort -V | sed "s/^/file '/; s/$/'/" > "${base}.concat.txt")
  else
    echo "  $((size/1024/1024)) MB — under the limit, ships whole"
  fi
  # No downscaled or re-encoded copies: the client asked for the 4K masters
  # exactly as rendered — split into parts by stream copy only if needed.
}

case "$WHAT" in
  reel) render_reel; package out/motu-avb-reel-4k.mp4 motu-avb-reel ;;
  film) render_film; package out/motu-avb-film-4k.mp4 motu-avb-film ;;
  all) render_reel; package out/motu-avb-reel-4k.mp4 motu-avb-reel; render_film; package out/motu-avb-film-4k.mp4 motu-avb-film ;;
esac
echo "done."
