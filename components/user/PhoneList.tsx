import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Phone, Price } from '../../types';
import { Search, Filter } from 'lucide-react';
import Modal from '../common/Modal';

interface PhoneListProps {
  onSelectPhone: (phone: Phone) => void;
}

const PhoneCard: React.FC<{ phone: Phone; price?: number; onClick: () => void; }> = ({ phone, price, onClick }) => {
    const specs = useMemo(() => {
        try {
            return JSON.parse(phone.specs || '{}');
        } catch {
            return {};
        }
    }, [phone.specs]);

    const keySpecsToShow = ['Processor', 'RAM', 'Storage', 'Display'];
    const displayedSpecs = keySpecsToShow.map(key => ({ key, value: specs[key] })).filter(spec => spec.value);

    return (
        <div
            onClick={onClick}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col border border-transparent hover:border-indigo-500"
        >
            <div className="h-64 w-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
              <img className="h-full w-full object-cover" src={phone.image} alt={phone.model} />
            </div>
            <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">{phone.brand}</h3>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1 leading-tight">{phone.model}</h2>
                
                <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 space-y-1.5 flex-grow">
                    {displayedSpecs.slice(0, 3).map(spec => (
                        <p key={spec.key} className="truncate" title={`${spec.key}: ${spec.value}`}>
                            <span className="font-semibold text-gray-700 dark:text-gray-300">{spec.key}:</span> {spec.value}
                        </p>
                    ))}
                </div>

                <div className="mt-5 pt-4 border-t border-gray-200 dark:border-slate-700">
                    {price !== undefined ? (
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">From</span>
                            <p className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                MVR {price.toLocaleString()}
                            </p>
                        </div>
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 h-[48px] flex items-center">No prices available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const FilterCheckbox: React.FC<{label: string, isChecked: boolean, onChange: () => void}> = ({ label, isChecked, onChange }) => (
    <label className="flex items-center space-x-3 cursor-pointer">
        <input type="checkbox" checked={isChecked} onChange={onChange} className="form-checkbox h-5 w-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
        <span className="text-gray-700 dark:text-gray-300">{label}</span>
    </label>
);

const FilterPanel: React.FC<{
    allBrands: string[];
    selectedBrands: string[];
    handleBrandChange: (brand: string) => void;
    allModels: string[];
    selectedModels: string[];
    handleModelChange: (model: string) => void;
    clearFilters: () => void;
}> = ({ allBrands, selectedBrands, handleBrandChange, allModels, selectedModels, handleModelChange, clearFilters }) => (
    <>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Filters</h3>
            <button onClick={clearFilters} className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">Clear All</button>
        </div>
        
        {/* Brands Filter */}
        <div>
            <h4 className="font-semibold mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">Brand</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {allBrands.map(brand => (
                    <FilterCheckbox key={brand} label={brand} isChecked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)} />
                ))}
            </div>
        </div>

        {/* Models Filter */}
        <div className="mt-6">
            <h4 className="font-semibold mb-3 border-b border-gray-200 dark:border-slate-700 pb-2">Model</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {allModels.map(model => (
                    <FilterCheckbox key={model} label={model} isChecked={selectedModels.includes(model)} onChange={() => handleModelChange(model)} />
                ))}
            </div>
        </div>
    </>
);


const PhoneList: React.FC<PhoneListProps> = ({ onSelectPhone }) => {
  const { phones, prices } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const allBrands = useMemo(() => [...new Set(phones.map(p => p.brand))].sort(), [phones]);
  const allModels = useMemo(() => [...new Set(phones.map(p => p.model))].sort(), [phones]);

  const getLowestPrice = (phoneId: string): number | undefined => {
    const phonePrices = prices.filter((p) => p.phoneId === phoneId);
    if (phonePrices.length === 0) return undefined;
    return Math.min(...phonePrices.map((p) => p.price));
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };
  
  const handleModelChange = (model: string) => {
    setSelectedModels(prev =>
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  };

  const clearFilters = () => {
      setSelectedBrands([]);
      setSelectedModels([]);
  };

  const filteredPhones = useMemo(() => {
    return phones.filter(phone => {
        const searchTermMatch =
            phone.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            phone.model.toLowerCase().includes(searchTerm.toLowerCase());
        
        const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(phone.brand);
        
        const modelMatch = selectedModels.length === 0 || selectedModels.includes(phone.model);

        return searchTermMatch && brandMatch && modelMatch;
    });
  }, [phones, searchTerm, selectedBrands, selectedModels]);

  const filterPanelProps = {
    allBrands, selectedBrands, handleBrandChange,
    allModels, selectedModels, handleModelChange,
    clearFilters
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white tracking-tight">Find Your Next Phone</h1>
        <p className="mt-2 text-lg text-center text-gray-600 dark:text-gray-400">Compare prices and find the best deal.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
                <FilterPanel {...filterPanelProps} />
            </div>
        </aside>

        <main className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <div className="relative w-full flex-grow">
                    <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                    <input
                    type="text"
                    placeholder="Search phones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                 <button 
                    onClick={() => setIsFilterDrawerOpen(true)} 
                    className="lg:hidden w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-slate-600 rounded-full bg-white dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-600 whitespace-nowrap"
                >
                    <Filter className="h-5 w-5 mr-2" />
                    <span>Filters</span>
                </button>
            </div>

            {filteredPhones.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredPhones.map((phone) => (
                        <PhoneCard 
                            key={phone.id}
                            phone={phone}
                            price={getLowestPrice(phone.id)}
                            onClick={() => onSelectPhone(phone)}
                        />
                    ))}
                </div>
             ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">No Phones Found</h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
                </div>
             )
            }
        </main>
      </div>
       <Modal isOpen={isFilterDrawerOpen} onClose={() => setIsFilterDrawerOpen(false)} title="Filters">
            <div className="bg-white dark:bg-slate-800 p-2 rounded-lg">
                <FilterPanel {...filterPanelProps} />
            </div>
      </Modal>
    </div>
  );
};

export default PhoneList;