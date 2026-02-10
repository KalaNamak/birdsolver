import React, { useState, useRef, useEffect } from 'react';

// Lucide React Icons (inline SVG components)
const ChevronLeft = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "m15 18-6-6 6-6"}));

const ChevronRight = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "m9 18 6-6-6-6"}));

const Play = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('polygon', {points: "6 3 20 12 6 21 6 3"}));

const RotateCcw = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"}), React.createElement('path', {d: "M3 3v5h5"}));

const Plus = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "M5 12h14"}), React.createElement('path', {d: "M12 5v14"}));

const Minus = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "M5 12h14"}));

const Trash2 = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "M3 6h18"}), React.createElement('path', {d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}), React.createElement('path', {d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"}), React.createElement('line', {x1: "10", x2: "10", y1: "11", y2: "17"}), React.createElement('line', {x1: "14", x2: "14", y1: "11", y2: "17"}));

const Lightbulb = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"}), React.createElement('path', {d: "M9 18h6"}), React.createElement('path', {d: "M10 22h4"}));

const Eye = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"}), React.createElement('circle', {cx: "12", cy: "12", r: "3"}));

const EyeOff = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "M9.88 9.88a3 3 0 1 0 4.24 4.24"}), React.createElement('path', {d: "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"}), React.createElement('path', {d: "M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"}), React.createElement('line', {x1: "2", x2: "22", y1: "2", y2: "22"}));


// ========== HIDDEN MODE HELPER FUNCTIONS ==========
const initializeVisibilityMap = (branches) => {
  // Initially, only top birds are visible
  const visibility = {};
  branches.forEach((branch, branchIndex) => {
    branch.forEach((bird, position) => {
      const key = `${branchIndex}-${position}`;
      // Top bird (highest position) is visible
      visibility[key] = position === branch.length - 1;
    });
  });
  return visibility;
};

const revealBirdAndSameType = (branches, branchIndex, position, visibilityMap) => {
  const newVisibility = { ...visibilityMap };
  const key = `${branchIndex}-${position}`;
  const bird = branches[branchIndex][position];
  
  // Reveal this bird
  newVisibility[key] = true;
  
  // If this bird has the same type as adjacent birds below it, reveal them too
  if (position > 0) {
    let checkPosition = position - 1;
    while (checkPosition >= 0) {
      const checkBird = branches[branchIndex][checkPosition];
      const checkKey = `${branchIndex}-${checkPosition}`;
      
      if (checkBird === bird) {
        newVisibility[checkKey] = true;
        checkPosition--;
      } else {
        break;
      }
    }
  }
  
  return newVisibility;
};

const updateVisibilityAfterMove = (newBranches, oldVisibility) => {
  let newVisibility = { ...oldVisibility };
  
  // For each branch, check if the top bird should be visible and reveal adjacent same-type birds
  newBranches.forEach((branch, branchIndex) => {
    if (branch.length > 0) {
      const topPosition = branch.length - 1;
      const topKey = `${branchIndex}-${topPosition}`;
      
      // If top bird exists and wasn't visible, make it visible along with same-type adjacent birds
      if (branch[topPosition] !== null && branch[topPosition] !== undefined) {
        if (!newVisibility[topKey]) {
          newVisibility = revealBirdAndSameType(newBranches, branchIndex, topPosition, newVisibility);
        }
      }
    }
  });
  
  return newVisibility;
};

// ========== REVEAL MODE HELPER FUNCTIONS ==========
const findExposedHiddenPositions = (branches) => {
  const exposed = [];
  branches.forEach((branch, branchIndex) => {
    if (branch.length === 0) return;
    const topIndex = branch.length - 1;
    const topBird = branch[topIndex];
    if (topBird === null || topBird === undefined) {
      exposed.push({ branchIndex, positionIndex: topIndex });
    }
  });
  return exposed;
};

const isValidDiscoveryMove = (branches, fromIndex, toIndex, birdsPerBranch) => {
  const fromBranch = branches[fromIndex];
  const toBranch = branches[toIndex];
  if (!fromBranch || fromBranch.length === 0) return false;
  if (toBranch.length >= birdsPerBranch) return false;
  const topBird = fromBranch[fromBranch.length - 1];
  if (topBird === null || topBird === undefined) return false;
  if (toBranch.length > 0) {
    const toTopBird = toBranch[toBranch.length - 1];
    if (toTopBird === null || toTopBird === undefined) return false;
    if (topBird !== toTopBird) return false;
  }
  return true;
};

const countConsecutiveKnownBirds = (branch) => {
  if (branch.length === 0) return 0;
  const topBird = branch[branch.length - 1];
  if (topBird === null || topBird === undefined) return 0;
  let count = 1;
  for (let i = branch.length - 2; i >= 0; i--) {
    const bird = branch[i];
    if (bird === null || bird === undefined) break;
    if (bird === topBird) count++;
    else break;
  }
  return count;
};

const findMovesToExposeHidden = (initialBranches, birdsPerBranch, maxDepth = 20) => {
  const currentExposed = findExposedHiddenPositions(initialBranches);
  if (currentExposed.length > 0) {
    return { success: true, moves: [], exposedPosition: currentExposed[0] };
  }
  
  const queue = [{ state: initialBranches.map(b => [...b]), moves: [], depth: 0 }];
  const visited = new Set([JSON.stringify(initialBranches)]);
  
  while (queue.length > 0) {
    const current = queue.shift();
    if (current.depth >= maxDepth) continue;
    
    for (let from = 0; from < current.state.length; from++) {
      for (let to = 0; to < current.state.length; to++) {
        if (from === to) continue;
        if (!isValidDiscoveryMove(current.state, from, to, birdsPerBranch)) continue;
        
        const consecutiveCount = countConsecutiveKnownBirds(current.state[from]);
        const availableSpace = birdsPerBranch - current.state[to].length;
        const birdsToMove = Math.min(consecutiveCount, availableSpace);
        
        const newState = current.state.map(b => [...b]);
        for (let i = 0; i < birdsToMove; i++) {
          newState[to].push(newState[from].pop());
        }
        
        const stateStr = JSON.stringify(newState);
        if (visited.has(stateStr)) continue;
        visited.add(stateStr);
        
        const exposedPositions = findExposedHiddenPositions(newState);
        if (exposedPositions.length > 0) {
          return {
            success: true,
            moves: [...current.moves, { from, to, birdsToMove, state: newState }],
            exposedPosition: exposedPositions[0]
          };
        }
        
        queue.push({
          state: newState,
          moves: [...current.moves, { from, to, birdsToMove, state: newState }],
          depth: current.depth + 1
        });
      }
    }
  }
  return { success: false, error: 'Could not find moves to expose a hidden bird.' };
};

