import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Price } from '../../types';
import Modal from '../common/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const PriceForm: React.FC<{ price: Price | null; onDone: () => void; }> = ({ price, onDone }) => {
  const { addPrice, updatePrice, phones, shops, prices } = useData();
  const [phoneId, setPhoneId] = useState('');
  const [shopId, setShopId] = useState('');
  const [priceValue, setPriceValue] = useState(0);

  useEffect(() => {
    if (price) {
      setPhoneId(price.phoneId);
      setShopId(price.shopId);
      setPriceValue(price.price);
    } else {
      setPhoneId(phones[0]?.id || '');
      setShopId(shops[0]?.id || '');
      setPriceValue(0);
    }
  }, [price, phones, shops]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneId || !shopId) return;
    const priceData = { phoneId, shopId, price: priceValue };

    if (price) {
      updatePrice({ ...priceData, id: price.id });
    } else {
      const existing = prices.find(p => p.phoneId === phoneId && p.shopId === shopId);
      if (existing) {
        updatePrice({ ...priceData, id: existing.id });
      } else {
        addPrice(priceData);
      }
    }
    onDone();
  };
  
  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="phone" className={labelClasses}>Phone</label>
        <select id="phone" value={phoneId} onChange={(e) => setPhoneId(e.target.value)} className={inputClasses} disabled={!!price}>
          {phones.map(p => <option key={p.id} value={p.id}>{p.brand} {p.model}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="shop" className={labelClasses}>Shop</label>
        <select id="shop" value={shopId} onChange={(e) => setShopId(e.target.value)} className={inputClasses} disabled={!!price}>
           {shops.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="price" className={labelClasses}>Price (MVR)</label>
        <input id="price" type="number" value={priceValue} onChange={(e) => setPriceValue(Number(e.target.value))} className={inputClasses} required />
      </div>
      <div className="flex justify-end pt-4">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Save Price</button>
      </div>
    </form>
  );
};


const ManagePrices: React.FC = () => {
  const { prices, phones, shops, deletePrice } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<Price | null>(null);

  const getPhoneName = (id: string) => {
    const phone = phones.find(p => p.id === id);
    return phone ? `${phone.brand} ${phone.model}` : 'N/A';
  }
  const getShopName = (id: string) => shops.find(s => s.id === id)?.name || 'N/A';

  const handleAdd = () => {
    setEditingPrice(null);
    setIsModalOpen(true);
  };

  const handleEdit = (price: Price) => {
    setEditingPrice(price);
    setIsModalOpen(true);
  };

  return (
     <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Manage Prices</h2>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" /> Add/Update Price
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-slate-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">Phone</th>
              <th scope="col" className="px-6 py-3">Shop</th>
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3 text-right rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prices.map((price) => (
              <tr key={price.id} className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{getPhoneName(price.phoneId)}</td>
                <td className="px-6 py-4">{getShopName(price.shopId)}</td>
                <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">MVR {price.price.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => handleEdit(price)} className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><Edit className="h-5 w-5"/></button>
                    <button onClick={() => deletePrice(price.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><Trash2 className="h-5 w-5"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPrice ? 'Edit Price' : 'Add/Update Price'}>
        <PriceForm price={editingPrice} onDone={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ManagePrices;