declare module 'jspdf-autotable' {
  import jsPDF from 'jspdf';

  interface AutoTableOptions {
    startY?: number;
    margin?: { top?: number; left?: number; right?: number; bottom?: number };
    pageBreak?: 'auto' | 'avoid' | 'always';
    rowPageBreak?: 'auto' | 'avoid';
    tableWidth?: 'auto' | 'wrap' | number;
    showHead?: 'firstPage' | 'everyPage' | 'never';
    showFoot?: 'firstPage' | 'everyPage' | 'never';
    tableLineWidth?: number;
    tableLineColor?: number | number[];
    styles?: {
      font?: string;
      fontStyle?: 'normal' | 'bold' | 'italic' | 'bolditalic';
      fontSize?: number;
      cellPadding?: number;
      lineColor?: number | number[];
      lineWidth?: number;
      fillColor?: number | number[];
      textColor?: number | number[];
      halign?: 'left' | 'center' | 'right' | 'justify';
      valign?: 'top' | 'middle' | 'bottom';
      cellWidth?: 'auto' | 'wrap' | number;
      minCellHeight?: number;
    };
    headStyles?: any;
    bodyStyles?: any;
    footStyles?: any;
    alternateRowStyles?: any;
    columnStyles?: { [key: string]: any };
    head?: any[][];
    body?: any[][];
    foot?: any[][];
    theme?: 'striped' | 'grid' | 'plain';
  }

  interface jsPDFWithPlugin extends jsPDF {
    lastAutoTable: {
      finalY: number;
    };
    autoTable: (options: AutoTableOptions) => jsPDFWithPlugin;
  }

  const autoTable: (doc: jsPDF, options: AutoTableOptions) => jsPDFWithPlugin;
  export default autoTable;
}
