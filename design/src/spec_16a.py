"""The ten MOTU 16A slides.

Every product frame here is lit on black or is a software capture -- there is
no white sweep to key on -- so no hero is `cut` and no band is `bbox`. They are
hard-edged photo blocks, which is the honest treatment for product photographed
on black. Only the three thin front-panel strips are trimmed as plates.

Two frames are held back under the ruling that kept the Dante certification mark
off the Sonicview slides: they are other companies' marks rather than
photographs of this product. MOTU's own CueMix Pro mark and its own latency and
topology drawings are kept, being the manufacturer's own material.
"""

SPEC = {
"01": dict(
    name="01_motu-16a-sixteen", labels=("MOTU 16A", "One Rack Unit"),
    head=("SIX", "TEEN"),
    hero="M16A-41", hero_mode="block", band="M16A-45", band_mode="scene", band_pos="center",
    plates=["M16A-43", "M16A-44", "M16A-04", "M16A-06", "M16A-08", "M16A-40", "M16A-30"],
    cap_title=("One rack ", "unit"),
    cap_body="Sixteen analog inputs and sixteen outputs in a single rack space, "
             "with a colour meter display across the front panel and a large "
             "monitor control at the right-hand end.",
    cap_meta="Above &mdash; three-quarter",
    band_meta="Below &mdash; the front, on black",
),
"02": dict(
    name="02_motu-16a-rear-panel", labels=("Rear Panel", "Balanced I/O"),
    head=("CONNEC", "TORS"),
    hero="M16A-10", hero_mode="block", band="M16A-42", band_mode="scene", band_pos="center",
    plates=["M16A-20", "M16A-23", "M16A-38", "M16A-26", "M16A-24"],
    cap_title=("Out the ", "back"),
    cap_body="The whole rear in one run &mdash; the balanced analog bank, the "
             "numbered line outputs, word clock and the network and optical "
             "sockets, laid along a single panel.",
    cap_meta="Above &mdash; the rear panel",
    band_meta="Below &mdash; the rear, from the side",
),
"03": dict(
    name="03_motu-16a-network", labels=("Network", "AVB &middot; Optical"),
    head=("NET", "WORK"),
    hero="M16A-26", hero_mode="block", band="M16A-31", band_mode="scene", band_pos="center",
    plates=["M16A-32", "M16A-38", "M16A-22", "M16A-30", "M16A-10"],
    cap_title=("Down a ", "cable"),
    cap_body="Two network ports beside the optical banks, and MOTU's topology "
             "drawing of what they are for &mdash; interfaces, a switch and "
             "computers on one tree rather than a chain of point-to-point runs.",
    cap_meta="Above &mdash; network and optical",
    band_meta="Below &mdash; MOTU's topology drawing",
),
"04": dict(
    name="04_motu-16a-patchbay", labels=("Patchbay", "Sources &amp; Destinations"),
    head=("PATCH", "BAY"),
    hero="M16A-13", hero_mode="block", band="M16A-14", band_mode="scene", band_pos="center",
    plates=["M16A-25", "M16A-33", "M16A-03", "M16A-11", "M16A-09"],
    cap_title=("Anything to ", "anything"),
    cap_body="Sources on the left, destinations on the right, and cords drawn "
             "between them &mdash; routing set by patching rather than by "
             "working through a menu of numbered pairs.",
    cap_meta="Above &mdash; the patchbay",
    band_meta="Below &mdash; the same page, patched",
),
"05": dict(
    name="05_motu-16a-metering", labels=("The Display", "Phones &middot; In &middot; Out"),
    head=("MET", "ERING"),
    hero="M16A-17", hero_mode="block", band="M16A-09", band_mode="scene", band_pos="center",
    plates=["M16A-05", "M16A-06", "M16A-08", "M16A-04", "M16A-39"],
    cap_title=("Read on the ", "panel"),
    cap_body="A colour screen across the front reads every channel at once, and "
             "the same meters appear in the software &mdash; levels visible "
             "whether or not the computer is in front of you.",
    cap_meta="Above &mdash; the meter display",
    band_meta="Below &mdash; the mixer's own meters",
),
"06": dict(
    name="06_motu-16a-latency", labels=("Round Trip", "Thunderbolt &amp; USB"),
    head=("LAT", "ENCY"),
    hero="M16A-34", hero_mode="block", band="M16A-15", band_mode="scene", band_pos="center",
    plates=["M16A-22", "M16A-28", "M16A-18", "M16A-07", "M16A-16"],
    cap_title=("There and ", "back"),
    cap_body="MOTU's drawing of the path &mdash; analog in, to the workstation "
             "and back out again. The round-trip figure printed on it is about "
             "1.8 milliseconds.",
    cap_meta="Above &mdash; MOTU's latency diagram",
    band_meta="Below &mdash; a laptop on the rack",
),
"07": dict(
    name="07_motu-16a-cuemix", labels=("CueMix Pro", "Onboard Mixer"),
    head=("CUE", "MIX"),
    hero="M16A-33", hero_mode="block", band="M16A-05", band_mode="scene", band_pos="center",
    plates=["M16A-02", "M16A-03", "M16A-11", "M16A-25", "M16A-35"],
    cap_title=("Mixing on the ", "box"),
    cap_body="The mixer runs on the interface rather than in the session. The "
             "device page lists every unit on the network; each one opens to its "
             "own inputs, outputs and full set of faders.",
    cap_meta="Above &mdash; the device list",
    band_meta="Below &mdash; a channel and its faders",
),
"08": dict(
    name="08_motu-16a-channel-strip", labels=("Channel Strip", "Gate &middot; Comp &middot; EQ"),
    head=("EFF", "ECTS"),
    hero="M16A-35", hero_mode="block", band="M16A-12", band_mode="scene", band_pos="center",
    plates=["M16A-19", "M16A-09", "M16A-05", "M16A-11", "M16A-02"],
    cap_title=("On the way ", "in"),
    cap_body="Processing on each input drawn as curves rather than numbers "
             "&mdash; dynamics with its threshold and ratio, a parametric EQ "
             "beneath, and a reverb the whole mixer can feed.",
    cap_meta="Above &mdash; the dynamics page",
    band_meta="Below &mdash; the parametric EQ",
),
"09": dict(
    name="09_motu-16a-wireless", labels=("Wireless Control", "From A Tablet"),
    head=("WIRE", "LESS"),
    hero="M16A-29", hero_mode="block", band="M16A-36", band_mode="scene", band_pos="center",
    plates=["M16A-07", "M16A-18", "M16A-28", "M16A-33", "M16A-25"],
    cap_title=("Off the ", "desk"),
    cap_body="The same mixer on a tablet, which matters when the interface is in "
             "a rack and the player is in the room &mdash; headphone levels set "
             "from where the musician is standing.",
    cap_meta="Above &mdash; the mixer on a tablet",
    band_meta="Below &mdash; MOTU's own card for it",
),
"10": dict(
    name="10_motu-16a-in-service", labels=("In The Room", "Desks &amp; Racks"),
    head=("STU", "DIOS"),
    hero="M16A-01", hero_mode="block", band="M16A-16", band_mode="scene", band_pos="center",
    plates=["M16A-27", "M16A-15", "M16A-24", "M16A-44", "M16A-43", "M16A-40"],
    cap_title=("Rooms, not ", "sweeps"),
    cap_body="The frames shot where the unit works &mdash; headphones resting on "
             "the rack, a desk of screens and outboard behind it, and a modular "
             "synth wall it has to feed.",
    cap_meta="Above &mdash; with headphones",
    band_meta="Below &mdash; a working desk",
),
}

# Only the thin front-panel strips are trimmed; everything else goes in whole.
PREP = {k: dict(mode="bbox") for k in ["M16A-04", "M16A-06", "M16A-08"]}

HELD_BACK = {
    "M16A-21": "Thunderbolt certification mark (third party)",
    "M16A-37": "ESS Technology component mark (third party)",
}
