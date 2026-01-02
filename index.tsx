import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  Plus, 
  Activity, 
  ChevronDown, 
  ChevronUp,
  Image as ImageIcon,
  Upload,
  Eye,
  MessageCircle,
  Phone,
  RefreshCw,
  ShieldAlert,
  Sliders,
  FileText,
  BarChart3
} from 'lucide-react';

// --- 类型定义 ---

type TabType = '地域项目价格' | '项目质保' | '好评返现' | '用户黑名单';

// --- 配色常量 (参考截图) ---
const THEME = {
  primary: '#1890ff',     // 截图中的亮蓝色
  success: '#52c41a',     // 绿色
  warning: '#faad14',     // 橙色
  error: '#ff4d4f',       // 红色
  border: '#f0f0f0',      // 浅灰边框
  tableStripe: '#FFF0F0'  // 表格隔行底色
};

// --- 配置项 ---

const TAB_CONFIGS: Record<TabType, { search: string[], headers: string[], buttons: string[] }> = {
  '地域项目价格': {
    search: ['录入人', '录入时间', '价格类型', '地域', '系统项目', '入表状态', '子项目一', '子项目二'],
    headers: ['录入人', '录入时间', '修改时间', '地域', '系统项目', '子项目一', '子项目二', '价格类型', '价格明细', '入表状态', '地址', '备注'],
    buttons: ['新增市场价', '新增内部价']
  },
  '项目质保': {
    search: ['项目id', '项目名称', '质保期'],
    headers: ['项目id', '项目名称', '质保期'],
    buttons: ['新增', '上传excel']
  },
  '好评返现': {
    search: ['订单号', '申请时间', '审核状态'],
    headers: ['订单号', '评论人', '评论时间', '返现金额', '奖型', '图片', '审核状态', '审核时间', '审核人', '审核说明'],
    buttons: []
  },
  '用户黑名单': {
    search: ['关键字', '名单类型'],
    headers: ['申请人', '申请时间', '名单类型', '来源平台', '平台用户ID', '用户名', '手机号', '加入原因', '申请有效期', '状态', '备注'],
    buttons: ['新增']
  }
};

// --- Mock Data 生成 ---

const generateRows = (tab: TabType): any[] => {
  const config = TAB_CONFIGS[tab];
  return Array.from({ length: 15 }).map((_, i) => {
    const row: any = { id: i + 1 };
    config.headers.forEach(h => {
      if (h.includes('时间')) {
        row[h] = `2025-12-${String(16 - i).padStart(2, '0')} 11:47:05`;
      } else if (h === '入表状态') {
        row[h] = i % 5 === 0;
      } else if (h === '录入人' || h === '申请人' || h === '审核人') {
        const names = ['陈青平', '吴会东', '管理员', '张三'];
        row[h] = names[i % names.length];
      } else if (h === '地域') {
        row[h] = i % 2 === 0 ? '上海市崇明区' : '新疆维吾尔自治区昌吉回族自治州...';
      } else if (h === '系统项目' || h === '项目名称') {
        const projs = ['专利申请', '跑道翻新', '消杀白蚁', '家电回收', '地毯清洗', '空调回收'];
        row[h] = projs[i % projs.length];
      } else if (h === '价格类型') {
        row[h] = i % 2 === 0 ? '内部价' : '公示价';
      } else if (h === '价格明细' || h === '质保期') {
        row[h] = i % 2 === 0 ? 'Udh大宝贝' : '哈哈一点心意';
        if (tab === '项目质保') row[h] = i % 3 === 0 ? '具体项目定' : '30 天';
      } else if (h === '名单类型') {
        row[h] = i % 3 === 0 ? '灰名单' : '黑名单';
      } else if (h === '审核状态' || h === '状态') {
        row[h] = i % 5 === 0 ? '已通过' : '待审核';
        if (tab === '好评返现') row[h] = '申请';
      } else if (h === '返现金额') {
        row[h] = '--';
      } else if (h === '手机号') {
        row[h] = `17867${i}4532`;
      } else if (h === '项目id') {
        row[h] = 385 + i * 15;
      } else if (h === '订单号') {
        row[h] = `25121639180${i}`;
      } else {
        row[h] = '';
      }
    });
    return row;
  });
};

