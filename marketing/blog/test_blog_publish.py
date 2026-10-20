import json
import struct
import sys
import tempfile
import unittest
from datetime import datetime
from pathlib import Path
from unittest import mock
from zoneinfo import ZoneInfo

sys.path.insert(0, str(Path(__file__).resolve().parent))
import blog_publish as bp  # noqa: E402

SLUG = "garage-door-spring-noise-miami"
KW = "garage door spring noise"


def jpeg(w=1600, h=900) -> bytes:
    return b"\xff\xd8" + b"\xff\xc0" + struct.pack(">HBHHB", 11, 8, h, w, 1) + b"\x00" * 10 + b"\xff\xd9"


def body(words=1200, links=None, stuff=False):
    links = links if links is not None else [
        "[garage door repair](/services/garage-door-repair/)",
        "[Miami-Dade hub](/garage-door-services-in-miami-dade-county/)",
        "[maintenance tips](/blog/garage-door-maintenance-miami/)"]
    filler = " ".join(f"word{i % 400}x" for i in range(words))
    intro = f"If you hear {KW} in your Miami home, here is what to know. " + filler[:0]
    sections = "\n\n".join(f"## Section {i}\n\nPlain text about doors. " + " ".join(["door"] * 5) for i in range(1, 4))
    if stuff:
        intro += (KW + " ") * 80
    return (intro + " ".join(links) + "\n\n" + sections + f"\n\n## What Causes {KW.title()}?\n\n" + filler +
            "\n\n## Frequently Asked Questions\n\n**Why?** Because.\n\nCall us.\n")


INV = {"posts": [{"slug": "garage-door-maintenance-miami", "title": "Garage Door Maintenance in Miami",
                  "headings": ["Why Maintenance Matters"]}],
       "sitemap_urls": ["https://305doors.com/blog/garage-door-maintenance-miami/"],
       "repo_routes": ["/", "/blog/", "/services/garage-door-repair/", "/garage-door-services-in-miami-dade-county/",
                       "/blog/garage-door-maintenance-miami/"]}


