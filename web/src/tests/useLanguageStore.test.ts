import { describe, it, expect } from 'vitest';
import { useLanguageStore } from '../stores/useLanguageStore';

describe('Web Zustand useLanguageStore', () => {
  it('should initialize with default ID language', () => {
    const { lang, t } = useLanguageStore.getState();
    expect(lang).toBe('ID');
    expect(t.goodMorning).toBe('Selamat Pagi,');
    expect(t.attendance).toBe('Absensi & Log');
  });

  it('should toggle language to EN and update translations', () => {
    useLanguageStore.getState().toggleLanguage();
    const { lang, t } = useLanguageStore.getState();
    expect(lang).toBe('EN');
    expect(t.goodMorning).toBe('Good Morning,');
    expect(t.attendance).toBe('Attendance & Logs');

    // Toggle back to ID
    useLanguageStore.getState().toggleLanguage();
    expect(useLanguageStore.getState().lang).toBe('ID');
  });
});
