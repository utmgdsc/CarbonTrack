interface MultipleChoiceQuestion {
  id: number;
  question: string;
  options: string[];
}

const transportationQuestions: MultipleChoiceQuestion[] = [
  {
    id: 0,
    question: 'What kind of fuel does your vehicle use?',
    options: ['Gasoline', 'Diesel'],
  },
  {
    id: 1,
    question: 'Car:',
    options: ['> 10 km', '10-50 km', '50-200 km', '200-800 km', 'More than 800 km'],
  },
  {
    id: 2,
    question: 'Bus:',
    options: ['> 10 km', '10-50 km', '50-200 km', '200-800 km', 'More than 800 km'],
  },
  {
    id: 3,
    question: 'Train:',
    options: ['> 10 km', '10-50 km', '50-200 km', '200-800 km', 'More than 800 km'],
  },
  {
    id: 4,
    question: 'Motorbike:',
    options: ['> 10 km', '10-50 km', '50-200 km', '200-800 km', 'More than 800 km'],
  },
];

export default transportationQuestions;
