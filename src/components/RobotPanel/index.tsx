import Scene from '../../three'
import MotorReadouts from './components/MotorReadouts'

export default function RobotPanel() {
  return (
    <section aria-label="Robot view" className="relative h-[500px] min-w-0 overflow-hidden rounded-lg border border-panel-border bg-surface/30 lg:h-auto lg:min-h-[500px] lg:flex-1">
      <MotorReadouts />
      <Scene />
    </section>
  )
}
