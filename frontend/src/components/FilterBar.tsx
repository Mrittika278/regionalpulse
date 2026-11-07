import React from 'react';

interface FilterOption<T extends string> {
  id: T;
  label: string;
  badge?: string | number;
}

interface FilterBarProps<T extends string> {
  options: FilterOption<T>[] | T[];
  active: T;
  onChange: (id: T) => void;
  size?: 'sm' | 'md';
}

export function FilterBar<T extends string>({
  options,
  active,
  onChange,
  size = 'md',
}: FilterBarProps<T>) {
  const sizeStyles =
    size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3.5 py-1.5 text-xs';

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-100/70 p-1">
      {options.map((opt) => {
        const id = typeof opt === 'string' ? opt : opt.id;
        const label = typeof opt === 'string' ? opt : opt.label;
        const badge = typeof opt === 'string' ? undefined : opt.badge;
        const isSelected = active === id;

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex items-center gap-1.5 rounded-lg font-bold transition-all duration-150 ${sizeStyles} ${
              isSelected
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{label}</span>
            {badge !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.2 text-[9px] font-extrabold ${
                  isSelected
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
