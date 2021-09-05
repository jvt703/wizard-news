const express = require("express");
const app = express();
const morgan = require('morgan')
const postBank  = require('./postBank')
const volleyball = require('volleyball')

app.use(volleyball)

const { PORT = 1337 } = process.env;

app.use(morgan('dev'))
app.use(express.static('public'))

app.get('/posts/:id', (req, res) => {
  const id = req.params.id;
  const post = postBank.find(id);
  if(!post.id){
    throw new Error('Not Found')
  }
  res.send(`<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${`
        <div class='news-item'>
          <p>
            <span class="news-position">${post.id}. ▲</span>${post.title}
            <small>(by ${post.name})</small>
          </p>
          <p>
          ${post.content}
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      }
    </div>
  </body>
</html>`);
});


app.get("/", (req, res) => {
    const posts = postBank.list();
    const html = `<!DOCTYPE html>
  <html>
  <head>
    <title>Wizard News</title>
    <link rel="stylesheet" href="/style.css" />
  </head>
  <body>
    <div class="news-list">
      <header><img src="/logo.png"/>Wizard News</header>
      ${posts.map(post => `
        <div class='news-item'>
          <p>
            <span class="news-position"> <a href="/posts/${post.id}">${post.title}</a>. ▲</span>
            <small>(by ${post.name})</small>
          </p>
          <small class="news-info">
            ${post.upvotes} upvotes | ${post.date}
          </small>
        </div>`
      ).join('')}
    </div>
  </body>
</html>`;
res.send(html)
  })

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(404).send( `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Wizard News</title>
      <link rel="stylesheet" href="/style.css" />
    </head>
    <body>
      <header><img src="/logo.png"/>Wizard News</header>
      <div class="not-found">
        <p>Accio Page! 🧙‍♀️ ... Page Not Found</p>
        <img src="/dumbledore-404.gif" />
      </div>
    </body>
    </html>`)
})

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});


