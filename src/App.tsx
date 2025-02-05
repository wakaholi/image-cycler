import { useMemo, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";

import "./App.css";

type ImagePreview = {
  url: string;
  file: FileWithPath;
};

type ImageSlotProps = {
  index: number;
  image: ImagePreview | null;
  label: string;
  onDrop: (acceptedFiles: FileWithPath[], index: number) => void;
};

const ImageSlot: React.FC<ImageSlotProps> = ({
  index,
  image,
  label,
  onDrop,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles, index),
    accept: {
      "image/*": [],
    },
    maxFiles: 1, // 1枚の画像だけ受け付け
  });

  return (
    <div style={{ display: "inline-block", margin: "10px" }}>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #ccc",
          padding: "40px",
          textAlign: "center",
          cursor: "pointer",
          width: "480px",
          height: "120px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <input {...getInputProps()} />
        <p
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            fontFamily: "'Noto Sans JP', sans-serif",
            margin: 0,
            // marginBottom: "-2px",
            height: "64px",
            lineHeight: 0.89,
            border: index === 2 ? "solid 3px #dc143c" : "solid 3px black",
            color: "black",
          }}
        >
          {label}
        </p>{" "}
        {/* 画像の下にラベルを表示 */}
        {image ? (
          <img
            src={image.url}
            alt={`uploaded-${index}`}
            style={{
              width: "80%",
              height: "auto",
              aspectRatio: "6 / 1",
              objectFit: "cover",
            }}
          />
        ) : (
          <p style={{ color: "black" }}>画像をアップロード</p>
        )}
      </div>
    </div>
  );
};

function App() {
  const [images, setImages] = useState<(ImagePreview | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const disabled = useMemo(
    () => images.some((image) => image == null),
    [images]
  );

  // 画像がドロップされたときの処理
  const onDrop = (acceptedFiles: FileWithPath[], index: number) => {
    if (acceptedFiles.length > 0) {
      const newImages = [...images];
      newImages[index] = {
        url: URL.createObjectURL(acceptedFiles[0]),
        file: acceptedFiles[0],
      };
      setImages(newImages);
    }
  };

  // 前局（画像の順番を時計回りにローテーション）
  const handlePrev = () => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      const temp = newImages[0]; // 1番目の画像を一時的に保持
      newImages[0] = newImages[2]; // 1番目に3番目の画像を入れる
      newImages[2] = newImages[3]; // 3番目に4番目の画像を入れる
      newImages[3] = newImages[1]; // 4番目に2番目の画像を入れる
      newImages[1] = temp; // 2番目に元々の1番目の画像を入れる
      return newImages;
    });
  };

  // 次局（画像の順番を反時計回りにローテーション）
  const handleNext = () => {
    setImages((prevImages) => {
      const newImages = [...prevImages];
      const temp = newImages[0]; // 1番目の画像を一時的に保持
      newImages[0] = newImages[1]; // 1番目に2番目の画像を入れる
      newImages[1] = newImages[3]; // 2番目に4番目の画像を入れる
      newImages[3] = newImages[2]; // 4番目に3番目の画像を入れる
      newImages[2] = temp; // 3番目に元々の1番目の画像を入れる
      return newImages;
    });
  };

  return (
    <div>
      <div style={{ marginTop: "20px" }}>
        <button
          onClick={handlePrev}
          style={{ marginRight: "10px" }}
          disabled={disabled}
        >
          前局
        </button>
        <button onClick={handleNext} disabled={disabled}>
          次局
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "10px",
        }}
      >
        {images.map((image, index) => (
          <ImageSlot
            key={index}
            index={index}
            image={image}
            label={["北", "西", "東", "南"][index]} // ラベルを表示
            onDrop={onDrop}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
