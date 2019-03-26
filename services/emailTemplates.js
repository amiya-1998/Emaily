const keys = require('../config/keys');

module.exports = survey => {
  return `
    <html>
      <body>
        <div style="text-align: justify">
          <h3>${survey.title}</h3>
          <p>please answer the following questions</p>
          <p>${survey.body}</p>
          <div>
            <a href="${keys.redirectDomain}/api/surveys/${survey.id}/yes">YES</a>
          </div>

          <div>
            <a href="${keys.redirectDomain}/api/surveys/${survey.id}/no">NO</a>
          </div>
        </div>
      </body>
    </html>
  `;
};
