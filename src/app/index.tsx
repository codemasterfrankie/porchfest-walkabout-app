import ComingSoonScreen from '../components/ComingSoonScreen';
import SeeYouNextYearScreen from '../components/SeeYouNextYearScreen';


// actual start and end date for ithaca porchfest 2026
const FESTIVAL_START = new Date('2026-09-20T12:00:00');
const FESTIVAL_END = new Date('2026-09-20T18:00:00');

export default function Index() {
  const now = new Date('2026-09-20T12:10:00');

  if (now < FESTIVAL_START) {
    return <ComingSoonScreen />;
  }

  if (now > FESTIVAL_END) {
    return <SeeYouNextYearScreen />;
  }

  return <ComingSoonScreen />;
}