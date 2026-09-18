# Rejoining the 4K masters

GitHub rejects files over 100 MB and git-lfs is not available here, so each 4K
master ships as stream-copied parts (no re-encode, no generation loss) plus its
untouched audio track. The rejoin takes the video from the parts and the audio
from that track, and the result is **frame- and sample-identical to the master**
(verified by frame differencing at every join and sample differencing of the
whole audio track — both exactly zero).

```bash
cd avb-series-film/out/parts
ffmpeg -f concat -safe 0 -i motu-avb-reel.concat.txt -i motu-avb-reel-audio.mp4 -map 0:v -map 1:a -c copy ../motu-avb-reel-4k.mp4
ffmpeg -f concat -safe 0 -i motu-avb-film.concat.txt -i motu-avb-film-audio.mp4 -map 0:v -map 1:a -c copy ../motu-avb-film-4k.mp4
```

Each part also plays on its own, with its own audio, exactly in sync.
