import { useNavigate } from 'react-router-dom';
import { awsInstances } from '../constants/awsInstances';
import InstanceCard from '../components/cards/InstanceCard';

const AWSInstancePage = () => {
  const navigate = useNavigate();

  const handleCreateAlarm = (instanceId) => {
    navigate(`/create-alarm/${instanceId}`);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 transition-opacity duration-300 w-full`}>
      <div className="relative min-h-screen flex flex-col w-full">
        <div className="flex-grow w-full px-2 sm:px-4 md:px-8 py-4 sm:py-8 md:py-12">
          <div className="max-w-[1600px] mx-auto">
            <div className="bg-white bg-opacity-90 shadow-lg rounded-2xl p-8 mb-6">
              <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-8">
                Customer Services
              </h2>
              <div className="grid grid-cols-1 gap-8">
                {awsInstances.map((instance) => (
                  <InstanceCard key={instance.instanceId} instance={instance} onCreateAlarm={handleCreateAlarm} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AWSInstancePage; 