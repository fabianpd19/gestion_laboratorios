declare module 'jspdf' {
  export class jsPDF {
    constructor(options?: any);
    setFontSize(size: number): void;
    text(text: string, x: number, y: number): void;
    save(filename: string): void;
  }
}
