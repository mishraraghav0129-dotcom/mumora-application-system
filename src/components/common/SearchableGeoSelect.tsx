import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, ChevronDown, Check, MapPin, Globe, Loader2, AlertCircle, RefreshCw, PlusCircle } from 'lucide-react';
import { filterAndSortGeoItems } from '../../data/geoData';

export interface GeoSelectItem {
  code: string;
  name: string;
  flag?: string;
  subtext?: string;
  isCustom?: boolean;
}

export interface SearchableGeoSelectProps {
  label: string;
  required?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  items: GeoSelectItem[];
  selectedCode?: string;
  selectedName?: string;
  onSelect: (item: GeoSelectItem) => void;
  onClear?: () => void;
  disabled?: boolean;
  disabledMessage?: string;
  emptyMessage?: string;
  icon?: React.ReactNode;
  isHi?: boolean;
  isLoading?: boolean;
  loadingMessage?: string;
  error?: string | null;
  onRetry?: () => void;
  allowCustomInput?: boolean;
  helperText?: string;
}

export const SearchableGeoSelect: React.FC<SearchableGeoSelectProps> = ({
  label,
  required = false,
  placeholder = 'Select an option...',
  searchPlaceholder = 'Type to search...',
  items,
  selectedCode,
  selectedName,
  onSelect,
  onClear,
  disabled = false,
  disabledMessage,
  emptyMessage = 'No matching items found.',
  icon,
  isHi = false,
  isLoading = false,
  loadingMessage = 'Loading available options...',
  error = null,
  onRetry,
  allowCustomInput = false,
  helperText,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setHighlightedIndex(0);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filtered and prioritized list
  const filteredItems = useMemo(() => {
    return filterAndSortGeoItems(items, searchQuery);
  }, [items, searchQuery]);

  // Check if search query matches any existing item exactly
  const hasExactMatch = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return false;
    return items.some(i => i.name.toLowerCase() === q);
  }, [items, searchQuery]);

  // Selected item object
  const currentItem = useMemo(() => {
    if (selectedCode) {
      const match = items.find(i => i.code === selectedCode);
      if (match) return match;
    }
    if (selectedName) {
      const match = items.find(
        i => i.name.toLowerCase() === selectedName.toLowerCase()
      );
      if (match) return match;
      // If custom entered name
      if (allowCustomInput && selectedName.trim()) {
        return {
          code: selectedCode || 'CUSTOM',
          name: selectedName,
          isCustom: true,
        };
      }
    }
    return null;
  }, [items, selectedCode, selectedName, allowCustomInput]);

  const handleSelect = (item: GeoSelectItem) => {
    onSelect(item);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleSelectCustom = () => {
    const customVal = searchQuery.trim();
    if (!customVal) return;
    const item: GeoSelectItem = {
      code: `CUSTOM_${Date.now()}`,
      name: customVal,
      isCustom: true,
      subtext: isHi ? 'कस्टम प्रविष्टि' : 'Custom entry',
    };
    handleSelect(item);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClear) {
      onClear();
    }
    setSearchQuery('');
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ') {
        if (!disabled && !isLoading) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1 < filteredItems.length ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems.length > 0 && filteredItems[highlightedIndex]) {
        handleSelect(filteredItems[highlightedIndex]);
      } else if (allowCustomInput && searchQuery.trim()) {
        handleSelectCustom();
      }
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Label and Badge */}
      <div className="flex items-center justify-between mb-1">
        <label className="font-extrabold text-slate-700 text-xs flex items-center gap-1.5">
          {icon || <Globe className="w-3.5 h-3.5 text-purple-600" />}
          <span>{label}</span>
          {required && <span className="text-rose-500 font-black">*</span>}
        </label>
        {isLoading ? (
          <span className="text-[10px] text-purple-600 font-bold flex items-center gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>{isHi ? 'लोड हो रहा है...' : 'Loading...'}</span>
          </span>
        ) : items.length > 0 && !disabled ? (
          <span className="text-[10px] text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
            {items.length} {isHi ? 'उपलब्ध' : 'available'}
          </span>
        ) : null}
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled || isLoading}
        onClick={() => {
          if (!disabled && !isLoading) setIsOpen(!isOpen);
        }}
        onKeyDown={handleKeyDown}
        title={disabled && disabledMessage ? disabledMessage : ''}
        className={`w-full px-3.5 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all duration-200 text-xs ${
          disabled
            ? 'bg-slate-100/80 border-slate-200 text-slate-400 cursor-not-allowed'
            : isLoading
            ? 'bg-purple-50/50 border-purple-200 text-purple-700 cursor-wait'
            : error
            ? 'border-rose-300 bg-rose-50/40 text-rose-800'
            : isOpen
            ? 'border-purple-600 bg-white ring-2 ring-purple-100 shadow-sm'
            : 'border-slate-300 bg-white hover:border-purple-400 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-2">
          {isLoading ? (
            <div className="flex items-center gap-2 text-purple-700 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
              <span>{loadingMessage}</span>
            </div>
          ) : currentItem ? (
            <>
              {currentItem.flag && <span className="text-base shrink-0 leading-none">{currentItem.flag}</span>}
              <span className="font-bold text-slate-900 truncate">{currentItem.name}</span>
              {currentItem.code && currentItem.code !== 'CUSTOM' && (
                <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                  ({currentItem.code})
                </span>
              )}
              {currentItem.isCustom && (
                <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-semibold">
                  {isHi ? 'कस्टम' : 'Custom'}
                </span>
              )}
            </>
          ) : (
            <span className="text-slate-400 truncate">
              {disabled && disabledMessage ? disabledMessage : placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {currentItem && onClear && !disabled && !isLoading && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title={isHi ? 'चयन हटाएं' : 'Clear selection'}
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-purple-600' : ''
            }`}
          />
        </div>
      </button>

      {/* Error message with retry */}
      {error && !isOpen && (
        <div className="flex items-center justify-between gap-1.5 mt-1 px-1 text-[11px] text-rose-600">
          <span className="flex items-center gap-1 truncate">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{error}</span>
          </span>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1 font-bold text-purple-700 hover:underline shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{isHi ? 'पुनः प्रयास' : 'Retry'}</span>
            </button>
          )}
        </div>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p className="text-[11px] text-slate-500 mt-1 px-1">{helperText}</p>
      )}

      {/* Dropdown / Selection Panel */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-purple-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[340px] flex flex-col">
          {/* Search Header */}
          <div className="p-2.5 bg-purple-50/70 border-b border-purple-100 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-purple-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-8 py-2 bg-white border border-purple-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {searchQuery && (
              <div className="flex items-center justify-between mt-1.5 px-1 text-[11px] text-purple-700">
                <span>
                  {isHi ? 'खोज परिणाम:' : 'Matching results:'}{' '}
                  <strong className="font-extrabold">{filteredItems.length}</strong>
                </span>
                <span className="text-[10px] text-slate-500">
                  {isHi ? 'शीर्ष पर सबसे सटीक मिलान' : 'Ranked by best match'}
                </span>
              </div>
            )}
          </div>

          {/* List Items */}
          <div
            ref={listRef}
            className="overflow-y-auto divide-y divide-slate-100 flex-1 p-1 max-h-[260px] scrollbar-thin"
          >
            {/* Custom Input Option if typed value not in exact list */}
            {allowCustomInput && searchQuery.trim() && !hasExactMatch && (
              <button
                type="button"
                onClick={handleSelectCustom}
                className="w-full px-3 py-2.5 rounded-xl text-left text-xs bg-purple-50/70 hover:bg-purple-100/80 text-purple-900 transition-colors flex items-center justify-between gap-2 border border-dashed border-purple-300 mb-1"
              >
                <div className="flex items-center gap-2 truncate">
                  <PlusCircle className="w-4 h-4 text-purple-600 shrink-0" />
                  <span className="font-bold truncate">
                    {isHi ? `"${searchQuery.trim()}" को कस्टम के रूप में उपयोग करें` : `Use "${searchQuery.trim()}" as custom entry`}
                  </span>
                </div>
                <span className="text-[10px] bg-purple-200/80 text-purple-800 font-bold px-2 py-0.5 rounded-full shrink-0">
                  {isHi ? 'कस्टम' : 'Custom'}
                </span>
              </button>
            )}

            {filteredItems.length === 0 ? (
              <div className="py-8 px-4 text-center space-y-2">
                <MapPin className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">{emptyMessage}</p>
                {searchQuery ? (
                  <p className="text-[11px] text-slate-400">
                    {isHi
                      ? `"${searchQuery}" के लिए कोई पूर्वनिर्धारित विकल्प नहीं मिला।`
                      : `No preset records found matching "${searchQuery}".`}
                  </p>
                ) : null}
                {allowCustomInput && searchQuery.trim() && (
                  <button
                    type="button"
                    onClick={handleSelectCustom}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-700 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-purple-800"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{isHi ? `"${searchQuery.trim()}" जोड़ें` : `Add "${searchQuery.trim()}"`}</span>
                  </button>
                )}
              </div>
            ) : (
              filteredItems.map((item, idx) => {
                const isSelected =
                  (selectedCode && item.code === selectedCode) ||
                  (selectedName && item.name.toLowerCase() === selectedName.toLowerCase());
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={`${item.code}-${idx}`}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`w-full px-3 py-2.5 rounded-xl text-left text-xs transition-colors flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-purple-100/70 text-purple-900 font-extrabold'
                        : isHighlighted
                        ? 'bg-purple-50 text-purple-900'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {item.flag && <span className="text-base shrink-0 leading-none">{item.flag}</span>}
                      <span className="truncate">{item.name}</span>
                      {item.subtext && (
                        <span className="text-[10px] text-slate-400 font-normal truncate">
                          • {item.subtext}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.code && item.code !== 'CUSTOM' && (
                        <span className="text-[10px] text-slate-400 font-mono px-1.5 py-0.5 bg-slate-100 rounded">
                          {item.code}
                        </span>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-purple-700" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
