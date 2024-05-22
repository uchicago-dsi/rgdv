const log = {
  "5/22": ["Added pie charts to reports", "Added changelog page", "Added other ancillary pages"],
  "5/21": [
    "Refactored and centralized report formatting",
    "Enhanced percentile scale for greater legibility",
    "Swapped 'score' scales to align with value conceptual meaning (eg. high segregation score is bad)",
  ],
} as const
export default function Page() {
  return (
    <div className="prose px-4">
      {Object.keys(log).map((date,i) => (
        <div key={i}>
          <h2>{date}</h2>
          <ul>
            {/* @ts-ignore */}
            {log[date].map((item,j) => (
              <li key={`${i}${j}`}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
