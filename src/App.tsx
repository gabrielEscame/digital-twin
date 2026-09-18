import Stats from 'components/Stats'
import Charts from 'components/Charts'
import RobotPanel from 'components/RobotPanel'

function App() {
  return (
    <div className="min-h-screen bg-app-bg">
      <div className="mx-auto max-w-[1600px] px-4 pb-8 lg:px-10">
        <header className="py-8 lg:py-10">
          <h1 className="text-2xl font-bold text-primary-text">Welcome Back</h1>
          <p className="text-muted-text">to your account!</p>
        </header>

        <main className="grid gap-dashboard-gap lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-dashboard-gap">
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
