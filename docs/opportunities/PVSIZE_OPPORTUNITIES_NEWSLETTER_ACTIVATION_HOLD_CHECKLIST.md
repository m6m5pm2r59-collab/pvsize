---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: c4e42f760229254c82de8cc2300dc5c9_dc5bbbb28e3311f196d8525400f8a581
    ReservedCode1: Ati6+zgGQ+fKe7eO6docNNU6+EDDq0LzZabey+M/ichj8UvjoUBNxeVYncx+rfxJsEBLFvCIVM3hKPHW+6SGHG4Yj+0pZMlsVgOwadwNNvtb8MYBdKNOK7mET35nyL21oFT4MGXXENPJRUXwgtLj/Tx3rq+LUcv3tkLEbpvIOTXCFf6Eeq36t1leYeY=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: c4e42f760229254c82de8cc2300dc5c9_dc5bbbb28e3311f196d8525400f8a581
    ReservedCode2: Ati6+zgGQ+fKe7eO6docNNU6+EDDq0LzZabey+M/ichj8UvjoUBNxeVYncx+rfxJsEBLFvCIVM3hKPHW+6SGHG4Yj+0pZMlsVgOwadwNNvtb8MYBdKNOK7mET35nyL21oFT4MGXXENPJRUXwgtLj/Tx3rq+LUcv3tkLEbpvIOTXCFf6Eeq36t1leYeY=
---

# PVSize Opportunities Phase 5C — Newsletter Activation Hold Checklist

Status: noindex-only planning gate

Created: 2026-08-02

## NEWSLETTER_ACTIVATION_HOLD: REQUIRED_BEFORE_ACTIVATION

Newsletter activation for Opportunities requires:

- Consent mechanism must exist (GDPR-compliant opt-in).
- Analytics event tracking for subscription events must exist.
- At least one record is `review_status: published`.
- Published-record transition preflight has passed.
- Production QA signoff is recorded.

## NEWSLETTER_ACTIVATION_HOLD: CONSENT_REQUIREMENT

- Email collection requires explicit opt-in consent.
- Consent language must be clear about frequency and content.
- Unsubscribe mechanism must be present in every email.
- Privacy policy link must be present.
- Double opt-in is recommended but not required for MVP.

## NEWSLETTER_ACTIVATION_HOLD: ANALYTICS_EVENT_REQUIREMENT

- `newsletter_subscribe` event must fire on successful subscription.
- `newsletter_unsubscribe` event must fire on successful unsubscribe.
- `newsletter_open` and `newsletter_click` events should be tracked if possible.
- Event data must include opportunity category/source metadata where applicable.

## NEWSLETTER_ACTIVATION_HOLD: PUBLISHED_RECORD_ONLY_CONTENT_RULE

- Newsletter content may only reference published records.
- No draft, discovered, or needs_review records in newsletter content.
- Newsletter must not promise publication dates for non-published records.

## NEWSLETTER_ACTIVATION_HOLD: FORM_AND_OUTPUT_HOLD_CONDITIONS

Form/output activation is held until:

- Consent mechanism is implemented and tested.
- Analytics events are wired and verified.
- At least one published record exists.
- Published-record preflight matrix passes.
- Indexed output preflight matrix passes.
- Newsletter rules verifier passes.

## NEWSLETTER_ACTIVATION_HOLD: ACTIVATION_RELEASE_CONDITIONS

- All hold conditions above are cleared.
- Newsletter form is deployed and accessible.
- Newsletter form submits successfully and triggers analytics events.
- Test email is delivered through the configured provider.
- Production QA evidence bundle records newsletter activation.

## NEWSLETTER_ACTIVATION_HOLD: CURRENT_NO_NEWSLETTER_OUTPUT

No newsletter output is active:

- No newsletter subscription form exists on Opportunities pages.
- No email input field exists on Opportunities pages.
- No newsletter API endpoint is wired.
- No newsletter-related analytics events are present.
- Phase 5C remains Publication Pipeline.
- Phase 5C is not Closed.

## NEWSLETTER_ACTIVATION_HOLD: VERIFICATION_COMMANDS

```bash
node src/tools/verify-opportunities-newsletter-activation-hold-checklist.js --self-test
node src/tools/verify-opportunities-all.js
git diff --check
```
*（内容由AI生成，仅供参考）*
