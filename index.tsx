import React, { useState, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  Plus, 
  FileSpreadsheet, 
  Activity, 
  Trash2, 
  Edit, 
  RefreshCw, 
  UserPlus, 
  ChevronDown, 
  ChevronUp,
  Image as ImageIcon,
  Upload
} from 'lucide-react';

// --- 类型定义 ---

type TabType = '地域项目价格' | '项目质保' | '好评返现' | '用户黑名单';

// 统一使用截图所示的蓝色系风格
// light: #F0F9FE (用户指定背景)
// text: #0ea5e9 (明亮的蓝色，接近截图)
// border: #bae6fd (浅蓝边框)
// base: #0ea5e9 (选中时的深色背景)
const COMMON_THEME = { base: '#0ea5e9', light: '#F0F9FE', border: '#bae6fd', text: '#0284c7' };

const TAB_THEMES: Record<TabType, { base: string, light: string, border: string, text: string }> = {
  '地域项目价格': COMMON_THEME,
  '项目质保': COMMON_THEME,
  '好评返现': COMMON_THEME,
  '用户黑名单': COMMON_THEME,
};

// --- 配置项 (严格对照图 1-4 还原) ---

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
  <div className="flex items-center gap-4 mb-3 px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 rounded-xl shadow-lg overflow-hidden shrink-0">
    <div className="flex items-center gap-3 shrink-0">
      <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm font-sans">
        <Bell size={10} /> 重要公告
      </div>
      <span className="text-slate-400 text-xs font-mono">2025-11-19</span>
    </div>
    <div className="flex-1 overflow-hidden relative h-6 flex items-center">
      <div className="whitespace-nowrap animate-[marquee_40s_linear_infinite] flex items-center gap-8 text-[13px] text-white font-medium font-sans">
        <span>📢 系统优化通知：业务订单后台已更新，当前导航已简化为 地域项目价格、项目质保、好评返现 及 用户黑名单 管理，请知悉。</span>
      </div>
    </div>
    <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}</style>
  </div>
);

