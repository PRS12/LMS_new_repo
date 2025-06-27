export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  avatar?: string;
  enrolledCourses?: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  lessons: Lesson[];
  enrolledStudents: string[];
  createdAt: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  image?: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  duration: string;
  videoUrl?: string;
  completed?: boolean;
}

export interface Progress {
  userId: string;
  courseId: string;
  completedLessons: string[];
  progress: number;
  lastAccessed: string;
}