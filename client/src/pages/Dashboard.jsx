import React, { useEffect, useState } from 'react';
import { Gem, Sparkles } from 'lucide-react';
import { Protect, useAuth } from '@clerk/clerk-react';
import CreationItem from '../components/CreationItem';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;


const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const {getToken} = useAuth();
  const getDashboardData = async () => {
    try {
      const { data } = await axios.get(`/api/user/get-user-creations?page=${currentPage}&limit=5`, {
        headers: {
          'Authorization': `Bearer ${await getToken()}`
        }
      });
      console.log("API Response:", data);
      setCreations((prev) => [...prev, ...data.creations]);
      setTotalPages(data.totalPages);
    }
    catch (error) {
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, [currentPage]);

  return (
    <div className="h-full overflow-y-auto p-6">
      
      {/* Cards */}
      <div className="flex flex-wrap gap-4">
        {/* Total Creations Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div>
            <p>Total Creations</p>
            <h2 className="font-bold">{creations?.length}</h2>
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
      {loading ? (
        <div className="col-span-full flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <div className="mt-10 max-w-full lg:max-w-3/4 space-y-4">
          <p className="text-lg font-semibold">Recent Creations</p>
          {creations?.length === 0 ? (
            <p className="text-center">No creations yet</p>
          ) : (
            creations?.map((item, index) => (
              <CreationItem key={index} item={item} />
            ))
          )}
        </div>
      )}
      <button className='bg-[#1E40AF] text-white px-4 py-2 rounded-full' onClick={() => {setCurrentPage(currentPage + 1); setLoading(true);}}>Load More</button>
    </div>
  );
};

export default Dashboard;
