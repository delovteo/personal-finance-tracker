import React from "react";

export default function SvgCategoryCloud({ transactions }) {
  const categoryTotals = {};

  transactions.forEach(({ category, amount }) => {
    const val = parseFloat(amount);
    if (!isNaN(val)) {
      categoryTotals[category] = (categoryTotals[category] || 0) + val;
    }
  });

  const categories = Object.keys(categoryTotals);
  const max = Math.max(...Object.values(categoryTotals));
  const colors = ["#facc15", "#34d399", "#60a5fa", "#f472b6", "#f87171"];

  const width = 500;
  const height = 250;
  const spacingX = 110;
  const spacingY = 60;

  return (
    <div style={{ marginTop: "2rem", textAlign: "center" }}>
      <h2>Spending Category Cloud (SVG)</h2>
      <svg width={width} height={height}>
        {categories.map((cat, index) => {
          const amount = categoryTotals[cat];
          const scale = 0.5 + (amount / max) * 1.5;
          const cx = (index % 4) * spacingX + 80;
          const cy = Math.floor(index / 4) * spacingY + 60;
          const fill = colors[index % colors.length];

          return (
            <g key={cat}>
              <ellipse cx={cx} cy={cy} rx={40 * scale} ry={20 * scale} fill={fill} />
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize={12 + scale * 4}
                fill="#111827"
                fontWeight="bold"
              >
                {cat}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
