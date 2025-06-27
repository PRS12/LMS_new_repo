import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, Progress } from '../types';

interface CourseContextType {
  courses: Course[];
  progress: Progress[];
  addCourse: (course: Omit<Course, 'id' | 'createdAt' | 'enrolledStudents'>) => void;
  removeCourse: (courseId: string) => void;
  enrollInCourse: (courseId: string, userId: string) => void;
  updateProgress: (userId: string, courseId: string, lessonId: string) => void;
  getUserProgress: (userId: string, courseId: string) => Progress | undefined;
}

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

// Mock initial courses
const initialCourses: Course[] = [
  {
    id: '1',
    title: 'Community Development Fundamentals',
    description: 'Learn the basics of community development and grassroots organizing.',
    instructor: 'Dr. Sarah Wilson',
    duration: '6 weeks',
    category: 'Community Development',
    difficulty: 'Beginner',
    enrolledStudents: ['2'],
    createdAt: '2024-01-15',
    image: 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?auto=compress&cs=tinysrgb&w=400',
    lessons: [
      {
        id: '1-1',
        title: 'Introduction to Community Development',
        content: 'Understanding the principles and approaches to community development.',
        duration: '45 min'
      },
      {
        id: '1-2',
        title: 'Stakeholder Engagement',
        content: 'Learning how to identify and engage with community stakeholders.',
        duration: '60 min'
      },
      {
        id: '1-3',
        title: 'Resource Mobilization',
        content: 'Strategies for mobilizing resources within communities.',
        duration: '50 min'
      }
    ]
  },
  {
    id: '2',
    title: 'Sustainable Agriculture Practices',
    description: 'Explore sustainable farming techniques and environmental conservation.',
    instructor: 'Prof. Michael Green',
    duration: '8 weeks',
    category: 'Agriculture',
    difficulty: 'Intermediate',
    enrolledStudents: ['2'],
    createdAt: '2024-01-20',
    image: 'https://images.pexels.com/photos/1459331/pexels-photo-1459331.jpeg?auto=compress&cs=tinysrgb&w=400',
    lessons: [
      {
        id: '2-1',
        title: 'Soil Health Management',
        content: 'Understanding soil composition and health indicators.',
        duration: '55 min'
      },
      {
        id: '2-2',
        title: 'Water Conservation Techniques',
        content: 'Implementing water-saving methods in agriculture.',
        duration: '40 min'
      }
    ]
  }
];

export const CourseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);

  useEffect(() => {
    // Load courses from localStorage or use initial data
    const savedCourses = localStorage.getItem('ngo-lms-courses');
    const savedProgress = localStorage.getItem('ngo-lms-progress');
    
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      setCourses(initialCourses);
    }
    
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ngo-lms-courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('ngo-lms-progress', JSON.stringify(progress));
  }, [progress]);

  const addCourse = (courseData: Omit<Course, 'id' | 'createdAt' | 'enrolledStudents'>) => {
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      enrolledStudents: [],
      createdAt: new Date().toISOString()
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const removeCourse = (courseId: string) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
    setProgress(prev => prev.filter(p => p.courseId !== courseId));
  };

  const enrollInCourse = (courseId: string, userId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, enrolledStudents: [...course.enrolledStudents, userId] }
        : course
    ));
    
    // Initialize progress
    setProgress(prev => [...prev, {
      userId,
      courseId,
      completedLessons: [],
      progress: 0,
      lastAccessed: new Date().toISOString()
    }]);
  };

  const updateProgress = (userId: string, courseId: string, lessonId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    setProgress(prev => {
      const existingProgress = prev.find(p => p.userId === userId && p.courseId === courseId);
      
      if (existingProgress) {
        const updatedCompletedLessons = [...existingProgress.completedLessons];
        if (!updatedCompletedLessons.includes(lessonId)) {
          updatedCompletedLessons.push(lessonId);
        }
        
        const progressPercentage = (updatedCompletedLessons.length / course.lessons.length) * 100;
        
        return prev.map(p => 
          p.userId === userId && p.courseId === courseId
            ? {
                ...p,
                completedLessons: updatedCompletedLessons,
                progress: progressPercentage,
                lastAccessed: new Date().toISOString()
              }
            : p
        );
      } else {
        return [...prev, {
          userId,
          courseId,
          completedLessons: [lessonId],
          progress: (1 / course.lessons.length) * 100,
          lastAccessed: new Date().toISOString()
        }];
      }
    });
  };

  const getUserProgress = (userId: string, courseId: string): Progress | undefined => {
    return progress.find(p => p.userId === userId && p.courseId === courseId);
  };

  return (
    <CourseContext.Provider value={{
      courses,
      progress,
      addCourse,
      removeCourse,
      enrollInCourse,
      updateProgress,
      getUserProgress
    }}>
      {children}
    </CourseContext.Provider>
  );
};