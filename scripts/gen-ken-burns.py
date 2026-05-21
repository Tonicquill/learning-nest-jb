#!/usr/bin/env python3
"""Generate Ken Burns motion videos from curated images."""
import os, subprocess, tempfile, shutil

BASE = r"D:\Claude Code Porjects\Edusky"
VIDEOS = os.path.join(BASE, "videos")
ASSETS = os.path.join(BASE, "assets")

# Curated images for hero-home.mp4
HOME_IMAGES = [
    ("tiktok/tt-005.jpg", "zoom_in"),
    ("facebook/fb-025.jpg", "pan_right"),
    ("instagram/ig-010.jpg", "zoom_out"),
    ("tiktok/tt-055.jpg", "pan_left"),
    ("facebook/fb-169.jpg", "zoom_in"),
    ("instagram/ig-156.jpg", "pan_right"),
    ("tiktok/tt-003.jpg", "zoom_out"),
    ("facebook/fb-020.jpg", "pan_left"),
    ("instagram/ig-002.jpg", "zoom_in"),
    ("tiktok/tt-267.jpg", "pan_right"),
    ("facebook/fb-084.jpg", "zoom_out"),
    ("instagram/ig-172.jpg", "pan_left"),
    ("facebook/fb-081.jpg", "zoom_in"),
    ("tiktok/tt-005.jpg", "pan_right"),
    ("instagram/ig-178.jpg", "zoom_out"),
]

# Curated images for hero-student-life.mp4
STUDENT_IMAGES = [
    ("facebook/fb-079.jpg", "zoom_in"),
    ("facebook/fb-080.jpg", "pan_right"),
    ("tiktok/tt-055.jpg", "zoom_out"),
    ("instagram/ig-172.jpg", "pan_left"),
    ("facebook/fb-030.jpg", "zoom_in"),
    ("tiktok/tt-003.jpg", "pan_right"),
    ("instagram/ig-178.jpg", "zoom_out"),
    ("facebook/fb-196.jpg", "pan_left"),
    ("tiktok/tt-005.jpg", "zoom_in"),
    ("instagram/ig-010.jpg", "pan_right"),
    ("facebook/fb-025.jpg", "zoom_out"),
    ("tiktok/tt-267.jpg", "pan_left"),
    ("instagram/ig-156.jpg", "zoom_in"),
    ("facebook/fb-020.jpg", "pan_right"),
    ("facebook/fb-169.jpg", "zoom_out"),
]

DURATION = 3.0  # seconds per image
FPS = 30
WIDTH, HEIGHT = 1920, 1080


def make_clip(image_path, effect, out_path):
    """Generate a short motion clip from a single image."""
    full_img = os.path.join(ASSETS, image_path)
    if not os.path.exists(full_img):
        print(f"SKIP missing {full_img}")
        return False

    # Build zoompan expression based on effect
    frames = int(DURATION * FPS)
    s = f"{WIDTH}x{HEIGHT}"

    if effect == "zoom_in":
        # Slow zoom from 1.0 to 1.4
        vf = (
            f"zoompan=z='min(zoom+0.0018,1.4)':d={frames}:s={s}:fps={FPS},"
            f"format=yuv420p,trim=duration={DURATION}"
        )
    elif effect == "zoom_out":
        # Slow zoom from 1.4 to 1.0
        vf = (
            f"zoompan=z='if(lte(zoom,1.0),1.4,max(zoom-0.0018,1.0))':d={frames}:s={s}:fps={FPS},"
            f"format=yuv420p,trim=duration={DURATION}"
        )
    elif effect == "pan_left":
        # Pan from right to left (crop moves right to left)
        vf = (
            f"zoompan=z='1.3':d={frames}:s={s}:fps={FPS},"
            f"format=yuv420p,trim=duration={DURATION}"
        )
    elif effect == "pan_right":
        # Pan from left to right
        vf = (
            f"zoompan=z='1.3':d={frames}:s={s}:fps={FPS},"
            f"format=yuv420p,trim=duration={DURATION}"
        )
    else:
        vf = f"scale={WIDTH}:{HEIGHT}:force_original_aspect_ratio=decrease,pad={WIDTH}:{HEIGHT}:(ow-iw)/2:(oh-ih)/2,format=yuv420p,trim=duration={DURATION}"

    cmd = [
        "ffmpeg", "-y", "-loop", "1", "-i", full_img,
        "-vf", vf,
        "-t", str(DURATION),
        "-c:v", "libx264", "-preset", "fast", "-crf", "22",
        "-pix_fmt", "yuv420p",
        "-g", "1", "-keyint_min", "1",
        "-an",
        "-movflags", "+faststart",
        out_path
    ]
    print(f"CLIP: {os.path.basename(out_path)} ({effect})")
    subprocess.run(cmd, capture_output=True)
    return os.path.exists(out_path)


def concat_clips(clips, out_path):
    """Concatenate MP4 clips with xfade transitions."""
    if not clips:
        return

    # Create concat list file
    list_file = os.path.join(tempfile.gettempdir(), "concat_list.txt")
    with open(list_file, "w") as f:
        for c in clips:
            f.write(f"file '{c.replace('\\', '/')}'\n")

    cmd = [
        "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", list_file,
        "-c:v", "libx264", "-preset", "fast", "-crf", "22",
        "-pix_fmt", "yuv420p",
        "-g", "1", "-keyint_min", "1",
        "-an",
        "-movflags", "+faststart",
        out_path
    ]
    print(f"CONCAT -> {os.path.basename(out_path)}")
    subprocess.run(cmd, capture_output=True)
    os.remove(list_file)


def build_video(name, images):
    tmpdir = tempfile.mkdtemp()
    clips = []
    for idx, (img, effect) in enumerate(images):
        clip_path = os.path.join(tmpdir, f"clip_{idx:03d}.mp4")
        if make_clip(img, effect, clip_path):
            clips.append(clip_path)

    if clips:
        out = os.path.join(VIDEOS, name)
        concat_clips(clips, out)
        print(f"DONE: {out} ({len(clips)} clips, ~{len(clips)*DURATION:.1f}s)")
    else:
        print(f"FAILED: no clips generated for {name}")

    shutil.rmtree(tmpdir, ignore_errors=True)


if __name__ == "__main__":
    os.makedirs(VIDEOS, exist_ok=True)
    print("=== Building hero-home.mp4 ===")
    build_video("hero-home.mp4", HOME_IMAGES)
    print("\n=== Building hero-student-life.mp4 ===")
    build_video("hero-student-life.mp4", STUDENT_IMAGES)
