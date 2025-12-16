import { useEffect, useState } from "react"
import GameCard from "./components/GameCard"
import BurgerStash from "./games/BurgerStash"
import PizzaRush from "./games/PizzaRush"
import CatSling from "./games/CatSling"

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

  /* GAME SCREENS */
  if (screen === "burger") {
    return <BurgerStash goHome={() => setScreen("home")} />
  }

  if (screen === "pizza") {
    return <PizzaRush goHome={() => setScreen("home")} />
  }

  if (screen === "cat") {
    return <CatSling goHome={() => setScreen("home")} />
  }

  /* HOME SCREEN */
  return (
    <div className="home">
      <h1>🎮 AATALU</h1>
      <p>Minimal arcade</p>

      <div className="grid">
        <GameCard
          title="🍔 Burger Stash"
          onClick={() => setScreen("burger")}
        />

        <GameCard
          title="🍕 Pizza Rush"
          onClick={() => setScreen("pizza")}
        />

        <GameCard
          title="🐱 Cat Sling"
          onClick={() => setScreen("cat")}
        />

        <GameCard title="Game 4" />
      </div>

      {/* FOOTER */}
      <div className="footer">
        Made with 🤍 from Vijayawada
      </div>
    </div>
  )
}
