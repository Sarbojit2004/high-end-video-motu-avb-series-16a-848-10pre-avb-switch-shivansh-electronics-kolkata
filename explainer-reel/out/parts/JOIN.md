# Rejoining the 4K master

The master is 2160×3840, 180.05 s, 116 MB — over GitHub's 100 MB per-file
limit, so it is committed as three parts. They were cut on keyframes with a
stream copy, so rejoining them is lossless: no re-encode, no generation loss.

```bash
cd out/parts
printf "file '%s'\n" motu-avb-explainer-reel-part*.mp4 > parts.txt
ffmpeg -f concat -safe 0 -i parts.txt -c copy motu-avb-explainer-reel.mp4
```

The result is byte-for-byte equivalent in content to the master that was
verified: 180.05 s, 2160×3840, h264 High + AAC stereo, −22.5 LUFS integrated.

A 1080×1920 viewing copy of the same edit is at
`out/motu-avb-explainer-reel-1080p.mp4` if you just want to watch it.
