import React from 'react';
import { ResourceInput, ResourceType } from '../types';
import { Trash2, Cpu, Clock, Server, Box, Layers, HardDrive, HelpCircle, Activity, Settings, Database, FileText, Scan, Zap, Tag, ShieldAlert } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface InputRowProps {
  resource: ResourceInput;
  onChange: (id: string, field: keyof ResourceInput, value: number | string) => void;
  onRemove: (id: string) => void;
}

// Helper component for comma-separated number inputs
const FormattedNumberInput = ({ 
  value, 
  onChange, 
  placeholder, 
  min = 0,
  max 
}: { 
  value: number | undefined, 
  onChange: (val: number) => void, 
  placeholder?: string,
  min?: number,
  max?: number
}) => {
  const displayValue = value !== undefined && value !== null 
    ? value.toLocaleString('en-US') 
    : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove commas and non-numeric chars (except decimal point if needed, though mostly integers here)
    const rawValue = e.target.value.replace(/,/g, '');
    
    if (rawValue === '') {
      onChange(0);
      return;
    }

    const numValue = parseFloat(rawValue);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <input
      type="text"
      inputMode="numeric"
      min={min}
      max={max}
      placeholder={placeholder}
      className="w-full bg-slate-50 border border-slate-300 text-slate-900 py-2.5 px-3 rounded-md font-mono focus:ring-1 focus:ring-indigo-500 outline-none"
      value={displayValue}
      onChange={handleChange}
    />
  );
};

