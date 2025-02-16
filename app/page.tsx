import Grid from '@/components/Grid'
import Hero from '@/components/Hero'
import RecentProjects from '@/components/RecentProjects'
import { FloatingNav } from '@/components/ui/FloatingNav'
import Footer from '@/components/ui/Footer'
import { navItems } from '@/data'
import { validatePositionData } from '@/utils/validateGeometry';

export default function Home() {
  // Example usage of validatePositionData
  const positionData = new Float32Array([/* some position data */]);
  validatePositionData(positionData);

  // Use validatedPositionData to create geometry
  // const geometry = new THREE.BufferGeometry();
  // geometry.setAttribute('position', new THREE.BufferAttribute(validatedPositionData, 3));

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems}/>
        <Hero />
        <Grid />
        <RecentProjects />
        <Footer />
      </div>
    </main>
  )
}
