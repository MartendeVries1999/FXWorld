'use client';

import { useState } from 'react';
import { useExchangeRates } from '@/lib/useExchangeRates';
import { MetricCard } from '@/components/MetricCard';
import { RateChart } from '@/components/RateChart';
import { RateInsight } from '@/components/RateInsight';
import { WorldMap } from '@/components/WorldMap';
import { COUNTRY_BY_CODE, BASE_CURRENCIES } from '@/lib/countries';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  const [base, setBase] = useState('EUR');
  const [selectedCountry, setSelectedCountry] = useState<string>('THA');
  const [days, setDays] = useState(30);

  const country = COUNTRY_BY_CODE.get(selectedCountry);
  const target = country?.currency ?? 'USD';
  const countryName = country ? country.name.replace(/\s*\(EUR\)/, '') : '—';

  const { data, loading, error } = useExchangeRates(base, target, days);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">
              FX World
            </span>
            <span className="text-xs text-muted-foreground/60">— Live exchange rates</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 leading-none">
                Converting from
              </div>
              <div className="text-xs text-muted-foreground mt-1">My currency</div>
            </div>
            <Select value={base} onValueChange={setBase}>
              <SelectTrigger className="w-[110px] font-mono h-9 text-base bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BASE_CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c} className="font-mono">{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
          {/* Globe column */}
          <section className="relative">
            <div className="mb-3 flex items-baseline gap-4 flex-wrap">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  Your destination
                </div>
                <h1 className="text-4xl font-semibold tracking-tight">
                  {countryName}
                  <span className="text-muted-foreground font-normal text-2xl ml-3">
                    from <span className="font-mono text-foreground">{base}</span>
                  </span>
                </h1>
              </div>
              <p className="text-xs text-muted-foreground">
                Drag to rotate · click a country to compare
              </p>
            </div>
            <div className="relative w-full h-[60vh] lg:h-[calc(100vh-250px)] lg:min-h-[700px] lg:max-h-[900px]">
              <WorldMap
                selectedCode={selectedCountry}
                onSelect={setSelectedCountry}
                baseCurrency={base}
              />
            </div>
          </section>

          {/* Data column */}
          <section className="space-y-4">
            {error && (
              <Card className="p-4 border-rose-500/50 bg-rose-500/5">
                <p className="text-sm text-rose-400">Error: {error}</p>
              </Card>
            )}

            {/* Hero rate card */}
            <Card className="p-6 bg-gradient-to-br from-card to-card/50">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Current rate
                </div>
                <div className="text-xs font-mono text-muted-foreground">
                  {base} / {target}
                </div>
              </div>
              <div className="font-mono text-5xl font-medium tracking-tight mb-2">
                {data ? data.current.toFixed(4) : '—'}
              </div>
              <div className="text-sm text-muted-foreground font-mono">
                1 {base} buys you {data ? data.current.toFixed(4) : '—'} {target}
              </div>
            </Card>

            {/* Change metrics */}
            <div className="grid grid-cols-3 gap-3">
              <MetricCard label="1D ago" value={data?.dayAgo != null ? data.dayAgo.toFixed(4) : '—'} change={data?.dayChange} />
              <MetricCard label="1W ago" value={data?.weekAgo != null ? data.weekAgo.toFixed(4) : '—'} change={data?.weekChange} />
              <MetricCard label="1M ago" value={data?.monthAgo != null ? data.monthAgo.toFixed(4) : '—'} change={data?.monthChange} />
            </div>

            {/* NEW: Insight card */}
            {data?.position90d && (
              <RateInsight position={data.position90d} base={base} target={target} />
            )}

            {/* History chart */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  History
                </div>
                <Tabs value={String(days)} onValueChange={(v) => setDays(Number(v))}>
                  <TabsList className="h-7">
                    <TabsTrigger value="7" className="text-xs px-2 h-5">1W</TabsTrigger>
                    <TabsTrigger value="30" className="text-xs px-2 h-5">1M</TabsTrigger>
                    <TabsTrigger value="90" className="text-xs px-2 h-5">3M</TabsTrigger>
                    <TabsTrigger value="365" className="text-xs px-2 h-5">1Y</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {loading && !data ? (
                <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">
                  Loading…
                </div>
              ) : data && data.history.dates.length > 0 ? (
                <div className="-mx-2">
                  <RateChart
                    dates={data.history.dates}
                    values={data.history.values}
                    base={base}
                    target={target}
                  />
                </div>
              ) : (
                <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">
                  Same currency selected
                </div>
              )}
            </Card>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Rates update once daily on weekdays. Data via Frankfurter / ECB.</span>
            <span>Not financial advice.</span>
          </div>
        </footer>
      </div>
    </main>
  );
}