export const InputRow: React.FC<InputRowProps> = ({ resource, onChange, onRemove }) => {
  const { t } = useLanguage();
  
  // 1. Configuration: Visuals & Logic per Resource Type
  const getResourceConfig = (type: ResourceType) => {
    switch (type) {
      case ResourceType.COMPUTE_ENGINE:
        return { Icon: Server, iconColor: 'text-blue-600', bgColor: 'bg-blue-50', inputType: 'compute' };
      case ResourceType.GKE_AUTOPILOT:
      case ResourceType.GKE_STANDARD:
        return { Icon: Box, iconColor: 'text-emerald-600', bgColor: 'bg-emerald-50', inputType: 'compute' };
      case ResourceType.CLOUD_SQL:
        return { Icon: Database, iconColor: 'text-indigo-600', bgColor: 'bg-indigo-50', inputType: 'compute' };
      case ResourceType.APP_ENGINE_FLEX:
      case ResourceType.DATAFLOW:
      case ResourceType.DATAPROC:
        return { Icon: Activity, iconColor: 'text-cyan-600', bgColor: 'bg-cyan-50', inputType: 'compute' };
      
      case ResourceType.APP_ENGINE_STANDARD:
        return { Icon: Layers, iconColor: 'text-orange-600', bgColor: 'bg-orange-50', inputType: 'instance' };
        
      case ResourceType.CLOUD_STORAGE_CLASS_A:
      case ResourceType.CLOUD_STORAGE_CLASS_B:
        return { Icon: HardDrive, iconColor: 'text-slate-600', bgColor: 'bg-slate-100', inputType: 'storage' };
      
      case ResourceType.BIGQUERY_ON_DEMAND:
        return { Icon: FileText, iconColor: 'text-teal-600', bgColor: 'bg-teal-50', inputType: 'data' };
      case ResourceType.BIGQUERY_CAPACITY:
        return { Icon: Zap, iconColor: 'text-teal-600', bgColor: 'bg-teal-50', inputType: 'slots' };
        
      case ResourceType.ARTIFACT_REGISTRY:
        return { Icon: Scan, iconColor: 'text-pink-600', bgColor: 'bg-pink-50', inputType: 'artifacts' };

      case ResourceType.MODEL_ARMOR:
        return { Icon: ShieldAlert, iconColor: 'text-violet-600', bgColor: 'bg-violet-50', inputType: 'modelArmor' };

      default:
        return { Icon: Settings, iconColor: 'text-slate-600', bgColor: 'bg-slate-50', inputType: 'compute' };
    }
  };

  const { Icon, iconColor, bgColor, inputType } = getResourceConfig(resource.type);

  // Sort resources alphabetically for the dropdown
  const sortedResourceTypes = Object.values(ResourceType).sort((a, b) => a.localeCompare(b));

  // 2. Render Helper for Input Fields
  const renderInputs = () => {
    switch (inputType) {
      case 'compute':
        return (
          <>
            <div className="w-full md:w-3/12">
              <div className="flex items-center gap-1 mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Cpu size={14} className="text-slate-400" /> {t('unitVCpu')}
                </label>
                <Tooltip text={t('tooltipVCpu')} />
              </div>
              <FormattedNumberInput 
                value={resource.vCpus}
                onChange={(val) => onChange(resource.id, 'vCpus', val)}
                placeholder="100"
              />
            </div>
            <div className="w-full md:w-3/12">
              <div className="flex items-center gap-1 mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={14} className="text-slate-400" /> {t('unitHours')}
                </label>
                <Tooltip text={t('tooltipHours')} />
              </div>
              <FormattedNumberInput 
                value={resource.hoursPerMonth}
                onChange={(val) => onChange(resource.id, 'hoursPerMonth', val)}
                max={744}
              />
            </div>
          </>
        );

      case 'instance':
        return (
          <>
            <div className="w-full md:w-3/12">
              <div className="flex items-center gap-1 mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Layers size={14} className="text-slate-400" /> {t('unitInstances')}
                </label>
              </div>
              <FormattedNumberInput 
                value={resource.instances}
                onChange={(val) => onChange(resource.id, 'instances', val)}
                placeholder="5"
              />
            </div>
            <div className="w-full md:w-3/12">
              <div className="flex items-center gap-1 mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={14} className="text-slate-400" /> {t('unitHours')}
                </label>
              </div>
              <FormattedNumberInput 
                value={resource.hoursPerMonth}
                onChange={(val) => onChange(resource.id, 'hoursPerMonth', val)}
                max={744}
              />
            </div>
          </>
        );

      case 'storage':
        return (
          <div className="w-full md:w-6/12">
            <div className="flex items-center gap-1 mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <HardDrive size={14} className="text-slate-400" /> {t('unitOps')}
              </label>
              <Tooltip text={t('tooltipOps')} />
            </div>
            <FormattedNumberInput 
              value={resource.monthlyOperations}
              onChange={(val) => onChange(resource.id, 'monthlyOperations', val)}
              placeholder="1,000,000"
            />
          </div>
        );

      case 'data': // BigQuery On-Demand
        return (
          <div className="w-full md:w-6/12">
            <div className="flex items-center gap-1 mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <FileText size={14} className="text-slate-400" /> {t('unitGB')}
              </label>
              <Tooltip text={t('tooltipGB')} />
            </div>
            <FormattedNumberInput 
              value={resource.dataProcessedGB}
              onChange={(val) => onChange(resource.id, 'dataProcessedGB', val)}
              placeholder="1,000"
            />
          </div>
        );

      case 'slots': // BigQuery Capacity
        return (
          <>
            <div className="w-full md:w-3/12">
               <div className="flex items-center gap-1 mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Zap size={14} className="text-slate-400" /> {t('unitSlots')}
                </label>
                <Tooltip text={t('tooltipSlots')} />
              </div>
              <FormattedNumberInput 
                value={resource.slots}
                onChange={(val) => onChange(resource.id, 'slots', val)}
                placeholder="100"
              />
            </div>
             <div className="w-full md:w-3/12">
              <div className="flex items-center gap-1 mb-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Clock size={14} className="text-slate-400" /> {t('unitHours')}
                </label>
              </div>
              <FormattedNumberInput 
                value={resource.hoursPerMonth}
                onChange={(val) => onChange(resource.id, 'hoursPerMonth', val)}
                max={744}
              />
            </div>
          </>
        );

      case 'artifacts':
        return (
           <div className="w-full md:w-6/12">
            <div className="flex items-center gap-1 mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Scan size={14} className="text-slate-400" /> {t('unitImages')}
              </label>
              <Tooltip text={t('tooltipImages')} />
            </div>
            <FormattedNumberInput 
              value={resource.imagesScanned}
              onChange={(val) => onChange(resource.id, 'imagesScanned', val)}
              placeholder="50"
            />
          </div>
        );

      case 'modelArmor':
        return (
           <div className="w-full md:w-6/12">
            <div className="flex items-center gap-1 mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert size={14} className="text-slate-400" /> {t('unitGenAI')}
              </label>
              <Tooltip text={t('tooltipGenAI')} />
            </div>
            <FormattedNumberInput 
              value={resource.modelArmorOps}
              onChange={(val) => onChange(resource.id, 'modelArmorOps', val)}
              placeholder="5,000"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-slate-200 mb-3 transition-all hover:shadow-md group">
      <div className="flex flex-col md:flex-row gap-6 items-end md:items-center justify-between">
        
        {/* Resource Type & Label Group */}
        <div className="w-full md:w-5/12 space-y-4">
          
          {/* Resource Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">{t('envResource')}</label>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${bgColor} ${iconColor}`}>
                <Icon size={20} />
              </div>
              <div className="relative flex-grow">
                <select
                  className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-900 py-2.5 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow font-medium"
                  value={resource.type}
                  onChange={(e) => onChange(resource.id, 'type', e.target.value)}
                >
                  {sortedResourceTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Label Input */}
          <div>
            <div className="flex items-center gap-1 mb-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('labelTag')}</label>
            </div>
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-slate-300" />
              <input
                type="text"
                placeholder={t('labelPlaceholder')}
                className="w-full bg-white border-b border-slate-200 text-sm text-slate-600 py-1 px-1 focus:border-indigo-500 outline-none transition-colors"
                value={resource.label || ''}
                onChange={(e) => onChange(resource.id, 'label', e.target.value)}
              />
            </div>
          </div>

        </div>

        {/* Dynamic Inputs based on type */}
        {renderInputs()}

        {/* Delete Action */}
        <div className="w-full md:w-auto flex justify-end md:pb-2">
           <button 
             onClick={() => onRemove(resource.id)}
             className="p-2 text-slate-400 hover:text-[#EA4335] hover:bg-red-50 rounded-full transition-colors"
             aria-label={t('remove')}
             title={t('remove')}
           >
             <Trash2 size={18} />
           </button>
        </div>
      </div>
    </div>
  );
};

// Mini internal component for Tooltips
const Tooltip: React.FC<{text: string}> = ({text}) => (
  <div className="group relative">
    <HelpCircle size={14} className="text-slate-400 hover:text-indigo-600 cursor-help transition-colors" />
    <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] p-2 rounded shadow-lg z-20 text-center leading-snug">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
    </div>
  </div>
);