const requireLogin = require('../../middlewares/requireMiddleware');
const requireCredits = require('../../middlewares/requireCredits');
const mongoose = require('mongoose');
const Mailer = require('../../services/Mailer');
const surveyTemplate = require('../../services/emailTemplates');
const _ = require('lodash');
const Path = require('path-parser').default;
const { URL } = require('url');

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting');
  });

  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    }); // doesn;t give the recipients list.

    res.send(surveys);
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    const mailer = new Mailer(survey, surveyTemplate(survey));
    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');
    try {
      _.chain(req.body)
        .map(({ email, url }) => {
          const match = p.test(new URL(url).pathname);
          if (match) {
            return { email, surveyId: match.surveyId, choice: match.choice };
          }
        })
        .compact() // Remove all null objects
        .uniqBy('email', 'surveyId') // A user can only vote once in a survey
        .each(({ surveyId, email, choice }) => {
          try {
            Survey.updateOne(
              {
                _id: surveyId,
                recipients: {
                  $elemMatch: { email: email, responded: false }
                }
              },
              {
                $inc: { [choice]: 1 },
                $set: { 'recipients.$.responded': true },
                lastResponded: new Date()
              }
            ).exec();
          } catch (err) {
            console.log(err);
          }
        })
        .value();
    } catch (err) {
      console.log(err);
    }

    res.send({});
  });
};
