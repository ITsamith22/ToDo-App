import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const TailwindTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tailwind CSS Test
          </h1>
          <p className="text-lg text-gray-600">
            Testing if Tailwind CSS is working properly
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-center mb-2">Colors</h3>
            <p className="text-gray-600 text-center">Testing color utilities</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-center mb-2">Spacing</h3>
            <p className="text-gray-600 text-center">Testing margin and padding</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 transform hover:scale-105 transition-transform duration-200">
            <Info className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-center mb-2">Layout</h3>
            <p className="text-gray-600 text-center">Testing grid and flexbox</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Interactive Elements</h2>
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <button className="btn btn-primary">Primary Button</button>
              <button className="btn btn-secondary">Secondary Button</button>
              <button className="btn btn-danger">Danger Button</button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Test input field" 
                className="input"
              />
              <select className="input">
                <option>Select option</option>
                <option>Option 1</option>
                <option>Option 2</option>
              </select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Responsive Design Test</h4>
              <p className="text-sm text-gray-600">
                This should be responsive and look good on different screen sizes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;