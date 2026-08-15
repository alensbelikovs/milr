"use client"
import { useThree } from "@react-three/fiber"

const PADDING_X = 24
const COL_COUNT = 15
const GAP = 24

export function useGridColumns(span: number) {
    const size = useThree((state) => state.size)
    const factor = useThree((state) => state.viewport.factor)

    const contentWidth = size.width - PADDING_X * 2
    const colWidth = (contentWidth - GAP * (COL_COUNT - 1)) / COL_COUNT

    const widthPx = span * colWidth + GAP * (span - 1)

    return { width: widthPx / factor, gap: GAP / factor }
}
