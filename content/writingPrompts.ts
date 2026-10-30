export const writingPrompts = [
  {
    id: 'ask-for-help', title: 'Ask for help',
    task: 'Write a short message to a teacher or coworker. Explain what you need help with and ask a clear question.',
    starter: 'Hello …, I’m working on … Could you explain …? Thank you for your help.',
    checks: ['I explained what I need help with.', 'I asked a clear question.', 'I used a polite greeting and closing.'],
  },
  {
    id: 'make-a-plan', title: 'Make a plan',
    task: 'Write a message inviting a friend to do something. Suggest a place and time, and ask whether they are available.',
    starter: 'Hi …! Would you like to …? We could meet at … Does that work for you?',
    checks: ['I explained the activity.', 'I suggested a place and time.', 'I asked my friend to reply.'],
  },
] as const;
