---
description: Load JuanK Personal Directive Stack
---

# Load Personal Stack Workflow

This workflow loads the personal directive stack from `tmp/personal_stack.md` as the primary context directive.

## Steps

1. **Verify Personal Stack Exists**
   ```bash
   ls tmp/personal_stack.md
   ```

2. **Load the Stack**
   - Read the entire contents of `tmp/personal_stack.md`
   - This file contains the assembled JK-PERSONAL STACK modules
   - Use the @[tmp/personal_stack.md] mention to load it into context

## Important Notes

- The `tmp/` directory is in `.gitignore` and should NEVER be committed
- This workflow can be committed to the repo as it only references the file
- The personal stack contains private persona directives and preferences
- Update `tmp/personal_stack.md` whenever directive modules change

## Usage

When starting a new session or when context needs to be refreshed:

```
@/load-personal-stack
```

This will ensure the LLM operates under your personal technical preferences, communication style, and architectural frameworks.