const BirdSortSolver = () => {
  const [birdsPerBranch, setBirdsPerBranch] = useState(4);
  const [branches, setBranches] = useState([
    ["bird1", "bird2", "bird3", "bird4"],
    ["bird4", "bird1", "bird2", "bird3"],
    ["bird3", "bird4", "bird1", "bird2"],
    ["bird2", "bird3", "bird4", "bird1"],
    [],
    [],
  ]);
  const [solution, setSolution] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [customBirdImages, setCustomBirdImages] = useState({});
  const [birdColors, setBirdColors] = useState({
    bird1: "#EF4444",
    bird2: "#3B82F6",
    bird3: "#10B981",
    bird4: "#F59E0B",
    bird5: "#A855F7",
    bird6: "#F97316",
    bird7: "#EC4899",
    bird8: "#06B6D4",
    bird9: "#92400E",
    bird10: "#6B7280",
    bird11: "#8B5CF6",
    bird12: "#14B8A6",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedBirdType, setSelectedBirdType] = useState("bird1");
  const [savedPuzzles, setSavedPuzzles] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [puzzleName, setPuzzleName] = useState("");
  const [unsurePositions, setUnsurePositions] = useState(new Set());
  const [unsureColor, setUnsureColor] = useState("#A855F7"); // Default purple
  const [birdSize, setBirdSize] = useState(48); // Default 48px, adjustable 32-64px
  
  // Database state - single JSON file with everything
  const [database, setDatabase] = useState({
    theme: {
      birdColors: birdColors,
      customBirdImages: {},
      birdSize: 48,
      unsureColor: "#A855F7"
    },
    puzzles: []
  });
  const [databaseFileHandle, setDatabaseFileHandle] = useState(null); // File handle for persistent location
  
  // Discovery mode state
  const [discoveryMode, setDiscoveryMode] = useState(false);
  const [discoveryMoves, setDiscoveryMoves] = useState([]);
  const [discoveryStep, setDiscoveryStep] = useState(0);
  const [message, setMessage] = useState("");
  const [discoveredBirds, setDiscoveredBirds] = useState({});
  const [originalPositions, setOriginalPositions] = useState([]);
  const [targetHiddenPosition, setTargetHiddenPosition] = useState(null);
  
  // Hidden mode state for solution playback
  const [hiddenMode, setHiddenMode] = useState(false);
  const [birdVisibility, setBirdVisibility] = useState({});
  
  // Solution playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000); // milliseconds per step
  const [animating, setAnimating] = useState(false); // Track when animations are happening
  const [flyingBirds, setFlyingBirds] = useState([]); // Track birds currently flying
  
  const fileInputRefs = useRef({});
  const playbackIntervalRef = useRef(null);
  
  // Responsive bird size based on screen width
  const [responsiveBirdSize, setResponsiveBirdSize] = useState(birdSize);
  
  useEffect(() => {
    const updateBirdSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Mobile: larger birds (32px) for better visibility, fits 6 birds comfortably
        setResponsiveBirdSize(32);
      } else if (width < 1024) {
        // Tablet: medium birds
        setResponsiveBirdSize(Math.min(birdSize, 36));
      } else {
        // Desktop: user preference
        setResponsiveBirdSize(birdSize);
      }
    };
    
    updateBirdSize();
    window.addEventListener('resize', updateBirdSize);
    return () => window.removeEventListener('resize', updateBirdSize);
  }, [birdSize]);
  const birdRefs = useRef({}); // Store refs to bird elements for position calculation

  useEffect(() => {
    const savedImages = localStorage.getItem("birdImages");
    const savedColors = localStorage.getItem("birdColors");
    const savedPuzzlesData = localStorage.getItem("savedPuzzles");
    const savedUnsureColor = localStorage.getItem("unsureColor");
    if (savedImages) setCustomBirdImages(JSON.parse(savedImages));
    if (savedColors) setBirdColors(JSON.parse(savedColors));
    if (savedPuzzlesData) setSavedPuzzles(JSON.parse(savedPuzzlesData));
    if (savedUnsureColor) setUnsureColor(savedUnsureColor);
  }, []);

  useEffect(() => {
    localStorage.setItem("birdImages", JSON.stringify(customBirdImages));
  }, [customBirdImages]);

  useEffect(() => {
    localStorage.setItem("birdColors", JSON.stringify(birdColors));
  }, [birdColors]);

  useEffect(() => {
    localStorage.setItem("unsureColor", unsureColor);
  }, [unsureColor]);

  // Trigger flying animation when step changes
  useEffect(() => {
    if ((currentStep > 0 && solution.length > 0) || (discoveryStep > 0 && discoveryMoves.length > 0)) {
      const move = solution.length > 0 && currentStep > 0 
        ? solution[currentStep - 1]
        : discoveryMoves[discoveryStep - 1];
      
      if (!move) return;
      
      // FIX: Use correct previous state for both solution and discovery modes
      const prevState = solution.length > 0 && currentStep > 0
        ? (currentStep > 1 ? solution[currentStep - 2].state : branches)
        : discoveryStep > 0
        ? (discoveryStep > 1 ? discoveryMoves[discoveryStep - 2].state : branches)
        : branches;
      
      const birdsToMove = move.birdsToMove || 1;
      const fromBranch = prevState[move.from];
      
      // Create flying bird objects
      const newFlyingBirds = [];
      for (let i = 0; i < birdsToMove; i++) {
        const birdType = fromBranch[fromBranch.length - 1 - i];
        if (birdType) {
          newFlyingBirds.push({
            id: `${Date.now()}-${i}`,
            birdType,
            fromBranch: move.from,
            toBranch: move.to,
            fromPosition: fromBranch.length - 1 - i,
            delay: i * 100, // Stagger birds slightly
          });
        }
      }
      
      setFlyingBirds(newFlyingBirds);
      setAnimating(true);
      
      // Clear flying birds and update animating state after animation completes
      // Animation is 600ms + max delay of 200ms for multiple birds = 800ms total
      const timer = setTimeout(() => {
        setFlyingBirds([]);
        setAnimating(false);
        
        // Update visibility map if in hidden mode (not in discovery mode)
        if (hiddenMode && !discoveryMode && currentStep > 0) {
          const currentState = solution[currentStep - 1].state;
          setBirdVisibility(prev => updateVisibilityAfterMove(currentState, prev));
        }
      }, 800);
      
      return () => clearTimeout(timer);
    } else {
      setFlyingBirds([]);
      setAnimating(false);
    }
  }, [currentStep, discoveryStep, solution.length, discoveryMoves.length, solution, discoveryMoves, branches, hiddenMode, discoveryMode]);

  const getBirdStyle = (birdType) => {
    if (!birdType) return {};
    if (customBirdImages[birdType]) {
      return {
        backgroundImage: `url(${customBirdImages[birdType]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return { backgroundColor: birdColors[birdType] || "#999999" };
  };

  const countBirds = () => {
    const counts = {};
    getCurrentState().forEach((branch) => {
      branch.forEach((bird) => {
        if (bird) counts[bird] = (counts[bird] || 0) + 1;
      });
    });
    return counts;
  };

  const downloadJSON = (data, filename) => {
    const json = JSON.stringify(data, null, 2); // Pretty print with 2-space indent
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const uploadJSON = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        callback(data);
      } catch (error) {
        alert(`Error parsing JSON file: ${error.message}`);
      }
    };
    reader.readAsText(file);
  };

  // Save database using File System Access API (allows choosing location)
  const saveDatabaseToFile = async (newDatabase) => {
    try {
      // Check if File System Access API is supported
      if ('showSaveFilePicker' in window) {
        let fileHandle = databaseFileHandle;
        
        // If no file handle, or user wants to choose new location
        if (!fileHandle) {
          fileHandle = await window.showSaveFilePicker({
            suggestedName: 'bird-sort-database.json',
            types: [{
              description: 'JSON Database',
              accept: { 'application/json': ['.json'] }
            }]
          });
          setDatabaseFileHandle(fileHandle);
        }
        
        // Write to file
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(newDatabase, null, 2));
        await writable.close();
        
        return true;
      } else {
        // Fallback to download
        downloadJSON(newDatabase, 'bird-sort-database.json');
        return true;
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Save error:', error);
        alert(`Error saving file: ${error.message}`);
      }
      return false;
    }
  };

  // Load database using File System Access API
  const loadDatabaseFromFile = async () => {
    try {
      if ('showOpenFilePicker' in window) {
        const [fileHandle] = await window.showOpenFilePicker({
          types: [{
            description: 'JSON Database',
            accept: { 'application/json': ['.json'] }
          }],
          multiple: false
        });
        
        setDatabaseFileHandle(fileHandle);
        
        const file = await fileHandle.getFile();
        const text = await file.text();
        const data = JSON.parse(text);
        
        // Validate and load
        setDatabase({
          theme: data.theme || database.theme,
          puzzles: data.puzzles || []
        });
        
        alert(`Database loaded! Found ${data.puzzles?.length || 0} puzzles.`);
      } else {
        // Fallback: show file input
        document.getElementById('database-file-input')?.click();
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Load error:', error);
        alert(`Error loading file: ${error.message}`);
      }
    }
  };

  // Save as new file (choose new location)
  const saveDatabaseAs = async (newDatabase) => {
    setDatabaseFileHandle(null); // Clear handle to force new file picker
    return await saveDatabaseToFile(newDatabase);
  };

  // Save current game configuration to database
  const saveGameToDatabase = async () => {
    const name = puzzleName.trim();
    if (!name) {
      alert("Please enter a puzzle name");
      return;
    }

    const existingIndex = database.puzzles.findIndex(p => p.name === name);
    
    if (existingIndex >= 0) {
      if (!window.confirm(`A puzzle named "${name}" already exists. Overwrite?`)) {
        return;
      }
    }

    const puzzleData = {
      name,
      branches,
      birdsPerBranch,
      solution,
      unsurePositions: Array.from(unsurePositions),
      savedAt: new Date().toISOString()
    };

    const newPuzzles = [...database.puzzles];
    if (existingIndex >= 0) {
      newPuzzles[existingIndex] = puzzleData;
    } else {
      newPuzzles.push(puzzleData);
    }

    const newDatabase = {
      ...database,
      puzzles: newPuzzles
    };

    setDatabase(newDatabase);
    const success = await saveDatabaseToFile(newDatabase);
    if (success) {
      setShowSaveDialog(false);
    }
    // Keep puzzle name visible in status bar
  };

  // Load game configuration from database
  const loadGameFromDatabase = (puzzleData) => {
    setBranches(puzzleData.branches);
    setBirdsPerBranch(puzzleData.birdsPerBranch);
    setSolution(puzzleData.solution || []);
    setCurrentStep(0);
    setUnsurePositions(new Set(puzzleData.unsurePositions || []));
    setPuzzleName(puzzleData.name); // Set puzzle name for status bar
    setShowLoadDialog(false);
    setEditMode(false);
  };

  // Save current theme to database
  const saveThemeToDatabase = async () => {
    const newDatabase = {
      ...database,
      theme: {
        birdColors,
        customBirdImages,
        birdSize,
        unsureColor,
        savedAt: new Date().toISOString()
      }
    };

    setDatabase(newDatabase);
    const success = await saveDatabaseToFile(newDatabase);
    if (success) {
      alert("Theme saved to database!");
    }
  };

  // Load theme from database
  const loadThemeFromDatabase = () => {
    if (!database.theme) {
      alert("No theme found in database");
      return;
    }

    if (database.theme.birdColors) setBirdColors(database.theme.birdColors);
    if (database.theme.customBirdImages) setCustomBirdImages(database.theme.customBirdImages);
    if (database.theme.birdSize) setBirdSize(database.theme.birdSize);
    if (database.theme.unsureColor) setUnsureColor(database.theme.unsureColor);
    
    alert("Theme loaded from database!");
  };

  // Import entire database from file
  const addBranch = () => {
    if (branches.length < 14) {
      setBranches([...branches, []]);
      setSolution([]);
      setCurrentStep(0);
    }
  };

  const removeBranch = () => {
    if (branches.length > 2) {
      setBranches(branches.slice(0, -1));
      setSolution([]);
      setCurrentStep(0);
    }
  };

  const clearBranch = (index) => {
    const newBranches = [...branches];
    newBranches[index] = [];
    setBranches(newBranches);
    setSolution([]);
    setCurrentStep(0);
  };

  const resetAll = () => {
    setBranches([
      ["bird1", "bird2", "bird3", "bird4"],
      ["bird4", "bird1", "bird2", "bird3"],
      ["bird3", "bird4", "bird1", "bird2"],
      ["bird2", "bird3", "bird4", "bird1"],
      [],
      [],
    ]);
    setSolution([]);
    setCurrentStep(0);
    setSelectedBranch(null);
    setEditMode(false);
    setUnsurePositions(new Set());
    setDiscoveryMode(false);
    setDiscoveryMoves([]);
    setDiscoveryStep(0);
    setMessage("");
    setDiscoveredBirds({});
    setOriginalPositions([]);
    setTargetHiddenPosition(null);
  };

  const addBirdToPosition = (branchIndex, positionIndex) => {
    const newBranches = [...branches];
    const branch = [...newBranches[branchIndex]];
    branch[positionIndex] = selectedBirdType;
    newBranches[branchIndex] = branch;
    setBranches(newBranches);
    setSolution([]);
    setCurrentStep(0);
  };

  const removeBirdFromPosition = (branchIndex, positionIndex) => {
    const newBranches = [...branches];
    const branch = [...newBranches[branchIndex]];
    if (branch[positionIndex]) {
      branch[positionIndex] = null;
      newBranches[branchIndex] = branch;
      setBranches(newBranches);
      setSolution([]);
      setCurrentStep(0);
    }
  };

  const handleBirdClick = (branchIndex, positionIndex) => {
    // Reveal mode: record discovered birds
    if (discoveryMode) {
      const currentState = discoveryMoves.length > 0 && discoveryStep === discoveryMoves.length
        ? discoveryMoves[discoveryStep - 1].state : branches;
      
      const bird = currentState[branchIndex]?.[positionIndex];
      if (bird !== null && bird !== undefined) return;
      
      const exposedPositions = findExposedHiddenPositions(currentState);
      const isExposed = exposedPositions.some(
        pos => pos.branchIndex === branchIndex && pos.positionIndex === positionIndex
      );
      
      if (!isExposed) {
        setMessage("This spot is not exposed yet. Click 'Find Next Hidden' first.");
        return;
      }
      
      const key = `${branchIndex}-${positionIndex}`;
      const newDiscovered = { ...discoveredBirds, [key]: selectedBirdType };
      setDiscoveredBirds(newDiscovered);
      
      const newOriginal = originalPositions.map(b => [...b]);
      newOriginal[branchIndex][positionIndex] = selectedBirdType;
      setOriginalPositions(newOriginal);
      
      // DON'T reset - keep the current state and just place the new bird
      // This allows chaining discoveries from the current position
      const continuedState = currentState.map(b => [...b]);
      continuedState[branchIndex][positionIndex] = selectedBirdType;
      
      setBranches(continuedState);
      setDiscoveryMoves([]);
      setDiscoveryStep(0);
      setTargetHiddenPosition(null);
      
      const discovered = Object.keys(newDiscovered).length;
      const total = originalPositions.reduce((sum, branch) => sum + branch.length, 0);
      
      if (discovered >= total) {
        setMessage("🎉 All birds discovered! Click 'Exit Discovery Mode'.");
      } else {
        setMessage(`✓ Recorded! ${discovered}/${total} discovered. Checking for more...`);
        // Try to continue discovering from the current state
        setTimeout(() => {
          const result = findMovesToExposeHidden(continuedState, birdsPerBranch);
          if (result.success) {
            setTargetHiddenPosition(result.exposedPosition);
            if (result.moves.length === 0) {
              setMessage(`✓ ${discovered}/${total}. Another exposed! Select and place.`);
            } else {
              setDiscoveryMoves(result.moves);
              setDiscoveryStep(0);
              setMessage(`✓ ${discovered}/${total}. Continuing discovery chain...`);
            }
          } else {
            // Can't discover more from current state - RESET to starting positions with discovered birds
            setMessage(`✓ ${discovered}/${total}. Chain complete! Resetting...`);
            setTimeout(() => {
              const resetToStart = originalPositions.map((branch, bIdx) => {
                if (branch.length === 0) return branch;
                return branch.map((b, pIdx) => {
                  const posKey = `${bIdx}-${pIdx}`;
                  if (newDiscovered[posKey]) return newDiscovered[posKey]; // Show discovered birds
                  if (pIdx === branch.length - 1) return b; // Keep top bird
                  return null; // Hide the rest
                });
              });
              setBranches(resetToStart);
              
              // FIX BUG #2: Auto-start next discovery chain if more birds remain
              const remainingBirds = total - discovered;
              if (remainingBirds > 0) {
                setMessage(`✓ ${discovered}/${total}. Starting next chain...`);
                // Try to find next hidden bird automatically
                setTimeout(() => {
                  const nextResult = findMovesToExposeHidden(resetToStart, birdsPerBranch);
                  if (nextResult.success) {
                    setTargetHiddenPosition(nextResult.exposedPosition);
                    if (nextResult.moves.length === 0) {
                      setMessage(`✓ ${discovered}/${total}. Next bird exposed! Select and place.`);
                    } else {
                      setDiscoveryMoves(nextResult.moves);
                      setDiscoveryStep(0);
                      setMessage(`✓ ${discovered}/${total}. New chain found with ${nextResult.moves.length} move(s).`);
                    }
                  } else {
                    setMessage(`✓ ${discovered}/${total}. Ready - click 'Find Next Hidden' to continue.`);
                  }
                }, 100);
              } else {
                setMessage(`✓ ${discovered}/${total}. Ready for next chain - click 'Find Next Hidden'.`);
              }
            }, 800); // Small delay so user sees "Chain complete" message
          }
        }, 100);
      }
      return;
    }
    
    // Normal edit mode
    if (solution.length > 0 || !editMode) return;
    const bird = branches[branchIndex][positionIndex];
    if (bird) {
      removeBirdFromPosition(branchIndex, positionIndex);
    } else {
      addBirdToPosition(branchIndex, positionIndex);
    }
  };

  const toggleUnsurePosition = (branchIndex, positionIndex) => {
    if (!editMode) return;

    const key = `${branchIndex}-${positionIndex}`;
    const newUnsure = new Set(unsurePositions);

    if (newUnsure.has(key)) {
      newUnsure.delete(key);
    } else {
      newUnsure.add(key);
    }

    setUnsurePositions(newUnsure);
  };

  const handleBranchClick = (index) => {
    if (solution.length > 0 || editMode || discoveryMode) return;

    if (selectedBranch === null) {
      if (branches[index].filter((b) => b).length > 0) {
        setSelectedBranch(index);
      }
    } else {
      if (selectedBranch !== index) {
        const newBranches = [...branches];
        const fromBranch = [...newBranches[selectedBranch]].filter((b) => b);
        const toBranch = [...newBranches[index]].filter((b) => b);

        if (fromBranch.length > 0 && toBranch.length < birdsPerBranch) {
          const topBird = fromBranch[fromBranch.length - 1];

          if (
            toBranch.length === 0 ||
            toBranch[toBranch.length - 1] === topBird
          ) {
            let birdsToMove = 1;
            for (let i = fromBranch.length - 2; i >= 0; i--) {
              if (fromBranch[i] === topBird) birdsToMove++;
              else break;
            }

            const availableSpace = birdsPerBranch - toBranch.length;
            birdsToMove = Math.min(birdsToMove, availableSpace);

            for (let i = 0; i < birdsToMove; i++) {
              toBranch.push(fromBranch.pop());
            }

            newBranches[selectedBranch] = fromBranch;
            newBranches[index] = toBranch;
            setBranches(newBranches);
          }
        }
      }
      setSelectedBranch(null);
    }
  };

  const solvePuzzle = () => {
    const birdCount = {};
    branches.forEach((branch) => {
      branch.forEach((bird) => {
        if (bird) birdCount[bird] = (birdCount[bird] || 0) + 1;
      });
    });

    const invalidBirds = Object.entries(birdCount).filter(
      ([bird, count]) => count % birdsPerBranch !== 0,
    );
    if (invalidBirds.length > 0) {
      const details = invalidBirds
        .map(
          ([bird, count]) =>
            `${bird}: ${count} (needs ${Math.ceil(count / birdsPerBranch) * birdsPerBranch})`,
        )
        .join("\n");
      alert(
        `Puzzle is not solvable! Each bird type must appear exactly ${birdsPerBranch} times.\n\nInvalid counts:\n${details}`,
      );
      return;
    }

    console.log("Starting Beam Search solver with smart pouring...");

    const beamWidth = 1000;
    let currentLevel = [
      {
        state: branches.map((b) => [...b]),
        moves: [],
      },
    ];

    const visited = new Set([JSON.stringify(branches)]);
    const maxDepth = 100;

    const heuristic = (state) => {
      let score = 0;

      state.forEach((branch) => {
        if (
          branch.length === birdsPerBranch &&
          branch.every((b) => b === branch[0])
        ) {
          score += 100000;
        }
      });

      state.forEach((branch) => {
        if (branch.length > 0) {
          const topBird = branch[branch.length - 1];
          let sameCount = 1;
          for (let i = branch.length - 2; i >= 0; i--) {
            if (branch[i] === topBird) sameCount++;
            else break;
          }
          score += Math.pow(sameCount, 2) * 500;
        }
      });

      state.forEach((branch) => {
        const types = new Set(branch.filter((b) => b));
        if (types.size > 1) {
          score -= types.size * types.size * 200;
        }
      });

      state.forEach((branch) => {
        if (branch.length > 0) {
          const topBird = branch[branch.length - 1];
          const topCount = branch.filter((b) => b === topBird).length;
          if (topCount === branch.length && topCount < birdsPerBranch) {
            score += topCount * 1000;
          }
        }
      });

      return score;
    };

    const isComplete = (state) => {
      return state.every((branch) => {
        if (branch.length === 0) return true;
        if (branch.length !== birdsPerBranch) return false;
        return branch.every((bird) => bird === branch[0]);
      });
    };

    for (let depth = 0; depth < maxDepth; depth++) {
      console.log(`Depth ${depth}: ${currentLevel.length} states`);

      const nextLevel = [];

      for (const current of currentLevel) {
        if (isComplete(current.state)) {
          setSolution(current.moves);
          setCurrentStep(0);
          
          // Initialize visibility map if hidden mode is enabled
          if (hiddenMode) {
            setBirdVisibility(initializeVisibilityMap(branches));
          }
          
          console.log(
            `Solution found in ${current.moves.length} moves at depth ${depth}!`,
          );
          return;
        }

        for (let from = 0; from < current.state.length; from++) {
          const fromBranch = current.state[from];
          if (fromBranch.length === 0) continue;

          if (
            fromBranch.length === birdsPerBranch &&
            fromBranch.every((b) => b === fromBranch[0])
          ) {
            continue;
          }

          const topBird = fromBranch[fromBranch.length - 1];

          // Count consecutive birds of same type (for smart pouring)
          let consecutiveCount = 1;
          for (let i = fromBranch.length - 2; i >= 0; i--) {
            if (fromBranch[i] === topBird) consecutiveCount++;
            else break;
          }

          for (let to = 0; to < current.state.length; to++) {
            if (from === to) continue;

            const toBranch = current.state[to];
            if (toBranch.length >= birdsPerBranch) continue;

            if (
              toBranch.length === birdsPerBranch &&
              toBranch.every((b) => b === toBranch[0])
            ) {
              continue;
            }

            if (
              toBranch.length > 0 &&
              toBranch[toBranch.length - 1] !== topBird
            ) {
              continue;
            }

            if (toBranch.length === 0) {
              if (
                fromBranch.every((b) => b === topBird) &&
                fromBranch.length === birdsPerBranch
              ) {
                continue;
              }

              const sameCount = fromBranch.filter((b) => b === topBird).length;
              if (sameCount === fromBranch.length && fromBranch.length > 1) {
                continue;
              }
            }

            // Smart pouring: move multiple birds at once
            const availableSpace = birdsPerBranch - toBranch.length;
            const birdsToMove = Math.min(consecutiveCount, availableSpace);

            const newState = current.state.map((b) => [...b]);
            for (let i = 0; i < birdsToMove; i++) {
              newState[to].push(newState[from].pop());
            }

            const stateStr = JSON.stringify(newState);
            if (!visited.has(stateStr)) {
              visited.add(stateStr);
              nextLevel.push({
                state: newState,
                moves: [
                  ...current.moves,
                  { from, to, state: newState, birdsToMove },
                ],
                score: heuristic(newState),
              });
            }
          }
        }
      }

      if (nextLevel.length === 0) {
        alert("No solution found - search exhausted all possibilities!");
        return;
      }

      nextLevel.sort((a, b) => b.score - a.score);
      currentLevel = nextLevel.slice(0, beamWidth);
    }

    alert(
      `No solution found within depth ${maxDepth}. The puzzle may require more moves.`,
    );
  };

  // Discovery Mode Functions
  const enableDiscoveryMode = () => {
    // Save the current state as what we're discovering
    setOriginalPositions(branches.map(b => [...b]));
    
    // Initialize discoveredBirds with currently placed birds
    const initialDiscovered = {};
    branches.forEach((branch, bIdx) => {
      branch.forEach((bird, pIdx) => {
        if (bird !== null && bird !== undefined) {
          const key = `${bIdx}-${pIdx}`;
          initialDiscovered[key] = bird;
        }
      });
    });
    setDiscoveredBirds(initialDiscovered);
    
    // Keep branches as they are - don't hide anything
    // The user starts with whatever they've already placed
    setDiscoveryMode(true);
    setEditMode(false);
    setSolution([]);
    setCurrentStep(0);
    setDiscoveryMoves([]);
    setDiscoveryStep(0);
    
    // Calculate total birds and how many still need to be discovered
    const totalBirds = branches.reduce((sum, branch) => sum + branch.length, 0);
    const alreadyPlaced = Object.keys(initialDiscovered).length;
    const remaining = totalBirds - alreadyPlaced;
    
    setMessage(`Reveal mode! ${alreadyPlaced} birds already placed, ${remaining} still hidden.`);
  };

  const exitDiscoveryMode = () => {
    if (originalPositions.length > 0) {
      setBranches(originalPositions.map(b => [...b]));
    }
    setDiscoveryMode(false);
    setDiscoveryMoves([]);
    setDiscoveryStep(0);
    setDiscoveredBirds({});
    setOriginalPositions([]);
    setMessage("Full puzzle restored!");
  };

  const findNextHiddenBird = () => {
    setMessage("Searching...");
    
    // First, reset branches to clean state with only discovered birds (start a new discovery chain)
    const cleanState = originalPositions.map((branch, bIdx) => {
      if (branch.length === 0) return branch;
      return branch.map((b, pIdx) => {
        const posKey = `${bIdx}-${pIdx}`;
        if (discoveredBirds[posKey]) return discoveredBirds[posKey]; // Keep discovered birds
        if (pIdx === branch.length - 1) return b; // Keep top bird
        return null; // Hide everything else
      });
    });
    
    setBranches(cleanState);
    setDiscoveryMoves([]);
    setDiscoveryStep(0);
    
    const result = findMovesToExposeHidden(cleanState, birdsPerBranch);
    
    if (result.success) {
      // Set the target position that will be revealed
      setTargetHiddenPosition(result.exposedPosition);
      
      if (result.moves.length === 0) {
        setMessage("A hidden bird is exposed! Select bird and click (?).");
      } else {
        setDiscoveryMoves(result.moves);
        setDiscoveryStep(0);
        setMessage(`Starting new discovery chain. Found ${result.moves.length} move(s).`);
      }
    } else {
      setMessage(result.error);
      setTargetHiddenPosition(null);
    }
  };

  // Solution Playback Functions
  const startPlayback = () => {
    if (solution.length === 0) return;
    setIsPlaying(true);
    
    playbackIntervalRef.current = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= solution.length) {
          stopPlayback();
          return prev;
        }
        return prev + 1;
      });
    }, playbackSpeed);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  // Clean up interval on unmount or when solution changes
  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Stop playback if solution changes or is cleared
    if (solution.length === 0 || currentStep >= solution.length) {
      stopPlayback();
    }
  }, [solution.length, currentStep]);

  // Hidden mode helper functions
  const isBirdVisible = (branchIndex, position) => {
    if (!hiddenMode || discoveryMode) return true;
    return birdVisibility[`${branchIndex}-${position}`] || false;
  };

  const toggleHiddenMode = () => {
    const newHiddenMode = !hiddenMode;
    setHiddenMode(newHiddenMode);
    
    if (newHiddenMode) {
      // Initialize visibility when turning on hidden mode
      const currentState = getCurrentState();
      setBirdVisibility(initializeVisibilityMap(currentState));
    }
  };

  const getCurrentState = () => {
    // While animating, show the previous state (before the move)
    if (animating) {
      if (solution.length > 0 && currentStep > 1) {
        return solution[currentStep - 2].state;
      } else if (discoveryMode && discoveryMoves.length > 0 && discoveryStep > 1) {
        return discoveryMoves[discoveryStep - 2].state;
      } else if ((solution.length > 0 && currentStep === 1) || (discoveryMoves.length > 0 && discoveryStep === 1)) {
        return branches; // First move, show initial state
      }
    }
    
    // Normal state display (not animating)
    if (solution.length === 0) {
      if (discoveryMode && discoveryMoves.length > 0 && discoveryStep > 0) {
        return discoveryMoves[discoveryStep - 1].state;
      }
      return branches;
    }
    if (currentStep === 0) return branches;
    return solution[currentStep - 1].state;
  };

  const handleFileUpload = (e, birdType) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomBirdImages((prev) => ({
          ...prev,
          [birdType]: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (birdType, color) => {
    setBirdColors((prev) => ({
      ...prev,
      [birdType]: color,
    }));
  };

  // JSON Export/Import for Puzzles
  const currentState = getCurrentState();
  const birdCounts = countBirds();
  const exposedPositions = discoveryMode ? findExposedHiddenPositions(currentState) : [];
  const totalBirds = originalPositions.length > 0 
    ? originalPositions.reduce((sum, b) => sum + b.length, 0)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-2 sm:p-4 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-2 sm:mb-4 lg:mb-6 text-blue-900">
          🐦 Bird Sort Quest Solver
        </h1>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 lg:space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-2 sm:p-3 lg:p-4">
              {message && (
                <div className="mb-4 p-3 bg-blue-50 border-2 border-blue-300 rounded text-sm text-blue-900">
                  {message}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Birds per Branch: {birdsPerBranch}
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="6"
                    value={birdsPerBranch}
                    onChange={(e) =>
                      setBirdsPerBranch(parseInt(e.target.value))
                    }
                    className="w-full"
                    disabled={solution.length > 0}
                  />
                </div>
                <div className="flex items-end gap-2 flex-wrap">
                  <button
                    onClick={addBranch}
                    className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                    disabled={solution.length > 0 || branches.length >= 14}
                  >
                    <Plus size={16} /> Add
                  </button>
                  <button
                    onClick={removeBranch}
                    className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                    disabled={solution.length > 0}
                  >
                    <Minus size={16} /> Remove
                  </button>
                  <button
                    onClick={resetAll}
                    className="flex items-center gap-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
                  >
                    <RotateCcw size={16} /> Reset
                  </button>
                </div>
                
                {/* Bird Size Control - Hidden on mobile where size is fixed */}
                <div className="hidden sm:flex items-center gap-2 mt-3">
                  <label className="text-xs font-semibold text-gray-700">
                    Bird Size:
                  </label>
                  <input
                    type="range"
                    min="32"
                    max="64"
                    step="4"
                    value={birdSize}
                    onChange={(e) => setBirdSize(parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-600 w-12">{birdSize}px</span>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {!discoveryMode && (
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className={`flex-1 px-4 py-2 rounded font-semibold transition ${
                      editMode
                        ? "bg-purple-600 text-white hover:bg-purple-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    disabled={solution.length > 0}
                  >
                    {editMode ? "✏️ Edit Mode Active" : "✏️ Enable Edit Mode"}
                  </button>
                )}
                
                {!editMode && !solution.length && (
                  <button
                    onClick={discoveryMode ? exitDiscoveryMode : enableDiscoveryMode}
                    className={`flex-1 px-4 py-2 rounded font-semibold transition ${
                      discoveryMode
                        ? "bg-orange-600 text-white hover:bg-orange-700"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                    }`}
                  >
                    {discoveryMode ? "🔓 Exit Discovery Mode" : "🔍 Enable Discovery Mode"}
                  </button>
                )}
              </div>

              {editMode && (
                <div className="mb-4 p-3 bg-purple-50 rounded border-2 border-purple-300">
                  <p className="text-sm font-semibold text-purple-900 mb-2">
                    Edit Mode: Select a bird from the palette, then click
                    positions to add/remove
                  </p>
                  <p className="text-xs text-purple-700 mb-3">
                    • <strong>Left-click</strong> any position to place the
                    selected bird
                    <br />• <strong>Left-click</strong> existing birds to remove
                    them
                    <br />• <strong>Right-click</strong> any position to mark as
                    "unsure"
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <label className="text-xs font-semibold text-purple-900">
                      Unsure marker color:
                    </label>
                    <input
                      type="color"
                      value={unsureColor}
                      onChange={(e) => setUnsureColor(e.target.value)}
                      className="w-16 h-8 rounded cursor-pointer border-2 border-purple-300"
                      title="Change unsure marker color"
                    />
                    <span className="text-xs text-purple-600">
                      (Right-click positions to highlight)
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm("Clear all birds from all branches?")) {
                        setBranches(branches.map(() => []));
                        setSolution([]);
                        setCurrentStep(0);
                        setUnsurePositions(new Set());
                      }
                    }}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    🗑️ Clear All Birds
                  </button>
                </div>
              )}

              {discoveryMode && (
                <div className="mb-4 p-3 bg-orange-50 rounded border-2 border-orange-300">
                  <p className="text-sm font-semibold text-orange-900 mb-2">
                    🔍 Discovery Mode: {Object.keys(discoveredBirds).length}/{totalBirds} discovered
                  </p>
                  <p className="text-xs text-orange-700">
                    1. Click "Find Next Hidden"<br/>
                    2. Step through moves<br/>
                    3. Look at tablet to see what bird is there<br/>
                    4. Select that bird and click (?)
                  </p>
                </div>
              )}

              {discoveryMode && Object.keys(discoveredBirds).length < totalBirds && (
                <button
                  onClick={findNextHiddenBird}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold mb-4"
                >
                  <Lightbulb size={24} /> Find Next Hidden
                </button>
              )}

              {solution.length === 0 && !editMode && !discoveryMode && (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button
                      onClick={solvePuzzle}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
                    >
                      <Play size={24} /> Solve Puzzle
                    </button>
                  </div>
                  
                  {/* Database File Section */}
                  <div className="p-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Database File:</p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        onClick={() => setShowSaveDialog(true)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-semibold"
                      >
                        💾 Save Game
                      </button>
                      <button
                        onClick={() => setShowLoadDialog(true)}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition text-sm font-semibold"
                      >
                        📂 Load Game
                      </button>
                      <button
                        onClick={saveThemeToDatabase}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-semibold"
                      >
                        🎨 Save Theme
                      </button>
                      <button
                        onClick={loadThemeFromDatabase}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm font-semibold"
                      >
                        🎨 Load Theme
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        onClick={loadDatabaseFromFile}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition text-sm font-semibold"
                      >
                        📥 Load Database
                      </button>
                      <button
                        onClick={async () => {
                          const success = await saveDatabaseAs(database);
                          if (success) {
                            alert("Database saved to new location!");
                          }
                        }}
                        className="flex items-center justify-center gap-1 px-3 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition text-sm font-semibold"
                      >
                        💾 Save As...
                      </button>
                    </div>
                    <input
                      type="file"
                      id="database-file-input"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          uploadJSON(file, (data) => {
                            setDatabase({
                              theme: data.theme || database.theme,
                              puzzles: data.puzzles || []
                            });
                            alert(`Database loaded! Found ${data.puzzles?.length || 0} puzzles.`);
                          });
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {databaseFileHandle ? (
                        <span className="text-green-600 font-semibold">
                          ✓ Linked to file: {databaseFileHandle.name}
                        </span>
                      ) : (
                        <span>
                          No file selected - will prompt for location
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-2 sm:p-3 lg:p-4">
              <div className="grid grid-cols-2 gap-x-1 sm:gap-x-3 lg:gap-x-6 gap-y-2 sm:gap-y-3 lg:gap-y-4">
                {currentState.map((branch, branchIndex) => {
                  const isOddBranch = branchIndex % 2 === 0;
                  const displayNumber = branchIndex + 1;
                  const isFromBranch =
                    solution.length > 0 &&
                    currentStep > 0 &&
                    branchIndex === solution[currentStep - 1].from;
                  const isToBranch =
                    solution.length > 0 &&
                    currentStep > 0 &&
                    branchIndex === solution[currentStep - 1].to;

                  return (
                    <div key={branchIndex} className="relative">
                      {/* Branch number */}
                      <div className="text-[10px] sm:text-xs font-bold text-gray-600 text-center mb-0.5 sm:mb-1">
                        {displayNumber}
                      </div>
                      
                      {/* Birds sitting on branch */}
                      <div className="relative">
                        {/* Birds container */}
                        <div 
                          className={`flex items-end gap-0.5 sm:gap-1 pb-0.5 sm:pb-1 ${isOddBranch ? "" : "flex-row-reverse"}`}
                          onClick={() => !editMode && handleBranchClick(branchIndex)}
                        >
                          {Array.from({ length: birdsPerBranch }).map(
                            (_, i) => {
                              const bird = branch[i];
                              const isHidden = bird === null || bird === undefined;
                              const isExposed = discoveryMode && exposedPositions.some(
                                pos => pos.branchIndex === branchIndex && pos.positionIndex === i
                              );
                              const isTarget = discoveryMode && targetHiddenPosition && 
                                targetHiddenPosition.branchIndex === branchIndex && 
                                targetHiddenPosition.positionIndex === i;
                              
                              // Check if bird is visible in hidden mode
                              const isVisible = isBirdVisible(branchIndex, i);

                              let isBirdFrom = false;
                              if (solution.length > 0 && currentStep > 0) {
                                const move = solution[currentStep - 1];
                                if (branchIndex === move.from) {
                                  const prevState =
                                    currentStep > 1
                                      ? solution[currentStep - 2].state
                                      : branches;
                                  const prevBranchLength =
                                    prevState[move.from].length;
                                  const birdsMovedCount = move.birdsToMove || 1;
                                  isBirdFrom =
                                    i >= prevBranchLength - birdsMovedCount &&
                                    i < prevBranchLength;
                                }
                              }
                              // Don't highlight from/to in discovery mode (removed)

                              let isBirdTo = false;
                              if (solution.length > 0 && currentStep > 0 && !animating) {
                                isBirdTo =
                                  isToBranch &&
                                  i >=
                                    branch.filter((b) => b).length -
                                      (solution[currentStep - 1]?.birdsToMove ||
                                        1) &&
                                  i < branch.filter((b) => b).length;
                              }
                              // Don't highlight from/to in discovery mode (removed)
                              
                              const isUnsure = !discoveryMode && unsurePositions.has(
                                `${branchIndex}-${i}`,
                              );

                              return (
                                <div
                                  key={i}
                                  ref={(el) => {
                                    if (el) birdRefs.current[`${branchIndex}-${i}`] = el;
                                  }}
                                  className={`rounded-full border-2 flex-shrink-0 relative ${
                                    isHidden
                                      ? isExposed
                                        ? "border-yellow-400 border-dashed cursor-pointer hover:ring-2 hover:ring-yellow-500 bg-yellow-50"
                                        : isTarget
                                        ? "border-blue-500 border-dashed bg-blue-50"
                                        : "border-gray-400 border-dashed bg-gray-200"
                                      : bird && !isVisible
                                      ? "border-gray-400 bg-gray-400"
                                      : bird
                                      ? "border-gray-400 shadow-md cursor-pointer hover:ring-2 hover:ring-purple-400"
                                      : "border-dashed border-gray-300 cursor-pointer hover:bg-purple-100"
                                  } ${editMode || (discoveryMode && isExposed) ? "cursor-pointer" : ""} ${isBirdFrom ? "ring-4 ring-red-500 opacity-50" : ""} ${isBirdTo ? "ring-4 ring-green-500" : ""} ${isTarget ? "ring-4 ring-blue-500 animate-pulse" : ""}`}
                                  style={{
                                    width: `${responsiveBirdSize}px`,
                                    height: `${responsiveBirdSize}px`,
                                    ...(!isHidden && bird && isVisible ? getBirdStyle(bird) : {}),
                                    ...(bird && !isVisible && !isHidden ? {
                                      filter: 'blur(4px)',
                                      opacity: 0.4
                                    } : {}),
                                    ...(isUnsure && !discoveryMode
                                      ? {
                                          boxShadow: `0 0 0 4px ${unsureColor}`,
                                        }
                                      : {}),
                                    transition: 'all 0.3s ease-out',
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBirdClick(branchIndex, i);
                                  }}
                                  onContextMenu={(e) => {
                                    e.preventDefault();
                                    if (editMode && !discoveryMode) {
                                      toggleUnsurePosition(branchIndex, i);
                                    }
                                  }}
                                  title={
                                    isHidden
                                      ? isExposed
                                        ? "Click to place bird here!"
                                        : isTarget
                                        ? "🎯 Target: This hidden bird will be revealed"
                                        : "Hidden bird"
                                      : bird && !isVisible
                                      ? "Hidden bird - will be revealed"
                                      : isUnsure
                                      ? "Unsure position (right-click to remove)"
                                      : bird
                                        ? `${bird} (right-click to mark unsure)`
                                        : "Empty spot (right-click to mark unsure)"
                                  }
                                >
                                  {isHidden && isExposed && (
                                    <div className="absolute inset-0 flex items-center justify-center text-yellow-600 font-bold text-xl animate-pulse">
                                      ?
                                    </div>
                                  )}
                                  {bird && !isVisible && !isHidden && (
                                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-2xl">
                                      ?
                                    </div>
                                  )}
                                </div>
                              );
                            },
                          )}
                        </div>
                        
                        {/* Brown branch line */}
                        <div 
                          className={`h-1 sm:h-2 rounded-full ${
                            selectedBranch === branchIndex
                              ? "bg-blue-700"
                              : isFromBranch
                              ? "bg-red-700"
                              : isToBranch
                              ? "bg-green-700"
                              : "bg-amber-800"
                          }`}
                          style={{
                            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            transform: isFromBranch ? 'translateX(-4px)' : isToBranch ? 'translateX(4px)' : 'translateX(0)',
                          }}
                        />
                      </div>
                      
                    </div>
                  );
                })}
              </div>
            </div>

            {discoveryMoves.length > 0 && discoveryMode && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2">Expose Hidden Bird</h3>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setDiscoveryStep(Math.max(0, discoveryStep - 1))}
                    disabled={discoveryStep === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-300"
                  >
                    <ChevronLeft size={20} /> Prev
                  </button>
                  <span className="text-lg font-semibold text-gray-700">
                    {discoveryStep} / {discoveryMoves.length}
                  </span>
                  <button
                    onClick={() => setDiscoveryStep(Math.min(discoveryMoves.length, discoveryStep + 1))}
                    disabled={discoveryStep === discoveryMoves.length}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-300"
                  >
                    Next <ChevronRight size={20} />
                  </button>
                </div>
                {discoveryStep > 0 && discoveryMoves[discoveryStep - 1] && (
                  <p className="text-center mt-2 text-gray-700 text-sm">
                    Move from Branch #{discoveryMoves[discoveryStep - 1].from + 1} to #{discoveryMoves[discoveryStep - 1].to + 1}
                  </p>
                )}
              </div>
            )}

            {solution.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-800">
                    Solution: {solution.length} moves
                  </h2>
                  <button
                    onClick={() => {
                      stopPlayback();
                      setSolution([]);
                      setCurrentStep(0);
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
                  >
                    Close
                  </button>
                </div>
                
                {/* Playback Controls */}
                <div className="mb-4 p-3 bg-blue-50 rounded border-2 border-blue-200">
                  <div className="flex items-center gap-4 mb-3">
                    <button
                      onClick={togglePlayback}
                      className={`flex items-center gap-2 px-4 py-2 rounded font-semibold transition ${
                        isPlaying
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <div className="w-4 h-4 flex gap-1">
                            <div className="w-1.5 bg-white"></div>
                            <div className="w-1.5 bg-white"></div>
                          </div>
                          Pause
                        </>
                      ) : (
                        <>
                          <Play size={16} /> Play
                        </>
                      )}
                    </button>
                    <button
                      onClick={toggleHiddenMode}
                      className={`flex items-center gap-2 px-4 py-2 rounded font-semibold transition ${
                        hiddenMode
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-400 text-white hover:bg-gray-500"
                      }`}
                      title={hiddenMode ? "Birds will be revealed progressively" : "All birds visible"}
                    >
                      {hiddenMode ? <Eye size={16} /> : <EyeOff size={16} />}
                      {hiddenMode ? "Hidden" : "Visible"}
                    </button>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Speed: {(playbackSpeed / 1000).toFixed(1)}s/step
                      </label>
                      <input
                        type="range"
                        min="200"
                        max="5000"
                        step="100"
                        value={5200 - playbackSpeed}
                        onChange={(e) => {
                          const reversedValue = 5200 - parseInt(e.target.value);
                          setPlaybackSpeed(reversedValue);
                          if (isPlaying) {
                            stopPlayback();
                            setTimeout(startPlayback, 100);
                          }
                        }}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Slow (5s)</span>
                        <span>Fast (0.2s)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Manual Step Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      const newStep = Math.max(0, currentStep - 1);
                      setCurrentStep(newStep);
                      
                      // Update visibility map to previous state when going backwards in hidden mode
                      if (hiddenMode && newStep > 0) {
                        const prevState = newStep > 1 ? solution[newStep - 2].state : branches;
                        let newVisibility = initializeVisibilityMap(branches);
                        
                        // Replay all moves up to the previous step
                        for (let i = 0; i < newStep - 1; i++) {
                          newVisibility = updateVisibilityAfterMove(solution[i].state, newVisibility);
                        }
                        
                        setBirdVisibility(newVisibility);
                      } else if (hiddenMode && newStep === 0) {
                        // Reset to initial visibility
                        setBirdVisibility(initializeVisibilityMap(branches));
                      }
                    }}
                    disabled={currentStep === 0 || isPlaying}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-300"
                  >
                    <ChevronLeft size={20} /> Prev
                  </button>
                  <span className="text-lg font-semibold text-gray-700">
                    {currentStep} / {solution.length}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentStep(Math.min(solution.length, currentStep + 1))
                    }
                    disabled={currentStep === solution.length || isPlaying}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:bg-gray-300"
                  >
                    Next <ChevronRight size={20} />
                  </button>
                </div>
                {currentStep > 0 && (
                  <p className="text-center mt-4 text-gray-700">
                    Move from Branch #{solution[currentStep - 1].from + 1} (red)
                    to Branch #{solution[currentStep - 1].to + 1} (green)
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                {discoveryMode ? "Select Bird to Place" : "Bird Palette"}
              </h2>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {Object.keys(birdColors).map((birdType) => (
                  <div
                    key={birdType}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="relative">
                      <div
                        className={`rounded-full border-2 shadow-md cursor-pointer hover:scale-105 transition ${
                          selectedBirdType === birdType && (editMode || discoveryMode)
                            ? "border-purple-500 ring-4 ring-purple-300"
                            : "border-gray-400"
                        }`}
                        style={{
                          width: `${responsiveBirdSize}px`,
                          height: `${responsiveBirdSize}px`,
                          ...getBirdStyle(birdType)
                        }}
                        onClick={() => {
                          if (editMode || discoveryMode) {
                            setSelectedBirdType(birdType);
                          } else {
                            fileInputRefs.current[birdType]?.click();
                          }
                        }}
                        title={
                          editMode || discoveryMode
                            ? `Select ${birdType}`
                            : "Click to upload image"
                        }
                      />
                      <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {birdCounts[birdType] || 0}
                      </div>
                      <input
                        ref={(el) => (fileInputRefs.current[birdType] = el)}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, birdType)}
                      />
                    </div>
                    <input
                      type="color"
                      value={birdColors[birdType]}
                      onChange={(e) =>
                        handleColorChange(birdType, e.target.value)
                      }
                      className="w-12 h-6 rounded cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-600 mt-4">
                💡 {discoveryMode 
                  ? "Select bird from your tablet, then click (?) to place it"
                  : "In edit mode: click to select. Outside: click to upload images"}
              </p>
            </div>
          </div>
        </div>

        {/* Save Game Dialog */}
        {showSaveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                💾 Save Game to Database
              </h2>
              <p className="text-sm text-gray-600 mb-3">
                Enter a name for this puzzle configuration.
              </p>
              <input
                type="text"
                placeholder="e.g., Stage 703, Daily Challenge"
                value={puzzleName}
                onChange={(e) => setPuzzleName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && saveGameToDatabase()}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg mb-4 focus:border-blue-500 focus:outline-none"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={saveGameToDatabase}
                  disabled={!puzzleName.trim()}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Save to Database
                </button>
                <button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setPuzzleName("");
                  }}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                💡 Downloads updated bird-sort-database.json
              </p>
            </div>
          </div>
        )}

        {/* Load Dialog */}
        {showLoadDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">
                📂 Load Game from Database
              </h2>

              {database.puzzles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="text-lg">No saved puzzles in database</p>
                  <p className="text-sm mt-2">
                    Save a puzzle or import a database file
                  </p>
                </div>
              ) : (
                <div className="overflow-y-auto flex-1 mb-4">
                  <div className="space-y-2">
                    {database.puzzles.map((puzzle, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border-2 border-gray-200 rounded-lg hover:border-blue-400 transition"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {puzzle.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {puzzle.branches.length} branches,{" "}
                            {puzzle.birdsPerBranch} birds/branch
                            {puzzle.solution &&
                              puzzle.solution.length > 0 &&
                              ` • Solution: ${puzzle.solution.length} moves`}
                          </p>
                          <p className="text-xs text-gray-400">
                            Saved: {new Date(puzzle.savedAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => loadGameFromDatabase(puzzle)}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-semibold"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete "${puzzle.name}"?`)) {
                                const newPuzzles = database.puzzles.filter((_, i) => i !== index);
                                const newDatabase = { ...database, puzzles: newPuzzles };
                                setDatabase(newDatabase);
                                downloadJSON(newDatabase, 'bird-sort-database.json');
                              }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowLoadDialog(false)}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Status Bar - Show current puzzle name */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-1 sm:py-2 px-2 sm:px-4 shadow-lg z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2">
              <span className="font-semibold hidden sm:inline">Current Puzzle:</span>
              <span className="font-semibold sm:hidden">Puzzle:</span>
              <span className="bg-white bg-opacity-20 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                {puzzleName || "Untitled"}
              </span>
            </div>
            <div className="text-xs text-blue-200">
              {branches.length}×{birdsPerBranch}
            </div>
          </div>
        </div>

        {/* Flying Birds Overlay */}
        {flyingBirds.map((flyingBird, birdIndex) => {
          const fromRef = birdRefs.current[`${flyingBird.fromBranch}-${flyingBird.fromPosition}`];
          
          // Get the actual destination state (after the move completes)
          let destinationState;
          if (solution.length > 0 && currentStep > 0) {
            destinationState = solution[currentStep - 1].state;
          } else if (discoveryMoves.length > 0 && discoveryStep > 0) {
            destinationState = discoveryMoves[discoveryStep - 1].state;
          } else {
            return null;
          }
          
          if (!fromRef) return null;
          
          // Calculate destination position in the new state
          const toBranchState = destinationState[flyingBird.toBranch];
          if (!toBranchState) return null;
          
          // Find the ACTUAL positions where birds exist in the destination state
          // We need to map birdIndex to the actual array position in toBranchState
          const nonNullPositions = [];
          for (let i = 0; i < toBranchState.length; i++) {
            if (toBranchState[i] !== null && toBranchState[i] !== undefined) {
              nonNullPositions.push(i);
            }
          }
          
          // Birds are added to the top (end) of the array
          // birdIndex 0 is the first bird to fly (was at the top of source), goes to top of destination
          // So it should be at the LAST position in nonNullPositions
          const reversedIndex = nonNullPositions.length - 1 - birdIndex;
          if (reversedIndex < 0 || reversedIndex >= nonNullPositions.length) return null;
          
          const toPositionIndex = nonNullPositions[reversedIndex];
          
          // Get source ref
          const fromRect = fromRef.getBoundingClientRect();
          
          // NEW APPROACH: Calculate destination from branch container position
          // Find the branch container itself for more reliable positioning
          let branchContainer = null;
          
          // Try to find any bird on the destination branch to get to its parent container
          for (let i = 0; i < birdsPerBranch; i++) {
            const ref = birdRefs.current[`${flyingBird.toBranch}-${i}`];
            if (ref) {
              // Navigate up to find the flex container
              branchContainer = ref.parentElement;
              break;
            }
          }
          
          if (!branchContainer) return null;
          
          const containerRect = branchContainer.getBoundingClientRect();
          
          // Calculate where the bird should land
          // Match the gap values from CSS: gap-0.5 (2px) on mobile, gap-1 (4px) on larger
          const birdGap = window.innerWidth < 640 ? 2 : 4;
          
          // Determine if branch is odd or even (for left/right positioning)
          const isOddBranch = flyingBird.toBranch % 2 === 0;
          
          let toX, toY;
          // Y position: birds sit at the bottom of the container
          // pb-0.5 (2px) on mobile, pb-1 (4px) on larger
          const paddingBottom = window.innerWidth < 640 ? 2 : 4;
          toY = containerRect.bottom - responsiveBirdSize - paddingBottom;
          
          // X position: calculate from container edge based on position index
          if (isOddBranch) {
            // Odd branches: grow left to right from container left edge
            toX = containerRect.left + (toPositionIndex * (responsiveBirdSize + birdGap));
          } else {
            // Even branches with flex-row-reverse: grow right to left from container right edge
            toX = containerRect.right - (toPositionIndex + 1) * (responsiveBirdSize + birdGap) + birdGap;
          }
          
          const deltaX = toX - fromRect.left;
          const deltaY = toY - fromRect.top;
          
          // Calculate midpoint for arc
          const midX = deltaX / 2;
          const midY = deltaY / 2 - 50; // 50px arc upward
          
          return (
            <div
              key={flyingBird.id}
              className="fixed rounded-full border-2 border-gray-400 shadow-2xl pointer-events-none"
              style={{
                width: `${responsiveBirdSize}px`,
                height: `${responsiveBirdSize}px`,
                ...getBirdStyle(flyingBird.birdType),
                left: `${fromRect.left}px`,
                top: `${fromRect.top}px`,
                zIndex: 9999,
                animationName: `flyBird-${flyingBird.id}`,
                animationDuration: '0.6s',
                animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                animationDelay: `${flyingBird.delay}ms`,
                animationFillMode: 'forwards'
              }}
            >
              <style>{`
                @keyframes flyBird-${flyingBird.id} {
                  0% {
                    transform: translate(0px, 0px) scale(1);
                    opacity: 1;
                  }
                  50% {
                    transform: translate(${midX}px, ${midY}px) scale(1.2);
                    opacity: 0.95;
                  }
                  100% {
                    transform: translate(${deltaX}px, ${deltaY}px) scale(1);
                    opacity: 1;
                  }
                }
              `}</style>
            </div>
          );
        })}

      </div>
    </div>
  );
};


export default BirdSortSolver;
