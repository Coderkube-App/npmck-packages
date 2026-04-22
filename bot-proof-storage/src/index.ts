import CryptoJS from 'crypto-js';

export interface BotProofConfig {
  secretKey: string;
  storageType?: 'local' | 'session';
  autoWipeOnBot?: boolean;
  sensitivity?: number; // 0.1 to 1.0
  onBotDetected?: () => void;
}

class BehaviorEngine {
  private mouseMovements: { x: number; y: number; time: number }[] = [];
  private lastInteractionTime: number = 0;
  private isBotDetected: boolean = false;
  private sensitivity: number;
  private onBotDetected?: () => void;

  constructor(sensitivity: number = 0.5, onBotDetected?: () => void) {
    this.sensitivity = sensitivity;
    this.onBotDetected = onBotDetected;
    this.initListeners();
  }

  private initListeners() {
    if (typeof window === 'undefined') return;

    window.addEventListener('mousemove', (e) => this.trackMouseMove(e));
    window.addEventListener('keydown', () => this.trackKeyboard());
    window.addEventListener('mousedown', () => this.trackClick());
  }

  private trackMouseMove(e: MouseEvent) {
    const now = Date.now();
    this.mouseMovements.push({ x: e.clientX, y: e.clientY, time: now });

    if (this.mouseMovements.length > 20) {
      this.mouseMovements.shift();
      this.analyzeMovements();
    }
  }

  private trackKeyboard() {
    this.checkSpeed();
  }

  private trackClick() {
    this.checkSpeed();
  }

  private checkSpeed() {
    const now = Date.now();
    if (this.lastInteractionTime > 0) {
      const diff = now - this.lastInteractionTime;
      // If actions happen faster than 20ms consistently, it's likely a bot
      if (diff < 20 * (1 / this.sensitivity)) {
        this.triggerBotDetected();
      }
    }
    this.lastInteractionTime = now;
  }

  private analyzeMovements() {
    if (this.mouseMovements.length < 5) return;

    // Check for perfectly straight lines (Bot signature)
    let linearCount = 0;
    for (let i = 2; i < this.mouseMovements.length; i++) {
      const p1 = this.mouseMovements[i - 2];
      const p2 = this.mouseMovements[i - 1];
      const p3 = this.mouseMovements[i];

      // Slope comparison
      const area = Math.abs(p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
      if (area < 0.1) linearCount++;
    }

    // If more than 80% of movements are perfectly linear, it's likely a bot
    if (linearCount > this.mouseMovements.length * 0.8) {
      this.triggerBotDetected();
    }
  }

  private triggerBotDetected() {
    if (this.isBotDetected) return;
    this.isBotDetected = true;
    console.warn('⚠️ Bot Behavior Detected! Securing storage...');
    if (this.onBotDetected) this.onBotDetected();
  }

  public checkBotStatus(): boolean {
    return this.isBotDetected;
  }
}

export class BotProofStorage {
  private storage: Storage | null = null;
  private secretKey: string;
  private behaviorEngine: BehaviorEngine;
  private autoWipe: boolean;

  constructor(config: BotProofConfig) {
    this.secretKey = config.secretKey;
    this.autoWipe = config.autoWipeOnBot ?? true;

    if (typeof window !== 'undefined') {
      this.storage = config.storageType === 'session' ? window.sessionStorage : window.localStorage;
    }

    this.behaviorEngine = new BehaviorEngine(
      config.sensitivity,
      () => {
        if (this.autoWipe) {
          this.clear();
        }
        if (config.onBotDetected) config.onBotDetected();
      }
    );
  }

  private encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  private decrypt(ciphertext: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch {
      return '';
    }
  }

  setItem(key: string, value: any): void {
    if (!this.storage) return;
    if (this.behaviorEngine.checkBotStatus()) {
        console.error('Action blocked: Bot detected.');
        return;
    }

    const stringValue = JSON.stringify(value);
    const encrypted = this.encrypt(stringValue);
    this.storage.setItem(key, encrypted);
  }

  getItem<T>(key: string): T | null {
    if (!this.storage) return null;
    if (this.behaviorEngine.checkBotStatus()) return null;

    const encrypted = this.storage.getItem(key);
    if (!encrypted) return null;

    const decrypted = this.decrypt(encrypted);
    try {
      return JSON.parse(decrypted) as T;
    } catch {
      return null;
    }
  }

  removeItem(key: string): void {
    this.storage?.removeItem(key);
  }

  clear(): void {
    this.storage?.clear();
  }

  isBotDetected(): boolean {
    return this.behaviorEngine.checkBotStatus();
  }
}
