"""Offline tests: the HTTP layer (facebook_publish.http_json) is always replaced."""
import json
import tempfile
import unittest
from pathlib import Path
from unittest import mock

import facebook_publish as fb
import gbp_publish as gbp
import instagram_publish as ig

FB_CFG = {"version": "v24.0", "META_PAGE_ID": "111", "META_PAGE_ACCESS_TOKEN": "tok"}
IG_CFG = {"version": "v24.0", "META_PAGE_ACCESS_TOKEN": "tok", "IG_USER_ID": "222"}
GBP_CFG = {"GBP_ACCOUNT": "accounts/1", "GBP_LOCATION": "locations/2"}
REVIEW = {"approved": True, "notes": "ok"}
LINK = "https://305doors.com/blog/x"
IMG = "https://305doors.com/blog/x.jpg"


class Fake:
    """Routes by (method, url-substring). A handler may be a dict, or an Exception to raise."""

    def __init__(self, routes):
        self.routes, self.calls = routes, []

    def __call__(self, method, url, headers=None, body=None, timeout=30):
        self.calls.append((method, url))
        for (m, frag), handler in self.routes:
            if m == method and frag in url:
                if isinstance(handler, list):
                    handler = handler.pop(0) if len(handler) > 1 else handler[0]
                if isinstance(handler, Exception):
                    raise handler
                return handler
        raise AssertionError(f"unexpected call {method} {url}")

    def posts(self, frag):
        return [c for c in self.calls if c[0] == "POST" and frag in c[1]]


class Base(unittest.TestCase):
    def setUp(self):
        tmp = tempfile.TemporaryDirectory()
        self.addCleanup(tmp.cleanup)
        self.runs = Path(tmp.name)

    def patch(self, fake):
        p = mock.patch.object(fb, "http_json", fake)
        p.start()
        self.addCleanup(p.stop)

    def ledger(self, channel):
        return json.loads((self.runs / channel / "2026-05-01.ledger.json").read_text())


class FacebookTests(Base):
    post = {"message": "Hello Miami", "link": LINK}

    def routes(self, feed):
        return [(("GET", "/111?"), {"id": "111", "name": "305 Doors"}),
                (("POST", "/111/feed"), feed),
                (("GET", "/111_9?"), {"id": "111_9", "message": "Hello Miami", "permalink_url": "https://fb/p"})]

    def test_ledger_blocks_second_publish(self):
        fake = Fake(self.routes({"id": "111_9"}))
        self.patch(fake)
        self.assertEqual(fb.publish_one(self.runs, FB_CFG, "2026-05-01", self.post)["status"], "verified")
        with self.assertRaisesRegex(RuntimeError, "ledger exists"):
            fb.publish_one(self.runs, FB_CFG, "2026-05-01", self.post)
        self.assertEqual(len(fake.posts("/feed")), 1)

    def test_uncertain_post_not_retried_and_verify_investigates(self):
        fake = Fake(self.routes(fb.ApiError("POST failed or timed out")))
        self.patch(fake)
        with self.assertRaisesRegex(RuntimeError, "uncertain"):
            fb.publish_one(self.runs, FB_CFG, "2026-05-01", self.post)
        self.assertEqual(self.ledger("facebook")["status"], "uncertain")
        with self.assertRaises(RuntimeError):
            fb.publish_one(self.runs, FB_CFG, "2026-05-01", self.post)
        self.assertEqual(len(fake.posts("/feed")), 1)
        fake2 = Fake([(("GET", "/111/posts"), {"data": [{"id": "111_9", "message": "Hello Miami"}]})]
                     + self.routes({})[2:])
        self.patch(fake2)
        self.assertEqual(fb.verify(self.runs, FB_CFG, "2026-05-01")["id"], "111_9")
        self.assertEqual(fake2.posts(""), [])

    def test_manifest_validation(self):
        with self.assertRaisesRegex(ValueError, "link"):
            fb.validate_post({"message": "x", "link": "https://evil.com/305doors.com"})
        with self.assertRaisesRegex(ValueError, "link"):
            fb.validate_post({"message": "x", "link": "http://305doors.com/a"})
        with self.assertRaisesRegex(ValueError, "link"):
            fb.validate_post({"message": "x", "link": "https://305doors.com.evil.com/a"})
        fb.validate_post(self.post)

    def test_unapproved_review_rejected(self):
        for review in ({"approved": False}, {"approved": "true"}, None):
            path = self.runs / "m.json"
            path.write_text(json.dumps({"date": "2026-05-01", "post": dict(self.post, review=review)}))
            with self.assertRaisesRegex(ValueError, "approval"):
                fb.load_manifest(path)
        path.write_text(json.dumps({"date": "2026-05-01", "post": dict(self.post, review=REVIEW)}))
        self.assertEqual(fb.load_manifest(path)[0], "2026-05-01")


