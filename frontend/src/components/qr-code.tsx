import { useState } from "react";

export function QRCode() {
  const [qrCodeSvg] = useState<string>("");

  // useEffect(() => {
  //   const qrCode = new QRCodeStyling({
  //     width: 1000,
  //     height: 1000,
  //     type: "svg",
  //     data: url,
  //     // image: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
  //     dotsOptions: {
  //       color: "#4267b2",
  //       type: "classy-rounded",
  //     },
  //     backgroundOptions: {
  //       color: "#e9ebee",
  //     },
  //     imageOptions: {
  //       crossOrigin: "anonymous",
  //       margin: 20,
  //     },
  //   });

  //   qrCode.getRawData("webp").then((buffer) => {
  //     if (!buffer) return;
  //     console.log(url);
  //     setQrCodeSvg(url);
  //   });
  // }, [url]);

  // if (!qrCodeSvg) {
  //   return <div>Loading QR Code...</div>;
  // }

  return (
    <div>
      <img
        src={qrCodeSvg}
        alt="QR Code"
        width={300}
        height={300}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
}
