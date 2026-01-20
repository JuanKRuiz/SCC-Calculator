import React from 'react';
import { 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { CostResult, ResourceInput } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CostChartsProps {
  costResult: CostResult;
  resources: ResourceInput[];
}

// Google Brand Colors (retained for Table/Pie)
const BRAND_COLORS = {
  BLUE: '#4285F4',
  RED: '#EA4335',
  YELLOW: '#FBBC04',
  GREEN: '#34A853',
  GREY: '#94A3B8', // Slate-400
  GREY_LIGHT: '#F1F5F9', // Slate-100
  TEXT_DARK: '#1E293B', // Slate-800
  VIOLET: '#8B5CF6' // For Model Armor
};

// Extended palette for pie chart segments - 14 distinct colors for the full resource list
const PIE_COLORS = [
  '#4285F4', // Blue
  '#34A853', // Green
  '#FBBC04', // Yellow
  '#EA4335', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#F97316', // Orange
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#A855F7', // Purple
  '#D946EF', // Fuchsia
  '#64748B', // Slate
];

interface ChartData {
  name: string;
  value: number;
}

export const CostCharts: React.FC<CostChartsProps> = ({ costResult, resources }) => {
  const { t } = useLanguage();
  
  const pieData: ChartData[] = resources.map((res, index) => {
    const detail = costResult.details.find(d => d.resourceId === res.id);
    return {
      name: `${res.type}`,
      value: detail ? detail.cost : 0,
    };
  }).filter(d => d.value > 0);

  const groupedPieData: ChartData[] = Object.values(pieData.reduce((acc, curr) => {
    if (!acc[curr.name]) {
      acc[curr.name] = { name: curr.name, value: 0 };
    }
    acc[curr.name].value += curr.value;
    return acc;
  }, {} as Record<string, ChartData>)) as ChartData[];

  // Sort by value desc for better visualization
  groupedPieData.sort((a, b) => b.value - a.value);

  // Total calculated cost (matches PAYG + Model Armor)
  const totalCost = groupedPieData.reduce((acc, curr) => acc + curr.value, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const formatCurrencyCompact = (value: number) => {
     if (value === 0) return t('free');
     return new Intl.NumberFormat('en-US', { 
       style: 'currency', 
       currency: 'USD',
       notation: "compact",
       maximumFractionDigits: 1
     }).format(value);
  };

  return (
    <div className="space-y-8 mt-8">
      
      {/* Visualizations Row */}
      <div className="w-full">
        
        {/* Pie Chart: Cost Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col min-h-[400px]">
          <div className="mb-4">
             <h3 className="text-lg font-medium text-slate-800">
              {t('premiumCostBreakdown')}
            </h3>
            <p className="text-sm text-slate-500">{t('distByResource')}</p>
          </div>
          
          {groupedPieData.length > 0 ? (
            <div className="flex flex-col md:flex-row h-full gap-8 items-center">
               {/* Chart Container */}
              <div className="w-full md:w-1/2 h-64 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={groupedPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius="60%"
                      outerRadius="90%"
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={4}
                    >
                      {groupedPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [formatCurrency(value), t('cost')]}
                      contentStyle={{borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                      itemStyle={{color: '#1E293B', fontWeight: 600}}
                    />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center Label for Total */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('total')}</span>
                  <span className="text-xl font-bold text-slate-800">{formatCurrencyCompact(totalCost)}</span>
                </div>
              </div>

              {/* Legend Container - Responsive Grid */}
              <div className="w-full md:w-1/2">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {groupedPieData
                      // Only show items in legend that are significant (> 1%)
                      .filter(entry => (entry.value / totalCost) >= 0.01)
                      .map((entry, index) => {
                      const percent = totalCost > 0 ? ((entry.value / totalCost) * 100).toFixed(1) : '0';
                      return (
                        <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                           <div className="flex items-center gap-2 overflow-hidden">
                              <div 
                                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                                style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                              />
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-slate-700 truncate group-hover:text-slate-900 transition-colors" title={entry.name}>
                                  {entry.name}
                                </p>
                              </div>
                           </div>
                           <div className="text-right ml-2 shrink-0">
                             <span className="block text-xs font-bold text-slate-600 font-mono">
                               {formatCurrencyCompact(entry.value)}
                             </span>
                             <span className="block text-[10px] text-slate-400 font-medium">{percent}%</span>
                           </div>
                        </div>
                      );
                    })}
                 </div>
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-lg bg-slate-50/50">
              <p>{t('noCostData')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Comparative Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
           <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider">{t('detailedComparison')}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">{t('tier')}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">{t('estMonthlyCost')}</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">{t('keyFeatureDelta')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Premium PAYG Row */}
              <tr className="hover:bg-indigo-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-[${BRAND_COLORS.BLUE}]`}></div>
                    <span className="font-bold text-indigo-700">{t('premiumTier')} <span className="text-xs font-normal text-slate-500">({t('payGoShort')})</span></span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-indigo-700">
                  {formatCurrency(costResult.totalMonthly.premiumPayGo)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-700">
                   <span dangerouslySetInnerHTML={{__html: t('featPremium')}} />
                </td>
              </tr>

               {/* Premium Org Level (Subscription) Row */}
              <tr className="hover:bg-blue-50/50 transition-colors bg-slate-50/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 ml-5">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                    <span className="font-semibold text-slate-600">{t('orgLevel')} <span className="text-xs font-normal italic text-slate-400">({t('orgLevelDesc')})</span></span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-600">
                  {formatCurrency(costResult.totalMonthly.premiumSubscription)}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 italic text-xs">
                   {t('requiresNegotiation')}
                </td>
              </tr>

              {/* Enterprise Row */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-[${BRAND_COLORS.GREEN}]`}></div>
                    <span className="font-semibold text-slate-700">{t('enterpriseTier')}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono text-slate-600 italic">
                  {costResult.totalMonthly.enterprise}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                   <span dangerouslySetInnerHTML={{__html: t('featEnterprise')}} />
                </td>
              </tr>

               {/* Model Armor Row - Only if cost > 0 */}
               {costResult.totalMonthly.modelArmorCost > 0 && (
                <tr className="hover:bg-violet-50/50 transition-colors border-t-2 border-slate-100">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-[${BRAND_COLORS.VIOLET}]`}></div>
                      <span className="font-bold text-violet-700">{t('modelArmorTitle')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-bold text-violet-700">
                    {formatCurrency(costResult.totalMonthly.modelArmorCost)}
                  </td>
                  <td className="px-6 py-4 text-sm text-violet-900/70">
                     {t('modelArmorAddon')} / {t('modelArmorIncluded')}
                  </td>
                </tr>
               )}

            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};