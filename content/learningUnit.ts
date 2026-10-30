/** Original LitSpark content. Resource links inform language targets; no source passages or worksheets are reproduced. */
export interface ChoiceQuestion { question: string; options: readonly string[]; correct: number; explanation: string }
export interface LearningUnit {
 id: string; number: number; theme: string; title: string; goal: string; draftId: string;
 level: string; duration: string; outcomes: readonly string[];
 words: readonly { word: string; meaning: string }[];
 practice: readonly ChoiceQuestion[];
 resources: readonly { title: string; url: string; kind: string }[];
 reading: { title: string; paragraphs: readonly string[]; vocabulary: string; questions: readonly ChoiceQuestion[] };
 writing: { title: string; task: string; starter: string; checks: readonly string[]; example: string; tip: string; challenge: string };
}

export const learningUnits: readonly LearningUnit[] = [
  {
    "id": "asking-for-help",
    "theme": "Everyday confidence",
    "title": "Asking for help",
    "goal": "Ask a teacher for help with something you don’t understand.",
    "draftId": "unit-asking-for-help",
    "reading": {
      "title": "A question after class",
      "paragraphs": [
        "Maya is reading her homework instructions. She understands the topic, but she isn’t sure which questions to answer. After class, she speaks to her teacher, Ms. Chen.",
        "“Excuse me, Ms. Chen. Could you explain which questions we need to answer?” Maya asks.",
        "“Of course,” says Ms. Chen. “Please answer questions one to three. Write a short paragraph for each answer.”",
        "“Thank you. So, three short paragraphs?” Maya checks.",
        "“That’s right. If you have another question, you can send me a message.” Maya feels ready to begin. Asking a clear question helped her understand what to do next."
      ],
      "vocabulary": "“Could you explain …?” is a polite way to ask for more information.",
      "questions": [
        {
          "question": "Why does Maya ask for help?",
          "options": [
            "She wants to change classes.",
            "She isn’t sure which questions to answer.",
            "She has finished all her work."
          ],
          "correct": 1,
          "explanation": "Maya understands the topic, but needs to know which homework questions to answer."
        },
        {
          "question": "Which phrase politely asks for an explanation?",
          "options": [
            "Could you explain …?",
            "I already know that.",
            "I’ll do it tomorrow."
          ],
          "correct": 0,
          "explanation": "“Could you explain …?” tells the other person you would like help understanding."
        },
        {
          "question": "What does Maya need to write?",
          "options": [
            "One long essay.",
            "A message to a friend.",
            "Three short paragraphs."
          ],
          "correct": 2,
          "explanation": "Ms. Chen asks for questions one to three, with a short paragraph for each."
        }
      ]
    },
    "writing": {
      "title": "Ask a teacher for help",
      "task": "Write a short message to a teacher. Explain what you don’t understand and ask a clear question. You can use a real or imagined school task.",
      "starter": "Hi …, I’m working on … Could you explain …? Thank you!",
      "checks": [
        "I explained what I need help with.",
        "I asked a clear question.",
        "I used a polite greeting and closing."
      ],
      "example": "Hello Mr. Ali, I’m working on the science poster. Could you explain when we need to bring our two examples? Thank you for your help!",
      "tip": "Your question should name the task and the detail you need. More than one polite wording can work; a perfect grammar score is not the goal.",
      "challenge": "Imagine you received an answer. Add a sentence checking one detail: ‘So, … Is that right?’"
    },
    "number": 1,
    "level": "A1–A2 practice",
    "duration": "15–20 minutes",
    "outcomes": [
      "Find the important detail in an instruction.",
      "Ask a specific question politely.",
      "Check that you understood the answer."
    ],
    "words": [
      {
        "word": "instructions",
        "meaning": "Information that tells you what to do."
      },
      {
        "word": "explain",
        "meaning": "Make an idea clear so someone can understand it."
      },
      {
        "word": "paragraph",
        "meaning": "A group of sentences about one main idea."
      }
    ],
    "practice": [
      {
        "question": "You understand the topic, but not the deadline. Which question gives the teacher enough detail?",
        "options": [
          "I don’t get anything.",
          "Could you explain when the science poster is due?",
          "Do the poster for me."
        ],
        "correct": 1,
        "explanation": "Name the task and the missing information: the science poster and its deadline. A specific question is easier to answer."
      },
      {
        "question": "Complete the request: Could you ___ the first step again, please?",
        "options": [
          "explaining",
          "explained",
          "explain"
        ],
        "correct": 2,
        "explanation": "After could you, use the base form: explain. Please can make the request friendly."
      },
      {
        "question": "A teacher says: ‘Bring two examples on Monday.’ How can you check your understanding?",
        "options": [
          "So, two examples for Monday. Is that right?",
          "So, ten examples today?",
          "I won’t ask any questions."
        ],
        "correct": 0,
        "explanation": "Repeat the number and day, then ask for confirmation. This checks the details rather than guessing."
      }
    ],
    "resources": [
      {
        "title": "Polite requests · British Council",
        "url": "https://www.britishcouncil.in/blog/how-be-polite-english",
        "kind": "Language guide"
      }
    ]
  },
  {
    "id": "making-plans",
    "number": 2,
    "theme": "Connecting with others",
    "title": "Making plans",
    "goal": "Suggest an activity, offer another time, and confirm a plan.",
    "draftId": "unit-making-plans",
    "level": "A2 practice",
    "duration": "15–20 minutes",
    "outcomes": [
      "Find the final day, time, and place in messages.",
      "Make a suggestion and respond kindly.",
      "Confirm a plan so both people know what to do."
    ],
    "words": [
      {
        "word": "free",
        "meaning": "Available; not busy at that time."
      },
      {
        "word": "instead",
        "meaning": "In place of another choice."
      },
      {
        "word": "confirm",
        "meaning": "Check or say that a plan is agreed."
      }
    ],
    "reading": {
      "title": "A library study plan",
      "paragraphs": [
        "Maya wants to practise English with her classmate Noor. She sends a message: “Are you free on Wednesday? How about studying together at the public library at four?”",
        "Noor replies: “I have football practice on Wednesday. Could we meet on Thursday instead?”",
        "“Thursday works for me,” Maya writes. “Let’s meet at half past four by the library entrance.”",
        "Noor asks, “Could you explain which entrance? There are two.” Maya replies, “The main entrance, next to the bus stop.”",
        "“Great! Thursday at 4:30, by the main entrance. I’ll bring my notebook,” Noor writes. Now they both know when and where to meet."
      ],
      "vocabulary": "Use “How about” with an -ing form to suggest an activity. Use “on” with a day and “at” with a clock time.",
      "questions": [
        {
          "question": "What is the main purpose of the messages?",
          "options": [
            "To cancel all study sessions.",
            "To arrange a time and place to study.",
            "To ask a librarian for a new book."
          ],
          "correct": 1,
          "explanation": "The classmates suggest, change, and confirm a study plan. The library is the meeting place, not the person receiving a request."
        },
        {
          "question": "Which plan do Maya and Noor finally agree on?",
          "options": [
            "Wednesday at 4:00, inside the library.",
            "Thursday at 4:00, at football practice.",
            "Thursday at 4:30, by the main entrance."
          ],
          "correct": 2,
          "explanation": "The first suggestion changes. The final message confirms Thursday at 4:30 by the main entrance."
        },
        {
          "question": "Why does Noor ask which entrance Maya means?",
          "options": [
            "To make the meeting place clear.",
            "To change the activity to football.",
            "To ask for a later day."
          ],
          "correct": 0,
          "explanation": "The library has two entrances. Asking for clarification, as in Unit 1, prevents a misunderstanding."
        }
      ]
    },
    "practice": [
      {
        "question": "Complete the suggestion: How about ___ in the park?",
        "options": [
          "meet",
          "meeting",
          "met"
        ],
        "correct": 1,
        "explanation": "How about is followed by a noun or an -ing form. Here, meeting names the suggested activity."
      },
      {
        "question": "Your friend suggests Tuesday, but you are busy. Which response keeps the plan moving?",
        "options": [
          "No. Never ask me again.",
          "Tuesday is a day.",
          "I’m busy on Tuesday. Could we meet on Friday instead?"
        ],
        "correct": 2,
        "explanation": "Give a brief reason and an alternative. This response says the suggested day does not work while offering another option."
      },
      {
        "question": "Which message confirms enough information to meet?",
        "options": [
          "Great! Friday at 3:15, outside the school office.",
          "Great! Some time, somewhere.",
          "I like Fridays."
        ],
        "correct": 0,
        "explanation": "A clear confirmation repeats the day, time, and place. The other messages leave important details missing."
      }
    ],
    "writing": {
      "title": "Invite a classmate",
      "task": "Write 3–5 short sentences to a classmate. Suggest a free activity, give a day, time, and place, and ask whether the plan works. You may invent all the details.",
      "starter": "Hi …! How about …ing …? Let’s meet on … at … by … . Does that work for you?",
      "checks": [
        "I suggested an activity and gave a day and time.",
        "I named a clear meeting place.",
        "I asked my classmate to confirm or suggest another time."
      ],
      "example": "Hi Leo! How about practising our presentation together? Let’s meet on Friday at 3:15 outside the school office. Does that work for you? If you’re busy, we could meet on Monday instead.",
      "tip": "Read your message as if you were your classmate. Could you arrive at the right place at the right time without asking another question?",
      "challenge": "Your classmate cannot come at that time. Add a friendly reply with an alternative day or time."
    },
    "resources": [
      {
        "title": "Making plans · British Council Teens",
        "url": "https://learnenglishteens.britishcouncil.org/skills/speaking/a2-speaking/making-plans",
        "kind": "Video + transcript"
      },
      {
        "title": "Messaging to make plans · British Council",
        "url": "https://learnenglish.britishcouncil.org/free-resources/writing/a2/messaging-make-plans",
        "kind": "Writing module"
      }
    ]
  },
  {
    "id": "sharing-opinions",
    "number": 3,
    "theme": "Finding your voice",
    "title": "Sharing an opinion",
    "goal": "Share a preference, explain a reason, and respond respectfully.",
    "draftId": "unit-sharing-opinions",
    "level": "A2 practice",
    "duration": "15–20 minutes",
    "outcomes": [
      "Separate a preference from a reason.",
      "Connect an opinion and a reason with because.",
      "Respond to a different view and invite a reply."
    ],
    "words": [
      {
        "word": "opinion",
        "meaning": "What someone thinks or feels about something."
      },
      {
        "word": "reason",
        "meaning": "An explanation of why you think or do something."
      },
      {
        "word": "prefer",
        "meaning": "Like one choice more than another."
      }
    ],
    "reading": {
      "title": "Choosing a club activity",
      "paragraphs": [
        "Maya, Noor, and Leo are choosing an activity for their school English club. They can make a short podcast or create a photo story.",
        "“I think a photo story would be a good choice because pictures can help us explain new words,” Maya says.",
        "Noor replies, “I see your point, but I prefer a podcast because we can practise speaking and listening.”",
        "Leo says, “Both ideas could work. We have one school tablet for photos, but we can record a podcast on the classroom computer.”",
        "Maya asks, “How about making a two-minute podcast first? We could add a picture for each new word.” Noor agrees. They plan to meet on Tuesday at lunchtime in the classroom."
      ],
      "vocabulary": "An opinion tells what you think. A reason explains why. “Because” connects the two. You can disagree with an idea while respecting the person.",
      "questions": [
        {
          "question": "Why does Maya first prefer a photo story?",
          "options": [
            "Pictures can help explain new words.",
            "She dislikes everyone in the club.",
            "There are no computers at school."
          ],
          "correct": 0,
          "explanation": "Maya gives a reason after because: pictures can explain new words. The text does not say that she dislikes the club."
        },
        {
          "question": "Which sentence expresses a preference rather than the equipment available?",
          "options": [
            "We have one school tablet.",
            "I prefer a podcast.",
            "We can record on the classroom computer."
          ],
          "correct": 1,
          "explanation": "I prefer marks Noor’s personal choice. The other sentences describe resources the group can use."
        },
        {
          "question": "How does the group use both ideas in the final plan?",
          "options": [
            "They stop the club.",
            "They make only a long photo story.",
            "They make a short podcast with pictures for new words."
          ],
          "correct": 2,
          "explanation": "The final suggestion combines a podcast with pictures. It responds to both viewpoints and is followed by a meeting plan."
        }
      ]
    },
    "practice": [
      {
        "question": "Which sentence gives an opinion AND a relevant reason?",
        "options": [
          "Podcasts are podcasts.",
          "I prefer podcasts because I can hear how words sound.",
          "Everyone must like podcasts."
        ],
        "correct": 1,
        "explanation": "The sentence names a preference and explains it. A reason helps someone understand your view; it does not have to persuade everyone."
      },
      {
        "question": "A friend prefers a different activity. Which response disagrees respectfully?",
        "options": [
          "That’s a stupid idea.",
          "You are not allowed to choose.",
          "I see your point, but I would prefer a photo story."
        ],
        "correct": 2,
        "explanation": "Acknowledge the other view and state your own preference. You can disagree without insulting the person."
      },
      {
        "question": "Review earlier units: which sentence invites a reply AND helps make a plan?",
        "options": [
          "Could we meet on Thursday to try your idea?",
          "My opinion is the only one.",
          "Because Thursday."
        ],
        "correct": 0,
        "explanation": "Could we asks politely and suggests a day. This brings together asking clearly, making plans, and responding to an opinion."
      }
    ],
    "writing": {
      "title": "Choose an English club activity",
      "task": "Choose a podcast, photo story, or another free club activity. Write 4–6 short sentences to the club. Give your opinion and a reason, acknowledge another possible choice, and ask what others think. You may use an imagined club.",
      "starter": "I think … would be a good activity because … . A … could also work. I would prefer … . What do you think?",
      "checks": [
        "I stated my opinion and gave a reason with because.",
        "I mentioned another idea respectfully.",
        "I invited a reply or suggested a next step."
      ],
      "example": "I think a word game would be a good club activity because we can learn together. A podcast could also help us practise listening. I would prefer the game this week because we can all join in at once. What do you think? Could we try it on Thursday?",
      "tip": "There is no single correct opinion. Check whether your reason supports your choice and whether your message leaves room for someone else’s view.",
      "challenge": "Connect all three units: add a polite question about the activity and suggest a day, time, and place to try it."
    },
    "resources": [
      {
        "title": "Giving your opinion · British Council Teens",
        "url": "https://learnenglishteens.britishcouncil.org/skills/speaking/a2-speaking/giving-your-opinion",
        "kind": "Video + practice"
      },
      {
        "title": "Polite opinions · British Council",
        "url": "https://www.britishcouncil.in/blog/how-be-polite-english",
        "kind": "Language guide"
      }
    ]
  }
];

export const unitActivities = [
  { id: 'reading', title: 'Read and understand', description: 'A short story and three questions.', icon: 'book' },
  { id: 'writing', title: 'Write a message', description: 'Try it in your own words.', icon: 'pencil' },
  { id: 'review', title: 'Review your words', description: 'Check, revise, and finish your unit.', icon: 'review' },
] as const;
export type UnitStep = typeof unitActivities[number]['id'];


export const learningUnit = learningUnits[0];
export const findLearningUnit = (id: string) => learningUnits.find(unit => unit.id === id);
