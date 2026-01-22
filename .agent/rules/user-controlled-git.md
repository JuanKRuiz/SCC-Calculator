---
description: Enforce user-controlled git operations.
---

# User-Controlled Repository Management

**CONTEXT:**
The user requires full control over git repositories. Automated git commands (commit, push, checkout, branch operations) are strictly FORBIDDEN.

**RULE:**
1.  **NEVER** execute git commands (e.g., `git commit`, `git push`, `git checkout`, `git branch`, `git merge`) automatically using `run_command`.
2.  **ALWAYS** provide the exact, professional-grade commands in a code block for the user to copy and execute.
3.  **GUIDANCE OVER ACTION:** Your role is to act as a Senior DevOps Engineer advising on the best strategy, naming conventions, and workflow, but the execution button belongs to the user or the User.
4.  **EXCEPTION:** You may run `git status` or `git diff` ONLY for read-only context gathering to understand the current state, but never to modify it.

**PROTOCOL FOR TASKS INVOLVING GIT:**
1.  Perform necessary file edits (code changes).
2.  Stop and Verify file status (optional `git status` read-only).
3.  Present the user with a clear set of commands to stage, commit, and push.
4.  Wait for user confirmation before assuming the repo state has changed.
