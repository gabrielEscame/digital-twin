import Stats from './components/Stats'
import Charts from './components/Charts'
import RobotPanel from './components/RobotPanel'

function App() {
  return (
    <div className="min-h-screen bg-[#eaeaf5]">
      <div className="mx-auto max-w-[1600px] px-4 pb-8 lg:px-10">
        <header className="py-8 lg:py-10">
          <h1 className="text-2xl font-bold text-[#1C1D21]">Welcome Back</h1>
          <p className="text-[#8181A5]">to your account!</p>
        </header>

        <main className="grid gap-7 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-7">
            <Stats />
            <RobotPanel />
          </div>
          <Charts />
        </main>
      </div>
    </div>
  )
}

export default App