// --- 子组件 ---

const NotificationBar = () => (
  <div className="flex items-center gap-3 mb-4 px-5 py-3 bg-white border border-slate-100 rounded-lg shadow-sm shrink-0">
    <div className="flex items-center gap-2 shrink-0">
      <div className="bg-[#1890ff] text-white text-[12px] px-3 py-1.5 rounded-[4px] flex items-center gap-1 font-bold shadow-sm shadow-blue-100">
        主要公告 <Bell size={12} fill="currentColor" />
      </div>
    </div>
    <div className="flex-1 text-[13px] text-gray-600 font-normal truncate flex items-center gap-2">
      <Bell size={14} className="text-[#1890ff]" />
      <span className="text-gray-800 font-medium">关于 2025 年度秋季职级晋升评审的通知：</span>
      <span className="text-gray-500">点击下方详情以阅读完整公告内容。</span>
    </div>
    <div className="flex items-center gap-6 text-[12px] text-gray-500 font-sans hidden xl:flex">
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
           <Activity size={10} />
        </div>
        <span>系统升级通知：今晚 24:00 将进行系统维护。</span>
      </div>
      <div className="flex items-center gap-1.5">
         <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-red-500">
           <Activity size={10} />
        </div>
        <span>10月业绩pk赛圆满结束，恭喜华东大区获得冠军！</span>
      </div>
      <span className="w-px h-3 bg-gray-200 mx-2"></span>
      <span className="bg-gray-50 px-2 py-0.5 rounded text-gray-400 font-mono">2025-11-19</span>
    </div>
  </div>
);

