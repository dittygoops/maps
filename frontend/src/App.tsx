import Map from "./components/Map"
import StadiaMap from "./components/StadiaMap"

function App() {
  return (
    <div className="h-screen w-screen">
      <div className="w-full h-full flex flex-col">
        <div className="bg-gray-800 text-white p-4">
          <h1 className="text-2xl font-bold">I WANT </h1>
        </div>
        <div className="flex-grow">
          <StadiaMap />
        </div>
      </div>
    </div>
  )
}

export default App
