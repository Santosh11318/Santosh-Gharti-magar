# Security Specification for Firestore Rules

## 1. Data Invariants
- Anyone can read published blog posts (`status == 'published'`).
- Only verified authenticated users whose email matches the admin list or configured owner can create, update, or delete blog posts.
- Draft posts can ONLY be read by authenticated admins.
- Authors cannot forge authorId to a different user's UID (`incoming().authorId == request.auth.uid`).
- Immutable fields: `createdAt` cannot be modified after creation.
- Strict size enforcement on all strings to protect against Denial of Wallet attacks.
- Document IDs must match strict regex `^[a-zA-Z0-9_-]+$` with length <= 128 chars.
- Catch-all default deny on all other paths.

## 2. The Dirty Dozen Payloads (Designed to Fail)
1. **Unauthenticated Write**: An unauthenticated user attempts to create a post in `/posts/{postId}`. (Expected: PERMISSION_DENIED)
2. **Author Spoofing**: An authenticated user attempts to set `authorId` to a different user's UID. (Expected: PERMISSION_DENIED)
3. **Payload Oversizing (Denial of Wallet)**: A post with a 2MB content string or 5KB title. (Expected: PERMISSION_DENIED)
4. **ID Poisoning**: A post created with illegal characters in postId (e.g. `/posts/../../../etc`). (Expected: PERMISSION_DENIED)
5. **Ghost Field Injection**: Adding an unpermitted field `isSuperUser: true` to a post document. (Expected: PERMISSION_DENIED)
6. **Immutable Field Tampering**: An update modifying the `createdAt` timestamp. (Expected: PERMISSION_DENIED)
7. **Draft Post Scraping**: An unauthenticated user attempting to list or read posts with `status == 'draft'`. (Expected: PERMISSION_DENIED)
8. **Admin Self-Escalation**: A non-admin user trying to write their own UID into `/admins/{uid}`. (Expected: PERMISSION_DENIED)
9. **Email Spoof Attack**: A user with an unverified email claiming admin rights. (Expected: PERMISSION_DENIED)
10. **Array Poisoning**: Injecting an array of 500 tags into `tags`. (Expected: PERMISSION_DENIED)
11. **Arbitrary Category**: Submitting a category not matching the allowed enum list. (Expected: PERMISSION_DENIED)
12. **Blanket Collection Traversal**: Querying undefined collections or shadow collections. (Expected: PERMISSION_DENIED)
