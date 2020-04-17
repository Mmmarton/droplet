module.exports = {
  types: [
    { value: 'feature', name: '   A new feature' },
    { value: 'fix', name: '            A bugfix' },
    {
      value: 'refactor',
      name: '  A change in code whithout change in functionality'
    },
    {
      value: 'config',
      name: '     Edit configuration files'
    }
  ],

  scopes: [],

  allowTicketNumber: false,
  isTicketNumberRequired: false,
  ticketNumberPrefix: 'TICKET-',
  ticketNumberRegExp: '\\d{1,5}',

  messages: {
    type: "Select the type of change that you're committing:",
    subject: 'Write a SHORT, IMPERATIVE tense description of the change:\n',
    body:
      'Provide a LONGER description of the change (optional). Use "|" to break new line:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?'
  },

  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix'],

  skipQuestions: ['scope', 'breaking', 'footer'],

  maxSubjectLength: 100,
  subjectLimit: 100,
  breaklineChar: '|'
};
