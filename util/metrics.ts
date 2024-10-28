export class Metrics {
  private static instance: Metrics;
  private metrics: Map<string, number>;

  private constructor() {
    this.metrics = new Map();
  }

  static getInstance(): Metrics {
    if (!Metrics.instance) {
      Metrics.instance = new Metrics();
    }
    return Metrics.instance;
  }

  incrementCounter(name: string): void {
    const current = this.metrics.get(name) || 0;
    this.metrics.set(name, current + 1);
  }

  recordTiming(name: string, timeMs: number): void {
    this.metrics.set(name, timeMs);
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }
}
