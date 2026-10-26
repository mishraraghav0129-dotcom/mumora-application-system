import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import {
  WhoCurvePoint,
  WHO_WEIGHT_BOYS,
  WHO_WEIGHT_GIRLS,
  WHO_LENGTH_BOYS,
  WHO_LENGTH_GIRLS,
} from '../data/whoGrowthData';
import { BabyGrowthLog, Language } from '../types';
import { Scale, Ruler, Info, Calendar, Download } from 'lucide-react';

interface WhoGrowthChartD3Props {
  gender: 'boy' | 'girl';
  growthLogs: BabyGrowthLog[];
  babyName: string;
  birthDate: string;
  language: Language;
}

export const WhoGrowthChartD3: React.FC<WhoGrowthChartD3Props> = ({
  gender,
  growthLogs,
  babyName,
  language,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [metric, setMetric] = useState<'weight' | 'length'>('weight');
  const [maxMonthRange, setMaxMonthRange] = useState<number>(24);
  const [tooltipData, setTooltipData] = useState<{
    x: number;
    y: number;
    month: number;
    actualVal: number;
    medianVal: number;
    sd2negVal: number;
    sd2posVal: number;
    date?: string;
  } | null>(null);

  // Select the appropriate WHO curve data
  const whoData: WhoCurvePoint[] = (
    metric === 'weight'
      ? gender === 'boy'
        ? WHO_WEIGHT_BOYS
        : WHO_WEIGHT_GIRLS
      : gender === 'boy'
      ? WHO_LENGTH_BOYS
      : WHO_LENGTH_GIRLS
  ).filter(d => d.month <= maxMonthRange);

  // Extract baby measurements for this metric
  const babyData = growthLogs
    .map(log => ({
      month: log.ageInMonths,
      value: metric === 'weight' ? log.weightKg : log.lengthCm,
      date: log.date,
      notes: log.notes,
    }))
    .filter(d => d.value > 0 && d.month <= maxMonthRange)
    .sort((a, b) => a.month - b.month);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 640;
    const width = Math.max(340, containerWidth);
    const height = 360;

    const margin = { top: 24, right: 36, bottom: 44, left: 52 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale: Age in months (0 to maxMonthRange)
    const xScale = d3
      .scaleLinear()
      .domain([0, maxMonthRange])
      .range([0, innerWidth]);

    // Y Scale: Range based on metric
    const maxVal = metric === 'weight' ? 16 : 100;
    const minVal = metric === 'weight' ? 1.5 : 40;

    const yScale = d3
      .scaleLinear()
      .domain([minVal, maxVal])
      .nice()
      .range([innerHeight, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid grid-y')
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#f1f5f9')
      .attr('stroke-dasharray', '2,2');

    g.append('g')
      .attr('class', 'grid grid-x')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(
        d3
          .axisBottom(xScale)
          .tickSize(-innerHeight)
          .tickFormat(() => '')
      )
      .selectAll('line')
      .attr('stroke', '#f1f5f9')
      .attr('stroke-dasharray', '2,2');

    // Gradient for WHO normal corridor
    const defs = svg.append('defs');
    const areaGradient = defs
      .append('linearGradient')
      .attr('id', 'whoCorridorGradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    areaGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#fb7185')
      .attr('stop-opacity', 0.18);

    areaGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#fda4af')
      .attr('stop-opacity', 0.05);

    // Shaded Area between -2SD and +2SD (WHO 3rd to 97th percentile safe zone)
    const areaGenerator = d3
      .area<WhoCurvePoint>()
      .x(d => xScale(d.month))
      .y0(d => yScale(d.sd2neg))
      .y1(d => yScale(d.sd2pos))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(whoData)
      .attr('fill', 'url(#whoCorridorGradient)')
      .attr('d', areaGenerator);

    // +2SD Curve (97th percentile boundary)
    const lineSd2pos = d3
      .line<WhoCurvePoint>()
      .x(d => xScale(d.month))
      .y(d => yScale(d.sd2pos))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(whoData)
      .attr('fill', 'none')
      .attr('stroke', '#fda4af')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3')
      .attr('d', lineSd2pos);

    // -2SD Curve (3rd percentile boundary)
    const lineSd2neg = d3
      .line<WhoCurvePoint>()
      .x(d => xScale(d.month))
      .y(d => yScale(d.sd2neg))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(whoData)
      .attr('fill', 'none')
      .attr('stroke', '#fda4af')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,3')
      .attr('d', lineSd2neg);

    // Median (50th percentile) Curve
    const lineMedian = d3
      .line<WhoCurvePoint>()
      .x(d => xScale(d.month))
      .y(d => yScale(d.median))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(whoData)
      .attr('fill', 'none')
      .attr('stroke', '#e11d48')
      .attr('stroke-width', 2)
      .attr('d', lineMedian);

    // End-point labels for curves
    const lastWho = whoData[whoData.length - 1];
    if (lastWho) {
      g.append('text')
        .attr('x', xScale(lastWho.month) + 5)
        .attr('y', yScale(lastWho.sd2pos))
        .attr('font-size', '9px')
        .attr('font-weight', '600')
        .attr('fill', '#f43f5e')
        .attr('alignment-baseline', 'middle')
        .text('97th');

      g.append('text')
        .attr('x', xScale(lastWho.month) + 5)
        .attr('y', yScale(lastWho.median))
        .attr('font-size', '10px')
        .attr('font-weight', '700')
        .attr('fill', '#be123c')
        .attr('alignment-baseline', 'middle')
        .text('50th (Median)');

      g.append('text')
        .attr('x', xScale(lastWho.month) + 5)
        .attr('y', yScale(lastWho.sd2neg))
        .attr('font-size', '9px')
        .attr('font-weight', '600')
        .attr('fill', '#f43f5e')
        .attr('alignment-baseline', 'middle')
        .text('3rd');
    }

    // Baby's Actual Measurement Line & Points
    if (babyData.length > 0) {
      const babyLine = d3
        .line<{ month: number; value: number }>()
        .x(d => xScale(d.month))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

      // Solid bold curve for baby's measurements
      g.append('path')
        .datum(babyData)
        .attr('fill', 'none')
        .attr('stroke', '#0f172a')
        .attr('stroke-width', 3)
        .attr('d', babyLine);

      // Measurement point circles with hover interactions
      const points = g
        .selectAll('.baby-point')
        .data(babyData)
        .enter()
        .append('g')
        .attr('class', 'baby-point');

      // Outer glow pulse
      points
        .append('circle')
        .attr('cx', d => xScale(d.month))
        .attr('cy', d => yScale(d.value))
        .attr('r', 7)
        .attr('fill', '#e11d48')
        .attr('fill-opacity', 0.25);

      // Inner solid point
      points
        .append('circle')
        .attr('cx', d => xScale(d.month))
        .attr('cy', d => yScale(d.value))
        .attr('r', 4.5)
        .attr('fill', '#0f172a')
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseenter', function (event, d) {
          d3.select(this).transition().duration(150).attr('r', 6);
          // Find closest WHO reference point
          const matchWho = whoData.find(w => w.month === d.month) || whoData[0];
          const rect = containerRef.current?.getBoundingClientRect();
          const mouseX = event.clientX - (rect?.left || 0);
          const mouseY = event.clientY - (rect?.top || 0);

          setTooltipData({
            x: mouseX,
            y: mouseY,
            month: d.month,
            actualVal: d.value,
            medianVal: matchWho.median,
            sd2negVal: matchWho.sd2neg,
            sd2posVal: matchWho.sd2pos,
            date: d.date,
          });
        })
        .on('mouseleave', function () {
          d3.select(this).transition().duration(150).attr('r', 4.5);
          setTooltipData(null);
        });
    }

    // Axes styling
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(maxMonthRange <= 12 ? 12 : 8)
      .tickFormat(d => `${d}m`);

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(metric === 'weight' ? 7 : 8)
      .tickFormat(d => `${d}${metric === 'weight' ? 'kg' : 'cm'}`);

    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis)
      .call(gAxis => gAxis.select('.domain').attr('stroke', '#cbd5e1'))
      .selectAll('text')
      .attr('font-size', '11px')
      .attr('fill', '#64748b')
      .attr('font-family', 'inherit');

    g.append('g')
      .call(yAxis)
      .call(gAxis => gAxis.select('.domain').attr('stroke', '#cbd5e1'))
      .selectAll('text')
      .attr('font-size', '11px')
      .attr('fill', '#64748b')
      .attr('font-family', 'inherit');

    // Axis Title Labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 36)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', '#475569')
      .text(language === 'hi' ? 'शिशु की आयु (महीनों में)' : 'Age (Months)');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -38)
      .attr('text-anchor', 'middle')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', '#475569')
      .text(
        metric === 'weight'
          ? language === 'hi'
            ? 'शारीरिक वजन (किग्रा)'
            : 'Weight (kg)'
          : language === 'hi'
          ? 'शारीरिक लंबाई (सेमी)'
          : 'Length (cm)'
      );
  }, [gender, metric, maxMonthRange, growthLogs, language]);

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
              {language === 'hi' ? 'WHO विकास चार्ट' : 'WHO Growth Percentile Curves'}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-xs text-slate-500 font-semibold">
              {gender === 'boy' ? (language === 'hi' ? 'बालक (Boys 0-24m)' : 'Boys (0-24 Months)') : (language === 'hi' ? 'बालिका (Girls 0-24m)' : 'Girls (0-24 Months)')}
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {babyName} — {metric === 'weight' ? (language === 'hi' ? 'वजन वक्र (Weight-for-age)' : 'Weight-for-Age Trajectory') : (language === 'hi' ? 'लंबाई वक्र (Length-for-age)' : 'Length-for-Age Trajectory')}
          </h2>
        </div>

        {/* Metric Selector & Range Switcher */}
        <div className="flex items-center gap-2">
          {/* Weight / Length Toggle */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setMetric('weight')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                metric === 'weight'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'वजन (kg)' : 'Weight'}</span>
            </button>
            <button
              onClick={() => setMetric('length')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                metric === 'length'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'लंबाई (cm)' : 'Length'}</span>
            </button>
          </div>

          {/* 12m vs 24m Horizon */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setMaxMonthRange(12)}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                maxMonthRange === 12 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              1 Year
            </button>
            <button
              onClick={() => setMaxMonthRange(24)}
              className={`px-2.5 py-1.5 rounded-lg transition-colors ${
                maxMonthRange === 24 ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              2 Years
            </button>
          </div>
        </div>
      </div>

      {/* Legend Ribbon */}
      <div className="flex flex-wrap items-center gap-4 text-xs pt-1 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-900 border-2 border-white ring-1 ring-slate-900" />
          <span className="font-semibold text-slate-900">{babyName}&apos;s Measurements</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 bg-rose-600" />
          <span className="text-slate-600">WHO 50th Percentile (Median)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-2.5 bg-rose-200/60 rounded" />
          <span className="text-slate-500">Normal Range (3rd – 97th Percentile)</span>
        </div>
      </div>

      {/* D3 Canvas Container */}
      <div ref={containerRef} className="relative w-full overflow-hidden">
        <svg ref={svgRef} className="w-full h-auto" />

        {/* Dynamic Hover Tooltip */}
        {tooltipData && (
          <div
            className="absolute z-30 pointer-events-none p-3 bg-slate-900/95 text-white rounded-xl shadow-xl text-xs font-sans space-y-1 transform -translate-x-1/2 -translate-y-full mb-2"
            style={{ left: `${tooltipData.x}px`, top: `${tooltipData.y}px` }}
          >
            <div className="flex items-center justify-between gap-4 font-bold border-b border-slate-700 pb-1">
              <span>{tooltipData.month} Months Old</span>
              {tooltipData.date && <span className="font-normal text-slate-400 font-mono">{tooltipData.date}</span>}
            </div>
            <div className="flex items-center justify-between gap-3 font-mono tabular-nums">
              <span className="text-slate-300">{babyName}:</span>
              <span className="font-bold text-rose-300">
                {tooltipData.actualVal} {metric === 'weight' ? 'kg' : 'cm'}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px] text-slate-400 font-mono tabular-nums">
              <span>WHO Median:</span>
              <span>{tooltipData.medianVal} {metric === 'weight' ? 'kg' : 'cm'}</span>
            </div>
            <div className="text-[10px] text-emerald-400 pt-0.5">
              Normal: {tooltipData.sd2negVal} - {tooltipData.sd2posVal} {metric === 'weight' ? 'kg' : 'cm'}
            </div>
          </div>
        )}
      </div>

      {/* Clinical Guidance Footnote */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {language === 'hi'
            ? 'क्लिनिकल दिशानिर्देश: बच्चों के विकास में आनुवंशिकी और पोषण का बड़ा प्रभाव होता है। किसी एक माप के आधार पर बच्चे को कम या अधिक वजन का घोषित न करें; विकास का निरंतर ऊपर की ओर रुझान (Upward Trajectory) सबसे महत्वपूर्ण है।'
            : 'Clinical note: Genetics, gestational age at birth, and feeding mode (exclusive breastfeeding vs formula) influence normal trajectory. A healthy growth curve parallels the WHO percentiles over successive pediatric visits.'}
        </p>
      </div>
    </div>
  );
};
