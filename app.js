const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;



app.use(express.static(path.join(__dirname, 'public')));



app.use((req, res, next) => {
  //if (req.path.toLowerCase().startsWith('/admin')) { => safe code.
  if (req.path.startsWith('/admin')) {
    return res.status(403).sendFile(path.join(__dirname, 'public', '403.html'));
  }
  next();
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/admin', (req, res) => {
  const secret = 'flag:{You_are_a_Gallipoli_hacker}';
  const tplPath = path.join(__dirname, 'public', 'hacker.html');

  fs.readFile(tplPath, 'utf8', (err, tpl) => {
    if (err) return res.status(500).send('Server error');

    const html = tpl.replace('{{SECRET}}', escapeHtml(secret));
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
