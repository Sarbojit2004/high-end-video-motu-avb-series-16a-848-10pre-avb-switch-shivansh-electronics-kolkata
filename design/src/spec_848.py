"""The ten MOTU 848 slides.

Same treatment as the 16A: every product frame is lit on black or is a software
capture, so nothing is matted or bbox-trimmed -- the heroes are hard-edged photo
blocks, which is the honest handling of product shot on black.

Seven frames are held back under the ruling that kept the Dante certification
mark off the Sonicview slides: other companies' marks and bundle artwork rather
than photographs of this product. MOTU's own CueMix Pro mark and its own latency
and topology drawings are kept.
"""

SPEC = {
"01": dict(
    name="01_motu-848-interface", labels=("MOTU 848", "One Rack Unit"),
    head=("INTER", "FACE"),
    hero="M848-40", hero_mode="block", band="M848-43", band_mode="scene", band_pos="center",
    plates=["M848-39", "M848-42", "M848-06", "M848-32", "M848-08", "M848-41"],
    cap_title=("One rack ", "unit"),
    cap_body="A single rack space carrying the analog and digital I/O on the "
             "back, the microphone inputs and monitor control on the front, and "
             "a colour meter display between them.",
    cap_meta="Above &mdash; three-quarter, from above",
    band_meta="Below &mdash; the front, on black",
),
"02": dict(
    name="02_motu-848-preamps", labels=("Front Panel", "Mic &middot; Line &middot; Instrument"),
    head=("PRE", "AMPS"),
    hero="M848-20", hero_mode="block", band="M848-17", band_mode="scene", band_pos="center",
    plates=["M848-11", "M848-32", "M848-19", "M848-27", "M848-43"],
    cap_title=("In at the ", "front"),
    cap_body="Numbered combination jacks that take a microphone, a line source "
             "or an instrument in the same socket, with a send and return pair "
             "beside them for patching outboard across an input.",
    cap_meta="Above &mdash; the combination inputs",
    band_meta="Below &mdash; inserts and the first two inputs",
),
"03": dict(
    name="03_motu-848-rear-panel", labels=("Rear Panel", "Balanced I/O"),
    head=("CONNEC", "TORS"),
    hero="M848-08", hero_mode="block", band="M848-41", band_mode="scene", band_pos="center",
    plates=["M848-12", "M848-14", "M848-24", "M848-04", "M848-13"],
    cap_title=("Out the ", "back"),
    cap_body="The rear in one run &mdash; the numbered line outputs, the network "
             "and optical sockets and the mains inlet along a single panel, with "
             "the loom that comes off it when the rack is wired.",
    cap_meta="Above &mdash; the rear panel",
    band_meta="Below &mdash; the rear, from the side",
),
"04": dict(
    name="04_motu-848-network", labels=("Network", "AVB &middot; Optical"),
    head=("NET", "WORK"),
    hero="M848-24", hero_mode="block", band="M848-35", band_mode="scene", band_pos="center",
    plates=["M848-34", "M848-10", "M848-04", "M848-14", "M848-32"],
    cap_title=("Down a ", "cable"),
    cap_body="Network ports beside the optical banks, and MOTU's topology "
             "drawing of what they are for &mdash; interfaces, a switch and "
             "computers on one tree rather than a chain of separate runs.",
    cap_meta="Above &mdash; network and optical",
    band_meta="Below &mdash; MOTU's topology drawing",
),
"05": dict(
    name="05_motu-848-metering", labels=("The Display", "Phones &middot; In &middot; Out"),
    head=("MET", "ERING"),
    hero="M848-19", hero_mode="block", band="M848-27", band_mode="scene", band_pos="center",
    plates=["M848-15", "M848-22", "M848-21", "M848-12", "M848-11"],
    cap_title=("Read on the ", "panel"),
    cap_body="A colour screen on the front reads phones, input, output and "
             "monitor as separate meter blocks, so levels can be checked without "
             "bringing the software forward.",
    cap_meta="Above &mdash; the meter display",
    band_meta="Below &mdash; the same screen, running",
),
"06": dict(
    name="06_motu-848-latency", labels=("Round Trip", "Thunderbolt &amp; USB"),
    head=("LAT", "ENCY"),
    hero="M848-36", hero_mode="block", band="M848-28", band_mode="scene", band_pos="center",
    plates=["M848-10", "M848-30", "M848-25", "M848-21", "M848-34"],
    cap_title=("There and ", "back"),
    cap_body="MOTU's drawing of the path &mdash; analog in, to the workstation "
             "and back out again. The round-trip figure printed on it is about "
             "1.8 milliseconds.",
    cap_meta="Above &mdash; MOTU's latency diagram",
    band_meta="Below &mdash; a session running",
),
"07": dict(
    name="07_motu-848-patchbay", labels=("Patchbay", "Sources &amp; Destinations"),
    head=("PATCH", "BAY"),
    hero="M848-18", hero_mode="block", band="M848-23", band_mode="scene", band_pos="center",
    plates=["M848-25", "M848-02", "M848-22", "M848-21", "M848-13"],
    cap_title=("Anything to ", "anything"),
    cap_body="Sources on the left, destinations on the right, cords drawn between "
             "them &mdash; routing set by patching rather than by working through "
             "a menu of numbered pairs.",
    cap_meta="Above &mdash; the patchbay",
    band_meta="Below &mdash; the same page, patched",
),
"08": dict(
    name="08_motu-848-monitoring", labels=("Monitor Group", "A / B / C &middot; Talk"),
    head=("TALK", "BACK"),
    hero="M848-15", hero_mode="block", band="M848-22", band_mode="scene", band_pos="center",
    plates=["M848-19", "M848-27", "M848-11", "M848-12", "M848-21"],
    cap_title=("Three sets of ", "speakers"),
    cap_body="A monitor group with A, B and C select, mono and mute, and a talk "
             "button &mdash; the controls for checking a mix on another pair and "
             "speaking to the room, kept together on one panel.",
    cap_meta="Above &mdash; the monitor buttons",
    band_meta="Below &mdash; the monitor group panel",
),
"09": dict(
    name="09_motu-848-wireless", labels=("Wireless Control", "From A Tablet"),
    head=("WIRE", "LESS"),
    hero="M848-33", hero_mode="block", band="M848-38", band_mode="scene", band_pos="center",
    plates=["M848-21", "M848-28", "M848-30", "M848-34", "M848-25"],
    cap_title=("Off the ", "desk"),
    cap_body="The same mixer on a tablet, which matters when the interface is in "
             "a rack and the player is in the room &mdash; headphone levels set "
             "from where the musician is standing.",
    cap_meta="Above &mdash; the mixer on a tablet",
    band_meta="Below &mdash; MOTU's own card for it",
),
"10": dict(
    name="10_motu-848-in-service", labels=("In The Room", "Desks &amp; Racks"),
    head=("STU", "DIOS"),
    hero="M848-01", hero_mode="block", band="M848-07", band_mode="scene", band_pos="center",
    plates=["M848-31", "M848-13", "M848-40", "M848-39", "M848-42", "M848-06"],
    cap_title=("Rooms, not ", "sweeps"),
    cap_body="The frames shot where the unit works &mdash; under a pair of "
             "monitors on a studio desk with a console in front of it, and beside "
             "the screens and the modular wall it has to feed.",
    cap_meta="Above &mdash; a control room",
    band_meta="Below &mdash; a working desk",
),
}

PREP = {}

HELD_BACK = {
    "M848-03": "Loopmasters bundle cover (third party)",
    "M848-05": "Lucid Samples bundle cover (third party)",
    "M848-09": "Thunderbolt certification mark (third party)",
    "M848-16": "collage of bundled third-party instrument thumbnails",
    "M848-26": "Milan certification mark (third party)",
    "M848-29": "Big Fish Audio bundle cover (third party)",
    "M848-37": "ESS Technology component mark (third party)",
}