// 新版导航栏 (卡片式)
const NavigationTabs = ({ activeTab, onSelect }: { activeTab: TabType, onSelect: (t: TabType) => void }) => {
  const tabs = [
    { name: '地域项目价格', color: '#ff4d4f', icon: ShieldAlert, bg: 'bg-red-500', border: 'border-red-500' }, // 红
    { name: '项目质保', color: '#eab308', icon: Bell, bg: 'bg-yellow-500', border: 'border-yellow-500' },      // 黄
    { name: '好评返现', color: '#3b82f6', icon: Sliders, bg: 'bg-blue-500', border: 'border-blue-500' },      // 蓝
    { name: '用户黑名单', color: '#22c55e', icon: FileText, bg: 'bg-green-500', border: 'border-green-500' },   // 绿
  ] as const;

  return (
    <div className="grid grid-cols-4 gap-4 mb-4 shrink-0 px-1 py-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <div 
            key={tab.name}
            onClick={() => onSelect(tab.name as TabType)}
            className={`h-12 flex items-center justify-center gap-3 px-4 rounded-lg cursor-pointer transition-all border ${tab.border} bg-white ${
              isActive ? 'shadow-sm scale-105 z-10' : 'hover:opacity-90'
            }`}
          >
            <div className={`w-8 h-8 rounded-full ${tab.bg} flex items-center justify-center text-white shrink-0`}>
              <tab.icon size={16} fill="currentColor" className="opacity-90"/>
            </div>
            <span className={`text-[14px] font-bold ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>{tab.name}</span>
          </div>
        );
      })}
    </div>
  );
};

// 新版数据概览 (单行长条)
const DataOverviewBar = ({ toggleFilters, showFilters }: { toggleFilters: () => void, showFilters: boolean }) => {
  const stats = [
    { label: '录单', val: '128', color: '#ff4d4f' },
    { label: '今日派单', val: '42', color: '#3b82f6' },
    { label: '今日业绩', val: '12850.0', color: '#22c55e' },
    { label: '收款率', val: '98.5%', color: '#a855f7' },
    { label: '退款', val: '450.5', color: '#f97316' }
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm px-4 py-3 mb-4 shrink-0 flex items-center justify-between gap-6">
      {/* 左侧：图标 + 数据 */}
      <div className="flex items-center flex-1 gap-6 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#1890ff] flex items-center justify-center text-white">
             <BarChart3 size={18} />
          </div>
          <span className="text-[14px] font-bold text-gray-800">数据概览</span>
        </div>
        
        <div className="w-px h-6 bg-gray-200 shrink-0 mx-2"></div>

        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {stats.map((item, idx) => (
             <div key={idx} className="flex items-baseline whitespace-nowrap gap-1">
               <span className="text-[12px] text-gray-500">{item.label}</span>
               <span className="text-[20px] font-bold font-mono" style={{ color: item.color }}>{item.val}</span>
             </div>
          ))}
        </div>
      </div>

      {/* 右侧：操作区 */}
      <div className="flex items-center gap-4 shrink-0 pl-4 border-l border-gray-100">
        <div 
          onClick={toggleFilters}
          className="flex items-center gap-1.5 cursor-pointer text-[#1890ff] hover:text-blue-700 transition-colors group"
        >
          <Search size={14} strokeWidth={2.5} className="group-hover:scale-110 transition-transform"/>
          <span className="text-[13px] font-bold">点这高级筛选</span>
        </div>
      </div>
    </div>
  );
};

const SearchPanel = ({ tab, isVisible }: { tab: TabType, isVisible: boolean }) => {
  const config = TAB_CONFIGS[tab];
  if (!isVisible) return null;

  return (
    <div className="bg-white px-6 py-5 border border-slate-100 rounded-lg shadow-sm mb-4 animate-in fade-in slide-in-from-top-1 duration-200">
      <div className="flex flex-wrap gap-y-4 gap-x-8 items-center">
        {config.search.map((field) => (
          <div key={field} className="flex items-center gap-3">
            <span className="text-[13px] text-gray-500 font-medium min-w-[4em] text-right">{field}</span>
             {field.includes('时间') ? (
               <div className="flex items-center gap-2 bg-slate-50 p-1 rounded border border-slate-200">
                 <input type="date" className="bg-transparent text-[13px] w-32 outline-none text-gray-600 font-mono"/>
                 <span className="text-gray-300">-</span>
                 <input type="date" className="bg-transparent text-[13px] w-32 outline-none text-gray-600 font-mono"/>
               </div>
             ) : (['价格类型','入表状态','审核状态','名单类型'].includes(field)) ? (
               <select className="border border-slate-200 rounded px-3 py-1.5 text-[13px] w-40 outline-none focus:border-[#1890ff] bg-slate-50 text-gray-600 font-sans hover:bg-white transition-colors">
                 <option>全部</option>
                 <option>选项1</option>
               </select>
             ) : (
               <input type="text" placeholder={`请输入${field}`} className="border border-slate-200 rounded px-3 py-1.5 text-[13px] w-52 outline-none focus:border-[#1890ff] focus:ring-2 focus:ring-blue-50 transition-all bg-slate-50 focus:bg-white" />
             )}
          </div>
        ))}
        <div className="flex gap-3 ml-auto pl-6 border-l border-slate-100">
          <button className="px-5 py-1.5 bg-[#1890ff] text-white rounded text-[13px] hover:bg-blue-600 transition-all shadow-sm shadow-blue-200 font-bold active:scale-95">查询</button>
          <button className="px-5 py-1.5 border border-slate-200 text-gray-600 rounded text-[13px] hover:bg-slate-50 transition-all bg-white font-bold active:scale-95">重置</button>
        </div>
      </div>
    </div>
  );
};

// --- 黑名单特有组件 (单行展示) ---
const BlacklistStats = () => (
  <div className="flex gap-4 mb-4 shrink-0 px-1">
    {[
      { label: '需复核数量', val: '44', color: 'text-red-500' },
      { label: '待审核数量', val: '3', color: 'text-[#1890ff]' },
      { label: '需复核灰名单', val: '0', color: 'text-orange-500' },
      { label: '总名单数量', val: '3480', color: 'text-slate-800' },
    ].map(item => (
      <div key={item.label} className="bg-white px-4 py-3 rounded-lg shadow-sm border border-slate-100 flex items-center gap-3 flex-1 min-w-[200px]">
         <span className="text-[13px] text-gray-500 font-bold">{item.label}</span>
         <span className={`text-xl font-bold font-mono tracking-tight ${item.color}`}>{item.val}</span>
      </div>
    ))}
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('地域项目价格');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const config = TAB_CONFIGS[activeTab];
  const data = useMemo(() => generateRows(activeTab), [activeTab]);

  return (
    <div className="h-screen bg-[#f0f2f5] p-5 flex flex-col overflow-hidden text-slate-800 antialiased selection:bg-blue-100">
      <NotificationBar />
      
      {/* 1. 导航板块 (卡片式) */}
      <NavigationTabs activeTab={activeTab} onSelect={(t) => { setActiveTab(t); setCurrentPage(1); }} />

      {/* 2. 数据概览板块 (单行长条) */}
      <DataOverviewBar toggleFilters={() => setShowFilters(!showFilters)} showFilters={showFilters} />

      {/* 搜索面板 */}
      <SearchPanel tab={activeTab} isVisible={showFilters} />
      
      {/* 黑名单统计数据 */}
      {activeTab === '用户黑名单' && <BlacklistStats />}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden relative z-0">
        {/* 工具栏 (移除了部分冗余操作，因为新增按钮已移至数据概览，但保留导出等特定功能及刷新) */}
        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex gap-3 items-center">
            {activeTab === '用户黑名单' && (
              <div className="flex gap-1 mr-4 border-r pr-4 border-slate-200">
                {['名单管理', '审核管理', '命中记录'].map((sub, idx) => (
                  <button key={sub} className={`px-3 py-1 text-[13px] font-bold rounded transition-colors ${idx === 0 ? 'text-[#1890ff] bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-slate-50'}`}>{sub}</button>
                ))}
              </div>
            )}
             {/* 仅显示非“新增”类按钮，或者为了兼容性保留“上传” */}
            {config.buttons.filter(b => !b.includes('新增')).map(btn => (
              <button 
                key={btn} 
                className="h-8 px-4 rounded-[4px] text-[12px] font-bold flex items-center gap-1.5 transition-all active:scale-95 bg-white border border-slate-200 text-slate-600 hover:text-[#1890ff] hover:border-[#1890ff] shadow-sm"
              >
                {btn.includes('上传') && <Upload size={14} />}
                {btn}
              </button>
            ))}
          </div>
          {/* 已移除数据更新时间 */}
        </div>

        {/* 表格 */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[1600px]">
            <thead className="sticky top-0 z-20 bg-[#fafafa]">
              <tr className="text-[12px] font-bold text-gray-700">
                <th className="px-4 py-3.5 text-center w-16 border-b border-r border-slate-100 border-b-[#cbd5e1] bg-[#fafafa]">序号</th>
                {config.headers.map(h => (
                  <th key={h} className={`px-4 py-3.5 border-b border-r border-slate-100 border-b-[#cbd5e1] bg-[#fafafa] whitespace-nowrap ${h.length > 5 ? 'min-w-[150px]' : 'min-w-[100px]'}`}>{h}</th>
                ))}
                <th className="px-4 py-3.5 w-32 text-center sticky right-0 bg-[#fafafa] border-b border-l border-slate-100 border-b-[#cbd5e1] shadow-[-4px_0_8px_rgba(0,0,0,0.01)]">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((row, idx) => (
                <tr 
                  key={idx} 
                  // 明显的分割线: border-b-[#cbd5e1]
                  // 隔行填充: even:bg-[#FFF0F0]
                  className="group transition-colors text-[12px] h-12 even:bg-[#FFF0F0] hover:bg-blue-50/50 border-b border-[#cbd5e1]"
                >
                  <td className="px-4 py-1 text-center border-r border-slate-50/50 text-gray-400 font-mono group-hover:border-slate-100/50">
                    {idx + 1}
                  </td>
                  {config.headers.map(h => {
                    const isMono = h.includes('时间') || h.includes('日期') || h.includes('ID') || h.includes('id') || h.includes('号') || h.includes('金额') || h === '标准单价' || h === '结算价' || h === '促销折扣';
                    
                    return (
                      <td key={h} className={`px-4 py-1 border-r border-slate-50/50 group-hover:border-slate-100/50 truncate max-w-[300px] text-gray-600 ${isMono ? 'font-mono' : 'font-sans'} ${h.includes('金额') || h.includes('价') ? 'text-center' : ''}`}>
                        {h === '入表状态' ? (
                          <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${row[h] ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                             <span className={row[h] ? 'text-emerald-600' : 'text-slate-400'}>{row[h] ? '已入表' : '未入表'}</span>
                          </div>
                        ) : h === '名单类型' ? (
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${row[h] === '灰名单' ? 'bg-orange-50 text-orange-500 border-orange-100' : 'bg-red-50 text-red-500 border-red-100'}`}>{row[h]}</span>
                        ) : h === '状态' || h === '审核状态' ? (
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            row[h] === '已通过' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                            row[h] === '待审核' || row[h] === '申请' || row[h] === '待派单' ? 'bg-orange-50 text-orange-500 border border-orange-100' : 
                            'bg-slate-50 text-slate-400 border border-slate-200'
                          }`}>
                            {row[h] === '申请' ? '待审核' : row[h]} 
                          </span>
                        ) : h === '审核状态' && activeTab === '好评返现' ? (
                          <span className="text-[#1890ff] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-medium">申请</span>
                        ) : h === '图片' ? (
                           <div className="flex justify-center text-slate-300 group-hover:text-[#1890ff] cursor-pointer"><ImageIcon size={16} /></div>
                        ) : h === '备注' ? (
                           <span className="text-gray-400 italic text-[11px]">{row[h] || '无'}</span>
                        ) : (
                          row[h]
                        )}
                      </td>
                    );
                  })}
                  <td className="px-4 py-1 text-center sticky right-0 bg-transparent border-l border-slate-100 shadow-[-4px_0_8px_rgba(0,0,0,0.01)] group-hover:bg-blue-50/50 transition-colors">
                    {/* 背景设为 transparent 以透出 tr 的背景色 (白色或淡红色) */}
                    <div className="flex justify-center gap-2 font-sans">
                      {/* 操作列逻辑优化 */}
                      {(activeTab === '地域项目价格' || activeTab === '项目质保') ? (
                        <>
                           <button className="text-[#1890ff] hover:text-blue-700 font-bold text-[12px]">修改</button>
                           <button className="text-[#ff4d4f] hover:text-red-700 font-bold text-[12px]">删除</button>
                        </>
                      ) : (activeTab === '好评返现' || activeTab === '用户黑名单') ? (
                        <>
                           <button className="text-[#1890ff] hover:text-blue-700 font-bold text-[12px]">审核</button>
                           <button className="text-gray-400 hover:text-gray-600 font-bold text-[12px]">详情</button>
                        </>
                      ) : (
                         // 默认兜底
                        <>
                          <button className="text-[#1890ff] hover:text-blue-700 font-bold text-[12px]">派单</button>
                           <button className="w-6 h-6 rounded-full bg-blue-50 text-[#1890ff] flex items-center justify-center hover:bg-[#1890ff] hover:text-white transition-colors"><MessageCircle size={12}/></button>
                           <button className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors"><Phone size={12}/></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 分页栏 */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-center gap-5 bg-white shrink-0">
          <span className="text-[13px] text-gray-500">共 100 条</span>
          <select className="border border-slate-200 rounded px-2 py-1 outline-none text-[13px] text-gray-600 bg-white hover:border-[#1890ff] transition-colors cursor-pointer">
            <option>20条/页</option>
            <option>50条/页</option>
            <option>100条/页</option>
          </select>
          <div className="flex items-center gap-1">
             <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-gray-400 hover:text-[#1890ff] transition-colors">
               <ChevronLeft size={16} />
             </button>
             
             <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-gray-600 text-[13px] transition-colors">1</button>
             <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-gray-600 text-[13px] transition-colors">2</button>
             <button className="w-8 h-8 flex items-center justify-center rounded text-[#1890ff] font-bold text-[13px] transition-colors">3</button>
             <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-gray-600 text-[13px] transition-colors">4</button>
             <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-gray-600 text-[13px] transition-colors">5</button>
             
             <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-gray-400 hover:text-[#1890ff] transition-colors">
               <ChevronRight size={16} />
             </button>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-gray-500">
            <span>前往</span>
            <input 
              type="number" 
              defaultValue={3} 
              className="w-12 h-7 border border-slate-200 rounded text-center outline-none focus:border-[#1890ff] text-gray-600 font-mono" 
            />
            <span>页</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) { const root = createRoot(container); root.render(<App />); }