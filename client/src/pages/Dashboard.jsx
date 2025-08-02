import React, { useEffect, useState } from 'react';
import { dummyCreationData } from '../assets/assets';
import { Gem, Sparkles } from 'lucide-react';
import { Protect } from '@clerk/clerk-react';
import CreationItem from '../components/CreationItem';

const Dashboard = () => {
  const [creations, setCreations] = useState([]);

  const getDashboardData = async () => {
    setCreations(dummyCreationData);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full overflow-y-auto p-6">
      
      {/* Cards */}
      <div className="flex flex-wrap gap-4">
        {/* Total Creations Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div>
            <p>Total Creations</p>
            <h2 className="font-bold">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] flex justify-center items-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div>
            <p>Active Plan</p>
            <h2 className="font-bold">
              <Protect plan="premium" fallback="Free" />
            </h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c335f2] to-[#d70bb8] flex justify-center items-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Recent Creations */}
      <div className="mt-10 max-w-full lg:max-w-3/4 space-y-4">
        <p className="text-lg font-semibold">Recent Creations</p>
        {creations.map((item, index) => (
          <CreationItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
