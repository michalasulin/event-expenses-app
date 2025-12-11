const eventsData = [
  {
    id: 'evt-1',
    name: "אירוסין ז' כסלו",
    date: '2025-11-09',
    notes: 'אירוסין בבית ההורים',
    expenses: [
      {
        id: 'exp-1',
        description: 'אולם',
        category: 'אולם',
        amount: 10000,
        date: '2025-10-01',
        status: 'paid',
        paymentMethod: 'check',
        notes: 'שולם במעמד הסגירה'
      },
      {
        id: 'exp-2',
        description: 'צילום סטילס',
        category: 'צילום',
        amount: 4000,
        date: '2025-10-10',
        status: 'partial',
        paymentMethod: 'transfer',
        notes: 'שולם מקדמה'
      },
      {
        id: 'exp-3',
        description: 'עיצוב פרחים',
        category: 'עיצוב',
        amount: 2000,
        date: '2025-10-20',
        status: 'unpaid',
        paymentMethod: 'other',
        notes: ''
      }
    ]
  },
  {
    id: 'evt-2',
    name: 'שבת חתן',
    date: '2025-12-20',
    notes: 'אצל המשפחה',
    expenses: [
      {
        id: 'exp-4',
        description: 'אוכל לשבת',
        category: 'אוכל',
        amount: 6000,
        date: '2025-12-10',
        status: 'unpaid',
        paymentMethod: 'transfer',
        notes: ''
      },
      {
        id: 'exp-5',
        description: 'שירה',
        category: 'מוזיקה',
        amount: 2500,
        date: '2025-12-12',
        status: 'unpaid',
        paymentMethod: 'cash',
        notes: ''
      }
    ]
  },
  {
    id: 'evt-3',
    name: 'שבע ברכות',
    date: '2026-01-05',
    notes: '',
    expenses: [
      {
        id: 'exp-6',
        description: 'קייטרינג',
        category: 'אוכל',
        amount: 3000,
        date: '2025-12-30',
        status: 'unpaid',
        paymentMethod: 'transfer',
        notes: ''
      }
    ]
  }
];

export default eventsData;
