import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Phone } from '../../types';
import Modal from '../common/Modal';
import PhoneForm from './PhoneForm';
import { Plus, Edit, Trash2, Wand2, LoaderCircle } from 'lucide-react';
import { generatePhoneDetails } from '../../services/geminiService';

const ManagePhones: React.FC = () => {
  const { phones, deletePhone, addPhone } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState<Phone | null>(null);

  // New state for AI modal
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [phoneNameToGenerate, setPhoneNameToGenerate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');

  const handleAddManually = () => {
    setEditingPhone(null);
    setIsModalOpen(true);
  };

  const handleAddWithAI = () => {
    setGenerationError('');
    setPhoneNameToGenerate('');
    setIsAIModalOpen(true);
  };

  const handleEdit = (phone: Phone) => {
    setEditingPhone(phone);
    setIsModalOpen(true);
  };

  const handleGenerateAndAddPhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNameToGenerate) {
      setGenerationError('Please enter a phone name.');
      return;
    }
    setIsGenerating(true);
    setGenerationError('');
    try {
      const details = await generatePhoneDetails(phoneNameToGenerate);
      
      const newPhone = {
        brand: details.brand,
        model: details.model,
        specs: JSON.stringify(details.specs, null, 2),
        image: `https://source.unsplash.com/400x600/?${encodeURIComponent(details.imageSearchQuery)}`
      };

      addPhone(newPhone);
      setIsAIModalOpen(false);

    } catch (error: any) {
      setGenerationError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Manage Phones</h2>
        <div className="flex items-center space-x-2">
            <button
              onClick={handleAddWithAI}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors"
            >
              <Wand2 className="h-5 w-5 mr-2" /> Add with AI
            </button>
            <button
              onClick={handleAddManually}
              className="flex items-center px-4 py-2 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-600 rounded-md hover:bg-gray-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" /> Add Manually
            </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-slate-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-l-lg">Image</th>
              <th scope="col" className="px-6 py-3">Brand</th>
              <th scope="col" className="px-6 py-3">Model</th>
              <th scope="col" className="px-6 py-3 text-right rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            {phones.map((phone) => (
              <tr key={phone.id} className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                <td className="px-6 py-4">
                  <img src={phone.image} alt={phone.model} className="h-16 w-12 object-cover rounded-md bg-gray-200 dark:bg-slate-700"/>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{phone.brand}</td>
                <td className="px-6 py-4">{phone.model}</td>
                <td className="px-6 py-4">
                   <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => handleEdit(phone)} className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><Edit className="h-5 w-5"/></button>
                    <button onClick={() => deletePhone(phone.id)} className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"><Trash2 className="h-5 w-5"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Manual Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingPhone ? 'Edit Phone' : 'Add Phone'}>
        <PhoneForm phone={editingPhone} onDone={() => setIsModalOpen(false)} />
      </Modal>

      {/* AI Add Modal */}
      <Modal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} title="Add Phone with AI">
        <form onSubmit={handleGenerateAndAddPhone} className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Enter the name of a phone (e.g., "Google Pixel 8 Pro") and our AI will attempt to fill in the details automatically.
            </p>
            {generationError && <p className="text-red-500 text-sm bg-red-100 dark:bg-red-900/30 p-2 rounded-md">{generationError}</p>}
            <div>
                <label htmlFor="phoneName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone Name</label>
                <input 
                    id="phoneName" 
                    type="text" 
                    value={phoneNameToGenerate}
                    onChange={(e) => setPhoneNameToGenerate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white transition-colors"
                    placeholder="e.g., Samsung Galaxy S24 Ultra"
                    required
                    autoFocus
                />
            </div>
            <div className="flex justify-end pt-4">
                <button 
                    type="submit" 
                    disabled={isGenerating}
                    className="flex items-center justify-center min-w-[10rem] px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors"
                >
                    {isGenerating ? <LoaderCircle className="h-5 w-5 animate-spin" /> : 'Generate & Add Phone'}
                </button>
            </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManagePhones;