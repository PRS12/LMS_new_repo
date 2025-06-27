import React from 'react';
import { useCourses } from '../contexts/CourseContext';
import { useAuth } from '../contexts/AuthContext';
import { Course } from '../types';
import { 
  Clock, 
  Users, 
  BookOpen, 
  Trash2, 
  Eye,
  UserPlus,
  Award,
  Calendar
} from 'lucide-react';

interface CourseCardProps {
  course: Course;
  isAdmin: boolean;
  onView: () => void;
  showEnrollButton?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  isAdmin, 
  onView, 
  showEnrollButton = false 
}) => {
  const { removeCourse, enrollInCourse, getUserProgress } = useCourses();
  const { user } = useAuth();
  
  const userProgress = user ? getUserProgress(user.id, course.id) : null;
  const isEnrolled = course.enrolledStudents.includes(user?.id || '');

  const handleEnroll = () => {
    if (user) {
      enrollInCourse(course.id, user.id);
    }
  };

  const handleRemove = () => {
    if (confirm('Are you sure you want to remove this course?')) {
      removeCourse(course.id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
        </div>
        {userProgress && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${userProgress.progress}%` }}
              />
            </div>
            <p className="text-white text-sm mt-1">{Math.round(userProgress.progress)}% Complete</p>
          </div>
        )}
      </div>

      {/* Course Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {course.title}
            </h3>
            <p className="text-sm text-blue-600 font-medium">{course.category}</p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <BookOpen className="h-4 w-4" />
            <span>{course.lessons.length} lessons</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{course.enrolledStudents.length}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {course.instructor.split(' ').map(name => name[0]).join('').slice(0, 2)}
            </div>
            <span className="text-sm text-gray-600">{course.instructor}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            <span>{new Date(course.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>{isEnrolled ? 'Continue' : 'View'}</span>
          </button>
          
          {showEnrollButton && (
            <button
              onClick={handleEnroll}
              className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Enroll</span>
            </button>
          )}
          
          {isAdmin && (
            <button
              onClick={handleRemove}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;