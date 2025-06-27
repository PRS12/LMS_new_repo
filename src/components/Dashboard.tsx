import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCourses } from '../contexts/CourseContext';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Plus, 
  Search,
  LogOut,
  Settings,
  Award,
  Clock,
  User
} from 'lucide-react';
import CourseCard from './CourseCard';
import CourseCreator from './CourseCreator';
import CourseViewer from './CourseViewer';
import { Course } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { courses, progress } = useCourses();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCourseCreator, setShowCourseCreator] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const isAdmin = user?.role === 'admin';
  
  const userEnrolledCourses = courses.filter(course => 
    course.enrolledStudents.includes(user?.id || '')
  );

  const userProgress = progress.filter(p => p.userId === user?.id);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStudents = new Set(courses.flatMap(course => course.enrolledStudents)).size;
  const averageProgress = userProgress.length > 0 
    ? userProgress.reduce((sum, p) => sum + p.progress, 0) / userProgress.length 
    : 0;

  if (selectedCourse) {
    return (
      <CourseViewer 
        course={selectedCourse} 
        onBack={() => setSelectedCourse(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">NGO Learning Hub</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img
                  src={user?.avatar || `https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=1`}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {user?.role}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8 w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'courses'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {isAdmin ? 'All Courses' : 'My Courses'}
          </button>
          {!isAdmin && (
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'browse'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Browse Courses
            </button>
          )}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Courses</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isAdmin ? courses.length : userEnrolledCourses.length}
                    </p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </div>

              {isAdmin && (
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              )}

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {isAdmin ? 'Platform Growth' : 'Avg Progress'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isAdmin ? '+23%' : `${Math.round(averageProgress)}%`}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {isAdmin ? 'Active Courses' : 'Completed'}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {isAdmin ? courses.filter(c => c.enrolledStudents.length > 0).length : userProgress.filter(p => p.progress === 100).length}
                    </p>
                  </div>
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            {/* Recent Activity / Progress */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {isAdmin ? 'Recent Enrollments' : 'Learning Progress'}
                </h3>
                <div className="space-y-4">
                  {isAdmin ? (
                    courses.slice(0, 5).map(course => (
                      <div key={course.id} className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900">{course.title}</p>
                          <p className="text-sm text-gray-600">{course.enrolledStudents.length} students</p>
                        </div>
                        <span className="text-sm text-green-600 font-medium">
                          +{course.enrolledStudents.length}
                        </span>
                      </div>
                    ))
                  ) : (
                    userProgress.slice(0, 5).map(prog => {
                      const course = courses.find(c => c.id === prog.courseId);
                      return course ? (
                        <div key={prog.courseId} className="py-2">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900">{course.title}</p>
                            <span className="text-sm text-gray-600">{Math.round(prog.progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${prog.progress}%` }}
                            />
                          </div>
                        </div>
                      ) : null;
                    })
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {isAdmin ? (
                    <>
                      <button
                        onClick={() => setShowCourseCreator(true)}
                        className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Plus className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Create New Course</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('courses')}
                        className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <Settings className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">Manage Courses</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setActiveTab('browse')}
                        className="w-full flex items-center space-x-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <Search className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-blue-900">Browse New Courses</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('courses')}
                        className="w-full flex items-center space-x-3 p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                      >
                        <BookOpen className="h-5 w-5 text-green-600" />
                        <span className="font-medium text-green-900">Continue Learning</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {(activeTab === 'courses' || activeTab === 'browse') && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {activeTab === 'courses' 
                    ? (isAdmin ? 'All Courses' : 'My Courses')
                    : 'Browse Courses'
                  }
                </h2>
                <p className="text-gray-600">
                  {activeTab === 'courses'
                    ? (isAdmin ? 'Manage your organization\'s courses' : 'Continue your learning journey')
                    : 'Discover new learning opportunities'
                  }
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {isAdmin && activeTab === 'courses' && (
                  <button
                    onClick={() => setShowCourseCreator(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Course</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {(activeTab === 'courses' 
                ? (isAdmin ? filteredCourses : filteredCourses.filter(course => course.enrolledStudents.includes(user?.id || '')))
                : filteredCourses
              ).map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isAdmin={isAdmin}
                  onView={() => setSelectedCourse(course)}
                  showEnrollButton={activeTab === 'browse' && !course.enrolledStudents.includes(user?.id || '')}
                />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600">
                  {searchTerm ? 'Try adjusting your search terms' : 'No courses available yet'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Course Creator Modal */}
      {showCourseCreator && (
        <CourseCreator onClose={() => setShowCourseCreator(false)} />
      )}
    </div>
  );
};

export default Dashboard;