import { useMemo } from 'react';
import qrcode from 'qrcode-generator';

export function TrackingQr({ value }) {
  const code = useMemo(() => {
    try {
      const qr = qrcode(0, 'M');
      qr.addData(value);
      qr.make();
      const modules = qr.getModuleCount();
      const cells = [];
      for (let row = 0; row < modules; row += 1) {
        for (let column = 0; column < modules; column += 1) {
          if (qr.isDark(row, column)) cells.push(`M${column + 4},${row + 4}h1v1h-1z`);
        }
      }
      return { size: modules + 8, path: cells.join('') };
    } catch {
      return null;
    }
  }, [value]);

  if (!code) {
    return <p role="status">This order is too large for a clear QR. Use “Open tracking preview” below.</p>;
  }

  return (
    <svg
      aria-label="Scan to track your demo order"
      className="tracking-qr"
      height={Math.max(320, code.size * 4)}
      role="img"
      shapeRendering="crispEdges"
      viewBox={`0 0 ${code.size} ${code.size}`}
      width={Math.max(320, code.size * 4)}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="white" height={code.size} width={code.size} />
      <path d={code.path} fill="black" />
    </svg>
  );
}
