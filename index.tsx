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
  RefreshCw
} from 'lucide-react';

// --- 类型定义 ---

type TabType = '地域项目价格' | '项目质保' | '好评返现' | '用户黑名单';

// --- 配色常量 (参考截图) ---
const THEME = {
  primary: '#1890ff',     // 截图中的亮蓝色 (按钮、图标)
  success: '#52c41a',     // 绿色 (业绩)
  warning: '#faad14',     // 橙色 (待派单状态)
  error: '#ff4d4f',       // 红色 (退款)
  textMain: '#1f1f1f',    // 主文字
  textSecondary: '#8c8c8c', // 次要文字
  border: '#f0f0f0',      // 浅灰边框
  bgBody: '#f0f2f5',      // 页面背景灰
  bgWhite: '#ffffff',     // 卡片背景
  tableHeader: '#fafafa'  // 表头背景
};

// --- 配置项 (保持不变) ---

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

// --- Mock Data 生成 (保持不变) ---

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
  // 参考截图顶部样式：白色背景，圆角，蓝色标签，右侧日期
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

const DataOverview = ({ toggleFilters, showFilters, tab }: { toggleFilters: () => void, showFilters: boolean, tab: TabType }) => {
  // 参考截图的数据概览样式：图标在左，大号数字颜色各异
  // 截图映射：录单(Blue), 今日派单(Black), 今日业绩(Green), 收款率(Black), 退款(Red)
  const stats = [
    { label: '录单', val: '128', color: '#1890ff', unit: '' },      // Blue
    { label: '今日派单', val: '42', color: '#1f1f1f', unit: '' },    // Black
    { label: '今日业绩', val: '12850.0', color: '#52c41a', unit: '' }, // Green
    { label: '收款率', val: '98.5', color: '#1f1f1f', unit: '%' },   // Black
    { label: '退款', val: '450.5', color: '#ff4d4f', unit: '' }      // Red
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-100 flex items-center shadow-sm h-[72px] mb-4 shrink-0 px-6 relative overflow-hidden">
       {/* 左侧蓝色圆圈图标 */}
      <div className="flex items-center gap-3 mr-12 shrink-0 border-r border-slate-100 pr-8 h-10">
        <div className="w-9 h-9 rounded-full bg-[#1890ff] flex items-center justify-center text-white shadow-blue-200 shadow-md">
          <Activity size={18} />
        </div>
        <span className="text-[15px] font-bold text-gray-800 tracking-tight">数据概览</span>
      </div>
      
      {/* 统计数据 */}
      <div className="flex items-center flex-1 justify-between max-w-4xl">
        {stats.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center min-w-[100px]">
            <span className="text-[12px] text-gray-400 mb-1 font-medium">{item.label}</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[22px] font-bold font-mono tracking-tight" style={{ color: item.color }}>{item.val}</span>
              {item.unit && <span className="text-[13px] font-bold text-gray-400 ml-0.5">{item.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* 右侧高级筛选 */}
      <div 
        onClick={toggleFilters}
        className="ml-auto flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-[#1890ff] transition-all gap-1 group border-l border-slate-100 pl-8 h-10"
      >
        <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center text-[#1890ff] transition-colors">
          <Search size={16} />
        </div>
        <span className="text-[11px] font-medium">高级筛选</span>
      </div>
    </div>
  );
};

const TabSelector = ({ activeTab, onSelect }: { activeTab: TabType, onSelect: (t: TabType) => void }) => {
  const tabs: TabType[] = ['地域项目价格', '项目质保', '好评返现', '用户黑名单'];
  return (
    <div className="flex gap-1 mb-0 shrink-0 px-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onSelect(tab)}
            className={`px-6 py-3 text-[14px] font-bold rounded-t-lg transition-all relative top-[1px] ${
              isActive 
                ? 'bg-white text-[#1890ff] shadow-[0_-2px_5px_rgba(0,0,0,0.02)] border-t border-x border-slate-100 z-10' 
                : 'bg-transparent text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            {tab}
            {isActive && <div className="absolute top-0 left-0 w-full h-[2px] bg-[#1890ff] rounded-t-lg"></div>}
          </button>
        );
      })}
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

// --- 黑名单特有组件 (更新后: 单行展示) ---
const BlacklistStats = () => (
  // 将文字和数字用一行展示，放在用户黑名单这一行的下面
  <div className="flex gap-4 mb-4 shrink-0 px-2">
    {[
      { label: '需复核数量', val: '44', color: 'text-red-500' },
      { label: '待审核数量', val: '3', color: 'text-[#1890ff]' },
      { label: '需复核灰名单', val: '0', color: 'text-orange-500' },
      { label: '总名单数量', val: '3480', color: 'text-slate-800' },
    ].map(item => (
      <div key={item.label} className="bg-white px-4 py-3 rounded-lg shadow-sm border border-slate-100 flex items-center gap-3">
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
  const pageSize = 15;

  const config = TAB_CONFIGS[activeTab];
  const data = useMemo(() => generateRows(activeTab), [activeTab]);

  return (
    <div className="h-screen bg-[#f0f2f5] p-5 flex flex-col overflow-hidden font-sans text-slate-800 antialiased selection:bg-blue-100">
      <NotificationBar />
      
      <DataOverview showFilters={showFilters} toggleFilters={() => setShowFilters(!showFilters)} tab={activeTab} />
      <SearchPanel tab={activeTab} isVisible={showFilters} />
      
      {/* 标签栏 */}
      <TabSelector activeTab={activeTab} onSelect={(t) => { setActiveTab(t); setCurrentPage(1); }} />

      {/* 黑名单统计数据 - 放在标签栏下方 */}
      {activeTab === '用户黑名单' && <BlacklistStats />}

      <div className="bg-white rounded-b-lg rounded-tr-lg shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden relative z-0">
        {/* 工具栏 */}
        <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex gap-3 items-center">
            {activeTab === '用户黑名单' && (
              <div className="flex gap-1 mr-4 border-r pr-4 border-slate-200">
                {['名单管理', '审核管理', '命中记录'].map((sub, idx) => (
                  <button key={sub} className={`px-3 py-1 text-[13px] font-bold rounded transition-colors ${idx === 0 ? 'text-[#1890ff] bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-slate-50'}`}>{sub}</button>
                ))}
              </div>
            )}
            {config.buttons.map(btn => (
              <button 
                key={btn} 
                className={`h-8 px-4 rounded-[4px] text-[12px] font-bold flex items-center gap-1.5 transition-all active:scale-95 ${
                  btn.includes('上传') 
                    ? 'bg-white border border-slate-200 text-slate-600 hover:text-[#1890ff] hover:border-[#1890ff] shadow-sm' 
                    : 'bg-[#1890ff] text-white hover:bg-blue-600 shadow-sm shadow-blue-100'
                }`}
              >
                {btn.includes('新增') && <Plus size={14} strokeWidth={3}/>}
                {btn.includes('上传') && <Upload size={14} />}
                {btn}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[12px] text-gray-400 bg-slate-50 px-3 py-1 rounded-full font-mono">
            <span>数据更新:</span>
            <span className="text-gray-600">2025-11-19 12:30:00</span>
            <RefreshCw size={10} className="ml-1 cursor-pointer hover:rotate-180 transition-all"/>
          </div>
        </div>

        {/* 表格 */}
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[1600px]">
            <thead className="sticky top-0 z-20 bg-[#fafafa]">
              <tr className="text-[12px] font-bold text-gray-700">
                <th className="px-4 py-3.5 text-center w-16 border-b border-r border-slate-100 bg-[#fafafa]">序号</th>
                {config.headers.map(h => (
                  <th key={h} className={`px-4 py-3.5 border-b border-r border-slate-100 bg-[#fafafa] whitespace-nowrap ${h.length > 5 ? 'min-w-[150px]' : 'min-w-[100px]'}`}>{h}</th>
                ))}
                <th className="px-4 py-3.5 w-32 text-center sticky right-0 bg-[#fafafa] border-b border-l border-slate-100 shadow-[-4px_0_8px_rgba(0,0,0,0.01)]">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.map((row, idx) => (
                <tr 
                  key={idx} 
                  // 明显的分割线: border-b-[#cbd5e1]
                  className="group transition-colors text-[12px] h-12 hover:bg-[#e6f7ff] border-b border-[#cbd5e1]"
                >
                  <td className="px-4 py-1 text-center border-r border-slate-50 text-gray-400 font-mono group-hover:border-slate-100">
                    {idx + 1}
                  </td>
                  {config.headers.map(h => {
                    const isMono = h.includes('时间') || h.includes('日期') || h.includes('ID') || h.includes('id') || h.includes('号') || h.includes('金额') || h === '标准单价' || h === '结算价' || h === '促销折扣';
                    
                    return (
                      <td key={h} className={`px-4 py-1 border-r border-slate-50 group-hover:border-slate-100 truncate max-w-[300px] text-gray-600 ${isMono ? 'font-mono' : 'font-sans'} ${h.includes('金额') || h.includes('价') ? 'text-center' : ''}`}>
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
                  <td className="px-4 py-1 text-center sticky right-0 bg-white border-l border-slate-100 shadow-[-4px_0_8px_rgba(0,0,0,0.01)] group-hover:bg-[#e6f7ff] transition-colors">
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
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="text-[12px] text-gray-500">
             显示第 <span className="font-bold text-gray-800">1</span> 到 <span className="font-bold text-gray-800">15</span> 条，共 <span className="font-bold text-gray-800">128</span> 条
          </div>
          <div className="flex items-center gap-3">
             <select className="border border-slate-200 rounded px-2 py-1 outline-none text-[12px] text-gray-600 bg-white hover:border-[#1890ff] transition-colors"><option>20条/页</option></select>
             <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-gray-400 hover:border-[#1890ff] hover:text-[#1890ff] disabled:opacity-50"><ChevronLeft size={14}/></button>
                <button className="w-7 h-7 flex items-center justify-center rounded bg-[#1890ff] text-white font-bold text-[12px] shadow-sm shadow-blue-200">1</button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-gray-600 hover:border-[#1890ff] hover:text-[#1890ff] text-[12px]">2</button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-gray-600 hover:border-[#1890ff] hover:text-[#1890ff] text-[12px]">3</button>
                <span className="text-gray-300 text-[10px] px-1">•••</span>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-gray-600 hover:border-[#1890ff] hover:text-[#1890ff] text-[12px]">8</button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 bg-white text-gray-400 hover:border-[#1890ff] hover:text-[#1890ff]"><ChevronRight size={14}/></button>
             </div>
             <div className="flex items-center gap-2 text-[12px] text-gray-400 ml-2">
               前往 <input type="number" defaultValue={1} className="w-10 h-7 border border-slate-200 rounded text-center outline-none focus:border-[#1890ff] text-gray-600 font-mono" /> 页
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) { const root = createRoot(container); root.render(<App />); }