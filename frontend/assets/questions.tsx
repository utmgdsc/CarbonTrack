interface MultipleChoiceQuestion {
  question: string;
  options: string[];
}

const transportationQuestions: MultipleChoiceQuestion[] = [
  {
    question: 'What kind of fuel does your vehicle use?',
    options: ['Gasoline', 'Diesel'],
  },
  {
    question: 'Vehicle #1',
    options: ['> 10 km', '10-50 km', '50-200 km', '200-800 km', 'More than 800 km'],
  },
  {
    question: 'Bus',
    options: ['> 10 km', '10-50 km', '50-200 km', '200-800 km', 'More than 800 km'],
  },
  {
    question: 'Train',
    options: ['> 10 km', '10-50 km', '50-200 km', '200-800 km', 'More than 800 km'],
  },
  {
    question: 'Motorbike',
    options: ['> 10 km', '10-50 km', '50-200 km', '200-800 km', 'More than 800 km'],
  },
];

export default transportationQuestions;
