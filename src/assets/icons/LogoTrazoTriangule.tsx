import React, { SVGProps } from "react";

export const LogoTrazoTriangule = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={30}
        height={25}
        fill="none"
        {...props}
    >
        <path fill="#fff" d="M17.143.032h-4.286l12.857 24.926H30L17.143.032Z" />
        <path fill="#BE2126" d="m12.93 0 12.94 25H0L12.93 0Z" />
    </svg>
);