class InstagramTests(Base):
    post = {"caption": "Garage doors in Miami. Link in bio. #miami", "image_url": IMG}

    def routes(self, container_status, publish=None):
        return [(("POST", "/222/media_publish"), publish if publish is not None else {"id": "m1"}),
                (("POST", "/222/media"), {"id": "c1"}),
                (("GET", "/c1?"), container_status),
                (("GET", "/m1?"), {"id": "m1", "caption": self.post["caption"], "permalink": "https://ig/p/1"})]

    def test_happy_path_polls_until_finished(self):
        fake = Fake(self.routes([{"status_code": "IN_PROGRESS"}, {"status_code": "FINISHED"}]))
        self.patch(fake)
        sleeps = []
        out = ig.publish_one(self.runs, IG_CFG, "2026-05-01", self.post, attempts=5, delay=1, sleep=sleeps.append)
        self.assertEqual(out["url"], "https://ig/p/1")
        self.assertEqual(sleeps, [1])
        led = self.ledger("instagram")
        self.assertEqual((led["status"], led["container_id"], led["media_id"]), ("verified", "c1", "m1"))

    def test_polling_timeout_publishes_nothing_and_allows_clean_rerun(self):
        fake = Fake(self.routes({"status_code": "IN_PROGRESS"}))
        self.patch(fake)
        with self.assertRaisesRegex(RuntimeError, "nothing was published"):
            ig.publish_one(self.runs, IG_CFG, "2026-05-01", self.post, attempts=3, delay=0, sleep=lambda s: None)
        self.assertEqual(fake.posts("media_publish"), [])
        self.assertEqual(self.ledger("instagram")["status"], "container_failed")
        self.patch(Fake(self.routes({"status_code": "FINISHED"})))
        self.assertEqual(ig.publish_one(self.runs, IG_CFG, "2026-05-01", self.post)["status"], "verified")

    def test_container_error_status_fails(self):
        self.patch(Fake(self.routes({"status_code": "ERROR"})))
        with self.assertRaisesRegex(RuntimeError, "nothing was published"):
            ig.publish_one(self.runs, IG_CFG, "2026-05-01", self.post, sleep=lambda s: None)

    def test_uncertain_publish_not_retried_and_verify_matches_caption(self):
        fake = Fake(self.routes({"status_code": "FINISHED"}, publish=fb.ApiError("POST failed or timed out")))
        self.patch(fake)
        with self.assertRaisesRegex(RuntimeError, "uncertain"):
            ig.publish_one(self.runs, IG_CFG, "2026-05-01", self.post, sleep=lambda s: None)
        self.assertEqual(self.ledger("instagram")["status"], "uncertain")
        with self.assertRaisesRegex(RuntimeError, "ledger exists"):
            ig.publish_one(self.runs, IG_CFG, "2026-05-01", self.post)
        self.assertEqual(len(fake.posts("media_publish")), 1)
        fake2 = Fake([(("GET", "/222/media"), {"data": [{"id": "m1", "caption": self.post["caption"]}]})]
                     + self.routes({})[3:])
        self.patch(fake2)
        self.assertEqual(ig.verify(self.runs, IG_CFG, "2026-05-01")["id"], "m1")
        self.assertEqual(fake2.posts(""), [])

    def test_validation(self):
        ok = dict(self.post)
        ig.validate_post(ok)
        bad = [dict(ok, image_url="http://305doors.com/a.jpg"), dict(ok, image_url="https://305doors.com/a.png"),
               dict(ok, image_url="https://other.com/a.jpg"), dict(ok, caption="x" * 2201),
               dict(ok, caption=" ".join(f"#t{i}" for i in range(31))), dict(ok, caption="see https://305doors.com"),
               dict(ok, caption=" ")]
        for post in bad:
            with self.assertRaises(ValueError, msg=post):
                ig.validate_post(post)
        ig.validate_post(dict(ok, caption=" ".join(f"#t{i}" for i in range(30))))

    def test_unapproved_review_rejected(self):
        path = self.runs / "m.json"
        path.write_text(json.dumps({"date": "2026-05-01", "post": dict(self.post, review={"approved": False})}))
        with self.assertRaisesRegex(ValueError, "approval"):
            fb.load_manifest(path)


