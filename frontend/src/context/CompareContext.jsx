import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = (product) => {
    if (compareList.some((p) => p.id === product.id)) {
      toast.info(`${product.name} is already in the comparison list.`);
      return;
    }
    if (compareList.length >= 4) {
      toast.warning('You can compare up to 4 products only.');
      return;
    }
    setCompareList((prev) => [...prev, product]);
    toast.success(`${product.name} added to comparison list.`);
  };

  const removeFromCompare = (productId) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId) => {
    return compareList.some((p) => p.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
