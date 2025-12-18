import { HeroSlider } from '@components/home/HeroSlider';
import { ServicesOverview } from '@components/home/ServicesOverview';
import { FeaturedProducts } from '@components/home/FeaturedProducts';
import { FeaturedUsedBikes } from '@components/home/FeaturedUsedBikes';

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <ServicesOverview />
      <FeaturedProducts />
      <FeaturedUsedBikes />
    </div>
  );
}

import { HeroSlider } from '../components/home/HeroSlider';
import { ServicesOverview } from '../components/home/ServicesOverview';

export default function HomePage() {
  return (
    <div>
      <HeroSlider />
      <ServicesOverview />
    </div>
  );
}