class GbpTests(Base):
    post = {"summary": "Garage door springs wear out in Miami heat. Learn what to watch for.", "link": LINK}

    def routes(self, create):
        return [(("POST", "/localPosts"), create),
                (("GET", "localPosts/9"), {"name": "accounts/1/locations/2/localPosts/9",
                                           "summary": self.post["summary"], "state": "LIVE", "searchUrl": "https://g/p"})]

    def test_ledger_blocks_second_publish(self):
        fake = Fake(self.routes({"name": "accounts/1/locations/2/localPosts/9"}))
        self.patch(fake)
        self.assertEqual(gbp.publish_one(self.runs, GBP_CFG, "t", "2026-05-01", self.post)["status"], "verified")
        with self.assertRaisesRegex(RuntimeError, "ledger exists"):
            gbp.publish_one(self.runs, GBP_CFG, "t", "2026-05-01", self.post)
        self.assertEqual(len(fake.posts("localPosts")), 1)

    def test_uncertain_post_not_retried(self):
        fake = Fake(self.routes(fb.ApiError("POST failed or timed out")))
        self.patch(fake)
        with self.assertRaisesRegex(RuntimeError, "uncertain"):
            gbp.publish_one(self.runs, GBP_CFG, "t", "2026-05-01", self.post)
        with self.assertRaises(RuntimeError):
            gbp.publish_one(self.runs, GBP_CFG, "t", "2026-05-01", self.post)
        self.assertEqual(len(fake.posts("localPosts")), 1)
        fake2 = Fake([(("GET", "pageSize=25"), {"localPosts": [{"name": "accounts/1/locations/2/localPosts/9",
                                                                 "summary": self.post["summary"]}]})]
                     + self.routes({})[1:])
        self.patch(fake2)
        self.assertEqual(gbp.verify(self.runs, GBP_CFG, "t", "2026-05-01")["status"], "verified")

    def test_validation(self):
        gbp.validate_post(self.post)
        for post in (dict(self.post, summary="Call us at (305) 555-1234 today"),
                     dict(self.post, summary="Call 305-555-1234"),
                     dict(self.post, summary="Visit 305doors.com now"),
                     dict(self.post, summary="Visit https://305doors.com"),
                     dict(self.post, summary="x" * 1501),
                     dict(self.post, link="https://example.com/a"),
                     dict(self.post, image_url="http://305doors.com/a.jpg")):
            with self.assertRaises(ValueError, msg=post["summary"][:30]):
                gbp.validate_post(post)

    def test_unapproved_review_rejected(self):
        path = self.runs / "m.json"
        path.write_text(json.dumps({"date": "2026-05-01", "post": dict(self.post)}))
        with self.assertRaisesRegex(ValueError, "approval"):
            fb.load_manifest(path)


class PreflightTests(unittest.TestCase):
    def run_cli(self, module, expect):
        import contextlib, io
        err = io.StringIO()
        with mock.patch.object(fb.config, "load", return_value={}), contextlib.redirect_stderr(err):
            self.assertEqual(module.main(["preflight"]), 1)
        for key in expect:
            self.assertIn(key, err.getvalue())
        self.assertNotIn("Traceback", err.getvalue())

    def test_missing_keys_reported(self):
        self.run_cli(fb, ["META_PAGE_ID", "META_PAGE_ACCESS_TOKEN"])
        self.run_cli(ig, ["IG_USER_ID", "META_PAGE_ACCESS_TOKEN"])
        self.run_cli(gbp, ["GBP_CLIENT_ID", "GBP_REFRESH_TOKEN"])


if __name__ == "__main__":
    unittest.main()
