import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { Phone, Price, Shop } from '../../types';
import { ChevronLeft, MapPin, Phone as PhoneIcon } from 'lucide-react';

interface PhoneDetailProps {
  phone: Phone;
  onBack: () => void;
}

interface PriceWithShop extends Price {
  shop: Shop | undefined;
}

const PhoneDetail: React.FC<PhoneDetailProps> = ({ phone, onBack }) => {
  const { prices, shops } = useData();

  const phonePrices = useMemo(() => {
    return prices
      .filter((p) => p.phoneId === phone.id)
      .map((p) => ({
        ...p,
        shop: shops.find((s) => s.id === p.shopId),
      }))
      .sort((a, b) => a.price - b.price);
  }, [phone.id, prices, shops]);

  const specsObject = useMemo(() => {
    try {
      return JSON.parse(phone.specs);
    } catch (e) {
      return {};
    }
  }, [phone.specs]);


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="flex items-center mb-6 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium group">
        <ChevronLeft className="h-5 w-5 mr-1 transform group-hover:-translate-x-1 transition-transform" /> Back to List
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg sticky top-24">
                <img src={phone.image} alt={phone.model} className="w-full h-auto object-contain rounded-lg max-h-96" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4 text-center">{phone.brand}</h1>
                <h2 className="text-xl font-medium text-gray-600 dark:text-gray-300 text-center">{phone.model}</h2>
            </div>
        </div>

        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-3">Price Comparison</h2>
            {phonePrices.length > 0 ? (
                <ul className="space-y-3">
                {phonePrices.map(({ id, price, shop }, index) => (
                  <li key={id} className={`flex items-center justify-between p-4 rounded-md transition-colors ${index === 0 ? 'bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700' : 'bg-gray-50 dark:bg-slate-700/50'}`}>
                    <div>
                      <p className={`font-semibold text-lg ${index === 0 ? 'text-indigo-800 dark:text-indigo-200' : 'text-gray-800 dark:text-gray-200'}`}>{shop?.name || 'Unknown Shop'}</p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0"/>
                          <span>{shop?.location}</span>
                      </div>
                       <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <PhoneIcon className="h-4 w-4 mr-2 flex-shrink-0"/>
                          <span>{shop?.contact}</span>
                      </div>
                    </div>
                    <p className={`text-2xl font-bold whitespace-nowrap pl-4 ${index === 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-800 dark:text-gray-200'}`}>MVR {price.toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No prices available for this model yet.</p>
            )}
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
             <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-3">Specifications</h2>
              <div className="space-y-1">
                 {Object.entries(specsObject).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <span className="font-medium text-gray-600 dark:text-gray-400">{key}</span>
                      <span className="text-right text-gray-800 dark:text-gray-200">{String(value)}</span>
                    </div>
                 ))}
                 {Object.keys(specsObject).length === 0 && (
                     <p className="text-gray-500 dark:text-gray-400 text-center py-8">No specifications available.</p>
                 )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneDetail;