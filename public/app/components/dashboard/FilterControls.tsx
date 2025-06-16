'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { FilterParams } from '@/lib/types';
import { CalendarDays, Filter, RotateCcw } from 'lucide-react';

interface FilterControlsProps {
  onFilterChange: (filters: FilterParams) => void;
  currentFilters: FilterParams;
  loading?: boolean;
}

/**
 * Filter Controls Component
 */
export function FilterControls({
  onFilterChange,
  currentFilters,
  loading = false
}: FilterControlsProps) {
  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    currentFilters.channel || []
  );

  const availableChannels = ['Google', 'Facebook', 'Naver', 'Instagram', 'YouTube'];

  const datePresets = [
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Last 30 Days', value: 'last30days' },
    { label: 'Last 90 Days', value: 'last90days' }
  ];

  /**
   * Date preset selection handler
   */
  const handleDatePresetChange = (preset: string) => {
    const endDate = new Date();
    const startDate = new Date();

    switch (preset) {
      case 'last7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'last30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case 'last90days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        return;
    }

    onFilterChange({
      ...currentFilters,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      page: 1
    });
  };

  /**
   * Channel toggle handler
   */
  const handleChannelToggle = (channel: string) => {
    const newChannels = selectedChannels.includes(channel)
      ? selectedChannels.filter(c => c !== channel)
      : [...selectedChannels, channel];

    setSelectedChannels(newChannels);
    onFilterChange({
      ...currentFilters,
      channel: newChannels,
      page: 1
    });
  };

  /**
   * Select/deselect all channels
   */
  const handleSelectAllChannels = () => {
    const newChannels = selectedChannels.length === availableChannels.length
      ? []
      : [...availableChannels];

    setSelectedChannels(newChannels);
    onFilterChange({
      ...currentFilters,
      channel: newChannels,
      page: 1
    });
  };

  /**
   * Reset filters
   */
  const handleResetFilters = () => {
    setSelectedChannels([]);
    onFilterChange({
      startDate: undefined,
      endDate: undefined,
      channel: [],
      page: 1,
      limit: 50
    });
  };

  /**
   * Calculate active filter count
   */
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (currentFilters.startDate || currentFilters.endDate) count++;
    if (currentFilters.channel && currentFilters.channel.length > 0) count++;
    return count;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {getActiveFilterCount()} Active
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Date Range Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Period
          </label>
          <Select onValueChange={handleDatePresetChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              {datePresets.map((preset) => (
                <SelectItem key={preset.value} value={preset.value}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Current date range display */}
          {(currentFilters.startDate || currentFilters.endDate) && (
            <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
              {currentFilters.startDate && (
                <span>Start: {new Date(currentFilters.startDate).toLocaleDateString('en-US')}</span>
              )}
              {currentFilters.startDate && currentFilters.endDate && ' ~ '}
              {currentFilters.endDate && (
                <span>End: {new Date(currentFilters.endDate).toLocaleDateString('en-US')}</span>
              )}
            </div>
          )}
        </div>

        {/* Channel Filter */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Channels</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAllChannels}
              className="h-auto p-1 text-xs"
            >
              {selectedChannels.length === availableChannels.length ? 'Deselect All' : 'Select All'}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableChannels.map((channel) => (
              <Badge
                key={channel}
                variant={selectedChannels.includes(channel) ? 'default' : 'outline'}
                className="cursor-pointer transition-colors"
                onClick={() => handleChannelToggle(channel)}
              >
                {channel}
              </Badge>
            ))}
          </div>

          {selectedChannels.length > 0 && (
            <div className="text-xs text-muted-foreground">
              {selectedChannels.length} channels selected
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetFilters}
            disabled={loading}
            className="flex-1"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
