"""
Imagamigos — 3D models of the seven lost treasures.

Run:  pip install manifold3d trimesh matplotlib
      python3 make_treasures.py
Writes one STL per treasure into ./stl and a preview picture of each into ./previews.
All sizes are in millimetres. Every model is a single closed (watertight) solid.

Design rules (children's toy):
  • every treasure is larger than the small-parts test cylinder (31.7 mm wide), and the ball is
    over 44.5 mm across, so none of them is a small part
  • points and corners are rounded or blunted — no sharp tips or edges
  • each prints flat-side-down without supports (the crystal may need a few under side crystals)
"""
import math, os
import numpy as np
from manifold3d import Manifold, CrossSection, JoinType, OpType
import trimesh

HERE = os.path.dirname(os.path.abspath(__file__))
SEG = 96  # smoothness of round parts


def rounded(cs, r):
    """Round every convex and concave corner of a 2D shape by radius r."""
    return cs.offset(-r, JoinType.Round).offset(2 * r, JoinType.Round).offset(-r, JoinType.Round)


def star_cs(R, r, points=5, rot=90):
    pts = []
    for i in range(points * 2):
        ang = math.radians(rot + i * 180 / points)
        rad = R if i % 2 == 0 else r
        pts.append((rad * math.cos(ang), rad * math.sin(ang)))
    return CrossSection([pts])


def cyl(h, r, r2=None, seg=SEG):
    return Manifold.cylinder(h, r, r if r2 is None else r2, circular_segments=seg)


# ---------------------------------------------------------------- 1. Rainbow Crayon (Scribbi)
def rainbow_crayon():
    core = Manifold.batch_hull([cyl(1, 7.6), cyl(78, 8.6).translate((0, 0, 1))])   # chamfered bottom
    sleeve = cyl(70, 9.0).translate((0, 0, 4))                                        # paper wrapper
    # 5 grooves split the wrapper into 6 bands (one per rainbow colour — paint or print multi-colour)
    for k in range(1, 6):
        z = 4 + k * 70 / 6
        sleeve = sleeve - (cyl(1.0, 9.5) - cyl(1.0, 8.4)).translate((0, 0, z - 0.5))
    cone = cyl(18, 8.6, 3.2).translate((0, 0, 79))
    tip = Manifold.sphere(3.4, SEG).translate((0, 0, 97))                             # rounded, not sharp
    return core + sleeve + cone + tip


# ---------------------------------------------------------------- 2. Glow Crystal (Craggle)
def glow_crystal():
    rng = np.random.default_rng(7)
    pts = []
    for a in np.linspace(0, 2 * np.pi, 14, endpoint=False):
        rx, ry = 27 + rng.uniform(-3, 3), 22 + rng.uniform(-3, 3)
        pts += [Manifold.sphere(3, 24).translate((rx * math.cos(a), ry * math.sin(a), 2.5)),
                Manifold.sphere(3, 24).translate((0.7 * rx * math.cos(a), 0.7 * ry * math.sin(a), 12 + rng.uniform(-2, 2)))]
    rock = Manifold.batch_hull(pts)
    rock = rock ^ Manifold.cube((100, 100, 40), True).translate((0, 0, 20))             # flat bottom at z = 0

    def crystal(r, h, tip_h):
        body = cyl(h, r, seg=6)
        point = cyl(tip_h, r, r * 0.22, seg=6).translate((0, 0, h))                     # blunted tip
        return body + point

    main = crystal(9, 38, 13).translate((0, 0, 8))
    left = crystal(6.5, 24, 9).rotate((4, -27, 13)).translate((-14, 1.5, 9))
    right = crystal(6, 20, 8).rotate((18, 22, 0)).translate((12, -5, 9))
    back = crystal(5, 16, 7).rotate((-22, 0, 30)).translate((2, 11, 9))
    return rock + main + left + right + back


