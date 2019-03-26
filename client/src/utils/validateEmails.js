const re = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default emails => {
  const invalidEmails = emails
    .split(',')
    .map(email => email.trim())
    .filter(email => re.test(email) === false);

  if (invalidEmails.length) {
    let flag = false;
    invalidEmails.forEach(email => {
      if (email === '') {
        flag = true;
      }
    });
    if (flag) {
      return 'Remove Trailing comma';
    } else {
      return `These emails are invalid: ${invalidEmails}`;
    }
  }

  return;
};
