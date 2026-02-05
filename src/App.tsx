import React, { useState, useRef, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  ComposedChart, Cell, Line
} from 'recharts';

import { 
  LayoutDashboard, TrendingDown, TrendingUp, Anchor, 
  FileText, Euro, CloudRain, PoundSterling, Factory,
  Sparkles, MessageCircle, Send, X, Loader2, Bot
} from 'lucide-react';

/**
 * بيانات السوق مترجمة (29 يناير 2026)
 */

// أسعار السوق البريطانية
const ukPriceData = [
  { category: 'أفضل أجريا (قلي)', price: 200, type: 'مرتفع', note: 'القيمة متماسكة' },
  { category: 'أفضل ماركيز (قلي)', price: 190, type: 'مرتفع', note: 'طلب معقول' },
  { category: 'بيضاء مغسولة (تعبئة)', price: 300, type: 'متوسط', note: 'حركة ضعيفة جداً' },
  { category: 'تقشير (بينجي)', price: 45, type: 'منخفض', note: 'سوق متعثرة' },
  { category: 'سعر المصنع الاسمي', price: 12, type: 'منخفض', note: 'مخزون فائض غير مرغوب' },
];

// بيانات العقود الآجلة EEX
const futuresData = [
  { contract: 'أبريل 2026 (الحالي)', price: 49.00, note: 'تخمة في السوق' },
  { contract: 'أبريل 2027 (الموسم القادم)', price: 213.00, note: 'توقعات بالتصحيح' },
];

// سوق استيراد البطاطس المقلية في اليابان
const japanFryCompetition = [
  { origin: 'أمريكا', price: 273250, volume: 257508, growth: 4.7, fill: '#3b82f6' },
  { origin: 'بلجيكا', price: 252027, volume: 34708, growth: -17.4, fill: '#ef4444' },
  { origin: 'الصين', price: 196770, volume: 50455, growth: 66.9, fill: '#f59e0b' }, 
  { origin: 'الهند', price: 198221, volume: 13681, growth: 74.9, fill: '#8b5cf6' }
];

// اتجاهات العقود 2026
const contractTrends = [
  { type: 'فونتان (بداية)', price25: 17.50, price26: 12.50, change: -28 },
  { type: 'فونتان (نهاية)', price25: 30.00, price26: 23.50, change: -22 },
  { type: 'إينوفاتور (نهاية)', price25: 32.00, price26: 28.60, change: -10 },
];

// --- GEMINI API INTEGRATION ---
const apiKey = ""; // API Key injected by environment

const callGemini = async (prompt, systemInstruction = "") => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
        }),
      }
    );

    if (!response.ok) throw new Error("API Error");
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أتمكن من معالجة الطلب.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ في الاتصال بالخدمة الذكية. يرجى المحاولة لاحقاً.";
  }
};

// Construct context from dashboard data
const getDashboardContext = () => {
  return JSON.stringify({
    market: "Global Potato Market (Arabic Dashboard)",
    date: "Feb 2026",
    prices: ukPriceData,
    futures: futuresData,
    imports: japanFryCompetition,
    contracts: contractTrends,
    alerts: [
      "Planting Emergency in UK (Cornwall/Jersey) & Spain (Andalucia) due to rain/floods.",
      "French fry factory closed a line temporarily."
    ]
  });
};

// --- COMPONENTS ---

// Custom Logo Component (Updated to match attached image)
const MZLogo = () => (
  <div className="flex items-center gap-3" dir="ltr">
    {/* SVG Recreation of the 'Rotated Lattice' Logo Icon */}
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <g transform="rotate(45 50 50)">
          {/* Vertical Lines */}
          <line x1="33" y1="10" x2="33" y2="90" stroke="#ec008c" strokeWidth="14" strokeLinecap="round" />
          <line x1="67" y1="10" x2="67" y2="90" stroke="#ec008c" strokeWidth="14" strokeLinecap="round" />
          {/* Horizontal Lines */}
          <line x1="10" y1="33" x2="90" y2="33" stroke="#ec008c" strokeWidth="14" strokeLinecap="round" />
          <line x1="10" y1="67" x2="90" y2="67" stroke="#ec008c" strokeWidth="14" strokeLinecap="round" />
        </g>
      </svg>
    </div>
    
    {/* Text Stack */}
    <div className="flex flex-col items-start justify-center leading-none">
      <span className="text-2xl font-black text-white tracking-wide uppercase font-sans" style={{ letterSpacing: '0.02em' }}>
        MZ VALLEY
      </span>
      <span className="text-2xl font-black text-[#ec008c] tracking-wide uppercase font-sans -mt-1" style={{ letterSpacing: '0.02em' }}>
        MARKETS
      </span>
    </div>
  </div>
);