# ---------------------------------------------------------------- 3. Moon Marble (Orbit)
def moon_marble():
    R = 25  # 50 mm ball — bigger than the 44.5 mm small-ball limit
    ball = Manifold.sphere(R, 128)
    rng = np.random.default_rng(3)
    craters = [(25, 30, 6.5), (-40, 20, 5), (110, -10, 7), (200, 35, 5.5), (160, -40, 4.5),
               (300, 10, 6), (260, 50, 4), (60, -35, 4.5), (330, -30, 5), (0, 70, 4.5)]
    for lon, lat, cr in craters:
        lo, la = math.radians(lon), math.radians(lat)
        d = R + cr * 0.55
        c = (d * math.cos(la) * math.cos(lo), d * math.cos(la) * math.sin(lo), d * math.sin(la))
        ball = ball - Manifold.sphere(cr, 48).translate(c)
    ball = ball ^ Manifold.cube((60, 60, 60), True).translate((0, 0, 30 - R + 1.5))   # small flat to stand / print on
    return ball.translate((0, 0, R - 1.5))


# ---------------------------------------------------------------- 4. Golden Key (Tangle)
def golden_key():
    T = 6.0
    bow = CrossSection.circle(21, SEG)
    # maze in the bow: two broken rings and a centre hole for a ribbon
    def ring(r_out, r_in, gap_deg, gap_at):
        ringcs = CrossSection.circle(r_out, SEG) - CrossSection.circle(r_in, SEG)
        g = math.radians(gap_at)
        gap = CrossSection.square((r_out + 2, 5), True).translate((r_out / 2 + 1, 0)).rotate(gap_at)
        return ringcs - gap
    bow = bow - ring(16.5, 13.5, 30, 0) - ring(10, 7.2, 30, 180) - CrossSection.circle(3.5, SEG)
    shaft = CrossSection.square((70, 9), True).translate((19 + 35, 0))
    bit = (CrossSection.square((18, 15), True).translate((79, -11))
           - CrossSection.square((4.5, 8), True).translate((75, -15))
           - CrossSection.square((4.5, 8), True).translate((84, -16)))
    collar = CrossSection.square((5, 14), True).translate((24, 0))
    shape = rounded(bow + shaft + bit + collar, 1.4)
    body = shape.extrude(T - 1.2)
    top = shape.offset(-1.0, JoinType.Round).extrude(1.2).translate((0, 0, T - 1.2))   # bevelled top edge
    return body + top


# ---------------------------------------------------------------- 5. Wishing Star (Nyxie)
def wishing_star():
    s = rounded(star_cs(38, 17), 3.5)
    base = s.extrude(5)
    dome = s.extrude(5.5, scale_top=(0.55, 0.55)).translate((0, 0, 5))                 # puffy, rounded-looking top
    return base + dome


# ---------------------------------------------------------------- 6. Power Pixel (Glitch)
def power_pixel():
    h, r = 20, 4
    corners = [Manifold.sphere(r, 32).translate((sx * (h - r), sy * (h - r), sz * (h - r)))
               for sx in (-1, 1) for sy in (-1, 1) for sz in (-1, 1)]
    cube = Manifold.batch_hull(corners)                                                  # 40 mm rounded cube
    heart = [".XX.XX.", "XXXXXXX", "XXXXXXX", ".XXXXX.", "..XXX..", "...X..."]
    px = 4.0
    pixels = []
    for row, line in enumerate(heart):
        for col, ch in enumerate(line):
            if ch == "X":
                x = (col - 3) * px
                y = (2.5 - row) * px
                pixels.append(Manifold.cube((px - 0.6, px - 0.6, 1.4), True).translate((x, y, h + 0.5)))
    top_heart = Manifold.batch_boolean(pixels, OpType.Add)
    # pixel heart on the top and on the front face
    front_heart = top_heart.rotate((90, 0, 0))
    return (cube + top_heart + front_heart).translate((0, 0, h))


# ---------------------------------------------------------------- 7. Moon Medallion (Leo)
def moon_medallion():
    disc = CrossSection.circle(30, SEG)
    loop = CrossSection.circle(7.5, SEG).translate((0, 33.5)) - CrossSection.circle(3.4, SEG).translate((0, 34.5))
    outline = rounded(disc + loop, 1.2) - CrossSection.circle(3.4, SEG).translate((0, 34.5))
    base = outline.extrude(3.6) + outline.offset(-0.8, JoinType.Round).extrude(0.8).translate((0, 0, 3.6))
    rim = (CrossSection.circle(30, SEG) - CrossSection.circle(27, SEG)).extrude(1.2).translate((0, 0, 4.4))
    crescent = rounded(CrossSection.circle(16, SEG) - CrossSection.circle(13.5, SEG).translate((6, 4)), 0.8)
    moon = crescent.translate((-2, -1)).extrude(2.0).translate((0, 0, 4.4))
    stars = Manifold()
    for (x, y, R) in [(11, 12, 4.5), (15, -6, 3.5), (2, -17, 3)]:
        stars = stars + rounded(star_cs(R, R * 0.45), 0.5).translate((x, y)).extrude(1.6).translate((0, 0, 4.4))
    return base + rim + moon + stars


