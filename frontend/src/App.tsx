import Map from "./components/Map"

function App() {
  return (
    <div className="h-screen w-screen">
      <div className="w-full h-full">
        <div className="bg-gray-800 text-white p-4">
          <h1 className="text-2xl font-bold">React Leaflet</h1>
        </div>
        <Map />
      </div>
    </div>
  )
}

export default App