const Card = ({ title, children, className = '' }) => (
  <div className={`bg-slate-800 rounded-xl border border-slate-700 p-5 shadow-lg ${className}`}>
    <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4 font-cairo">{title}</h3>
    {children}
  </div>
);

const KPICard = ({ title, value, subtext, trend, icon: Icon, alert = false }) => (
  <div className={`bg-slate-800 rounded-xl border ${alert ? 'border-red-500/50 bg-red-900/10' : 'border-slate-700'} p-5 flex items-start justify-between shadow-lg`}>
    <div>
      <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider font-cairo">{title}</p>
      <h4 className="text-2xl font-bold text-white mt-1" style={{ direction: 'ltr', textAlign: 'right' }}>{value}</h4>
      <p className={`text-sm mt-1 flex items-center gap-1 font-cairo ${trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
        {trend === 'up' ? <TrendingUp size={14} /> : trend === 'down' ? <TrendingDown size={14} /> : null}
        {subtext}
      </p>
    </div>
    <div className={`p-3 rounded-lg ${alert ? 'text-red-400 bg-red-900/20' : 'text-blue-400 bg-slate-700/50'}`}>
      <Icon size={24} />
    </div>
  </div>
);

const TabButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all font-cairo
      ${active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
        : 'text-gray-400 hover:bg-slate-700 hover:text-white'
      }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

// --- MAIN COMPONENT ---

export default function PotatoDashboardArabic() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // AI States
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'أهلاً بك في MZ Valley Markets. أنا مساعدك الذكي، يمكنك سؤالي عن أسعار البطاطس، العقود الآجلة، أو حالة المحاصيل.' }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  // Handler: Generate AI Summary
  const handleGenerateAnalysis = async () => {
    setIsAnalyzing(true);
    const context = getDashboardContext();
    const prompt = `
      بناءً على بيانات سوق البطاطس المرفقة، قم بكتابة تقرير تحليل مخاطر استراتيجي قصير (3 نقاط رئيسية) باللغة العربية.
      ركز على التناقض بين الأسعار الحالية والعقود الآجلة، وتأثير الطقس في إسبانيا وبريطانيا.
      استخدم لغة اقتصادية مهنية.
    `;
    const systemInstruction = `You are a Senior Market Analyst for MZ Valley Markets. Data Context: ${context}`;
    
    const result = await callGemini(prompt, systemInstruction);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  // Handler: Chat
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = { role: 'user', text: chatInput };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsSending(true);

    const context = getDashboardContext();
    const systemInstruction = `
      You are a friendly and professional assistant for MZ Valley Markets dashboard. 
      You speak Arabic. 
      Use the provided JSON data to answer user questions accurately.
      If the user asks about something not in the data, politely say you don't have that info.
      Keep answers concise.
      Data: ${context}
    `;

    const responseText = await callGemini(chatInput, systemInstruction);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsSending(false);
  };

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Alert Banner */}
      <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start gap-4">
        <div className="flex items-center gap-3 min-w-[200px]">
          <CloudRain className="text-red-400" size={28} />
          <h4 className="text-red-400 font-bold text-sm font-cairo">طوارئ الزراعة</h4>
        </div>
        <div className="text-xs text-gray-300 space-y-2 md:border-r border-red-500/30 md:pr-4 font-cairo">
          <p><strong className="text-white">المملكة المتحدة (كورنوال وجيرسي):</strong> 70 ملم أمطار في يناير. تأخير شديد في الزراعة. توقع انخفاض كبير في مساحة البطاطس المبكرة للقلي.</p>
          <p><strong className="text-white">إسبانيا (الأندلس) والبرتغال:</strong> إعلان "حالة كارثة". الحقول غمرتها المياه. تمت زراعة 15-20% فقط. خطر اختناق الجذور.</p>
        </div>
      </div>
      
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="أفضل أجريا (بريطانيا)" value="£200 /t" subtext="ثبات السعر الممتاز" trend="up" icon={PoundSterling} />
        <KPICard title="سعر المصنع الاسمي" value="£8-12 /t" subtext="سوق متعثرة" trend="down" icon={Factory} alert={true} />
        <KPICard title="EEX أبريل '26" value="€49.00" subtext="انخفاض مستمر" trend="flat" icon={Euro} />
        <KPICard title="الإنتاج الألماني" value="13.87M t" subtext="الأعلى منذ 25 عاماً" trend="up" icon={Anchor} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="معنويات السوق: إعادة الضبط الكبرى" className="lg:col-span-2">
          {/* Chart container forced to LTR for correct axis rendering */}
          <div className="h-72" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={futuresData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" unit="€" />
                <YAxis dataKey="contract" type="category" stroke="#f3f4f6" width={130} tick={{fontSize: 12}} />
                <RechartsTooltip cursor={{fill: '#334155', opacity: 0.2}} contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Bar dataKey="price" name="سعر التسوية (€)" radius={[0, 4, 4, 0]} barSize={40}>
                  {futuresData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#22c55e'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center font-cairo">
            تخمة حالية (أبريل '26) مقابل تصحيح متوقع (أبريل '27). السوق يسعر انخفاضاً بنسبة 10-15% في المساحة للموسم القادم.
          </p>
        </Card>

        <Card title="مراقب السوق البريطاني والأوروبي">
          <div className="space-y-4 font-cairo">
            {ukPriceData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-700/50">
                <div>
                  <div className="text-sm font-medium text-gray-200">{item.category}</div>
                  <div className="text-xs text-gray-400">{item.note}</div>
                </div>
                <div className="text-left" dir="ltr">
                  <div className="text-lg font-bold text-white">£{item.price}</div>
                  <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded text-right ${item.type === 'مرتفع' ? 'bg-green-900 text-green-300' : item.type === 'منخفض' ? 'bg-red-900 text-red-300' : 'bg-slate-600 text-slate-300'}`}>
                    قيمة {item.type}
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-4 p-2 bg-red-900/20 border border-red-500/30 rounded text-center">
              <span className="text-red-400 text-xs font-bold block mb-1">تنبيه صناعي</span>
              <span className="text-gray-300 text-xs">أغلق مصنع آخر للبطاطس المقلية خط إنتاج "مؤقتاً" هذا الأسبوع.</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderMarketDetails = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="معركة اليابان: سعر الاستيراد مقابل النمو (2025)">
          <div className="h-80" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={japanFryCompetition} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" />
                <YAxis dataKey="origin" type="category" stroke="#f3f4f6" width={80} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="price" name="السعر (ين/طن)" barSize={20}>
                    {japanFryCompetition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
                <Line dataKey="growth" name="النمو السنوي %" stroke="#ffffff" strokeWidth={2} type="monotone" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="توقعات عقود 2026 (بلجيكا)">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-right text-gray-400 font-cairo">
              <thead className="text-xs text-gray-200 uppercase bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-right">الصنف / الفترة</th>
                  <th className="px-4 py-3 text-right">سعر 2025</th>
                  <th className="px-4 py-3 text-right">سعر 2026</th>
                  <th className="px-4 py-3 text-right">التغيير</th>
                </tr>
              </thead>
              <tbody>
                {contractTrends.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-700 hover:bg-slate-700/20">
                    <td className="px-4 py-3 font-medium text-white">{row.type}</td>
                    <td className="px-4 py-3" dir="ltr">€{row.price25}</td>
                    <td className="px-4 py-3 text-yellow-400 font-bold" dir="ltr">€{row.price26}</td>
                    <td className="px-4 py-3 text-red-400" dir="ltr">{row.change}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 p-6 relative" dir="rtl">
      {/* Inject Cairo font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700&display=swap');
        .font-cairo { font-family: 'Cairo', sans-serif; }
        
        /* Custom Scrollbar for Chat */
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background-color: #475569; border-radius: 20px; }
        .scrollbar-thin::-webkit-scrollbar-track { background-color: transparent; }
      `}</style>

      <div className="max-w-7xl mx-auto space-y-8 font-cairo mb-24">
        {/* Header with Custom Logo */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700 pb-6">
          <div>
            <MZLogo />
            <p className="text-gray-400 mt-2 text-sm pr-1">لوحة معلومات السوق • الأسبوع 6، 2026 • <span className="text-blue-400">البيانات: المراجعة الأوروبية والبريطانية</span></p>
          </div>
          <div className="flex gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={LayoutDashboard} label="نظرة عامة" />
            <TabButton active={activeTab === 'details'} onClick={() => setActiveTab('details')} icon={TrendingUp} label="تحليل مفصل" />
          </div>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'details' && renderMarketDetails()}

        {/* AI Strategic Summary Section */}
        <div className="bg-gradient-to-r from-blue-900/30 to-slate-800 border border-blue-500/30 rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50"></div>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400 shrink-0 border border-blue-500/30">
              <Bot size={28} />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between mb-3">
                 <h4 className="text-white font-bold text-lg flex items-center gap-2">
                   المحلل الاستراتيجي الذكي
                   <span className="text-xs font-normal text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded-full border border-blue-500/30 flex items-center gap-1">
                     <Sparkles size={10} /> مدعوم بـ Gemini
                   </span>
                 </h4>
                 {!aiAnalysis && (
                   <button 
                    onClick={handleGenerateAnalysis}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
                   >
                     {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles size={16} />}
                     {isAnalyzing ? "جاري التحليل..." : "توليد تحليل ذكي"}
                   </button>
                 )}
              </div>
              
              {aiAnalysis ? (
                 <div className="bg-slate-900/50 rounded-lg p-4 border border-blue-500/20 text-gray-200 text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500 whitespace-pre-wrap">
                   {aiAnalysis}
                   <div className="mt-3 flex justify-end">
                      <button onClick={() => setAiAnalysis('')} className="text-xs text-blue-400 hover:text-blue-300 underline">تحديث التحليل</button>
                   </div>
                 </div>
              ) : (
                <p className="text-sm text-gray-400 leading-relaxed">
                  استخدم الذكاء الاصطناعي لتحليل بيانات السوق الحالية، استخلاص المخاطر، وتوقع اتجاهات الأسعار القادمة بناءً على أحدث المعطيات في لوحة التحكم.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Bot */}
      <div className="fixed left-6 bottom-6 z-50 flex flex-col items-start gap-4 font-cairo">
        {chatOpen && (
          <div className="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl w-80 md:w-96 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 mb-2">
            {/* Chat Header */}
            <div className="bg-slate-700 p-4 flex items-center justify-between border-b border-slate-600">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 p-1.5 rounded-lg">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">مساعد السوق</h3>
                  <p className="text-[10px] text-green-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> متصل الآن
                  </p>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-900/50 scrollbar-thin">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-slate-700 text-gray-200 rounded-bl-none border border-slate-600'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isSending && (
                <div className="flex justify-end">
                   <div className="bg-slate-700 p-3 rounded-xl rounded-bl-none border border-slate-600 flex gap-1">
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                   </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-slate-800 border-t border-slate-600">
              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="اكتب سؤالك هنا..."
                  className="w-full bg-slate-900 border border-slate-600 rounded-xl py-3 pr-4 pl-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isSending}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                >
                  <Send size={16} className={isSending ? 'opacity-0' : 'opacity-100'} />
                  {isSending && <Loader2 size={16} className="absolute top-1.5 left-1.5 animate-spin" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAB Toggle */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 ${
            chatOpen 
            ? 'bg-slate-700 text-white rotate-90' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
          }`}
        >
          {chatOpen ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>
    </div>
  );
}
