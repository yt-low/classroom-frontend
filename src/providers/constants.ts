export const API_URL = "https://api.fake-rest.refine.dev";

import { Subject } from "../types";

export const MOCK_SUBJECTS: Subject[] = [
  {
    id: 1,
    code: "MATH101",
    name: "Calculus I",
    department: "Mathematics",
    description: "Introduction to differential and integral calculus.",
    createdAt: "2023-01-15T10:00:00Z"
  },
  {
    id: 2,
    code: "PHYS101",
    name: "Physics I",
    department: "Physics",
    description: "Fundamentals of classical mechanics and thermodynamics.",
    createdAt: "2023-01-15T10:00:00Z",
  },
];
