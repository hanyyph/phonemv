
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Phone, Shop, Price } from '../types';

interface DataContextType {
  phones: Phone[];
  shops: Shop[];
  prices: Price[];
  addPhone: (phone: Omit<Phone, 'id'>) => void;
  updatePhone: (updatedPhone: Phone) => void;
  deletePhone: (phoneId: string) => void;
  addShop: (shop: Omit<Shop, 'id'>) => void;
  updateShop: (updatedShop: Shop) => void;
  deleteShop: (shopId: string) => void;
  addPrice: (price: Omit<Price, 'id'>) => void;
  updatePrice: (updatedPrice: Price) => void;
  deletePrice: (priceId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const initialPhones: Phone[] = [
  { id: '1', brand: 'Apple', model: 'iPhone 15 Pro', specs: JSON.stringify({ "Display": "6.1-inch Super Retina XDR", "Processor": "A17 Pro", "RAM": "8GB", "Storage": "256GB" }, null, 2), image: 'https://picsum.photos/id/10/400/600' },
  { id: '2', brand: 'Samsung', model: 'Galaxy S24 Ultra', specs: JSON.stringify({ "Display": "6.8-inch Dynamic AMOLED 2X", "Processor": "Snapdragon 8 Gen 3", "RAM": "12GB", "Storage": "512GB" }, null, 2), image: 'https://picsum.photos/id/20/400/600' },
  { id: '3', brand: 'Google', model: 'Pixel 8 Pro', specs: JSON.stringify({ "Display": "6.7-inch LTPO OLED", "Processor": "Tensor G3", "RAM": "12GB", "Storage": "256GB" }, null, 2), image: 'https://picsum.photos/id/30/400/600' }
];

const initialShops: Shop[] = [
  { id: '101', name: 'Gadget World', location: 'New York, NY', contact: 'sales@gadgetworld.com' },
  { id: '102', name: 'Mobile Hub', location: 'Los Angeles, CA', contact: 'contact@mobilehub.com' },
  { id: '103', name: 'Tech Spire', location: 'Chicago, IL', contact: 'support@techspire.com' }
];

const initialPrices: Price[] = [
  { id: '1001', phoneId: '1', shopId: '101', price: 999 },
  { id: '1002', phoneId: '1', shopId: '102', price: 989 },
  { id: '1003', phoneId: '2', shopId: '101', price: 1299 },
  { id: '1004', phoneId: '2', shopId: '103', price: 1250 },
  { id: '1005', phoneId: '3', shopId: '102', price: 899 },
  { id: '1006', phoneId: '3', shopId: '103', price: 910 },
  { id: '1007', phoneId: '1', shopId: '103', price: 1010 },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [phones, setPhones] = useState<Phone[]>(initialPhones);
  const [shops, setShops] = useState<Shop[]>(initialShops);
  const [prices, setPrices] = useState<Price[]>(initialPrices);

  const addPhone = (phone: Omit<Phone, 'id'>) => setPhones(prev => [...prev, { ...phone, id: Date.now().toString() }]);
  const updatePhone = (updatedPhone: Phone) => setPhones(prev => prev.map(p => p.id === updatedPhone.id ? updatedPhone : p));
  const deletePhone = (phoneId: string) => {
    setPhones(prev => prev.filter(p => p.id !== phoneId));
    setPrices(prev => prev.filter(p => p.phoneId !== phoneId)); // Cascade delete prices
  }

  const addShop = (shop: Omit<Shop, 'id'>) => setShops(prev => [...prev, { ...shop, id: Date.now().toString() }]);
  const updateShop = (updatedShop: Shop) => setShops(prev => prev.map(s => s.id === updatedShop.id ? updatedShop : s));
  const deleteShop = (shopId: string) => {
      setShops(prev => prev.filter(s => s.id !== shopId));
      setPrices(prev => prev.filter(p => p.shopId !== shopId)); // Cascade delete prices
  }

  const addPrice = (price: Omit<Price, 'id'>) => {
      // Prevent duplicate phone/shop pairs
      const existing = prices.find(p => p.phoneId === price.phoneId && p.shopId === price.shopId);
      if (existing) {
          updatePrice({ ...price, id: existing.id });
      } else {
          setPrices(prev => [...prev, { ...price, id: Date.now().toString() }]);
      }
  };
  const updatePrice = (updatedPrice: Price) => setPrices(prev => prev.map(p => p.id === updatedPrice.id ? updatedPrice : p));
  const deletePrice = (priceId: string) => setPrices(prev => prev.filter(p => p.id !== priceId));

  const value = { phones, shops, prices, addPhone, updatePhone, deletePhone, addShop, updateShop, deleteShop, addPrice, updatePrice, deletePrice };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
