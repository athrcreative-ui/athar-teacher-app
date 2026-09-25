import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DailyProgressPoint, getCohortLast7DaysProgress, StudentCohort } from '../lib/progress';
import { Icon } from './Icon';

export interface ThemeProgressLineChartProps {
  themeTitle: string;
  themeLessonIds: string[];
  completedLessonIds?: string[];
  colorScheme?: 'emerald' | 'indigo' | 'amber';
  studentCohort?: StudentCohort;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; payload: DailyProgressPoint }>;
  label?: string;
  themeTitle: string;
}

function CustomTooltip({ active, payload, label, themeTitle }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;

  return (
    <div className="prep1-recharts-tooltip">
      <div className="prep1-recharts-tooltip__header">
        <span className="prep1-recharts-tooltip__day">{label}</span>
        <span className="prep1-recharts-tooltip__date">{data.date}</span>
      </div>
      <div className="prep1-recharts-tooltip__body">
        <div className="prep1-recharts-tooltip__row">
          <span className="prep1-recharts-tooltip__dot" />
          <span className="prep1-recharts-tooltip__text">الدروس المكتملة تراكمياً:</span>
          <strong className="prep1-recharts-tooltip__value">{data.cumulativeCompleted} دروس</strong>
        </div>
        {data.completedDaily > 0 && (
          <div className="prep1-recharts-tooltip__daily">
            (+{data.completedDaily} دروس أُنجزت في هذا اليوم)
          </div>
        )}
      </div>
    </div>
  );
}

export function ThemeProgressLineChart({
  themeTitle,
  themeLessonIds,
  completedLessonIds,
  colorScheme = 'emerald',
  studentCohort = 'all',
}: ThemeProgressLineChartProps) {
  const data = useMemo(() => {
    return getCohortLast7DaysProgress(themeLessonIds, studentCohort, completedLessonIds);
  }, [themeLessonIds, studentCohort, completedLessonIds]);

  const totalFinishedInTheme = useMemo(() => {
    if (!data.length) return 0;
    return data[data.length - 1].cumulativeCompleted;
  }, [data]);

  const weeklyActivityCount = useMemo(() => {
    return data.reduce((sum, p) => sum + p.completedDaily, 0);
  }, [data]);

  const strokeColor = colorScheme === 'indigo' ? '#4f46e5' : colorScheme === 'amber' ? '#d97706' : '#059669';
  const fillColor = colorScheme === 'indigo' ? '#818cf8' : colorScheme === 'amber' ? '#fbbf24' : '#34d399';

  const maxCompleted = Math.max(
    themeLessonIds.length > 0 ? themeLessonIds.length : 5,
    ...data.map((d) => d.cumulativeCompleted),
  );

  const cohortLabel =
    studentCohort === 'top'
      ? ' (الطلاب المتفوقون · Top Performers)'
      : studentCohort === 'support'
      ? ' (طلاب بحاجة لدعم · Needs Support)'
      : ' (جميع الطلاب · All Students)';

  return (
    <div
      className="prep1-line-chart-section"
      data-testid="theme-recharts-line-chart"
      aria-label={`مخطط بياني يوضح تقدم إنجاز دروس ${themeTitle} خلال آخر 7 أيام`}
    >
      <div className="prep1-line-chart-header">
        <div className="prep1-line-chart-header__title-group">
          <span className="prep1-line-chart-header__icon">
            <Icon name="trending-up" />
          </span>
          <div>
            <h4 className="prep1-line-chart-header__title">
              تقدم إنجاز الدروس خلال آخر 7 أيام
            </h4>
            <p className="prep1-line-chart-header__subtitle">
              متابعة وتيرة التعلم اليومية والتراكمية في {themeTitle}
              <span className="prep1-line-chart-header__cohort-tag">{cohortLabel}</span>
            </p>
          </div>
        </div>

        <div className="prep1-line-chart-header__stats">
          <span className="prep1-line-chart-chip">
            <span className="prep1-line-chart-chip__indicator" style={{ background: strokeColor }} />
            المكتمل حتى الآن: <strong>{totalFinishedInTheme} من {themeLessonIds.length}</strong>
          </span>
          {weeklyActivityCount > 0 && (
            <span className="prep1-line-chart-chip prep1-line-chart-chip--active">
              إنجاز هذا الأسبوع: <strong>+{weeklyActivityCount} دروس</strong>
            </span>
          )}
        </div>
      </div>

      <div className="prep1-line-chart-container" style={{ width: '100%', height: 180, direction: 'ltr' }}>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart
            data={data}
            margin={{ top: 16, right: 24, left: -16, bottom: 6 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border, #e2e8f0)"
              vertical={false}
              opacity={0.65}
            />
            <XAxis
              dataKey="dayLabel"
              tick={{ fontSize: 11, fill: 'var(--text-muted, #64748b)' }}
              axisLine={{ stroke: 'var(--border, #cbd5e1)' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, maxCompleted]}
              tick={{ fontSize: 11, fill: 'var(--text-muted, #64748b)' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip themeTitle={themeTitle} />}
              cursor={{ stroke: strokeColor, strokeWidth: 1.5, strokeDasharray: '4 4' }}
            />
            <Line
              type="monotone"
              dataKey="cumulativeCompleted"
              name="الدروس المكتملة"
              stroke={strokeColor}
              strokeWidth={3}
              dot={{
                r: 4,
                fill: '#ffffff',
                stroke: strokeColor,
                strokeWidth: 2.5,
              }}
              activeDot={{
                r: 6.5,
                fill: strokeColor,
                stroke: '#ffffff',
                strokeWidth: 2.5,
              }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="prep1-line-chart-footer">
        <span className="prep1-line-chart-footer__hint">
          <Icon name="check-circle" /> يتحدث المخطط البياني تلقائياً عند تعليم أي درس كـ «مكتمل».
        </span>
      </div>
    </div>
  );
}
