"use client";

import { useSpaces } from "@/hooks/use-space";
import React from "react";

export default function SpacesPage() {
    const { dataSpacesAll } = useSpaces();
    console.log(dataSpacesAll);
    return <div>Ambientes</div>;
}
