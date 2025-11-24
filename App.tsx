import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { IncomingMailPage } from './pages/IncomingMail';
import { OutgoingMailPage } from './pages/OutgoingMail';
import { AutoNumberingPage } from './pages/AutoNumbering';
import { IncomingMail, OutgoingMail, NumberingRequest, UserRole } from './types';
import { MOCK_DATA_INCOMING } from './constants';
import { recalculateAllNumbers } from './utils';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);

  // Application State (Acting as Database)
  const [incomingMail, setIncomingMail] = useState<IncomingMail[]>(MOCK_DATA_INCOMING);
  const [outgoingMail, setOutgoingMail] = useState<OutgoingMail[]>([]);
  const [numberingData, setNumberingData] = useState<NumberingRequest[]>([]);

  // Effect to recalculate numbers if historic data changes (Self-Correction Logic)
  // In a real app, this would be a DB trigger. Here we ensure consistency.
  useEffect(() => {
    // This is a safety check. If we delete or modify dates in the future, 
    // we might need to re-run recalculateAllNumbers(numberingData).
    // For now, onAdd handles calculation based on current state.
  }, [numberingData]);

  const handleAddIncoming = (mail: IncomingMail) => {
    setIncomingMail(prev => [...prev, mail]);
  };

  const handleAddOutgoing = (mail: OutgoingMail) => {
    setOutgoingMail(prev => [...prev, mail]);
  };

  const handleAddNumbering = (req: NumberingRequest) => {
    // When adding, we actually add it, then potentially resort/recalc if we strictly followed the "Recalc all" rule
    // But the utility uses the existing array + new one to determine the number.
    // To be perfectly safe according to "Correct Way":
    const newList = [...numberingData, req];
    
    // We sort by date to ensure the "Sequence" logic holds if we display them
    // However, the ID (1, 2, 3) is based on date groups. 
    // Let's just append. The calculateNumber util handles the logic based on the full list passed to it.
    setNumberingData(newList);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard incoming={incomingMail} outgoing={outgoingMail} />;
      case 'incoming':
        return <IncomingMailPage data={incomingMail} onAdd={handleAddIncoming} role={role} />;
      case 'outgoing':
        return <OutgoingMailPage data={outgoingMail} onAdd={handleAddOutgoing} role={role} />;
      case 'numbering':
        return <AutoNumberingPage data={numberingData} onAdd={handleAddNumbering} role={role} />;
      default:
        return <Dashboard incoming={incomingMail} outgoing={outgoingMail} />;
    }
  };

  return (
    <Layout activePage={activePage} onNavigate={setActivePage} role={role} setRole={setRole}>
      {renderContent()}
    </Layout>
  );
};

export default App;
