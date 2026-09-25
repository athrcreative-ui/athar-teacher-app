import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';

export interface D3CircularProgressChartProps {
  completed: number;
  total: number;
  percentage: number;
  title?: string;
  size?: number;
  strokeWidth?: number;
  colorScheme?: 'emerald' | 'indigo' | string;
}

export function D3CircularProgressChart({
  completed,
  total,
  percentage,
  title = 'الوحدة',
  size = 56,
  strokeWidth = 5.5,
  colorScheme = 'emerald',
}: D3CircularProgressChartProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const prevPercentageRef = useRef<number>(0);
  const isInitialMount = useRef<boolean>(true);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    setIsUpdated(true);
    const timeout = setTimeout(() => {
      setIsUpdated(false);
    }, 900);

    return () => clearTimeout(timeout);
  }, [percentage, completed]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous drawings

    const width = size;
    const height = size;
    const radius = Math.min(width, height) / 2;
    const innerRadius = radius - strokeWidth;
    const outerRadius = radius;

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Gradient definition for vibrant fill
    const defs = svg.append('defs');
    const gradientId = `d3-progress-grad-${colorScheme}-${Math.random().toString(36).slice(2, 7)}`;
    const linearGrad = defs
      .append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%');

    if (percentage === 100) {
      linearGrad.append('stop').attr('offset', '0%').attr('stop-color', '#4ade80');
      linearGrad.append('stop').attr('offset', '100%').attr('stop-color', '#22c55e');
    } else {
      linearGrad.append('stop').attr('offset', '0%').attr('stop-color', '#ffffff');
      linearGrad.append('stop').attr('offset', '100%').attr('stop-color', '#93c5fd');
    }

    // Background track arc
    const backgroundArc = d3
      .arc<void>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
      .endAngle(2 * Math.PI);

    g.append('path')
      .attr('d', backgroundArc() || '')
      .attr('fill', 'rgba(255, 255, 255, 0.22)')
      .attr('class', 'd3-circle-track');

    // Progress arc
    const startAngle = 0;
    const targetEndAngle = (Math.min(100, Math.max(0, percentage)) / 100) * 2 * Math.PI;

    const progressArc = d3
      .arc<{ endAngle: number }>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(startAngle)
      .endAngle((d) => d.endAngle)
      .cornerRadius(strokeWidth / 2);

    const fromAngle = (prevPercentageRef.current / 100) * 2 * Math.PI;
    const fromPercent = prevPercentageRef.current;
    const hasChanged = Math.abs(fromAngle - targetEndAngle) > 0.001;

    let path: d3.Selection<SVGPathElement, any, any, any> | null = null;
    if (percentage > 0 || prevPercentageRef.current > 0) {
      path = g
        .append('path')
        .datum({ endAngle: targetEndAngle })
        .attr('fill', `url(#${gradientId})`)
        .attr('class', 'd3-circle-fill')
        .attr('d', progressArc({ endAngle: targetEndAngle }) || '');
    }

    // Center percentage text
    const textNode = g
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', size >= 56 ? '12px' : '11px')
      .attr('font-weight', '800')
      .attr('fill', '#ffffff')
      .attr('class', 'd3-circle-percentage-text')
      .text(`${percentage}%`);

    // Animate progress change and text count in browser environment
    if (
      typeof window !== 'undefined' &&
      import.meta.env?.MODE !== 'test' &&
      hasChanged
    ) {
      if (path) {
        path
          .attr('d', progressArc({ endAngle: fromAngle }) || '')
          .transition()
          .duration(700)
          .ease(d3.easeCubicOut)
          .attrTween('d', () => {
            const interpolate = d3.interpolate(fromAngle, targetEndAngle);
            return (t: number) => progressArc({ endAngle: interpolate(t) }) || '';
          });
      }

      textNode
        .text(`${fromPercent}%`)
        .transition()
        .duration(700)
        .ease(d3.easeCubicOut)
        .tween('text', () => {
          const interpolate = d3.interpolateNumber(fromPercent, percentage);
          return function (t: number) {
            this.textContent = `${Math.round(interpolate(t))}%`;
          };
        });
    }

    prevPercentageRef.current = percentage;
  }, [percentage, size, strokeWidth, colorScheme]);

  return (
    <div
      className={`d3-circular-progress-wrapper d3-circular-progress-wrapper--loaded${
        isUpdated ? ' d3-circular-progress-wrapper--updated' : ''
      }${percentage === 100 ? ' d3-circular-progress-wrapper--completed' : ''}`}
      role="meter"
      aria-label={`نسبة إنجاز ${title}: ${percentage}% (${completed} من ${total} دروس مكتملة)`}
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      data-testid="d3-circular-progress"
      data-updating={isUpdated ? 'true' : 'false'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.65rem',
        background: 'rgba(255, 255, 255, 0.12)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(6px)',
        padding: '0.3rem 0.75rem 0.3rem 0.5rem',
        borderRadius: '2rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
      }}
    >
      <svg
        ref={svgRef}
        width={size}
        height={size}
        className="d3-circular-progress-svg"
        style={{ overflow: 'visible', flexShrink: 0 }}
      />
      <div
        className="d3-circular-progress-info"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          lineHeight: 1.25,
        }}
      >
        <span
          className="d3-circular-progress-info__label"
          style={{
            fontSize: '0.725rem',
            color: 'rgba(255, 255, 255, 0.85)',
            fontWeight: 600,
          }}
        >
          نسبة الإنجاز
        </span>
        <span
          className="d3-circular-progress-info__count"
          style={{
            fontSize: '0.85rem',
            color: '#ffffff',
            fontWeight: 800,
          }}
        >
          {completed} / {total} دروس
        </span>
      </div>
    </div>
  );
}
