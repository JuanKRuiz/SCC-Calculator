import React, { useState, useMemo } from 'react';
import { ResourceInput, ResourceType, CostResult, DEFAULT_PRICING_RATES, PricingRates } from './types';
import { InputRow } from './components/InputRow';
import { CostCharts } from './components/CostCharts';
import { fetchSCCPricing } from './services/pricingApi';
import { ShieldCheck, Plus, Calculator, Info, ExternalLink, RefreshCw, Download, Lock, AlertTriangle, Cloud, Loader2, Calendar, Sparkles, Globe, Building2, TrendingUp, ShieldAlert, Linkedin } from 'lucide-react';
import { useLanguage } from './context/LanguageContext';
import { Language } from './i18n/translations';
import { SCCCostService } from './services/SCCCostService';

const App: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [resources, setResources] = useState<ResourceInput[]>([
    { id: '1', type: ResourceType.COMPUTE_ENGINE, label: 'Prod-Web-Cluster', vCpus: 24, hoursPerMonth: 730 },
    { id: '2', type: ResourceType.GKE_AUTOPILOT, label: 'Backend-Services', vCpus: 64, hoursPerMonth: 730 },
  ]);

  const [pricingRates, setPricingRates] = useState<PricingRates>(DEFAULT_PRICING_RATES);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);

  // Threshold in USD where Enterprise might be more cost-effective
  const ENTERPRISE_THRESHOLD = 25000;

  const addResource = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setResources([
      ...resources,
      { id: newId, type: ResourceType.COMPUTE_ENGINE, label: `Workload ${resources.length + 1}`, vCpus: 8, hoursPerMonth: 730 }
    ]);
  };

  const loadDemoData = () => {
    // Generate one entry for EVERY resource type to show full capabilities
    const demoData: ResourceInput[] = [
      { id: 'd1', type: ResourceType.COMPUTE_ENGINE, label: 'Frontend Cluster (Prod)', vCpus: 100, hoursPerMonth: 730 },
      { id: 'd2', type: ResourceType.GKE_STANDARD, label: 'Legacy Apps', vCpus: 80, hoursPerMonth: 730 },
      { id: 'd3', type: ResourceType.GKE_AUTOPILOT, label: 'Microservices (Dev)', vCpus: 64, hoursPerMonth: 730 },
      { id: 'd4', type: ResourceType.CLOUD_SQL, label: 'Primary DB', vCpus: 32, hoursPerMonth: 730 },
      { id: 'd5', type: ResourceType.APP_ENGINE_FLEX, label: 'Internal Tools', vCpus: 16, hoursPerMonth: 730 },
      { id: 'd6', type: ResourceType.APP_ENGINE_STANDARD, label: 'Static Sites', instances: 10, hoursPerMonth: 730 },
      { id: 'd7', type: ResourceType.DATAFLOW, label: 'Nightly Batch Jobs', vCpus: 50, hoursPerMonth: 200 }, // Ephemeral workload
      { id: 'd8', type: ResourceType.DATAPROC, label: 'Analytics Pipeline', vCpus: 128, hoursPerMonth: 100 },
      { id: 'd9', type: ResourceType.CLOUD_STORAGE_CLASS_A, label: 'Hot Data Lake', monthlyOperations: 5000000 },
      { id: 'd10', type: ResourceType.CLOUD_STORAGE_CLASS_B, label: 'Archive/Backups', monthlyOperations: 25000000 },
      { id: 'd11', type: ResourceType.BIGQUERY_ON_DEMAND, label: 'Ad-hoc Reporting', dataProcessedGB: 5000 },
      { id: 'd12', type: ResourceType.BIGQUERY_CAPACITY, label: 'BI Dashboard Reserved', slots: 100, hoursPerMonth: 730 },
      { id: 'd13', type: ResourceType.ARTIFACT_REGISTRY, label: 'Container Registry', imagesScanned: 250 },
      { id: 'd14', type: ResourceType.MODEL_ARMOR, label: 'LLM Gateway', modelArmorOps: 10000 } // 10k * 1k-units = 10m ops
    ];
    setResources(demoData);
  };

  const handleRefreshPrices = async () => {
    setIsLoadingPrices(true);
    try {
      const freshRates = await fetchSCCPricing();
      setPricingRates(freshRates);
    } catch (error) {
      console.error("Error updating prices", error);
    } finally {
      setIsLoadingPrices(false);
    }
  };

  const updateResource = (id: string, field: keyof ResourceInput, value: number | string) => {
    setResources(resources.map(res => 
      res.id === id ? { ...res, [field]: value } : res
    ));
  };

  const removeResource = (id: string) => {
    setResources(resources.filter(res => res.id !== id));
  };

  // ---------------------------------------------------------------------------
  // COST CALCULATION ENGINE
  // ---------------------------------------------------------------------------
  const calculateCosts = useMemo((): CostResult => {
    // Delegate all calculation logic to SCCCostService (POO with Strategy Pattern)
    return SCCCostService.calculate(resources, pricingRates, t('contactSales'));
  }, [resources, pricingRates, language]);

  const totalResources = resources.length; // Simple count for summary
  const totalComputeCount = resources.reduce((acc, res) => acc + (res.vCpus || res.instances || res.slots || 0), 0);

  const downloadCSV = () => {
    const headers = ["Label", "Resource ID", "Type", "Param 1", "Param 2", t('estMonthlyCost')];
    const rows = resources.map(res => {
       const cost = calculateCosts.details.find(d => d.resourceId === res.id)?.cost || 0;
       
       let p1 = '';
       let p2 = '';
       
       if (res.vCpus) { p1 = `${res.vCpus} vCPUs`; p2 = `${res.hoursPerMonth} Hrs`; }
       else if (res.instances) { p1 = `${res.instances} Instances`; p2 = `${res.hoursPerMonth} Hrs`; }
       else if (res.monthlyOperations) { p1 = `${res.monthlyOperations} Ops`; }
       else if (res.dataProcessedGB) { p1 = `${res.dataProcessedGB} GB`; }
       else if (res.slots) { p1 = `${res.slots} Slots`; p2 = `${res.hoursPerMonth} Hrs`; }
       else if (res.imagesScanned) { p1 = `${res.imagesScanned} Images`; }
       else if (res.modelArmorOps) { p1 = `${res.modelArmorOps}k Ops`; }

       const safeLabel = res.label ? `"${res.label.replace(/"/g, '""')}"` : '""';

       return [safeLabel, res.id, res.type, p1, p2, cost.toFixed(2)].join(",");
    });
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.join("\n") 
      + `\n,,,,,${t('estMonthlyCost')} - ${t('payGo')},${calculateCosts.totalMonthly.premiumPayGo.toFixed(2)}`
      + `\n,,,,,${t('estMonthlyCost')} - ${t('orgLevel')},${calculateCosts.totalMonthly.premiumSubscription.toFixed(2)}`
      + `\n,,,,,${t('ratesEffective')},"${pricingRates.lastUpdated}"`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "scc_cost_estimation.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col text-slate-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="relative w-8 h-8 flex items-center justify-center">
               <ShieldCheck size={32} className="text-[#4285F4]" strokeWidth={2} />
             </div>
            <div>
              <h1 className="text-xl font-normal text-slate-700 tracking-tight leading-none">{t('appTitle')}</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              <button 
                onClick={() => setLanguage('es')}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${language === 'es' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                ES
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${language === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                EN
              </button>
               <button 
                onClick={() => setLanguage('pt')}
                className={`px-3 py-1 text-xs font-bold rounded transition-colors ${language === 'pt' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              >
                PT
              </button>
            </div>

            <div className="hidden sm:flex items-center bg-slate-50 border border-slate-200 rounded-full px-3 py-1 ml-2">
              <div className="flex flex-col">
                <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider leading-none mb-0.5">{t('ratesEffective')}</span>
                <span className="text-[10px] font-bold text-emerald-600 leading-none">
                   {pricingRates.lastUpdated}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-normal text-slate-700 flex items-center gap-2">
                {t('infraScope')}
              </h2>
              <div className="flex gap-2">
                <button 
                  onClick={loadDemoData}
                  className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-2 rounded shadow-sm text-sm font-medium transition-colors"
                >
                  <RefreshCw size={14} /> {t('loadDemo')}
                </button>
                <button 
                  onClick={addResource}
                  className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-indigo-50 text-indigo-600 px-4 py-2 rounded shadow-sm text-sm font-medium transition-colors"
                >
                  <Plus size={16} /> {t('addWorkload')}
                </button>
              </div>
            </div>

            <div className="bg-[#FEF7E0] border border-[#FEEFC3] rounded-lg p-4 flex gap-3 text-sm text-[#5F6368] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#FEEFC3]"></div>
              <Info className="shrink-0 mt-0.5 text-[#4285F4]" size={20} />
              <div>
                <p className="font-bold mb-1 text-slate-800">{t('pricingLogicTitle')}</p>
                <p dangerouslySetInnerHTML={{__html: t('pricingLogicDesc')}} />
              </div>
            </div>

            {resources.length === 0 ? (
               <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                 <p className="text-slate-500 mb-4">{t('noScope')}</p>
                 <div className="flex justify-center gap-4">
                    <button onClick={loadDemoData} className="text-slate-600 font-medium hover:text-indigo-600 underline">{t('loadDemoScope')}</button>
                    <span className="text-slate-300">|</span>
                    <button onClick={addResource} className="text-indigo-600 font-medium hover:underline">{t('addManually')}</button>
                 </div>
               </div>
            ) : (
              <div className="space-y-3">
                {resources.map(res => (
                  <InputRow 
                    key={res.id} 
                    resource={res} 
                    onChange={updateResource} 
                    onRemove={removeResource} 
                  />
                ))}
              </div>
            )}
            
          </div>

          {/* Right Column: Summary */}
          <div className="xl:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* Grand Total Card */}
              <div className={`rounded-lg shadow-sm border overflow-hidden ${calculateCosts.isEnterpriseRecommended ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200'}`}>
                <div className="h-1 w-full flex">
                  <div className="bg-[#4285F4] flex-1"></div>
                  <div className="bg-[#EA4335] flex-1"></div>
                  <div className="bg-[#FBBC04] flex-1"></div>
                  <div className="bg-[#34A853] flex-1"></div>
                </div>
                
                <div className="p-6">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-xs font-bold uppercase tracking-widest ${calculateCosts.isEnterpriseRecommended ? 'text-indigo-700' : 'text-slate-500'}`}>{t('estMonthlyCost')}</h3>
                      {!calculateCosts.isEnterpriseRecommended && (
                        <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide">{t('recommended')}</span>
                      )}
                   </div>
                  
                  {/* Two Column Layout for Premium PAYG vs Org */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* PAYG */}
                    <div className={`p-3 rounded-lg border ${calculateCosts.isEnterpriseRecommended ? 'border-slate-100 bg-slate-50 opacity-50' : 'border-indigo-100 bg-indigo-50/50'}`}>
                      <span className="block text-[10px] uppercase font-bold text-indigo-600 mb-1">{t('payGo')}</span>
                      <span className="block text-2xl font-bold text-slate-900 tracking-tight">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(calculateCosts.totalMonthly.premiumPayGo)}
                      </span>
                    </div>

                    {/* Org Level */}
                    <div className={`p-3 rounded-lg border ${calculateCosts.isEnterpriseRecommended ? 'border-slate-100 bg-slate-50 opacity-50' : 'border-blue-100 bg-blue-50/50'}`}>
                       <span className="block text-[10px] uppercase font-bold text-blue-600 mb-1">{t('orgLevel')}</span>
                       <span className="block text-2xl font-bold text-slate-900 tracking-tight">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(calculateCosts.totalMonthly.premiumSubscription)}
                      </span>
                       <span className="block text-[9px] text-slate-500 italic mt-0.5">{t('orgLevelDesc')}</span>
                    </div>
                  </div>

                  {/* Model Armor Line Item if present */}
                  {calculateCosts.totalMonthly.modelArmorCost > 0 && (
                     <div className="flex items-center justify-between p-2 bg-violet-50 rounded-md border border-violet-100 mb-4">
                        <div className="flex items-center gap-1.5 text-violet-700">
                           <ShieldAlert size={14} />
                           <span className="text-xs font-bold">{t('modelArmorTitle')}</span>
                        </div>
                        <span className="text-sm font-bold text-violet-800">
                          +{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(calculateCosts.totalMonthly.modelArmorCost)}
                        </span>
                     </div>
                  )}

                  {/* High Cost / Enterprise Recommendation Alert */}
                  {calculateCosts.isEnterpriseRecommended && (
                    <div className="bg-white border border-indigo-200 rounded-lg p-3 mb-6 shadow-sm animate-pulse-slow">
                       <div className="flex items-center gap-2 mb-2 text-indigo-700">
                         <Building2 size={18} />
                         <span className="font-bold text-sm">{t('recEnterpriseTitle')}</span>
                         <span className="ml-auto bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{t('bestValue')}</span>
                       </div>
                       <p className="text-xs text-indigo-900/80 leading-relaxed mb-2">
                         {t('recEnterpriseDesc')}
                       </p>
                       <p className="text-[10px] text-indigo-700 bg-indigo-50 p-2 rounded border border-indigo-100 italic" dangerouslySetInnerHTML={{__html: t('recEnterpriseReason')}}>
                       </p>
                    </div>
                  )}
                  
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                     <div className={`flex justify-between items-center text-sm group p-2 -mx-2 rounded transition-colors ${calculateCosts.isEnterpriseRecommended ? 'bg-indigo-100/50' : 'hover:bg-slate-50'}`}>
                      <span className={`transition-colors ${calculateCosts.isEnterpriseRecommended ? 'font-bold text-indigo-800' : 'text-slate-500 group-hover:text-slate-700'}`}>{t('enterpriseTier')}</span>
                      <span className={`font-medium italic ${calculateCosts.isEnterpriseRecommended ? 'text-indigo-800' : 'text-slate-900'}`}>
                        {calculateCosts.totalMonthly.enterprise}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="grid grid-cols-2 gap-4 text-center">
                       <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <span className="block text-2xl font-normal text-blue-700">{totalComputeCount > 0 ? totalComputeCount.toLocaleString() : '-'}</span>
                          <span className="text-[10px] text-blue-600/70 uppercase font-bold tracking-wider">{t('totalVcpus')}</span>
                       </div>
                       <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                          <span className="block text-2xl font-normal text-emerald-700">{totalResources}</span>
                          <span className="text-[10px] text-emerald-600/70 uppercase font-bold tracking-wider">{t('workloads')}</span>
                       </div>
                    </div>
                  </div>

                  {/* Primary Export Button */}
                  <button 
                    onClick={downloadCSV}
                    className="w-full mt-6 flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800 py-3 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg transform active:scale-[0.98]"
                  >
                    <Download size={18} /> {t('exportCsv')}
                  </button>
                </div>
              </div>

              {/* Value Proposition */}
              <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
                 <h4 className="font-bold text-slate-500 mb-4 text-xs uppercase tracking-wide">{t('valueDrivers')}</h4>
                 <ul className="space-y-3 text-sm text-slate-700">
                   <li className="flex items-start gap-3">
                     <span className="text-[#34A853] font-bold mt-0.5">✓</span> 
                     <span dangerouslySetInnerHTML={{__html: t('driver1')}} />
                   </li>
                   <li className="flex items-start gap-3">
                     <span className="text-[#34A853] font-bold mt-0.5">✓</span> 
                     <span dangerouslySetInnerHTML={{__html: t('driver2')}} />
                   </li>
                   <li className="flex items-start gap-3">
                     <span className="text-[#34A853] font-bold mt-0.5">✓</span> 
                     <span dangerouslySetInnerHTML={{__html: t('driver3')}} />
                   </li>
                 </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Charts Section */}
        <CostCharts costResult={calculateCosts} resources={resources} />

      </main>

      {/* Footer / Disclaimers */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {/* Privacy Section */}
            <div className="bg-[#eff6ff] border-l-4 border-blue-500 p-6 rounded-r-lg shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-blue-900">
                <Lock size={20} className="text-blue-500" strokeWidth={2} />
                <h5 className="font-bold text-lg text-blue-900">{t('privacyTitle')}</h5>
              </div>
              <p className="leading-relaxed text-slate-600" dangerouslySetInnerHTML={{__html: t('privacyDesc')}} />
            </div>

            {/* Disclaimer Section */}
            <div className="bg-[#fff7ed] border-l-4 border-orange-500 p-6 rounded-r-lg shadow-sm">
               <div className="flex items-center gap-2 mb-3 text-amber-900">
                <AlertTriangle size={20} className="text-orange-500" strokeWidth={2} />
                <h5 className="font-bold text-lg text-[#7c2d12]">{t('disclaimerTitle')}</h5>
              </div>
              <p className="leading-relaxed mb-3 text-[#7c2d12]">
                {t('disclaimerDesc')} <a href="https://cloud.google.com/security-command-center/pricing" target="_blank" rel="noopener noreferrer" className="font-bold underline hover:text-orange-600">Google Cloud Documentation (Source of Truth)</a>.
              </p>
            </div>
          </div>

          {/* Credits */}
          <div className="mt-12 pt-8 border-t border-slate-200 flex justify-center">
            <div className="flex items-center gap-3">
              <p className="text-slate-600 text-sm">
                {t('madeBy')} <a href="https://www.linkedin.com/in/juankruiz/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  <Linkedin size={14} className="flex-shrink-0" />
                  JuanK Ruiz
                </a> {t('withPowerOf')}
              </p>
              
              <div className="flex items-center gap-2 bg-[#f3e8ff] px-4 py-1.5 rounded-xl border border-[#e9d5ff]">
                <Sparkles size={16} className="text-[#9333ea]" fill="#9333ea" />
                <span className="font-bold text-[#9333ea] text-sm">Antigravity</span>
              </div>
              
              <span className="text-slate-400 text-sm font-medium">
                Antigravity - Google Intelligent IDE
              </span>
            </div>
          </div>
          <div className="mt-6 text-center text-[10px] text-slate-400">
             <p>© 2026 - SCC Pricing Calculator :)</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;