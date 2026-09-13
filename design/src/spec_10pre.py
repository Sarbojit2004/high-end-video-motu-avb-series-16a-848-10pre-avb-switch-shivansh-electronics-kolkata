"""The ten MOTU 10Pre slides.

Same treatment as the other two AVB units: no white sweep in the library, so
nothing is matted or bbox-trimmed and the heroes are hard-edged photo blocks.

Two frames are held back under the ruling that kept the Dante certification mark
off the Sonicview slides -- other companies' marks rather than photographs of
this product.
"""

SPEC = {
"01": dict(
    name="01_motu-10pre-interface", labels=("MOTU 10Pre", "One Rack Unit"),
    head=("TEN", "PRE"),
    hero="M10P-02", hero_mode="block", band="M10P-05", band_mode="scene", band_pos="center",
    plates=["M10P-03", "M10P-04", "M10P-35", "M10P-01", "M10P-40", "M10P-09"],
    cap_title=("One rack ", "unit"),
    cap_body="A single rack space built around its front-panel microphone "
             "inputs, with the analog and network I/O on the back and a colour "
             "meter display between them.",
    cap_meta="Above &mdash; three-quarter, from above",
    band_meta="Below &mdash; the front, on black",
),
"02": dict(
    name="02_motu-10pre-preamps", labels=("Front Panel", "Mic &middot; Line &middot; Instrument"),
    head=("PRE", "AMPS"),
    hero="M10P-14", hero_mode="block", band="M10P-10", band_mode="scene", band_pos="center",
    plates=["M10P-32", "M10P-12", "M10P-20", "M10P-03", "M10P-04"],
    cap_title=("In at the ", "front"),
    cap_body="Numbered combination jacks taking a microphone, a line source or "
             "an instrument in the same socket, with a send and return pair "
             "beside them for patching outboard across an input.",
    cap_meta="Above &mdash; the combination inputs",
    band_meta="Below &mdash; inserts and the first two inputs",
),
"03": dict(
    name="03_motu-10pre-rear-panel", labels=("Rear Panel", "Balanced I/O"),
    head=("CONNEC", "TORS"),
    hero="M10P-40", hero_mode="block", band="M10P-01", band_mode="scene", band_pos="center",
    plates=["M10P-21", "M10P-22", "M10P-09", "M10P-25", "M10P-06"],
    cap_title=("Out the ", "back"),
    cap_body="The rear in one run &mdash; the numbered line outputs, the network "
             "and optical sockets and the mains inlet along a single panel, with "
             "the loom that comes off it once the rack is wired.",
    cap_meta="Above &mdash; the rear panel",
    band_meta="Below &mdash; the rear, from the side",
),
"04": dict(
    name="04_motu-10pre-network", labels=("Network", "AVB &middot; Optical"),
    head=("NET", "WORK"),
    hero="M10P-25", hero_mode="block", band="M10P-28", band_mode="scene", band_pos="center",
    plates=["M10P-11", "M10P-22", "M10P-15", "M10P-40", "M10P-06"],
    cap_title=("Down a ", "cable"),
    cap_body="Network ports beside the optical banks, and MOTU's topology "
             "drawing of what they are for &mdash; interfaces, a switch and "
             "computers on one tree rather than a chain of separate runs.",
    cap_meta="Above &mdash; network and optical",
    band_meta="Below &mdash; MOTU's topology drawing",
),
"05": dict(
    name="05_motu-10pre-metering", labels=("The Display", "Phones &middot; In &middot; Out"),
    head=("MET", "ERING"),
    hero="M10P-12", hero_mode="block", band="M10P-20", band_mode="scene", band_pos="center",
    plates=["M10P-23", "M10P-18", "M10P-39", "M10P-37", "M10P-32"],
    cap_title=("Read on the ", "panel"),
    cap_body="A colour screen on the front reads phones, input, output and "
             "monitor as separate meter blocks, so levels can be checked without "
             "bringing the software forward.",
    cap_meta="Above &mdash; the meter display",
    band_meta="Below &mdash; the same screen, running",
),
"06": dict(
    name="06_motu-10pre-latency", labels=("Round Trip", "Thunderbolt &amp; USB"),
    head=("LAT", "ENCY"),
    hero="M10P-13", hero_mode="block", band="M10P-16", band_mode="scene", band_pos="center",
    plates=["M10P-15", "M10P-11", "M10P-07", "M10P-36", "M10P-24"],
    cap_title=("There and ", "back"),
    cap_body="MOTU's drawing of the path &mdash; analog in, to the workstation "
             "and back out again. The round-trip figure printed on it is about "
             "1.8 milliseconds.",
    cap_meta="Above &mdash; MOTU's latency diagram",
    band_meta="Below &mdash; the mixer on a screen",
),
"07": dict(
    name="07_motu-10pre-patchbay", labels=("Patchbay", "Sources &amp; Destinations"),
    head=("PATCH", "BAY"),
    hero="M10P-08", hero_mode="block", band="M10P-24", band_mode="scene", band_pos="center",
    plates=["M10P-07", "M10P-36", "M10P-41", "M10P-38", "M10P-37"],
    cap_title=("Anything to ", "anything"),
    cap_body="Sources on the left, destinations on the right, cords drawn between "
             "them &mdash; routing set by patching rather than by working through "
             "a menu of numbered pairs.",
    cap_meta="Above &mdash; the patchbay",
    band_meta="Below &mdash; the same page, patched",
),
"08": dict(
    name="08_motu-10pre-channel-strip", labels=("Channel Strip", "Dynamics &amp; EQ"),
    head=("EFF", "ECTS"),
    hero="M10P-33", hero_mode="block", band="M10P-34", band_mode="scene", band_pos="center",
    plates=["M10P-30", "M10P-39", "M10P-38", "M10P-41", "M10P-08"],
    cap_title=("On the way ", "in"),
    cap_body="Processing on each input drawn as curves rather than numbers "
             "&mdash; dynamics with its threshold and ratio, a parametric EQ "
             "beneath, and a reverb the whole mixer can feed.",
    cap_meta="Above &mdash; the dynamics page",
    band_meta="Below &mdash; the parametric EQ",
),
"09": dict(
    name="09_motu-10pre-wireless", labels=("Wireless Control", "From A Tablet"),
    head=("WIRE", "LESS"),
    hero="M10P-27", hero_mode="block", band="M10P-17", band_mode="scene", band_pos="center",
    plates=["M10P-16", "M10P-19", "M10P-26", "M10P-36", "M10P-07"],
    cap_title=("Off the ", "desk"),
    cap_body="The same mixer on a tablet, which matters when the interface is in "
             "a rack and the player is in the room &mdash; headphone levels set "
             "from where the musician is standing.",
    cap_meta="Above &mdash; the mixer on a tablet",
    band_meta="Below &mdash; MOTU's own card for it",
),
"10": dict(
    name="10_motu-10pre-in-service", labels=("In The Room", "Desks &amp; Racks"),
    head=("STU", "DIOS"),
    hero="M10P-19", hero_mode="block", band="M10P-26", band_mode="scene", band_pos="center",
    plates=["M10P-05", "M10P-03", "M10P-35", "M10P-02", "M10P-06", "M10P-21"],
    cap_title=("Rooms, not ", "sweeps"),
    cap_body="The frames shot where the unit works &mdash; under a pair of "
             "monitors on a studio desk with a console in front of it, and beside "
             "the modular wall it has to feed.",
    cap_meta="Above &mdash; a control room",
    band_meta="Below &mdash; a modular wall",
),
}

PREP = {}

HELD_BACK = {
    "M10P-29": "ESS Technology component mark (third party)",
    "M10P-31": "Thunderbolt certification mark (third party)",
}
