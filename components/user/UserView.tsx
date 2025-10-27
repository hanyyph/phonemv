
import React, { useState } from 'react';
import { Phone } from '../../types';
import PhoneList from './PhoneList';
import PhoneDetail from './PhoneDetail';

const UserView: React.FC = () => {
  const [selectedPhone, setSelectedPhone] = useState<Phone | null>(null);

  if (selectedPhone) {
    return <PhoneDetail phone={selectedPhone} onBack={() => setSelectedPhone(null)} />;
  }

  return <PhoneList onSelectPhone={setSelectedPhone} />;
};

export default UserView;