const TabSelector = ({ activeTab, onSelect }: { activeTab: TabType, onSelect: (t: TabType) => void }) => {
  const tabs: TabType[] = ['地域项目价格', '项目质保', '好评返现', '用户黑名单'];
  return (
    <div className="grid grid-cols-4 gap-4 mb-4 font-sans">
      {tabs.map((tab) => {
        const theme = TAB_THEMES[tab];
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onSelect(tab)}
            style={{
              backgroundColor: isActive ? theme.base : theme.light,
              borderColor: isActive ? 'transparent' : theme.border,
              color: isActive ? '#fff' : theme.text
            }}
            className={`h-12 rounded-xl text-[13px] font-bold transition-all duration-200 flex items-center justify-center px-2 text-center leading-tight border shadow-sm hover:opacity-90 active:scale-95 ${
              isActive ? 'shadow-md scale-[1.01]' : ''
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};

const DataOverview = ({ toggleFilters, showFilters, tab }: { toggleFilters: () => void, showFilters: boolean, tab: TabType }) => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex items-center shadow-sm h-14 mb-3 shrink-0">
    <div className="flex items-center gap-4 px-6 flex-1">
      <div className="flex items-center gap-2 mr-10 shrink-0">
        <Activity size={20} className="text-indigo-500" />
        <span className="text-sm font-bold text-slate-800 uppercase tracking-tight font-sans">数据概览</span>
      </div>
      <div className="flex gap-16">
        {[['今日新增价格', '12', '#ef4444'], ['待审核返现', '85', '#334155'], ['黑名单总数', '1,240', '#334155'], ['系统预警', '0', '#22c55e']].map(([label, val, color]) => (
          <div key={label} className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold uppercase font-sans">{label}</span>
            <span className="text-sm font-bold font-mono" style={{ color }}>{val}</span>
          </div>
        ))}
      </div>
    </div>
    <div 
      onClick={toggleFilters}
      className="h-full px-6 bg-indigo-50 border-l border-slate-200 flex items-center gap-2 text-indigo-600 font-bold text-xs cursor-pointer hover:bg-indigo-100 transition-all select-none font-sans"
    >
      <Search size={14} />
      <span>点这高级筛选</span>
      {showFilters ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
    </div>
  </div>
);

const SearchPanel = ({ tab, isVisible }: { tab: TabType, isVisible: boolean }) => {
  const config = TAB_CONFIGS[tab];

  if (!isVisible) return null;

  const renderField = (field: string) => (
    <div key={field} className="flex items-center gap-2 min-w-[180px]">
      <span className="text-[11px] text-slate-500 shrink-0 whitespace-nowrap font-sans">{field}</span>
      {field === '录入时间' || field === '申请时间' ? (
        <div className="flex items-center gap-1">
           <select className="border border-slate-200 rounded h-7 px-1 text-[11px] outline-none bg-slate-50 font-sans"><option>{field}</option></select>
           <input type="text" placeholder="开始日期" className="w-20 border border-slate-200 rounded h-7 px-2 text-[10px] outline-none font-mono" />
           <span className="text-slate-300">至</span>
           <input type="text" placeholder="结束日期" className="w-20 border border-slate-200 rounded h-7 px-2 text-[10px] outline-none font-mono" />
        </div>
      ) : field === '价格类型' || field === '入表状态' || field === '审核状态' || field === '名单类型' ? (
        <select className="flex-1 border border-slate-200 rounded h-7 px-2 text-[11px] outline-none bg-slate-50 text-slate-600 cursor-pointer font-sans">
          <option>请选择</option>
        </select>
      ) : (
        <input type="text" placeholder="请输入内容" className="flex-1 border border-slate-200 rounded h-7 px-3 text-[11px] outline-none focus:border-indigo-400 bg-slate-50 font-sans" />
      )}
    </div>
  );

  return (
    <div className="bg-white p-4 border border-slate-200 rounded-xl shadow-sm mb-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex flex-nowrap gap-x-6 items-center min-w-max pb-1">
        <div className="flex flex-nowrap gap-x-6 items-center">
          {config.search.map(renderField)}
        </div>
        
        <div className="flex gap-2 shrink-0 border-l border-slate-100 pl-6">
          <button className="h-7 px-4 bg-[#1890ff] text-white rounded text-[11px] hover:bg-blue-600 shadow-sm transition-all active:scale-95 font-sans">搜索</button>
          <button className="h-7 px-4 bg-white border border-slate-200 text-slate-500 rounded text-[11px] hover:bg-slate-50 transition-all font-sans">重置</button>
        </div>
      </div>
    </div>
  );
};

// --- 黑名单特有组件 ---
const BlacklistStats = () => (
  <div className="grid grid-cols-4 gap-4 mb-4 shrink-0">
    {[
      { label: '需复核数量', val: '44', desc: '30天内到期需复核的名单数量', color: 'text-red-500', bar: 'bg-red-500' },
      { label: '待审核数量', val: '3', desc: '新提交等待审核的黑名单申请', color: 'text-blue-500', bar: 'bg-blue-500' },
      { label: '需复核的灰名单', val: '0', desc: '需复核的灰名单用户数量', color: 'text-orange-500', bar: 'bg-orange-500' },
      { label: '总名单数量', val: '3480', desc: '黑名单: 3476 + 灰名单: 4', color: 'text-slate-800', bar: 'bg-slate-800' },
    ].map(item => (
      <div key={item.label} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 relative overflow-hidden">
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.bar}`}></div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-slate-500 font-bold font-sans">{item.label}</span>
            <span className={`text-2xl font-black font-mono ${item.color}`}>{item.val}</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1 font-sans">{item.desc}</div>
        </div>
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
    <div className="h-screen bg-slate-50 p-4 flex flex-col overflow-hidden font-sans text-slate-600 antialiased">
      <NotificationBar />
      <TabSelector activeTab={activeTab} onSelect={(t) => { setActiveTab(t); setCurrentPage(1); }} />
      
      {activeTab === '用户黑名单' && <BlacklistStats />}
      
      <DataOverview showFilters={showFilters} toggleFilters={() => setShowFilters(!showFilters)} tab={activeTab} />
      <SearchPanel tab={activeTab} isVisible={showFilters} />

      {activeTab === '用户黑名单' && (
        <div className="flex gap-6 mb-2 px-2 shrink-0">
          {['名单管理', '审核管理', '命中记录'].map(sub => (
            <button key={sub} className={`text-[12px] pb-1 font-bold transition-all font-sans ${sub === '审核管理' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-600'}`}>
              {sub}
            </button>
          ))}
        </div>
      )}
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
        {/* 操作按钮区 (表格上方) */}
        <div className="px-4 py-3 flex gap-2 shrink-0 bg-slate-50/30">
          {config.buttons.map(btn => (
            <button 
              key={btn} 
              className={`h-7 px-3 rounded text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm text-white active:scale-95 font-sans ${
                btn === '新增市场价' || btn === '新增' ? 'bg-[#1890ff]' : btn === '上传excel' ? 'bg-emerald-500' : 'bg-blue-400'
              }`}
            >
              {btn.includes('新增') && <Plus size={14}/>}
              {btn === '上传excel' && <Upload size={14}/>}
              {btn}
            </button>
          ))}
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[1600px]">
            <thead className="sticky top-0 z-20 bg-white border-b border-slate-200">
              <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-tight font-sans">
                <th className="px-4 py-3 text-center w-16 border-r border-slate-100">序号</th>
                {config.headers.map(h => (
                  <th key={h} className={`px-4 py-3 border-r border-slate-100 ${h.length > 5 ? 'min-w-[150px]' : 'min-w-[100px]'}`}>{h}</th>
                ))}
                <th className="px-4 py-3 w-32 text-center sticky right-0 bg-white shadow-[-4px_0_10px_rgba(0,0,0,0.03)]">操作</th>
              </tr>
            </thead>
            {/* 增强表格分割线为 #cbd5e1 */}
            <tbody className="divide-y divide-[#cbd5e1]">
              {data.map((row, idx) => (
                <tr 
                  key={idx} 
                  className={`group transition-colors text-[11px] h-10 ${
                    // 隔行变色调整为用户指定的浅蓝 #F0F9FE
                    idx % 2 === 1 ? 'bg-[#F0F9FE]' : 'bg-white'
                  } hover:bg-indigo-50/40`}
                >
                  <td className="px-4 py-1 text-center border-r border-slate-100 text-slate-400 font-mono">
                    {idx + 1}
                  </td>
                  {config.headers.map(h => {
                    // 判断是否需要应用等宽字体：时间、日期、ID、单号、手机号、金额
                    const isMono = h.includes('时间') || h.includes('日期') || h.includes('ID') || h.includes('id') || h.includes('号') || h.includes('金额') || h === '标准单价' || h === '结算价' || h === '促销折扣';
                    
                    return (
                      <td key={h} className={`px-4 py-1 border-r border-slate-100 truncate max-w-[300px] text-slate-600 ${isMono ? 'font-mono' : 'font-sans'} ${h.includes('金额') || h.includes('价') ? 'text-center' : ''}`}>
                        {h === '入表状态' ? (
                          <div className={`w-8 h-4 rounded-full relative cursor-pointer transition-all ${row[h] ? 'bg-blue-500' : 'bg-slate-200'}`}>
                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${row[h] ? 'right-0.5' : 'left-0.5'}`}></div>
                          </div>
                        ) : h === '名单类型' ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] border font-sans ${row[h] === '灰名单' ? 'bg-orange-50 text-orange-500 border-orange-200' : 'bg-red-50 text-red-500 border-red-200'}`}>{row[h]}</span>
                        ) : h === '状态' ? (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-sans ${row[h] === '已通过' ? 'bg-emerald-50 text-emerald-500 border border-emerald-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>{row[h]}</span>
                        ) : h === '审核状态' && activeTab === '好评返现' ? (
                          <span className="text-blue-500 border border-blue-200 px-2 py-0.5 rounded bg-blue-50 font-sans">申请</span>
                        ) : h === '图片' ? (
                          <ImageIcon size={14} className="text-slate-300 mx-auto" />
                        ) : (
                          row[h]
                        )}
                      </td>
                    );
                  })}
                  <td className={`px-4 py-1 text-center sticky right-0 shadow-[-4px_0_10px_rgba(0,0,0,0.03)] ${
                    // 固定列背景也需要同步调整
                    idx % 2 === 1 ? 'bg-[#F0F9FE]' : 'bg-white'
                  } group-hover:bg-indigo-50/40 transition-colors`}>
                    <div className="flex justify-center gap-3 font-sans">
                      {activeTab === '好评返现' || activeTab === '用户黑名单' ? (
                        <button className="text-blue-500 hover:text-blue-700 font-bold">审核</button>
                      ) : (
                        <>
                          <button className="text-blue-500 hover:text-blue-700 font-bold">修改</button>
                          <button className="text-red-500 hover:text-red-700 font-bold">删除</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 还原底部分页组件风格 */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-center gap-4 bg-slate-50/30 text-[11px] font-sans">
          <span className="text-slate-400 font-mono">共 156 条</span>
          <select className="border border-slate-200 rounded h-6 px-1 outline-none text-[11px] font-mono"><option>20条/页</option></select>
          <div className="flex items-center gap-1">
            <button className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center bg-white"><ChevronLeft size={12}/></button>
            <button className="w-6 h-6 bg-blue-500 text-white rounded font-bold font-mono">1</button>
            <button className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center bg-white font-mono">2</button>
            <button className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center bg-white font-mono">3</button>
            <span className="text-slate-300 px-1">...</span>
            <button className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center bg-white font-mono">14</button>
            <button className="w-6 h-6 border border-slate-200 rounded flex items-center justify-center bg-white"><ChevronRight size={12}/></button>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <span>前往</span>
            <input type="number" defaultValue={1} className="w-8 h-6 border border-slate-200 rounded text-center outline-none bg-white font-mono" />
            <span>页</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) { const root = createRoot(container); root.render(<App />); }