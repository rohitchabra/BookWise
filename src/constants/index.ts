export const FIELD_NAMES = {
  fullName: "Full name",
  email: "Email",
  universityId: "University ID Number",
  password: "Password",
  universityCard: "Upload University ID Card",
} as const;

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  universityId: "number",
  password: "password",
} as const;

export const sampleBooks = [
  {
    id: "1",
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "Fantasy / Fiction",
    rating: 4.6,
    totalCopies: 20,
    availableCopies: 10,
    description:
      "A dazzling novel about all the choices that go into a life well lived, from the internationally bestselling author of Reasons to Stay Alive and How To Stop Time.",
    coverColor: "#1c1f40",
    coverUrl: "https://m.media-amazon.com/images/I/81J6APjwxlL._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "https://www.youtube.com/embed/example",
    summary:
      "Nora Seed finds herself faced with the possibility of changing her life for a new one, following a different career, undoing old breakups, or realizing her dreams of becoming a glaciologist. She must search within herself as she travels through the Midnight Library to decide what is truly fulfilling in life, and what she truly wants.",
  },
  {
    id: "2",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-Help / Productivity",
    rating: 4.9,
    totalCopies: 35,
    availableCopies: 22,
    description:
      "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you how to form good habits, break bad ones, and master tiny behaviors that lead to remarkable results.",
    coverColor: "#fffdf6",
    coverUrl: "https://m.media-amazon.com/images/I/81F90H7hnML._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "https://www.youtube.com/embed/example",
    summary:
      "Tiny Changes, Remarkable Results. Atomic Habits will reshape the way you think about progress and success, and give you the tools you need to transform your habits.",
  },
  {
    id: "3",
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Classic / Romance",
    rating: 4.5,
    totalCopies: 18,
    availableCopies: 12,
    description:
      "A classic novel of manners that follows the emotional development of Elizabeth Bennet, who learns the error of making hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
    coverColor: "#f8e1dd",
    coverUrl:
      "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "https://www.youtube.com/embed/example",
    summary:
      "Elizabeth Bennet navigates love, family, and social expectations in Regency England, discovering that first impressions can be misleading.",
  },
  {
    id: "4",
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "Thriller / Mystery",
    rating: 4.4,
    totalCopies: 25,
    availableCopies: 8,
    description:
      "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house overlooking a park in one of London's most desirable areas. One evening her husband Gabriel returns home late from a fashion shoot, and Alicia shoots him five times in the face, and then never speaks another word.",
    coverColor: "#253040",
    coverUrl:
      "https://m.media-amazon.com/images/I/91lslnZ-btL._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "https://www.youtube.com/embed/example",
    summary:
      "A shocking psychological thriller of a woman's act of violence against her husband—and of the therapist obsessed with uncovering her motive.",
  },
  {
    id: "5",
    title: "Educated",
    author: "Tara Westover",
    genre: "Memoir / Non-Fiction",
    rating: 4.7,
    totalCopies: 15,
    availableCopies: 5,
    description:
      "Born to survivalists in the mountains of Idaho, Tara Westover was seventeen the first time she set foot in a classroom. Her quest for knowledge transformed her, taking her over oceans and across continents, to Harvard and to Cambridge.",
    coverColor: "#08193e",
    coverUrl:
      "https://m.media-amazon.com/images/I/81NQA1BDlnL._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "https://www.youtube.com/embed/example",
    summary:
      "An unforgettable memoir about a young woman who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University.",
  },
  {
    id: "6",
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Fiction / Philosophy",
    rating: 4.3,
    totalCopies: 30,
    availableCopies: 18,
    description:
      "Paulo Coelho's masterpiece tells the mystical story of Santiago, an Andalusian shepherd boy who yearns to travel in search of a worldly treasure.",
    coverColor: "#c7a784",
    coverUrl:
      "https://m.media-amazon.com/images/I/71aFt4+OTOL._AC_UF1000,1000_QL80_.jpg",
    videoUrl: "https://www.youtube.com/embed/example",
    summary:
      "Santiago's journey teaches us to listen to our hearts, recognize opportunity, and follow our dreams.",
  },
];
