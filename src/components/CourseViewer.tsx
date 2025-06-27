import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../contexts/CourseContext';
import { Course, Lesson } from '../types';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  User,
  Award,
  Calendar,
  Users
} from 'lucide-react';

interface CourseViewerProps {
  course: Course;
  onBack: () => void;
}

const CourseViewer: React.FC<CourseViewerProps> = ({ course, onBack }) => {
  const { user } = useAuth();
  const { updateProgress, getUserProgress, enrollInCourse } = useCourses();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  const userProgress = user ? getUserProgress(user.id, course.id) : null;
  const isEnrolled = course.enrolledStudents.includes(user?.id || '');
  
  const handleEnroll = () => {
    if (user) {
      enrollInCourse(course.id, user.id);
    }
  };

  const handleLessonComplete = (lessonId: string) => {
    if (user && isEnrolled) {
      updateProgress(user.id, course.id, lessonId);
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return userProgress?.completedLessons.includes(lessonId) || false;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Courses</span>
            </button>
            
            {!isEnrolled && (
              <button
                onClick={handleEnroll}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Enroll in Course
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={course.image || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={course.title}
                  className="w-full md:w-48 h-48 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                      <p className="text-blue-600 font-medium mb-2">{course.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
                      {course.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{course.instructor}</span>
                    </div>
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
                      <span>{course.enrolledStudents.length} enrolled</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {isEnrolled && userProgress && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Course Progress</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{Math.round(userProgress.progress)}%</span>
                      {userProgress.progress === 100 && (
                        <Award className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-white rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${userProgress.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Lesson Content */}
            {selectedLesson ? (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">{selectedLesson.title}</h2>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{selectedLesson.duration}</span>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{selectedLesson.content}</p>
                </div>
                
                {isEnrolled && !isLessonCompleted(selectedLesson.id) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleLessonComplete(selectedLesson.id)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span>Mark as Complete</span>
                    </button>
                  </div>
                )}
                
                {isLessonCompleted(selectedLesson.id) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Lesson Completed!</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Lesson</h3>
                <p className="text-gray-600">Choose a lesson from the sidebar to start learning</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lessons List */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Lessons</h3>
              <div className="space-y-2">
                {course.lessons.map((lesson, index) => {
                  const isCompleted = isLessonCompleted(lesson.id);
                  const isSelected = selectedLesson?.id === lesson.id;
                  
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLesson(lesson)}
                      disabled={!isEnrolled}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                        isSelected
                          ? 'bg-blue-50 border-2 border-blue-200'
                          : isCompleted
                          ? 'bg-green-50 hover:bg-green-100'
                          : isEnrolled
                          ? 'hover:bg-gray-50'
                          : 'opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-medium ${
                              isSelected ? 'border-blue-500 text-blue-500' : 'border-gray-300 text-gray-500'
                            }`}>
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`font-medium truncate ${
                            isCompleted ? 'text-green-900' : isSelected ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {lesson.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{lesson.duration}</span>
                          </div>
                        </div>
                        {!isEnrolled && (
                          <Play className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              
              {!isEnrolled && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 text-center">
                    Enroll in this course to access lessons
                  </p>
                </div>
              )}
            </div>

            {/* Course Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Lessons</span>
                  <span className="font-medium">{course.lessons.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Enrolled Students</span>
                  <span className="font-medium">{course.enrolledStudents.length}</span>
                </div>
                {isEnrolled && userProgress && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completed</span>
                      <span className="font-medium">{userProgress.completedLessons.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">{Math.round(userProgress.progress)}%</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;