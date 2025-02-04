import QRCodeReact from "react-qr-code";

interface QRCodeProps {
  value: string;
  size?: number;
}

export const QRCode = ({ value, size = 256 }: QRCodeProps) => {
  return (
    <div className="p-4 bg-white rounded-lg">
      <QRCodeReact
        value={value}
        size={size}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        viewBox={`0 0 ${size} ${size}`}
      />
    </div>
  );
}; 