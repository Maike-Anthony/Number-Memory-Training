'use client';

import { useState, useEffect } from 'react';
import { Constant, Performance } from '@/types';
import { storage } from '@/constants/data';

interface ConstantsListProps {
  onStartTraining: (constant: Constant) => void;
}

export default function ConstantsList({ onStartTraining }: ConstantsListProps) {
  const [constants, setConstants] = useState<Constant[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConstant, setNewConstant] = useState({ name: '', digits: '' });
  const [loading, setLoading] = useState(true);
  const [pastPerformances, setPastPerformances] = useState<{performance: Performance, constantName: string, index: number}[]>([]);

  useEffect(() => {
    // Load constants on component mount
    const loadConstants = async () => {
      let loadedConstants = storage.getConstants();
      
      if (loadedConstants.length === 0) {
        // Load default constants if none exist
        loadedConstants = await storage.loadDefaultConstants();
      }
      
      setConstants(loadedConstants);
      setLoading(false);
      
      // Load past performances
      const performances: {performance: Performance, constantName: string, index: number}[] = [];
      loadedConstants.forEach(constant => {
        const constantPerformances = storage.getPerformance(constant.name);
        constantPerformances.forEach((performance, index) => {
          performances.push({performance, constantName: constant.name, index});
        });
      });
      // Sort by date and time, most recent first
      performances.sort((a, b) => {
        const dateA = new Date(`${a.performance.date} ${a.performance.time}`);
        const dateB = new Date(`${b.performance.date} ${b.performance.time}`);
        return dateB.getTime() - dateA.getTime();
      });
      setPastPerformances(performances.slice(0, 5)); // Show only last 5 performances
    };
    
    loadConstants();
  }, []);

  const handleAddConstant = () => {
    if (newConstant.name && newConstant.digits) {
      const updatedConstants = [
        ...constants,
        { name: newConstant.name, digits: newConstant.digits }
      ];
      storage.saveConstants(updatedConstants);
      setConstants(updatedConstants);
      setNewConstant({ name: '', digits: '' });
      setShowAddForm(false);
    }
  };

  const handleRemovePerformance = (constantName: string, index: number) => {
    storage.removePerformance(constantName, index);
    // Update the performances list
    setPastPerformances(prev => 
      prev.filter(p => !(p.constantName === constantName && p.index === index))
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-600">Loading constants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Available Constants</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Add New Constant
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-medium mb-3 text-gray-800">Add New Constant</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Constant Name
              </label>
              <input
                type="text"
                value={newConstant.name}
                onChange={(e) => setNewConstant({ ...newConstant, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-600"
                placeholder="e.g., Golden Ratio"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Digits
              </label>
              <input
                type="text"
                value={newConstant.digits}
                onChange={(e) => setNewConstant({ ...newConstant, digits: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 placeholder-gray-600"
                placeholder="1.6180339887..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddConstant}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
            >
              Save
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {constants.map((constant, index) => (
          <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
            <div>
              <h3 className="font-medium text-gray-800">{constant.name}</h3>
              <p className="text-sm text-gray-700">
                {constant.digits.substring(0, 20)}...
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {constant.digits.replace(/[^0-9]/g, '').length} digits
              </p>
            </div>
            <button
              onClick={() => onStartTraining(constant)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
            >
              Practice
            </button>
          </div>
        ))}
      </div>

      {/* Past Performances Section */}
      {pastPerformances.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Performances</h2>
          <div className="space-y-3">
            {pastPerformances.map(({performance, constantName, index}, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-md relative">
                <button
                  onClick={() => handleRemovePerformance(constantName, index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  title="Remove this performance record"
                >
                  ×
                </button>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-800">{performance.constant}</h3>
                    <p className="text-sm text-gray-700">
                      {performance.date} at {performance.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-700">{performance.duration}</p>
                    <p className="text-sm font-medium text-gray-800">
                      {performance.accuracyRate}% accuracy
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-700">
                  <span>Start: {performance.startPosition}</span>
                  <span>Correct: {performance.correctDigits}</span>
                  <span>Mistakes: {performance.mistakes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}