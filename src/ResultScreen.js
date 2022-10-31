import React from 'react'

export default function ResultScreen({count, previewCount, formatNumber}) {
  return (
    <>
        <div className="calc__row calc__result-screen">
            <span className="calc__result">{count}</span>
            <span className="calc__preview">{(previewCount === undefined) ? previewCount : formatNumber(previewCount)}</span>
        </div>
    </>
  )
}
