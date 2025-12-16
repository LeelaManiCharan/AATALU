export default function GameCard({ title, onClick }) {
  return (
    <div className="card" onClick={onClick}>
      <h2>{title}</h2>
      <span>PLAY</span>
    </div>
  )
}
