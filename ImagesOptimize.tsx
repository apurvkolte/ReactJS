import Image, { ImageProps } from "next/image";

export default function ImagesOptimize({
    width,
    height,
    style,
    ...rest
}: ImageProps) {
    return (
        <Image
            {...rest}
            width={width || 3000}   // fallback if missing
            height={height || 2000} // fallback ratio ~3:2
            style={{
                width: "100%",
                height: "auto",
                ...style,
            }}
        />
    );
}
