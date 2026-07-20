import React, { createContext, useContext, useState, useEffect } from 'react';

const RailwayContext = createContext();

export const RailwayProvider = ({ children }) => {
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [passengerDetails, setPassengerDetails] = useState({
    name: '',
    phone: '',
    coach: '',
    seat: '',
    berth: '',
    pnr: ''
  });
  const [cart, setCart] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('railway_flow');
    if (saved) {
      const data = JSON.parse(saved);
      setSelectedTrain(data.selectedTrain);
      setSelectedStation(data.selectedStation);
      setPassengerDetails(data.passengerDetails);
      setCart(data.cart || []);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('railway_flow', JSON.stringify({
      selectedTrain,
      selectedStation,
      passengerDetails,
      cart
    }));
  }, [selectedTrain, selectedStation, passengerDetails, cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearFlow = () => {
    setSelectedTrain(null);
    setSelectedStation(null);
    setPassengerDetails({ name: '', phone: '', coach: '', seat: '', berth: '', pnr: '' });
    setCart([]);
    localStorage.removeItem('railway_flow');
  };

  return (
    <RailwayContext.Provider value={{
      selectedTrain, setSelectedTrain,
      selectedStation, setSelectedStation,
      passengerDetails, setPassengerDetails,
      cart, addToCart, removeFromCart, updateQuantity,
      orderInfo, setOrderInfo,
      clearFlow
    }}>
      {children}
    </RailwayContext.Provider>
  );
};

export const useRailway = () => useContext(RailwayContext);
