#!/usr/bin/env python3
"""Render the app icon PNGs.

The icon is a smiling plate on the app's orange background. It is drawn from
maths rather than an image file so the repo stays free of binary assets that
nobody can edit -- rerun this script after touching icons/icon.svg to keep the
raster versions in step.

    python3 tools/make_icons.py

Needs nothing but the standard library (no Pillow), so it also runs in CI.
"""

import math
import os
import struct
import sys
import zlib

HERE = os.path.dirname(os.path.abspath(__file__))
ICON_DIR = os.path.join(os.path.dirname(HERE), "icons")

# Supersampling factor. 3x3 samples per pixel is plenty to keep the circles
# from looking like staircases at 180px.
SS = 3

BG_TOP = (0xFF, 0x9A, 0x4D)
BG_BOTTOM = (0xEF, 0x6C, 0x1A)
PLATE = (0xFF, 0xFF, 0xFF)
PLATE_INNER = (0xFF, 0xF3, 0xE3)
FACE = (0x3D, 0x2B, 0x1F)


def blend(color, over, alpha):
    return tuple(round(c * (1 - alpha) + o * alpha) for c, o in zip(color, over))


def sample(x, y):
    """Colour of the icon at unit coordinates (0..1, y down)."""
    # Background gradient.
    color = blend(BG_TOP, BG_BOTTOM, y)

    dx, dy = x - 0.5, y - 0.5
    dist = math.hypot(dx, dy)

    # Plate: white disc with a warm inner disc, giving it a rim.
    if dist <= 0.335:
        color = PLATE
    if dist <= 0.255:
        color = PLATE_INNER

    # Eyes.
    for eye_x in (0.42, 0.58):
        if math.hypot(x - eye_x, y - 0.44) <= 0.038:
            color = FACE

    # Smile: the lower arc of an annulus centred on the plate.
    if 0.115 <= dist <= 0.155 and dy > 0.045:
        color = FACE

    return color


def render(size):
    """Return RGB rows for a size x size icon, supersampled."""
    rows = []
    step = 1.0 / (size * SS)
    for py in range(size):
        row = bytearray()
        for px in range(size):
            r = g = b = 0
            for sy in range(SS):
                for sx in range(SS):
                    u = (px * SS + sx + 0.5) * step
                    v = (py * SS + sy + 0.5) * step
                    c = sample(u, v)
                    r += c[0]
                    g += c[1]
                    b += c[2]
            n = SS * SS
            row += bytes((r // n, g // n, b // n))
        rows.append(bytes(row))
    return rows


def write_png(path, size, rows):
    """Minimal PNG writer: 8-bit RGB, filter type 0 on every scanline."""
    raw = b"".join(b"\x00" + row for row in rows)

    def chunk(tag, data):
        body = tag + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body))

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw, 9))
    png += chunk(b"IEND", b"")

    with open(path, "wb") as handle:
        handle.write(png)


def read_png_pixels(path):
    """Pull the decompressed scanlines back out of a PNG we wrote."""
    with open(path, "rb") as handle:
        data = handle.read()

    idat = b""
    pos = 8  # skip the signature
    while pos < len(data):
        (length,) = struct.unpack(">I", data[pos:pos + 4])
        tag = data[pos + 4:pos + 8]
        if tag == b"IDAT":
            idat += data[pos + 8:pos + 8 + length]
        pos += 12 + length
    return zlib.decompress(idat)


def main():
    targets = [
        ("apple-touch-icon.png", 180),
        ("icon-192.png", 192),
        ("icon-512.png", 512),
    ]
    # --check verifies the committed PNGs still match the code. It compares
    # pixels rather than file bytes, because zlib output differs between
    # versions and would otherwise make CI fail for no reason.
    check_only = "--check" in sys.argv
    stale = []

    os.makedirs(ICON_DIR, exist_ok=True)
    for name, size in targets:
        path = os.path.join(ICON_DIR, name)
        rows = render(size)

        if not check_only:
            write_png(path, size, rows)
            print("wrote icons/%s (%dx%d)" % (name, size, size))
            continue

        expected = b"".join(b"\x00" + row for row in rows)
        try:
            matches = read_png_pixels(path) == expected
        except (OSError, zlib.error, struct.error):
            matches = False
        print("%s icons/%s" % ("ok   " if matches else "STALE", name))
        if not matches:
            stale.append(name)

    if stale:
        print("\nRun `python3 tools/make_icons.py` and commit the result.")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
