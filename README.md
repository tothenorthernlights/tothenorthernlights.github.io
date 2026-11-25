# Adding a class

1. In [index.html](./index.html), add a class entry under the topic's `classes` array. Give it a unique `id` (for example, `phys-204`).
2. Create `content/phys-204.html` using that exact ID. Put only the lesson HTML fragment in the file; leave out `<!doctype>`, `<html>`, `<head>`, and `<body>`.
3. Open the topic and class to check it in the modal.

The class ID is also the content filename: `id: "phys-204"` loads `content/phys-204.html`.

## Adding a quiz

1. Copy [quiz-phys-201.json](./content/quiz-phys-201.json) to `content/quiz-phys-202.json` and edit its title and questions.
2. Add `<a href="quiz.html?id=quiz-phys-202">Take the quiz</a>` to `content/phys-202.html`.

The lesson link connects the quiz; the filename and URL ID must match.
