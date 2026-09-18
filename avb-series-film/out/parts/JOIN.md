# Rejoining the 4K masters

GitHub rejects files over 100 MB and git-lfs is not available here, so each 4K
master ships as stream-copied parts (no re-encode, no generation loss). Rejoin
with ffmpeg's concat demuxer:

```bash
cd avb-series-film/out/parts
ffmpeg -f concat -safe 0 -i motu-avb-reel.concat.txt -c copy ../motu-avb-reel-4k.mp4
ffmpeg -f concat -safe 0 -i motu-avb-film.concat.txt -c copy ../motu-avb-film-4k.mp4
```

The `*-1080p.mp4` review copies in `out/` are single files and play as-is.
