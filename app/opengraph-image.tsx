import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "WatchDecode";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type OpenGraphImageProps = {
  searchParams: Promise<{ title?: string }>;
};

export default async function OpenGraphImage({ searchParams }: OpenGraphImageProps) {
  const { title } = await searchParams;
  const heading = title ?? "Decoding watches for everyday buyers.";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#09090b",
          color: "#f4f4f5",
          padding: "64px",
        }}
      >
        <div style={{ fontSize: 32, color: "#a1a1aa", letterSpacing: 1.5 }}>WatchDecode</div>
        <div style={{ fontSize: 68, lineHeight: 1.1, maxWidth: "1000px", fontWeight: 700 }}>{heading}</div>
        <div style={{ fontSize: 26, color: "#d4d4d8" }}>watchdecode.com</div>
      </div>
    ),
    size,
  );
}
