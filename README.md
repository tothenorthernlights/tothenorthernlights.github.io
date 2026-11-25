# Adding a class

1. In [index.html](./index.html), add a class entry under the topic's `classes` array. Give it a unique `id` (for example, `py-204`).
2. Create `content/py-204.html` using that exact ID. Put only the lesson HTML fragment in the file; leave out `<!doctype>`, `<html>`, `<head>`, and `<body>`.
3. Open the topic and class to check it in the modal.

The class ID is also the content filename: `id: "py-204"` loads `content/py-204.html`.

## Adding a quiz

1. Copy [quiz-py-201.json](./content/quiz-py-201.json) to `content/quiz-py-202.json` and edit its title and questions.
2. Add `<a href="quiz.html?id=quiz-py-202">Take the quiz</a>` to `content/py-202.html`.

The lesson link connects the quiz; the filename and URL ID must match.