class Base(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        root = Path(self.tmp.name)
        self.addCleanup(self.tmp.cleanup)
        for name, val in (("ROOT", root), ("BLOG_RUNS", root / "marketing/runs/blog")):
            p = mock.patch.object(bp, name, val)
            p.start()
            self.addCleanup(p.stop)
        self.root = root
        (root / "marketing/runs/blog").mkdir(parents=True)
        self.brief = {
            "date": "2026-05-04", "primary_keyword": KW, "secondary_keywords": ["spring repair"],
            "title": "Garage Door Spring Noise in Miami: What It Means",
            "slug": SLUG, "description": ("Hearing garage door spring noise in Miami? Learn the common causes, what is safe "
                                           "to check yourself, and when to call a pro."),
            "content_file": "marketing/runs/blog/2026-05-04.md",
            "image_file": f"public/images/305doors/blog/{SLUG}-featured.jpg",
            "image_alt": "Garage door at dusk", "image_prompt": "A garage door at dusk",
            "differentiation": "Related to garage-door-maintenance-miami but focused on noise diagnosis, not routine upkeep.",
            "sources": ["https://www.cpsc.gov/"], "review": {"approved": True, "notes": "PASS"}}
        self.write_content(body())
        self.write_image()

    def write_content(self, text):
        (self.root / self.brief["content_file"]).write_text(text, encoding="utf-8")

    def write_image(self, review=True, ocr=None, size=(1600, 900)):
        jpg, side, _ = bp.image_paths(SLUG)
        jpg.parent.mkdir(parents=True, exist_ok=True)
        jpg.write_bytes(jpeg(*size))
        side.parent.mkdir(parents=True, exist_ok=True)
        side.write_text(json.dumps({"ocr_available": True, "ocr_words": ocr or [], "no_text_ocr": not ocr,
                                    "visual_review": review, "visual_notes": "looked fine" if review else ""}))

    def run_check(self, **over):
        b = dict(self.brief, **over)
        return bp.check_brief(b, INV, banned=[r"\$\s?\d", r"\bguarantee"])


class CheckGate(Base):
    def test_passes_on_good_fixture(self):
        res = self.run_check()
        self.assertTrue(res["passed"], res["problems"])
        self.assertEqual(len(res["internal_links"]), 3)

    def test_title_and_description_limits(self):
        res = self.run_check(title="Garage Door Spring Noise " + "x" * 60, description="short")
        text = " ".join(res["problems"])
        self.assertIn("title", text)
        self.assertIn("description", text)

    def test_word_count_and_headings(self):
        self.write_content("## One\n\ntiny body " + KW)
        text = " ".join(self.run_check()["problems"])
        self.assertIn("word count", text)
        self.assertIn("4 H2", text)
        self.assertIn("FAQ", text)

    def test_internal_link_must_resolve_and_include_service(self):
        self.write_content(body(links=["[a](/services/nope/)", "[b](/blog/)", "[c](/blog/garage-door-maintenance-miami/)"]))
        text = " ".join(self.run_check()["problems"])
        self.assertIn("does not resolve", text)
        self.assertIn("/services/", text)

    def test_http_link_and_link_count(self):
        self.write_content(body(links=["[x](http://example.com/a)"]))
        text = " ".join(self.run_check()["problems"])
        self.assertIn("non-https", text)
        self.assertIn("3-6 internal", text)

    def test_keyword_stuffing(self):
        self.write_content(body(stuff=True))
        self.assertIn("keyword stuffing", " ".join(self.run_check()["problems"]))

    def test_banned_claim(self):
        self.write_content(body() + "\nWe charge $99 and guarantee it.\n")
        self.assertIn("banned claim", " ".join(self.run_check()["problems"]))

    def test_slug_already_used_and_overlap_needs_differentiation(self):
        self.assertIn("slug already used", " ".join(self.run_check(slug="garage-door-maintenance-miami")["problems"]))
        brief = dict(self.brief, title="Garage Door Maintenance in Miami Homes", primary_keyword="garage door maintenance miami",
                     differentiation="This is a totally different angle on the topic overall.")
        res = bp.check_brief(brief, INV, banned=[])
        self.assertTrue(any("overlap" in p or "differentiation" in p for p in res["problems"]), res["problems"])

    def test_image_gates(self):
        self.write_image(review=False)
        self.assertIn("visual review", " ".join(self.run_check()["problems"]))
        self.write_image(ocr=["OPEN"])
        self.assertIn("OCR found text", " ".join(self.run_check()["problems"]))
        self.write_image(size=(1536, 1024))
        self.assertIn("1536x1024", " ".join(self.run_check()["problems"]))
        bp.image_paths(SLUG)[0].unlink()
        self.assertIn("image missing", " ".join(self.run_check()["problems"]))

    def test_review_required_and_missing_fields(self):
        self.assertIn("review.approved", " ".join(self.run_check(review={"approved": False, "notes": ""})["problems"]))
        b = dict(self.brief)
        del b["sources"]
        res = bp.check_brief(b, INV, banned=[])
        self.assertFalse(res["passed"])
        self.assertIn("missing brief fields", res["problems"][0])


class StatusLedgerGuard(Base):
    def test_status_shape_without_ledger(self):
        res = bp.status("2026-05-04")
        self.assertEqual(set(res), {"date", "live", "link", "title", "description", "image_url", "image_alt", "slug"})
        self.assertFalse(res["live"])

    def test_status_with_ledger_live_and_not(self):
        rec = {"slug": SLUG, "title": "T's Title", "description": "d", "link": bp.post_url(SLUG),
               "image": f"/images/305doors/blog/{SLUG}-featured.jpg", "image_alt": "alt", "state": "live"}
        bp.write_json(bp.ledger_path("2026-05-04"), rec)
        with mock.patch.object(bp, "http_get", return_value=(200, "<h1>T&#x27;s Title</h1>")):
            res = bp.status("2026-05-04")
        self.assertTrue(res["live"])
        self.assertEqual(res["link"], f"https://305doors.com/blog/{SLUG}/")
        self.assertEqual(res["image_url"], f"https://305doors.com/images/305doors/blog/{SLUG}-featured.jpg")
        with mock.patch.object(bp, "http_get", return_value=(404, "")):
            self.assertFalse(bp.status("2026-05-04")["live"])
        with mock.patch.object(bp, "http_get", return_value=(200, "other page")):
            self.assertFalse(bp.status("2026-05-04")["live"])

    def test_second_publish_refused_by_ledger(self):
        brief_path = self.root / "marketing/runs/blog/2026-05-04.brief.json"
        brief_path.write_text(json.dumps(self.brief))
        bp.write_json(bp.ledger_path("2026-05-04"), {"slug": SLUG, "state": "pushed"})
        with mock.patch.object(bp, "git") as g, mock.patch.object(bp, "build_inventory") as inv:
            with self.assertRaises(bp.PublishError) as cm:
                bp.publish(brief_path, allow_any_day=True)
        self.assertIn("refusing to publish again", str(cm.exception))
        g.assert_not_called()
        inv.assert_not_called()

    def test_day_guard(self):
        tz = ZoneInfo("America/New_York")
        mon = datetime(2026, 5, 4, 9, 0, tzinfo=tz)
        tue = datetime(2026, 5, 5, 9, 0, tzinfo=tz)
        bp.day_guard("2026-05-04", False, now=mon)
        with self.assertRaises(bp.PublishError):
            bp.day_guard("2026-05-05", False, now=tue)
        with self.assertRaises(bp.PublishError):
            bp.day_guard("2026-05-01", False, now=mon)  # not today
        bp.day_guard("2026-05-05", True, now=tue)  # override

    def test_frontmatter(self):
        fm = bp.frontmatter(dict(self.brief, meta_title="Meta"))
        parsed, _ = bp.split_frontmatter(fm + "body")
        self.assertEqual(parsed["title"], self.brief["title"])
        self.assertEqual(parsed["date"], "2026-05-04")
        self.assertEqual(parsed["metaTitle"], "Meta")
        self.assertEqual(parsed["image"], f"/images/305doors/blog/{SLUG}-featured.jpg")


if __name__ == "__main__":
    unittest.main()