TREASURES = [
    ("rainbow_crayon", "Rainbow Crayon", "Scribbi", rainbow_crayon, "#ff3d8b"),
    ("glow_crystal", "Glow Crystal", "Craggle", glow_crystal, "#2fc4b2"),
    ("moon_marble", "Moon Marble", "Orbit", moon_marble, "#c9cdd8"),
    ("golden_key", "Golden Key", "Tangle", golden_key, "#e5b53a"),
    ("wishing_star", "Wishing Star", "Nyxie", wishing_star, "#ffd84a"),
    ("power_pixel", "Power Pixel", "Glitch", power_pixel, "#5ee6b5"),
    ("moon_medallion", "Moon Medallion", "Leo", moon_medallion, "#e0b45c"),
]


def to_trimesh(m):
    # Remove tiny sliver triangles (0.05 mm — far finer than any manufacturing tolerance) so every slicer / CAD tool sees one clean, closed solid.
    m = m.simplify(0.05)
    mesh = m.to_mesh()
    verts = np.asarray(mesh.vert_properties)[:, :3]
    faces = np.asarray(mesh.tri_verts).copy()
    # Manifold may duplicate vertices along edges; merge them back so the mesh is one closed surface.
    merge_from, merge_to = np.asarray(mesh.merge_from_vert), np.asarray(mesh.merge_to_vert)
    if len(merge_from):
        remap = np.arange(len(verts)); remap[merge_from] = merge_to
        faces = remap[faces]
    t = trimesh.Trimesh(verts, faces, process=False)  # keep the exact, already-valid topology
    t.remove_unreferenced_vertices()
    t.apply_translation((0, 0, -t.bounds[0][2]))  # sit on the build plate (z = 0)
    return t


def preview(t, path, colour, title):
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from mpl_toolkits.mplot3d.art3d import Poly3DCollection
    tri = t.vertices[t.faces]
    n = t.face_normals
    light = np.array([0.4, -0.5, 0.75]); light /= np.linalg.norm(light)
    shade = 0.35 + 0.65 * np.clip(n @ light, 0, 1)
    base = np.array(matplotlib.colors.to_rgb(colour))
    cols = np.clip(base[None, :] * shade[:, None] + 0.08, 0, 1)
    fig = plt.figure(figsize=(5, 5), dpi=120)
    ax = fig.add_subplot(111, projection="3d")
    ax.add_collection3d(Poly3DCollection(tri, facecolors=cols, edgecolors="none"))
    lo, hi = t.bounds
    c = (lo + hi) / 2; span = (hi - lo).max() / 2
    ax.set_xlim(c[0] - span, c[0] + span); ax.set_ylim(c[1] - span, c[1] + span); ax.set_zlim(c[2] - span, c[2] + span)
    ax.set_box_aspect((1, 1, 1)); ax.view_init(elev=28, azim=-60); ax.axis("off")
    size = hi - lo
    ax.set_title(f"{title}\n{size[0]:.0f} × {size[1]:.0f} × {size[2]:.0f} mm", fontsize=12)
    fig.tight_layout(); fig.savefig(path, facecolor="white"); plt.close(fig)


if __name__ == "__main__":
    os.makedirs(os.path.join(HERE, "stl"), exist_ok=True)
    os.makedirs(os.path.join(HERE, "previews"), exist_ok=True)
    for key, name, who, fn, colour in TREASURES:
        t = to_trimesh(fn())
        t.export(os.path.join(HERE, "stl", f"{key}.stl"))
        preview(t, os.path.join(HERE, "previews", f"{key}.png"), colour, f"{name} ({who})")
        size = t.bounds[1] - t.bounds[0]
        print(f"{name:15s} {size[0]:6.1f} × {size[1]:6.1f} × {size[2]:6.1f} mm   "
              f"volume {t.volume / 1000:6.1f} cm³   watertight={t.is_watertight}   pieces={len(t.split(only_watertight=False))}   triangles={len(t.faces)}")
