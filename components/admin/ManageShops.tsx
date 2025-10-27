import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Shop } from '../../types';
import Modal from '../common/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ShopForm: React.FC<{ shop: Shop | null; onDone: () => void; }> = ({ shop, onDone }) => {
  const { addShop, updateShop } = useData();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');

  useEffect(() => {
    if (shop) {
      setName(shop.name);
      setLocation(shop.location);
      setContact(shop.contact);
    } else {
      setName('');
      setLocation('');
      setContact('');
    }
  }, [shop]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const shopData = { name, location, contact };
    if (shop) {
      updateShop({ ...shopData, id: shop.id });
    } else {
      addShop(shopData);
    }
    onDone();
  };
  
  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className={labelClasses}>Shop Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} required />
      </div>
      <div>
        <label htmlFor="location" className={labelClasses}>Location</label>
        <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} className={inputClasses} required />
      </div>
      <div>
        <label htmlFor="contact" className={labelClasses}>Contact Info</label>
        <input id="contact" type="text" value={contact} onChange={(e) => setContact(e.target.value)} className={inputClasses} required />
      </div>
      <div className="flex justify-end pt-4">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Save Shop</button>
      </div>
    </form>
  );
};


const ManageShops: React.FC = () => {
  const { shops, deleteShop } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);

  const handleAdd = () => {
    setEditingShop(null);
    setIsModalOpen(true);
  };

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Manage Shops</h2>
        <button
          onClick={handleAdd}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Shop
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-slate-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">Name</th>
              <th scope="col" className="px-6 py-3">Location</th>
              <th scope="col" className="px-6 py-3">Contact</th>
              <th scope="col" className="px-6 py-3 text-right rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop) => (
              <tr key={shop.id} className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{shop.name}</td>
                <td className="px-6 py-4">{shop.location}</td>
                <td className="px-6 py-4">{shop.contact}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => handleEdit(shop)} className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><Edit className="h-5 w-5"/></button>
                    <button onClick={() => deleteShop(shop.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><Trash2 className="h-5 w-5"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingShop ? 'Edit Shop' : 'Add Shop'}>
        <ShopForm shop={editingShop} onDone={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ManageShops;