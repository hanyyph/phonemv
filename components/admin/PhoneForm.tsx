import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { Phone } from '../../types';
import { fetchPhoneSpecs } from '../../services/geminiService';
import { Wand2, LoaderCircle } from 'lucide-react';

interface PhoneFormProps {
  phone: Phone | null;
  onDone: () => void;
}

const PhoneForm: React.FC<PhoneFormProps> = ({ phone, onDone }) => {
  const { addPhone, updatePhone } = useData();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [specs, setSpecs] = useState('');
  const [image, setImage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (phone) {
      setBrand(phone.brand);
      setModel(phone.model);
      setSpecs(phone.specs);
      setImage(phone.image);
    } else {
      setBrand('');
      setModel('');
      setSpecs('');
      setImage('https://picsum.photos/400/600');
    }
  }, [phone]);

  const handleGenerateSpecs = async () => {
    if (!brand || !model) {
      setError('Please enter a brand and model first.');
      return;
    }
    setError('');
    setIsGenerating(true);
    try {
      const generatedSpecs = await fetchPhoneSpecs(`${brand} ${model}`);
      setSpecs(generatedSpecs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !model) {
      setError('Brand and Model are required.');
      return;
    }
    const phoneData = { brand, model, specs, image };
    if (phone) {
      updatePhone({ ...phoneData, id: phone.id });
    } else {
      addPhone(phoneData);
    }
    onDone();
  };
  
  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-white transition-colors";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div>
        <label htmlFor="brand" className={labelClasses}>Brand</label>
        <input id="brand" type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClasses} required />
      </div>
      <div>
        <label htmlFor="model" className={labelClasses}>Model</label>
        <input id="model" type="text" value={model} onChange={(e) => setModel(e.target.value)} className={inputClasses} required />
      </div>
      <div>
        <label htmlFor="image" className={labelClasses}>Image URL</label>
        <input id="image" type="text" value={image} onChange={(e) => setImage(e.target.value)} className={inputClasses} />
        {image && <img src={image} alt="preview" className="mt-2 h-32 w-auto object-cover rounded-md"/>}
      </div>
      <div>
        <label htmlFor="specs" className={labelClasses}>Specifications</label>
        <div className="relative">
          <textarea id="specs" value={specs} onChange={(e) => setSpecs(e.target.value)} className={`${inputClasses} h-40 font-mono text-xs`} />
          <button
            type="button"
            onClick={handleGenerateSpecs}
            disabled={isGenerating}
            className="absolute top-2 right-2 flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-full text-xs hover:bg-indigo-200 dark:hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin mr-1" /> : <Wand2 className="h-4 w-4 mr-1" />}
            {isGenerating ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>
      </div>
      <div className="flex justify-end pt-4">
        <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">Save Phone</button>
      </div>
    </form>
  );
};

export default PhoneForm;