---
description: Description of what to look for when reviewing a PR
---

# ✅ Reviewing pull requests

#### Make sure all checks are passing.

All automated checks (linting, formatting, and testing) must be passed. If you notice the pipeline failed, request changes to the PR using the GitHub UI, and let the author know that checks failed.

#### Manual code review

When reviewing a pull request, it's important to understand the problem the author was trying to solve first. You can use the PR description. Then:

* **Is the logic correct?** Make sure you understand it first. Can it be simplified? If so, suggest it to the author as a comment in the line where the simplification can make sense.
* **Did the author cover all edge cases?** If you can think of any missing, suggest them as comments in the file.
* **Does the code make sense?** If the code is missing comments or is confusing to you, it will probably also be for any teammate trying to iterate it in the future. Whenever this happens, leave comments in the file either suggesting an improvement or asking for a comment. The author will either iterate on the changes or provide reasoning for their approach.
