interface SliderData {
  id: number;
  label: string;
  minValue: number;
  maxValue: number;
  initialValue: number;
}

const foodSlidersData: SliderData[] = [
  { id: 1, label: 'Beef', minValue: 0, maxValue: 8, initialValue: 0 },
  { id: 2, label: 'Lamb', minValue: 0, maxValue: 8, initialValue: 0 },
  { id: 3, label: 'Pork', minValue: 0, maxValue: 8, initialValue: 0 },
  { id: 4, label: 'Chicken/Fish', minValue: 0, maxValue: 8, initialValue: 0 },
];

export default foodSlidersData;
