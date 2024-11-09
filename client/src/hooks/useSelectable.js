import { useState } from 'react';

export const useSelectable = () => {
  const [selectedIDs, setSelectedIDs] = useState([]);

  const toggleSelection = (id) => {
    setSelectedIDs((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  const clearSelection = () => setSelectedIDs([]);

  return { selectedIDs, toggleSelection, clearSelection };
};
