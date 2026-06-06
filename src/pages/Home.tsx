import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useGroupStore } from '@/store/groupStore';
import GroupCard from '@/components/GroupCard';

const tabs = ['全部', '进行中', '已成团', '未成团'];
const statusMap: Record<string, string | undefined> = {
  '全部': undefined,
  '进行中': 'active',
  '已成团': 'success',
  '未成团': 'failed',
};

export default function Home() {
  const { groups, loading, fetchGroups } = useGroupStore();
  const [activeTab, setActiveTab] = useState('全部');

  useEffect(() => {
    fetchGroups(statusMap[activeTab]);
  }, [activeTab, fetchGroups]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-gradient-warm text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && groups.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">暂无拼团信息</p>
          <p className="text-sm mt-2">快来发起第一个拼团吧！</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      <Link
        to="/create"
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-warm rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform z-40"
      >
        <Plus size={28} />
      </Link>
    </div>
  );
}
