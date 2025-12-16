import { useEffect, useState } from "react"
import GameCard from "./components/GameCard"
import BurgerStash from "./games/BurgerStash"

export default function App() {
  const [screen, setScreen] = useState("home")

  // Safari viewport fix
  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      )
    }
    setVH()
    window.addEventListener("resize", setVH)
    return () => window.removeEventListener("resize", setVH)
  }, [])

  if (screen === "burger") {
    return <BurgerStash goHome={() => setScreen("home")} />
  }

  return (
    <div className="home">
      <h1>🎮 AATALU</h1>
      <p>Minimal arcade</p>

      <div className="grid">
        <GameCard title="Burger Stash" onClick={() => setScreen("burger")} />
        <GameCard title="Game 2" />
        <GameCard title="Game 3" />
        <GameCard title="Game 4" />
      </div>
    </div>
  )
}
