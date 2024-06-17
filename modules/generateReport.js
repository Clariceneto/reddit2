const fs = require('fs');

// Função para gerar relatório detalhado
function generateReport(posts, outputPath) {
  const report = posts.map(post => ({
    title: post.title,
    author: post.author,
    score: post.score,
    link: post.link,
    date: post.date,
    comments: post.comments.map(comment => ({
      author: comment.author,
      score: comment.score,
      body: comment.body,
      date: comment.date
    }))
  }));
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
}

module.exports = generateReport;
