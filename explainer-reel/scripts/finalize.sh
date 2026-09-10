#!/usr/bin/env bash
# Post-render checks and delivery prep. Run from explainer-reel/.
#
# Verifies the master is what it claims to be, then splits it if it clears
# GitHub's 100 MB file limit — the same way the earlier reels in this
# repository were delivered.
set -uo pipefail
export PATH="$HOME/bin:$PATH"

OUT=out/motu-avb-explainer-reel.mp4
[ -f "$OUT" ] || { echo "NO MASTER AT $OUT"; exit 1; }

echo "═══ MASTER ═══"
ls -la "$OUT"
ffmpeg -hide_banner -i "$OUT" 2>&1 | grep -E "Duration|Stream #"

echo
echo "═══ LOUDNESS OF THE FINISHED MIX ═══"
ffmpeg -hide_banner -i "$OUT" -af ebur128 -f null - 2>&1 \
  | grep -A6 "Integrated loudness" | head -8

echo
echo "═══ CONTINUITY: is the bed present all the way through? ═══"
python3 - "$OUT" <<'PY'
import subprocess, sys, numpy as np
raw = subprocess.run(["ffmpeg","-v","error","-i",sys.argv[1],
                      "-ac","1","-ar","8000","-f","s16le","-"],
                     capture_output=True).stdout
x = np.frombuffer(raw, dtype='<i2').astype(np.float64)/32768
quiet = 0
for t in range(0, 180, 10):
    seg = x[t*8000:(t+10)*8000]
    if not len(seg):
        continue
    rms = 20*np.log10(np.sqrt((seg**2).mean())+1e-12)
    flag = "  <-- SILENT" if rms < -50 else ""
    if rms < -50:
        quiet += 1
    print(f"  {t:3d}-{t+10:3d}s  RMS {rms:6.1f} dBFS{flag}")
print("\nAll windows carry audio." if quiet == 0 else f"\n{quiet} SILENT WINDOWS")
PY

echo
SIZE=$(stat -c%s "$OUT")
LIMIT=$((95*1024*1024))
if [ "$SIZE" -gt "$LIMIT" ]; then
  echo "═══ $((SIZE/1024/1024)) MB exceeds GitHub's limit — splitting ═══"
  rm -f out/parts/*.mp4 2>/dev/null; mkdir -p out/parts
  # Stream-copy split on keyframes: no re-encode, so no generation loss.
  ffmpeg -v error -y -i "$OUT" -c copy -map 0 -f segment \
    -segment_time 60 -reset_timestamps 1 \
    "out/parts/motu-avb-explainer-reel-part%d.mp4"
  ls -la out/parts/
  echo
  echo "Rejoin with:  ffmpeg -f concat -safe 0 -i parts.txt -c copy reel.mp4"
else
  echo "═══ $((SIZE/1024/1024)) MB — under the limit, ships whole ═══"
fi
