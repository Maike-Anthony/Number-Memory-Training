import { Constant, Mistake, Performance } from '@/types';

const CONSTANTS_KEY = 'memorization_constants';
const MISTAKES_PREFIX = 'mistakes_';
const PERFORMANCE_PREFIX = 'performance_';

// Default constants configuration
export const DEFAULT_CONSTANTS = [
  { name: 'Pi', filename: 'pi.txt' },
  { name: 'Eulers Number', filename: 'eulers_number.txt' },
  { name: 'Phi', filename: 'phi.txt' },
  { name: 'Square Root of 2', filename: 'sqrt2.txt' }
];

export const storage = {
  // Constants management
  getConstants: (): Constant[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(CONSTANTS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveConstants: (constants: Constant[]) => {
    localStorage.setItem(CONSTANTS_KEY, JSON.stringify(constants));
  },

  // Load default constants from public files
  loadDefaultConstants: async (): Promise<Constant[]> => {
    const constants: Constant[] = [];
    
    for (const constant of DEFAULT_CONSTANTS) {
      try {
        const response = await fetch(`/constants/${constant.filename}`);
        if (!response.ok) throw new Error('Failed to fetch constant');
        const digits = await response.text();
        
        constants.push({ 
          name: constant.name, 
          digits: digits.trim()
        });
      } catch (error) {
        console.error(`Error loading constant ${constant.name}:`, error);
        // Minimal fallback if file loading fails
        constants.push({ 
          name: constant.name, 
          digits: constant.name === 'Pi' ? '3.1415926535' : 
                 constant.name === 'Eulers Number' ? '2.7182818284' :
                 constant.name === 'Phi' ? '1.6180339887' : '1.4142135623'
        });
      }
    }
    
    storage.saveConstants(constants);
    return constants;
  },

  // Mistakes tracking
  getMistakes: (constantName: string): Mistake[] => {
    const key = `${MISTAKES_PREFIX}${constantName}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  addMistake: (constantName: string, mistake: Mistake) => {
    const key = `${MISTAKES_PREFIX}${constantName}`;
    const mistakes = storage.getMistakes(constantName);
    mistakes.push(mistake);
    localStorage.setItem(key, JSON.stringify(mistakes));
  },

  // Performance tracking
  getPerformance: (constantName: string): Performance[] => {
    const key = `${PERFORMANCE_PREFIX}${constantName}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  },

  addPerformance: (constantName: string, performance: Performance) => {
    const key = `${PERFORMANCE_PREFIX}${constantName}`;
    const performances = storage.getPerformance(constantName);
    performances.push(performance);
    localStorage.setItem(key, JSON.stringify(performances));
  },

  // Remove performance record
  removePerformance: (constantName: string, index: number) => {
    const key = `${PERFORMANCE_PREFIX}${constantName}`;
    const performances = storage.getPerformance(constantName);
    if (index >= 0 && index < performances.length) {
      performances.splice(index, 1);
      localStorage.setItem(key, JSON.stringify(performances));
    }
  }
};