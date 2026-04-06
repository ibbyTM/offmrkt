

## Install Meta Pixel

Add your Meta Pixel (ID `1122203629412338`) to `index.html`.

### Changes

**`index.html`**
- Add the Meta Pixel `<script>` tag inside `<head>` (after the existing meta tags, before `</head>`)
- Add the `<noscript><img>` fallback inside `<body>` (before the `#root` div) — per HTML5 spec, `<noscript>` with `<img>` must go in `<body>`, not `<head>`

### Result
The pixel will fire a `PageView` event on every page load across your entire site. You can then add custom events (Lead, CompleteRegistration, etc.) later from within React components if needed.

