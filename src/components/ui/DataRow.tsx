interface DataRowProps {
  icon: string;
  label: string;
  value?: string;
}

export const DataRow = ({ icon, label, value }: DataRowProps) => (
  <div className="flex items-start gap-3 py-3 border-b border-zinc-100 last:border-0 group">
    <i className={`ph ${icon} text-xl text-zinc-800 group-hover:text-zinc-700 transition-colors mt-[-3.5px] flex-shrink-0`} />
    <div className="flex-1 min-w-0">
      <div className="text-[12px] font-medium text-zinc-900 uppercase tracking-wider mb-1">
        {label}
      </div>
      <div className="text-[14px] font-normal text-zinc-600 leading-relaxed tracking-wide">
        {value || <span className="text-zinc-300 italic">N/A</span>}
      </div>
    </div>
  </div>
);
