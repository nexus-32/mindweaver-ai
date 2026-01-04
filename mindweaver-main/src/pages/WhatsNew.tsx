import React from 'react';
import { ArrowLeft, Calendar, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WhatsNew = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">What's New</h1>
          <p className="text-lg text-gray-600">Latest updates and features in MindWeaver</p>
        </div>

        {/* Updates */}
        <div className="space-y-8">
          {/* Latest Update */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Version 2.0</h2>
                  <p className="text-sm text-gray-500">Released January 4, 2026</p>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">NEW</span>
            </div>
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Major Updates</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Enhanced AI conversation capabilities with improved context understanding</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>New visual search functionality for image analysis</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Improved mobile responsiveness and touch interactions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Enhanced file upload with drag-and-drop support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Previous Update */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-full p-2 mr-3">
                  <Star className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Version 1.5</h2>
                  <p className="text-sm text-gray-500">Released December 15, 2025</p>
                </div>
              </div>
              <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">STABLE</span>
            </div>
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Features Added</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>AI personality customization options</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Voice input support for mobile devices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Performance improvements and bug fixes</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-full p-2 mr-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Coming Soon</h2>
                <p className="text-sm text-gray-500">Planned for Q1 2026</p>
              </div>
            </div>
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Roadmap</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">🚀</span>
                  <span>Advanced AI mode marketplace</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">🚀</span>
                  <span>Real-time collaboration features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">🚀</span>
                  <span>Enhanced security and privacy controls</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Have feedback or suggestions?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Let us know
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsNew;
