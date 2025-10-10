import Faq from "../../components/Faq";
import Hero from "../../components/Hero";
import HowToJoin from "../../components/HowToJoin";
import LeaderboardHighlights from "../../components/LeaderboardHighlights";
import UpcomingTournament from "../../components/UpcomingTournament";

const Home = () => {
  return (
    <div className="md:pt-[5rem]">
      <Hero />
      <UpcomingTournament />
      <LeaderboardHighlights />
      <HowToJoin />
      <Faq />
    </div>
  );
};

export default Home;
