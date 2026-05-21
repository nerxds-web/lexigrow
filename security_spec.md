# LexiGrow Security Specification

## 1. Data Invariants
- **User Integrity**: A user can only create and manage their own profile in `/users/{userId}`.
- **Ownership**: Every word in `/users/{userId}/vocabulary/{wordId}` must have a `userId` field matching the parent `{userId}` and the `request.auth.uid`.
- **Temporal Integrity**: `createdAt` and `updatedAt` (or `lastReviewed`) must be validated against `request.time` where applicable.
- **Schema Safety**: Words must have reasonable size limits to prevent resource exhaustion.

## 2. The Dirty Dozen Payloads (Targeting PERMISSION_DENIED)

### P1: Identity Spoofing (Create other's profile)
- **Path**: `/users/attacker_id`
- **Payload**: `{ "uid": "victim_id", "email": "victim@example.com", ... }`
- **Reason**: `request.auth.uid` does not match `{userId}`.

### P2: Resource Poisoning (Large IDs)
- **Path**: `/users/very_long_id_exceeding_128_chars_...`
- **Payload**: `{ ... }`
- **Reason**: `isValidId()` check fails.

### P3: Cross-User Write (Add word to others)
- **Path**: `/users/victim_id/vocabulary/new_word`
- **Payload**: `{ "userId": "victim_id", "word": "hack", ... }`
- **Reason**: Parent `userId` must match `request.auth.uid`.

### P4: Shadow Field Injection
- **Path**: `/users/my_id/vocabulary/word123`
- **Payload**: `{ "userId": "my_id", "isAdmin": true, "word": "test", ... }`
- **Reason**: `affectedKeys().hasOnly()` or strict schema size check.

### P5: Unauthorized List Query
- **Query**: `collectionGroup('vocabulary')` (if allowed) or `collection('/users/victim_id/vocabulary')`
- **Reason**: Rules must enforce `resource.data.userId == request.auth.uid` or parent match.

### P6: Email Spoofing
- **Action**: Read private user data when `email_verified` is false in token but true in payload.
- **Reason**: Rules must check `request.auth.token.email_verified == true`.

### P7: Moving Resource (Update userId)
- **Action**: `update` on `/users/my_id/vocabulary/w1` changing `userId` to `victim_id`.
- **Reason**: `incoming().userId == existing().userId`.

### P8: Denial of Wallet (Massive string)
- **Action**: `create` word with a 1MB `example` field.
- **Reason**: `.size() <= 1000` check on strings.

### P9: Privilege Escalation
- **Action**: `update` on `/users/my_id` setting a custom `role` field.
- **Reason**: `affectedKeys().hasOnly(['displayName', 'photoURL'])`.

### P10: Orphaned Write
- **Action**: Create a word for a user ID that doesn't exist in `/users`.
- **Reason**: `exists(/databases/$(database)/documents/users/$(incoming().userId))`.

### P11: Temporal Spoofing
- **Action**: Create word with `createdAt` set to 1 year ago.
- **Reason**: `incoming().createdAt == request.time`.

### P12: Deleting Others
- **Action**: `delete` on `/users/victim_id`.
- **Reason**: `isOwner()` check.
